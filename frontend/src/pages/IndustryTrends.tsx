import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, Activity, Target, AlertCircle, Calendar, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

export default function IndustryTrends() {
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
          <h1 className="text-3xl font-bold">Industry Trends Analysis</h1>
        </div>

        {/* Executive Summary */}
        <Card className="trading-panel-enhanced mb-6">
          <CardHeader className="flex flex-row items-center gap-2">
            <BarChart3 className="h-5 w-5 text-trading-blue" />
            <CardTitle className="text-lg">Executive Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">ETF Choice</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>DRIV (Global X Autonomous & Electric Vehicles ETF)</strong> - highly representative of the EV/autonomous driving industry; TSLA is a key holding.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">YoY Return</h3>
                <div className="text-xl font-bold text-trading-green">+22.5%</div>
                <p className="text-xs text-muted-foreground">+$4.83: $21.51 → $26.34</p>
                <p className="text-xs text-trading-green">Outperforms most broad equity benchmarks</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">MoM Return</h3>
                <div className="text-xl font-bold text-trading-green">+8.4%</div>
                <p className="text-xs text-muted-foreground">+$2.04: $24.30 → $26.34</p>
                <p className="text-xs text-trading-green">Strong, sustained momentum</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">52W Position</h3>
                <div className="text-xl font-bold">$26.34</div>
                <p className="text-xs text-muted-foreground">52W high $26.47 (~0.5% below)</p>
                <p className="text-xs text-trading-green">Trading near all-time highs</p>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold text-sm mb-2">Relative Strength vs SPY</h3>
              <p className="text-sm text-muted-foreground">
                RS (DRIV/SPY) rose steadily: start ~0.0387, mid ~0.0413, current ~0.0401 (09/12/2025). 
                Uptrend, but recent slight easing—outperformed SPY for much of 2025.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Levels & Regime */}
        <Card className="trading-panel-enhanced mb-6">
          <CardHeader className="flex flex-row items-center gap-2">
            <Target className="h-5 w-5 text-purple-500" />
            <CardTitle className="text-lg">Levels & Regime</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">50/200 SMA State</h3>
              <p className="text-sm text-muted-foreground">
                Price ($26.34) {">"} 50SMA ($25.85 on 09/11/25) {">"} 200SMA ($23.02): <strong className="text-trading-green">Strong uptrend</strong>. 
                Sustained {">"} 200SMA signals dominant long-term strength. No recent cross; 50SMA is steepening.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Key S/R Levels</h3>
              <p className="text-sm text-muted-foreground">
                Resistance at $26.47 (52W high); minor support at $25.45 (recent breakout); 
                major support at $23.00 (close to 200SMA). Distance to 52W high: −0.5%; distance to 52W low: +51%.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Momentum & Volatility */}
        <Card className="trading-panel-enhanced mb-6">
          <CardHeader className="flex flex-row items-center gap-2">
            <Activity className="h-5 w-5 text-trading-green" />
            <CardTitle className="text-lg">Momentum & Volatility</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">MACD (09/11/25)</h3>
              <div className="text-lg font-bold text-trading-green">+0.34</div>
              <p className="text-xs text-muted-foreground">Sustained above zero—bullish momentum but flattening relative to prior weeks</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">RSI (09/12/25)</h3>
              <div className="text-lg font-bold">60.7</div>
              <p className="text-xs text-muted-foreground">Strong bull regime, not overbought (70+), supports continued trend</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">10 EMA (09/11/25)</h3>
              <div className="text-lg font-bold">$26.01</div>
              <p className="text-xs text-muted-foreground">Just below current price, showing momentum is still positive but not extremely extended</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Bollinger Middle</h3>
              <div className="text-lg font-bold">$25.89</div>
              <p className="text-xs text-muted-foreground">Price above mean; volatility is moderate, bands are widening post-breakout</p>
            </div>
          </CardContent>
        </Card>

        {/* Seasonality */}
        <Card className="trading-panel-enhanced mb-6">
          <CardHeader className="flex flex-row items-center gap-2">
            <Calendar className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-lg">Seasonality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div>
                <h3 className="font-semibold">Current-month average return</h3>
                <div className="text-xl font-bold text-trading-green">+2.1%</div>
                <p className="text-sm text-muted-foreground">September (2020–2024, N=5)</p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  September is modestly favorable for DRIV/sector vs. negative S&P seasonality. 
                  (Manual calculation from period closes.)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Indicator Panel */}
        <Card className="trading-panel-enhanced mb-6">
          <CardHeader>
            <CardTitle>Indicator Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Indicator</TableHead>
                    <TableHead className="font-semibold">Value / Signal</TableHead>
                    <TableHead className="font-semibold">Rationale</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">50 SMA</TableCell>
                    <TableCell>$25.85 (above, rising)</TableCell>
                    <TableCell>Medium-term uptrend confirmation</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">200 SMA</TableCell>
                    <TableCell>$23.02 (well below price)</TableCell>
                    <TableCell>Strong long-term bullish regime</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">10 EMA</TableCell>
                    <TableCell>$26.01 (close to price)</TableCell>
                    <TableCell>Responsive trend, confirms short-term strength</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">MACD</TableCell>
                    <TableCell>+0.34 (positive, flattening)</TableCell>
                    <TableCell>Sustained momentum, but some cooling</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">RSI</TableCell>
                    <TableCell>60.7 (bull zone)</TableCell>
                    <TableCell>Not overbought, supportive to trend</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Bollinger Mid</TableCell>
                    <TableCell>$25.89 (price above mid)</TableCell>
                    <TableCell>Confirms price leadership above baseline</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Company Linkage */}
        <Card className="trading-panel-enhanced mb-6">
          <CardHeader className="flex flex-row items-center gap-2">
            <DollarSign className="h-5 w-5 text-trading-blue" />
            <CardTitle className="text-lg">Company Linkage (TSLA & Sector Backdrop)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              • Automaker/EV industry ETF regime is currently <strong className="text-trading-green">bullish, near highs, markedly outperforming SPY YoY</strong>. 
              This bolsters strong index-relative headwinds for TSLA.
            </p>
            <p className="text-sm text-muted-foreground">
              • Technical and momentum indicators confirm the sector's tailwind for company performance. 
              Multiple trend confirmations indicate persistent buyer appetite for the entire EV/autonomous space.
            </p>
            <p className="text-sm text-muted-foreground">
              • Favorable September seasonality for DRIV reduces major systemic headwinds for sector equities 
              (such as TSLA) versus the broader market.
            </p>
            <p className="text-sm text-muted-foreground">
              • Relative momentum has slightly cooled recently, but the regime remains constructive, 
              meaning sector volatility is manageable for TSLA capital deployment and investor confidence.
            </p>
          </CardContent>
        </Card>

        {/* Industry Market Analyst Insights */}
        <Card className="trading-panel-enhanced mb-6">
          <CardHeader>
            <CardTitle>Industry Market Analyst Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Theme</TableHead>
                    <TableHead className="font-semibold">Metric/Signal</TableHead>
                    <TableHead className="font-semibold">Value / Regime</TableHead>
                    <TableHead className="font-semibold">Source/Tool</TableHead>
                    <TableHead className="font-semibold">Takeaway</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Trend Confirmation</TableCell>
                    <TableCell>Price vs. 50/200 SMA</TableCell>
                    <TableCell>$26.34 {">"} $25.85 {">"} $23.02</TableCell>
                    <TableCell>SMA tools</TableCell>
                    <TableCell>Unambiguous uptrend, both med- and long-term</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Near-term Momentum</TableCell>
                    <TableCell>MoM Return</TableCell>
                    <TableCell>+8.4%</TableCell>
                    <TableCell>Yahoo, MoM comp</TableCell>
                    <TableCell>Strong fresh momentum, short-term trend followers engaged</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">52W Positioning</TableCell>
                    <TableCell>High/Low Distance</TableCell>
                    <TableCell>−0.5% from 52W high</TableCell>
                    <TableCell>Yahoo, 52W calculation</TableCell>
                    <TableCell>Running at/near all-time highs, bullish tape</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Relative Strength</TableCell>
                    <TableCell>vs SPY (Ratio/Trend)</TableCell>
                    <TableCell>Uptrend, slight recent ease</TableCell>
                    <TableCell>Yahoo, manual calc</TableCell>
                    <TableCell>Outpaced SPY in 2025, tapering very recently—outperformance is robust</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Momentum Oscillator</TableCell>
                    <TableCell>MACD/RSI</TableCell>
                    <TableCell>+0.34 / 60.7</TableCell>
                    <TableCell>StockStats (MACD, RSI)</TableCell>
                    <TableCell>Bullish momentum, RSI not stretched, but MACD cooling a touch</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Volatility/Breakout</TableCell>
                    <TableCell>Bollinger Middle vs Price</TableCell>
                    <TableCell>$25.89 {"<"} $26.34</TableCell>
                    <TableCell>StockStats (Boll)</TableCell>
                    <TableCell>Above band basis, confirms leadership and manageable volatility</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Liquidity Shifts</TableCell>
                    <TableCell>Volume trends (past 2 months)</TableCell>
                    <TableCell>Sustained, no spikes or drops</TableCell>
                    <TableCell>Yahoo volume</TableCell>
                    <TableCell>No abnormal ETF liquidity compression—no technical stress, solid trading</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Regime Inflection</TableCell>
                    <TableCell>MACD/Price vs Recent Highs</TableCell>
                    <TableCell>MACD flatting, price at highs</TableCell>
                    <TableCell>StockStats, Yahoo</TableCell>
                    <TableCell>Momentum is healthy but shows first hints of cooling (early consolidation risk)</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Evidence-backed Insights */}
        <Card className="trading-panel-enhanced mb-6">
          <CardHeader className="flex flex-row items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-lg">Evidence-backed, Non-obvious Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Liquidity/Participation Quality</h3>
              <p className="text-sm text-muted-foreground">
                Despite rapid climb to highs, DRIV's volume patterns remain stable with no major spikes, 
                suggesting the up-move is well-distributed across buyers—no evidence of 'blow-off' euphoria or a fragile rally.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. Regime Risk Watch</h3>
              <p className="text-sm text-muted-foreground">
                Both MACD flattening and the proximity to new highs (with modest RSI) imply the sector is running hot 
                but may be entering its first "rest period" since the spring. Sector uptrend is intact, but risk of 
                near-term sideways/consolidation action is rising—key for TSLA risk management.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Brief Summary */}
        <Card className="trading-panel-enhanced">
          <CardHeader>
            <CardTitle>Brief Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              The EV/autonomous sector, as proxied by DRIV, exhibits a persistent uptrend both long- and short-term, 
              with very strong YoY/MoM results, near-record highs, and confirmed multi-indicator bullish regime. 
              Outperformance vs SPY corroborates sector allocation flows. Seasonality is supportive. However, 
              technical signals and price action hint at a possible near-term cooling or consolidation phase, 
              so while the medium-term regime is very constructive for TSLA, near-term entry/tactical risk management is prudent. 
              No structural/liquidity risk detected in the ETF.
            </p>
            <div className="mt-4 p-3 bg-accent/50 rounded-lg">
              <p className="text-sm font-semibold text-trading-green">
                TSLA Context: Bullish but Monitor for Short-term Rest/Rotation
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}