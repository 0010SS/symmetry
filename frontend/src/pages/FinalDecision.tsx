import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ArrowLeft, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Eye, Activity,
  Shield, BarChart3, AlertCircle, Target, DollarSign, Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FinalDecision() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "matrix" | "execution" | "risk" | "monitoring">("overview");
  const [riskData, setRiskData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/data/final_decision.tsla.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) {
          setRiskData(json);
          setLoading(false);
        }
      } catch (e: any) {
        if (!cancelled) {
          setErr(e?.message || "Failed to load data");
          setLoading(false);
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const getDirectionColor = (direction: string) => {
    switch ((direction || "").toLowerCase()) {
      case "buy": return "text-green-600 bg-green-50";
      case "hold": return "text-yellow-600 bg-yellow-50";
      case "sell": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch ((level || "").toLowerCase()) {
      case "low": return "text-green-600 bg-green-50";
      case "medium": return "text-yellow-600 bg-yellow-50";
      case "high": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const renderStrategyMatrix = () => {
    const strategies = riskData?.strategy_matrix;
    if (!strategies) return null;

    const profiles = ["aggressive", "neutral", "conservative"] as const;
    const timeframes = ["annual", "swing", "intraday"] as const;

    return (
      <div className="space-y-6">
        {profiles.map((profile) => (
          <Card key={profile} className="trading-panel-enhanced">
            <CardHeader>
              <CardTitle className="capitalize text-lg">
                {profile} Profile Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {timeframes.map((timeframe) => {
                  const strategy = strategies?.[profile]?.[timeframe];
                  if (!strategy) return null;
                  return (
                    <div key={timeframe} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold capitalize">{timeframe}</h4>
                        <Badge className={getDirectionColor(strategy.direction)}>
                          {String(strategy.direction || "").toUpperCase()}
                        </Badge>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="font-medium">Entry: </span>
                          <span className="text-muted-foreground">{strategy.entry?.rule}</span>
                        </div>

                        {strategy.entry?.band && (
                          <div>
                            <span className="font-medium">Zone: </span>
                            <span className="text-muted-foreground">{strategy.entry.band}</span>
                          </div>
                        )}

                        <div>
                          <span className="font-medium">Stop: </span>
                          <span className="text-muted-foreground">{strategy.stop?.level}</span>
                        </div>

                        {Array.isArray(strategy.targets) && strategy.targets.length > 0 && (
                          <div>
                            <span className="font-medium">Targets: </span>
                            <span className="text-muted-foreground">{strategy.targets.join(", ")}</span>
                          </div>
                        )}

                        {strategy.sizing && (
                          <div>
                            <span className="font-medium">Size: </span>
                            <span className="text-muted-foreground">
                              {strategy.sizing.max_size_pct_portfolio}% / {strategy.sizing.risk_per_trade_pct}%
                            </span>
                          </div>
                        )}

                        {strategy.one_liner && (
                          <div className="pt-2 border-t">
                            <p className="text-xs italic text-muted-foreground">{strategy.one_liner}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface-1 to-surface-2 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="sm" onClick={() => navigate('/')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Final Investment Decision</h1>
          </div>
          <Card><CardContent className="p-6 text-muted-foreground">Loading data…</CardContent></Card>
        </div>
      </div>
    );
  }

  if (err || !riskData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface-1 to-surface-2 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="sm" onClick={() => navigate('/')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Final Investment Decision</h1>
          </div>
          <Card>
            <CardHeader><CardTitle>Error</CardTitle></CardHeader>
            <CardContent className="text-red-600">
              {err || "Unable to load decision data."}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface-1 to-surface-2 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">{riskData?.meta?.pageTitle || "Final Investment Decision"}</h1>
        </div>

        {/* Main Decision Summary */}
        <Card className="trading-panel-enhanced mb-8 border-yellow-500">
          <CardHeader className="bg-gradient-to-r from-yellow-500/10 to-yellow-500/5">
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <AlertCircle className="h-6 w-6" />
              FINAL DECISION: {String(riskData.decision || "").toUpperCase()}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-muted-foreground leading-relaxed mb-6">
              {riskData.decision_rationale}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-600 mb-2">
                  {String((riskData.summary_cards?.action || riskData.decision) ?? "").toUpperCase()}
                </div>
                <p className="text-sm text-muted-foreground">Recommended Action</p>
                <Badge variant="outline" className="mt-2">MAINTAIN POSITIONS</Badge>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-trading-blue mb-2">
                  {riskData.summary_cards?.support_zone || "—"}
                </div>
                <p className="text-sm text-muted-foreground">Support Zone</p>
                <Badge className="mt-2">KEY LEVEL</Badge>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-trading-green mb-2">
                  {riskData.summary_cards?.target_range || "—"}
                </div>
                <p className="text-sm text-muted-foreground">Target Range</p>
                <Badge className="mt-2">UPSIDE POTENTIAL</Badge>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-500 mb-2">
                  {riskData.summary_cards?.stop_level || "—"}
                </div>
                <p className="text-sm text-muted-foreground">Stop Level</p>
                <Badge variant="destructive" className="mt-2">RISK CONTROL</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: "overview", label: "Strategy Overview", icon: Eye },
            { id: "matrix", label: "Strategy Matrix", icon: BarChart3 },
            { id: "execution", label: "Execution Plan", icon: Target },
            { id: "risk", label: "Risk Management", icon: Shield },
            { id: "monitoring", label: "Monitoring", icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id as any)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Snapshot */}
            <Card className="trading-panel-enhanced">
              <CardHeader>
                <CardTitle>Strategy Matrix Snapshot</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="font-semibold">Profile / Timeframe</div>
                    <div className="font-semibold">Direction</div>
                    <div className="font-semibold">Key Details</div>
                  </div>

                  {Object.entries(riskData.strategy_matrix || {}).map(([profile, strategies]: any) =>
                    Object.entries(strategies || {}).map(([timeframe, strategy]: any) => (
                      <div key={`${profile}-${timeframe}`} className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-3 border rounded">
                        <div className="capitalize font-medium">{profile} / {timeframe}</div>
                        <div>
                          <Badge className={getDirectionColor(strategy.direction)}>
                            {String(strategy.direction || "").toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Entry: {strategy.entry?.band || "N/A"} |{" "}
                          Stop: {strategy.stop?.level || "N/A"} |{" "}
                          Size: {strategy.sizing?.max_size_pct_portfolio ?? "—"}%
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Conflicts and Resolutions */}
            <Card className="trading-panel-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Conflicts & Resolutions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(riskData.conflicts_and_resolutions || []).map((conflict: string, index: number) => (
                    <div key={index} className="p-3 border rounded-lg bg-amber-50/50">
                      <p className="text-sm">{conflict}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "matrix" && (
          <div>{renderStrategyMatrix()}</div>
        )}

        {activeTab === "execution" && (
          <div className="space-y-6">
            {/* Execution Ticket */}
            <Card className="trading-panel-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-trading-blue" />
                  Execution Ticket
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <span className="font-medium">Instrument: </span>
                      <span className="text-muted-foreground">{riskData.execution_ticket?.instrument}</span>
                    </div>
                    <div>
                      <span className="font-medium">Side: </span>
                      <span className="text-muted-foreground">{riskData.execution_ticket?.side}</span>
                    </div>
                    <div>
                      <span className="font-medium">Entry Method: </span>
                      <span className="text-muted-foreground">{riskData.execution_ticket?.entry_method}</span>
                    </div>
                    <div>
                      <span className="font-medium">Size Plan: </span>
                      <span className="text-muted-foreground">{riskData.execution_ticket?.initial_size_plan}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <span className="font-medium">Max Slippage: </span>
                      <span className="text-muted-foreground">{riskData.execution_ticket?.max_slippage_bps} bps</span>
                    </div>
                    <div>
                      <span className="font-medium">Time in Force: </span>
                      <span className="text-muted-foreground">{riskData.execution_ticket?.time_in_force}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What Would Change My Mind */}
            <Card className="trading-panel-enhanced">
              <CardHeader>
                <CardTitle>What Would Change My Mind</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(riskData.what_would_change_my_mind || []).map((scenario: string, index: number) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <p className="text-sm">{scenario}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "risk" && (
          <div className="space-y-6">
            {/* Risk Budget Summary */}
            <Card className="trading-panel-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  Risk Budget Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <span className="font-medium">Exposure After Trade: </span>
                    <span className="text-muted-foreground">{riskData.risk_budget_summary?.exposure_after_trade}</span>
                  </div>
                  <div>
                    <span className="font-medium">Position Risk: </span>
                    <span className="text-muted-foreground">{riskData.risk_budget_summary?.position_risk}</span>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-3">Portfolio Risk Considerations</h3>
                    <div className="space-y-2">
                      {(riskData.risk_budget_summary?.portfolio_risk_considerations || []).map((consideration: string, index: number) => (
                        <div key={index} className="p-2 bg-blue-50 rounded text-sm">
                          {consideration}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Hard Constraints</h3>
                    <div className="space-y-2">
                      {(riskData.risk_budget_summary?.hard_constraints || []).map((constraint: string, index: number) => (
                        <div key={index} className="p-2 bg-red-50 rounded text-sm font-medium">
                          {constraint}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lessons Learned */}
            <Card className="trading-panel-enhanced">
              <CardHeader>
                <CardTitle>Lessons Learned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(riskData.lessons_learned || []).map((lesson: string, index: number) => (
                    <div key={index} className="p-3 border rounded-lg bg-green-50/50">
                      <p className="text-sm">{lesson}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "monitoring" && (
          <Card className="trading-panel-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-trading-blue" />
                Monitoring Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(riskData.execution_ticket?.monitoring_checklist || []).map((item: string, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <CheckCircle2 className="h-4 w-4 text-trading-green" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
