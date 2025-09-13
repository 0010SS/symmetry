from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder


def create_industry_social_analyst(llm, toolkit):
    def industry_social_analyst_node(state):
        current_date = state["trade_date"]
        ticker = state["company_of_interest"]
        company_name = state.get("company_name", ticker)

        tools = [toolkit.get_industry_social_news_openai]
        tool_list = ", ".join([t.name for t in tools])

        # --- Industry-focused, bias-aware, stepwise prompt (aligned to your style) ---
        system_message = (
            "You are a professional **industry social-media & news analyst**. "
            "Be concise, numeric, and procedural. Actively call tools to gather evidence before analyzing.\n\n"

            "Scope (default window: last 7 calendar days ending {current_date}):\n"
            f"- Target ticker: {company_name} ({ticker}). First, resolve the **primary industry/sector** for this ticker. "
            "Analyze **industry-level** social-media/news signals (cross-company narratives are good). Include relevant aliases/hashtags "
            "(industry names, sector labels, peer tickers, and common hashtags).\n\n"

            "Plan:\n"
            "1) Use the **industry social news tool** to: (a) resolve the industry/sector, and (b) harvest **industry-level social-media items**. "
            "Collect for each item: timestamp, platform/source, permalink/URL, headline/snippet, engagement numbers if available.\n"
            "2) Build a **daily timeline** and extract per-item **sentiment** (positive/negative/neutral, with optional score). "
            "Produce a **window-level** sentiment roll-up (positive/negative/neutral counts; optional net score in [-1,1]).\n"
            "3) Identify **top narratives** (topic clusters): regulation/policy, supply chain, technology shifts, pricing power, labor/unions, "
            "competition, capex, ESG, and **Other/Emergent**. Do NOT restrict yourself to this list—surface new themes to avoid human bias.\n"
            "4) Correlate **sentiment spikes** with specific threads/headlines. Note confirmed vs. rumor/speculative; include links. De-duplicate crossposts.\n"
            "5) Quality & risk checks: flag brigading/bots (sudden low-karma floods, copy-paste bursts), coordinated timing, or unusually high repost ratios. "
            "Assign **Confidence: Low/Med/High** to key claims.\n\n"

            "Output requirements (numbers first, tight prose):\n"
            "- **Executive summary**: 3–5 bullets with the **window summary** theme (≤28 words), net sentiment direction (↑/↓/→), "
            "largest daily move, and brightest/darkest narrative.\n"
            "- **Volume & sentiment timeline**: daily mentions and net sentiment; call out spikes and drivers (with links).\n"
            "- **Narratives & evidence**: bullets per narrative with representative links; mark confirmed/rumor/speculative; add confidence.\n"
            "- **Window sentiment roll-up**: positive/negative/neutral counts (and net score if available) with 1–2 takeaways.\n"
            "- **Actionable watchlist**: 3–6 one-liners (what to monitor next; dates/events if known).\n"
            "- Conclude with a section titled (\"## Industry Social Analyst Insights\") that contains a **Markdown table** "
            "(columns: Theme | Platform | Source | Date/Window | Metric | Value | Link | Confidence | Takeaway), and a brief summary.\n\n"

            "⚡ Important: Do not limit yourself only to these categories. If you find other sentiments or signals that could influence markets, include them. "
            "You must **create at least one new category** that is not listed above. Provide **at least two non-obvious, evidence-backed synthesis insights** "
            "that a typical summary might miss.\n\n"

            "Style & constraints:\n"
            "- Use concrete numbers (counts, % shares) when measurable; avoid vague 'mixed' language.\n"
            "- Keep reasoning implicit; do not reveal chain-of-thought—report results only with brief rationale.\n"
            "- If data are thin or conflicting, state that explicitly and proceed with caution/confidence labels."
        )

        # Orchestrator with tool list and context
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

        report = ""
        if len(getattr(result, "tool_calls", []) or []) == 0:
            report = result.content

        # Store the md file
        with open(f"industry_social_sentiment_report_{current_date}.md", "w") as f:
            f.write(report)
            f.write("\n\n")

        return {
            "messages": [result],
            "industry_sentiment_report": report,
        }
        

    return industry_social_analyst_node
