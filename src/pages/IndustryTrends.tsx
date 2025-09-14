import { ArrowLeft, Zap, Cloud, Cpu, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function IndustryTrends() {
  const navigate = useNavigate();

  const trendData = [
    { 
      trend: 'Cloud Adoption', 
      growth: '+32%', 
      impact: 'High', 
      timeline: '2024-2026',
      icon: Cloud,
      color: 'text-blue-500'
    },
    { 
      trend: 'AI Integration', 
      growth: '+45%', 
      impact: 'Very High', 
      timeline: '2024-2025',
      icon: Cpu,
      color: 'text-purple-500'
    },
    { 
      trend: 'Mobile-First Strategy', 
      growth: '+28%', 
      impact: 'Medium', 
      timeline: '2024-2027',
      icon: Smartphone,
      color: 'text-green-500'
    },
    { 
      trend: 'Digital Transformation', 
      growth: '+38%', 
      impact: 'High', 
      timeline: '2024-2026',
      icon: Zap,
      color: 'text-amber-500'
    },
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
          <h1 className="text-3xl font-bold">Industry Trends Analysis</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {trendData.map((trend, index) => {
            const IconComponent = trend.icon;
            return (
              <Card key={index} className="trading-panel-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <IconComponent className={`h-5 w-5 ${trend.color}`} />
                    {trend.trend}
                  </CardTitle>
                  <Badge variant="sentiment">{trend.growth}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Market Impact</span>
                      <Badge variant={
                        trend.impact === 'Very High' ? 'decision' :
                        trend.impact === 'High' ? 'sentiment' : 'technical'
                      }>
                        {trend.impact}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Timeline</span>
                      <span className="text-sm font-medium">{trend.timeline}</span>
                    </div>
                    <Progress 
                      value={
                        trend.impact === 'Very High' ? 95 :
                        trend.impact === 'High' ? 80 : 65
                      } 
                      className="mt-2" 
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Emerging Technologies */}
          <Card className="trading-panel-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                Emerging Technology Adoption
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Artificial Intelligence</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    AI integration is driving unprecedented competitive advantages across 
                    all business functions, from customer service to predictive analytics.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Adoption Rate</span>
                    <Badge variant="decision">78%</Badge>
                  </div>
                  <Progress value={78} className="mt-1" />
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Edge Computing</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Distributed computing architectures enabling real-time processing 
                    and reduced latency for critical applications.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Market Penetration</span>
                    <Badge variant="technical">42%</Badge>
                  </div>
                  <Progress value={42} className="mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Transformation */}
          <Card className="trading-panel-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-blue-500" />
                Digital Transformation Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Revenue Stream Diversification</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Companies are creating new revenue streams through digital services, 
                    subscription models, and platform-based offerings.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="sentiment">SaaS Growth</Badge>
                    <Badge variant="technical">Platform Economy</Badge>
                    <Badge variant="decision">API Monetization</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Operational Efficiency</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Automation and digital workflows are driving significant cost 
                    reductions and productivity improvements across industries.
                  </p>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-xs">Cost Reduction</span>
                      <span className="text-xs font-medium text-trading-green">-15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs">Productivity Gain</span>
                      <span className="text-xs font-medium text-trading-green">+25%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Future Outlook */}
          <Card className="trading-panel-enhanced col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Industry Outlook & Strategic Implications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 text-trading-green">Growth Drivers</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Accelerating digital adoption</li>
                    <li>• AI-powered innovation cycles</li>
                    <li>• Cloud infrastructure expansion</li>
                    <li>• Remote work technology demand</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-amber-500">Key Challenges</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Cybersecurity requirements</li>
                    <li>• Talent acquisition costs</li>
                    <li>• Regulatory compliance</li>
                    <li>• Infrastructure investments</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-trading-blue">Investment Areas</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• AI/ML platform development</li>
                    <li>• Cloud-native solutions</li>
                    <li>• Cybersecurity technologies</li>
                    <li>• Sustainable tech initiatives</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}