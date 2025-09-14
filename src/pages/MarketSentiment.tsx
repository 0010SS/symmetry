import { ArrowLeft, TrendingUp, Heart, MessageSquare, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function MarketSentiment() {
  const navigate = useNavigate();

  const sentimentData = [
    { source: 'Institutional Investors', sentiment: 78, trend: 'positive', change: '+8%' },
    { source: 'Retail Traders', sentiment: 72, trend: 'positive', change: '+12%' },
    { source: 'Market Analysts', sentiment: 85, trend: 'positive', change: '+5%' },
    { source: 'Social Media', sentiment: 69, trend: 'neutral', change: '+3%' },
  ];

  const analystRatings = [
    { firm: 'Goldman Sachs', rating: 'Buy', target: '$175', change: 'Upgrade' },
    { firm: 'Morgan Stanley', rating: 'Overweight', target: '$170', change: 'Raised' },
    { firm: 'JP Morgan', rating: 'Buy', target: '$168', change: 'Maintained' },
    { firm: 'Bank of America', rating: 'Buy', target: '$172', change: 'Upgrade' },
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
          <h1 className="text-3xl font-bold">Market Sentiment Analysis</h1>
        </div>

        {/* Overall Sentiment Score */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-trading-green" />
              Overall Market Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-trading-green mb-2">72%</div>
                <p className="text-sm text-muted-foreground">Positive Sentiment</p>
                <Badge variant="sentiment" className="mt-2">BULLISH</Badge>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-trading-blue mb-2">+8%</div>
                <p className="text-sm text-muted-foreground">Weekly Change</p>
                <Badge variant="technical" className="mt-2">IMPROVING</Badge>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-500 mb-2">3</div>
                <p className="text-sm text-muted-foreground">Analyst Upgrades</p>
                <Badge variant="decision" className="mt-2">STRONG</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sentiment Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {sentimentData.map((data, index) => (
            <Card key={index} className="trading-panel-enhanced">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{data.source}</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-trading-green">{data.change}</span>
                  <TrendingUp className="h-4 w-4 text-trading-green" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">{data.sentiment}%</span>
                    <Badge variant={
                      data.trend === 'positive' ? 'sentiment' :
                      data.trend === 'neutral' ? 'technical' : 'destructive'
                    }>
                      {data.trend.toUpperCase()}
                    </Badge>
                  </div>
                  <Progress value={data.sentiment} className="mt-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Analyst Ratings */}
          <Card className="trading-panel-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-trading-blue" />
                Major Analyst Ratings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analystRatings.map((analyst, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{analyst.firm}</div>
                      <div className="text-sm text-muted-foreground">Target: {analyst.target}</div>
                    </div>
                    <div className="text-right">
                      <Badge variant="sentiment" className="mb-1">{analyst.rating}</Badge>
                      <div className="text-xs text-trading-green">{analyst.change}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Social Sentiment */}
          <Card className="trading-panel-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-500" />
                Social Media Sentiment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Platform Analysis</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Twitter/X Mentions</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">+24%</span>
                      <Badge variant="sentiment">POSITIVE</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Reddit Discussions</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">+18%</span>
                      <Badge variant="sentiment">BULLISH</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">YouTube Coverage</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">+15%</span>
                      <Badge variant="technical">MIXED</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Sentiment Drivers</h3>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium text-trading-green">Positive:</span>
                    <span className="text-muted-foreground ml-1">
                      Strong earnings, product innovation, market expansion
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-amber-500">Neutral:</span>
                    <span className="text-muted-foreground ml-1">
                      Valuation concerns, market competition
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sentiment Timeline */}
          <Card className="trading-panel-enhanced col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Sentiment Evolution & Market Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Recent Developments</h3>
                  <div className="space-y-3">
                    <div className="border-l-4 border-trading-green pl-4">
                      <div className="text-sm font-medium">Q4 Earnings Beat</div>
                      <div className="text-xs text-muted-foreground">Analyst sentiment improved significantly</div>
                      <div className="text-xs text-trading-green">+12% sentiment boost</div>
                    </div>
                    <div className="border-l-4 border-trading-blue pl-4">
                      <div className="text-sm font-medium">Product Launch</div>
                      <div className="text-xs text-muted-foreground">New innovation cycle beginning</div>
                      <div className="text-xs text-trading-blue">+8% social mentions</div>
                    </div>
                    <div className="border-l-4 border-amber-500 pl-4">
                      <div className="text-sm font-medium">Market Expansion</div>
                      <div className="text-xs text-muted-foreground">International growth opportunity</div>
                      <div className="text-xs text-amber-500">+6% institutional interest</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Confidence Indicators</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Options Put/Call Ratio</span>
                      <Badge variant="sentiment">0.65 (BULLISH)</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Short Interest</span>
                      <Badge variant="sentiment">2.1% (LOW)</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Insider Trading</span>
                      <Badge variant="technical">NET BUYING</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Institutional Flow</span>
                      <Badge variant="sentiment">+$2.4B (POSITIVE)</Badge>
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