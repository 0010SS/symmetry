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

def create_neutral_debator(llm, schema=None):
    """
    Build a Neutral debator node that returns *schema-validated* output via LangChain's
    structured-output pathway. No string-JSON parsing, no fallbacks.

    Args:
        llm: LangChain LLM or ChatModel supporting `.with_structured_output(schema=...)`
        schema: Pydantic BaseModel class describing the debate package.
                Defaults to SafeDebatePackage imported from safe_debator.py
                (pass explicitly if you keep schemas elsewhere).
    """
    # Model-native structured output: provider enforces JSON schema + Pydantic validates it.
    structured_llm = llm.with_structured_output(schema=SafeDebatePackage)

    def _build_prompt(state: dict) -> str:
        rds = state.get("risk_debate_state", {}) or {}
        history = rds.get("history", "")

        # Firm inputs
        market = state.get("market_report", "") or ""
        senti = state.get("sentiment_report", "") or ""
        news = state.get("news_report", "") or ""
        fund = state.get("fundamentals_report", "") or ""

        # Industry inputs (use your existing keys)
        imkt = state.get("industry_market_report", "") or ""
        isent = state.get("industry_sentiment_report", "") or ""
        ifund = state.get("industry_fundamentals_report", "") or ""
        irel = state.get("industry_company_relatedness_report", "") or ""

        vol = state.get("vol_metrics", "") or ""
        liq = state.get("liquidity_snapshot", "") or ""
        events = state.get("event_calendar", "") or ""

        plan = state.get("trader_investment_plan") or state.get("investment_plan", "") or ""

        return f"""You are the **Neutral Risk Analyst**.
Reconcile upside and downside using **evidence-driven** parameters; avoid optimism/pessimism bias.
Your goal is **balance**: position only when firm + industry + liquidity context align; otherwise scale down and wait for confirmation.

Use these inputs:
- Trader Plan: {plan}
- Firm — Market: {market}
- Firm — Sentiment: {senti}
- Firm — News: {news}
- Firm — Fundamentals: {fund}
- Industry — Market: {imkt}
- Industry — Sentiment: {isent}
- Industry — Fundamentals: {ifund}
- Industry — Company Relatedness/Exposure: {irel}
- Volatility Metrics: {vol}
- Liquidity Snapshot: {liq}
- Event Calendar: {events}
- Conversation History: {history}

Output a **single valid {SafeDebatePackage.__name__}** object with:
- debate_text: short, conversational synthesis defending a neutral stance (no special formatting).
- profile_inference:
  • alignment_score (−1..1 preferred for neutral alignment), volatility_regime, liquidity_class, event_risk
  • conviction in [0,1] with internal consistency
  • horizon_params (annual/swing/intraday) with realistic neutral max_size_pct_portfolio and risk_per_trade_pct
- strategy_outlines for annual/swing/intraday:
  • direction, thesis, setup, entry(rule/band/conditions), stop(rule/level/invalidation),
    targets, sizing(max_size_pct_portfolio, risk_per_trade_pct, pyramiding),
    vol_anchor, liquidity(min_adv_usd, max_spread_bps, notes),
    time(review, max_hold, time_stop?), contingencies, one_liner
- assumptions: key drivers behind sizing/conviction
- confidence: [0,1]
- data_citations: cite any inputs you used

Constraints:
- Prefer staged entries, breadth/volume confirmation, and event-aware down-weighting.
- Keep values within schema bounds; be explicit and concrete; do not fabricate other analysts' quotes.
"""

    def neutral_node(state) -> dict:
        rds = dict(state.get("risk_debate_state", {}) or {})
        history = rds.get("history", "")
        neutral_history = rds.get("neutral_history", "")
        count = rds.get("count", 0)

        prompt = _build_prompt(state)

        # Strict: either the model returns a valid Pydantic instance or raises.
        package = structured_llm.invoke(prompt)
        if isinstance(package, dict):
            # Some backends may already coerce; guard for safety.
            package = SafeDebatePackage(**package)

        # For conversation transcript
        argument = f"Neutral Analyst: {package.debate_text}"

        # Update rolling debate state
        new_rds = {
            **rds,
            "history": (history + ("\n" if history else "") + argument),
            "neutral_history": (neutral_history + ("\n" if neutral_history else "") + argument),
            "latest_speaker": "Neutral",
            "current_neutral_response": argument,
            "count": count + 1,
            # Store structured for downstream consumers
            "neutral_structured": package.model_dump(mode="python"),
        }

        # Optional: persist a running markdown log; ensure path exists.
        out_path = os.path.join("output", "risk_manager", "neutral_debate.md")
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(new_rds["history"])

        return {
            "risk_debate_state": new_rds,
            "neutral_strategy_packet": package.model_dump(mode="python"),
        }

    return neutral_node
