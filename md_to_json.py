import json
from pathlib import Path
from typing import List, Literal, Optional, Union
from pydantic import BaseModel
from openai import OpenAI

# ---------- Pydantic schema ----------

class AnalystInsight(BaseModel):
    theme: Literal["Macroeconomic", "Sector", "Company", "Shareholder/Legal", "Regulatory"]
    event: str
    date: str
    magnitude: str
    source: str
    takeaway: str

class NewsData(BaseModel):
    meta: dict
    one_sentence_summary: str
    macroeconomicContext: List[str]
    sectorTrends: List[str]
    companyEvents: List[str]
    shareholderEvents: List[str]
    regulatoryLegal: List[str]
    analystInsights: List[AnalystInsight]
    executiveSummary: str
    finalProposal: str

# ---------- Industry Trends schema ----------

class ExecSummaryItem(BaseModel):
    label: str
    text: str

class IndicatorRow(BaseModel):
    theme: str
    metric: str
    value: str
    source: str
    takeaway: str

class Insight(BaseModel):
    label: str
    text: str

class InsightsCategory(BaseModel):
    title: str
    insights: List[Insight]

class IndustryTrendsData(BaseModel):
    pageTitle: str
    executiveSummary: List[ExecSummaryItem]
    levelsRegime: List[str]
    momentumVolatility: List[str]
    seasonality: List[str]
    indicatorPanel: List[IndicatorRow]
    companyLinkage: List[str]
    additionalInsights: List[InsightsCategory]
    summary: str

# ---------- Industry Fundamentals schema ----------

class _IF_Header(BaseModel):
    reportTitle: str
    backPath: str

class _IF_ExecSummary(BaseModel):
    industry: str
    method: str
    topNamesByWeight: str
    compositeHeadline: str

class _IF_SimpleCard(BaseModel):
    label: str
    value: str
    note: Optional[str] = None
    tone: Optional[Literal["ok", "warn", "bad"]] = None

class _IF_SimpleMetric(BaseModel):
    label: str
    value: str
    note: Optional[str] = None

class _IF_CompositeFundamentals(BaseModel):
    cards: List[_IF_SimpleCard]
    marginsRatios: List[_IF_SimpleMetric]
    ratioPanel: List[_IF_SimpleMetric]

class _IF_TopConstituent(BaseModel):
    ticker: str
    weightPct: float
    marketCap: Optional[str] = None
    evEbitda: Optional[str] = None
    pe: Optional[str] = None
    netMargin: Optional[str] = None
    roic: Optional[str] = None

class _IF_CoverageNotes(BaseModel):
    dataUniverse: str
    deduplicationMethod: str
    weightCoverage: str
    dataQualityNotice: str

class _IF_InsightsRow(BaseModel):
    block: str
    metric: str
    value: str
    basis: str
    coverage: str
    takeaway: str

class _IF_Actions(BaseModel):
    analysisRecommendation: str
    nextSteps: str

class IndustryFundamentalsData(BaseModel):
    pageTitle: str
    header: _IF_Header
    executiveSummary: _IF_ExecSummary
    compositeFundamentals: _IF_CompositeFundamentals
    topConstituents: List[_IF_TopConstituent]
    coverageNotes: _IF_CoverageNotes
    analystInsights: List[_IF_InsightsRow]
    actions: _IF_Actions

# ---------- Company Trends schema ----------

class _CT_SeasonYear(BaseModel):
    year: int
    start: Union[float, str]
    end: Union[float, str]
    return_pct: Union[float, str]
    note: str

class _CT_SeasonalitySnapshot(BaseModel):
    heading: str
    month: str
    years: List[_CT_SeasonYear]
    avg_return_pct: Union[float, str]
    sample_note: str

class _CT_52W(BaseModel):
    low: Union[float, str]
    high: Union[float, str]
    above_low_pct: Union[float, str]
    below_high_pct: Union[float, str]

class _CT_ExecSummary(BaseModel):
    yoy_return_pct: Union[float, str]
    absolute_gain_pts: Union[float, str]
    current_close: Union[float, str]
    current_close_date: str
    range_52w: _CT_52W
    key_points: str

class _CT_TrendLevels(BaseModel):
    sma50: Union[float, str]
    sma200: Union[float, str]
    distance_to_50_pts: Union[float, str]
    distance_to_50_pct: Union[float, str]
    distance_to_200_pts: Union[float, str]
    distance_to_200_pct: Union[float, str]
    support: str
    resistance: str
    note: str

class _CT_MomentumVol(BaseModel):
    macd: Union[float, str]
    rsi: Union[float, str]
    atr: Union[float, str]
    rsi_badge: Optional[str] = None
    atr_badge: Optional[str] = None

class _CT_SeasonalityBlock(BaseModel):
    september_avg_return_pct: Union[float, str]
    n_years: Union[int, str]
    note: str

class _CT_Indicator(BaseModel):
    name: str
    value: str
    note: Optional[str] = None

class _CT_Scenario(BaseModel):
    type: Literal["bullish", "risk", "invalidated"]
    title: str
    text: str

class _CT_TextItem(BaseModel):
    title: str
    text: str

class _CT_TableRow(BaseModel):
    theme: str
    metric: str
    value: str
    source: str
    takeaway: str

class _CT_SummaryProposal(BaseModel):
    summary: str
    action_label: str

class CompanyTrendsData(BaseModel):
    meta: dict
    seasonality_snapshot: _CT_SeasonalitySnapshot
    exec_summary: _CT_ExecSummary
    trend_levels: _CT_TrendLevels
    momentum_vol: _CT_MomentumVol
    seasonality: _CT_SeasonalityBlock
    indicator_panel: List[_CT_Indicator]
    scenarios_risks: List[_CT_Scenario]
    volume_dynamics: List[_CT_TextItem]
    insights: List[_CT_TextItem]
    analyst_table: List[_CT_TableRow]
    summary_proposal: _CT_SummaryProposal

# ---------- Market Sentiment (dual-MD → single JSON) ----------

class _MS_Meta(BaseModel):
    pageTitle: str
    ticker: str
    period_start: str
    period_end: str

class _MS_CompanyBlock(BaseModel):
    badge: dict                  # {"label": "...", "tone": "green|amber|red"}
    stock_price: str
    stock_note: str
    peak_mentions_range: str
    peak_note: str
    key_focus_areas: List[str]
    market_stability_note: str

class _MS_Breakdown(BaseModel):
    positive: str | int
    negative: str | int
    neutral: str | int

class _MS_Dynamic(BaseModel):
    icon: str    # "up" | "down" | "warn"
    text: str

class _MS_IndustryBlock(BaseModel):
    badge: dict                  # {"label": "...", "tone": "..."}
    net_score: str
    breakdown: _MS_Breakdown
    dynamics: List[_MS_Dynamic]
    supply_chain_note: str

class _MS_TimelineItem(BaseModel):
    title: str
    window: str
    tone: str     # "pos" | "neg" | "neu"
    summary: str
    note: str

class _MS_TableRow(BaseModel):
    theme: str
    platform: str
    source: str
    date_window: str
    metric: str
    value: str
    confidence: str
    takeaway: str

class _MS_TextItem(BaseModel):
    title: str
    text: str

class _MS_ActionItem(BaseModel):
    text: str

class _MS_FinalProposal(BaseModel):
    label: str
    text: str

class MarketSentimentData(BaseModel):
    meta: _MS_Meta

    # merged from two MD files:
    company: _MS_CompanyBlock
    industry: _MS_IndustryBlock

    timelines: dict              # {"company":[_MS_TimelineItem...], "industry":[_MS_TimelineItem...]}

    company_insights_table: List[_MS_TableRow]
    industry_insights_table: List[_MS_TableRow]

    company_narratives: dict     # {"non_obvious_insights":[_MS_TextItem...], "action_watchlist":[_MS_ActionItem...] }
    industry_narratives: dict    # {"key_narratives":[_MS_TextItem...], "action_watchlist":[_MS_ActionItem...] }

    final_proposals: dict        # {"company": _MS_FinalProposal, "industry": _MS_FinalProposal}

# What we expect from the company MD alone:
class _MS_FromCompanyMD(BaseModel):
    meta: _MS_Meta
    company: _MS_CompanyBlock
    timelines_company: List[_MS_TimelineItem]
    company_insights_table: List[_MS_TableRow]
    company_narratives: dict          # same dict shape as final

    final_company: _MS_FinalProposal

# What we expect from the industry MD alone:
class _MS_FromIndustryMD(BaseModel):
    meta: _MS_Meta                     # allow it; we'll reconcile with company.meta
    industry: _MS_IndustryBlock
    timelines_industry: List[_MS_TimelineItem]
    industry_insights_table: List[_MS_TableRow]
    industry_narratives: dict         # same dict shape as final

    final_industry: _MS_FinalProposal

# ---------- Cross-Signals schema ----------

class _CS_Meta(BaseModel):
    pageTitle: str
    subtitle: str
    last_updated: str
    ticker: str

class _CS_Exec(BaseModel):
    linkageScore: Union[float, str]
    correlation: Union[float, str]
    beta: Union[float, str]
    relativeStrength: Union[float, str]
    etfWeight: Union[float, str]
    top_exposures_note: str

class _CS_Metric(BaseModel):
    metric: str
    value: str

class _CS_Policy(BaseModel):
    type: str
    description: str
    source: str
    confidence: str

class _CS_Item(BaseModel):
    type: str
    description: str
    source: str
    confidence: str

class _CS_Evidence(BaseModel):
    exposure: str
    headline: str
    metric: str
    source: str
    date: str
    confidence: str
    takeaway: str

class _CS_MVI(BaseModel):
    headline: str
    paragraphs: List[str]

class CrossSignalsData(BaseModel):
    meta: _CS_Meta
    executive_summary: _CS_Exec
    linkage_metrics: List[_CS_Metric]
    score_calculations: List[str]
    exposure_items: List[_CS_Item]
    policy_hooks: List[_CS_Policy]
    risk_paths: List[str]
    monitoring_triggers: List[str]
    market_volatility_impact: _CS_MVI
    deep_synthesis_insights: List[str]
    evidence_table: List[_CS_Evidence]

# ---------- Final Decision (dual-source: MD + strategy JSON) ----------

# Strategy JSON (verbatim, validated)
class _FD_Entry(BaseModel):
    rule: str
    band: Optional[str] = None

class _FD_Stop(BaseModel):
    level: str

class _FD_Sizing(BaseModel):
    max_size_pct_portfolio: Union[int, float, str]
    risk_per_trade_pct: Union[int, float, str]

class _FD_Strategy(BaseModel):
    direction: Literal["buy", "hold", "sell"]
    entry: _FD_Entry
    stop: _FD_Stop
    targets: List[str]
    sizing: _FD_Sizing
    one_liner: str

class _FD_Timeframes(BaseModel):
    annual: _FD_Strategy
    swing: _FD_Strategy
    intraday: _FD_Strategy

class _FD_StrategyMatrix(BaseModel):
    aggressive: _FD_Timeframes
    neutral: _FD_Timeframes
    conservative: _FD_Timeframes

# Markdown-only extraction (sub-schema)
class _FD_Meta(BaseModel):
    pageTitle: str
    ticker: str

class _FD_SummaryBlock(BaseModel):
    decision: Literal["buy", "hold", "sell"]
    decision_rationale: str
    support_zone: str
    target_range: str
    stop_level: str

class _FD_ExecTicket(BaseModel):
    instrument: str
    side: str
    entry_method: str
    initial_size_plan: str
    max_slippage_bps: Union[int, float, str]
    time_in_force: str
    monitoring_checklist: List[str]

class _FD_RiskBudget(BaseModel):
    exposure_after_trade: str
    position_risk: str
    portfolio_risk_considerations: List[str]
    hard_constraints: List[str]

class _FD_FromMarkdown(BaseModel):
    meta: _FD_Meta
    summary: _FD_SummaryBlock
    conflicts_and_resolutions: List[str]
    execution_ticket: _FD_ExecTicket
    what_would_change_my_mind: List[str]
    risk_budget_summary: _FD_RiskBudget
    lessons_learned: List[str]

# Final merged payload sent to frontend
class FinalDecisionData(BaseModel):
    meta: _FD_Meta
    decision: str
    decision_rationale: str
    strategy_matrix: _FD_StrategyMatrix
    conflicts_and_resolutions: List[str]
    execution_ticket: _FD_ExecTicket
    what_would_change_my_mind: List[str]
    risk_budget_summary: _FD_RiskBudget
    lessons_learned: List[str]
    # quick cards used at the top
    summary_cards: dict  # {"action":"HOLD","support_zone":"330-335","target_range":"350-420","stop_level":"320"}


# ---------- GPT helper ----------

def parse_news(markdown_file: str, output_file: str, json_schema: BaseModel):
    """Turn a markdown file into structured JSON with GPT-5-nano + Pydantic validation."""

    client = OpenAI()  # Make sure OPENAI_API_KEY is set in your environment

    text = Path(markdown_file).read_text(encoding="utf-8")

    # Prompt the model to fill our schema
    response = client.chat.completions.create(
        model="gpt-5-nano",
        messages=[
            {
                "role": "system",
                "content": "You are a financial analyst assistant. Extract structured data from markdown into the required JSON schema. If some data is missing, and the data is qualitative and will not affect financial decisions, make a best-effort guess based on the content. If the data is missing and is quantitative or will impact financial decisions, return 'N/A'. Ensure the output strictly adheres to the schema provided."
            },
            {
                "role": "user",
                "content": f"Here is the markdown file content:\n\n{text}\n\n"
                           f"Please return JSON strictly matching the schema."
            }
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "NewsData",
                "schema": json_schema.model_json_schema()
            }
        }
    )

    # Response is guaranteed to be valid JSON because of response_format
    raw_response = response.choices[0].message.content
    # raw_json = response.choices[0].message["content"]
    data = json_schema.model_validate_json(raw_response)

    # Save structured JSON
    Path(output_file).write_text(json.dumps(data.model_dump(), indent=2), encoding="utf-8")

    print(f"✅ Company News: Structured data saved to {output_file}")


def parse_industry_trends(markdown_file: str, output_file: str, json_schema: BaseModel):
    """Turn a markdown file into structured Industry Trends JSON with GPT-5-nano + Pydantic validation."""

    client = OpenAI()  # Make sure OPENAI_API_KEY is set

    text = Path(markdown_file).read_text(encoding="utf-8")

    response = client.chat.completions.create(
        model="gpt-5-nano",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a financial analyst assistant. Extract structured industry-trend data "
                    "from markdown into the required JSON schema. "
                    "If some data is missing, and the data is qualitative, make a best-effort guess. "
                    "If quantitative and missing, return 'N/A'. Ensure the output strictly matches the schema."
                )
            },
            {
                "role": "user",
                "content": f"Here is the markdown content:\n\n{text}\n\n"
                           f"Please return JSON strictly matching the schema."
            }
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "IndustryTrendsData",
                "schema": json_schema.model_json_schema()
            }
        }
    )

    raw_response = response.choices[0].message.content
    data = json_schema.model_validate_json(raw_response)

    Path(output_file).write_text(json.dumps(data.model_dump(), indent=2), encoding="utf-8")

    print(f"✅ Industry Trends: Structured data saved to {output_file}")

def parse_industry_fundamentals(markdown_file: str, output_file: str, json_schema: BaseModel):
    """
    Turn an Industry Fundamentals markdown into structured JSON with GPT-5-nano + Pydantic validation.
    The JSON shape matches frontend-src-data/industry_fundamentals_<SYMBOL>.json
    """

    client = OpenAI()  # requires OPENAI_API_KEY

    text = Path(markdown_file).read_text(encoding="utf-8")

    response = client.chat.completions.create(
        model="gpt-5-nano",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a financial analyst assistant. Extract structured *industry fundamentals* data "
                    "from the given markdown into the required JSON schema. "
                    "Keep labels and wording from the markdown whenever possible. "
                    "If qualitative data is missing, make a best-effort plausible fill. "
                    "If quantitative fields are missing (numbers/ratios), set them to '—' or null where appropriate. "
                    "Do NOT invent numbers. Ensure the output strictly matches the provided JSON schema."
                )
            },
            {
                "role": "user",
                "content": f"Markdown:\n\n{text}\n\nReturn ONLY JSON matching the schema."
            }
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "IndustryFundamentalsData",
                "schema": json_schema.model_json_schema()
            }
        }
    )

    raw = response.choices[0].message.content
    data = json_schema.model_validate_json(raw)

    Path(output_file).write_text(
        json.dumps(data.model_dump(), indent=2),
        encoding="utf-8"
    )
    print(f"✅ Industry Fundamentals: Structured data saved to {output_file}")

def parse_company_trends(markdown_file: str, output_file: str, json_schema: BaseModel):
    """Turn a Company Trends markdown into structured JSON for the frontend (seasonality, exec summary, indicators, etc.)."""

    client = OpenAI()  # requires OPENAI_API_KEY
    text = Path(markdown_file).read_text(encoding="utf-8")

    response = client.chat.completions.create(
        model="gpt-5-nano",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a financial analyst assistant. Extract structured *company trends* data "
                    "from the markdown into the required JSON schema (seasonality snapshot, executive summary, "
                    "trend levels, momentum/vol, indicator panel, scenarios/risks, volume dynamics, insights, table, summary). "
                    "Preserve original wording where sensible. If qualitative fields are missing, provide a plausible fill. "
                    "If quantitative fields are missing, use 'N/A' or '—'. Do NOT invent precise numbers."
                )
            },
            {
                "role": "user",
                "content": f"Markdown:\n\n{text}\n\nReturn ONLY JSON matching the schema."
            }
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "CompanyTrendsData",
                "schema": json_schema.model_json_schema()
            }
        }
    )

    raw = response.choices[0].message.content
    data = json_schema.model_validate_json(raw)

    Path(output_file).write_text(
        json.dumps(data.model_dump(), indent=2),
        encoding="utf-8"
    )
    print(f"✅ Company Trends: Structured data saved to {output_file}")

def _gpt_json(text: str, name: str, schema_model: BaseModel):
    client = OpenAI()
    resp = client.chat.completions.create(
        model="gpt-5-nano",
        messages=[
            {
                "role": "system",
                "content": (
                    "Extract structured data from markdown into the required JSON schema. "
                    "Preserve wording for qualitative fields. If qualitative is missing, add a plausible fill; "
                    "if quantitative is missing, use 'N/A' or '—'. Do NOT invent precise numbers. "
                    "Return ONLY JSON matching the schema."
                )
            },
            {"role": "user", "content": f"Markdown:\n\n{text}\n\nReturn ONLY JSON for {name}."}
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {"name": name, "schema": schema_model.model_json_schema()}
        }
    )
    raw = resp.choices[0].message.content
    return schema_model.model_validate_json(raw)

def parse_market_sentiment_dual(
    company_markdown_file: str,
    industry_markdown_file: str,
    output_file: str
):
    # 1) parse company MD
    comp_md = Path(company_markdown_file).read_text(encoding="utf-8")
    comp = _gpt_json(comp_md, "_MS_FromCompanyMD", _MS_FromCompanyMD)

    # 2) parse industry MD
    ind_md = Path(industry_markdown_file).read_text(encoding="utf-8")
    ind = _gpt_json(ind_md, "_MS_FromIndustryMD", _MS_FromIndustryMD)

    # 3) reconcile meta (prefer company, fall back to industry where empty)
    meta = comp.meta
    for k, v in ind.meta.model_dump().items():
        if getattr(meta, k, None) in (None, "", "—", "N/A"):
            setattr(meta, k, v)

    # 4) merge into final MarketSentimentData
    merged = MarketSentimentData(
        meta=meta,
        company=comp.company,
        industry=ind.industry,
        timelines={
            "company": comp.timelines_company,
            "industry": ind.timelines_industry
        },
        company_insights_table=comp.company_insights_table,
        industry_insights_table=ind.industry_insights_table,
        company_narratives=comp.company_narratives,
        industry_narratives=ind.industry_narratives,
        final_proposals={
            "company": comp.final_company,
            "industry": ind.final_industry
        }
    )

    Path(output_file).write_text(
        json.dumps(merged.model_dump(), indent=2),
        encoding="utf-8"
    )
    print(f"✅ Market Sentiment (dual MD): Structured data saved to {output_file}")

def parse_cross_signals(markdown_file: str, output_file: str, json_schema: BaseModel):
    """Turn a Cross-Signals markdown into structured JSON (for CrossSignals.tsx)."""
    client = OpenAI()
    text = Path(markdown_file).read_text(encoding="utf-8")

    response = client.chat.completions.create(
        model="gpt-5-nano",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a financial analyst assistant. Extract structured *cross-signal* linkage data "
                    "from the markdown into the required JSON schema. Keep wording where sensible. "
                    "If qualitative is missing, add a plausible fill. If quantitative is missing, use '—' or 'N/A'. "
                    "Do NOT invent precise numbers. Return ONLY JSON matching the schema."
                )
            },
            {
                "role": "user",
                "content": f"Markdown:\n\n{text}\n\nReturn ONLY JSON matching the schema."
            }
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "CrossSignalsData",
                "schema": json_schema.model_json_schema()
            }
        }
    )

    raw = response.choices[0].message.content
    data = json_schema.model_validate_json(raw)

    Path(output_file).write_text(
        json.dumps(data.model_dump(), indent=2),
        encoding="utf-8"
    )
    print(f"✅ Cross-Signals: Structured data saved to {output_file}")

def _gpt_json_fd(text: str, schema_model: BaseModel):
    client = OpenAI()
    resp = client.chat.completions.create(
        model="gpt-5-nano",
        messages=[
            {
                "role": "system",
                "content": (
                    "Extract structured *final decision* data from markdown into the schema. "
                    "Preserve wording for qualitative text. If qualitative is missing, add a plausible fill. "
                    "If any quantitative field is missing, set to '—' or 'N/A'. Do NOT invent numbers. "
                    "Return ONLY JSON matching the schema."
                )
            },
            {"role": "user", "content": f"Markdown:\n\n{text}\n\nReturn ONLY JSON."}
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {"name": "_FD_FromMarkdown", "schema": schema_model.model_json_schema()}
        }
    )
    return schema_model.model_validate_json(resp.choices[0].message.content)

def parse_final_decision_dual(
    markdown_file: str,
    strategy_json_file: str,
    output_file: str
):
    """
    Panel-specific pipeline:
    - parse markdown into narrative blocks
    - load strategy matrix JSON verbatim
    - merge into one FinalDecisionData JSON for the frontend
    """
    md_text = Path(markdown_file).read_text(encoding="utf-8")
    md_obj = _gpt_json_fd(md_text, _FD_FromMarkdown)

    # Strategy points JSON authored in Lovable; validate to ensure shape
    strategy_raw = json.loads(Path(strategy_json_file).read_text(encoding="utf-8"))
    strategy = _FD_StrategyMatrix(**strategy_raw["strategy_matrix"])

    # Merge
    final = FinalDecisionData(
        meta=md_obj.meta,
        decision=md_obj.summary.decision,
        decision_rationale=md_obj.summary.decision_rationale,
        strategy_matrix=strategy,
        conflicts_and_resolutions=md_obj.conflicts_and_resolutions,
        execution_ticket=md_obj.execution_ticket,
        what_would_change_my_mind=md_obj.what_would_change_my_mind,
        risk_budget_summary=md_obj.risk_budget_summary,
        lessons_learned=md_obj.lessons_learned,
        summary_cards={
            "action": md_obj.summary.decision.upper(),
            "support_zone": md_obj.summary.support_zone,
            "target_range": md_obj.summary.target_range,
            "stop_level": md_obj.summary.stop_level
        }
    )

    Path(output_file).write_text(json.dumps(final.model_dump(), indent=2), encoding="utf-8")
    print(f"✅ Final Decision (dual-source) saved to {output_file}")


# ---------- Example run ----------
if __name__ == "__main__":
    #parse_news("output/analysts/company_news.md", "tesla_news.json", NewsData)
    #parse_industry_trends("output/analysts/industry_market.md", "tesla_industry_trends.json", IndustryTrendsData)
    #parse_industry_fundamentals("output/analysts/industry_fundamentals.md", "tesla_industry_fundamentals.json", IndustryFundamentalsData)
    #parse_company_trends("output/analysts/company_market.md", "tesla_company_trends.json", CompanyTrendsData)
    #parse_market_sentiment_dual(company_markdown_file="output/analysts/company_sentiment.md",
                               #industry_markdown_file="output/analysts/industry_sentiment.md",
                               #output_file="tesla_market_sentiment.json")
    #parse_cross_signals("output/analysts/cross_signals.md", "tesla_cross_signals.json", CrossSignalsData)
    parse_final_decision_dual(markdown_file="output/manager/risk_final_decision.md",
                              strategy_json_file="output/manager/risk_final_packet.json",
                              output_file="final_decision.json")