from .reddit_utils import fetch_top_from_category
from .yfin_utils import *
from .stockstats_utils import *
from .googlenews_utils import *
from .finnhub_utils import get_data_in_range
from dateutil.relativedelta import relativedelta
from concurrent.futures import ThreadPoolExecutor
import json
import os
import pandas as pd
from tqdm import tqdm
import yfinance as yf
from openai import OpenAI
from .config import get_config, set_config, DATA_DIR
from tradingagents.dataflows.data_models import *
import os
import json
from datetime import datetime, timedelta, timezone
from typing import Annotated, Dict, Any, List
from openai import OpenAI

# Expected: OPENAI_API_KEY in env
# Docs: Responses API + web_search tool
# https://platform.openai.com/docs/api-reference/responses
# https://platform.openai.com/docs/guides/tools-web-search

def get_capital_returns_news(
    ticker: Annotated[str, "Company ticker, e.g., 'AAPL', 'TSM'"],
    curr_date: Annotated[str, "Current date in yyyy-mm-dd format"],
    look_back_days: Annotated[int, "How many days to look back"],
) -> Dict[str, Any]:
    """
    Fetch dividend & buyback (capital returns) news via OpenAI Responses API web_search tool.

    Returns a dict:
    {
      "ticker": "...",
      "from_date": "YYYY-MM-DD",
      "to_date": "YYYY-MM-DD",
      "items": [
        {
          "headline": "...",
          "source": "...",
          "numbers": {
            "dividend_per_share": 0.25,
            "yield_pct": 1.8,
            "record_date_ts": 1718064000,
            "ex_date_ts": 1717891200,
            "payable_date_ts": 1719446400,
            "buyback_auth_usd": 5.0e9,
            "buyback_pct_float": 2.1
          }
        },
        ...
      ]
    }

    Notes:
    - Facts-only extraction; dedupe near-duplicates.
    - Focus on dividends (initiation/raise/cut/suspend; ex/record/payable dates) and buybacks (new/expanded authorizations, ASRs, completions).
    """
    # --- dates ---
    to_dt = datetime.strptime(curr_date, "%Y-%m-%d").replace(tzinfo=timezone.utc)
    from_dt = to_dt - timedelta(days=int(look_back_days))
    from_date = from_dt.date().isoformat()
    to_date = to_dt.date().isoformat()

    # --- OpenAI setup ---
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    system_instructions = (
        "You are a news extraction agent. Use the web_search tool to collect CAPITAL "
        "RETURNS events (dividends & buybacks) for the specified ticker within the date window. "
        "Return JSON matching the provided schema; extract facts only from headlines/snippets/articles."
    )

    search_directives = (
        f"Ticker: {ticker}\n"
        f"Window: {from_date} to {to_date} (inclusive)\n\n"
        "Include only dividends & buybacks:\n"
        "- Dividend: initiation, increase, decrease, suspension; per-share amount; ex-date; record date; payable date; stated/approx yield.\n"
        "- Buyback: new or expanded authorizations (USD size, % float if stated, duration/expiry), accelerated share repurchases (ASR), completion updates.\n"
        "- Special dividends (amount, timing).\n\n"
        "For each distinct event (dedupe near-duplicates):\n"
        "- headline (plain), source (domain/site), numbers: extract any available metrics.\n"
        "- Use keys: dividend_per_share, yield_pct, record_date_ts, ex_date_ts, payable_date_ts, buyback_auth_usd, buyback_pct_float, buyback_exec_usd.\n"
        "- Convert known dates to UNIX seconds if present; leave missing fields out.\n"
        "Do not add opinions, predictions, or recommendations."
    )

    resp = client.responses.parse(
        model="gpt-5-nano",
        instructions=system_instructions,
        input=search_directives,
        tools=[{"type": "web_search"}],
        text_format=CapitalReturnNews,
    )

    parsed: CapitalReturnNews = resp.output_parsed
    return parsed.dict()

def get_ownership_structure_news(
    ticker: Annotated[str, "Company ticker, e.g. 'AAPL', 'TSM'"],
    curr_date: Annotated[str, "Current date in yyyy-mm-dd format"],
    look_back_days: Annotated[int, "How many days to look back"],
) -> Dict[str, Any]:
    """
    Fetch an ownership-structure snapshot via OpenAI Responses API web_search tool.

    Returns a dict:
    {
      "ticker": "...",
      "from_date": "YYYY-MM-DD",
      "to_date": "YYYY-MM-DD",
      "items": [
        {"headline": "Ownership snapshot as of 2025-09-10", "source": "example.com",
         "numbers": {"float_pct": 86.2, "institutional_pct": 70.4, "insider_pct": 1.1, "shares_outstanding": 1.57e10}},
        {"headline": "BlackRock top holder", "source": "example.com",
         "numbers": {"stake_pct": 7.6, "shares": 1.23e9, "usd_value": 2.5e10}},
        {"headline": "Share classes", "source": "example.com",
         "numbers": {"class_a_shares": 1.0e9, "class_b_shares": 0.2e9, "votes_per_a": 1.0, "votes_per_b": 10.0}},
        ...
      ]
    }

    Notes:
    - Facts only (no recommendations).
    - Prefer the most recent snapshot and clearly-labeled sources within the time window.
    """
    # --- dates ---
    to_dt = datetime.strptime(curr_date, "%Y-%m-%d").replace(tzinfo=timezone.utc)
    from_dt = to_dt - timedelta(days=int(look_back_days))
    from_date = from_dt.date().isoformat()
    to_date = to_dt.date().isoformat()

    # --- OpenAI setup ---
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    system_instructions = (
        "You are a news/data extraction agent. Use the web_search tool to compile an "
        "OWNERSHIP STRUCTURE snapshot for the specified ticker within the given window. "
        "Extract ONLY facts from headlines/snippets/articles and return JSON matching the schema."
    )

    search_directives = (
        f"Ticker: {ticker}\n"
        f"Window: {from_date} to {to_date} (inclusive)\n\n"
        "Collect:\n"
        "- Snapshot metrics: free float %, institutional %, insider %, shares outstanding, ADR ratio if stated.\n"
        "- Top holders with stake % and/or shares and (if present) USD value; include notable insiders.\n"
        "- Share classes and voting structure if cited; report share counts and votes/share when available.\n"
        "- Any recent structural changes affecting float or share classes.\n\n"
        "For each fact, emit an item with:\n"
        "- headline (plain, concise), source (domain/site), numbers (dict of key metrics).\n"
        "Keys to prefer in numbers: float_pct, institutional_pct, insider_pct, shares_outstanding, adr_ratio,\n"
        "stake_pct, shares, usd_value, class_a_shares, class_b_shares, votes_per_a, votes_per_b.\n"
        "Deduplicate near-duplicates. No analysis, predictions, or recommendations."
    )

    resp = client.responses.parse(
        model="gpt-5-nano",
        instructions=system_instructions,
        input=search_directives,
        tools=[{"type": "web_search"}],
        text_format=OwnershipNews,
    )

    parsed: OwnershipNews = resp.output_parsed
    return parsed.dict()


def get_shareholder_news(
    ticker: Annotated[str, "Search query of a company's, e.g. 'AAPL, TSM, etc.'"],
    curr_date: Annotated[str, "Current date in yyyy-mm-dd format"],
    look_back_days: Annotated[int, "How many days to look back"],
) -> Dict[str, Any]:
    """
    Fetch shareholder-centric news via OpenAI Responses API web_search tool.

    Returns a dict:
    {
      "ticker": "...",
      "from_date": "YYYY-MM-DD",
      "to_date": "YYYY-MM-DD",
      "items": [
        {
          "headline": "...",
          "source": "...",
          "numbers": {"stake_pct": 9.9, "shares": 1234567, "usd_value": 12.34e6}
        },
        ...
      ]
    }

    Notes:
    - This function is a data provider only (no judgments, no recommendations).
    - It relies on headlines/snippets and linked articles; it does not compute fundamentals.
    - Requires an API key in OPENAI_API_KEY.
    """
    # --- dates ---
    to_dt = datetime.strptime(curr_date, "%Y-%m-%d").replace(tzinfo=timezone.utc)
    from_dt = to_dt - timedelta(days=int(look_back_days))
    from_date = from_dt.date().isoformat()
    to_date = to_dt.date().isoformat()

    # --- OpenAI setup ---
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    # Guidance for the model (facts-only extraction)
    system_instructions = (
        "You are a news extraction agent. Use the web_search tool to gather shareholder-"
        "centric news for the specified ticker within the date window. Extract only "
        "facts from headlines and linked articles (no opinions). Return JSON matching "
        "the provided schema. If an item does not clearly relate to shareholders or ownership, "
        "exclude it."
    )

    # Search directives (the model will run multiple searches)
    search_directives = (
        f"Ticker: {ticker}\n"
        f"Window: {from_date} to {to_date} (inclusive)\n\n"
        "Focus only on shareholder/ownership-related items:\n"
        "- 13D/13G (beneficial ownership >5%) and amendments\n"
        "- 13F (institutional positions; mention with date if found)\n"
        "- Insider transactions (Forms 3/4/5), officer/director buys/sells\n"
        "- Activist stakes, tender offers, buybacks, secondary/follow-on offerings\n"
        "- Block trades, lock-up expirations, PIPE/convertible deals\n"
        "- Share class/structure changes, stock splits/reverse splits, ADR ratio changes\n"
        "- Dual listing/delisting that affects float/ownership\n\n"
        "For each relevant article or press release:\n"
        "- Keep one entry per distinct event (dedupe near-duplicates).\n"
        "- Extract numbers in headlines/snippets when present (stake %, shares, $ value).\n"
        "- Keep notes neutral and brief (one sentence max).\n"
        "- Include source name.\n\n"
        "Do not include analysis, predictions, or recommendations."
    )

    resp = client.responses.parse(
        model="gpt-5-nano",
        instructions=system_instructions,
        input=search_directives,
        tools=[{"type": "web_search"}],
        text_format=ShareholderNews,
    )

    parsed: ShareholderNews = resp.output_parsed

    # Convert to dict for return
    return parsed.model_dump()


def get_finnhub_news(
    ticker: Annotated[
        str,
        "Search query of a company's, e.g. 'AAPL, TSM, etc.",
    ],
    curr_date: Annotated[str, "Current date in yyyy-mm-dd format"],
    look_back_days: Annotated[int, "how many days to look back"],
):
    """
    Retrieve news about a company within a time frame

    Args
        ticker (str): ticker for the company you are interested in
        start_date (str): Start date in yyyy-mm-dd format
        end_date (str): End date in yyyy-mm-dd format
    Returns
        str: dataframe containing the news of the company in the time frame

    """

    start_date = datetime.strptime(curr_date, "%Y-%m-%d")
    before = start_date - relativedelta(days=look_back_days)
    before = before.strftime("%Y-%m-%d")

    result = get_data_in_range(ticker, before, curr_date, "news_data", DATA_DIR)

    if len(result) == 0:
        return ""

    combined_result = ""
    for day, data in result.items():
        if len(data) == 0:
            continue
        for entry in data:
            current_news = (
                "### " + entry["headline"] + f" ({day})" + "\n" + entry["summary"]
            )
            combined_result += current_news + "\n\n"

    return f"## {ticker} News, from {before} to {curr_date}:\n" + str(combined_result)


def get_finnhub_company_insider_sentiment(
    ticker: Annotated[str, "ticker symbol for the company"],
    curr_date: Annotated[
        str,
        "current date of you are trading at, yyyy-mm-dd",
    ],
    look_back_days: Annotated[int, "number of days to look back"],
):
    """
    Retrieve insider sentiment about a company (retrieved from public SEC information) for the past 15 days
    Args:
        ticker (str): ticker symbol of the company
        curr_date (str): current date you are trading on, yyyy-mm-dd
    Returns:
        str: a report of the sentiment in the past 15 days starting at curr_date
    """

    date_obj = datetime.strptime(curr_date, "%Y-%m-%d")
    before = date_obj - relativedelta(days=look_back_days)
    before = before.strftime("%Y-%m-%d")

    data = get_data_in_range(ticker, before, curr_date, "insider_senti", DATA_DIR)

    if len(data) == 0:
        return ""

    result_str = ""
    seen_dicts = []
    for date, senti_list in data.items():
        for entry in senti_list:
            if entry not in seen_dicts:
                result_str += f"### {entry['year']}-{entry['month']}:\nChange: {entry['change']}\nMonthly Share Purchase Ratio: {entry['mspr']}\n\n"
                seen_dicts.append(entry)

    return (
        f"## {ticker} Insider Sentiment Data for {before} to {curr_date}:\n"
        + result_str
        + "The change field refers to the net buying/selling from all insiders' transactions. The mspr field refers to monthly share purchase ratio."
    )


def get_finnhub_company_insider_transactions(
    ticker: Annotated[str, "ticker symbol"],
    curr_date: Annotated[
        str,
        "current date you are trading at, yyyy-mm-dd",
    ],
    look_back_days: Annotated[int, "how many days to look back"],
):
    """
    Retrieve insider transcaction information about a company (retrieved from public SEC information) for the past 15 days
    Args:
        ticker (str): ticker symbol of the company
        curr_date (str): current date you are trading at, yyyy-mm-dd
    Returns:
        str: a report of the company's insider transaction/trading informtaion in the past 15 days
    """

    date_obj = datetime.strptime(curr_date, "%Y-%m-%d")
    before = date_obj - relativedelta(days=look_back_days)
    before = before.strftime("%Y-%m-%d")

    data = get_data_in_range(ticker, before, curr_date, "insider_trans", DATA_DIR)

    if len(data) == 0:
        return ""

    result_str = ""

    seen_dicts = []
    for date, senti_list in data.items():
        for entry in senti_list:
            if entry not in seen_dicts:
                result_str += f"### Filing Date: {entry['filingDate']}, {entry['name']}:\nChange:{entry['change']}\nShares: {entry['share']}\nTransaction Price: {entry['transactionPrice']}\nTransaction Code: {entry['transactionCode']}\n\n"
                seen_dicts.append(entry)

    return (
        f"## {ticker} insider transactions from {before} to {curr_date}:\n"
        + result_str
        + "The change field reflects the variation in share count—here a negative number indicates a reduction in holdings—while share specifies the total number of shares involved. The transactionPrice denotes the per-share price at which the trade was executed, and transactionDate marks when the transaction occurred. The name field identifies the insider making the trade, and transactionCode (e.g., S for sale) clarifies the nature of the transaction. FilingDate records when the transaction was officially reported, and the unique id links to the specific SEC filing, as indicated by the source. Additionally, the symbol ties the transaction to a particular company, isDerivative flags whether the trade involves derivative securities, and currency notes the currency context of the transaction."
    )


def get_simfin_balance_sheet(
    ticker: Annotated[str, "ticker symbol"],
    freq: Annotated[
        str,
        "reporting frequency of the company's financial history: annual / quarterly",
    ],
    curr_date: Annotated[str, "current date you are trading at, yyyy-mm-dd"],
):
    data_path = os.path.join(
        DATA_DIR,
        "fundamental_data",
        "simfin_data_all",
        "balance_sheet",
        "companies",
        "us",
        f"us-balance-{freq}.csv",
    )
    df = pd.read_csv(data_path, sep=";")

    # Convert date strings to datetime objects and remove any time components
    df["Report Date"] = pd.to_datetime(df["Report Date"], utc=True).dt.normalize()
    df["Publish Date"] = pd.to_datetime(df["Publish Date"], utc=True).dt.normalize()

    # Convert the current date to datetime and normalize
    curr_date_dt = pd.to_datetime(curr_date, utc=True).normalize()

    # Filter the DataFrame for the given ticker and for reports that were published on or before the current date
    filtered_df = df[(df["Ticker"] == ticker) & (df["Publish Date"] <= curr_date_dt)]

    # Check if there are any available reports; if not, return a notification
    if filtered_df.empty:
        print("No balance sheet available before the given current date.")
        return ""

    # Get the most recent balance sheet by selecting the row with the latest Publish Date
    latest_balance_sheet = filtered_df.loc[filtered_df["Publish Date"].idxmax()]

    # drop the SimFinID column
    latest_balance_sheet = latest_balance_sheet.drop("SimFinId")

    return (
        f"## {freq} balance sheet for {ticker} released on {str(latest_balance_sheet['Publish Date'])[0:10]}: \n"
        + str(latest_balance_sheet)
        + "\n\nThis includes metadata like reporting dates and currency, share details, and a breakdown of assets, liabilities, and equity. Assets are grouped as current (liquid items like cash and receivables) and noncurrent (long-term investments and property). Liabilities are split between short-term obligations and long-term debts, while equity reflects shareholder funds such as paid-in capital and retained earnings. Together, these components ensure that total assets equal the sum of liabilities and equity."
    )


def get_simfin_cashflow(
    ticker: Annotated[str, "ticker symbol"],
    freq: Annotated[
        str,
        "reporting frequency of the company's financial history: annual / quarterly",
    ],
    curr_date: Annotated[str, "current date you are trading at, yyyy-mm-dd"],
):
    data_path = os.path.join(
        DATA_DIR,
        "fundamental_data",
        "simfin_data_all",
        "cash_flow",
        "companies",
        "us",
        f"us-cashflow-{freq}.csv",
    )
    df = pd.read_csv(data_path, sep=";")

    # Convert date strings to datetime objects and remove any time components
    df["Report Date"] = pd.to_datetime(df["Report Date"], utc=True).dt.normalize()
    df["Publish Date"] = pd.to_datetime(df["Publish Date"], utc=True).dt.normalize()

    # Convert the current date to datetime and normalize
    curr_date_dt = pd.to_datetime(curr_date, utc=True).normalize()

    # Filter the DataFrame for the given ticker and for reports that were published on or before the current date
    filtered_df = df[(df["Ticker"] == ticker) & (df["Publish Date"] <= curr_date_dt)]

    # Check if there are any available reports; if not, return a notification
    if filtered_df.empty:
        print("No cash flow statement available before the given current date.")
        return ""

    # Get the most recent cash flow statement by selecting the row with the latest Publish Date
    latest_cash_flow = filtered_df.loc[filtered_df["Publish Date"].idxmax()]

    # drop the SimFinID column
    latest_cash_flow = latest_cash_flow.drop("SimFinId")

    return (
        f"## {freq} cash flow statement for {ticker} released on {str(latest_cash_flow['Publish Date'])[0:10]}: \n"
        + str(latest_cash_flow)
        + "\n\nThis includes metadata like reporting dates and currency, share details, and a breakdown of cash movements. Operating activities show cash generated from core business operations, including net income adjustments for non-cash items and working capital changes. Investing activities cover asset acquisitions/disposals and investments. Financing activities include debt transactions, equity issuances/repurchases, and dividend payments. The net change in cash represents the overall increase or decrease in the company's cash position during the reporting period."
    )


def get_simfin_income_statements(
    ticker: Annotated[str, "ticker symbol"],
    freq: Annotated[
        str,
        "reporting frequency of the company's financial history: annual / quarterly",
    ],
    curr_date: Annotated[str, "current date you are trading at, yyyy-mm-dd"],
):
    data_path = os.path.join(
        DATA_DIR,
        "fundamental_data",
        "simfin_data_all",
        "income_statements",
        "companies",
        "us",
        f"us-income-{freq}.csv",
    )
    df = pd.read_csv(data_path, sep=";")

    # Convert date strings to datetime objects and remove any time components
    df["Report Date"] = pd.to_datetime(df["Report Date"], utc=True).dt.normalize()
    df["Publish Date"] = pd.to_datetime(df["Publish Date"], utc=True).dt.normalize()

    # Convert the current date to datetime and normalize
    curr_date_dt = pd.to_datetime(curr_date, utc=True).normalize()

    # Filter the DataFrame for the given ticker and for reports that were published on or before the current date
    filtered_df = df[(df["Ticker"] == ticker) & (df["Publish Date"] <= curr_date_dt)]

    # Check if there are any available reports; if not, return a notification
    if filtered_df.empty:
        print("No income statement available before the given current date.")
        return ""

    # Get the most recent income statement by selecting the row with the latest Publish Date
    latest_income = filtered_df.loc[filtered_df["Publish Date"].idxmax()]

    # drop the SimFinID column
    latest_income = latest_income.drop("SimFinId")

    return (
        f"## {freq} income statement for {ticker} released on {str(latest_income['Publish Date'])[0:10]}: \n"
        + str(latest_income)
        + "\n\nThis includes metadata like reporting dates and currency, share details, and a comprehensive breakdown of the company's financial performance. Starting with Revenue, it shows Cost of Revenue and resulting Gross Profit. Operating Expenses are detailed, including SG&A, R&D, and Depreciation. The statement then shows Operating Income, followed by non-operating items and Interest Expense, leading to Pretax Income. After accounting for Income Tax and any Extraordinary items, it concludes with Net Income, representing the company's bottom-line profit or loss for the period."
    )


def get_google_news(
    query: Annotated[str, "Query to search with"],
    curr_date: Annotated[str, "Curr date in yyyy-mm-dd format"],
    look_back_days: Annotated[int, "how many days to look back"],
) -> str:
    query = query.replace(" ", "+")

    start_date = datetime.strptime(curr_date, "%Y-%m-%d")
    before = start_date - relativedelta(days=look_back_days)
    before = before.strftime("%Y-%m-%d")

    news_results = getNewsData(query, before, curr_date)

    news_str = ""

    for news in news_results:
        news_str += (
            f"### {news['title']} (source: {news['source']}) \n\n{news['snippet']}\n\n"
        )

    if len(news_results) == 0:
        return ""

    return f"## {query} Google News, from {before} to {curr_date}:\n\n{news_str}"


def get_reddit_global_news(
    start_date: Annotated[str, "Start date in yyyy-mm-dd format"],
    look_back_days: Annotated[int, "how many days to look back"],
    max_limit_per_day: Annotated[int, "Maximum number of news per day"],
) -> str:
    """
    Retrieve the latest top reddit news
    Args:
        start_date: Start date in yyyy-mm-dd format
        end_date: End date in yyyy-mm-dd format
    Returns:
        str: A formatted dataframe containing the latest news articles posts on reddit and meta information in these columns: "created_utc", "id", "title", "selftext", "score", "num_comments", "url"
    """

    start_date = datetime.strptime(start_date, "%Y-%m-%d")
    before = start_date - relativedelta(days=look_back_days)
    before = before.strftime("%Y-%m-%d")

    posts = []
    # iterate from start_date to end_date
    curr_date = datetime.strptime(before, "%Y-%m-%d")

    total_iterations = (start_date - curr_date).days + 1
    pbar = tqdm(desc=f"Getting Global News on {start_date}", total=total_iterations)

    while curr_date <= start_date:
        curr_date_str = curr_date.strftime("%Y-%m-%d")
        fetch_result = fetch_top_from_category(
            "global_news",
            curr_date_str,
            max_limit_per_day,
            data_path=os.path.join(DATA_DIR, "reddit_data"),
        )
        posts.extend(fetch_result)
        curr_date += relativedelta(days=1)
        pbar.update(1)

    pbar.close()

    if len(posts) == 0:
        return ""

    news_str = ""
    for post in posts:
        if post["content"] == "":
            news_str += f"### {post['title']}\n\n"
        else:
            news_str += f"### {post['title']}\n\n{post['content']}\n\n"

    return f"## Global News Reddit, from {before} to {curr_date}:\n{news_str}"


def get_reddit_company_news(
    ticker: Annotated[str, "ticker symbol of the company"],
    start_date: Annotated[str, "Start date in yyyy-mm-dd format"],
    look_back_days: Annotated[int, "how many days to look back"],
    max_limit_per_day: Annotated[int, "Maximum number of news per day"],
) -> str:
    """
    Retrieve the latest top reddit news
    Args:
        ticker: ticker symbol of the company
        start_date: Start date in yyyy-mm-dd format
        end_date: End date in yyyy-mm-dd format
    Returns:
        str: A formatted dataframe containing the latest news articles posts on reddit and meta information in these columns: "created_utc", "id", "title", "selftext", "score", "num_comments", "url"
    """

    start_date = datetime.strptime(start_date, "%Y-%m-%d")
    before = start_date - relativedelta(days=look_back_days)
    before = before.strftime("%Y-%m-%d")

    posts = []
    # iterate from start_date to end_date
    curr_date = datetime.strptime(before, "%Y-%m-%d")

    total_iterations = (start_date - curr_date).days + 1
    pbar = tqdm(
        desc=f"Getting Company News for {ticker} on {start_date}",
        total=total_iterations,
    )

    while curr_date <= start_date:
        curr_date_str = curr_date.strftime("%Y-%m-%d")
        fetch_result = fetch_top_from_category(
            "company_news",
            curr_date_str,
            max_limit_per_day,
            ticker,
            data_path=os.path.join(DATA_DIR, "reddit_data"),
        )
        posts.extend(fetch_result)
        curr_date += relativedelta(days=1)

        pbar.update(1)

    pbar.close()

    if len(posts) == 0:
        return ""

    news_str = ""
    for post in posts:
        if post["content"] == "":
            news_str += f"### {post['title']}\n\n"
        else:
            news_str += f"### {post['title']}\n\n{post['content']}\n\n"

    return f"##{ticker} News Reddit, from {before} to {curr_date}:\n\n{news_str}"


def get_stock_stats_indicators_window(
    symbol: Annotated[str, "ticker symbol of the company"],
    indicator: Annotated[str, "technical indicator to get the analysis and report of"],
    curr_date: Annotated[
        str, "The current trading date you are trading on, YYYY-mm-dd"
    ],
    look_back_days: Annotated[int, "how many days to look back"],
    online: Annotated[bool, "to fetch data online or offline"],
) -> str:

    best_ind_params = {
        # Moving Averages
        "close_50_sma": (
            "50 SMA: A medium-term trend indicator. "
            "Usage: Identify trend direction and serve as dynamic support/resistance. "
            "Tips: It lags price; combine with faster indicators for timely signals."
        ),
        "close_200_sma": (
            "200 SMA: A long-term trend benchmark. "
            "Usage: Confirm overall market trend and identify golden/death cross setups. "
            "Tips: It reacts slowly; best for strategic trend confirmation rather than frequent trading entries."
        ),
        "close_10_ema": (
            "10 EMA: A responsive short-term average. "
            "Usage: Capture quick shifts in momentum and potential entry points. "
            "Tips: Prone to noise in choppy markets; use alongside longer averages for filtering false signals."
        ),
        # MACD Related
        "macd": (
            "MACD: Computes momentum via differences of EMAs. "
            "Usage: Look for crossovers and divergence as signals of trend changes. "
            "Tips: Confirm with other indicators in low-volatility or sideways markets."
        ),
        "macds": (
            "MACD Signal: An EMA smoothing of the MACD line. "
            "Usage: Use crossovers with the MACD line to trigger trades. "
            "Tips: Should be part of a broader strategy to avoid false positives."
        ),
        "macdh": (
            "MACD Histogram: Shows the gap between the MACD line and its signal. "
            "Usage: Visualize momentum strength and spot divergence early. "
            "Tips: Can be volatile; complement with additional filters in fast-moving markets."
        ),
        # Momentum Indicators
        "rsi": (
            "RSI: Measures momentum to flag overbought/oversold conditions. "
            "Usage: Apply 70/30 thresholds and watch for divergence to signal reversals. "
            "Tips: In strong trends, RSI may remain extreme; always cross-check with trend analysis."
        ),
        # Volatility Indicators
        "boll": (
            "Bollinger Middle: A 20 SMA serving as the basis for Bollinger Bands. "
            "Usage: Acts as a dynamic benchmark for price movement. "
            "Tips: Combine with the upper and lower bands to effectively spot breakouts or reversals."
        ),
        "boll_ub": (
            "Bollinger Upper Band: Typically 2 standard deviations above the middle line. "
            "Usage: Signals potential overbought conditions and breakout zones. "
            "Tips: Confirm signals with other tools; prices may ride the band in strong trends."
        ),
        "boll_lb": (
            "Bollinger Lower Band: Typically 2 standard deviations below the middle line. "
            "Usage: Indicates potential oversold conditions. "
            "Tips: Use additional analysis to avoid false reversal signals."
        ),
        "atr": (
            "ATR: Averages true range to measure volatility. "
            "Usage: Set stop-loss levels and adjust position sizes based on current market volatility. "
            "Tips: It's a reactive measure, so use it as part of a broader risk management strategy."
        ),
        # Volume-Based Indicators
        "vwma": (
            "VWMA: A moving average weighted by volume. "
            "Usage: Confirm trends by integrating price action with volume data. "
            "Tips: Watch for skewed results from volume spikes; use in combination with other volume analyses."
        ),
        "mfi": (
            "MFI: The Money Flow Index is a momentum indicator that uses both price and volume to measure buying and selling pressure. "
            "Usage: Identify overbought (>80) or oversold (<20) conditions and confirm the strength of trends or reversals. "
            "Tips: Use alongside RSI or MACD to confirm signals; divergence between price and MFI can indicate potential reversals."
        ),
    }

    if indicator not in best_ind_params:
        raise ValueError(
            f"Indicator {indicator} is not supported. Please choose from: {list(best_ind_params.keys())}"
        )

    end_date = curr_date
    curr_date = datetime.strptime(curr_date, "%Y-%m-%d")
    before = curr_date - relativedelta(days=look_back_days)

    if not online:
        # read from YFin data
        data = pd.read_csv(
            os.path.join(
                DATA_DIR,
                f"market_data/price_data/{symbol}-YFin-data-2015-01-01-2025-03-25.csv",
            )
        )
        data["Date"] = pd.to_datetime(data["Date"], utc=True)
        dates_in_df = data["Date"].astype(str).str[:10]

        ind_string = ""
        while curr_date >= before:
            # only do the trading dates
            if curr_date.strftime("%Y-%m-%d") in dates_in_df.values:
                indicator_value = get_stockstats_indicator(
                    symbol, indicator, curr_date.strftime("%Y-%m-%d"), online
                )

                ind_string += f"{curr_date.strftime('%Y-%m-%d')}: {indicator_value}\n"

            curr_date = curr_date - relativedelta(days=1)
    else:
        # online gathering
        ind_string = ""
        while curr_date >= before:
            indicator_value = get_stockstats_indicator(
                symbol, indicator, curr_date.strftime("%Y-%m-%d"), online
            )

            ind_string += f"{curr_date.strftime('%Y-%m-%d')}: {indicator_value}\n"

            curr_date = curr_date - relativedelta(days=1)

    result_str = (
        f"## {indicator} values from {before.strftime('%Y-%m-%d')} to {end_date}:\n\n"
        + ind_string
        + "\n\n"
        + best_ind_params.get(indicator, "No description available.")
    )

    return result_str


def get_stockstats_indicator(
    symbol: Annotated[str, "ticker symbol of the company"],
    indicator: Annotated[str, "technical indicator to get the analysis and report of"],
    curr_date: Annotated[
        str, "The current trading date you are trading on, YYYY-mm-dd"
    ],
    online: Annotated[bool, "to fetch data online or offline"],
) -> str:

    curr_date = datetime.strptime(curr_date, "%Y-%m-%d")
    curr_date = curr_date.strftime("%Y-%m-%d")

    try:
        indicator_value = StockstatsUtils.get_stock_stats(
            symbol,
            indicator,
            curr_date,
            os.path.join(DATA_DIR, "market_data", "price_data"),
            online=online,
        )
    except Exception as e:
        print(
            f"Error getting stockstats indicator data for indicator {indicator} on {curr_date}: {e}"
        )
        return ""

    return str(indicator_value)


def get_YFin_data_window(
    symbol: Annotated[str, "ticker symbol of the company"],
    curr_date: Annotated[str, "Start date in yyyy-mm-dd format"],
    look_back_days: Annotated[int, "how many days to look back"],
) -> str:
    # calculate past days
    date_obj = datetime.strptime(curr_date, "%Y-%m-%d")
    before = date_obj - relativedelta(days=look_back_days)
    start_date = before.strftime("%Y-%m-%d")

    # read in data
    data = pd.read_csv(
        os.path.join(
            DATA_DIR,
            f"market_data/price_data/{symbol}-YFin-data-2015-01-01-2025-03-25.csv",
        )
    )

    # Extract just the date part for comparison
    data["DateOnly"] = data["Date"].str[:10]

    # Filter data between the start and end dates (inclusive)
    filtered_data = data[
        (data["DateOnly"] >= start_date) & (data["DateOnly"] <= curr_date)
    ]

    # Drop the temporary column we created
    filtered_data = filtered_data.drop("DateOnly", axis=1)

    # Set pandas display options to show the full DataFrame
    with pd.option_context(
        "display.max_rows", None, "display.max_columns", None, "display.width", None
    ):
        df_string = filtered_data.to_string()

    return (
        f"## Raw Market Data for {symbol} from {start_date} to {curr_date}:\n\n"
        + df_string
    )


def get_YFin_data_online(
    symbol: Annotated[str, "ticker symbol of the company"],
    start_date: Annotated[str, "Start date in yyyy-mm-dd format"],
    end_date: Annotated[str, "End date in yyyy-mm-dd format"],
):

    datetime.strptime(start_date, "%Y-%m-%d")
    datetime.strptime(end_date, "%Y-%m-%d")

    # Create ticker object
    ticker = yf.Ticker(symbol.upper())

    # Fetch historical data for the specified date range
    data = ticker.history(start=start_date, end=end_date)

    # Check if data is empty
    if data.empty:
        return (
            f"No data found for symbol '{symbol}' between {start_date} and {end_date}"
        )

    # Remove timezone info from index for cleaner output
    if data.index.tz is not None:
        data.index = data.index.tz_localize(None)

    # Round numerical values to 2 decimal places for cleaner display
    numeric_columns = ["Open", "High", "Low", "Close", "Adj Close"]
    for col in numeric_columns:
        if col in data.columns:
            data[col] = data[col].round(2)

    # Convert DataFrame to CSV string
    csv_string = data.to_csv()

    # Add header information
    header = f"# Stock data for {symbol.upper()} from {start_date} to {end_date}\n"
    header += f"# Total records: {len(data)}\n"
    header += f"# Data retrieved on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"

    return header + csv_string


def get_YFin_data(
    symbol: Annotated[str, "ticker symbol of the company"],
    start_date: Annotated[str, "Start date in yyyy-mm-dd format"],
    end_date: Annotated[str, "End date in yyyy-mm-dd format"],
) -> str:
    # read in data
    data = pd.read_csv(
        os.path.join(
            DATA_DIR,
            f"market_data/price_data/{symbol}-YFin-data-2015-01-01-2025-03-25.csv",
        )
    )

    if end_date > "2025-03-25":
        raise Exception(
            f"Get_YFin_Data: {end_date} is outside of the data range of 2015-01-01 to 2025-03-25"
        )

    # Extract just the date part for comparison
    data["DateOnly"] = data["Date"].str[:10]

    # Filter data between the start and end dates (inclusive)
    filtered_data = data[
        (data["DateOnly"] >= start_date) & (data["DateOnly"] <= end_date)
    ]

    # Drop the temporary column we created
    filtered_data = filtered_data.drop("DateOnly", axis=1)

    # remove the index from the dataframe
    filtered_data = filtered_data.reset_index(drop=True)

    return filtered_data


def get_stock_news_openai(ticker, curr_date):
    config = get_config()
    client = OpenAI(base_url=config["backend_url"])

    response = client.responses.create(
        model=config["quick_think_llm"],
        input=[
            {
                "role": "system",
                "content": [
                    {
                        "type": "input_text",
                        "text": f"Can you search Social Media for {ticker} from 7 days before {curr_date} to {curr_date}? Make sure you only get the data posted during that period.",
                    }
                ],
            }
        ],
        text={"format": {"type": "text"}},
        reasoning={},
        tools=[
            {
                "type": "web_search_preview",
                "user_location": {"type": "approximate"},
                "search_context_size": "low",
            }
        ],
        temperature=1,
        max_output_tokens=4096,
        top_p=1,
        store=True,
    )

    return response.output[1].content[0].text


def get_global_news_openai(curr_date):
    config = get_config()
    client = OpenAI(base_url=config["backend_url"])

    response = client.responses.create(
        model=config["quick_think_llm"],
        input=[
            {
                "role": "system",
                "content": [
                    {
                        "type": "input_text",
                        "text": f"Can you search global or macroeconomics news from 7 days before {curr_date} to {curr_date} that would be informative for trading purposes? Make sure you only get the data posted during that period.",
                    }
                ],
            }
        ],
        text={"format": {"type": "text"}},
        reasoning={},
        tools=[
            {
                "type": "web_search_preview",
                "user_location": {"type": "approximate"},
                "search_context_size": "low",
            }
        ],
        temperature=1,
        max_output_tokens=4096,
        top_p=1,
        store=True,
    )

    return response.output[1].content[0].text


def get_fundamentals_openai(ticker, curr_date):
    config = get_config()
    client = OpenAI(base_url=config["backend_url"])

    response = client.responses.create(
        model=config["quick_think_llm"],
        input=[
            {
                "role": "system",
                "content": [
                    {
                        "type": "input_text",
                        "text": f"Can you search Fundamental for discussions on {ticker} during of the month before {curr_date} to the month of {curr_date}. Make sure you only get the data posted during that period. List as a table, with PE/PS/Cash flow/ etc",
                    }
                ],
            }
        ],
        text={"format": {"type": "text"}},
        reasoning={},
        tools=[
            {
                "type": "web_search_preview",
                "user_location": {"type": "approximate"},
                "search_context_size": "low",
            }
        ],
        temperature=1,
        max_output_tokens=4096,
        top_p=1,
        store=True,
    )

    return response.output[1].content[0].text

def get_industry_social_news_openai(
    ticker: Annotated[str, "Search query of a company's, e.g. 'AAPL, TSM, etc.'"],
    curr_date: Annotated[str, "Current date in yyyy-mm-dd format"],
    look_back_days: Annotated[int, "how many days to look back"],
) -> Dict[str, Any]:
    """
    Fetch industry-level social-media news via OpenAI Responses API + web_search tool.

    Returns a dict:
    {
      "ticker": "...",
      "industry": "...",
      "from_date": "YYYY-MM-DD",
      "to_date": "YYYY-MM-DD",
      "items": [
        {
          "headline": "...",
          "source": "...",
          "platform": "Reddit|X/Twitter|YouTube|TikTok|News site|...",
          "url": "...",
          "published_at": "YYYY-MM-DDTHH:MM:SSZ",
          "numbers": {"mentions": 120, "likes": 2300, "retweets": 150},
          "summary": "One-sentence factual synopsis (≤28 words).",
          "sentiment": {"label": "positive|negative|neutral", "score": 0.42}
        },
        ...
      ],
      "window_summary": "One-sentence theme for the period (≤28 words).",
      "window_sentiment": {"positive": 10, "negative": 6, "neutral": 9, "net_score": 0.12}
    }

    Notes:
    - Data provider only (no opinions/recommendations).
    - Two-step extraction: (1) resolve the company's primary industry; (2) collect
      social-media-centric items about that industry during the window.
    - Prefers social platforms; aims to return a larger set of social items when available.
    - Requires OPENAI_API_KEY in the environment.
    """
    # --- dates ---
    to_dt = datetime.strptime(curr_date, "%Y-%m-%d").replace(tzinfo=timezone.utc)
    from_dt = to_dt - timedelta(days=int(look_back_days))
    from_date = from_dt.date().isoformat()
    to_date = to_dt.date().isoformat()

    # --- OpenAI setup ---
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    # --- Instructions (facts-only, tool-first, social-heavy, sentiment required) ---
    system_instructions = (
        "You are an **industry** social-media news extraction agent (NOT a single-company scraper). Use the web_search tool.\n"
        "Primary objective: given a ticker, first resolve its **primary industry/sector**, then collect **industry-level** "
        "social news and discussions for the window. Prioritize items that reflect **cross-company, supply-chain, regulatory, "
        "or standards-driven** narratives likely to affect the whole group.\n\n"

        "Scope rules:\n"
        "- Include: multi-company themes (peer mentions), sector-wide policy/regulation, supply-chain constraints, input price shocks, "
        "labor/union actions, technology/standard changes, index/ETF rebalances (e.g., XLK, XLE), sell-side/industry notes that name multiple peers.\n"
        "- Exclude: purely **single-company** items **unless** the post clearly argues for **industry-wide impact** (e.g., a dominant supplier’s outage "
        "or a pricing action that peers are already copying). If included, state the cross-industry rationale in the summary.\n\n"

        "Collection strategy (cast a wide net):\n"
        "- Use both **industry keywords** and **peer tickers/cashtags** (e.g., sector name, common sub-segments, large constituents, supplier/customer names), "
        "plus relevant ETFs/indices (e.g., 'SOX', 'SMH', 'XLE', 'KRE').\n"
        "- Prefer social sources and return **as many relevant social items as available** (target 15–30 if possible); de-duplicate aggressively; "
        "prefer the original thread/post URL.\n\n"

        "For each item, provide:\n"
        "- headline; source (site/sub/author org); platform (Reddit, X/Twitter, YouTube, TikTok, News site, etc.); url; "
        "published_at (ISO8601 if available); numbers (e.g., mentions/likes/retweets/views if present); "
        "a **one-sentence summary** (≤28 words; factual & neutral) that makes the **industry linkage explicit**; and a **sentiment** label "
        "(positive/negative/neutral) with an optional score in [-1, 1].\n\n"

        "Window-level fields (required):\n"
        "- **window_summary**: one-sentence factual theme (≤28 words) describing the period’s **dominant industry narrative**.\n"
        "- **window_sentiment**: counts of positive/negative/neutral items (based on your per-item labels) and an optional net_score in [-1, 1].\n\n"

        "Strict filters & guardrails:\n"
        "- Tag each candidate internally as {scope: industry | mixed | company}. **Only output industry or mixed**; drop pure company unless it has "
        "clear, stated cross-industry implications.\n"
        "- Be strictly factual; no predictions or recommendations. Exclude items outside the window or off-topic."
    )


    # --- Search directives (multi-step guidance) ---
    search_directives = (
        f"Ticker: {ticker}\n"
        f"Window: {from_date} to {to_date} (inclusive)\n\n"
        "Step 1 — Resolve industry/sector for the ticker:\n"
        "- Use authoritative sources (Yahoo Finance profile, Wikipedia, company IR) to determine the company's primary industry/sector. "
        "Capture the most specific commonly-used label (e.g., 'Semiconductors', 'Specialty Retail', 'Integrated Oil & Gas').\n\n"
        "Step 2 — Harvest industry-level **social-media** news (not just the single company):\n"
        "- Prioritize platforms and sources such as Reddit (e.g., r/investing, r/wallstreetbets, industry subs), X/Twitter threads, "
        "YouTube channels, TikTok posts (if web-indexed), LinkedIn posts/articles, and news sites that summarize social buzz.\n"
        "- Only include items within the window and clearly tied to the industry (cross-company narratives are good). "
        "De-duplicate near-identical items and prefer the original thread/post URL.\n\n"
        "Sentiment extraction:\n"
        "- Assign positive/negative/neutral based on the item’s text and context (e.g., wording and reaction metrics). "
        "If uncertain, choose neutral. You may include an optional polarity score in [-1,1].\n\n"
        "Output all fields per the required schema, including **window_summary** and **window_sentiment**."
    )

    # --- Responses API call with structured output ---
    resp = client.responses.parse(
        model="gpt-5-mini",
        instructions=system_instructions,
        input=search_directives,
        tools=[{"type": "web_search"}],
        text_format=IndustrySocialNews,
    )

    parsed: IndustrySocialNews = resp.output_parsed

    # Defensive normalization
    if parsed.ticker != ticker:
        parsed.ticker = ticker
    parsed.from_date = from_date
    parsed.to_date = to_date


    # If the model omitted required window fields, backfill minimally to keep downstream safe
    if not getattr(parsed, "window_summary", None):
        parsed.window_summary = ""
    if not getattr(parsed, "window_sentiment", None):
        parsed.window_sentiment = WindowSentiment(positive=0, negative=0, neutral=0, net_score=0.0)

    # write the parsed output to a json file for inspection
    with open("industry_social_output.json", "w") as f:
        f.write(parsed.model_dump_json(indent=2))

    return parsed.model_dump()

def get_industry_etf_openai(
    ticker: Annotated[str, "Company ticker, e.g. 'AAPL', 'NVDA', 'JPM'"],
    curr_date: Annotated[str, "Current date in yyyy-mm-dd format"],
) -> Dict[str, Any]:
    """
    Resolve a representative industry/sector ETF for the given ticker using OpenAI + web_search.
    Returns a minimal dict like:
    {
      "ticker": "NVDA",
      "industry": "Semiconductors",
      "etf": "SMH",
      "etf_name": "VanEck Semiconductor ETF",
      "sources": ["https://...", "https://..."],
      "rationale": "Tracks large-cap semiconductors; NVDA is a top holding."
    }

    Notes:
    - Prefers a liquid **subsector ETF** (e.g., SMH, SOXX) over a broad sector ETF when appropriate.
    - If no clear subsector ETF exists, defaults to the sector SPDR (e.g., XLK, XLF, XLE).
    - Must NOT invent tickers; exclude databases/services like “XTF”.
    - Requires OPENAI_API_KEY in the environment.
    """
    # Basic date sanity; not strictly needed but keeps inputs tidy
    _ = datetime.strptime(curr_date, "%Y-%m-%d").replace(tzinfo=timezone.utc)

    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    system_instructions = (
        "You are an ETF resolver. Use the web_search tool.\n"
        "Goal: given a company ticker, (1) determine its primary industry/sector from credible sources "
        "(Yahoo Finance profile, Wikipedia, company IR), then (2) select ONE representative, liquid ETF "
        "that tracks that industry (prefer a well-known **subsector ETF**; otherwise use the **sector SPDR**).\n\n"
        "Guardrails:\n"
        "- Do NOT invent ETF symbols. Exclude databases/services like 'XTF' (not an ETF).\n"
        "- Prefer subsector ETFs like SMH/SOXX (Semis), XBI/IBB (Biotech), IGV (Software), KRE/KBE (Banks), etc.\n"
        "- If ambiguous, pick the most representative fund by AUM/liquidity; else fall back to sector SPDR (XLK/XLF/XLE/...).\n"
        "- Provide 1–3 supporting links (sources). Keep a one-line rationale. Return JSON per schema."
    )

    search_directives = (
        f"Ticker: {ticker}\n"
        f"Today: {curr_date}\n\n"
        "Return fields:\n"
        "- ticker: the input ticker\n"
        "- industry: concise industry label\n"
        "- etf: the chosen ETF ticker (single best choice)\n"
        "- etf_name: the ETF’s full name\n"
        "- sources: 1–3 URLs justifying the selection (ETF provider page, holdings page, profile pages)\n"
        "- rationale: one sentence on why this ETF represents the company’s industry\n"
    )

    resp = client.responses.parse(
        model="gpt-5-nano",
        instructions=system_instructions,
        input=search_directives,
        tools=[{"type": "web_search"}],
        text_format=ETFResolution,
    )

    parsed: ETFResolution = resp.output_parsed

    # Normalize ticker casing and ensure return matches request
    parsed.ticker = ticker.upper()

    return parsed.model_dump()

def get_industry_fundamentals_openai(
    ticker: Annotated[str, "Search query of a company's, e.g. 'AAPL, TSM, etc.'"],
    curr_date: Annotated[str, "Current date in yyyy-mm-dd format"],
    look_back_days: Annotated[int, "how many days to look back for 'as-of' alignment (prices/filings)"],
    weights_mode: Annotated[str, "etf|cap|equal"] = "etf",
    top_n_per_etf: Annotated[int, "max constituents per ETF to include"] = 15,
) -> Dict[str, Any]:
    """
    Fetch **industry-level fundamentals** via OpenAI Responses API + web_search tool
    using a **top-firms → weighted aggregation** approach.

    Output schema (Pydantic) expected in tradingagents.dataflows.data_models as `IndustryFundamentals`:

      {
        "ticker": "AAPL",
        "industry": "Semiconductors",
        "from_date": "YYYY-MM-DD",
        "to_date": "YYYY-MM-DD",
        "universe": {
          "source": "ETF|Peers|Mixed",
          "etfs": ["SOXX","SMH"],
          "selection_notes": "How the universe/weights were chosen"
        },
        "method": "etf_weighted|cap_weighted|equal_weighted",
        "constituents": [
          {
            "ticker": "NVDA",
            "name": "NVIDIA Corp",
            "weight": 0.089,                      # if missing, we’ll backfill/normalize below
            "mcap_usd": 3.1e12,
            "currency": "USD",
            "report_dates": {"ttm_end": "2025-06-30", "mrq": "2025-06-30"},
            "flows_ttm": {                        # optional but preferred (flows-first composite)
              "revenue": 0.0, "cogs": 0.0, "ebitda": 0.0, "ebit": 0.0, "net_income": 0.0,
              "cfo": 0.0, "capex": 0.0
            },
            "stocks_mrq": {                       # optional but preferred (for EV/leverage)
              "cash": 0.0, "total_debt": 0.0, "shares_out": 0.0
            },
            "metrics": {                          # ratio panel (use if flows/stocks unavailable)
              "pe_ttm": None, "ps_ttm": None, "ev_ebitda_ttm": None,
              "fcf_yield_ttm_pct": None, "div_yield_pct": None,
              "gross_margin_pct": None, "oper_margin_pct": None, "net_margin_pct": None,
              "roic_pct": None, "roe_pct": None,
              "net_debt_to_ebitda": None, "interest_coverage": None,
              "asset_turnover": None, "piotroski_f": None
            }
          }
        ],
        "aggregates": {                           # filled/validated in code below
          "composite": {                          # flows-first derived ratios if flows/stocks present
            "revenue_ttm": 0.0, "ebitda_ttm": 0.0, "ebit_ttm": 0.0, "net_income_ttm": 0.0,
            "cfo_ttm": 0.0, "capex_ttm": 0.0, "cash_mrq": 0.0, "debt_mrq": 0.0, "mcap_usd": 0.0,
            "gross_margin_pct": None, "oper_margin_pct": None, "net_margin_pct": None,
            "ev_ebitda_ttm": None, "fcf_yield_ttm_pct": None, "net_debt_to_ebitda": None
          },
          "weighted_means": {                     # ratio-weighted means
            "pe_ttm": None, "ps_ttm": None, "ev_ebitda_ttm": None,
            "fcf_yield_ttm_pct": None, "div_yield_pct": None,
            "gross_margin_pct": None, "oper_margin_pct": None, "net_margin_pct": None,
            "roic_pct": None, "roe_pct": None,
            "net_debt_to_ebitda": None, "interest_coverage": None,
            "asset_turnover": None, "piotroski_f": None
          }
        },
        "coverage_stats": {
          "n_names": 0,
          "weights_sum": 1.0,
          "excluded": [],
          "winsorization": {"p_low": 0.0, "p_high": 100.0}
        },
        "window_summary": "≤28 words factual synthesis (optional)"
      }

    Behavior:
    - Two steps via the model: (1) resolve industry and canonical ETFs; (2) extract top constituents
      and the best-available fundamentals (flows+stocks preferred; else ratios), with ETF weights
      when available.
    - Then **this function** normalizes/backs-fills weights (ETF → cap → equal) and computes
      industry-level aggregates (flows-first composite + ratio weighted means).
    - Data provider only (no opinions or recommendations).

    Requires: OPENAI_API_KEY in env.
    """

    # --- dates ---
    to_dt = datetime.strptime(curr_date, "%Y-%m-%d").replace(tzinfo=timezone.utc)
    from_dt = to_dt - timedelta(days=int(look_back_days))
    from_date = from_dt.date().isoformat()
    to_date = to_dt.date().isoformat()

    # --- OpenAI setup ---
    config = get_config()
    client = OpenAI(base_url=config["backend_url"])
    model = config["deep_think_llm"]
    # --- Instructions (facts-only, tool-first) ---
    system_instructions = (
        "You are an **industry fundamentals extraction** agent. Use the web_search tool.\n"
        "Task:\n"
        "1) For the given ticker, resolve its **primary industry/sector** via authoritative sources "
        "(Yahoo Finance profile, company IR page, Wikipedia). Capture a commonly used label "
        "(e.g., 'Semiconductors', 'Software', 'Biotech', 'Integrated Oil & Gas').\n"
        "2) Build a **top-firms universe** for that industry:\n"
        "   - Prefer canonical ETFs (e.g., Semis: SOXX/SMH; Software: IGV; Biotech: XBI/IBB; Energy: XLE; "
        "     Banks: KBE/KRE; Retail: XRT). Take the top constituents (target up to {top_n} per ETF), "
        "     with **ETF weights** if listed. De-duplicate tickers across ETFs.\n"
        "   - If ETF holdings cannot be obtained, fall back to well-cited peer lists and later use "
        "     market-cap or equal weights.\n"
        "3) For **each constituent**, extract as many of the following as reliably available (as of the date window end):\n"
        "   - **Flows (TTM)**: revenue, COGS, EBITDA, EBIT, net_income, CFO, capex.\n"
        "   - **Stocks (MRQ)**: cash, total_debt, shares_out.\n"
        "   - **Ratios**: PE (TTM), PS (TTM), EV/EBITDA (TTM), FCF_yield (TTM, %), dividend_yield (%), "
        "     gross/operating/net margin (%), ROIC (%), ROE (%), net_debt_to_ebitda, interest_coverage, "
        "     asset_turnover, Piotroski F-score.\n"
        "   - mcap (USD) and currency.\n"
        "4) Return JSON that matches the provided schema (`IndustryFundamentals`).\n"
        "Rules: facts only; cite numbers from reliable sources; exclude clearly stale data; "
        "omit fields you cannot verify. No opinions or recommendations.\n"
    ).replace("{top_n}", str(top_n_per_etf))

    # --- Search directives (multi-step guidance) ---
    search_directives = (
        f"Ticker: {ticker}\n"
        f"Window (for 'as-of' alignment): {from_date} to {to_date} (inclusive)\n\n"
        "Step 1 — Resolve industry/sector:\n"
        "- Prefer Yahoo Finance profile, company IR, Wikipedia. Record a single industry label.\n\n"
        "Step 2 — Identify canonical ETFs & top constituents:\n"
        "- Select 1–3 ETFs that best represent this industry; collect their top holdings and weights.\n"
        "- De-duplicate tickers; limit to the most representative set.\n\n"
        "Step 3 — Extract fundamentals per constituent (as listed in the instructions):\n"
        "- Use reliable sources (company filings, IR summaries, major data vendors in news, reputable finance sites).\n"
        "- Use TTM for flow items and MRQ for stock items; ratios as TTM where applicable.\n\n"
        "Output: fill every field you can in the `IndustryFundamentals` schema. "
        "If a weight is from an ETF, place it in the constituent's `weight`."
    )

    # --- Responses API call with structured output (Pydantic) ---
    # --- Responses API call via your gateway (same style as other working funcs) ---
    resp = client.responses.parse(
        model="gpt-5-nano",
        instructions=system_instructions,
        input=search_directives,
        tools=[{"type": "web_search"}],
        text_format=IndustryFundamentals,
    )

    # print(f"Websearch response {resp}")
    parsed: IndustryFundamentals = resp.output_parsed

    # --- Defensive normalization (mirror your social-news pattern) ---
    if getattr(parsed, "ticker", None) != ticker:
        parsed.ticker = ticker
    parsed.from_date = from_date
    parsed.to_date = to_date

    # --- Convert to dict for post-processing aggregates ---
    out = parsed.model_dump()

    # ---------- Aggregation & backfills (weights: etf → cap → equal) ----------
    constituents: List[Dict[str, Any]] = out.get("constituents", []) or []

    # Choose weights source
    weights = []
    mcap = []
    for c in constituents:
        w = c.get("weight")
        weights.append(w if isinstance(w, (int, float)) else None)
        mcap.append(c.get("mcap_usd"))

    def _normalize(nums: List[Optional[float]]) -> Optional[List[float]]:
        arr = [x for x in nums if isinstance(x, (int, float))]
        if len(arr) != len(nums):
            return None
        s = sum(arr)
        if not s or s <= 0:
            return None
        return [x / s for x in arr]

    chosen_method = None
    norm_w = _normalize(weights)
    if norm_w:
        chosen_method = "etf_weighted"
    else:
        # try cap-weight
        if all(isinstance(x, (int, float)) and x > 0 for x in mcap) and sum(mcap) > 0:
            norm_w = [x / sum(mcap) for x in mcap]
            chosen_method = "cap_weighted"
        else:
            # equal-weight
            n = max(len(constituents), 1)
            norm_w = [1.0 / n] * n
            chosen_method = "equal_weighted"

    # write back normalized weights
    for i, c in enumerate(constituents):
        c["weight"] = norm_w[i]

    out["method"] = chosen_method
    out["coverage_stats"] = out.get("coverage_stats", {}) or {}
    out["coverage_stats"]["n_names"] = len(constituents)
    out["coverage_stats"]["weights_sum"] = round(sum(norm_w), 6)

    # ---------- Compute aggregates ----------
    def _get_num(d, *keys):
        x = d
        for k in keys:
            x = x.get(k) if isinstance(x, dict) else None
            if x is None:
                return None
        return x if isinstance(x, (int, float)) else None

    # flows-first composite (weighted sums of flows/stocks & cap, then derived ratios)
    comp = {
        "revenue_ttm": 0.0,
        "cogs_ttm": 0.0,
        "ebitda_ttm": 0.0,
        "ebit_ttm": 0.0,
        "net_income_ttm": 0.0,
        "cfo_ttm": 0.0,
        "capex_ttm": 0.0,
        "cash_mrq": 0.0,
        "debt_mrq": 0.0,
        "mcap_usd": 0.0,
    }
    for w, c in zip(norm_w, constituents):
        # flows
        for k_json, k in [("revenue", "revenue_ttm"), ("cogs", "cogs_ttm"), ("ebitda", "ebitda_ttm"),
                          ("ebit", "ebit_ttm"), ("net_income", "net_income_ttm"),
                          ("cfo", "cfo_ttm"), ("capex", "capex_ttm")]:
            v = _get_num(c, "flows_ttm", k_json)
            if v is not None:
                comp[k] += w * v
        # stocks
        for k_json, k in [("cash", "cash_mrq"), ("total_debt", "debt_mrq")]:
            v = _get_num(c, "stocks_mrq", k_json)
            if v is not None:
                comp[k] += w * v
        # market cap
        mc = c.get("mcap_usd")
        if isinstance(mc, (int, float)):
            comp["mcap_usd"] += w * mc

    # derived composite ratios (guard against zero/neg denominators)
    def _safe_div(a, b):
        try:
            return (a / b) if (a is not None and b is not None and b != 0) else None
        except Exception:
            return None

    composite_out = {
        "revenue_ttm": comp["revenue_ttm"],
        "ebitda_ttm": comp["ebitda_ttm"],
        "ebit_ttm": comp["ebit_ttm"],
        "net_income_ttm": comp["net_income_ttm"],
        "cfo_ttm": comp["cfo_ttm"],
        "capex_ttm": comp["capex_ttm"],
        "cash_mrq": comp["cash_mrq"],
        "debt_mrq": comp["debt_mrq"],
        "mcap_usd": comp["mcap_usd"],
        "gross_margin_pct": None,
        "oper_margin_pct": None,
        "net_margin_pct": None,
        "ev_ebitda_ttm": None,
        "fcf_yield_ttm_pct": None,
        "net_debt_to_ebitda": None,
    }

    # margins from flows if revenue available
    if comp["revenue_ttm"] and comp["revenue_ttm"] > 0:
        # gross margin needs COGS; if missing, skip
        if comp["cogs_ttm"] and comp["cogs_ttm"] >= 0:
            composite_out["gross_margin_pct"] = 100.0 * _safe_div(
                comp["revenue_ttm"] - comp["cogs_ttm"], comp["revenue_ttm"]
            )
        composite_out["oper_margin_pct"] = 100.0 * _safe_div(comp["ebit_ttm"], comp["revenue_ttm"])
        composite_out["net_margin_pct"] = 100.0 * _safe_div(comp["net_income_ttm"], comp["revenue_ttm"])

    # EV/EBITDA, FCF yield, NetDebt/EBITDA
    ev = (comp["mcap_usd"] or 0.0) + (comp["debt_mrq"] or 0.0) - (comp["cash_mrq"] or 0.0)
    if comp["ebitda_ttm"] and comp["ebitda_ttm"] > 0:
        composite_out["ev_ebitda_ttm"] = _safe_div(ev, comp["ebitda_ttm"])
        composite_out["net_debt_to_ebitda"] = _safe_div((comp["debt_mrq"] or 0.0) - (comp["cash_mrq"] or 0.0),
                                                        comp["ebitda_ttm"])

    fcf_ttm = None
    if comp["cfo_ttm"] is not None and comp["capex_ttm"] is not None:
        fcf_ttm = comp["cfo_ttm"] - comp["capex_ttm"]
        if comp["mcap_usd"] and comp["mcap_usd"] > 0:
            composite_out["fcf_yield_ttm_pct"] = 100.0 * _safe_div(fcf_ttm, comp["mcap_usd"])

    # ratio weighted means (when provided per name)
    weighted_means = {
        "pe_ttm": None, "ps_ttm": None, "ev_ebitda_ttm": None,
        "fcf_yield_ttm_pct": None, "div_yield_pct": None,
        "gross_margin_pct": None, "oper_margin_pct": None, "net_margin_pct": None,
        "roic_pct": None, "roe_pct": None,
        "net_debt_to_ebitda": None, "interest_coverage": None,
        "asset_turnover": None, "piotroski_f": None
    }

    def _weighted_mean(key: str) -> Optional[float]:
        num, den = 0.0, 0.0
        for w, c in zip(norm_w, constituents):
            v = _get_num(c, "metrics", key)
            if isinstance(v, (int, float)):
                num += w * v
                den += w
        return (num / den) if den > 0 else None

    for k in list(weighted_means.keys()):
        weighted_means[k] = _weighted_mean(k)

    out["aggregates"] = {
        "composite": composite_out,
        "weighted_means": weighted_means,
    }

    # Be explicit on universe+method for the analyst chain
    out["universe"] = out.get("universe", {}) or {}
    out["universe"].setdefault("source", "ETF")  # model can overwrite
    out["universe"].setdefault("selection_notes", "")

    # Ensure required top fields are present for downstream safety
    out.setdefault("industry", getattr(parsed, "industry", ""))
    out.setdefault("window_summary", out.get("window_summary", ""))

    return out