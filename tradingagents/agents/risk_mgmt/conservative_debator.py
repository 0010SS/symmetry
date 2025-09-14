from __future__ import annotations
from typing import List, Optional, Literal
from pydantic import BaseModel, Field, field_validator


# ---------------------------
# Pydantic Schemas
# ---------------------------

class HorizonSizing(BaseModel):
    max_size_pct_portfolio: float = Field(..., ge=0, le=100)
    risk_per_trade_pct: float = Field(..., ge=0, le=100)
    pyramiding: Literal["none", "ladder", "time-based", "scale-in", "scale-out", "fixed"] = "none"

    class Config:
        extra = "forbid"


class HorizonParams(BaseModel):
    annual: HorizonSizing
    swing: HorizonSizing
    intraday: HorizonSizing

    class Config:
        extra = "forbid"


class EntryPlan(BaseModel):
    rule: str
    band: str
    conditions: List[str] = []

    class Config:
        extra = "forbid"


class StopPlan(BaseModel):
    rule: str
    level: str
    invalidation: str

    class Config:
        extra = "forbid"


class LiquidityPlan(BaseModel):
    min_adv_usd: str = "n/a"
    max_spread_bps: str = "n/a"
    notes: str = ""

    class Config:
        extra = "forbid"


class TimePlan(BaseModel):
    review: str
    max_hold: str
    time_stop: Optional[str] = None

    class Config:
        extra = "forbid"


class SizingPlan(BaseModel):
    max_size_pct_portfolio: float = Field(..., ge=0, le=100)
    risk_per_trade_pct: float = Field(..., ge=0, le=100)
    pyramiding: Literal["none", "ladder", "time-based", "scale-in", "scale-out", "fixed"] = "none"

    class Config:
        extra = "forbid"


class StrategyOutline(BaseModel):
    direction: Literal["buy", "sell", "hold", "wait", "reduce", "hedge"] = "wait"
    thesis: str
    setup: str
    entry: EntryPlan
    stop: StopPlan
    targets: List[str] = []
    sizing: SizingPlan
    vol_anchor: str
    liquidity: LiquidityPlan
    time: TimePlan
    contingencies: List[str] = []
    one_liner: str

    class Config:
        extra = "forbid"


class StrategyOutlines(BaseModel):
    annual: StrategyOutline
    swing: StrategyOutline
    intraday: StrategyOutline

    class Config:
        extra = "forbid"


class ProfileInference(BaseModel):
    alignment_score: float = Field(..., ge=-1.0, le=1.0)
    volatility_regime: Literal["low", "moderate", "high"] = "moderate"
    liquidity_class: Literal["thin", "average", "deep"] = "average"
    event_risk: Literal["low", "moderate", "high"] = "moderate"
    conviction: float = Field(..., ge=0.0, le=1.0)
    horizon_params: HorizonParams
    derivation_notes: str = ""

    class Config:
        extra = "forbid"


class SafeDebatePackage(BaseModel):
    debate_text: str = Field(..., description="Short conversational reply by the Safe Analyst.")
    profile_inference: ProfileInference
    strategy_outlines: StrategyOutlines
    assumptions: List[str] = []
    confidence: float = Field(..., ge=0.0, le=1.0)
    data_citations: List[str] = []

    class Config:
        extra = "forbid"

    @field_validator("debate_text")
    @classmethod
    def _trim_debate_text(cls, v: str) -> str:
        return v.strip()


# ---------------------------
# Main factory (no fallback)
# ---------------------------

def create_safe_debator(llm):
    """
    Returns a node that:
      1) Prompts the model as a conservative analyst,
      2) Uses LangChain structured output to produce a SafeDebatePackage,
      3) Updates debate state strictly; if schema validation fails, an exception is raised.
    """

    structured_llm = llm.with_structured_output(schema=SafeDebatePackage)

    def _build_prompt(state: dict) -> str:
        risk_debate_state = state.get("risk_debate_state", {}) or {}

        history = risk_debate_state.get("history", "")
        current_risky_response = risk_debate_state.get("current_risky_response", "")
        current_neutral_response = risk_debate_state.get("current_neutral_response", "")

        market_research_report = state.get("market_report", "")
        sentiment_report = state.get("sentiment_report", "")
        news_report = state.get("news_report", "")
        fundamentals_report = state.get("fundamentals_report", "")
        trader_decision = state.get("trader_investment_plan", "")
        industry_sentiment_report = state.get("industry_sentiment_report", "")
        industry_market_report = state.get("industry_market_report", "")
        industry_fundamentals_report = state.get("industry_fundamentals_report", "")
        industry_cross_signals_report = state.get("industry_cross_signals_report", "")

        return f"""You are the Safe/Conservative Risk Analyst.  
Your mission is to **protect capital, minimize volatility, and prioritize steady long-term growth**.  
You should **critically evaluate the trader’s plan and counter the Risky/Neutral Analysts** wherever they are over-optimistic or underestimating threats.  

⚖️ Debate Rules:
- If Risky/Neutral have not spoken, do **not fabricate their arguments**—simply present your conservative case.  
- Respond in a **short, conversational tone** (no special formatting).  
- Emphasize **downside risks, hidden exposures, liquidity constraints, and volatility regimes**.  

📊 Information you may draw from:
- Trader Decision/Plan: {trader_decision}
- Company Reports:
  • Market Research: {market_research_report}  
  • Social Media Sentiment: {sentiment_report}  
  • Fundamentals: {fundamentals_report}  
  • Latest World Affairs/News: {news_report}  
- Industry Context:
  • Social Sentiment: {industry_sentiment_report}  
  • Market Research: {industry_market_report}  
  • Fundamentals: {industry_fundamentals_report}  
  • Relatedness & Exposure Signals: {industry_cross_signals_report}  
- Conversation History: {history}  
- Last Risky Analyst Reply: {current_risky_response}  
- Last Neutral Analyst Reply: {current_neutral_response}  

🎯 Output Requirements:
Produce a **SafeDebatePackage** object that includes:
- `debate_text`: your short conversational reply as the Safe Analyst.  
- `profile_inference`: your risk and horizon assessment (alignment score, volatility regime, liquidity class, event risk, conviction, horizon sizing, notes).  
- `strategy_outlines`: three outlines (annual, swing, intraday) each with thesis, setup, entry, stop, sizing, liquidity, time, contingencies, one-liner.  
- `assumptions`: key assumptions behind your reasoning.  
- `confidence`: numeric confidence score in [0, 1].  
- `data_citations`: references to the reports above that informed your reasoning.  

Only output a **valid SafeDebatePackage instance** strictly following the schema.
"""


    def safe_node(state: dict) -> dict:
        risk_debate_state = dict(state.get("risk_debate_state", {}) or {})
        history = risk_debate_state.get("history", "")
        safe_history = risk_debate_state.get("safe_history", "")
        count = risk_debate_state.get("count", 0)

        prompt = _build_prompt(state)

        # Model must return a valid SafeDebatePackage or raise
        package: SafeDebatePackage = structured_llm.invoke(prompt)

        argument = f"Safe Analyst: {package.debate_text}"

        new_risk_debate_state = {
            "history": (history + ("\n" if history else "") + argument),
            "risky_history": risk_debate_state.get("risky_history", ""),
            "safe_history": (safe_history + ("\n" if safe_history else "") + argument),
            "neutral_history": risk_debate_state.get("neutral_history", ""),
            "latest_speaker": "Safe",
            "current_risky_response": risk_debate_state.get("current_risky_response", ""),
            "current_safe_response": argument,
            "current_neutral_response": risk_debate_state.get("current_neutral_response", ""),
            "count": count + 1,
            "safe_structured": package.model_dump(mode="python"),
        }

        return {
            "risk_debate_state": new_risk_debate_state,
            "safe_package": package.model_dump(mode="python"),
        }

    return safe_node
