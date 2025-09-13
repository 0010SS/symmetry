from pydantic import BaseModel
from typing import Optional


class ShareholderEvent(BaseModel):
    headline: str
    source: str
    numbers: Optional[dict[str, float | None]] = None  # e.g. {"stake_pct": 9.8, "usd_value": 1.2e9}

class ShareholderNews(BaseModel):
    ticker: str
    from_date: str
    to_date: str
    items: list[ShareholderEvent]

class Sentiment(BaseModel):
    # Use "positive" | "negative" | "neutral" (exact strings).
    label: str
    # Optional confidence or polarity score; if produced, map to [-1,1] where sign matches label.
    score: Optional[float] = None

class IndustrySocialItem(BaseModel):
    headline: str
    source: str                       # publisher/site or subreddit/channel name
    platform: str                     # "Reddit", "X/Twitter", "YouTube", "TikTok", "News site", etc.
    url: str
    published_at: Optional[str] = None  # ISO8601 if known
    numbers: Optional[dict[str, float | int | None]] = None  # {"mentions": 124, "likes": 2300, "retweets": 150, ...}
    summary: str                      # one-sentence factual synopsis (≤ 28 words; required)
    sentiment: Sentiment              # per-item sentiment (required)

class WindowSentiment(BaseModel):
    positive: int
    negative: int
    neutral: int
    net_score: Optional[float] = None   # optional aggregate in [-1, 1]

class IndustrySocialNews(BaseModel):
    ticker: str
    industry: str                      # resolved primary industry/sector for the ticker
    from_date: str
    to_date: str
    items: list[IndustrySocialItem]
    window_summary: str                # REQUIRED one-sentence theme for the period (≤ 28 words)
    window_sentiment: WindowSentiment  # REQUIRED aggregate sentiment counts (+ optional net_score)