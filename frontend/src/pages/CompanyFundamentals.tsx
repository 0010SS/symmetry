import { ArrowLeft, TrendingUp, DollarSign, BarChart3, Users, AlertTriangle, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

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

        {/* Market Outlook & Price Targets */}
        <Card className="trading-panel-enhanced mb-6">
          <CardHeader className="flex flex-row items-center gap-2">
            <TrendingUp className="h-5 w-5 text-trading-green" />
            <CardTitle className="text-lg">Tesla (TSLA) - Market Outlook & Price Targets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-trading-green/10 to-trading-blue/10 p-4 rounded-lg border border-trading-green/20">
              <p className="text-sm font-medium text-trading-green mb-2">Bullish Price Target Trajectory</p>
              <p className="text-sm text-muted-foreground">
                The latest available fundamental information from recent analyses and forecasts on Tesla (TSLA) indicates a bullish price target trajectory ranging from about $310 to over $400 in the next month, suggesting positive market expectations and potential upward momentum.
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
              <p className="text-sm font-medium text-amber-800 mb-2">Data Limitation Notice</p>
              <p className="text-sm text-amber-700">
                However, specifics on financial ratios such as PE, PS, and cash flow were not provided in the sources available.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Availability Status */}
        <Card className="trading-panel-enhanced mb-6">
          <CardHeader className="flex flex-row items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-lg">Data Availability Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">Financial Statements</span>
                </div>
                <p className="text-sm text-muted-foreground ml-4">
                  No recent direct fundamental data on income statement, balance sheet, cash flows, capital returns, or ownership structure was accessible from the structured data tools at this time.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">Insider Information</span>
                </div>
                <p className="text-sm text-muted-foreground ml-4">
                  Insider sentiment and transactions data could not be retrieved due to technical issues.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Analysis */}
        <Card className="trading-panel-enhanced mb-6">
          <CardHeader className="flex flex-row items-center gap-2">
            <BarChart3 className="h-5 w-5 text-trading-blue" />
            <CardTitle className="text-lg">Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-base">Key Insights</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-trading-green rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Price Target Optimism</p>
                        <p className="text-sm text-muted-foreground">
                          Price targets from multiple market sources show optimism with targets rising from $310 in early August to over $400 recently.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-trading-blue rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Leadership Developments</p>
                        <p className="text-sm text-muted-foreground">
                          Market commentary includes positive responses to CEO Elon Musk's recent incentive package.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-amber-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Data Gaps</p>
                        <p className="text-sm text-muted-foreground">
                          Key financial metrics and insider activities are currently unavailable for deeper fundamental assessment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-base">Price Target Range</h3>
                  <div className="bg-gradient-to-r from-trading-green/5 to-trading-blue/5 p-4 rounded-lg border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Current Range</span>
                      <Badge variant="secondary" className="text-trading-green">
                        Bullish
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Low Target:</span>
                        <span className="font-medium">$310</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">High Target:</span>
                        <span className="font-medium">$400+</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Timeframe:</span>
                        <span className="font-medium">Next Month</span>
                      </div>
                    </div>
                    <Progress value={75} className="mt-3" />
                    <p className="text-xs text-muted-foreground mt-2">Market sentiment indicator</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="trading-panel-enhanced">
          <CardHeader className="flex flex-row items-center gap-2">
            <Users className="h-5 w-5 text-trading-purple" />
            <CardTitle className="text-lg">Analyst Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-800 mb-2">Primary Recommendation</p>
              <p className="text-sm text-blue-700">
                I recommend further direct access to official financial statements or databases for robust fundamental metrics to supplement these market forecasts.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-800 mb-2">Alternative Approach</p>
              <p className="text-sm text-gray-700">
                If you want, I can attempt to gather parts of the data from other available tools or focus on the next best information source.
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
              <p className="text-sm font-medium text-amber-800 mb-2">Next Steps</p>
              <p className="text-sm text-amber-700">
                Let me know how you wish to proceed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}