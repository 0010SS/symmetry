import { ArrowLeft, Newspaper, Clock, TrendingUp, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function News() {
  const navigate = useNavigate();

  const newsItems = [
    {
      id: 1,
      title: "Apple Reports Record Q4 Earnings, Beats Analyst Expectations",
      summary: "Company announces 15% revenue growth and strong iPhone sales, boosting investor confidence ahead of new product cycle.",
      source: "Reuters",
      time: "2 hours ago",
      impact: "High",
      sentiment: "Very Positive",
      category: "Earnings"
    },
    {
      id: 2,
      title: "New AI Chip Architecture Unveiled at Apple Event",
      summary: "Revolutionary M4 processor with enhanced neural engine promises 40% performance improvement for AI workloads.",
      source: "TechCrunch",
      time: "4 hours ago",
      impact: "High",
      sentiment: "Positive",
      category: "Innovation"
    },
    {
      id: 3,
      title: "Goldman Sachs Upgrades Apple to Strong Buy",
      summary: "Investment bank raises price target to $175, citing strong fundamentals and growth prospects in services segment.",
      source: "Bloomberg",
      time: "6 hours ago",
      impact: "Medium",
      sentiment: "Positive",
      category: "Analyst"
    },
    {
      id: 4,
      title: "Apple Announces Major Partnership with OpenAI",
      summary: "Strategic collaboration to integrate advanced AI capabilities across Apple ecosystem, starting with Siri enhancements.",
      source: "Wall Street Journal",
      time: "8 hours ago",
      impact: "Very High",
      sentiment: "Very Positive",
      category: "Partnership"
    },
    {
      id: 5,
      title: "iPhone Market Share Gains in Emerging Markets",
      summary: "Strong growth in India and Southeast Asia drives international revenue, with 22% increase in emerging market sales.",
      source: "Financial Times",
      time: "12 hours ago",
      impact: "Medium",
      sentiment: "Positive",
      category: "Market Expansion"
    },
    {
      id: 6,
      title: "Apple Services Revenue Hits New Milestone",
      summary: "App Store, iCloud, and subscription services generate $24B in quarterly revenue, up 18% year-over-year.",
      source: "CNBC",
      time: "1 day ago",
      impact: "Medium",
      sentiment: "Positive",
      category: "Services"
    }
  ];

  const marketImpact = {
    "Very High": "destructive",
    "High": "sentiment",
    "Medium": "technical",
    "Low": "outline"
  };

  const sentimentColors = {
    "Very Positive": "sentiment",
    "Positive": "technical",
    "Neutral": "outline",
    "Negative": "destructive"
  };

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
          <h1 className="text-3xl font-bold">Market News & Analysis</h1>
        </div>

        {/* News Summary */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-trading-green" />
              News Impact Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-trading-green mb-2">6</div>
                <p className="text-sm text-muted-foreground">Total News Items</p>
                <Badge variant="sentiment" className="mt-2">ACTIVE</Badge>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-trading-blue mb-2">85%</div>
                <p className="text-sm text-muted-foreground">Positive Sentiment</p>
                <Badge variant="technical" className="mt-2">BULLISH</Badge>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-500 mb-2">3</div>
                <p className="text-sm text-muted-foreground">High Impact Events</p>
                <Badge variant="decision" className="mt-2">SIGNIFICANT</Badge>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500 mb-2">+2.8%</div>
                <p className="text-sm text-muted-foreground">Expected Price Impact</p>
                <Badge variant="outline" className="mt-2">POSITIVE</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* News Feed */}
        <div className="space-y-6">
          {newsItems.map((news) => (
            <Card key={news.id} className="trading-panel-enhanced">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{news.category}</Badge>
                      <Badge variant={marketImpact[news.impact] as any}>
                        {news.impact} Impact
                      </Badge>
                      <Badge variant={sentimentColors[news.sentiment] as any}>
                        {news.sentiment}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight mb-2">
                      {news.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Newspaper className="h-4 w-4" />
                        {news.source}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {news.time}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="ml-4">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {news.summary}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Market Analysis */}
        <Card className="trading-panel-enhanced mt-8">
          <CardHeader>
            <CardTitle>News-Based Market Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-trading-green">Positive Catalysts</h3>
                <div className="space-y-2 text-sm">
                  <div className="p-3 border-l-4 border-trading-green bg-trading-green/5 rounded">
                    <div className="font-medium">Record Earnings Performance</div>
                    <div className="text-muted-foreground">15% revenue growth exceeds expectations, demonstrates strong execution</div>
                  </div>
                  <div className="p-3 border-l-4 border-trading-blue bg-trading-blue/5 rounded">
                    <div className="font-medium">AI Technology Leadership</div>
                    <div className="text-muted-foreground">New chip architecture positions company for AI revolution</div>
                  </div>
                  <div className="p-3 border-l-4 border-purple-500 bg-purple-500/5 rounded">
                    <div className="font-medium">Strategic Partnerships</div>
                    <div className="text-muted-foreground">OpenAI collaboration accelerates AI integration timeline</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-trading-blue">Market Implications</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Short-term Impact (1-3 months)</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Analyst upgrades likely to drive institutional buying</li>
                      <li>• Earnings momentum supports continued price appreciation</li>
                      <li>• AI partnership creates new growth narrative</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Long-term Outlook (6-12 months)</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Services segment provides recurring revenue stability</li>
                      <li>• International expansion drives market share gains</li>
                      <li>• Technology leadership maintains competitive moat</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}