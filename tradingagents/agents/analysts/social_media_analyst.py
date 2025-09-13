from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder


def create_social_media_analyst(llm, toolkit):
    def social_media_analyst_node(state):
        current_date = state["trade_date"]
        ticker = state["company_of_interest"]
        company_name = state.get("company_name", ticker)

        # Tools: prefer the online aggregate; fall back to Reddit-only
        if toolkit.config.get("online_tools"):
            tools = [toolkit.get_stock_news_openai,
                     toolkit.get_reddit_stock_info]
            tool_list = ", ".join([tool.name for tool in tools])
        else:
            tools = [toolkit.get_reddit_stock_info]
            tool_list = ", ".join([tool.name for tool in tools])

        # --- Refined, bias-aware prompt (concise & procedural) ---
        system_message = (
            "You are a professional **social-media & company-news analyst**. "
            "Be concise, numeric, and procedural. Actively call tools to gather evidence before analyzing.\n\n"

            "Scope (default window: last 7 calendar days ending {current_date}):\n"
            f"- Target entity: {company_name} ({ticker}). Include obvious aliases/hashtags (e.g., '{ticker}', "
            f"'{company_name}', cashtags like '${ticker}').\n\n"

            "Plan:\n"
            "1) Retrieve social-media posts and recent headlines using the available tools. Collect for each item: "
            "timestamp, source/platform, author (if available), permalink/URL, and a short snippet/headline.\n"
            "2) Build a **daily timeline** with at least: total mentions per day, positive/negative/neutral counts "
            "(or a sentiment score if provided by the tool). If exact scores are unavailable, approximate with simple "
            "heuristics from the text and clearly label as heuristic.\n"
            "3) Identify **top narratives** (topic clusters): e.g., product rumors, guidance chatter, legal/regulatory, "
            "executive moves, supply-chain, competitive dynamics, pricing/promo, outages/incidents, and **Other/Emergent**. "
            "Do NOT restrict yourself to this list—surface any new/emergent themes to avoid human bias.\n"
            "4) Correlate **sentiment spikes** with specific headlines/threads (time alignment). Note whether stories are "
            "confirmed, unconfirmed, or speculative; include links. De-duplicate crossposts.\n"
            "5) Quality & risk checks: highlight brigading/bot-like behavior (sudden low-karma floods, copy-paste bursts), "
            "pump-and-dump patterns, coordinated timing, or unusually high repost ratios. Flag confidence (Low/Med/High).\n\n"

            "Output requirements (numbers first, tight prose):\n"
            "- **Executive summary**: 3–5 bullets with net sentiment direction (↑/↓/→), largest daily move, brightest/darkest narrative.\n"
            "- **Volume & sentiment timeline**: daily mentions and net sentiment; call out spikes and their top drivers (with links).\n"
            "- **Narratives & evidence**: brief bullets per narrative with representative links; label confirmed/rumor/speculative.\n"
            "- **Influence & quality**: notable accounts/threads, suspected coordination/bots (if any), and confidence.\n"
            "- **Actionable watchlist**: 3–6 one-liners (what to monitor next; include dates/events if known).\n"
            "- Conclude with a section titled (\"## Social Media Analyst Insights\") that contains a **Markdown table** that organizes key points "
            "(columns: Theme | Source/Platform | Date/Window | Metric | Value | Link | Confidence | Takeaway), and a brief summary.\n\n"

            "⚡ Important: Do not limit yourself only to these categories. If you find other "
            "sentiments or signals that could influence markets, you must include them. You must come up with one category that is not listed above."
            "Also, provide **at least two non-obvious, evidence-backed synthesis insights** that a typical summary might miss.\n\n"

            "Style & constraints:\n"
            "- Use concrete numbers (counts, % share of positive/negative if measurable). Avoid vague 'mixed' language.\n"
            "- Keep reasoning implicit; do not reveal chain-of-thought—report results only with brief rationale.\n"
            "- If data are thin or conflicting, state that explicitly and proceed with caution labels."
        )

        # Orchestrator wrapper with tool list and runtime context
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You are a helpful AI assistant collaborating with other assistants. "
                    "Use tools to actively gather evidence before analyzing. "
                    "If a final BUY/HOLD/SELL call is reached, prefix exactly: FINAL TRANSACTION PROPOSAL: **BUY/HOLD/SELL**.\n\n"
                    "Tools available: {tool_names}\n\n"
                    "{system_message}\n\n"
                    "Today is {current_date}. Target company: {ticker}."
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

        return {
            "messages": [result],
            "sentiment_report": report,
        }

    return social_media_analyst_node
