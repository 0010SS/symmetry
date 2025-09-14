import { ArrowLeft, Target, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function CrossSignals() {
  const navigate = useNavigate();

  const technicalSignals = [
    { indicator: 'Golden Cross', signal: 'BUY', strength: 95, timeframe: '1D', description: '50-day MA crossed above 200-day MA' },
    { indicator: 'MACD Bullish Divergence', signal: 'BUY', strength: 88, timeframe: '4H', description: 'Price making lower lows, MACD making higher lows' },
    { indicator: 'Volume Confirmation', signal: 'BUY', strength: 82, timeframe: '1D', description: 'Volume exceeding 20-day average by 34%' },
    { indicator: 'RSI Oversold Recovery', signal: 'BUY', strength: 76, timeframe: '1H', description: 'RSI bounced from oversold territory' },
  ];

  const crossAssetSignals = [
    { asset: 'VIX Index', correlation: 'Negative', impact: 'Bullish', strength: 'Strong' },
    { asset: 'USD Index', correlation: 'Negative', impact: 'Neutral', strength: 'Moderate' },
    { asset: 'Treasury Yields', correlation: 'Positive', impact: 'Supportive', strength: 'Moderate' },
    { asset: 'Gold', correlation: 'Negative', impact: 'Bullish', strength: 'Weak' },
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
          <h1 className="text-3xl font-bold">Cross Signals Analysis</h1>
        </div>

        {/* Signal Summary */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-trading-green" />
              Signal Confluence Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-trading-green mb-2">85%</div>
                <p className="text-sm text-muted-foreground">Signal Strength</p>
                <Badge variant="sentiment" className="mt-2">STRONG BUY</Badge>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-trading-blue mb-2">4/4</div>
                <p className="text-sm text-muted-foreground">Bullish Signals</p>
                <Badge variant="technical" className="mt-2">CONFLUENCE</Badge>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-500 mb-2">0</div>
                <p className="text-sm text-muted-foreground">Bearish Signals</p>
                <Badge variant="decision" className="mt-2">CLEAR</Badge>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500 mb-2">3</div>
                <p className="text-sm text-muted-foreground">Timeframes</p>
                <Badge variant="outline" className="mt-2">MULTI-TF</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Signals */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-trading-blue" />
              Technical Signal Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {technicalSignals.map((signal, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        {signal.indicator}
                        <Badge variant="sentiment">{signal.signal}</Badge>
                        <Badge variant="outline">{signal.timeframe}</Badge>
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{signal.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-trading-green">{signal.strength}%</div>
                    </div>
                  </div>
                  <Progress value={signal.strength} className="mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cross-Asset Correlations */}
          <Card className="trading-panel-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                Cross-Asset Signal Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {crossAssetSignals.map((signal, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{signal.asset}</div>
                      <div className="text-sm text-muted-foreground">
                        {signal.correlation} Correlation
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant={
                        signal.impact === 'Bullish' ? 'sentiment' :
                        signal.impact === 'Supportive' ? 'technical' : 'outline'
                      }>
                        {signal.impact}
                      </Badge>
                      <div className="text-xs text-muted-foreground">{signal.strength}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Signal Validation */}
          <Card className="trading-panel-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Signal Validation Checklist
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Price Above Key MAs</span>
                  <Badge variant="sentiment">✓ CONFIRMED</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Volume Supporting Move</span>
                  <Badge variant="sentiment">✓ CONFIRMED</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Momentum Indicators Aligned</span>
                  <Badge variant="sentiment">✓ CONFIRMED</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Support Level Holding</span>
                  <Badge variant="sentiment">✓ CONFIRMED</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sector Outperformance</span>
                  <Badge variant="technical">⚠ MONITORING</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Options Flow Bullish</span>
                  <Badge variant="sentiment">✓ CONFIRMED</Badge>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Risk Considerations</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Monitor for potential false breakout above resistance</li>
                  <li>• Watch for volume divergence on continued moves</li>
                  <li>• Consider macro events impact on momentum</li>
                  <li>• Set stop-loss below key support levels</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Trading Strategy */}
          <Card className="trading-panel-enhanced col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Recommended Trading Strategy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-trading-green">Entry Strategy</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Entry Level:</span>
                      <span className="font-medium">$157-159</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Position Size:</span>
                      <span className="font-medium">2-3% portfolio</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Horizon:</span>
                      <span className="font-medium">3-6 months</span>
                    </div>
                    <div className="mt-3">
                      <Badge variant="sentiment">STRONG BUY SIGNAL</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-amber-500">Risk Management</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Stop Loss:</span>
                      <span className="font-medium">$148</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk per Trade:</span>
                      <span className="font-medium">-6%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Drawdown:</span>
                      <span className="font-medium">-10%</span>
                    </div>
                    <div className="mt-3">
                      <Badge variant="destructive">STRICT DISCIPLINE</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-trading-blue">Profit Targets</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Target 1:</span>
                      <span className="font-medium">$172 (+10%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Target 2:</span>
                      <span className="font-medium">$185 (+18%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk/Reward:</span>
                      <span className="font-medium">1:3</span>
                    </div>
                    <div className="mt-3">
                      <Badge variant="decision">HIGH PROBABILITY</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}