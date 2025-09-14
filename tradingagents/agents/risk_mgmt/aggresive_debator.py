from __future__ import annotations
from typing import List, Optional, Literal
from pydantic import BaseModel, Field, field_validator
import os


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

def create_risky_debator(llm, schema=None):
    """
    Aggressive Risk Analyst (schema-driven, no fallback).

    Args:
        llm: LangChain LLM/ChatModel supporting `.with_structured_output(schema=...)`
        schema: Pydantic BaseModel (e.g., SafeDebatePackage). If not provided,
                attempts to import from `safe_debator`.
    """
    structured_llm = llm.with_structured_output(schema=SafeDebatePackage)

    def _build_prompt(state: dict) -> str:
        rds = state.get("risk_debate_state", {}) or {}
        history = rds.get("history", "")

        # Firm inputs
        market = state.get("market_report", "") or ""
        senti = state.get("sentiment_report", "") or ""
        news = state.get("news_report", "") or ""
        fund = state.get("fundamentals_report", "") or ""

        # Industry inputs
        imkt = state.get("industry_market_report", "") or ""
        isent = state.get("industry_sentiment_report", "") or ""
        ifund = state.get("industry_fundamentals_report", "") or ""
        irel = state.get("industry_company_relatedness_report", "") or ""

        # Optional quants
        vol = state.get("vol_metrics", "") or ""
        liq = state.get("liquidity_snapshot", "") or ""
        events = state.get("event_calendar", "") or ""

        plan = state.get("trader_investment_plan") or state.get("investment_plan", "") or ""

        return f"""You are the **Aggressive Risk Analyst**.
Maximize upside capture while containing downside with **asymmetric tactics** (tight risk, staged adds, pyramids when warranted).
Derive sizing/stops/targets from evidence—**no static defaults**.

Inputs:
- Trader Plan: {plan}
- Firm — Market: {market}
- Firm — Sentiment: {senti}
- Firm — News: {news}
- Firm — Fundamentals: {fund}
- Industry — Market: {imkt}
- Industry — Sentiment: {isent}
- Industry — Fundamentals: {ifund}
- Industry — Relatedness/Exposures (pairs/hedges/comps): {irel}
- Volatility Metrics: {vol}
- Liquidity Snapshot: {liq}
- Event Calendar: {events}
- Conversation History: {history}

Produce a **single valid {SafeDebatePackage.__name__}** with:
- debate_text: concise persuasive case for the aggressive stance (no special formatting).
- profile_inference:
  • alignment_score (−1..+1 typical; use sign to reflect firm–industry alignment strength),
    volatility_regime, liquidity_class, event_risk,
    conviction ∈ [0,1] with rationale,
    horizon_params for annual/swing/intraday (max_size_pct_portfolio, risk_per_trade_pct, pyramiding).
- strategy_outlines (annual, swing, intraday):
  • direction, thesis, setup,
    entry {{rule, band, conditions[]}},
    stop {{rule, level, invalidation}},
    targets[],
    sizing {{max_size_pct_portfolio, risk_per_trade_pct, pyramiding}},
    vol_anchor, liquidity {{min_adv_usd, max_spread_bps, notes}},
    time {{review, max_hold, time_stop?}},
    contingencies (gaps, events, hedge/pair ideas),
    one_liner.
- assumptions: key drivers/omissions.
- confidence: [0,1].
- data_citations: reference which inputs informed choices.

Constraints for aggressive posture:
- Scale risk with alignment & liquidity; down-weight on high event risk or extreme vol.
- Favor **confirmation-based adds** and **pyramiding** when trend/ breadth/ volume align.
- Be explicit and within schema bounds. Do not fabricate other analysts' quotes.
"""

    def risky_node(state) -> dict:
        rds = dict(state.get("risk_debate_state", {}) or {})
        history = rds.get("history", "")
        risky_history = rds.get("risky_history", "")
        count = rds.get("count", 0)

        prompt = _build_prompt(state)

        # Strict schema: returns a Pydantic instance or raises.
        package = structured_llm.invoke(prompt)
        if isinstance(package, dict):
            package = SafeDebatePackage(**package)

        argument = f"Risky Analyst: {package.debate_text}"

        new_rds = {
            **rds,
            "history": (history + ("\n" if history else "") + argument),
            "risky_history": (risky_history + ("\n" if risky_history else "") + argument),
            "latest_speaker": "Risky",
            "current_risky_response": argument,
            "count": count + 1,
            "risky_structured": package.model_dump(mode='python'),
        }

        # Persist transcript safely
        out_path = os.path.join("output", "risk_manager", "aggressive_debate.md")
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(new_rds["history"])

        return {
            "risk_debate_state": new_rds,
            "aggressive_strategy_packet": package.model_dump(mode="python"),
        }

    return risky_node
