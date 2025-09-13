from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from datetime import datetime, timedelta


def create_industry_market_analyst(llm, toolkit):
    def industry_market_analyst_node(state):
        current_date = state["trade_date"]          # 'YYYY-MM-DD'
        ticker = state["company_of_interest"]
        company_name = state.get("company_name", ticker)

        # === Dates ===
        dt_end = datetime.strptime(current_date, "%Y-%m-%d").date()
        yoy_start_date = (dt_end - timedelta(days=400)).isoformat()  # >365d buffer for holidays
        seasonality_years = toolkit.config.get("seasonality_years", 5)
        seasonality_start_date = (dt_end - timedelta(days=365 * seasonality_years + 60)).isoformat()
        # MoM comparison window (~21 trading days buffer)
        mom_start_date = (dt_end - timedelta(days=60)).isoformat()

        # === Tools ===
        if toolkit.config.get("online_tools"):
            tools = [
                toolkit.get_YFin_data_online,                     # MUST: fetch ETF CSV (YoY & MoM & Seasonality)
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

        # === System prompt (industry ETF focused; YoY, MoM, seasonality, RS vs SPY) ===
        system_message = (
            "You are a professional **industry market & technical analyst**. "
            "Be concise, numeric, and procedural. Actively call tools to gather evidence before analyzing.\n\n"

            "Scope (default windows ending {current_date}):\n"
            f"- Target company: {company_name} ({ticker}). Analyze the **industry/sector** context via a representative **ETF**.\n"
            f"- YoY window: {yoy_start_date} → {current_date} (for YoY & 52-week framing).\n"
            f"- MoM window: {mom_start_date} → {current_date} (for 1-month context).\n"
            f"- Seasonality window: {seasonality_start_date} → {current_date} (DEFAULT ON; current-month seasonality).\n\n"

            "ETF selection (resolve first):\n"
            "- Resolve the company’s **primary industry/sector** and select a representative, liquid ETF for that group. "
            "Prefer broad, well-tracked funds (examples; not exhaustive):\n"
            "  • Broad sectors: XLK (Tech), XLY (Cons Disc), XLP (Cons Staples), XLF (Financials), XLE (Energy), XLI (Industrials), "
            "XLV (Health Care), XLU (Utilities), XLB (Materials), XLC (Comm), XLRE (Real Estate)\n"
            "  • Common subsectors: SMH/SOXX (Semis), IGV (Software), XBI/IBB (Biotech), KRE/KBE (Banks), IYT (Transports)\n"
            "- If multiple fit, pick the **most representative & liquid**. If uncertain, prefer the sector SPDR.\n\n"

            "Plan:\n"
            "1) **Resolve ETF, then fetch ETF price history** via the Yahoo tool:\n"
            f"   - Call `{yf_tool_name}` with: symbol=<ETF>, start_date={yoy_start_date}, end_date={current_date}.\n"
            "   - Compute from these data:\n"
            "     • **YoY return**: latest close vs close near same calendar date last year (±5 trading days), absolute & %.\n"
            "     • **52-week high/low** and % distance from current close to each.\n"
            "2) **MoM context**:\n"
            f"   - Call `{yf_tool_name}` AGAIN with: symbol=<ETF>, start_date={mom_start_date}, end_date={current_date}.\n"
            "   - Compute **MoM return**: latest close vs close ~1 month ago (±3 trading days), absolute & %.\n"
            "3) **Seasonality (DEFAULT ON)**:\n"
            f"   - Call `{yf_tool_name}` AGAIN with: symbol=<ETF>, start_date={seasonality_start_date}, end_date={current_date}.\n"
            "   - Compute a **seasonality snapshot**: average return for the **current month** across years; include sample size (N years).\n"
            "4) **Relative strength vs SPY** (market beta context):\n"
            f"   - Fetch SPY with `{yf_tool_name}` over {yoy_start_date} → {current_date}. "
            "Compute a simple RS line = ETF_close / SPY_close. "
            "Report RS trend (rising/flat/falling) and a 3-point summary (start, mid, current values).\n"
            "5) **Indicators** (ETF only):\n"
            f"   - Call `{indi_tool_name}` on the ETF CSV and select up to {indicator_cap} complementary indicators (avoid redundancy). "
            "Use EXACT names: close_50_sma, close_200_sma, close_10_ema, macd, macds, macdh, rsi, boll, boll_ub, boll_lb, atr, vwma.\n"
            "6) Synthesize a brief, structured readout linking the industry regime to how the **company might be impacted** "
            "(e.g., if RS is rising for the sector, discuss tailwind vs headwind for the company—purely descriptive, no recommendations).\n\n"

            "Output requirements (numbers first, tight prose):\n"
            "- **Executive summary**: 3–5 bullets with ETF chosen & rationale, YoY (% & abs), MoM (% & abs), 52W positioning, RS vs SPY direction.\n"
            "- **Levels & regime**: 50/200-day state (above/below; cross); key S/R levels; distances.\n"
            "- **Momentum & volatility**: MACD/MACDS/MACDH setup, RSI regime, ATR/Bollinger context.\n"
            "- **Seasonality**: current-month avg return and N years.\n"
            f"- **Indicator panel (≤{indicator_cap})**: indicator → 1-line justification anchored to the ETF data.\n"
            "- **Company linkage**: 2–4 bullets mapping sector regime to likely backdrop for the target company (descriptive only).\n"
            "- Conclude with a section titled (\"## Industry Market Analyst Insights\") containing a **Markdown table** "
            "(Theme | Metric/Signal | Value | Source/Tool | Takeaway), and a brief summary.\n\n"

            "⚡ Important: Do not limit yourself only to the listed categories. If you find other signals that could influence the industry "
            "(e.g., liquidity shifts, market microstructure quirks, calendar effects, regime breaks), **include them**. "
            "You must **create at least one new category** (name it) based on observed data. "
            "Provide **at least two non-obvious, evidence-backed synthesis insights** that a typical summary might miss.\n\n"

            "Style & constraints:\n"
            "- Use concrete numbers (%, bps, distances, dates). Avoid vague terms like 'mixed'.\n"
            "- Keep reasoning implicit; do not reveal chain-of-thought—report results with brief rationale.\n"
            "- If data are thin or conflicting, state that explicitly and apply caution/confidence labels."
        )

        # Short indicator crib to help exact naming
        indicator_catalogue = (
            "Indicator quick notes: 50/200 SMA → trend/filters; 10 EMA → responsiveness; "
            "MACD/MACDS/MACDH → momentum/inflection; RSI → regime extremes; "
            "Boll/Boll_UB/Boll_LB → breakout/mean-reversion context; ATR → volatility/stop sizing; "
            "VWMA → price×volume confirmation."
        )

        # === Prompt wiring ===
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
                    "Today is {current_date}. Target company: {ticker}."
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

        # === Run ===
        chain = prompt | llm.bind_tools(tools)
        result = chain.invoke(state["messages"])

        report = ""
        if len(getattr(result, "tool_calls", []) or []) == 0:
            report = result.content

        # write to file
        with open(f"industry_market_report_{current_date}.md", "w") as f:
            f.write(report)

        return {
            "messages": [result],
            "industry_market_report": report,
        }

    return industry_market_analyst_node
