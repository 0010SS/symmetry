# risk_manager.py
from __future__ import annotations

import os
import json
from typing import List, Literal, Optional, Type

# Reuse your existing building blocks (adjust import if needed)
# These are the ones you defined for the debators.
from pydantic import BaseModel, Field

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

# ============================
# Manager-specific schema
# ============================

class ManagerSizingPlan(BaseModel):
    """Stricter portfolio ceilings for the manager synthesis layer."""
    max_size_pct_portfolio: float = Field(..., ge=0, le=30)  # manager soft-cap
    risk_per_trade_pct: float = Field(..., ge=0, le=3)       # manager soft-cap
    pyramiding: Literal["none", "ladder", "time-based", "scale-in", "scale-out", "fixed"] = "none"

    class Config:
        extra = "forbid"


class ManagerStrategyOutline(BaseModel):
    direction: Literal["buy", "sell", "hold", "wait", "reduce", "hedge"] = "wait"
    thesis: str
    setup: str
    entry: EntryPlan
    stop: StopPlan
    targets: List[str] = []
    sizing: ManagerSizingPlan                    # <- stricter constraints here
    vol_anchor: str
    liquidity: LiquidityPlan
    time: TimePlan
    contingencies: List[str] = []
    one_liner: str

    class Config:
        extra = "forbid"


class ManagerStrategyTrio(BaseModel):
    annual: ManagerStrategyOutline
    swing: ManagerStrategyOutline
    intraday: ManagerStrategyOutline

    class Config:
        extra = "forbid"


class StrategyMatrix(BaseModel):
    aggressive: ManagerStrategyTrio
    neutral: ManagerStrategyTrio
    conservative: ManagerStrategyTrio

    class Config:
        extra = "forbid"


class ExecutionTicket(BaseModel):
    instrument: str
    side: Literal["buy", "sell", "short", "none"]
    entry_method: str  # e.g., "limit|stop|market + conditions"
    initial_size_plan: str
    max_slippage_bps: str
    time_in_force: Literal["DAY", "GTC", "IOC"]
    monitoring_checklist: List[str] = []

    class Config:
        extra = "forbid"


class RiskBudgetSummary(BaseModel):
    exposure_after_trade: str
    position_risk: str
    portfolio_risk_considerations: List[str] = []
    hard_constraints: List[str] = []

    class Config:
        extra = "forbid"


class RiskManagerPackage(BaseModel):
    decision: Literal["Buy", "Sell", "Hold"]
    decision_rationale: str
    strategy_matrix: StrategyMatrix
    conflicts_and_resolutions: List[str] = []
    execution_ticket: ExecutionTicket
    risk_budget_summary: RiskBudgetSummary
    what_would_change_my_mind: List[str] = []
    lessons_learned: List[str] = []

    class Config:
        extra = "forbid"


# ============================
# Factory
# ============================

def create_risk_manager(llm, memory):
    """
    Portfolio/Risk manager that:
      1) reads three debaters' structured packets,
      2) asks the LLM to reconcile them into a 3×3 Strategy Matrix,
      3) issues a final Buy/Sell/Hold with rationale,
      4) provides an execution ticket + risk budget,
      5) writes back lessons learned for future recall,
      6) preserves existing debate history plumbing.

    Uses model-native structured output with Pydantic (no fallback).
    """

    structured_llm = llm.with_structured_output(schema=RiskManagerPackage)

    def _stringify(obj, fallback="{}"):
        try:
            return json.dumps(obj, ensure_ascii=False)
        except Exception:
            return fallback

    def _build_prompt(state: dict) -> str:
        company_name = state.get("company_of_interest", "")

        rds = state.get("risk_debate_state", {}) or {}
        history = rds.get("history", "")

        # Firm evidence
        market_research_report = state.get("market_report", "") or ""
        sentiment_report       = state.get("sentiment_report", "") or ""
        news_report            = state.get("news_report", "") or ""
        fundamentals_report    = state.get("fundamentals_report", "") or ""

        # Industry evidence
        industry_market_report       = state.get("industry_market_report", "") or ""
        industry_sentiment_report    = state.get("industry_sentiment_report", "") or ""
        industry_fundamentals_report = state.get("industry_fundamentals_report", "") or ""
        industry_company_relatedness = state.get("industry_company_relatedness_report", "") or ""

        # Debaters' packets (already-structured dicts)
        packet_aggr = state.get("aggressive_strategy_packet", {}) or {}
        packet_neut = state.get("neutral_strategy_packet", {}) or {}
        packet_cons = state.get("conservative_strategy_packet", {}) or {}

        # Plan
        trader_plan = state.get("trader_investment_plan") or state.get("investment_plan", "") or ""

        # Past memories
        curr_situation = "\n\n".join([
            market_research_report, sentiment_report, news_report, fundamentals_report,
            industry_market_report, industry_sentiment_report, industry_fundamentals_report
        ])
        past_memories = memory.get_memories(curr_situation, n_matches=3)
        past_memory_str = ""
        for rec in past_memories or []:
            past_memory_str += (rec.get("recommendation", "") + "\n\n")

        # Prompt
        return f"""You are the **Portfolio & Risk Manager** for {company_name}.
Synthesize the Aggressive, Neutral, and Conservative debators' structured packets into a final, coherent plan with strict risk discipline.
Prioritize internal consistency (direction ↔ entry/stop/targets), adherence to liquidity/event constraints, and business-limit sizing.

Key ceilings for synthesized sizing:
- max_size_pct_portfolio ≤ 30
- risk_per_trade_pct ≤ 3

### Evidence (firm)
- Market: {market_research_report}
- Sentiment: {sentiment_report}
- News: {news_report}
- Fundamentals: {fundamentals_report}

### Evidence (industry)
- Industry Market: {industry_market_report}
- Industry Sentiment: {industry_sentiment_report}
- Industry Fundamentals: {industry_fundamentals_report}
- Relatedness (pairs/comps/hedges): {industry_company_relatedness}

### Trader plan
{trader_plan}

### Debaters' packets (JSON)
- Aggressive: {_stringify(packet_aggr)}
- Neutral: {_stringify(packet_neut)}
- Conservative: {_stringify(packet_cons)}

### Debate transcript (citations)
{history}

### Past lessons
{past_memory_str}

### Tasks
A) **Reconcile** the three packets; when in conflict, select or hybridize with rationale.
B) **Validate** coherence (direction, entries, stops, targets), and enforce sizing soft-caps.
C) **Decide** Buy/Sell/Hold (avoid Hold unless truly warranted).
D) **Execution**: produce a ticket and monitoring checklist.
E) **Teach forward**: lessons learned & what would change your mind.

Produce a **single valid RiskManagerPackage** object:
- decision: Buy|Sell|Hold
- decision_rationale: short narrative citing key arguments/evidence
- strategy_matrix: aggressive/neutral/conservative × (annual/swing/intraday),
  each outline with: direction, thesis, setup, entry(rule/band/conditions), stop(rule/level/invalidation),
  targets, sizing(max_size_pct_portfolio, risk_per_trade_pct, pyramiding) ← respect caps,
  vol_anchor, liquidity(min_adv_usd, max_spread_bps, notes),
  time(review, max_hold, time_stop?), contingencies, one_liner
- conflicts_and_resolutions: bullet points of major disagreements and resolutions
- execution_ticket: instrument, side, entry_method, initial_size_plan, max_slippage_bps, time_in_force, monitoring_checklist[]
- risk_budget_summary: exposure_after_trade, position_risk, portfolio_risk_considerations[], hard_constraints[]
- what_would_change_my_mind: explicit invalidation triggers
- lessons_learned: concise, portable takeaways

Only output a valid RiskManagerPackage instance (no extra text).
"""

    def risk_manager_node(state) -> dict:
        # Invoke structured output (raises on invalid)
        prompt = _build_prompt(state)
        package: RiskManagerPackage = structured_llm.invoke(prompt)
        if isinstance(package, dict):
            package = RiskManagerPackage(**package)

        # Build a concise human-facing markdown summary like your original
        rds = dict(state.get("risk_debate_state", {}) or {})
        history = rds.get("history", "")

        sm = package.strategy_matrix
        lines = [
            f"# Final decision: **{package.decision}**",
            "",
            package.decision_rationale,
            "",
            "## Strategy Matrix (snapshot)",
        ]

        def _add(profile_name: str, trio: ManagerStrategyTrio):
            for horizon, plan in (("annual", trio.annual), ("swing", trio.swing), ("intraday", trio.intraday)):
                lines.append(
                    f"- **{profile_name.title()} / {horizon.title()}** → {plan.direction} | "
                    f"Entry: {plan.entry.rule} {plan.entry.band} | "
                    f"Stop: {plan.stop.level} | "
                    f"Target1: {plan.targets[0] if plan.targets else 'n/a'} | "
                    f"Size: {plan.sizing.max_size_pct_portfolio}% / {plan.sizing.risk_per_trade_pct}%"
                )

        _add("aggressive", sm.aggressive)
        _add("neutral", sm.neutral)
        _add("conservative", sm.conservative)

        judge_markdown = "\n".join(lines)

        # Persist outputs
        os.makedirs("output/manager", exist_ok=True)
        with open("output/manager/risk_final_decision.md", "w", encoding="utf-8") as f:
            f.write(judge_markdown)
        with open("output/manager/risk_final_packet.json", "w", encoding="utf-8") as f:
            json.dump(package.model_dump(mode="python"), f, indent=2, ensure_ascii=False)

        # Update debate state (preserve your structure)
        new_rds = {
            "judge_decision": judge_markdown,
            "history": history,
            "risky_history": rds.get("risky_history", ""),
            "safe_history": rds.get("safe_history", ""),
            "neutral_history": rds.get("neutral_history", ""),
            "latest_speaker": "Judge",
            "current_risky_response": rds.get("current_risky_response", ""),
            "current_safe_response": rds.get("current_safe_response", ""),
            "current_neutral_response": rds.get("current_neutral_response", ""),
            "count": rds.get("count", 0),
        }

        # Optionally write back “lessons” to memory (if your memory supports it)
        # Example (commented; adapt to your memory API):
        # memory.save({
        #     "situation": "...", "recommendation": package.decision_rationale,
        #     "lessons": package.lessons_learned
        # })

        return {
            "risk_debate_state": new_rds,
            "final_trade_decision": judge_markdown,                 # human-readable
            "final_trade_packet": package.model_dump(mode="python"),# machine-usable
            "strategy_matrix": package.strategy_matrix.model_dump(mode="python"),
        }

    return risk_manager_node
