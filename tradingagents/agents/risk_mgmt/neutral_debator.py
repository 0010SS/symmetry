# neutral_debator.py
import json

def create_neutral_debator(llm):

    SOFT_CAPS = {"max_size_pct_portfolio": (0, 20), "risk_per_trade_pct": (0, 2.0)}

    def _clip(v, lo, hi):
        try: return max(lo, min(hi, float(v)))
        except Exception: return lo

    def _ensure_schema(packet):
        packet.setdefault("debate_text", "")
        packet.setdefault("assumptions", [])
        packet.setdefault("confidence", 0.5)
        packet.setdefault("data_citations", [])
        packet.setdefault("profile_inference", {})
        so = packet.setdefault("strategy_outlines", {})
        for h in ("annual","swing","intraday"):
            p = so.setdefault(h, {})
            p.setdefault("direction","hold")
            p.setdefault("thesis","")
            p.setdefault("setup","trendline")
            p.setdefault("entry",{"rule":"","band":"","conditions":[]})
            p.setdefault("stop",{"rule":"","level":"","invalidation":""})
            p.setdefault("targets",[])
            p.setdefault("sizing",{"max_size_pct_portfolio":0,"risk_per_trade_pct":0,"pyramiding":"none"})
            p.setdefault("vol_anchor","not available")
            p.setdefault("liquidity",{"min_adv_usd":"","max_spread_bps":"","notes":""})
            p.setdefault("time",{"review":"","max_hold":"","time_stop":None})
            p.setdefault("contingencies",[])
            p.setdefault("one_liner","")
            if p["direction"] in ("hold","wait"):
                p["sizing"]["max_size_pct_portfolio"]=0
                p["sizing"]["risk_per_trade_pct"]=0
            p["sizing"]["max_size_pct_portfolio"]=_clip(p["sizing"].get("max_size_pct_portfolio",0),*SOFT_CAPS["max_size_pct_portfolio"])
            p["sizing"]["risk_per_trade_pct"]=_clip(p["sizing"].get("risk_per_trade_pct",0),*SOFT_CAPS["risk_per_trade_pct"])
        return packet

    def neutral_node(state) -> dict:
        rds = state["risk_debate_state"]
        history = rds.get("history","")

        # Firm inputs
        market = state.get("market_report","")
        senti = state.get("sentiment_report","")
        news  = state.get("news_report","")
        fund  = state.get("fundamentals_report","")

        # Industry inputs
        imkt  = state.get("industry_market_report","")
        isent = state.get("industry_sentiment_report","")
        ifund = state.get("industry_fundamentals_report","")
        irel  = state.get("industry_company_relatedness_report","")

        vol   = state.get("vol_metrics","")
        liq   = state.get("liquidity_snapshot","")
        events= state.get("event_calendar","")

        plan  = state.get("trader_investment_plan") or state.get("investment_plan","")

        prompt = f"""
You are the **Neutral Risk Analyst**. You must reconcile upside and drawdown with evidence-driven parameters.
Autonomously derive balanced sizing and risk-per-trade—no static defaults.

### Evidence
Trader plan: {plan}
Firm(Market/Sentiment/News/Fundamentals): {market} || {senti} || {news} || {fund}
Industry(Market/Sentiment/Fundamentals/Relatedness): {imkt} || {isent} || {ifund} || {irel}
Volatility: {vol} | Liquidity: {liq} | Events: {events}
Conversation so far: {history}

### Derive first:
- alignment_score [-2..2], volatility_regime, liquidity_class, event_risk
- conviction [0..1] with rationale
- For each horizon, propose sizing/risk/pyramiding suited to a **neutral** stance:
  * prefer staged entries and confirmation (trigger + breadth/volume confirmation)
  * down-weight when sentiment extremes or event risk are high
  * up-weight when firm & industry align and liquidity is good

### Build three strategy outlines with these fields:
(direction, thesis, setup, entry, stop, targets, sizing, vol_anchor, liquidity, time, contingencies, one_liner)

### STRICT JSON ONLY:
{{
  "debate_text": "concise balanced synthesis and critique of other stances",
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
    "derivation_notes": "how evidence shaped these numbers"
  }},
  "strategy_outlines": {{"annual": {{...}}, "swing": {{...}}, "intraday": {{...}}}},
  "assumptions": [],
  "confidence": 0..1,
  "data_citations": []
}}
""".strip()

        raw = getattr(llm.invoke(prompt), "content", "")
        start, end = raw.find("{"), raw.rfind("}")
        payload = raw[start:end+1] if start != -1 and end != -1 else "{}"
        try:
            packet = json.loads(payload)
        except Exception:
            packet = {"debate_text": "JSON parse error", "strategy_outlines": {"annual": {}, "swing": {}, "intraday": {}}}

        packet = _ensure_schema(packet)

        argument = f"Neutral Analyst: {packet.get('debate_text','')}"
        new_rds = dict(rds)
        new_rds["history"] = (rds.get("history","")+ "\n"+ argument).strip()
        new_rds["neutral_history"] = (rds.get("neutral_history","")+ "\n"+ argument).strip()
        new_rds["latest_speaker"] = "Neutral"
        new_rds["current_neutral_response"] = argument
        new_rds["count"] = rds.get("count",0)+1

        with open("output/risk_manager/neutral_debate.md", "w") as f:
            f.write(new_rds["history"])

        return {
            "risk_debate_state": new_rds,
            "neutral_strategy_packet": packet
        }

    return neutral_node
