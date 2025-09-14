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

        {/* Seasonality Snapshot */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader className="flex flex-row items-center gap-2">
            <Calendar className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-lg">Seasonality Snapshot - September TSLA Returns (2020-2025)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">Selected close prices at start and end of September each year for return calculation:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">2020</span>
                  <span className="text-trading-red font-bold">-9.7%</span>
                </div>
                <p className="text-xs text-muted-foreground">$158.35 → $143.0</p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">2021</span>
                  <span className="text-trading-green font-bold">+5.6%</span>
                </div>
                <p className="text-xs text-muted-foreground">$244.7 → $258.49</p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">2022</span>
                  <span className="text-trading-red font-bold">-4.4%</span>
                </div>
                <p className="text-xs text-muted-foreground">$277.16 → $265.25</p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">2023</span>
                  <span className="text-trading-green font-bold">+12.7%</span>
                </div>
                <p className="text-xs text-muted-foreground">$245.01 → $276.04</p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">2024</span>
                  <span className="text-trading-green font-bold">+13.6%</span>
                </div>
                <p className="text-xs text-muted-foreground">$230.29 → $261.63</p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">2025</span>
                  <span className="text-trading-green font-bold">+20.2%</span>
                </div>
                <p className="text-xs text-muted-foreground">$329.36 → $395.94 (partial)</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <h3 className="font-semibold">Average September Return (2020-2025)</h3>
                <div className="text-2xl font-bold text-trading-green">+6.3%</div>
                <p className="text-sm text-muted-foreground">Sample size N: 6 years (including partial current year)</p>
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
                <div className="text-xl font-bold text-trading-green">+72.2%</div>
                <p className="text-xs text-muted-foreground">+166.13 points absolute gain</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Current Close</h3>
                <div className="text-xl font-bold">$395.94</div>
                <p className="text-xs text-muted-foreground">2025-09-12</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">52-Week Range</h3>
                <div className="text-sm">
                  <span className="text-trading-red">Low: $218</span><br/>
                  <span className="text-trading-green">High: $480</span>
                </div>
                <p className="text-xs text-muted-foreground">+81.7% above low, -17.5% below high</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Key Points</h3>
                <p className="text-xs text-muted-foreground">
                  Above 50-day SMA (328.52) & 200-day SMA (330.80). RSI 74.8, MACD 10.7. 
                  ATR 13.75 signals elevated volatility. September shows +6.3% avg return.
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
                    +20 point distance (+6.1%) above 50-day SMA and +65 points (+19.7%) above 200-day SMA.
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Key Levels</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Support</span>
                    <span className="text-sm font-medium">SMA zone 330-335</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Resistance</span>
                    <span className="text-sm font-medium">Near 480</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recent price breakouts confirmed by volume strength.
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
                <div className="text-xl font-bold text-trading-green">10.7</div>
                <p className="text-xs text-muted-foreground">Increasing MACD signals bullish momentum acceleration</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">RSI</h3>
                <div className="text-xl font-bold text-amber-600">74.8</div>
                <p className="text-xs text-muted-foreground">High RSI above 70; caution for short-term pullbacks</p>
                <Badge variant="destructive" className="mt-1">Overbought</Badge>
              </div>
              <div>
                <h3 className="font-semibold mb-2">ATR</h3>
                <div className="text-xl font-bold">13.75</div>
                <p className="text-xs text-muted-foreground">ATR indicates higher price variability; expect potential swings</p>
                <Badge variant="destructive" className="mt-1">Moderate Volatility</Badge>
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
                <div className="text-xl font-bold text-trading-green">+6.3%</div>
                <p className="text-sm text-muted-foreground">N=6 years, supportive for continuation of positive trend</p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  September average return +6.3%, N=6 years, supportive for continuation of positive trend in current month.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Indicator Panel */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader>
            <CardTitle>Indicator Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">close_50_sma</span>
                    <span className="font-bold">328.52</span>
                  </div>
                  <p className="text-xs text-muted-foreground">dynamic support</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">close_200_sma</span>
                    <span className="font-bold">330.80</span>
                  </div>
                  <p className="text-xs text-muted-foreground">long-term trend confirmation</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">rsi</span>
                    <span className="font-bold text-amber-600">74.8</span>
                  </div>
                  <p className="text-xs text-muted-foreground">overbought momentum</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">macd</span>
                    <span className="font-bold text-trading-green">10.7</span>
                  </div>
                  <p className="text-xs text-muted-foreground">bullish momentum acceleration</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">boll (middle band)</span>
                    <span className="font-bold">343.28</span>
                  </div>
                  <p className="text-xs text-muted-foreground">bull market benchmark</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">atr</span>
                    <span className="font-bold">13.75</span>
                  </div>
                  <p className="text-xs text-muted-foreground">moderate volatility exposure</p>
                </div>
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
              <div className="p-4 border-l-4 border-trading-green bg-trading-green/5">
                <h3 className="font-semibold text-trading-green mb-2">Bullish</h3>
                <p className="text-sm text-muted-foreground">
                  Sustained price {">"} 330 with RSI moderating.
                </p>
              </div>
              <div className="p-4 border-l-4 border-amber-500 bg-amber-50">
                <h3 className="font-semibold text-amber-600 mb-2">Risk</h3>
                <p className="text-sm text-muted-foreground">
                  RSI above 70 signals short-term overbought correction.
                </p>
              </div>
              <div className="p-4 border-l-4 border-trading-red bg-trading-red/5">
                <h3 className="font-semibold text-trading-red mb-2">Invalidated</h3>
                <p className="text-sm text-muted-foreground">
                  If price falls below 320 (below SMA zone). Watch volume for confirmation or reversal signals.
                </p>
              </div>
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
              <div>
                <h3 className="font-semibold mb-2">Volume Spikes on Rallies</h3>
                <p className="text-sm text-muted-foreground">
                  Volume spikes on rallies bolster bullish trend.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Absence of Volume Spikes on Pullbacks</h3>
                <p className="text-sm text-muted-foreground">
                  Absence of volume spikes on pullbacks facilitates trend resilience.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Non-obvious Insights */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader>
            <CardTitle>Non-obvious Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Strong Recovery & Momentum</h3>
              <p className="text-sm text-muted-foreground">
                Strong recovery from oversold conditions seen in prior Septembers, current-year momentum in September far stronger than prior years.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">SMA Proximity Critical Zone</h3>
              <p className="text-sm text-muted-foreground">
                Close proximity of 50- and 200-day SMA amplifies support; usually a critical inflection zone for price stability or corrections.
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
                    <TableCell className="font-medium">YoY Return</TableCell>
                    <TableCell>Close Price Gain</TableCell>
                    <TableCell>+72.2%</TableCell>
                    <TableCell>Price History 2024-2025</TableCell>
                    <TableCell>Confirmed strong growth momentum</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Trend & Support</TableCell>
                    <TableCell>50 SMA / 200 SMA</TableCell>
                    <TableCell>328.52 / 330.80</TableCell>
                    <TableCell>Stockstats Indicators</TableCell>
                    <TableCell>Indicates robust bullish trend</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Momentum</TableCell>
                    <TableCell>RSI</TableCell>
                    <TableCell>74.8</TableCell>
                    <TableCell>Stockstats Indicators</TableCell>
                    <TableCell>Overbought, watch for possible near-term pullback</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Momentum</TableCell>
                    <TableCell>MACD</TableCell>
                    <TableCell>10.7</TableCell>
                    <TableCell>Stockstats Indicators</TableCell>
                    <TableCell>Bullish momentum accelerating</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Volatility</TableCell>
                    <TableCell>ATR</TableCell>
                    <TableCell>13.75</TableCell>
                    <TableCell>Stockstats Indicators</TableCell>
                    <TableCell>Elevated volatility suggesting potential for swings</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Seasonality</TableCell>
                    <TableCell>September Avg Return</TableCell>
                    <TableCell>+6.3%</TableCell>
                    <TableCell>Seasonality Calculation</TableCell>
                    <TableCell>Historical positive bias in September</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Volume Dynamics</TableCell>
                    <TableCell>Volume Spikes</TableCell>
                    <TableCell>167M recent</TableCell>
                    <TableCell>Price & Volume Data</TableCell>
                    <TableCell>Volume confirms buying strength on rallies</TableCell>
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
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                TSLA remains fundamentally and technically bullish with impressive YoY gains and strong support from moving averages. 
                Momentum readings signal strong buyer control, though RSI warns of near-term overextension. Seasonality for September 
                is positive, supporting continuation potential. Critical support near 330-335 should hold to sustain the uptrend, 
                while volume patterns validate current price action. Monitor RSI and MACD for early signs of momentum shift and potential pullbacks.
              </p>
              <div className="flex items-center gap-4">
                <Badge variant="default" className="text-lg px-4 py-2 bg-trading-green text-white">
                  <DollarSign className="h-4 w-4 mr-2" />
                  BUY
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