# industry_fundamentals_analyst.py
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

def create_industry_fundamentals_analyst(llm, toolkit):
    """
    Industry Fundamentals Analyst
    - Calls toolkit.get_industry_fundamentals_openai(ticker, curr_date, look_back_days, weights_mode, top_n_per_etf)
    - Produces a concise, structured markdown report for a human trader.
    - Mirrors the layout & orchestration style of industry_social_media_analyst.
    """

    def industry_fundamentals_analyst_node(state):
        current_date = state["trade_date"]
        ticker = state["company_of_interest"]
        company_name = state.get("company_name", ticker)

        tools = [toolkit.get_industry_fundamentals_openai]
        tool_list = ", ".join([t.name for t in tools])

        # System plan mirrors your collaborator's structure but for fundamentals:
        system_message = (
            "You are a professional **Industry Fundamentals Analyst**. "
            "Be concise, numeric, and procedural. **You must call tools** before analyzing.\n\n"

            "Scope (default fundamentals window ends {current_date}):\n"
            f"- Target ticker: {company_name} ({ticker}). First, resolve the **primary industry/sector**. "
            "Then fetch **industry-level fundamentals** for a recent window (e.g., last 28–35 days for as-of alignment) "
            "using a **top-firms → weighted aggregation** approach (ETF weights preferred; fall back to float-cap, then equal).\n\n"

            "Plan:\n"
            "1) Use the **industry fundamentals tool** with: "
            "look_back_days=28, weights_mode='etf', top_n_per_etf=15. "
            "This should return: industry label, universe & weights, per-constituent metrics, and **aggregates** "
            "(flows-first composite + ratio weighted means).\n"
            "2) Validate coverage: n_names ≥ 5 and weights_sum≈1.0; if thin, add a brief coverage disclaimer.\n"
            "3) Build a **flows-first composite** panel (Revenue, EBITDA, EBIT, Net Income, CFO, Capex; margins; EV/EBITDA; FCF yield; Net Debt/EBITDA). "
            "Scale in $M/$B/$T; ratios to 1–2 decimals.\n"
            "4) Build a **ratio panel** from weighted_means (PE, PS, EV/EBITDA, FCF yield %, Dividend %, ROIC %, ROE %, margins %, "
            "asset turnover, interest coverage, Piotroski F). Use '—' for missing.\n"
            "5) Universe transparency: list top 8 constituents by weight with weight %, market cap, and 1–2 key metrics.\n"
            "6) Conclude with **Coverage & Notes** (universe source, ETFs used, method, exclusions, winsorization if any).\n\n"

            "Output requirements (tight prose; no recommendations):\n"
            "- **Executive summary** (3–5 bullets): industry label; method (ETF/cap/equal); N constituents; 1–2 highest-weight names; "
            "2–3 headline numbers (EV/EBITDA, FCF yield, net margin).\n"
            "- **Composite fundamentals (TTM/MRQ)**: bullet list of scaled levels and margins (flows-first). "
            "- **Valuation & returns panel**: compact bullets for PE, PS, EV/EBITDA, FCF yield %, Dividend %; ROIC %, ROE %; asset turnover, interest coverage.\n"
            "- **Top constituents (by weight)**: a short table of up to 8 tickers with Weight %, Mcap, EV/EBITDA (or PE), Net margin % (or ROIC %).\n"
            "- **Coverage & Notes**: universe source, ETFs, weights_sum, n_names, exclusions/warnings.\n"
            "- End with a section titled **\"## Industry Fundamentals Analyst Insights\"** containing a standardized Markdown table:\n"
            "  | Block | Metric | Value | Basis | Coverage | Takeaway |\n"
            "  Fill with 6–12 concise rows summarizing key takeaways (facts only)."
        )

        # Top-level orchestrator message (matches your collab's pattern)
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You are a helpful AI assistant collaborating with other assistants. "
                    "Use tools to actively gather evidence before analyzing. "
                    "If a final BUY/HOLD/SELL call is reached, prefix exactly: FINAL TRANSACTION PROPOSAL: **BUY/HOLD/SELL**.\n\n"
                    "Tools available: {tool_names}\n\n"
                    "{system_message}\n\n"
                    "Today is {current_date}. Target ticker: {ticker}."
                ),
                MessagesPlaceholder(variable_name="messages"),
            ]
        )

        prompt = prompt.partial(
            tool_names=tool_list,
            system_message=system_message,
            current_date=current_date,
            ticker=company_name,
        )

        # Bind the single tool and run (same chaining style as the social analyst)
        chain = prompt | llm.bind_tools(tools)
        result = chain.invoke(state["messages"])

        report = getattr(result, "content", "") or ""

        # Persist report to file (mirrors collaborator convention)
        with open(f"industry_fundamentals_report_{current_date}.md", "w") as f:
            f.write(report)
            f.write("\n\n")

        with open("output/analysts/industry_fundamentals.md", "w") as f:
            f.write(report)

        return {
            "messages": [result],
            "industry_fundamentals_report": report,
        }

    return industry_fundamentals_analyst_node
