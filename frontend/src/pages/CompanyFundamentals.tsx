import { ArrowLeft, TrendingUp, DollarSign, BarChart3, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function CompanyFundamentals() {
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
          <h1 className="text-3xl font-bold">Company Fundamentals Analysis</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Revenue Growth */}
          <Card className="trading-panel-enhanced">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-trading-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-trading-green">+15.2%</div>
              <p className="text-xs text-muted-foreground">Quarterly increase</p>
              <Progress value={82} className="mt-2" />
            </CardContent>
          </Card>

          {/* P/E Ratio */}
          <Card className="trading-panel-enhanced">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">P/E Ratio</CardTitle>
              <BarChart3 className="h-4 w-4 text-trading-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24.5</div>
              <p className="text-xs text-muted-foreground">Fair valuation range</p>
              <div className="text-xs text-trading-green mt-1">Within industry average</div>
            </CardContent>
          </Card>

          {/* Debt-to-Equity */}
          <Card className="trading-panel-enhanced">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Debt-to-Equity</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-trading-green">0.42</div>
              <p className="text-xs text-muted-foreground">Improved from 0.58</p>
              <div className="text-xs text-trading-green mt-1">Strong balance sheet</div>
            </CardContent>
          </Card>

          {/* Market Cap */}
          <Card className="trading-panel-enhanced">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Market Capitalization</CardTitle>
              <Users className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2.8T</div>
              <p className="text-xs text-muted-foreground">Large cap growth</p>
              <div className="text-xs text-trading-green mt-1">+12% YoY growth</div>
            </CardContent>
          </Card>

          {/* ROE */}
          <Card className="trading-panel-enhanced">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Return on Equity</CardTitle>
              <TrendingUp className="h-4 w-4 text-trading-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-trading-green">28.7%</div>
              <p className="text-xs text-muted-foreground">Excellent efficiency</p>
              <Progress value={95} className="mt-2" />
            </CardContent>
          </Card>

          {/* Cash Flow */}
          <Card className="trading-panel-enhanced">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Free Cash Flow</CardTitle>
              <DollarSign className="h-4 w-4 text-trading-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$94.8B</div>
              <p className="text-xs text-muted-foreground">Annual generation</p>
              <div className="text-xs text-trading-green mt-1">Strong cash position</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <Card className="trading-panel-enhanced mt-8">
          <CardHeader>
            <CardTitle>Detailed Fundamental Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Earnings Performance</h3>
              <p className="text-sm text-muted-foreground">
                The company delivered strong quarterly earnings with a 15% revenue growth, 
                beating analyst expectations by 8%. Operating margins improved to 28.5%, 
                indicating excellent operational efficiency and cost management.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Financial Health</h3>
              <p className="text-sm text-muted-foreground">
                Balance sheet remains robust with improved debt-to-equity ratio of 0.42, 
                down from 0.58 last quarter. Strong cash generation of $94.8B provides 
                flexibility for investments and shareholder returns.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Valuation Metrics</h3>
              <p className="text-sm text-muted-foreground">
                Current P/E ratio of 24.5 indicates fair valuation relative to growth prospects. 
                ROE of 28.7% demonstrates exceptional management efficiency in generating returns 
                for shareholders.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}