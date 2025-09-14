# aggresive_debator.py
import json

def create_risky_debator(llm):

    SOFT_CAPS = {
        "max_size_pct_portfolio": (0, 25),   # broad sanity ceiling only
        "risk_per_trade_pct": (0, 2.5)       # broad sanity ceiling only
    }

    def _clip(v, lo, hi):
        try:
            x = float(v)
            return max(lo, min(hi, x))
        except Exception:
            return lo

    def _ensure_schema(packet):
        # Normalize structure without imposing numeric defaults
        packet.setdefault("debate_text", "")
        packet.setdefault("assumptions", [])
        packet.setdefault("confidence", 0.5)
        packet.setdefault("data_citations", [])
        packet.setdefault("profile_inference", {})
        so = packet.setdefault("strategy_outlines", {})
        for h in ("annual", "swing", "intraday"):
            p = so.setdefault(h, {})
            p.setdefault("direction", "hold")
            p.setdefault("thesis", "")
            p.setdefault("setup", "trendline")
            p.setdefault("entry", {"rule": "", "band": "", "conditions": []})
            p.setdefault("stop", {"rule": "", "level": "", "invalidation": ""})
            p.setdefault("targets", [])
            p.setdefault("sizing", {"max_size_pct_portfolio": 0, "risk_per_trade_pct": 0, "pyramiding": "none"})
            p.setdefault("vol_anchor", "not available")
            p.setdefault("liquidity", {"min_adv_usd": "", "max_spread_bps": "", "notes": ""})
            p.setdefault("time", {"review": "", "max_hold": "", "time_stop": None})
            p.setdefault("contingencies", [])
            p.setdefault("one_liner", "")

            # If hold/wait -> zero out sizing
            if p["direction"] in ("hold", "wait"):
                p["sizing"]["max_size_pct_portfolio"] = 0
                p["sizing"]["risk_per_trade_pct"] = 0

            # Clip to soft caps if model supplied values
            p["sizing"]["max_size_pct_portfolio"] = _clip(
                p["sizing"].get("max_size_pct_portfolio", 0),
                SOFT_CAPS["max_size_pct_portfolio"][0],
                SOFT_CAPS["max_size_pct_portfolio"][1]
            )
            p["sizing"]["risk_per_trade_pct"] = _clip(
                p["sizing"].get("risk_per_trade_pct", 0),
                SOFT_CAPS["risk_per_trade_pct"][0],
                SOFT_CAPS["risk_per_trade_pct"][1]
            )
        return packet

    def risky_node(state) -> dict:
        rds = state["risk_debate_state"]
        history = rds.get("history", "")
        risky_history = rds.get("risky_history", "")

        # Firm inputs
        market_research_report = state.get("market_report", "")
        sentiment_report = state.get("sentiment_report", "")
        news_report = state.get("news_report", "")
        fundamentals_report = state.get("fundamentals_report", "")

        # Industry inputs
        industry_market_report = state.get("industry_market_report", "")
        industry_sentiment_report = state.get("industry_sentiment_report", "")
        industry_fundamentals_report = state.get("industry_fundamentals_report", "")
        industry_company_relatedness_report = state.get("industry_company_relatedness_report", "")

        # Optional quantitative hints if you later add them
        vol_metrics = state.get("vol_metrics", "")               # e.g., ATR %, IV rank
        liquidity_snapshot = state.get("liquidity_snapshot", "") # e.g., ADV$, spread bps
        event_calendar = state.get("event_calendar", "")         # e.g., earnings/FOMC flags

        trader_plan = state.get("trader_investment_plan") or state.get("investment_plan", "")

        prompt = f"""
You are the **Aggressive Risk Analyst**. Your job is to maximize upside capture while managing downside with asymmetric tactics.
You have autonomy to **derive** sizing, risk-per-trade, and stop/target logic from the evidence. Do **not** rely on static defaults.

### Evidence (Firm & Industry)
- Trader plan: {trader_plan}
- Firm Market: {market_research_report}
- Firm Sentiment: {sentiment_report}
- Firm News: {news_report}
- Firm Fundamentals: {fundamentals_report}
- Industry Market: {industry_market_report}
- Industry Sentiment: {industry_sentiment_report}
- Industry Fundamentals: {industry_fundamentals_report}
- Industry Relatedness (pairs/comps/hedges): {industry_company_relatedness_report}
- Volatility metrics (if any): {vol_metrics}
- Liquidity snapshot (if any): {liquidity_snapshot}
- Event calendar / risks (if any): {event_calendar}
- Conversation so far: {history}

### Derive first (explicit):
1) Score **firm–industry alignment** on [-2..+2] (divergent to strongly aligned).
2) Classify **volatility regime**: low / normal / high (brief note).
3) Classify **liquidity**: poor / average / good (use ADV/spread hints or infer from text).
4) Classify **event risk** next 2–6 weeks: low / medium / high (earnings, macro, litigation, policy).
5) Produce a **conviction score** [0..1] and a short rationale tying the above together.
6) Using your aggressive bias, **propose** sizing and risk-per-trade for each horizon (annual, swing, intraday).
   - Make them data-driven via your scores (e.g., increase with alignment & liquidity, decrease with event risk & extreme vol).
   - Include whether pyramiding is appropriate and why.

### Then build three strategy outlines (annual / swing / intraday):
- direction, thesis, setup
- entry {{rule, band (price/%/anchor), conditions[]}}
- stop {{rule, level, invalidation}}
- targets[] as {{level, scale}}
- sizing {{max_size_pct_portfolio, risk_per_trade_pct, pyramiding}} ← use your derived values
- vol_anchor (ATR/IV/σ if you used it)
- liquidity {{min_adv_usd, max_spread_bps, notes}}
- time {{review, max_hold, time_stop (for intraday)}}
- contingencies (event handling, gaps, and **hedges/pairs** suggested by relatedness)
- one_liner (plain English)

### Output STRICT JSON ONLY (no extra text):
{{
  "debate_text": "your concise persuasive case for the aggressive stance",
  "profile_inference": {{
    "alignment_score": -2..2,
    "volatility_regime": "low|normal|high",
    "liquidity_class": "poor|average|good",
    "event_risk": "low|medium|high",
    "conviction": 0..1,
    "horizon_params": {{
      "annual": {{"max_size_pct_portfolio": number, "risk_per_trade_pct": number, "pyramiding": "none|ladder|time-based"}},
      "swing":  {{"max_size_pct_portfolio": number, "risk_per_trade_pct": number, "pyramiding": "none|ladder|time-based"}},
      "intraday": {{"max_size_pct_portfolio": number, "risk_per_trade_pct": number, "pyramiding": "none|ladder|time-based"}}
    }},
    "derivation_notes": "brief bullets explaining how evidence shaped these numbers"
  }},
  "strategy_outlines": {{
    "annual": {{...}},
    "swing": {{...}},
    "intraday": {{...}}
  }},
  "assumptions": ["any missing data or inference you had to make"],
  "confidence": 0..1,
  "data_citations": ["which reports/sections you leaned on"]
}}
""".strip()

        raw = getattr(llm.invoke(prompt), "content", "")
        # Best-effort JSON extraction
        start, end = raw.find("{"), raw.rfind("}")
        payload = raw[start:end+1] if start != -1 and end != -1 else "{}"
        try:
            packet = json.loads(payload)
        except Exception:
            packet = {"debate_text": "JSON parse error", "strategy_outlines": {"annual": {}, "swing": {}, "intraday": {}}}

        packet = _ensure_schema(packet)

        # Update history
        argument = f"Risky Analyst: {packet.get('debate_text','')}"
        new_state = dict(rds)
        new_state["history"] = (rds.get("history","") + "\n" + argument).strip()
        new_state["risky_history"] = (rds.get("risky_history","") + "\n" + argument).strip()
        new_state["latest_speaker"] = "Risky"
        new_state["current_risky_response"] = argument
        new_state["count"] = rds.get("count", 0) + 1

        return {
            "risk_debate_state": new_state,
            "aggressive_strategy_packet": packet
        }

    return risky_node
