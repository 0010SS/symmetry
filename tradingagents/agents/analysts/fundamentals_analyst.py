from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
import time
import json


def create_fundamentals_analyst(llm, toolkit):
    def fundamentals_analyst_node(state):
        current_date = state["trade_date"]
        ticker = state["company_of_interest"]
        company_name = state["company_of_interest"]

        if toolkit.config["online_tools"]:
            tools = [toolkit.get_fundamentals_openai,
                    toolkit.get_capital_returns_news,
                    toolkit.get_ownership_structure_news,
                    toolkit.get_finnhub_company_insider_sentiment,
                    toolkit.get_finnhub_company_insider_transactions,
                    toolkit.get_simfin_balance_sheet,
                    toolkit.get_simfin_cashflow,
                    toolkit.get_simfin_income_stmt,
                    ]
        else:
            tools = [
                toolkit.get_finnhub_company_insider_sentiment,
                toolkit.get_finnhub_company_insider_transactions,
                toolkit.get_simfin_balance_sheet,
                toolkit.get_simfin_cashflow,
                toolkit.get_simfin_income_stmt,
            ]
        # (Optional) helpful for the prompt interpolation below:
        tool_names = ", ".join([getattr(t, "name", repr(t)) for t in tools])

        system_message = (
            "You are a fundamentals researcher generating a concise but comprehensive report to inform traders. "
            "ALWAYS call tools BEFORE writing. Use only tools listed in {tool_names}. Merge facts from tools into analysis—do not guess.\n\n"

            "DATA YOU CAN/SHOULD PULL (use only tools listed in {tool_names}):\n"
            "1) SimFin financials (STRUCTURED):\n"
            "   - get_simfin_income_stmt(ticker, freq='quarterly', curr_date)\n"
            "   - get_simfin_balance_sheet(ticker, freq='quarterly', curr_date)\n"
            "   - get_simfin_cashflow(ticker, freq='quarterly', curr_date)\n"
            "   Guidance: Use 'quarterly' for the freshest view; optionally call 'annual' to compare.\n"
            "2) Ownership & shareholder structure (STRUCTURED via web search parse):\n"
            "   - get_ownership_structure_news(ticker, curr_date, look_back_days=30) "
            "     (keys may include float_pct, institutional_pct, insider_pct, shares_outstanding, adr_ratio, "
            "     stake_pct, shares, usd_value, class_a_shares, class_b_shares, votes_per_a, votes_per_b)\n"
            "   - get_shareholder_news(ticker, curr_date, look_back_days=30) [if available in the tool list]\n"
            "3) Capital returns (STRUCTURED via web search parse):\n"
            "   - get_capital_returns_news(ticker, curr_date, look_back_days=365) "
            "     (e.g., dividend_per_share, yield_pct, ex_date_ts, record_date_ts, payable_date_ts, "
            "     buyback_auth_usd, buyback_pct_float, buyback_exec_usd)\n"
            "4) Insider flows (STRUCTURED):\n"
            "   - get_finnhub_company_insider_sentiment(ticker, curr_date)\n"
            "   - get_finnhub_company_insider_transactions(ticker, curr_date)\n"
            "5) Unstructured fundamentals snapshot (OPTIONAL):\n"
            "   - get_fundamentals_openai(ticker, curr_date) (use this only to enrich narrative; prefer structured tools above)\n\n"

            "TOOL CALLING RUBRIC:\n"
            "- For SimFin, set freq='quarterly' unless asked otherwise. If a tool returns empty or missing fields, say so explicitly and proceed.\n"
            "- For ownership and capital returns, use a wide enough look_back_days (e.g., 30–365) to capture the latest disclosures.\n\n"

            "ANALYSIS CHECKLIST (cover all; be specific, no hand-waving):\n"
            "A) Income Statement: revenue trend, gross margin, operating margin, EPS/NI—compare Y/Y and Q/Q when possible.\n"
            "B) Balance Sheet: liquidity (cash/current ratio/working capital), leverage (debt vs equity), changes in shares outstanding.\n"
            "C) Cash Flow: operating cash flow vs net income, free cash flow, capex intensity, dividend & buyback coverage.\n"
            "D) Capital Returns: dividend status (initiate/raise/cut, ex/record/payable dates, yield), buyback authorizations/execution/ASR size.\n"
            "E) Ownership Structure: free float %, institutional %, insider %, top holders (stake %/shares/$ if present), share classes & votes/share; "
            "   note any recent structural changes (follow-ons, splits, ADR ratio changes) found in sources.\n"
            "F) Insider Activity: summarize notable insider buys/sells and sentiment changes.\n\n"

            "IMPORTANT: Do not limit yourself only to these categories. If you find other signals that could influence trading decisions, include them in your analysis. "
            "Always think beyond the obvious categories to avoid human bias. You must come up with one category that is not listed above.\n\n"

            "WRITE-UP REQUIREMENTS:\n"
            "- Attribute facts to tool outputs implicitly; if data is missing, write 'No recent data in tool output' rather than guessing.\n"
            "- Keep the tone analytical and actionable (for traders). Avoid vague phrases like 'trends are mixed' without specifying metrics.\n"
            "- Finish with the TRADER INSIGHT BOARD table below (MANDATORY). Do NOT output the old numeric metrics table.\n\n"

            "TRADER INSIGHT BOARD (MANDATORY)\n"
            "At the end of the report, output ONE Markdown table that summarizes the insights the agent used.\n\n"
            "Columns (use headers verbatim):\n"
            "| Theme | Signal | Why It Matters | Evidence (from tools) | Timeframe | Confidence | Trade Lens | Risks / Offsets | Catalysts |\n"
            "Definitions & allowed values:\n"
            "- Theme (choose from; may repeat with distinct angles): "
            "RevenueTrajectory, MarginDirection, EarningsQuality(FCF vs NI), BalanceSheetRisk, "
            "Leverage/Refi, WorkingCapital, CapitalReturns(Dividends), CapitalReturns(Buybacks), "
            "OwnershipConcentration, ShareClass/Voting, InsiderFlowTilt, Guidance/Outlook, Regulatory/Litigation.\n"
            "- Signal: one of 'Bullish (↑)', 'Bearish (↓)', 'Neutral (→)', 'Uncertain (?)'.\n"
            "- Why It Matters: ≤18 words tying the theme to P&L/multiple/liquidity.\n"
            "- Evidence (from tools): name only the tools actually used (e.g., 'SimFin Q2FY25', 'OwnershipNews 2025-09-10', 'CapitalReturnNews 2025-08').\n"
            "- Timeframe: one of 'Days', 'Weeks', '1–2 Quarters', '3–6 Quarters'.\n"
            "- Confidence: High / Medium / Low (based on breadth/recency/consistency of tool outputs).\n"
            "- Trade Lens (pick 1–2): Earnings, Margin, Multiple, Liquidity/Flow, BalanceSheet, Event/Catalyst.\n"
            "- Risks / Offsets: one concise counterpoint line.\n"
            "- Catalysts: dated/anticipated events (e.g., 'Earnings 2025-10-28', 'Ex-Div 2025-11-05', 'Debt maturity Q1’26').\n"
            "- Include only rows grounded by tools you actually called; if evidence is thin, set Signal to 'Uncertain (?)' or omit the row.\n"
            "- Output ≤8 rows; prefer fewer, clearer rows over completeness.\n\n"
            "Output skeleton (fill; do not change headers):\n"
            "### Trader Insight Board\n\n"
            "| Theme | Signal | Why It Matters | Evidence (from tools) | Timeframe | Confidence | Trade Lens | Risks / Offsets | Catalysts |\n"
            "|---|---|---|---|---|---|---|---|---|\n"
            "# Generate 4–8 rows BELOW this line, grounded ONLY in tools you called. "
            "# Do not copy any example rows. Determine 'Signal' per evidence; if unclear, use 'Uncertain (?)'.\n"

        


        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You are a helpful AI assistant, collaborating with other assistants."
                    " Use the provided tools to progress towards answering the question."
                    " If you are unable to fully answer, that's OK; another assistant with different tools"
                    " will help where you left off. Execute what you can to make progress."
                    " If you or any other assistant has the FINAL TRANSACTION PROPOSAL: **BUY/HOLD/SELL** or deliverable,"
                    " prefix your response with FINAL TRANSACTION PROPOSAL: **BUY/HOLD/SELL** so the team knows to stop."
                    " You have access to the following tools: {tool_names}.\n{system_message}"
                    "For your reference, the current date is {current_date}. The company we want to look at is {ticker}",
                ),
                MessagesPlaceholder(variable_name="messages"),
            ]
        )

        prompt = prompt.partial(system_message=system_message)
        prompt = prompt.partial(tool_names=", ".join([tool.name for tool in tools]))
        prompt = prompt.partial(current_date=current_date)
        prompt = prompt.partial(ticker=ticker)

        chain = prompt | llm.bind_tools(tools)

        result = chain.invoke(state["messages"])

        report = ""

        if len(result.tool_calls) == 0:
            report = result.content

        return {
            "messages": [result],
            "fundamentals_report": report,
        }

    return fundamentals_analyst_node
