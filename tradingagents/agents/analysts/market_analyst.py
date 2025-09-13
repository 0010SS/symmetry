from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from datetime import datetime, timedelta


def create_market_analyst(llm, toolkit):
    def market_analyst_node(state):
        current_date = state["trade_date"]          # 'YYYY-MM-DD'
        ticker = state["company_of_interest"]
        company_name = state.get("company_name", ticker)

        # === Dates ===
        dt_end = datetime.strptime(current_date, "%Y-%m-%d").date()
        yoy_start_date = (dt_end - timedelta(days=400)).isoformat()  # buffer >365d for holidays
        # Seasonality default ON: 5-year window + buffer
        seasonality_years = toolkit.config.get("seasonality_years", 5)
        seasonality_start_date = (dt_end - timedelta(days=365 * seasonality_years + 60)).isoformat()

        # === Tools ===
        if toolkit.config.get("online_tools"):
            tools = [
                toolkit.get_YFin_data_online,               # MUST be called first (YoY)
                toolkit.get_stockstats_indicators_report_online,   # indicators from CSV
            ]
            yf_tool_name = toolkit.get_YFin_data_online.name
            indi_tool_name = toolkit.get_stockstats_indicators_report_online.name
        else:
            tools = [
                toolkit.get_YFin_data,
                toolkit.get_stockstats_indicators_report,
            ]
            yf_tool_name = toolkit.get_YFin_data.name
            indi_tool_name = toolkit.get_stockstats_indicators_report.name

        indicator_cap = toolkit.config.get("indicator_cap", 6)

        # === Compact, stepwise system prompt (YoY + Seasonality default) ===
        system_message = (
            "You are a professional **market & technical analyst**. "
            "Be concise, numeric, and procedural. Actively call tools to gather evidence before analyzing.\n\n"

            "Scope (default windows ending {current_date}):\n"
            f"- Target asset: {company_name} ({ticker}).\n"
            f"- YoY window: {yoy_start_date} → {current_date} (for YoY & 52-week framing).\n"
            f"- Seasonality window: {seasonality_start_date} → {current_date} (DEFAULT ON; for current-month seasonality).\n\n"

            "Plan:\n"
            "1) Retrieve price history via the Yahoo tool and compute baselines:\n"
            f"   - Call `{yf_tool_name}` with: symbol={ticker}, start_date={yoy_start_date}, end_date={current_date}.\n"
            "   - Compute: (a) **Year-over-Year (YoY) return** = latest close vs. close near same calendar date last year (±5 trading days), "
            "absolute & %; (b) **52-week high/low** and % distance from current close to each.\n"
            "2) Seasonality (DEFAULT ON):\n"
            f"   - Call `{yf_tool_name}` AGAIN with: symbol={ticker}, start_date={seasonality_start_date}, end_date={current_date}.\n"
            "   - Compute a **seasonality snapshot**: average return for the **current month** across the years in this window; "
            "report the sample size (N years).\n"
            "3) Indicators:\n"
            f"   - Call `{indi_tool_name}` on the fetched CSV and select up to {indicator_cap} complementary indicators (avoid redundancy). "
            "Use EXACT names: close_50_sma, close_200_sma, close_10_ema, macd, macds, macdh, rsi, boll, boll_ub, boll_lb, atr, vwma.\n"
            "4) Synthesize a brief, structured readout that ties regime/levels/momentum to concrete numbers.\n\n"

            "Output requirements (numbers first, tight prose):\n"
            "- **Executive summary**: 3–5 bullets with YoY (% & abs), 52W position (distance to high/low), dominant regime signals.\n"
            "- **Trend & levels**: 50/200-day state (e.g., above/below; crossovers), key supports/resistances, distances.\n"
            "- **Momentum & volatility**: MACD/MACDS/MACDH posture, RSI regime, ATR or band width context.\n"
            "- **Seasonality**: current-month avg return and N years used.\n"
            f"- **Indicator panel (≤{indicator_cap})**: indicator → 1-line justification anchored to the data.\n"
            "- **Scenarios/Risks**: 1–3 bullets with trigger levels and invalidation points.\n"
            "-  Conclude with a section titled (\"## Market Analyst Insights\") that contains a **Markdown table** "
            "(columns: Theme | Metric/Signal | Value | Source/Tool | Takeaway), and a brief summary.\n\n"

            "⚡ Important: Do not limit yourself only to the listed categories. If you find other signals that could influence markets "
            "(e.g., liquidity shifts, market microstructure quirks, calendar effects, regime breaks), **include them**. "
            "You must **create at least one new category** (name it) based on observed data. "
            "Also, provide **at least two non-obvious, evidence-backed synthesis insights** that a typical summary might miss.\n\n"


            "Style & constraints:\n"
            "- Use concrete numbers (%, bps, distances, dates). Avoid vague terms like 'mixed'.\n"
            "- Keep reasoning implicit; do not reveal chain-of-thought—report results with brief rationale.\n"
            "- If data are thin or conflicting, state that explicitly and apply caution/confidence labels."
        )

        indicator_catalogue = (
            "Indicator quick notes: 50/200 SMA → trend/filters; 10 EMA → responsiveness; "
            "MACD/MACDS/MACDH → momentum/inflection; RSI → regime extremes; "
            "Boll/Boll_UB/Boll_LB → breakout/mean-reversion context; ATR → volatility/stop sizing; "
            "VWMA → price×volume confirmation."
        )

        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You are a helpful AI assistant collaborating with other assistants. "
                    "Use tools to gather evidence first; then analyze. "
                    "If a final BUY/HOLD/SELL call is reached, prefix exactly: FINAL TRANSACTION PROPOSAL: **BUY/HOLD/SELL**.\n\n"
                    "Tools available: {tool_names}\n\n"
                    "{system_message}\n\n"
                    "Reference: {indicator_catalogue}\n\n"
                    "Today is {current_date}. Target: {ticker}."
                ),
                MessagesPlaceholder(variable_name="messages"),
            ]
        )

        prompt = prompt.partial(
            tool_names=", ".join([tool.name for tool in tools]),
            system_message=system_message,
            indicator_catalogue=indicator_catalogue,
            current_date=current_date,
            ticker=company_name,
        )

        chain = prompt | llm.bind_tools(tools)
        result = chain.invoke(state["messages"])

        report = ""
        if len(getattr(result, "tool_calls", []) or []) == 0:
            report = result.content

        return {
            "messages": [result],
            "market_report": report,
        }

    return market_analyst_node
