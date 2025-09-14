import { ArrowLeft, Building2, TrendingUp, Globe, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function IndustryFundamentals() {
  const navigate = useNavigate();

  const industryMetrics = [
    { name: 'Technology', pe: '28.4', growth: '+18.2%', outlook: 'Strong' },
    { name: 'Healthcare', pe: '22.1', growth: '+12.8%', outlook: 'Stable' },
    { name: 'Financial', pe: '15.7', growth: '+8.9%', outlook: 'Moderate' },
    { name: 'Energy', pe: '18.3', growth: '+15.4%', outlook: 'Recovery' },
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
          <h1 className="text-3xl font-bold">Industry Fundamentals Analysis</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Sector P/E Ratio */}
          <Card className="trading-panel-enhanced">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sector P/E Ratio</CardTitle>
              <Building2 className="h-4 w-4 text-trading-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24.8</div>
              <p className="text-xs text-muted-foreground">Normalizing trend</p>
              <Progress value={68} className="mt-2" />
              <div className="text-xs text-trading-green mt-1">Within historical range</div>
            </CardContent>
          </Card>

          {/* Growth Projections */}
          <Card className="trading-panel-enhanced">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth Projections</CardTitle>
              <TrendingUp className="h-4 w-4 text-trading-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-trading-green">+12%</div>
              <p className="text-xs text-muted-foreground">Annual outlook</p>
              <div className="text-xs text-trading-green mt-1">Above market average</div>
            </CardContent>
          </Card>

          {/* Market Cap Expansion */}
          <Card className="trading-panel-enhanced">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Market Cap Growth</CardTitle>
              <Globe className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45.2T</div>
              <p className="text-xs text-muted-foreground">Total sector value</p>
              <div className="text-xs text-trading-green mt-1">+8.5% expansion expected</div>
            </CardContent>
          </Card>
        </div>

        {/* Industry Comparison */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Industry Sector Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {industryMetrics.map((sector, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="font-medium">{sector.name}</div>
                    <Badge variant="outline">P/E: {sector.pe}</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-trading-green font-medium">{sector.growth}</span>
                    <Badge 
                      variant={sector.outlook === 'Strong' ? 'sentiment' : 
                              sector.outlook === 'Stable' ? 'technical' : 'default'}
                    >
                      {sector.outlook}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Market Dynamics */}
          <Card className="trading-panel-enhanced">
            <CardHeader>
              <CardTitle>Market Dynamics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Competitive Landscape</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  The technology sector maintains leadership with strong innovation cycles 
                  and digital transformation driving sustained growth across enterprise and 
                  consumer segments.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs">Market Concentration</span>
                    <span className="text-xs font-medium">High</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">Barrier to Entry</span>
                    <span className="text-xs font-medium">Moderate</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">Innovation Rate</span>
                    <span className="text-xs font-medium text-trading-green">Accelerating</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Economic Indicators */}
          <Card className="trading-panel-enhanced">
            <CardHeader>
              <CardTitle>Economic Impact Factors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Macro Environment</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Interest rate stabilization and strong consumer spending support 
                  continued sector expansion with favorable regulatory environment 
                  enabling innovation investments.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs">Interest Rate Impact</span>
                    <Badge variant="sentiment">POSITIVE</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">Consumer Spending</span>
                    <Badge variant="sentiment">STRONG</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">Regulatory Environment</span>
                    <Badge variant="technical">SUPPORTIVE</Badge>
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