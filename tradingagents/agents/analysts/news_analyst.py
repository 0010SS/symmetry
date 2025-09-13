from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder


def create_news_analyst(llm, toolkit):
    def news_analyst_node(state):
        current_date = state["trade_date"]
        ticker = state["company_of_interest"]

        # Tools configuration
        if toolkit.config.get("online_tools"):
            tools = [
                toolkit.get_global_news_openai,
                toolkit.get_google_news,
                toolkit.get_finnhub_news,
                toolkit.get_reddit_news,
                toolkit.get_shareholder_news,  # <-- new
            ]
        else:
            tools = [
                toolkit.get_finnhub_news,
                toolkit.get_reddit_news,
                toolkit.get_google_news,
                toolkit.get_shareholder_news,  # <-- new
            ]

        # Refined system prompt
        system_message = (
            "You are a professional **market news analyst** tasked with writing a "
            "structured, insightful report relevant for trading and macroeconomics.\n\n"

            "Your job is not just to summarize passively, but to **actively search with tools** "
            "for information at multiple levels:\n"
            "1. **Macroeconomic context**: monetary policy, FX, commodities, global risk.\n"
            "2. **Sector/industry trends**: major shifts, supply chains, regulations.\n"
            "3. **Company-specific events**: earnings, product launches, management changes.\n"
            "4. **Shareholder/ownership events**: insider transactions, 13D/G, large stake sales, activist positions.\n\n"

            "⚡ Important: Do not limit yourself only to these categories. If you find other "
            "news or signals that could influence markets (e.g., legal rulings, environmental shocks, "
            "technological breakthroughs, labor unrest, political changes), you must include them. You must have at least one insight that can't be found by human analysts.\n"
            "Always think beyond the obvious categories to avoid human bias. You must come up with one category that is not listed above.\n\n"

            "Guidelines:\n"
            "- Integrate data across multiple APIs (Finnhub, Google News, Reddit, shareholder news).\n"
            "- Provide **fine-grained analysis** with clear reasoning (e.g., numbers, % moves, magnitudes).\n"
            "- Prioritize materiality: highlight events that could realistically affect trading decisions.\n"
            "- Write in a **hierarchical structure** (macro → sector → company → shareholder → other).\n"
            "- Conclude with a section titled (\"## News Analyst Insights\") that contains a **Markdown table** "
            "that organizes key points (columns: Theme | Event | Date | Magnitude | Source | Takeaway) and a brief summary.\n"
            "- Avoid vague phrases like 'mixed signals'; always provide concrete, evidence-based insights.\n"
        )

        # Prompt template with placeholders
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You are a helpful AI assistant collaborating with other assistants. "
                    "You can call external tools to retrieve news and data. "
                    "Always use the tools when relevant to actively gather evidence. "
                    "If you cannot fully answer, leave space for another assistant to add. "
                    "Prefix a final decision with FINAL TRANSACTION PROPOSAL: **BUY/HOLD/SELL** "
                    "if a trading stance is reached.\n\n"
                    "You have access to the following tools: {tool_names}.\n\n"
                    "{system_message}\n"
                    "For your reference, today is {current_date}. "
                    "The company of interest is {ticker}."
                ),
                MessagesPlaceholder(variable_name="messages"),
            ]
        )

        # Inject values into the prompt
        prompt = prompt.partial(system_message=system_message)
        prompt = prompt.partial(tool_names=", ".join([tool.name for tool in tools]))
        prompt = prompt.partial(current_date=current_date)
        prompt = prompt.partial(ticker=ticker)

        # Bind tools to the chain
        chain = prompt | llm.bind_tools(tools)
        result = chain.invoke(state["messages"])

        report = result.content if len(result.tool_calls) == 0 else ""

        return {
            "messages": [result],
            "news_report": report,
        }

    return news_analyst_node
