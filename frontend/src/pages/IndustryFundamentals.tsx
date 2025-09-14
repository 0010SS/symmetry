import { useEffect, useState } from "react";
import { ArrowLeft, TrendingUp, AlertTriangle, BarChart3, DollarSign, Users, Activity } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function IndustryFundamentals() {
  const navigate = useNavigate();
  const { symbol = "TSLA" } = useParams();
  const [data, setData] = useState(null as any);
  const [err, setErr] = useState(null as any);

  useEffect(() => {
    // Served as static assets; ensure this folder is publicly served
    const url = `/frontend-src-data/industry_fundamentals_${symbol}.json`;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load ${url}`);
        return r.json();
      })
      .then(setData)
      .catch((e) => setErr(e.message));
  }, [symbol]);

  if (err) return <div className="p-6 text-red-600">Failed to load: {String(err)}</div>;
  if (!data) return <div className="p-6">Loading…</div>;

  const toneClass = (tone?: string) =>
    tone === "ok" ? "text-trading-green"
    : tone === "warn" ? "text-amber-600"
    : tone === "bad" ? "text-red-500"
    : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface-1 to-surface-2 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(data?.header?.backPath || "/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">{data?.header?.reportTitle || data?.pageTitle}</h1>
        </div>

        {/* Executive Summary */}
        <Card className="trading-panel-enhanced mb-6">
          <CardHeader className="flex flex-row items-center gap-2">
            <TrendingUp className="h-5 w-5 text-trading-green" />
            <CardTitle className="text-lg">Executive Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Industry</p>
                <p className="text-2xl font-bold text-trading-blue">{data?.executiveSummary?.industry}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Method</p>
                <p className="text-sm text-muted-foreground">{data?.executiveSummary?.method}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Top Names by Weight</p>
                <p className="text-sm text-muted-foreground">{data?.executiveSummary?.topNamesByWeight}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Composite Headline Metrics</p>
                <p className="text-sm text-muted-foreground">{data?.executiveSummary?.compositeHeadline}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Composite Fundamentals */}
        <Card className="trading-panel-enhanced mb-6">
          <CardHeader className="flex flex-row items-center gap-2">
            <BarChart3 className="h-5 w-5 text-trading-blue" />
            <CardTitle className="text-lg">Composite Fundamentals (TTM/MRQ)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(data?.compositeFundamentals?.cards || []).map((c: any, idx: number) => (
                <div key={idx} className="bg-gradient-to-r from-trading-green/5 to-trading-blue/5 p-4 rounded-lg border">
                  <p className="text-sm font-medium text-muted-foreground">{c.label}</p>
                  <p className={`text-lg font-bold ${toneClass(c.tone)}`}>{c.value}</p>
                  {c.note ? <p className={`text-xs ${toneClass(c.tone)}`}>{c.note}</p> : null}
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Margins & Ratios</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(data?.compositeFundamentals?.marginsRatios || []).map((m: any, i: number) => (
                  <div key={i} className="bg-gray-50 p-3 rounded-lg border text-center">
                    <p className="text-xs font-medium text-muted-foreground mb-1">{m.label}</p>
                    <p className="text-sm font-bold text-red-500">{m.value}</p>
                    {m.note ? <p className="text-xs text-red-400">{m.note}</p> : null}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {(data?.compositeFundamentals?.ratioPanel || []).map((r: any, i: number) => (
                  <div key={i} className="bg-gray-50 p-3 rounded-lg border text-center">
                    <p className="text-xs font-medium text-muted-foreground mb-1">{r.label}</p>
                    <p className="text-sm font-bold text-red-500">{r.value}</p>
                    {r.note ? <p className="text-xs text-red-400">{r.note}</p> : null}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Constituents */}
        <Card className="trading-panel-enhanced mb-6">
          <CardHeader className="flex flex-row items-center gap-2">
            <Users className="h-5 w-5 text-trading-purple" />
            <CardTitle className="text-lg">Top Constituents (by weight)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticker</TableHead>
                    <TableHead>Weight %</TableHead>
                    <TableHead>Market Cap</TableHead>
                    <TableHead>EV/EBITDA</TableHead>
                    <TableHead>P/E</TableHead>
                    <TableHead>Net Margin</TableHead>
                    <TableHead>ROIC</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(data?.topConstituents || []).map((c: any) => (
                    <TableRow key={c.ticker} className={c.ticker === "TSLA" ? "bg-blue-50 border-blue-200" : ""}>
                      <TableCell className={`font-medium ${c.ticker === "TSLA" ? "text-trading-blue" : ""}`}>{c.ticker}</TableCell>
                      <TableCell className={c.ticker === "TSLA" ? "font-medium text-trading-blue" : ""}>{c.weightPct}</TableCell>
                      <TableCell className={c.marketCap ? "font-medium text-trading-green" : "text-red-500"}>{c.marketCap ?? "—"}</TableCell>
                      <TableCell className={c.evEbitda ? "" : "text-red-500"}>{c.evEbitda ?? "—"}</TableCell>
                      <TableCell className={c.pe ? "" : "text-red-500"}>{c.pe ?? "—"}</TableCell>
                      <TableCell className={c.netMargin ? "" : "text-red-500"}>{c.netMargin ?? "—"}</TableCell>
                      <TableCell className={c.roic ? "" : "text-red-500"}>{c.roic ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Coverage & Notes */}
        <Card className="trading-panel-enhanced mb-6">
          <CardHeader className="flex flex-row items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-lg">Coverage & Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-2">Data Universe</p>
                  <p className="text-sm text-blue-700">{data?.coverageNotes?.dataUniverse}</p>
                </div>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="text-sm font-medium text-green-800 mb-2">Deduplication Method</p>
                  <p className="text-sm text-green-700">{data?.coverageNotes?.deduplicationMethod}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                  <p className="text-sm font-medium text-purple-800 mb-2">Weight Coverage</p>
                  <p className="text-sm text-purple-700">{data?.coverageNotes?.weightCoverage}</p>
                </div>
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <p className="text-sm font-medium text-red-800 mb-2">Data Quality Notice</p>
                  <p className="text-sm text-red-700">{data?.coverageNotes?.dataQualityNotice}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analyst Insights */}
        <Card className="trading-panel-enhanced">
          <CardHeader className="flex flex-row items-center gap-2">
            <Activity className="h-5 w-5 text-trading-green" />
            <CardTitle className="text-lg">Industry Fundamentals Analyst Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Block</TableHead>
                    <TableHead>Metric</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Basis</TableHead>
                    <TableHead>Coverage</TableHead>
                    <TableHead>Takeaway</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(data?.analystInsights || []).map((r: any, i: number) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{r.block}</TableCell>
                      <TableCell>{r.metric}</TableCell>
                      <TableCell>{r.value}</TableCell>
                      <TableCell>{r.basis}</TableCell>
                      <TableCell>{r.coverage}</TableCell>
                      <TableCell>{r.takeaway}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <p className="text-sm font-medium text-amber-800 mb-2">Analysis Recommendation</p>
                <p className="text-sm text-amber-700">{data?.actions?.analysisRecommendation}</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-2">Next Steps</p>
                <p className="text-sm text-blue-700">{data?.actions?.nextSteps}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
