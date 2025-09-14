from langchain_core.messages import BaseMessage, HumanMessage, ToolMessage, AIMessage
from typing import List
from typing import Annotated
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import RemoveMessage
from langchain_core.tools import tool
from datetime import date, timedelta, datetime
import functools
import pandas as pd
import os
from dateutil.relativedelta import relativedelta
from langchain_openai import ChatOpenAI
import tradingagents.dataflows.interface as interface
from tradingagents.default_config import DEFAULT_CONFIG
from langchain_core.messages import HumanMessage
import json


def create_msg_delete():
    def delete_messages(state):
        """Clear messages and add placeholder for Anthropic compatibility"""
        messages = state["messages"]
        
        # Remove all messages
        removal_operations = [RemoveMessage(id=m.id) for m in messages]
        
        # Add a minimal placeholder message
        placeholder = HumanMessage(content="Continue")
        
        return {"messages": removal_operations + [placeholder]}
    
    return delete_messages


class Toolkit:
    _config = DEFAULT_CONFIG.copy()

    @classmethod
    def update_config(cls, config):
        """Update the class-level configuration."""
        cls._config.update(config)

    @property
    def config(self):
        """Access the configuration."""
        return self._config

    def __init__(self, config=None):
        if config:
            self.update_config(config)
    
    @staticmethod
    @tool
    def get_shareholder_news(
        ticker: Annotated[str, "Search query of a company's, e.g. 'AAPL, TSM, etc.'"],
        curr_date: Annotated[str, "Current date in yyyy-mm-dd format"],
        look_back_days: Annotated[int, "How many days to look back"],
    ) -> str:
        """
        Retrieve the latest shareholder news about a given stock within a specified time frame.
        Args:
            ticker (str): Ticker of a company. e.g. AAPL, TSM
            curr_date (str): Current date in yyyy-mm-dd format
            look_back_days (int): How many days to look back
        Returns:
            str: A formatted dataframe containing the latest shareholder news about the company within the specified time frame
        """
        # --- Call the underlying data provider ---
        news_data = interface.get_shareholder_news(ticker, curr_date, look_back_days)
        # print(news_data)

        # --- Build DataFrame ---
        if not news_data.get("items"):
            return f"## {ticker} News Report\n\nNo shareholder-related news found from {news_data['from_date']} to {curr_date}."

        df = pd.DataFrame(news_data["items"])

        # Keep only the columns we want visible
        # (headline, source, numbers)
        keep_cols = [c for c in ["headline", "source", "numbers"] if c in df.columns]
        df = df[keep_cols]

        # Convert DataFrame to markdown
        news_str = df.to_markdown(index=False)

        # Final formatted markdown output
        return (
            f"## {ticker} News Report related to significant shareholders, from {news_data['from_date']} to {curr_date}:\n\n"
            f"{news_str}"
        )

    @staticmethod
    @tool
    def get_reddit_news(
        curr_date: Annotated[str, "Date you want to get news for in yyyy-mm-dd format"],
    ) -> str:
        """
        Retrieve global news from Reddit within a specified time frame.
        Args:
            curr_date (str): Date you want to get news for in yyyy-mm-dd format
        Returns:
            str: A formatted dataframe containing the latest global news from Reddit in the specified time frame.
        """
        
        global_news_result = interface.get_reddit_global_news(curr_date, 7, 5)

        return global_news_result

    @staticmethod
    @tool
    def get_finnhub_news(
        ticker: Annotated[
            str,
            "Search query of a company, e.g. 'AAPL, TSM, etc.",
        ],
        start_date: Annotated[str, "Start date in yyyy-mm-dd format"],
        end_date: Annotated[str, "End date in yyyy-mm-dd format"],
    ):
        """
        Retrieve the latest news about a given stock from Finnhub within a date range
        Args:
            ticker (str): Ticker of a company. e.g. AAPL, TSM
            start_date (str): Start date in yyyy-mm-dd format
            end_date (str): End date in yyyy-mm-dd format
        Returns:
            str: A formatted dataframe containing news about the company within the date range from start_date to end_date
        """

        end_date_str = end_date

        end_date = datetime.strptime(end_date, "%Y-%m-%d")
        start_date = datetime.strptime(start_date, "%Y-%m-%d")
        look_back_days = (end_date - start_date).days

        finnhub_news_result = interface.get_finnhub_news(
            ticker, end_date_str, look_back_days
        )

        return finnhub_news_result

    @staticmethod
    @tool
    def get_reddit_stock_info(
        ticker: Annotated[
            str,
            "Ticker of a company. e.g. AAPL, TSM",
        ],
        curr_date: Annotated[str, "Current date you want to get news for"],
    ) -> str:
        """
        Retrieve the latest news about a given stock from Reddit, given the current date.
        Args:
            ticker (str): Ticker of a company. e.g. AAPL, TSM
            curr_date (str): current date in yyyy-mm-dd format to get news for
        Returns:
            str: A formatted dataframe containing the latest news about the company on the given date
        """

        stock_news_results = interface.get_reddit_company_news(ticker, curr_date, 7, 5)

        return stock_news_results

    @staticmethod
    @tool
    def get_YFin_data(
        symbol: Annotated[str, "ticker symbol of the company"],
        start_date: Annotated[str, "Start date in yyyy-mm-dd format"],
        end_date: Annotated[str, "End date in yyyy-mm-dd format"],
    ) -> str:
        """
        Retrieve the stock price data for a given ticker symbol from Yahoo Finance.
        Args:
            symbol (str): Ticker symbol of the company, e.g. AAPL, TSM
            start_date (str): Start date in yyyy-mm-dd format
            end_date (str): End date in yyyy-mm-dd format
        Returns:
            str: A formatted dataframe containing the stock price data for the specified ticker symbol in the specified date range.
        """

        result_data = interface.get_YFin_data(symbol, start_date, end_date)

        return result_data

    @staticmethod
    @tool
    def get_YFin_data_online(
        symbol: Annotated[str, "ticker symbol of the company"],
        start_date: Annotated[str, "Start date in yyyy-mm-dd format"],
        end_date: Annotated[str, "End date in yyyy-mm-dd format"],
    ) -> str:
        """
        Retrieve the stock price data for a given ticker symbol from Yahoo Finance.
        Args:
            symbol (str): Ticker symbol of the company, e.g. AAPL, TSM
            start_date (str): Start date in yyyy-mm-dd format
            end_date (str): End date in yyyy-mm-dd format
        Returns:
            str: A formatted dataframe containing the stock price data for the specified ticker symbol in the specified date range.
        """

        result_data = interface.get_YFin_data_online(symbol, start_date, end_date)

        return result_data

    @staticmethod
    @tool
    def get_stockstats_indicators_report(
        symbol: Annotated[str, "ticker symbol of the company"],
        indicator: Annotated[
            str, "technical indicator to get the analysis and report of"
        ],
        curr_date: Annotated[
            str, "The current trading date you are trading on, YYYY-mm-dd"
        ],
        look_back_days: Annotated[int, "how many days to look back"] = 30,
    ) -> str:
        """
        Retrieve stock stats indicators for a given ticker symbol and indicator.
        Args:
            symbol (str): Ticker symbol of the company, e.g. AAPL, TSM
            indicator (str): Technical indicator to get the analysis and report of
            curr_date (str): The current trading date you are trading on, YYYY-mm-dd
            look_back_days (int): How many days to look back, default is 30
        Returns:
            str: A formatted dataframe containing the stock stats indicators for the specified ticker symbol and indicator.
        """

        result_stockstats = interface.get_stock_stats_indicators_window(
            symbol, indicator, curr_date, look_back_days, False
        )

        return result_stockstats

    @staticmethod
    @tool
    def get_stockstats_indicators_report_online(
        symbol: Annotated[str, "ticker symbol of the company"],
        indicator: Annotated[
            str, "technical indicator to get the analysis and report of"
        ],
        curr_date: Annotated[
            str, "The current trading date you are trading on, YYYY-mm-dd"
        ],
        look_back_days: Annotated[int, "how many days to look back"] = 30,
    ) -> str:
        """
        Retrieve stock stats indicators for a given ticker symbol and indicator.
        Args:
            symbol (str): Ticker symbol of the company, e.g. AAPL, TSM
            indicator (str): Technical indicator to get the analysis and report of
            curr_date (str): The current trading date you are trading on, YYYY-mm-dd
            look_back_days (int): How many days to look back, default is 30
        Returns:
            str: A formatted dataframe containing the stock stats indicators for the specified ticker symbol and indicator.
        """

        result_stockstats = interface.get_stock_stats_indicators_window(
            symbol, indicator, curr_date, look_back_days, True
        )

        return result_stockstats

    @staticmethod
    @tool
    def get_finnhub_company_insider_sentiment(
        ticker: Annotated[str, "ticker symbol for the company"],
        curr_date: Annotated[
            str,
            "current date of you are trading at, yyyy-mm-dd",
        ],
    ):
        """
        Retrieve insider sentiment information about a company (retrieved from public SEC information) for the past 30 days
        Args:
            ticker (str): ticker symbol of the company
            curr_date (str): current date you are trading at, yyyy-mm-dd
        Returns:
            str: a report of the sentiment in the past 30 days starting at curr_date
        """

        data_sentiment = interface.get_finnhub_company_insider_sentiment(
            ticker, curr_date, 30
        )

        return data_sentiment

    @staticmethod
    @tool
    def get_finnhub_company_insider_transactions(
        ticker: Annotated[str, "ticker symbol"],
        curr_date: Annotated[
            str,
            "current date you are trading at, yyyy-mm-dd",
        ],
    ):
        """
        Retrieve insider transaction information about a company (retrieved from public SEC information) for the past 30 days
        Args:
            ticker (str): ticker symbol of the company
            curr_date (str): current date you are trading at, yyyy-mm-dd
        Returns:
            str: a report of the company's insider transactions/trading information in the past 30 days
        """

        data_trans = interface.get_finnhub_company_insider_transactions(
            ticker, curr_date, 30
        )

        return data_trans

    @staticmethod
    @tool
    def get_simfin_balance_sheet(
        ticker: Annotated[str, "ticker symbol"],
        freq: Annotated[
            str,
            "reporting frequency of the company's financial history: annual/quarterly",
        ],
        curr_date: Annotated[str, "current date you are trading at, yyyy-mm-dd"],
    ):
        """
        Retrieve the most recent balance sheet of a company
        Args:
            ticker (str): ticker symbol of the company
            freq (str): reporting frequency of the company's financial history: annual / quarterly
            curr_date (str): current date you are trading at, yyyy-mm-dd
        Returns:
            str: a report of the company's most recent balance sheet
        """

        data_balance_sheet = interface.get_simfin_balance_sheet(ticker, freq, curr_date)

        return data_balance_sheet

    @staticmethod
    @tool
    def get_simfin_cashflow(
        ticker: Annotated[str, "ticker symbol"],
        freq: Annotated[
            str,
            "reporting frequency of the company's financial history: annual/quarterly",
        ],
        curr_date: Annotated[str, "current date you are trading at, yyyy-mm-dd"],
    ):
        """
        Retrieve the most recent cash flow statement of a company
        Args:
            ticker (str): ticker symbol of the company
            freq (str): reporting frequency of the company's financial history: annual / quarterly
            curr_date (str): current date you are trading at, yyyy-mm-dd
        Returns:
                str: a report of the company's most recent cash flow statement
        """

        data_cashflow = interface.get_simfin_cashflow(ticker, freq, curr_date)

        return data_cashflow

    @staticmethod
    @tool
    def get_simfin_income_stmt(
        ticker: Annotated[str, "ticker symbol"],
        freq: Annotated[
            str,
            "reporting frequency of the company's financial history: annual/quarterly",
        ],
        curr_date: Annotated[str, "current date you are trading at, yyyy-mm-dd"],
    ):
        """
        Retrieve the most recent income statement of a company
        Args:
            ticker (str): ticker symbol of the company
            freq (str): reporting frequency of the company's financial history: annual / quarterly
            curr_date (str): current date you are trading at, yyyy-mm-dd
        Returns:
                str: a report of the company's most recent income statement
        """

        data_income_stmt = interface.get_simfin_income_statements(
            ticker, freq, curr_date
        )

        return data_income_stmt
    
    @staticmethod
    @tool
    def get_capital_returns_news(
        ticker: Annotated[str, "Company ticker, e.g., AAPL, TSM"],
        curr_date: Annotated[str, "Current date in yyyy-mm-dd format"],
        look_back_days: Annotated[int, "How many days to look back"],
    ) -> str:
        """
        Retrieve dividend & buyback (capital returns) events for a company within a date window,
        using OpenAI web_search. Returns JSON as a string following CapitalReturnNews schema.
        """
        result = interface.get_capital_returns_news(ticker, curr_date, look_back_days)
        return json.dumps(result)
    
    @staticmethod
    @tool
    def get_ownership_structure_news(
        ticker: Annotated[str, "Company ticker, e.g., AAPL, TSM"],
        curr_date: Annotated[str, "Current date in yyyy-mm-dd format"],
        look_back_days: Annotated[int, "How many days to look back"],
    ) -> str:
        """
        Retrieve an ownership-structure snapshot (float %, institutional %, insider %, top holders, share classes)
        via OpenAI web_search. Returns JSON string following OwnershipNews schema.
        """
        result = interface.get_ownership_structure_news(ticker, curr_date, look_back_days)
        return json.dumps(result)
    

    @staticmethod
    @tool
    def get_google_news(
        query: Annotated[str, "Query to search with"],
        curr_date: Annotated[str, "Curr date in yyyy-mm-dd format"],
    ):
        """
        Retrieve the latest news from Google News based on a query and date range.
        Args:
            query (str): Query to search with
            curr_date (str): Current date in yyyy-mm-dd format
            look_back_days (int): How many days to look back
        Returns:
            str: A formatted string containing the latest news from Google News based on the query and date range.
        """

        google_news_results = interface.get_google_news(query, curr_date, 7)

        return google_news_results

    @staticmethod
    @tool
    def get_stock_news_openai(
        ticker: Annotated[str, "the company's ticker"],
        curr_date: Annotated[str, "Current date in yyyy-mm-dd format"],
    ):
        """
        Retrieve the latest news about a given stock by using OpenAI's news API.
        Args:
            ticker (str): Ticker of a company. e.g. AAPL, TSM
            curr_date (str): Current date in yyyy-mm-dd format
        Returns:
            str: A formatted string containing the latest news about the company on the given date.
        """

        openai_news_results = interface.get_stock_news_openai(ticker, curr_date)

        return openai_news_results

    @staticmethod
    @tool
    def get_global_news_openai(
        curr_date: Annotated[str, "Current date in yyyy-mm-dd format"],
    ):
        """
        Retrieve the latest macroeconomics news on a given date using OpenAI's macroeconomics news API.
        Args:
            curr_date (str): Current date in yyyy-mm-dd format
        Returns:
            str: A formatted string containing the latest macroeconomic news on the given date.
        """

        openai_news_results = interface.get_global_news_openai(curr_date)

        return openai_news_results

    @staticmethod
    @tool
    def get_fundamentals_openai(
        ticker: Annotated[str, "the company's ticker"],
        curr_date: Annotated[str, "Current date in yyyy-mm-dd format"],
    ):
        """
        Retrieve the latest fundamental information about a given stock on a given date by using OpenAI's news API.
        Args:
            ticker (str): Ticker of a company. e.g. AAPL, TSM
            curr_date (str): Current date in yyyy-mm-dd format
        Returns:
            str: A formatted string containing the latest fundamental information about the company on the given date.
        """

        openai_fundamentals_results = interface.get_fundamentals_openai(
            ticker, curr_date
        )

        return openai_fundamentals_results

    """Industry-level tools"""
    @staticmethod
    @tool
    def get_industry_social_news_openai(
        ticker: Annotated[str, "Search query of a company's ticker, e.g. 'AAPL', 'TSM'"],
        curr_date: Annotated[str, "Current date in yyyy-mm-dd format"],
        look_back_days: Annotated[int, "How many days to look back"],
    ) -> str:
        """
        Retrieve industry-level social media news related to a given stock's industry within a specified time frame.
        Args:
            ticker (str): Ticker of a company, e.g. AAPL, TSM
            curr_date (str): Current date in yyyy-mm-dd format
            look_back_days (int): How many days to look back
        Returns:
            str: A formatted Markdown report containing the latest industry social media news, including per-item sentiment
                 and a window-level sentiment roll-up.
        """
        # --- Call the underlying data provider ---
        print("Calling get_industry_social_news_openai...")
        news_data = interface.get_industry_social_news_openai(ticker, curr_date, look_back_days)
        print("Received data:", news_data)

        # --- No items case ---
        if not news_data.get("items"):
            return (
                f"## {ticker} Industry Social Media Report\n\n"
                f"No industry-level social media news found from {news_data['from_date']} to {curr_date}."
            )

        # --- Build DataFrame ---
        df = pd.DataFrame(news_data["items"])

        # Keep selected columns for readability
        keep_cols = [c for c in ["headline", "platform", "source", "summary", "sentiment", "url"] if c in df.columns]
        df = df[keep_cols]

        # Convert to Markdown
        news_str = df.to_markdown(index=False)

        # --- Compose sentiment roll-up ---
        ws = news_data.get("window_sentiment", {})
        ws_str = (
            f"- Positive: {ws.get('positive', 0)}\n"
            f"- Negative: {ws.get('negative', 0)}\n"
            f"- Neutral: {ws.get('neutral', 0)}\n"
        )
        if "net_score" in ws and ws["net_score"] is not None:
            ws_str += f"- Net score: {ws['net_score']:.2f}\n"

        # --- Final Markdown report ---
        return (
            f"## {ticker} Industry Social Media Report, from {news_data['from_date']} to {curr_date}\n\n"
            f"**Industry:** {news_data.get('industry','Unknown')}\n\n"
            f"**Window Summary:** {news_data.get('window_summary','')}\n\n"
            f"### Window Sentiment\n{ws_str}\n"
            f"### Detailed Items\n{news_str}"
        )
    
    @staticmethod
    @tool
    def get_industry_fundamentals_openai(
        ticker: Annotated[str, "Search query of a company's ticker, e.g. 'AAPL', 'TSM'"],
        curr_date: Annotated[str, "Current date in yyyy-mm-dd format"],
        look_back_days: Annotated[int, "How many days to look back"],
        weights_mode: Annotated[str, "etf | cap | equal"] = "etf",
        top_n_per_etf: Annotated[int, "Max constituents per ETF to include"] = 15,
    ) -> str:
        """
        Retrieve **industry-level fundamentals** for the ticker’s industry in the given window.
        Returns a compact **Markdown** report (facts only), matching the style of other industry tools.
        """
        print("Calling get_industry_fundamentals_openai...")
        # --- Call the underlying data provider (unified interface.py) ---
        data = interface.get_industry_fundamentals_openai(
            ticker, curr_date, look_back_days, weights_mode, top_n_per_etf
        )  # schema produced by interface.get_industry_fundamentals_openai
        # (same call pattern as other industry tools)  # :contentReference[oaicite:3]{index=3}

        # --- Handle empty cases like other tools ---
        if not data or not (data.get("constituents") or []):
            return (
                f"## {ticker} Industry Fundamentals Report\n\n"
                f"No industry-level constituents/fundamentals returned from {data.get('from_date','?')} to {curr_date}."
            )

        # --- Helper to format numbers like other industry-tool reports ---
        def _fmt_num(x, unit=None, decimals=2):
            if x is None:
                return "—"
            try:
                v = float(x)
            except Exception:
                return "—"
            if unit == "$":
                av = abs(v)
                if av >= 1e12:
                    return f"${v/1e12:.2f}T"
                if av >= 1e9:
                    return f"${v/1e9:.2f}B"
                if av >= 1e6:
                    return f"${v/1e6:.2f}M"
                return f"${v:,.0f}"
            if unit == "%":
                return f"{v:.2f}%"
            return f"{v:.{decimals}f}"

        # --- Unpack key blocks ---
        industry = data.get("industry", "Unknown")
        method = data.get("method", "unknown")
        from_date = data.get("from_date", "")
        to_date = data.get("to_date", curr_date)
        uni = data.get("universe", {}) or {}
        etfs = ", ".join((uni.get("etfs") or []))
        ws = data.get("window_summary", "") or ""

        comp = (data.get("aggregates", {}) or {}).get("composite", {}) or {}
        wm = (data.get("aggregates", {}) or {}).get("weighted_means", {}) or {}
        cov = data.get("coverage_stats", {}) or {}
        n_names = cov.get("n_names", 0)
        weights_sum = cov.get("weights_sum")

        # --- Build a small top-constituents table (same pandas->markdown pattern as social tool) ---
        rows = []
        for c in data.get("constituents", []) or []:
            m = (c.get("metrics") or {})
            rows.append({
                "Ticker": c.get("ticker", ""),
                "Weight": (c.get("weight") or 0) * 100.0,
                "Mcap": _fmt_num(c.get("mcap_usd"), unit="$"),
                "EV/EBITDA": _fmt_num(m.get("ev_ebitda_ttm"), decimals=2),
                "P/E": _fmt_num(m.get("pe_ttm"), decimals=2),
                "Net Margin": _fmt_num(m.get("net_margin_pct"), unit="%", decimals=2),
                "ROIC": _fmt_num(m.get("roic_pct"), unit="%", decimals=2),
            })
        rows.sort(key=lambda r: r["Weight"], reverse=True)
        rows = rows[:8]

        df = pd.DataFrame(rows)  # mirrors industry social tool’s style for tabular sections
        table_md = df.to_markdown(index=False) if not df.empty else "_No constituents returned._"  # :contentReference[oaicite:4]{index=4}

        # --- Compose Markdown report (sections parallel to our industry-social tool) ---
        md = []
        md.append(f"## {ticker} Industry Fundamentals Report")
        md.append(f"**Industry:** {industry}  \n**Method:** {method}  \n**Window:** {from_date} → {to_date}")
        if etfs:
            md.append(f"**ETFs used:** {etfs}")
        if ws:
            md.append(f"**Window Summary:** {ws}")
        md.append("")

        # Executive summary (tight bullets)
        md.append("### Executive Summary")
        md.append(f"- Names covered: **{n_names}**; weights sum: **{_fmt_num(weights_sum, None, 4)}**")
        md.append(f"- Composite EV/EBITDA: **{_fmt_num(comp.get('ev_ebitda_ttm'), decimals=2)}**; "
                  f"Net Debt/EBITDA: **{_fmt_num(comp.get('net_debt_to_ebitda'), decimals=2)}**")
        md.append(f"- Net Margin: **{_fmt_num(comp.get('net_margin_pct'), unit='%')}**; "
                  f"FCF Yield: **{_fmt_num(comp.get('fcf_yield_ttm_pct'), unit='%')}**")
        md.append("")

        # Composite fundamentals (flows-first)
        md.append("### Composite Fundamentals (TTM/MRQ)")
        md.append(
            f"- Revenue: {_fmt_num(comp.get('revenue_ttm'), unit='$')}, EBITDA: {_fmt_num(comp.get('ebitda_ttm'), unit='$')}, "
            f"EBIT: {_fmt_num(comp.get('ebit_ttm'), unit='$')}, Net Income: {_fmt_num(comp.get('net_income_ttm'), unit='$')}"
        )
        md.append(
            f"- CFO: {_fmt_num(comp.get('cfo_ttm'), unit='$')}, Capex: {_fmt_num(comp.get('capex_ttm'), unit='$')}, "
            f"Cash: {_fmt_num(comp.get('cash_mrq'), unit='$')}, Debt: {_fmt_num(comp.get('debt_mrq'), unit='$')}, "
            f"Mcap: {_fmt_num(comp.get('mcap_usd'), unit='$')}"
        )
        md.append(
            f"- Gross Margin: {_fmt_num(comp.get('gross_margin_pct'), unit='%')}, "
            f"Operating Margin: {_fmt_num(comp.get('oper_margin_pct'), unit='%')}, "
            f"Net Margin: {_fmt_num(comp.get('net_margin_pct'), unit='%')}"
        )
        md.append(
            f"- EV/EBITDA: {_fmt_num(comp.get('ev_ebitda_ttm'), decimals=2)}, "
            f"FCF Yield: {_fmt_num(comp.get('fcf_yield_ttm_pct'), unit='%')}, "
            f"Net Debt/EBITDA: {_fmt_num(comp.get('net_debt_to_ebitda'), decimals=2)}"
        )
        md.append("")

        # Valuation & returns (weighted means)
        md.append("### Valuation & Returns (Weighted Means)")
        md.append(
            f"- P/E: {_fmt_num(wm.get('pe_ttm'), decimals=2)}, "
            f"P/S: {_fmt_num(wm.get('ps_ttm'), decimals=2)}, "
            f"EV/EBITDA: {_fmt_num(wm.get('ev_ebitda_ttm'), decimals=2)}, "
            f"Dividend Yield: {_fmt_num(wm.get('div_yield_pct'), unit='%', decimals=2)}, "
            f"FCF Yield: {_fmt_num(wm.get('fcf_yield_ttm_pct'), unit='%', decimals=2)}"
        )
        md.append(
            f"- ROIC: {_fmt_num(wm.get('roic_pct'), unit='%', decimals=2)}, "
            f"ROE: {_fmt_num(wm.get('roe_pct'), unit='%', decimals=2)}, "
            f"Asset Turnover: {_fmt_num(wm.get('asset_turnover'), decimals=2)}, "
            f"Interest Coverage: {_fmt_num(wm.get('interest_coverage'), decimals=2)}, "
            f"Piotroski F: {_fmt_num(wm.get('piotroski_f'), decimals=2)}"
        )
        md.append("")

        # Top constituents table
        md.append("### Top Constituents (by weight)")
        md.append(table_md)
        md.append("")

        # Coverage & Notes
        md.append("### Coverage & Notes")
        md.append(f"- Universe source: {uni.get('source','—')}")
        if uni.get("selection_notes"):
            md.append(f"- Selection notes: {uni['selection_notes']}")
        excl = cov.get("excluded") or []
        if excl:
            md.append("- Exclusions:")
            for e in excl:
                md.append(f"  - {e.get('ticker','?')}: {e.get('reason','')}")
        winz = cov.get("winsorization") or {}
        if winz.get("p_low") is not None and winz.get("p_high") is not None:
            md.append(f"- Winsorization: p{winz['p_low']}–p{winz['p_high']} on ratio panel")

        return "\n".join(md)


    @staticmethod
    @tool
    def get_industry_etf_openai(
        ticker: Annotated[str, "Ticker symbol, e.g., 'NVDA', 'AAPL', 'JPM'"],
        curr_date: Annotated[str, "Current date in yyyy-mm-dd format"],
    ) -> str:
        """
        Agent-facing tool: resolves a representative industry ETF for a ticker via OpenAI web search
        and returns a short Markdown snippet.
        """
        data = interface.get_industry_etf_openai(ticker, curr_date)

        md = [
            f"## Industry ETF Resolver — {data.get('ticker','').upper()}",
            f"- **Industry:** {data.get('industry','')}",
            f"- **ETF:** {data.get('etf','')} ({data.get('etf_name','')})",
        ]
        if data.get("rationale"):
            md.append(f"- **Why:** {data['rationale']}")
        if data.get("sources"):
            md.append("**Sources:**")
            for url in data["sources"]:
                md.append(f"- {url}")
        return "\n".join(md)

    @staticmethod
    @tool
    def get_industry_cross_signals_openai(
        ticker: Annotated[str, "Company ticker, e.g. 'AAPL', 'TSM'"],
        curr_date: Annotated[str, "Current date in yyyy-mm-dd format"],
        look_back_days: Annotated[int, "How many days to look back"],
    ) -> str:
        """
        Retrieve company-centric cross-signals (facts) and mathematical indices
        versus a benchmark for the given ticker within the specified window.

        Args:
            ticker (str): Company ticker, e.g. AAPL, TSM.
            curr_date (str): Current date in yyyy-mm-dd format.
            look_back_days (int): How many days to look back.
        Returns:
            str: A formatted Markdown report with (1) window-level math indices
                 (relative strength, beta, correlation, vol, max drawdown, etc.)
                 and (2) exposure items (facts-only) showing how industry changes
                 can affect the company (inputs/suppliers/customers/geo/policy/ETF).
        """
        import json
        import pandas as pd

        # --- Call the underlying data provider (facts-only) ---
        print("Calling get_industry_cross_signals_openai...")
        data = interface.get_industry_cross_signals_openai(ticker, curr_date, look_back_days)
        print("Received data:", data)

        # Defensive defaults
        from_date = data.get("from_date", "")
        to_date = data.get("to_date", curr_date)
        company_name = data.get("company_name") or ""
        chosen_benchmark = data.get("chosen_benchmark", "Unknown")
        alt_bench = data.get("alternative_benchmarks", []) or []
        window_summary = data.get("window_summary", "")

        # -------- Math indices block --------
        mi = data.get("math_indices", {}) or {}
        # Build a small table for math indices (only fields that exist)
        mi_rows = []
        def _fmt(v, pct=False):
            try:
                if v is None:
                    return ""
                return f"{float(v):.2f}%" if pct else f"{float(v):.4f}"
            except Exception:
                return str(v)

        mi_rows.append(("Company return", _fmt(mi.get("company_return_pct"), pct=True)))
        mi_rows.append(("Benchmark return", _fmt(mi.get("benchmark_return_pct"), pct=True)))
        mi_rows.append(("Relative strength (company - benchmark)", _fmt(mi.get("relative_strength_pct"), pct=True)))
        mi_rows.append(("Beta (window OLS)", _fmt(mi.get("beta"))))
        mi_rows.append(("Correlation (window)", _fmt(mi.get("corr"))))
        mi_rows.append(("Volatility (annualized)", _fmt(mi.get("volatility_ann_pct"), pct=True)))
        mi_rows.append(("Max drawdown", _fmt(mi.get("max_drawdown_pct"), pct=True)))
        if mi.get("abnormal_return_capm_pct") is not None:
            mi_rows.append(("Abnormal return (CAPM)", _fmt(mi.get("abnormal_return_capm_pct"), pct=True)))

        mi_df = pd.DataFrame(mi_rows, columns=["Metric", "Value"])
        mi_md = mi_df.to_markdown(index=False)

        # -------- Exposure items table --------
        items = data.get("items", []) or []
        # Keep at most 12 for readability; the interface may already cap, but be safe
        items = items[:12]

        if items:
            df = pd.DataFrame(items)
            # Flatten metrics dict to a short JSON string for visibility
            if "metrics" in df.columns:
                df["metrics"] = df["metrics"].apply(lambda m: json.dumps(m, ensure_ascii=False) if isinstance(m, dict) else (m or ""))
            keep_cols = [c for c in ["exposure_type", "headline", "fact", "source", "published_at", "metrics", "url"] if c in df.columns]
            df = df[keep_cols]
            items_md = df.to_markdown(index=False)
        else:
            items_md = "_No exposure items found in the window._"

        # -------- Optional rollups --------
        rollups = data.get("rollups", {}) or {}
        rollups_md = ""
        if rollups:
            # Pretty-print as JSON inside a code block to avoid wide tables
            rollups_md = "```json\n" + json.dumps(rollups, indent=2, ensure_ascii=False) + "\n```"

        # -------- Assemble Markdown report --------
        header_line = f"## {ticker} Cross-Signals & Math Indices Report, {from_date} → {to_date}\n"
        if company_name:
            header_line = f"## {company_name} ({ticker}) Cross-Signals & Math Indices Report, {from_date} → {to_date}\n"

        alt_bench_str = ", ".join(alt_bench) if alt_bench else "—"

        report = (
            f"{header_line}\n"
            f"**Benchmark:** {chosen_benchmark}  \n"
            f"**Alternative benchmarks:** {alt_bench_str}\n\n"
            f"**Window Summary (facts-only):** {window_summary}\n\n"
            f"### Mathematical Indices (window-level)\n"
            f"{mi_md}\n\n"
            f"### Exposure Items (facts-only)\n"
            f"{items_md}\n\n"
        )

        if rollups_md:
            report += "### Company Rollups (from filings)\n" + rollups_md + "\n"

        return report
