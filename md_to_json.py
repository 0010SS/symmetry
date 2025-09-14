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

from typing import Union

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



# ---------- Example run ----------
if __name__ == "__main__":
    parse_news("output/analysts/company_news.md", "tesla_news.json", NewsData)
    parse_industry_trends("output/analysts/industry_market.md", "tesla_industry_trends.json", IndustryTrendsData)
    parse_industry_fundamentals("output/analysts/industry_fundamentals.md", "tesla_industry_fundamentals.json", IndustryFundamentalsData)
    parse_company_trends("output/analysts/company_market.md", "tesla_company_trends.json", CompanyTrendsData)
