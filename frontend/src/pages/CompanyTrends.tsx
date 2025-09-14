import { ArrowLeft, TrendingUp, Activity, Target, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CompanyTrends() {
  const navigate = useNavigate();

  const trendData = [
    { period: '1M', change: '+8.2%', status: 'bullish' },
    { period: '3M', change: '+24.7%', status: 'bullish' },
    { period: '6M', change: '+31.5%', status: 'bullish' },
    { period: '1Y', change: '+45.3%', status: 'bullish' },
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {trendData.map((data, index) => (
            <Card key={index} className="trading-panel-enhanced">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{data.period} Performance</CardTitle>
                <TrendingUp className="h-4 w-4 text-trading-green" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-trading-green">{data.change}</div>
                <Badge variant="sentiment" className="mt-2">
                  {data.status.toUpperCase()}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Price Momentum */}
          <Card className="trading-panel-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-trading-blue" />
                Price Momentum Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Relative Strength Index (RSI)</span>
                  <Badge variant="technical">67.8</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Moving Average Convergence</span>
                  <Badge variant="sentiment">BULLISH</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Volume Trend</span>
                  <Badge variant="sentiment">INCREASING</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Price vs 50-day MA</span>
                  <span className="text-sm font-semibold text-trading-green">+12.4%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Indicators */}
          <Card className="trading-panel-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-amber-500" />
                Technical Indicators
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Bollinger Bands Position</span>
                  <Badge variant="decision">UPPER BAND</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Stochastic Oscillator</span>
                  <Badge variant="technical">72.3</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Williams %R</span>
                  <Badge variant="sentiment">-28.5</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average True Range</span>
                  <span className="text-sm font-semibold">$3.42</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Volume Analysis */}
          <Card className="trading-panel-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-500" />
                Volume Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Daily Volume</span>
                  <span className="text-sm font-semibold">68.2M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Volume vs Average</span>
                  <Badge variant="sentiment">+34%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">On-Balance Volume</span>
                  <Badge variant="sentiment">RISING</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Accumulation/Distribution</span>
                  <Badge variant="sentiment">ACCUMULATION</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trend Summary */}
          <Card className="trading-panel-enhanced">
            <CardHeader>
              <CardTitle>Trend Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-trading-green">Bullish momentum</strong> continues across all timeframes 
                  with consistent volume confirmation. Technical indicators suggest sustained upward pressure 
                  with price maintaining above key moving averages.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="sentiment">Strong Uptrend</Badge>
                  <Badge variant="technical">Volume Confirmed</Badge>
                  <Badge variant="decision">Momentum Sustained</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}