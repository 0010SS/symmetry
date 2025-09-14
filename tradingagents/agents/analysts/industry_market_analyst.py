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
        # Add the ETF resolver (web search) so the model MUST call it first.
        if toolkit.config.get("online_tools"):
            tools = [
                toolkit.get_industry_etf_openai,                 # <— NEW: web-search ETF resolver (must be first call)
                toolkit.get_YFin_data_online,                 # fetch ETF CSV
                toolkit.get_stockstats_indicators_report_online,  # indicators from CSV
            ]
            resolver_tool_name = toolkit.get_industry_etf_openai.name
            yf_tool_name = toolkit.get_YFin_data_online.name
            indi_tool_name = toolkit.get_stockstats_indicators_report_online.name
        else:
            # Offline fallback: skip web resolver; the LLM should use a safe default (sector SPDR or SPY).
            tools = [
                toolkit.get_YFin_data,
                toolkit.get_stockstats_indicators_report,
            ]
            resolver_tool_name = "N/A (offline)"
            yf_tool_name = toolkit.get_YFin_data.name
            indi_tool_name = toolkit.get_stockstats_indicators_report.name

        indicator_cap = toolkit.config.get("indicator_cap", 6)

        # === System prompt (ETF resolve → lock → analyze) ===
        system_message = (
            "You are a professional **industry market & technical analyst**. "
            "Be concise, numeric, and procedural. Actively call tools to gather evidence before analyzing.\n\n"

            "Scope (default windows ending {current_date}):\n"
            f"- Target company: {company_name} ({ticker}). Analyze the **industry/sector** via a representative **ETF** (NOT the company ticker).\n"
            f"- YoY window: {yoy_start_date} → {current_date} (YoY & 52-week framing).\n"
            f"- MoM window: {mom_start_date} → {current_date} (1-month context).\n"
            f"- Seasonality window: {seasonality_start_date} → {current_date} (DEFAULT ON; current-month seasonality).\n\n"

            "Step 0 — **Resolve & lock the ETF (must be first)**:\n"
            f"- Call `{resolver_tool_name}` with (ticker={ticker}, curr_date={current_date}).\n"
            "- Parse the returned Markdown to extract ONE ETF ticker (e.g., SMH, SOXX, XLK). "
            "Set **ETF_SYMBOL = <that ticker>** and keep it fixed. Do **NOT** invent tickers. "
            "If the resolver yields multiple candidates, pick the most liquid subsector ETF; if still ambiguous, use the sector SPDR. "
            "If offline, default to an appropriate sector SPDR or **SPY** as last resort.\n\n"

            "Plan:\n"
            "1) **Fetch ETF price history** via the Yahoo tool for YoY/52W:\n"
            f"   - Call `{yf_tool_name}` with: symbol=ETF_SYMBOL, start_date={yoy_start_date}, end_date={current_date}.\n"
            "   - Compute: **YoY return** (latest vs ~1y ago, ±5 trading days, abs & %); **52-week high/low** and % distances.\n"
            "2) **MoM context**:\n"
            f"   - Call `{yf_tool_name}` AGAIN with: symbol=ETF_SYMBOL, start_date={mom_start_date}, end_date={current_date}.\n"
            "   - Compute **MoM return** (latest vs ~1 month ago, ±3 trading days, abs & %).\n"
            "3) **Seasonality (DEFAULT ON)**:\n"
            f"   - Call `{yf_tool_name}` AGAIN with: symbol=ETF_SYMBOL, start_date={seasonality_start_date}, end_date={current_date}.\n"
            "   - Compute **seasonality snapshot**: average return for the **current month** across N years; report N.\n"
            "4) **Relative strength vs SPY**:\n"
            f"   - Fetch SPY with `{yf_tool_name}` over {yoy_start_date} → {current_date}. "
            "Compute RS = ETF_close / SPY_close; summarize trend (rising/flat/falling) with start/mid/current values.\n"
            "5) **Indicators** (ETF only):\n"
            f"   - Call `{indi_tool_name}` on the ETF CSV; select up to {indicator_cap} complementary indicators (avoid redundancy). "
            "Use EXACT names: close_50_sma, close_200_sma, close_10_ema, macd, macds, macdh, rsi, boll, boll_ub, boll_lb, atr, vwma.\n"
            "6) Synthesize a brief, structured readout linking the industry regime to the company backdrop (descriptive only; no recommendations).\n\n"

            "Output requirements (numbers first, tight prose):\n"
            "- **Executive summary**: 3–5 bullets with chosen ETF & rationale, YoY (% & abs), MoM (% & abs), 52W positioning, RS vs SPY direction.\n"
            "- **Levels & regime**: 50/200-day state (above/below; cross), key S/R levels, distances.\n"
            "- **Momentum & volatility**: MACD/MACDS/MACDH setup, RSI regime, ATR/Bollinger context.\n"
            "- **Seasonality**: current-month avg return and N years.\n"
            f"- **Indicator panel (≤{indicator_cap})**: indicator → 1-line justification anchored to ETF data.\n"
            "- **Company linkage**: 2–4 bullets mapping sector regime to backdrop for the target company.\n"
            "- Conclude with a section titled (\"## Industry Market Analyst Insights\") containing a **Markdown table** "
            "(Theme | Metric/Signal | Value | Source/Tool | Takeaway), and a brief summary.\n\n"

            "⚡ Important: Do not limit yourself only to the listed categories. If you find other signals that could influence the industry "
            "(e.g., liquidity shifts, microstructure quirks, calendar effects, regime breaks), **include them**. "
            "You must **create at least one new category** (name it) based on observed data and provide **two non-obvious, evidence-backed insights**.\n\n"

            "Style & constraints:\n"
            "- Use concrete numbers (%, bps, distances, dates); avoid vague 'mixed'.\n"
            "- Keep reasoning implicit; do not reveal chain-of-thought—report results with brief rationale.\n"
            "- If data are thin or conflicting, state that explicitly and apply caution/confidence labels."
        )

        # Indicator crib (helps exact names)
        indicator_catalogue = (
            "Indicator quick notes: 50/200 SMA → trend/filters; 10 EMA → responsiveness; "
            "MACD/MACDS/MACDH → momentum/inflection; RSI → regime extremes; "
            "Boll/Boll_UB/Boll_LB → breakout/mean-reversion; ATR → volatility; VWMA → price×volume confirmation."
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

        # Optional: write to file for inspection
        try:
            with open(f"industry_market_report_{current_date}.md", "w") as f:
                f.write(report or "")
        except Exception:
            pass

        with open("output/analysts/industry_market.md", "w") as f:
            f.write(report)

        return {
            "messages": [result],
            "industry_market_report": report,
        }

    return industry_market_analyst_node
