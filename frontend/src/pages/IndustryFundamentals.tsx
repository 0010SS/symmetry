import { ArrowLeft, TrendingUp, AlertTriangle, BarChart3, DollarSign, Users, Activity } from 'lucide-react';
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
          <h1 className="text-3xl font-bold">TSLA Industry Fundamentals Report — Auto Manufacturers</h1>
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
                <p className="text-2xl font-bold text-trading-blue">Auto Manufacturers</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Method</p>
                <p className="text-sm text-muted-foreground">ETF-weighted; 15 constituents; total weights sum to 1.0</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Top Names by Weight</p>
                <p className="text-sm text-muted-foreground">MP (9.21%), AAPL (8.36%), NVDA (7.63%), and TSLA (7.09%)</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Composite Headline Metrics</p>
                <p className="text-sm text-muted-foreground">EV/EBITDA, Net Margin, and P/E data not available; FCF Yield is 0%</p>
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
              <div className="bg-gradient-to-r from-trading-green/5 to-trading-blue/5 p-4 rounded-lg border">
                <p className="text-sm font-medium text-muted-foreground">Aggregate Revenue</p>
                <p className="text-lg font-bold text-red-500">$0</p>
                <p className="text-xs text-red-500">All reported as $0</p>
              </div>
              <div className="bg-gradient-to-r from-trading-green/5 to-trading-blue/5 p-4 rounded-lg border">
                <p className="text-sm font-medium text-muted-foreground">EBITDA</p>
                <p className="text-lg font-bold text-red-500">$0</p>
                <p className="text-xs text-red-500">All reported as $0</p>
              </div>
              <div className="bg-gradient-to-r from-trading-green/5 to-trading-blue/5 p-4 rounded-lg border">
                <p className="text-sm font-medium text-muted-foreground">EBIT</p>
                <p className="text-lg font-bold text-red-500">$0</p>
                <p className="text-xs text-red-500">All reported as $0</p>
              </div>
              <div className="bg-gradient-to-r from-trading-green/5 to-trading-blue/5 p-4 rounded-lg border">
                <p className="text-sm font-medium text-muted-foreground">Net Income</p>
                <p className="text-lg font-bold text-red-500">$0</p>
                <p className="text-xs text-red-500">All reported as $0</p>
              </div>
              <div className="bg-gradient-to-r from-trading-green/5 to-trading-blue/5 p-4 rounded-lg border">
                <p className="text-sm font-medium text-muted-foreground">CFO</p>
                <p className="text-lg font-bold text-red-500">$0</p>
                <p className="text-xs text-red-500">All reported as $0</p>
              </div>
              <div className="bg-gradient-to-r from-trading-green/5 to-trading-blue/5 p-4 rounded-lg border">
                <p className="text-sm font-medium text-muted-foreground">Capex</p>
                <p className="text-lg font-bold text-red-500">$0</p>
                <p className="text-xs text-red-500">All reported as $0</p>
              </div>
              <div className="bg-gradient-to-r from-trading-green/5 to-trading-blue/5 p-4 rounded-lg border">
                <p className="text-sm font-medium text-muted-foreground">Market Cap Aggregate</p>
                <p className="text-lg font-bold text-trading-green">$77.73B</p>
                <p className="text-xs text-trading-green">Available</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold">Margins & Ratios</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg border text-center">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Gross Margin</p>
                  <p className="text-sm font-bold text-red-500">Not reported</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border text-center">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Operating Margin</p>
                  <p className="text-sm font-bold text-red-500">Not reported</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border text-center">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Net Margin</p>
                  <p className="text-sm font-bold text-red-500">Not reported</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg border text-center">
                  <p className="text-xs font-medium text-muted-foreground mb-1">EV/EBITDA</p>
                  <p className="text-sm font-bold text-red-500">—</p>
                  <p className="text-xs text-red-400">Not available</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border text-center">
                  <p className="text-xs font-medium text-muted-foreground mb-1">FCF Yield</p>
                  <p className="text-sm font-bold text-red-500">—</p>
                  <p className="text-xs text-red-400">Not available</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border text-center">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Net Debt/EBITDA</p>
                  <p className="text-sm font-bold text-red-500">—</p>
                  <p className="text-xs text-red-400">Not available</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Valuation & Returns Panel */}
        <Card className="trading-panel-enhanced mb-6">
          <CardHeader className="flex flex-row items-center gap-2">
            <DollarSign className="h-5 w-5 text-trading-green" />
            <CardTitle className="text-lg">Valuation & Returns (Weighted Means)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                'P/E', 'P/S', 'EV/EBITDA', 'Dividend Yield', 'FCF Yield',
                'ROIC', 'ROE', 'Asset Turnover', 'Interest Coverage', 'Piotroski F'
              ].map((metric) => (
                <div key={metric} className="bg-gray-50 p-3 rounded-lg border text-center">
                  <p className="text-xs font-medium text-muted-foreground mb-1">{metric}</p>
                  <p className="text-sm font-bold text-red-500">—</p>
                  <p className="text-xs text-red-400">No data provided</p>
                </div>
              ))}
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
                  <TableRow>
                    <TableCell className="font-medium">MP</TableCell>
                    <TableCell>9.21</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">AAPL</TableCell>
                    <TableCell>8.36</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">NVDA</TableCell>
                    <TableCell>7.63</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">TSM</TableCell>
                    <TableCell>7.58</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">MSFT</TableCell>
                    <TableCell>7.52</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">005930.KS</TableCell>
                    <TableCell>7.24</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">GOOGL</TableCell>
                    <TableCell>7.22</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                  </TableRow>
                  <TableRow className="bg-blue-50 border-blue-200">
                    <TableCell className="font-medium text-trading-blue">TSLA</TableCell>
                    <TableCell className="font-medium text-trading-blue">7.09</TableCell>
                    <TableCell className="font-medium text-trading-green">$1.10T</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                    <TableCell className="text-red-500">—</TableCell>
                  </TableRow>
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
                  <p className="text-sm text-blue-700">
                    Universe derived from public ETF holdings of CARZ, DRIV, KARS as of 2025-09-13
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="text-sm font-medium text-green-800 mb-2">Deduplication Method</p>
                  <p className="text-sm text-green-700">
                    Tickers deduplicated and weighted by maximum ETF weight among the three ETFs
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                  <p className="text-sm font-medium text-purple-800 mb-2">Weight Coverage</p>
                  <p className="text-sm text-purple-700">
                    Weights sum exactly to 1.0 over 15 names
                  </p>
                </div>
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <p className="text-sm font-medium text-red-800 mb-2">Data Quality Notice</p>
                  <p className="text-sm text-red-700">
                    Many key financial metrics are missing or zero in the reported composite data (likely due to data source or aggregation method)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Industry Fundamentals Analyst Insights */}
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
                  <TableRow>
                    <TableCell className="font-medium">Industry Label</TableCell>
                    <TableCell>Auto Manufacturers</TableCell>
                    <TableCell>Defined</TableCell>
                    <TableCell>ETF holdings (CARZ, DRIV, KARS)</TableCell>
                    <TableCell>15 names</TableCell>
                    <TableCell>Auto/electric vehicle focus</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Number Constituents</TableCell>
                    <TableCell>15</TableCell>
                    <TableCell>15</TableCell>
                    <TableCell>ETF top holdings</TableCell>
                    <TableCell>Full coverage</TableCell>
                    <TableCell>Reasonable universe size</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Weight Sum</TableCell>
                    <TableCell>1.0000</TableCell>
                    <TableCell>Exact</TableCell>
                    <TableCell>ETF-weighting</TableCell>
                    <TableCell>Complete</TableCell>
                    <TableCell>ETF weighting effective</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Top Weight</TableCell>
                    <TableCell>MP 9.21%</TableCell>
                    <TableCell>MP highest</TableCell>
                    <TableCell>ETF max weight</TableCell>
                    <TableCell>15 names</TableCell>
                    <TableCell>MP leads industry ETF exposure</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Market Cap Aggregate</TableCell>
                    <TableCell>$77.73B</TableCell>
                    <TableCell>Scaled sum</TableCell>
                    <TableCell>Sum over 15 tickers</TableCell>
                    <TableCell>Partial</TableCell>
                    <TableCell>Size proxy for auto industry</TableCell>
                  </TableRow>
                  <TableRow className="bg-red-50">
                    <TableCell className="font-medium">Missing Metrics</TableCell>
                    <TableCell>P/E, EV/EBITDA, Margins</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>Data unreported/zeroed</TableCell>
                    <TableCell>Full universe</TableCell>
                    <TableCell>Lack of key metrics needs caution</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">FCF Yield</TableCell>
                    <TableCell>0.00%</TableCell>
                    <TableCell>Zero</TableCell>
                    <TableCell>ETF weighted composite</TableCell>
                    <TableCell>Full universe</TableCell>
                    <TableCell>Possibly no free cash flow yield</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <p className="text-sm font-medium text-amber-800 mb-2">Analysis Recommendation</p>
                <p className="text-sm text-amber-700">
                  If further refined or alternative data sources are accessible, metrics like EV/EBITDA or margins should be re-checked for better analysis. Current data aggregation reports significant gaps or zeros in fundamentals.
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-2">Next Steps</p>
                <p className="text-sm text-blue-700">
                  Please advise if you want to analyze Tesla's standalone fundamentals or seek another approach.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}