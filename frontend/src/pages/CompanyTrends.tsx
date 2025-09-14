import { ArrowLeft, TrendingUp, Activity, Target, Zap, AlertTriangle, BarChart3, DollarSign, Calendar, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

export default function CompanyTrends() {
  const navigate = useNavigate();

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
          <h1 className="text-3xl font-bold">Company Trends Analysis</h1>
        </div>

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
                <div className="text-xl font-bold text-trading-green">+30.2%</div>
                <p className="text-xs text-muted-foreground">$176.93 gain ($230.29 → $395.94)</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Current Close</h3>
                <div className="text-xl font-bold">$395.94</div>
                <p className="text-xs text-muted-foreground">2025-09-12</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">52-Week Range</h3>
                <div className="text-sm">
                  <span className="text-trading-red">Low: $182.63</span><br/>
                  <span className="text-trading-green">High: $462.28</span>
                </div>
                <p className="text-xs text-muted-foreground">+116.8% above low, -14.3% below high</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Current Regime</h3>
                <p className="text-xs text-muted-foreground">
                  Price above 50/200 SMA, 10 EMA sharply rising, MACD surging, RSI at 74.8 (overbought). 
                  Volatility is high and rising.
                </p>
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
                    <span className="text-sm font-medium">$328.52</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">200-day SMA</span>
                    <span className="text-sm font-medium">$330.80</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Price is {">"} 20% above both MAs; strong bullish regime; recent cross above both.
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Key Levels</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Immediate Support</span>
                    <span className="text-sm font-medium">$370–$368</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Resistance</span>
                    <span className="text-sm font-medium">$400 (psych) then $462</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Price has accelerated away from moving averages, indicating a steep uptrend and potential gap risk on mean-reversion.
                  </p>
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
                <div className="text-xl font-bold text-trading-green">10.70</div>
                <p className="text-xs text-muted-foreground">Ramp from NEG to pos in 30 days; strong bullish impulse</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">RSI</h3>
                <div className="text-xl font-bold text-amber-600">74.8</div>
                <p className="text-xs text-muted-foreground">Deep overbought; last breached 70 just this week</p>
                <Badge variant="destructive" className="mt-1">Overbought</Badge>
              </div>
              <div>
                <h3 className="font-semibold mb-2">ATR (20d)</h3>
                <div className="text-xl font-bold">$13.75</div>
                <p className="text-xs text-muted-foreground">Highest in 6 months, signals volatility expansion</p>
                <Badge variant="destructive" className="mt-1">High Risk</Badge>
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
                <div className="text-xl font-bold text-trading-green">+8.4%</div>
                <p className="text-sm text-muted-foreground">(2020–2024, N=5)</p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  Historically positive seasonality for this month, sample solid.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Indicator Panel */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader>
            <CardTitle>Indicator Panel (6)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">1. 50 SMA</span>
                    <span className="font-bold">$328.52</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Strong upward slope, confirms regime</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">2. 200 SMA</span>
                    <span className="font-bold">$330.80</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Price well above; momentum regime change since mid-August</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">3. 10 EMA</span>
                    <span className="font-bold">$356.43</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Sharply above even fast average, signals overdrive extension</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">4. MACD</span>
                    <span className="font-bold text-trading-green">10.70</span>
                  </div>
                  <p className="text-xs text-muted-foreground">New-cycle highs, confirms breakout momentum</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">5. RSI</span>
                    <span className="font-bold text-amber-600">74.8</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Overbought, ripe for pullback; sustained {">"} 70 is rare short-term</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">6. ATR</span>
                    <span className="font-bold">$13.75</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Volatility regime shift higher, increases stop/position risks</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scenarios/Risks */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader className="flex flex-row items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-lg">Scenarios/Risks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border-l-4 border-trading-green bg-trading-green/5">
                <h3 className="font-semibold text-trading-green mb-2">Upside Scenario</h3>
                <p className="text-sm text-muted-foreground">
                  $400+ and retest of $462 (Dec '24 high) if momentum continues and profit-taking is shallow.
                </p>
              </div>
              <div className="p-4 border-l-4 border-amber-500 bg-amber-50">
                <h3 className="font-semibold text-amber-600 mb-2">Pullback Triggers</h3>
                <p className="text-sm text-muted-foreground">
                  Close below $370 or rapid drop into the $355–$340 zone (gap risk to last support/congestion).
                </p>
              </div>
              <div className="p-4 border-l-4 border-trading-red bg-trading-red/5">
                <h3 className="font-semibold text-trading-red mb-2">Invalidation</h3>
                <p className="text-sm text-muted-foreground">
                  Loss of $330 (200SMA) ends trend; confidence reduced if RSI {"<"} 60 and MACD turns down.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Volatility-Driven Squeeze */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader className="flex flex-row items-center gap-2">
            <Zap className="h-5 w-5 text-purple-500" />
            <CardTitle className="text-lg">New Category: Volatility-Driven Squeeze</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Due to a rapid increase in the ATR alongside an explosive price move and overbought RSI, the current action presents a 
              <strong> "volatility-driven squeeze"</strong> dynamic—where high realized volatility and strong price advances may prompt 
              both further upside (from shorts capitulating) and higher risk of a sharp mean-reverting move.
            </p>
          </CardContent>
        </Card>

        {/* Non-obvious Synthesis Insights */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader>
            <CardTitle>Non-obvious Synthesis Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1) Volatility Regime Shift</h3>
              <p className="text-sm text-muted-foreground">
                The 20-day ATR is at new cycle highs (+$13.75) even as price is pushing new highs, warning that stop-outs and 
                oversized daily moves are likely—historically, this has preceded local peaks for TSLA, with at least a $40–$80 
                retrace within 2–3 weeks.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2) Seasonality & Extension</h3>
              <p className="text-sm text-muted-foreground">
                September's usual positive return aligns with the fast, recent price surge. However, with RSI {">"} 74 and the stock 
                already +30% YoY, risk of mean reversion before quarter-end is much higher than normal. This pattern typically 
                results in deep but brief pullbacks (snapdowns) followed by late-month rebounds.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Market Analyst Insights */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader>
            <CardTitle>Market Analyst Insights</CardTitle>
          </CardHeader>
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
                  <TableRow>
                    <TableCell className="font-medium">YoY Relative Strength</TableCell>
                    <TableCell>YoY Return</TableCell>
                    <TableCell>+30.2% ($176.93)</TableCell>
                    <TableCell>Yahoo/Manual</TableCell>
                    <TableCell>Strong outperformer, but extended beyond mean-variance normal</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">52W Extremes</TableCell>
                    <TableCell>Dist. from Low</TableCell>
                    <TableCell>+116.8%</TableCell>
                    <TableCell>Yahoo</TableCell>
                    <TableCell>Accelerated rebound; risk of profit-taking/random snapdown</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">52W Extremes</TableCell>
                    <TableCell>Dist. from High</TableCell>
                    <TableCell>-14.3%</TableCell>
                    <TableCell>Yahoo</TableCell>
                    <TableCell>Still room to resistance ($462), but tail risk elevated</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Trend Regime</TableCell>
                    <TableCell>50/200 SMA</TableCell>
                    <TableCell>$328.5/$330.8</TableCell>
                    <TableCell>Stockstats</TableCell>
                    <TableCell>Price {">"} 20% above; bull trend, but stretched</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Short-Term Acceleration</TableCell>
                    <TableCell>10 EMA</TableCell>
                    <TableCell>$356.4</TableCell>
                    <TableCell>Stockstats</TableCell>
                    <TableCell>Fast upmove — at risk of exhaustion snapback</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Momentum</TableCell>
                    <TableCell>MACD</TableCell>
                    <TableCell>10.7</TableCell>
                    <TableCell>Stockstats</TableCell>
                    <TableCell>Cycle high; confirms strong momentum, but extended</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Overbought Risk</TableCell>
                    <TableCell>RSI</TableCell>
                    <TableCell>74.8</TableCell>
                    <TableCell>Stockstats</TableCell>
                    <TableCell>Overbought — alert for reversal or consolidation</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Volatility Regime</TableCell>
                    <TableCell>ATR (20d)</TableCell>
                    <TableCell>$13.8</TableCell>
                    <TableCell>Stockstats</TableCell>
                    <TableCell>Volatility spike — snapbacks likely; manage risk</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Seasonality</TableCell>
                    <TableCell>Sept. Avg Return</TableCell>
                    <TableCell>+8.4% (N=5)</TableCell>
                    <TableCell>Yahoo/Calc</TableCell>
                    <TableCell>Positive tailwind this month; aligns with upmove</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Volatility-Driven Squeeze</TableCell>
                    <TableCell>Spike+Price Up</TableCell>
                    <TableCell>ATR+%chg</TableCell>
                    <TableCell>Stockstats/Yahoo</TableCell>
                    <TableCell>Squeeze dynamic: Up/more up, then fast correction risk</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Summary & Trading Proposal */}
        <Card className="trading-panel-enhanced">
          <CardHeader>
            <CardTitle>Summary & Trading Proposal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Summary</h3>
              <p className="text-sm text-muted-foreground">
                TSLA is in a parabolic rally: +30% YoY, 20%+ above its 50/200 SMAs, but now in overbought (RSI{">"} 74) and 
                high-volatility (ATR $13.8) regime. While strong momentum/seasonality persist, historical volatility spikes from 
                here often precede swift, sharp corrections before trend resumes. Tight trailing stops and risk discipline highly 
                recommended for new entries here; upside remains ($400–$462), but mean-reversion snap risk is unusually elevated.
              </p>
            </div>
            <div className="p-4 bg-accent/50 rounded-lg border">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                FINAL TRANSACTION PROPOSAL
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-300">HOLD</Badge>
                <span className="text-sm font-medium">Bullish trend persists, but do not add at this level</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Await pullback toward $370–$340 for lower-risk entry; trim/hedge if breaks $370 on volume or momentum rolls.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}