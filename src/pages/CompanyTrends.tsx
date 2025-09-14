import { ArrowLeft, TrendingUp, Activity, Target, Zap, AlertTriangle, BarChart3, DollarSign, Calendar, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

export default function CompanyTrends() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load JSON from /public/data/...
  useEffect(() => {
    fetch('/data/company_trends.tsla.sept.json', { cache: 'no-store' })
      .then(r => r.json())
      .then(j => setData(j))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface-1 to-surface-2 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="sm" onClick={() => navigate('/')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Loading…</h1>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const s = data.seasonality_snapshot;
  const es = data.exec_summary;
  const tl = data.trend_levels;
  const mv = data.momentum_vol;
  const seas = data.seasonality;
  const indicators = data.indicator_panel || [];
  const scenarios = data.scenarios_risks || [];
  const volumes = data.volume_dynamics || [];
  const insights = data.insights || [];
  const tableRows = data.analyst_table || [];
  const summary = data.summary_proposal?.summary || '';
  const actionLabel = data.summary_proposal?.action_label || '';

  // helpers
  const fmtPct = (x) => (typeof x === 'number' ? `${x > 0 ? '+' : ''}${x.toFixed(1)}%` : x);
  const retColor = (v) => v >= 0 ? 'text-trading-green' : 'text-trading-red';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface-1 to-surface-2 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" onClick={() => navigate('/')} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">{data.meta?.title || 'Company Trends Analysis'}</h1>
        </div>

        {/* Seasonality Snapshot */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader className="flex flex-row items-center gap-2">
            <Calendar className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-lg">{s.heading}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Selected close prices at start and end of {s.month} each year for return calculation:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {s.years.map((y) => (
                <div key={y.year} className="p-3 border rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-medium">{y.year}</span>
                    <span className={`${retColor(y.return_pct)} font-bold`}>{fmtPct(y.return_pct)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{y.note}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <h3 className="font-semibold">Average {s.month} Return (2020-2025)</h3>
                <div className={`text-2xl font-bold ${retColor(s.avg_return_pct)}`}>{fmtPct(s.avg_return_pct)}</div>
                <p className="text-sm text-muted-foreground">{s.sample_note}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Executive Summary */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader className="flex flex-row items-center gap-2">
            <BarChart3 className="h-5 w-5 text-trading-green" />
            <CardTitle className="text-lg">Executive Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <h3 className="font-semibold text-sm">YoY Return</h3>
                <div className={`text-xl font-bold ${retColor(es.yoy_return_pct)}`}>{fmtPct(es.yoy_return_pct)}</div>
                <p className="text-xs text-muted-foreground">+{es.absolute_gain_pts} points absolute gain</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Current Close</h3>
                <div className="text-xl font-bold">${es.current_close}</div>
                <p className="text-xs text-muted-foreground">{es.current_close_date}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">52-Week Range</h3>
                <div className="text-sm">
                  <span className="text-trading-red">Low: ${es.range_52w.low}</span><br />
                  <span className="text-trading-green">High: ${es.range_52w.high}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  +{es.range_52w.above_low_pct}% above low, -{es.range_52w.below_high_pct}% below high
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Key Points</h3>
                <p className="text-xs text-muted-foreground">{es.key_points}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trend & Levels */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader className="flex flex-row items-center gap-2">
            <Target className="h-5 w-5 text-trading-blue" />
            <CardTitle className="text-lg">Trend & Levels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Moving Averages</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">50-day SMA</span>
                    <span className="text-sm font-medium">${tl.sma50}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">200-day SMA</span>
                    <span className="text-sm font-medium">${tl.sma200}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +{tl.distance_to_50_pts} point distance (+{tl.distance_to_50_pct}%) above 50-day SMA and +{tl.distance_to_200_pts} points (+{tl.distance_to_200_pct}%) above 200-day SMA.
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Key Levels</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Support</span>
                    <span className="text-sm font-medium">{tl.support}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Resistance</span>
                    <span className="text-sm font-medium">{tl.resistance}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{tl.note}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Momentum & Volatility */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader className="flex flex-row items-center gap-2">
            <Activity className="h-5 w-5 text-trading-green" />
            <CardTitle className="text-lg">Momentum & Volatility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">MACD</h3>
                <div className="text-xl font-bold text-trading-green">{mv.macd}</div>
                <p className="text-xs text-muted-foreground">Increasing MACD signals bullish momentum acceleration</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">RSI</h3>
                <div className="text-xl font-bold text-amber-600">{mv.rsi}</div>
                <p className="text-xs text-muted-foreground">High RSI above 70; caution for short-term pullbacks</p>
                <Badge variant="destructive" className="mt-1">{mv.rsi_badge}</Badge>
              </div>
              <div>
                <h3 className="font-semibold mb-2">ATR</h3>
                <div className="text-xl font-bold">{mv.atr}</div>
                <p className="text-xs text-muted-foreground">ATR indicates higher price variability; expect potential swings</p>
                <Badge variant="destructive" className="mt-1">{mv.atr_badge}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seasonality */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader className="flex flex-row items-center gap-2">
            <Calendar className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-lg">Seasonality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div>
                <h3 className="font-semibold">September Average Return</h3>
                <div className={`text-xl font-bold ${retColor(seas.september_avg_return_pct)}`}>{fmtPct(seas.september_avg_return_pct)}</div>
                <p className="text-sm text-muted-foreground">N={seas.n_years} years, supportive for continuation of positive trend</p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{seas.note}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Indicator Panel */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader><CardTitle>Indicator Panel</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                {indicators.slice(0, 3).map((it, i) => (
                  <div key={`ind-l-${i}`} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{it.name}</span>
                      <span className="font-bold">{it.value}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{it.note}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {indicators.slice(3).map((it, i) => (
                  <div key={`ind-r-${i}`} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{it.name}</span>
                      <span className="font-bold">{it.value}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{it.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scenarios & Risks */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader className="flex flex-row items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-lg">Scenarios & Risks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scenarios.map((sc, i) => {
                const tone = sc.type === 'bullish' ? 'border-trading-green bg-trading-green/5 text-trading-green'
                           : sc.type === 'invalidated' ? 'border-trading-red bg-trading-red/5 text-trading-red'
                           : 'border-amber-500 bg-amber-50 text-amber-600';
                return (
                  <div key={i} className={`p-4 border-l-4 ${tone.replace(' text-',' ').split(' ')[2]}`}>
                    <h3 className={`font-semibold mb-2 ${tone.includes('text-') ? tone.match(/text-[^ ]+/)?.[0] : ''}`}>{sc.title}</h3>
                    <p className="text-sm text-muted-foreground">{sc.text}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Volume Dynamics */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader className="flex flex-row items-center gap-2">
            <BarChart3 className="h-5 w-5 text-trading-blue" />
            <CardTitle className="text-lg">Volume Dynamics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {volumes.map((v, i) => (
                <div key={i}>
                  <h3 className="font-semibold mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Non-obvious Insights */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader><CardTitle>Non-obvious Insights</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {insights.map((ins, i) => (
              <div key={i}>
                <h3 className="font-semibold mb-2">{ins.title}</h3>
                <p className="text-sm text-muted-foreground">{ins.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Market Analyst Insights */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader><CardTitle>Market Analyst Insights</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Theme</TableHead>
                    <TableHead className="font-semibold">Metric/Signal</TableHead>
                    <TableHead className="font-semibold">Value</TableHead>
                    <TableHead className="font-semibold">Source/Tool</TableHead>
                    <TableHead className="font-semibold">Takeaway/Alert</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableRows.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{r.theme}</TableCell>
                      <TableCell>{r.metric}</TableCell>
                      <TableCell>{r.value}</TableCell>
                      <TableCell>{r.source}</TableCell>
                      <TableCell>{r.takeaway}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Summary & Trading Proposal */}
        <Card className="trading-panel-enhanced">
          <CardHeader><CardTitle>Summary & Trading Proposal</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{summary}</p>
              <div className="flex items-center gap-4">
                <Badge variant="default" className="text-lg px-4 py-2 bg-trading-green text-white">
                  <DollarSign className="h-4 w-4 mr-2" />
                  {actionLabel}
                </Badge>
                <span className="text-sm text-muted-foreground">Final transaction proposal</span>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
