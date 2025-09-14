from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Literal, Any

class StrictBase(BaseModel):
    model_config = ConfigDict(extra='forbid')

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

# Keep exposure factors focused & high-signal
ExposureType = Literal[
    "input_materials",        # key raw materials/inputs; hedging/clauses if disclosed
    "supplier_dependency",    # named suppliers; concentration/agreements
    "customer_dependency",    # major customers/verticals; concentration
    "geographic_dependency",  # revenue by region; export controls/tariffs exposure
    "policy_regulatory",      # rules/licensing/subsidies/sanctions affecting the firm
    "index_etf_membership"    # sector/index ETF membership & weights; rebalance notes
]

# ----- Small typed kv for metrics (instead of free dicts) -----
class MetricKV(StrictBase):
    key: str
    value_number: Optional[float] = None   # numeric value if applicable
    value_text: Optional[str] = None       # fallback text if not numeric
    unit: Optional[str] = None             # e.g., "%", "bps", "days"

# ----- Items & rollups -----
class ExposureItem(StrictBase):
    exposure_type: ExposureType
    headline: str
    source: str
    url: str
    published_at: Optional[str] = None
    fact: str = Field(..., description="≤28 words; explicit company–industry linkage; strictly factual")
    metrics: List[MetricKV] = Field(default_factory=list)
    evidence_snippet: Optional[str] = None

class RegionMixItem(StrictBase):
    region: str
    revenue_pct: Optional[float] = None

class CustomerConcentrationItem(StrictBase):
    name: str
    revenue_pct: Optional[float] = None

class ETFWeight(StrictBase):
    symbol: str
    weight_bps: Optional[int] = None
    as_of: Optional[str] = None  # ISO8601

class ExposureRollups(StrictBase):
    segment_revenue_mix: List[RegionMixItem] = Field(default_factory=list)
    customer_concentration: List[CustomerConcentrationItem] = Field(default_factory=list)
    supplier_list: List[str] = Field(default_factory=list)
    key_materials: List[str] = Field(default_factory=list)
    etf_index_membership: List[ETFWeight] = Field(default_factory=list)

# ----- Math indices -----
class MathIndices(StrictBase):
    benchmark: str
    series_frequency: Literal["daily", "hourly"] = "daily"
    method: str = "close-to-close; simple returns"
    from_date: str
    to_date: str
    sample_size: int = 0

    company_return_pct: Optional[float] = None
    benchmark_return_pct: Optional[float] = None
    relative_strength_pct: Optional[float] = None
    beta: Optional[float] = None
    corr: Optional[float] = None
    volatility_ann_pct: Optional[float] = None
    max_drawdown_pct: Optional[float] = None
    risk_free_annual_pct: Optional[float] = None
    abnormal_return_capm_pct: Optional[float] = None

# ----- Top-level package -----
class CompanyCrossPackage(StrictBase):
    ticker: str
    company_name: Optional[str] = None
    from_date: str
    to_date: str
    chosen_benchmark: str
    alternative_benchmarks: List[str] = Field(default_factory=list)
    math_indices: MathIndices
    items: List[ExposureItem] = Field(default_factory=list)
    rollups: Optional[ExposureRollups] = None
    window_summary: str = ""