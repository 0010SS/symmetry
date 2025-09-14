import { ArrowLeft, Target, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function FinalDecision() {
  const navigate = useNavigate();

  const decisionFactors = [
    { category: 'Fundamentals', score: 92, weight: 25, impact: 'Very Positive' },
    { category: 'Technical Analysis', score: 88, weight: 20, impact: 'Positive' },
    { category: 'Market Sentiment', score: 85, weight: 15, impact: 'Positive' },
    { category: 'Industry Trends', score: 90, weight: 20, impact: 'Very Positive' },
    { category: 'Cross Signals', score: 87, weight: 20, impact: 'Positive' },
  ];

  const riskFactors = [
    { risk: 'Market Volatility', level: 'Medium', mitigation: 'Position sizing and stop-losses' },
    { risk: 'Sector Rotation', level: 'Low', mitigation: 'Strong fundamental support' },
    { risk: 'Valuation Concerns', level: 'Low', mitigation: 'Fair P/E ratio vs growth' },
    { risk: 'Macro Headwinds', level: 'Medium', mitigation: 'Defensive characteristics' },
  ];

  const overallScore = decisionFactors.reduce((acc, factor) => acc + (factor.score * factor.weight / 100), 0);

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
          <h1 className="text-3xl font-bold">Final Investment Decision</h1>
        </div>

        {/* Decision Summary */}
        <Card className="trading-panel-enhanced mb-8 border-trading-green">
          <CardHeader className="bg-gradient-to-r from-trading-green/10 to-trading-green/5">
            <CardTitle className="flex items-center gap-2 text-trading-green">
              <CheckCircle className="h-6 w-6" />
              STRONG BUY RECOMMENDATION
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-trading-green mb-2">{overallScore.toFixed(0)}%</div>
                <p className="text-sm text-muted-foreground">Overall Score</p>
                <Badge variant="sentiment" className="mt-2">EXCELLENT</Badge>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-trading-blue mb-2">$165</div>
                <p className="text-sm text-muted-foreground">Price Target</p>
                <Badge variant="technical" className="mt-2">+5% UPSIDE</Badge>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-500 mb-2">3-6M</div>
                <p className="text-sm text-muted-foreground">Time Horizon</p>
                <Badge variant="decision" className="mt-2">MEDIUM TERM</Badge>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-500 mb-2">HIGH</div>
                <p className="text-sm text-muted-foreground">Confidence Level</p>
                <Badge variant="outline" className="mt-2">94% PROBABILITY</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Decision Matrix */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-trading-blue" />
              Decision Analysis Matrix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {decisionFactors.map((factor, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <h3 className="font-semibold">{factor.category}</h3>
                      <Badge variant="outline">Weight: {factor.weight}%</Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-trading-green">{factor.score}%</div>
                      <div className="text-xs text-muted-foreground">{factor.impact}</div>
                    </div>
                  </div>
                  <Progress value={factor.score} className="mt-2" />
                  <div className="text-xs text-muted-foreground mt-1">
                    Weighted Contribution: {((factor.score * factor.weight) / 100).toFixed(1)} points
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Investment Rationale */}
          <Card className="trading-panel-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-trading-green" />
                Investment Rationale
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-trading-green">Key Strengths</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Exceptional fundamentals:</strong> 15% revenue growth with improving margins</li>
                  <li>• <strong>Technical momentum:</strong> Golden cross pattern with volume confirmation</li>
                  <li>• <strong>Positive sentiment:</strong> 72% bullish sentiment with analyst upgrades</li>
                  <li>• <strong>Industry leadership:</strong> Well-positioned for AI and cloud trends</li>
                  <li>• <strong>Strong balance sheet:</strong> Improved debt ratios and cash generation</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 text-trading-blue">Catalyst Timeline</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Next Earnings (Q1):</span>
                    <span className="font-medium">April 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Product Launch:</span>
                    <span className="font-medium">March 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Market Expansion:</span>
                    <span className="font-medium">Q2 2024</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card className="trading-panel-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Risk Assessment & Mitigation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {riskFactors.map((risk, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{risk.risk}</span>
                      <Badge variant={
                        risk.level === 'Low' ? 'sentiment' :
                        risk.level === 'Medium' ? 'technical' : 'destructive'
                      }>
                        {risk.level}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{risk.mitigation}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Overall Risk Rating</h3>
                <div className="flex items-center gap-4">
                  <Badge variant="technical">MODERATE RISK</Badge>
                  <span className="text-sm text-muted-foreground">
                    Well-managed with clear mitigation strategies
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Plan */}
          <Card className="trading-panel-enhanced col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Recommended Action Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-trading-green">Immediate Actions</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-trading-green" />
                      <span>Initiate position at current levels</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-trading-green" />
                      <span>Set stop-loss at $148 (-6%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-trading-green" />
                      <span>Position size: 2-3% of portfolio</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-trading-blue">Monitoring Plan</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-trading-blue" />
                      <span>Weekly technical review</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-trading-blue" />
                      <span>Track earnings estimates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-trading-blue" />
                      <span>Monitor sector performance</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-amber-500">Exit Strategy</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-amber-500" />
                      <span>Take profits at $165 target</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-amber-500" />
                      <span>Reassess if fundamentals change</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-amber-500" />
                      <span>Review position in 3-6 months</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-trading-green/10 rounded-lg border border-trading-green/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-trading-green" />
                  <h3 className="font-semibold text-trading-green">Final Recommendation</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on comprehensive analysis across all factors, this presents a 
                  <strong className="text-trading-green"> STRONG BUY opportunity</strong> with 
                  favorable risk-reward profile. High confidence in achieving price target 
                  within the specified timeframe.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}