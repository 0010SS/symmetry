# risk_manager.py
import json
import time

def create_risk_manager(llm, memory):
    """
    Portfolio/Risk manager that:
      1) reads three debaters' structured packets,
      2) asks the LLM to reconcile them into a 3x3 Strategy Matrix,
      3) issues a final Buy/Sell/Hold with rationale,
      4) provides an execution ticket + risk budget,
      5) writes back lessons learned for future recall,
      6) preserves existing debate history plumbing.

    No wrappers, same node style.
    """

    # ---- helpers (lightweight schema normalization & clipping) ----
    SOFT_CAPS = {
        "max_size_pct_portfolio": (0.0, 30.0),   # broad ceilings only
        "risk_per_trade_pct": (0.0, 3.0)
    }

    def _clip_num(v, lo, hi):
        try:
            x = float(v)
            return max(lo, min(hi, x))
        except Exception:
            return 0.0

    def _ensure_plan_schema(plan: dict) -> dict:
        plan = plan or {}
        plan.setdefault("direction", "hold")
        plan.setdefault("thesis", "")
        plan.setdefault("setup", "trendline")
        plan.setdefault("entry", {"rule": "", "band": "", "conditions": []})
        plan.setdefault("stop", {"rule": "", "level": "", "invalidation": ""})
        plan.setdefault("targets", [])
        sizing = plan.setdefault("sizing", {"max_size_pct_portfolio": 0, "risk_per_trade_pct": 0, "pyramiding": "none"})
        sizing["max_size_pct_portfolio"] = _clip_num(sizing.get("max_size_pct_portfolio", 0), *SOFT_CAPS["max_size_pct_portfolio"])
        sizing["risk_per_trade_pct"] = _clip_num(sizing.get("risk_per_trade_pct", 0), *SOFT_CAPS["risk_per_trade_pct"])
        plan.setdefault("vol_anchor", "not available")
        plan.setdefault("liquidity", {"min_adv_usd": "", "max_spread_bps": "", "notes": ""})
        plan.setdefault("time", {"review": "", "max_hold": "", "time_stop": None})
        plan.setdefault("contingencies", [])
        plan.setdefault("one_liner", "")
        # If it's hold/wait, zero out sizing for safety
        if plan["direction"] in ("hold", "wait"):
            plan["sizing"]["max_size_pct_portfolio"] = 0
            plan["sizing"]["risk_per_trade_pct"] = 0
        return plan

    def _ensure_matrix_schema(matrix: dict) -> dict:
        matrix = matrix or {}
        for profile in ("aggressive", "neutral", "conservative"):
            prof = matrix.setdefault(profile, {})
            prof["annual"]   = _ensure_plan_schema(prof.get("annual", {}))
            prof["swing"]    = _ensure_plan_schema(prof.get("swing", {}))
            prof["intraday"] = _ensure_plan_schema(prof.get("intraday", {}))
        return matrix

    def _stringify(obj, fallback="{}"):
        try:
            return json.dumps(obj, ensure_ascii=False)
        except Exception:
            return fallback

    # ---- main node ----
    def risk_manager_node(state) -> dict:
        company_name = state.get("company_of_interest", "")

        rds = state["risk_debate_state"]
        history = rds.get("history", "")

        # Firm-level evidence (fix: fundamentals from correct key)
        market_research_report = state.get("market_report", "")
        sentiment_report       = state.get("sentiment_report", "")
        news_report            = state.get("news_report", "")
        fundamentals_report    = state.get("fundamentals_report", "")  # fixed

        # Industry-level evidence (optional but helpful context)
        industry_market_report         = state.get("industry_market_report", "")
        industry_sentiment_report      = state.get("industry_sentiment_report", "")
        industry_fundamentals_report   = state.get("industry_fundamentals_report", "")
        industry_company_relatedness   = state.get("industry_company_relatedness_report", "")

        # Debaters' structured packets
        packet_aggr = state.get("aggressive_strategy_packet", {})
        packet_neut = state.get("neutral_strategy_packet", {})
        packet_cons = state.get("conservative_strategy_packet", {})

        # Plan (prefer trader_investment_plan; fallback to investment_plan)
        trader_plan = state.get("trader_investment_plan") or state.get("investment_plan", "")

        # Past memories (lessons)
        curr_situation = "\n\n".join([
            market_research_report, sentiment_report, news_report, fundamentals_report,
            industry_market_report, industry_sentiment_report, industry_fundamentals_report
        ])
        past_memories = memory.get_memories(curr_situation, n_matches=3)
        past_memory_str = ""
        for rec in past_memories or []:
            # expects {"recommendation": "..."} style — unchanged from your current code
            past_memory_str += (rec.get("recommendation", "") + "\n\n")

        # ==== PROMPT: judge + portfolio/risk integration ====
        prompt = f"""
You are the **Portfolio & Risk Manager** for {company_name}.
Your job: reconcile three risk-profile strategy packets (Aggressive, Neutral, Conservative) into:
  1) a final **Buy/Sell/Hold** decision,
  2) a unified **3×3 Strategy Matrix** (profiles × horizons),
  3) an **Execution Ticket** (how to place/monitor the trade),
  4) a **Risk Budget Summary** (exposure & constraints),
  5) **Lessons Learned** and **What Would Change My Mind**.

Use evidence from firm & industry reports. Favor clarity, decisiveness, and internal consistency (stops, targets, sizing).

### Evidence (firm)
- Market: {market_research_report}
- Sentiment: {sentiment_report}
- News: {news_report}
- Fundamentals: {fundamentals_report}

### Evidence (industry)
- Industry Market: {industry_market_report}
- Industry Sentiment: {industry_sentiment_report}
- Industry Fundamentals: {industry_fundamentals_report}
- Industry Relatedness (pairs/comps/hedges): {industry_company_relatedness}

### Trader plan
{trader_plan}

### Debaters' packets (JSON)
- Aggressive: {_stringify(packet_aggr)}
- Neutral: {_stringify(packet_neut)}
- Conservative: {_stringify(packet_cons)}

### Debate transcript (for citations)
{history}

### Past lessons (for reflection & bias checks)
{past_memory_str}

### Your tasks
A) **Synthesize** the three packets. Where they conflict, choose the best plan or construct a hybrid; record the rationale.
B) **Validate** for coherence: direction ↔ entry/stop/targets, sizing within sensible limits, liquidity & event constraints acknowledged.
C) **Decide**: Buy/Sell/Hold (avoid Hold unless truly warranted by evidence).
D) **Plan for execution**: ticket details and monitoring checklist.
E) **Teach forward**: concise lessons learned; what would change your mind.

### STRICT JSON OUTPUT ONLY (no prose outside JSON)
{{
  "decision": "Buy|Sell|Hold",
  "decision_rationale": "short narrative citing key arguments/evidence and why chosen over alternatives",
  "strategy_matrix": {{
    "aggressive": {{"annual": {{}}, "swing": {{}}, "intraday": {{}}}},
    "neutral":    {{"annual": {{}}, "swing": {{}}, "intraday": {{}}}},
    "conservative": {{"annual": {{}}, "swing": {{}}, "intraday": {{}}}}
  }},
  "conflicts_and_resolutions": [
    "Bulleted notes explaining major disagreements and how you resolved them for each horizon."
  ],
  "execution_ticket": {{
    "instrument": "{company_name}",
    "side": "buy|sell|short|none",
    "entry_method": "limit|stop|market + conditions",
    "initial_size_plan": "use % of portfolio or notional; justify via liquidity/volatility",
    "max_slippage_bps": "number or rule",
    "time_in_force": "DAY|GTC|IOC",
    "monitoring_checklist": [
      "what to watch intraday/daily (breadth, volume, levels, news catalysts)"
    ]
  }},
  "risk_budget_summary": {{
    "exposure_after_trade": "qualitative if full portfolio unknown",
    "position_risk": "stop distance, R multiple plan",
    "portfolio_risk_considerations": [
      "concentration, correlation, macro/event gates, hedges/overlays"
    ],
    "hard_constraints": [
      "e.g., no overnight for intraday; earnings blackout; liquidity floors"
    ]
  }},
  "what_would_change_my_mind": [
    "clear invalidation triggers (price, time, news, macro)"
  ],
  "lessons_learned": [
    "succinct, portable lessons tying to past memory and today’s decision"
  ]
}}
"""

        # ---- call LLM & parse JSON ----
        raw = getattr(llm.invoke(prompt), "content", "")
        start, end = raw.find("{"), raw.rfind("}")
        payload = raw[start:end+1] if start != -1 and end != -1 else "{}"
        try:
            packet = json.loads(payload)
        except Exception:
            packet = {
                "decision": "Hold",
                "decision_rationale": "JSON parse error from model; defaulting to Hold.",
                "strategy_matrix": {},
                "execution_ticket": {},
                "risk_budget_summary": {},
                "conflicts_and_resolutions": [],
                "what_would_change_my_mind": [],
                "lessons_learned": []
            }

        # ---- normalize the 3x3 matrix and light sanity clipping ----
        packet["strategy_matrix"] = _ensure_matrix_schema(packet.get("strategy_matrix", {}))

        # ---- produce a human-facing summary (Markdown-ish) for backward compatibility ----
        decision = packet.get("decision", "Hold")
        rationale = packet.get("decision_rationale", "")
        summary_lines = [f"# Final decision: **{decision}**", "", rationale, "", "## Strategy Matrix (snapshot)"]
        sm = packet["strategy_matrix"]
        for profile in ("aggressive", "neutral", "conservative"):
            for horizon in ("annual", "swing", "intraday"):
                p = sm[profile][horizon]
                summary_lines.append(
                    f"- **{profile.title()} / {horizon.title()}** → {p['direction']} | "
                    f"Entry: {p['entry']['rule']} {p['entry']['band']} | "
                    f"Stop: {p['stop']['level']} | "
                    f"Target1: {p['targets'][0]['level'] if p['targets'] else 'n/a'} | "
                    f"Size: {p['sizing']['max_size_pct_portfolio']}% / {p['sizing']['risk_per_trade_pct']}%"
                )
        judge_markdown = "\n".join(summary_lines)

        # ---- update debate state (preserve your structure) ----
        new_rds = {
            "judge_decision": judge_markdown,
            "history": rds.get("history", ""),
            "risky_history": rds.get("risky_history", ""),
            "safe_history": rds.get("safe_history", ""),
            "neutral_history": rds.get("neutral_history", ""),
            "latest_speaker": "Judge",
            "current_risky_response": rds.get("current_risky_response", ""),
            "current_safe_response": rds.get("current_safe_response", ""),
            "current_neutral_response": rds.get("current_neutral_response", ""),
            "count": rds.get("count", 0),
        }

        # ---- return combined outputs ----
        return {
            "risk_debate_state": new_rds,
            # human-readable for your logs/UI:
            "final_trade_decision": judge_markdown,
            # machine-usable for downstream execution/simulation:
            "final_trade_packet": packet,
            "strategy_matrix": packet.get("strategy_matrix", {}),
        }

    return risk_manager_node
