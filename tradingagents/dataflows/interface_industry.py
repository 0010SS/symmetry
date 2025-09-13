from __future__ import annotations

import os, sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from datetime import datetime, timedelta, timezone
from typing import Annotated, Dict, Any, Optional

from openai import OpenAI
from pydantic import BaseModel

from tradingagents.dataflows.data_models import *

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
        "You are an industry social-media news extraction agent. Use the web_search tool.\n"
        "Task: For the given ticker, first resolve its primary industry/sector using credible sources "
        "(e.g., Yahoo Finance profile, company IR page, Wikipedia). Then collect **industry-level social-media news** "
        "and discussions during the date window. Prefer social sources and return **as many relevant social items as available** "
        "(target 15–30 if possible; de-duplicate aggressively). Extract only verifiable facts from headlines/snippets/linked content.\n\n"
        "For each item, provide:\n"
        "- headline, source (site/sub/author org), platform (Reddit, X/Twitter, YouTube, TikTok, News site, etc.), url, "
        "published_at (ISO8601 if available), numbers (e.g., mentions/likes/retweets/views if present), "
        "a **one-sentence summary** (≤28 words; factual & neutral), and a **sentiment** label "
        "(positive/negative/neutral) with an optional score in [-1,1].\n\n"
        "Also provide two window-level fields:\n"
        "- **window_summary**: a one-sentence factual theme (≤28 words) describing the period’s dominant industry narrative.\n"
        "- **window_sentiment**: counts of positive/negative/neutral items (based on your per-item labels) and an optional net_score in [-1,1].\n\n"
        "Strictly avoid analysis, predictions, or recommendations. Exclude items outside the window or irrelevant to the industry."
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

    return parsed.model_dump()

# -------------------- TEST HARNESS (same file) --------------------
if __name__ == "__main__":
    """
    Minimal CLI to exercise get_industry_social_news.

    Usage examples:
      python your_file.py
      python your_file.py --ticker NVDA --date 2025-09-13 --days 10

    Make sure OPENAI_API_KEY is set in your environment.
    """
    import argparse
    import os
    import sys
    import json
    from datetime import datetime

    parser = argparse.ArgumentParser(description="Test get_industry_social_news()")
    parser.add_argument("--ticker", type=str, default="AAPL", help="Ticker symbol (e.g., AAPL)")
    parser.add_argument("--date", type=str, default="2025-09-13", help="Current date in yyyy-mm-dd")
    parser.add_argument("--days", type=int, default=14, help="Look-back days")
    args = parser.parse_args()

    # Basic env checks
    if not os.environ.get("OPENAI_API_KEY"):
        print("ERROR: OPENAI_API_KEY is not set.", file=sys.stderr)
        sys.exit(1)

    # Validate date format early
    try:
        datetime.strptime(args.date, "%Y-%m-%d")
    except ValueError:
        print("ERROR: --date must be in yyyy-mm-dd format.", file=sys.stderr)
        sys.exit(1)

    # Run the function
    try:
        result = get_industry_social_news_openai(
            ticker=args.ticker,
            curr_date=args.date,
            look_back_days=args.days,
        )
    except Exception as e:
        print(f"ERROR while fetching industry social news: {e}", file=sys.stderr)
        sys.exit(2)

    # ---- Light sanity checks (won't crash if fields missing; just warns) ----
    def warn(msg: str):
        print(f"[warn] {msg}", file=sys.stderr)

    required_top = ["ticker", "industry", "from_date", "to_date", "items", "window_summary", "window_sentiment"]
    for k in required_top:
        if k not in result:
            warn(f"Top-level field missing: {k}")

    ws = result.get("window_sentiment", {})
    for k in ["positive", "negative", "neutral"]:
        if k not in ws:
            warn(f"window_sentiment missing: {k}")

    # Show quick summary to stdout
    print("\n=== Test Summary ===")
    print(f"Ticker:          {result.get('ticker')}")
    print(f"Industry:        {result.get('industry')}")
    print(f"Window:          {result.get('from_date')} → {result.get('to_date')}")
    print(f"Window summary:  {result.get('window_summary')}")
    if isinstance(ws, dict):
        pos = ws.get("positive")
        neg = ws.get("negative")
        neu = ws.get("neutral")
        net = ws.get("net_score")
        print(f"Sentiment counts: +{pos} / -{neg} / ={neu}  (net_score={net})")

    items = result.get("items", []) or []
    print(f"Items returned:  {len(items)}")

    # Print a few rows in a readable way
    preview_n = min(5, len(items))
    if preview_n:
        print("\n--- First items ---")
        for i in range(preview_n):
            it = items[i]
            # Be defensive: items may be dicts already (they are if we used model_dump)
            headline = it.get("headline")
            platform = it.get("platform")
            source = it.get("source")
            sent = it.get("sentiment", {})
            sent_label = sent.get("label") if isinstance(sent, dict) else None
            url = it.get("url")
            print(f"[{i+1}] [{platform}] {headline}")
            print(f"     Source: {source} | Sentiment: {sent_label} | URL: {url}")

    # Pretty-print full JSON to stdout (useful for debugging / piping)
    print("\n=== Full JSON ===")
    print(json.dumps(result, indent=2, ensure_ascii=False))
