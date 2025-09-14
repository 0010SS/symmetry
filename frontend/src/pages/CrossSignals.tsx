import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Target, Shield, Activity, BarChart3, ExternalLink, Network, Zap, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import data from "@/data/cross-signals.json";

const CrossSignals = () => {
  const navigate = useNavigate();
  const d = data;

  const getConfidenceBadge = (confidence: string) => {
    if (confidence === "High") return <Badge variant="destructive">High</Badge>;
    if (confidence === "Medium") return <Badge variant="secondary">Medium</Badge>;
    return <Badge variant="outline">Low</Badge>;
  };

  if (!d) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Loading…</h1>
          </div>
        </div>
      </div>
    );
  }

  const S = d.executive_summary;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{d.meta.pageTitle}</h1>
              <p className="text-muted-foreground">{d.meta.subtitle}</p>
            </div>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            Last Updated: {d.meta.last_updated}
          </Badge>
        </div>

        {/* Executive Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{S.linkageScore}</div>
                <div className="text-sm text-muted-foreground">Linkage Score</div>
                <Badge variant="secondary" className="mt-1">Mid-level</Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{S.correlation}</div>
                <div className="text-sm text-muted-foreground">QQQ Correlation</div>
                <Badge variant="outline" className="mt-1">Moderate</Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{S.beta}</div>
                <div className="text-sm text-muted-foreground">Beta</div>
                <Badge variant="destructive" className="mt-1">High Sensitivity</Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">+{S.relativeStrength}%</div>
                <div className="text-sm text-muted-foreground">Relative Strength (7d)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">{S.etfWeight}%</div>
                <div className="text-sm text-muted-foreground">QQQ Weight</div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm"><strong>Top exposures:</strong> {S.top_exposures_note}</p>
            </div>
          </CardContent>
        </Card>

        {/* Linkage Quantification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              Linkage Quantification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Metrics</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {d.linkage_metrics.map((m: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{m.metric}</TableCell>
                        <TableCell>{m.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Score Calculations</h3>
                <div className="space-y-2 text-sm font-mono bg-muted p-3 rounded-lg">
                  {d.score_calculations.map((t: string, i: number) => <div key={i}>{t}</div>)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Supplier & Customer Exposure */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-green-500" />
                Supplier & Customer Exposure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {d.exposure_items.map((it: any, i: number) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{it.type}</h4>
                      {getConfidenceBadge(it.confidence)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{it.description}</p>
                    <p className="text-xs text-muted-foreground">{it.source}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Policy/ETF & Standards Hooks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-500" />
                Policy/ETF & Standards Hooks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {d.policy_hooks.map((it: any, i: number) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{it.type}</h4>
                      {getConfidenceBadge(it.confidence)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{it.description}</p>
                    <p className="text-xs text-muted-foreground">{it.source}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Propagation Paths */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-red-500" />
              Risk Propagation Paths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {d.risk_paths.map((t: string, i: number) => (
                <div key={i} className="p-4 border rounded-lg bg-red-50 dark:bg-red-950/20">
                  <p className="text-sm">{t}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monitoring Triggers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-yellow-500" />
              Monitoring Triggers (Next 2–4 weeks)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {d.monitoring_triggers.map((t: string, i: number) => (
                <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                  <CheckCircle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  <p className="text-sm">{t}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Market Volatility Impact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              Market Volatility Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <p className="text-sm mb-3">
                <strong>{d.market_volatility_impact.headline}:</strong> {d.market_volatility_impact.paragraphs[0]}
              </p>
              <p className="text-sm text-muted-foreground">
                {d.market_volatility_impact.paragraphs[1]}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Deep Synthesis Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Deep Synthesis Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {d.deep_synthesis_insights.map((txt: string, i: number) => (
                <div key={i} className={`p-4 border-l-4 ${i === 0 ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" : "border-green-500 bg-green-50 dark:bg-green-950/20"}`}>
                  <p className="text-sm">
                    <strong>{i + 1}.</strong> {txt}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cross-Linkage Evidence Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-gray-500" />
              Cross-Linkage Evidence Table
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exposure</TableHead>
                    <TableHead>Headline</TableHead>
                    <TableHead>Metric</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Takeaway</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {d.evidence_table.map((it: any, i: number) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{it.exposure}</TableCell>
                      <TableCell className="max-w-xs">{it.headline}</TableCell>
                      <TableCell>{it.metric}</TableCell>
                      <TableCell>{it.source}</TableCell>
                      <TableCell>{it.date}</TableCell>
                      <TableCell>{getConfidenceBadge(it.confidence)}</TableCell>
                      <TableCell className="max-w-xs text-sm">{it.takeaway}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Confidence overall:</strong> High on major market/policy risks; medium on evolving customer exposure due to early-stage rollout; data complete but short window.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrossSignals;
