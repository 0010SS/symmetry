from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

def create_industry_cross_signals_analyst(llm, toolkit):
    def industry_cross_signals_analyst_node(state):
        current_date = state["trade_date"]
        ticker = state["company_of_interest"]
        company_name = state.get("company_name", ticker)

        tools = [toolkit.get_industry_cross_signals_openai]
        tool_list = ", ".join([t.name for t in tools])

        # --- Company–industry linkage & exposure-focused, stepwise prompt ---
        system_message = (
            "You are a professional **company–industry linkage analyst**. "
            "Be concise, numeric, and procedural. **Call tools first**, then analyze.\n\n"

            "Goal:\n"
            f"- Target: {company_name} ({ticker}). Assess how tightly the company co-moves with its benchmark/industry and "
            "how supplier/consumer/policy/ETF exposures could transmit industry shocks to the firm.\n\n"

            "Window:\n"
            f"- Default window: last 7 calendar days ending {{current_date}}. Use the tool's window exactly as provided.\n\n"

            "Plan:\n"
            "1) Use **get_cross_signals_openai** to fetch:\n"
            "   - Mathematical indices vs. chosen benchmark: company_return_pct, benchmark_return_pct, relative_strength_pct, "
            "     beta, corr, volatility_ann_pct, max_drawdown_pct (± optional CAPM abnormal).\n"
            "   - Exposure items (facts-only): input materials, suppliers, customers, geographic, policy/regulatory, ETF membership; "
            "     include metrics and links.\n"
            "2) Compute a **Linkage Score (0–100)** (report inputs & result):\n"
            "   - corr_score = ((corr + 1) / 2) * 100 (corr∈[-1,1]).\n"
            "   - beta_score = max(0, 100 - 50*abs(beta - 1)).\n"
            "   - exposure_score = min(100, (#exposure_items / 12) * 100).\n"
            "   - etf_adj = +min(10, ETF_weight_pct * 2) if any ETF weight known; else 0.\n"
            "   - Linkage Score = round(0.55*corr_score + 0.25*beta_score + 0.20*exposure_score + etf_adj), clipped to [0,100].\n"
            "3) Analyze **transmission pathways** with evidence:\n"
            "   - Supplier-side (input materials, supplier concentration, logistics/energy).\n"
            "   - Demand-side (customer/vertical/geographic dependence, channel/backlog).\n"
            "   - Policy/standards & ETF/index mechanics (rebalance/weight changes).\n"
            "4) Quality controls: prefer filings/ETF provider pages > major newswires > others; de-duplicate; flag thin/conflicting data. "
            "Assign **Confidence: Low/Med/High** to key claims.\n\n"

            "Output (numbers first, tight prose; facts-backed):\n"
            "- **Executive Summary**: 3–5 bullets with Linkage Score, corr/beta, relative_strength_pct, top 1–2 exposures.\n"
            "- **Linkage Quantification**: small table of math indices; show Linkage Score computation inputs and result.\n"
            "- **Supplier & Customer Exposure**: bullets citing items with metrics/links and confidence.\n"
            "- **Policy/ETF & Standards Hooks**: bullets with metrics/links.\n"
            "- **Risk Propagation Paths**: succinct cause→effect lines (e.g., 'wafer price +8% → COGS pressure unless hedged').\n"
            "- **Monitoring Triggers (Next 2–4 weeks)**: 3–6 bullets (dates/events if known).\n"
            "- Conclude with a section titled **'## Cross-Linkage Evidence Table'** containing a Markdown table "
            "(Exposure | Headline | Metric | Source | Date | Link | Confidence | Takeaway).\n\n"

            "⚡ Important: Do not limit yourself only to these categories. If you find other sentiments or signals that could influence markets, include them. "
            "You must **create at least one new category** that is not listed above. Provide **at least two non-obvious, evidence-backed synthesis insights** "
            "that a typical summary might miss.\n\n"

            "Constraints:\n"
            "- **No investment advice**; facts + measured analysis only. If data are thin or missing, say so and lower confidence.\n"
            "- Keep reasoning implicit (no chain-of-thought). Report results with brief rationale."
        )

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

        chain = prompt | llm.bind_tools(tools)
        result = chain.invoke(state["messages"])

        # If the model returned a final message (no downstream tool content),
        # capture it as the report content.
        report = ""
        if len(getattr(result, "tool_calls", []) or []) == 0:
            report = result.content

        with open("output/analysts/industry_cross_signals.md", "w") as f:
            f.write(report)

        return {
            "messages": [result],
            "industry_cross_signals_report": report,
        }

    return industry_cross_signals_analyst_node
