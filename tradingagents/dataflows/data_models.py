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
    
class CapitalReturnEvent(BaseModel):
    headline: str
    source: str
    numbers: Optional[dict[str, float | None]] = None  # e.g., {"dividend_per_share": 0.25, "yield_pct": 1.8, "buyback_auth_usd": 5e9}

class CapitalReturnNews(BaseModel):
    ticker: str
    from_date: str
    to_date: str
    items: list[CapitalReturnEvent]

# --- Ownership Structure (snapshot) ---
class OwnershipEvent(BaseModel):
    headline: str
    source: str
    # Examples:
    # Snapshot: {"float_pct": 86.2, "institutional_pct": 70.4, "insider_pct": 1.1, "shares_outstanding": 15.7e9}
    # Holder row: {"stake_pct": 7.6, "shares": 1.23e9, "usd_value": 2.5e10}
    # Share classes: {"class_a_shares": 1.0e9, "class_b_shares": 0.2e9, "votes_per_a": 1.0, "votes_per_b": 10.0}
    numbers: Optional[dict[str, float | None]] = None

class OwnershipNews(BaseModel):
    ticker: str
    from_date: str
    to_date: str
    items: list[OwnershipEvent]

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

class ETFResolution(BaseModel):
    ticker: str
    industry: str                    # e.g., "Semiconductors", "Integrated Oil & Gas"
    etf: str                         # e.g., "SMH", "SOXX", "XLK"
    etf_name: Optional[str] = None   # e.g., "VanEck Semiconductor ETF"
    sources: list[str]               # 1–3 links supporting the choice
    rationale: Optional[str] = None  # one-liner: why this ETF represents the industry

# === Industry Fundamentals ===
from typing import Optional, List, Dict

class IndustryConstituentReportDates(BaseModel):
    ttm_end: Optional[str] = None   # e.g., "2025-06-30"
    mrq: Optional[str] = None       # e.g., "2025-06-30"

class IndustryConstituentFlowsTTM(BaseModel):
    revenue: Optional[float] = None
    cogs: Optional[float] = None
    ebitda: Optional[float] = None
    ebit: Optional[float] = None
    net_income: Optional[float] = None
    cfo: Optional[float] = None
    capex: Optional[float] = None

class IndustryConstituentStocksMRQ(BaseModel):
    cash: Optional[float] = None
    total_debt: Optional[float] = None
    shares_out: Optional[float] = None

class IndustryConstituentMetrics(BaseModel):
    # Valuation & yield
    pe_ttm: Optional[float] = None
    ps_ttm: Optional[float] = None
    ev_ebitda_ttm: Optional[float] = None
    fcf_yield_ttm_pct: Optional[float] = None
    div_yield_pct: Optional[float] = None
    # Profitability
    gross_margin_pct: Optional[float] = None
    oper_margin_pct: Optional[float] = None
    net_margin_pct: Optional[float] = None
    # Quality / returns
    roic_pct: Optional[float] = None
    roe_pct: Optional[float] = None
    # Leverage / coverage / efficiency
    net_debt_to_ebitda: Optional[float] = None
    interest_coverage: Optional[float] = None
    asset_turnover: Optional[float] = None
    # Composite quality indicator
    piotroski_f: Optional[float] = None

class IndustryConstituent(BaseModel):
    ticker: str
    name: Optional[str] = None
    weight: Optional[float] = None         # will be normalized later
    mcap_usd: Optional[float] = None
    currency: Optional[str] = None
    report_dates: Optional[IndustryConstituentReportDates] = None
    flows_ttm: Optional[IndustryConstituentFlowsTTM] = None
    stocks_mrq: Optional[IndustryConstituentStocksMRQ] = None
    metrics: Optional[IndustryConstituentMetrics] = None

class IndustryUniverse(BaseModel):
    source: Optional[str] = None           # "ETF" | "Peers" | "Mixed"
    etfs: Optional[List[str]] = None       # e.g., ["SOXX","SMH"]
    selection_notes: Optional[str] = None

class IndustryComposite(BaseModel):
    # Weighted sums / levels
    revenue_ttm: Optional[float] = None
    ebitda_ttm: Optional[float] = None
    ebit_ttm: Optional[float] = None
    net_income_ttm: Optional[float] = None
    cfo_ttm: Optional[float] = None
    capex_ttm: Optional[float] = None
    cash_mrq: Optional[float] = None
    debt_mrq: Optional[float] = None
    mcap_usd: Optional[float] = None
    # Derived composite ratios
    gross_margin_pct: Optional[float] = None
    oper_margin_pct: Optional[float] = None
    net_margin_pct: Optional[float] = None
    ev_ebitda_ttm: Optional[float] = None
    fcf_yield_ttm_pct: Optional[float] = None
    net_debt_to_ebitda: Optional[float] = None

class IndustryWeightedMeans(BaseModel):
    # Ratio-weighted means across constituents
    pe_ttm: Optional[float] = None
    ps_ttm: Optional[float] = None
    ev_ebitda_ttm: Optional[float] = None
    fcf_yield_ttm_pct: Optional[float] = None
    div_yield_pct: Optional[float] = None
    gross_margin_pct: Optional[float] = None
    oper_margin_pct: Optional[float] = None
    net_margin_pct: Optional[float] = None
    roic_pct: Optional[float] = None
    roe_pct: Optional[float] = None
    net_debt_to_ebitda: Optional[float] = None
    interest_coverage: Optional[float] = None
    asset_turnover: Optional[float] = None
    piotroski_f: Optional[float] = None

class IndustryAggregates(BaseModel):
    composite: IndustryComposite
    weighted_means: IndustryWeightedMeans

class IndustryWinsorization(BaseModel):
    p_low: Optional[float] = None   # e.g., 2.5
    p_high: Optional[float] = None  # e.g., 97.5

class IndustryCoverageStats(BaseModel):
    n_names: int
    weights_sum: Optional[float] = None
    excluded: Optional[List[Dict[str, str]]] = None  # [{"ticker": "...", "reason": "..."}]
    winsorization: Optional[IndustryWinsorization] = None

class IndustryFundamentals(BaseModel):
    ticker: str
    industry: Optional[str] = None           # resolved primary industry/sector
    from_date: str
    to_date: str
    universe: Optional[IndustryUniverse] = None
    method: Optional[str] = None             # "etf_weighted" | "cap_weighted" | "equal_weighted"
    constituents: List[IndustryConstituent]
    aggregates: IndustryAggregates
    coverage_stats: Optional[IndustryCoverageStats] = None
    window_summary: Optional[str] = None     # terse factual note (≤ 28 words)
