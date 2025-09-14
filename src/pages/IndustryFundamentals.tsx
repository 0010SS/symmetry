import { ArrowLeft, Building2, TrendingUp, AlertTriangle, BarChart3, DollarSign, Target, Users, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function IndustryFundamentals() {
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
          <h1 className="text-3xl font-bold">Industry Fundamentals Analysis</h1>
        </div>

        {/* Executive Summary */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader className="flex flex-row items-center gap-2">
            <Building2 className="h-5 w-5 text-trading-blue" />
            <CardTitle className="text-lg">Executive Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <h3 className="font-semibold text-sm">Industry</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>Auto Manufacturers</strong> (method: ETF-weighted, global auto/EV/tech exposure)
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Names Covered</h3>
                <div className="text-xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">weights sum: 1.0000</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Top Anchors</h3>
                <p className="text-sm text-muted-foreground">
                  AAPL (19.2%), GOOGL (15%), TSLA (12.8%), MSFT, NVDA, TM
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Key Metrics</h3>
                <p className="text-sm text-muted-foreground">
                  EV/EBITDA: <strong>0.00</strong> (data gap)<br/>
                  Net Margin: <strong>23.8%</strong>
                </p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <p className="text-sm text-amber-800">
                  <strong>Notable metric gaps:</strong> P/E, FCF yield, and others unavailable (aggregate level only margins present)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Composite Fundamentals */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader className="flex flex-row items-center gap-2">
            <BarChart3 className="h-5 w-5 text-trading-green" />
            <CardTitle className="text-lg">Composite Fundamentals (TTM/MRQ)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <h3 className="font-semibold text-sm mb-2">Revenue</h3>
                <div className="text-2xl font-bold">$201B</div>
                <p className="text-xs text-muted-foreground">TTM Composite</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-2">EBITDA</h3>
                <div className="text-2xl font-bold">$37B</div>
                <p className="text-xs text-muted-foreground">TTM Composite</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-2">EBIT</h3>
                <div className="text-2xl font-bold">$33B</div>
                <p className="text-xs text-muted-foreground">TTM Composite</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-2">Net Income</h3>
                <div className="text-2xl font-bold text-trading-green">$48B</div>
                <p className="text-xs text-muted-foreground">TTM Composite</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-2">Operating Margin</h3>
                <div className="text-2xl font-bold text-trading-green">16.2%</div>
                <Progress value={64} className="mt-1" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-2">Net Margin</h3>
                <div className="text-2xl font-bold text-trading-green">23.8%</div>
                <Progress value={95} className="mt-1" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-2">EV/EBITDA</h3>
                <div className="text-2xl font-bold text-muted-foreground">0.00</div>
                <p className="text-xs text-trading-red">Data gap</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-2">Net Debt/EBITDA</h3>
                <div className="text-2xl font-bold">0.00</div>
                <p className="text-xs text-muted-foreground">Net cash position</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Valuation & Returns Panel */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader className="flex flex-row items-center gap-2">
            <DollarSign className="h-5 w-5 text-purple-500" />
            <CardTitle className="text-lg">Valuation & Returns Panel (Weighted Means)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <h3 className="font-semibold text-sm">P/E</h3>
                <div className="text-lg font-bold text-muted-foreground">—</div>
                <p className="text-xs text-trading-red">Unavailable</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-sm">P/S</h3>
                <div className="text-lg font-bold text-muted-foreground">—</div>
                <p className="text-xs text-trading-red">Unavailable</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-sm">EV/EBITDA</h3>
                <div className="text-lg font-bold text-muted-foreground">—</div>
                <p className="text-xs text-trading-red">Unavailable</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-sm">Dividend Yield</h3>
                <div className="text-lg font-bold text-muted-foreground">—</div>
                <p className="text-xs text-trading-red">Unavailable</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-sm">FCF Yield</h3>
                <div className="text-lg font-bold text-muted-foreground">—</div>
                <p className="text-xs text-trading-red">Unavailable</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-sm">ROIC</h3>
                <div className="text-lg font-bold text-muted-foreground">—</div>
                <p className="text-xs text-trading-red">Unavailable</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-sm">ROE</h3>
                <div className="text-lg font-bold text-muted-foreground">—</div>
                <p className="text-xs text-trading-red">Unavailable</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-sm">Asset Turnover</h3>
                <div className="text-lg font-bold text-muted-foreground">—</div>
                <p className="text-xs text-trading-red">Unavailable</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-sm">Interest Coverage</h3>
                <div className="text-lg font-bold text-muted-foreground">—</div>
                <p className="text-xs text-trading-red">Unavailable</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-sm">Piotroski F</h3>
                <div className="text-lg font-bold text-muted-foreground">—</div>
                <p className="text-xs text-trading-red">Unavailable</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Constituents */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader className="flex flex-row items-center gap-2">
            <Users className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-lg">Top Constituents (by weight)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Ticker</TableHead>
                    <TableHead className="font-semibold">Weight %</TableHead>
                    <TableHead className="font-semibold">Mcap</TableHead>
                    <TableHead className="font-semibold">EV/EBITDA</TableHead>
                    <TableHead className="font-semibold">P/E</TableHead>
                    <TableHead className="font-semibold">Net Margin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">AAPL</TableCell>
                    <TableCell>19.2</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">GOOGL</TableCell>
                    <TableCell>15.0</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">TSLA</TableCell>
                    <TableCell>12.8</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">MSFT</TableCell>
                    <TableCell>11.8</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">NVDA</TableCell>
                    <TableCell>11.8</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">TM</TableCell>
                    <TableCell>10.9</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">QCOM</TableCell>
                    <TableCell>10.6</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">XPEV</TableCell>
                    <TableCell>8.0</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Coverage & Notes */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader className="flex flex-row items-center gap-2">
            <Target className="h-5 w-5 text-trading-blue" />
            <CardTitle className="text-lg">Coverage & Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="font-semibold mb-2">Universe</h3>
              <p className="text-sm text-muted-foreground">
                Top auto/EV/tech-auto names from ETFs DRIV, CARZ, KARS; deduplicated, ETF-weighted.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Weights sum</h3>
              <p className="text-sm text-muted-foreground">
                1.00 with 8 names (small sample; heavily tech-skewed—coverage caveat).
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Metric coverage</h3>
              <p className="text-sm text-muted-foreground">
                Margins present; most valuation/returns ratios unavailable—interpret with caution.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Industry Fundamentals Analyst Insights */}
        <Card className="trading-panel-enhanced">
          <CardHeader className="flex flex-row items-center gap-2">
            <Briefcase className="h-5 w-5 text-purple-500" />
            <CardTitle className="text-lg">Industry Fundamentals Analyst Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Block</TableHead>
                    <TableHead className="font-semibold">Metric</TableHead>
                    <TableHead className="font-semibold">Value</TableHead>
                    <TableHead className="font-semibold">Basis</TableHead>
                    <TableHead className="font-semibold">Coverage</TableHead>
                    <TableHead className="font-semibold">Takeaway</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Flows</TableCell>
                    <TableCell>Revenue</TableCell>
                    <TableCell>$201</TableCell>
                    <TableCell>Composite</TableCell>
                    <TableCell>TTM (partial), N=8</TableCell>
                    <TableCell>Low composite scale; unit likely $B</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Flows</TableCell>
                    <TableCell>EBITDA</TableCell>
                    <TableCell>$37</TableCell>
                    <TableCell>Composite</TableCell>
                    <TableCell>TTM, N=8</TableCell>
                    <TableCell>Margin data only, no per-firm split</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Flows</TableCell>
                    <TableCell>EBIT</TableCell>
                    <TableCell>$33</TableCell>
                    <TableCell>Composite</TableCell>
                    <TableCell>TTM, N=8</TableCell>
                    <TableCell>Margin in industry normal range</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Margin</TableCell>
                    <TableCell>Operating %</TableCell>
                    <TableCell>16.2%</TableCell>
                    <TableCell>Composite</TableCell>
                    <TableCell>TTM</TableCell>
                    <TableCell>Healthy blended across tech/auto</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Margin</TableCell>
                    <TableCell>Net Margin %</TableCell>
                    <TableCell>23.8%</TableCell>
                    <TableCell>Composite</TableCell>
                    <TableCell>TTM</TableCell>
                    <TableCell>High due to tech/auto cross mix</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Valuation</TableCell>
                    <TableCell>EV/EBITDA</TableCell>
                    <TableCell>0.00</TableCell>
                    <TableCell>Composite</TableCell>
                    <TableCell>Incomplete</TableCell>
                    <TableCell>Major data gap (likely missing data)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Leverage</TableCell>
                    <TableCell>Net Debt/EBITDA</TableCell>
                    <TableCell>0.00</TableCell>
                    <TableCell>Composite</TableCell>
                    <TableCell>Incomplete</TableCell>
                    <TableCell>Suggests net cash adjustment or gap</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Top name</TableCell>
                    <TableCell>AAPL weight</TableCell>
                    <TableCell>19.2%</TableCell>
                    <TableCell>ETF Universe</TableCell>
                    <TableCell>Top 8 fully disclosed</TableCell>
                    <TableCell>Tech names dominate the sample</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sample</TableCell>
                    <TableCell>N names</TableCell>
                    <TableCell>8</TableCell>
                    <TableCell>ETF Universes</TableCell>
                    <TableCell>DRIV, KARS, CARZ</TableCell>
                    <TableCell>Narrow; concentrated; coverage caveat</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Universe</TableCell>
                    <TableCell>Weights sum</TableCell>
                    <TableCell>1.0000</TableCell>
                    <TableCell>ETF composite</TableCell>
                    <TableCell>By definition</TableCell>
                    <TableCell>All major weights mapped</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Weakness</TableCell>
                    <TableCell>PE/FCF Data</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>No aggregate valuation/return ratios</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Risk</TableCell>
                    <TableCell>Tech/Auto mix</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>ETF method</TableCell>
                    <TableCell>Material</TableCell>
                    <TableCell>May not reflect pure auto/EV</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}