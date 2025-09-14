import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Target, Shield, Activity, BarChart3, ExternalLink, Network, Zap, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CrossSignals = () => {
  const navigate = useNavigate();

  // Executive Summary Data
  const executiveSummary = {
    linkageScore: 53,
    correlation: 0.40,
    beta: 3.11,
    relativeStrength: 13.18,
    etfWeight: 3.0
  };

  // Linkage Quantification Data
  const linkageMetrics = [
    { metric: "Correlation (corr)", value: "0.40" },
    { metric: "Beta", value: "3.11" },
    { metric: "Exposure items count", value: "5" },
    { metric: "ETF weight pct", value: "3.0%" }
  ];

  // Score calculations
  const scoreCalculations = [
    "corr_score = ((0.40 + 1) / 2) * 100 = 70",
    "beta_score = max(0, 100 - 50*abs(3.11 - 1)) = 0",
    "exposure_score = min(100, (5 / 12)*100) = 41.7",
    "etf_adj = +min(10, 3.0*2) = +6.0"
  ];

  // Supplier & Customer Exposure
  const exposureItems = [
    {
      type: "Lithium Supply",
      description: "CATL lithium mine restart indicating ongoing supply constraints for battery input materials",
      source: "Reuters 2025-09-09",
      confidence: "High"
    },
    {
      type: "Customer Expansion",
      description: "Tesla robotaxi rollout (early-stage), potentially diversifying demand beyond vehicle sales",
      source: "Reuters 2025-09-12",
      confidence: "Medium"
    },
    {
      type: "Market Share",
      description: "US EV market share slipped to 38%, reflecting competitive demand pressure in Tesla's key domestic market",
      source: "Reuters 2025-09-08",
      confidence: "High"
    }
  ];

  // Policy/ETF & Standards Hooks
  const policyHooks = [
    {
      type: "EV Tax Credits",
      description: "US federal EV tax credits program ending per new legislation, reducing price incentives affecting demand for Tesla EVs",
      source: "Reuters 2025-09-10",
      confidence: "High"
    },
    {
      type: "ETF Inclusion",
      description: "Tesla's ~3% weight in Nasdaq-100 ETF (QQQ), with top-10 ranking, implies index fund trading flows influence stock price dynamics",
      source: "Nasdaq 2025-09-12",
      confidence: "High"
    }
  ];

  // Risk Propagation Paths
  const riskPaths = [
    "Lithium supply constraints → potential battery input cost inflation → upward pressure on TSLA production costs",
    "US EV credit expiry → reduced buyer incentives → potential demand contraction in domestic market",
    "High beta (3.11) → amplified stock price moves relative to market swings → increased volatility exposure",
    "QQQ ETF rebalancing or large inflows/outflows → magnified impact on TSLA stock price due to index inclusion & weighting"
  ];

  // Monitoring Triggers
  const monitoringTriggers = [
    "Announcement or adjustments in US EV incentive programs/policies",
    "CATL and lithium supply chain updates affecting battery raw material availability/pricing",
    "Tesla's U.S. EV sales share updates in September 2025",
    "Nasdaq-100 ETF rebalance schedule or quarterly holdings update (~mid-September)",
    "Tesla quarterly earnings (if scheduled) or key product announcements impacting investor sentiment",
    "Broader market volatility shifts impacting high-beta stocks like TSLA"
  ];

  // Cross-Linkage Evidence Table Data
  const evidenceData = [
    {
      exposure: "Geographic",
      headline: "Tesla US market share drops to 38% in August 2025",
      metric: "US EV market share 38%",
      source: "Reuters / Investors.com",
      date: "2025-09-08",
      confidence: "High",
      takeaway: "Domestic competition pressure reducing key market share"
    },
    {
      exposure: "Policy/Regulatory",
      headline: "US EV incentives policy shifting; car credits ending",
      metric: "EV tax credit expiry",
      source: "Reuters",
      date: "2025-09-10",
      confidence: "High",
      takeaway: "Loss of tax credits may dampen EV demand"
    },
    {
      exposure: "ETF Membership",
      headline: "Tesla weight 3% in Nasdaq-100 ETF (QQQ)",
      metric: "QQQ TSLA weight 3%",
      source: "Nasdaq",
      date: "2025-09-12",
      confidence: "High",
      takeaway: "Significant ETF inclusion influences stock trading flows"
    },
    {
      exposure: "Input Materials",
      headline: "Lithium supply tensions (CATL mine restart)",
      metric: "Lithium supply risk high",
      source: "Reuters",
      date: "2025-09-09",
      confidence: "High",
      takeaway: "Supply constraints raise risk of increased battery costs"
    },
    {
      exposure: "Customer Dependency",
      headline: "Tesla robotaxi rollout expands consumer ride-hailing access",
      metric: "Early-stage user base",
      source: "Reuters",
      date: "2025-09-12",
      confidence: "Medium",
      takeaway: "Potential future demand diversification channel"
    }
  ];

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case "High":
        return <Badge variant="destructive">High</Badge>;
      case "Medium":
        return <Badge variant="secondary">Medium</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Cross-Signal Analysis</h1>
              <p className="text-muted-foreground">Industry Cross-Linkage Analysis for TSLA</p>
            </div>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            Last Updated: September 2025
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
                <div className="text-2xl font-bold text-blue-500">{executiveSummary.linkageScore}</div>
                <div className="text-sm text-muted-foreground">Linkage Score</div>
                <Badge variant="secondary" className="mt-1">Mid-level</Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{executiveSummary.correlation}</div>
                <div className="text-sm text-muted-foreground">QQQ Correlation</div>
                <Badge variant="outline" className="mt-1">Moderate</Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{executiveSummary.beta}</div>
                <div className="text-sm text-muted-foreground">Beta</div>
                <Badge variant="destructive" className="mt-1">High Sensitivity</Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">+{executiveSummary.relativeStrength}%</div>
                <div className="text-sm text-muted-foreground">Relative Strength (7d)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">{executiveSummary.etfWeight}%</div>
                <div className="text-sm text-muted-foreground">QQQ Weight</div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm"><strong>Top exposures:</strong> US geographic dependence with declining market share (38% U.S. EV share in August 2025), lithium supply risk, policy shift ending EV tax credits.</p>
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
                    {linkageMetrics.map((metric, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{metric.metric}</TableCell>
                        <TableCell>{metric.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Score Calculations</h3>
                <div className="space-y-2 text-sm font-mono bg-muted p-3 rounded-lg">
                  {scoreCalculations.map((calc, index) => (
                    <div key={index}>{calc}</div>
                  ))}
                  <div className="mt-3 pt-3 border-t font-bold">
                    Linkage Score = round(0.55*70 + 0.25*0 + 0.20*41.7 + 6) = <span className="text-blue-500">53</span> (mid-level linkage)
                  </div>
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
                {exposureItems.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{item.type}</h4>
                      {getConfidenceBadge(item.confidence)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    <p className="text-xs text-muted-foreground">{item.source}</p>
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
                {policyHooks.map((hook, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{hook.type}</h4>
                      {getConfidenceBadge(hook.confidence)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{hook.description}</p>
                    <p className="text-xs text-muted-foreground">{hook.source}</p>
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
              {riskPaths.map((path, index) => (
                <div key={index} className="p-4 border rounded-lg bg-red-50 dark:bg-red-950/20">
                  <p className="text-sm">{path}</p>
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
              {monitoringTriggers.map((trigger, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <CheckCircle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  <p className="text-sm">{trigger}</p>
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
                <strong>High Volatility Analysis:</strong> TSLA's unusually high volatility (60% annualized) combined with high beta, shows sizable price swings that can lead to significant short-term correlation divergence despite moderate Pearson correlation (0.40).
              </p>
              <p className="text-sm text-muted-foreground">
                This variance means linkage score underestimates possible market contagion risk in stress scenarios.
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
              <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20">
                <p className="text-sm">
                  <strong>1.</strong> Despite moderate correlation, Tesla's extreme beta and volatility create outsized sensitivity to market shocks and index fund flows, making it a potential amplifier of broad tech sector moves beyond pure industry trends.
                </p>
              </div>
              <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20">
                <p className="text-sm">
                  <strong>2.</strong> The convergence of tightening lithium supply and policy-driven demand shifts (credit expiry) creates a two-sided supply-demand stress scenario uniquely impactful for Tesla compared to peers, suggesting differentiated risk transmission channels via both input costs and consumer behavior.
                </p>
              </div>
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
                  {evidenceData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.exposure}</TableCell>
                      <TableCell className="max-w-xs">{item.headline}</TableCell>
                      <TableCell>{item.metric}</TableCell>
                      <TableCell>{item.source}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{getConfidenceBadge(item.confidence)}</TableCell>
                      <TableCell className="max-w-xs text-sm">{item.takeaway}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Confidence overall:</strong> High on major market/policy risks, medium on evolving customer exposure due to early-stage rollout, data complete but short window.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrossSignals;