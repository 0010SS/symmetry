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

        {/* Data Availability Notice */}
        <Card className="trading-panel-enhanced mb-6">
          <CardHeader className="flex flex-row items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-lg">Data Availability Notice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              No recent data in tool output for TSLA's SimFin financials (income statement, balance sheet, or cash flow), 
              nor insider sentiment/transactions. The only available detail is from a fundamentals snapshot, providing 
              high-level trading data (price, volume, intraday range) as of September 12, 2025, but it does not include 
              financial, capital return, or ownership structure details.
            </p>
            <p className="text-sm text-muted-foreground">
              Given the lack of granular fundamental data, it is not possible to create a robust or actionable analysis 
              regarding revenue trajectory, margins, capital returns, balance sheet health, ownership, or insider activity 
              for TSLA at this time.
            </p>
          </CardContent>
        </Card>

        {/* Trader Insight Board */}
        <Card className="trading-panel-enhanced">
          <CardHeader className="flex flex-row items-center gap-2">
            <Activity className="h-5 w-5 text-trading-blue" />
            <CardTitle className="text-lg">Trader Insight Board</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Theme</TableHead>
                    <TableHead className="font-semibold">Signal</TableHead>
                    <TableHead className="font-semibold">Why It Matters</TableHead>
                    <TableHead className="font-semibold">Evidence</TableHead>
                    <TableHead className="font-semibold">Timeframe</TableHead>
                    <TableHead className="font-semibold">Confidence</TableHead>
                    <TableHead className="font-semibold">Trade Lens</TableHead>
                    <TableHead className="font-semibold">Risks / Offsets</TableHead>
                    <TableHead className="font-semibold">Catalysts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Price/Volume Action</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-amber-600 bg-amber-50 border-amber-200">
                        Uncertain (?)
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      Price/volume spikes can signal news or sentiment.
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      FundamentalsOpenAI 2025-09-13
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        Days/Weeks
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive" className="text-xs">
                        Low
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">Liquidity/Flow</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      No fundamentals surfaced
                    </TableCell>
                    <TableCell className="text-sm">Next earnings date</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              No rows tied to deeper financials, ownership, or insider flows can be constructed due to tool data unavailability. 
              Suggest rerunning once data feed/tools are fully operational for a precise, actionable view.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}