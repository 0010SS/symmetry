import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const IndustryTrends = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold text-primary">Industry Trends Analysis</h1>
        </div>

        {/* Executive Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Executive Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm"><strong>ETF Symbol & Rationale:</strong> DRIV (Global X Autonomous & Electric Vehicles ETF) representing electric and autonomous vehicle industry tied to Tesla.</p>
              </div>
              <div>
                <p className="text-sm"><strong>YoY Return:</strong> Approx. 21.51 (close on 2025-09-13) vs 20.80 (close ~2024-08-09) → Abs: +0.71, %: +3.41%, indicating minimal YoY growth.</p>
              </div>
              <div>
                <p className="text-sm"><strong>MoM Return:</strong> Approx. 26.34 (latest ~2025-09-12) vs 24.30 (mid ~2025-07-15) → Abs: +2.04, %: +8.4%, showing solid MoM appreciation.</p>
              </div>
              <div>
                <p className="text-sm"><strong>52-Week Positioning:</strong> 52W Low ~17.62, 52W High ~26.24, current ~26.34 implies near 52W high (~+0.4% above high; near peak level).</p>
              </div>
              <div>
                <p className="text-sm"><strong>Relative Strength vs SPY:</strong> DRIV's relative strength (ETF close / SPY close) is on a mildly rising trend over past year, indicating outperformance potential versus SPY.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Levels & Regime */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Levels & Regime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">• Price steady above both 50-day SMA (~25.11) and 200-day SMA (~23.02), confirming medium and long term bullish trend regime.</p>
              <p className="text-sm">• 50-day SMA above 200-day SMA, no recent cross, indicating sustained bullish momentum.</p>
              <p className="text-sm">• Near resistance at recent 52W high (~26.24), with support zones around 23.00 (200-day SMA) and 25.00 (50-day SMA).</p>
            </div>
          </CardContent>
        </Card>

        {/* Momentum & Volatility */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Momentum & Volatility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">• MACD positive and rising (~0.345 latest), showing bullish momentum buildup.</p>
              <p className="text-sm">• RSI around 60-63, in moderate momentum/strength zone, not overbought.</p>
              <p className="text-sm">• ATR steady around 0.37-0.39 level, indicating moderate volatility.</p>
              <p className="text-sm">• Bollinger Bands middle (~25.89) under price confirms upward price pressure, albeit near upper band.</p>
            </div>
          </CardContent>
        </Card>

        {/* Seasonality */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Seasonality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">• Current month (September) average return over 6 years is approximately +2.5% (calculated from 2020-2025), indicating positive seasonal bias.</p>
              <p className="text-sm">• Number of years in sample: 6 full Septembers.</p>
            </div>
          </CardContent>
        </Card>

        {/* Indicator Panel */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Indicator Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">• <strong>close_50_sma:</strong> Confirms medium-term trend support (~25.11) below current ~26.3.</p>
              <p className="text-sm">• <strong>close_200_sma:</strong> Confirms long-term trend support (~23.02), well below current price.</p>
              <p className="text-sm">• <strong>macd:</strong> Bullish rising values (~0.345) support momentum continuation.</p>
              <p className="text-sm">• <strong>rsi:</strong> Moderate (~60-63) momentum, no overbought risk.</p>
              <p className="text-sm">• <strong>boll:</strong> Price near upper Bollinger band, signaling strong short-term trend but potential overextension.</p>
              <p className="text-sm">• <strong>atr:</strong> Moderate volatility (~0.37), allowing stable technical interpretation.</p>
            </div>
          </CardContent>
        </Card>

        {/* Company Linkage */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Company Linkage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">• Tesla benefits from industry ETF exhibiting near-peak price levels and strong momentum, signaling favorable investor sentiment toward EV and autonomous vehicle sector.</p>
              <p className="text-sm">• Strong support by 50 and 200-day SMAs suggests stable investor confidence supporting Tesla's sector position.</p>
              <p className="text-sm">• Seasonal buy tendency in September may coincide with potential product launches/progress announcements affecting Tesla specifically.</p>
              <p className="text-sm">• Relative outperformance vs SPY suggests sector strength which can buoy Tesla amidst broader market volatility.</p>
            </div>
          </CardContent>
        </Card>

        {/* Industry Market Analyst Insights */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Industry Market Analyst Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Theme</TableHead>
                    <TableHead className="font-semibold">Metric/Signal</TableHead>
                    <TableHead className="font-semibold">Value</TableHead>
                    <TableHead className="font-semibold">Source/Tool</TableHead>
                    <TableHead className="font-semibold">Takeaway</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="p-2">Price Performance</TableCell>
                    <TableCell className="p-2">YoY Return %</TableCell>
                    <TableCell className="p-2">+3.41%</TableCell>
                    <TableCell className="p-2">get_YFin_data_online</TableCell>
                    <TableCell className="p-2">Subdued YoY growth but positive momentum</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="p-2">Price Performance</TableCell>
                    <TableCell className="p-2">MoM Return %</TableCell>
                    <TableCell className="p-2">+8.4%</TableCell>
                    <TableCell className="p-2">get_YFin_data_online</TableCell>
                    <TableCell className="p-2">Strong momentum in recent 1 month</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="p-2">Trend Confirmation</TableCell>
                    <TableCell className="p-2">50 SMA vs Price</TableCell>
                    <TableCell className="p-2">25.11 vs 26.34</TableCell>
                    <TableCell className="p-2">get_stockstats_indicators_report</TableCell>
                    <TableCell className="p-2">Price above 50 SMA confirms medium-term uptrend</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="p-2">Trend Confirmation</TableCell>
                    <TableCell className="p-2">200 SMA vs Price</TableCell>
                    <TableCell className="p-2">23.02 vs 26.34</TableCell>
                    <TableCell className="p-2">get_stockstats_indicators_report</TableCell>
                    <TableCell className="p-2">Price well above 200 SMA confirms long-term uptrend</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="p-2">Momentum</TableCell>
                    <TableCell className="p-2">MACD</TableCell>
                    <TableCell className="p-2">0.345</TableCell>
                    <TableCell className="p-2">get_stockstats_indicators_report</TableCell>
                    <TableCell className="p-2">Positive and rising momentum</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="p-2">Volatility</TableCell>
                    <TableCell className="p-2">ATR</TableCell>
                    <TableCell className="p-2">0.37</TableCell>
                    <TableCell className="p-2">get_stockstats_indicators_report</TableCell>
                    <TableCell className="p-2">Moderate volatility, manageable risk</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="p-2">Seasonality</TableCell>
                    <TableCell className="p-2">September Average Return</TableCell>
                    <TableCell className="p-2">+2.5%</TableCell>
                    <TableCell className="p-2">get_YFin_data_online</TableCell>
                    <TableCell className="p-2">Positive seasonal bias in current month</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="p-2">Relative Strength</TableCell>
                    <TableCell className="p-2">RS vs SPY Trend</TableCell>
                    <TableCell className="p-2">Mildly rising</TableCell>
                    <TableCell className="p-2">get_YFin_data_online</TableCell>
                    <TableCell className="p-2">Sector exhibiting relative strength vs market</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Additional Insights */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Additional Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">New Category: ETF Liquidity and Volume Profile</h3>
                <div className="space-y-1 ml-4">
                  <p className="text-sm">• <strong>Insight 1:</strong> DRIV's volume has been consistent in the thousands to hundreds of thousands range recently, suggesting decent liquid trading supporting robust technical levels.</p>
                  <p className="text-sm">• <strong>Insight 2:</strong> Volume spikes correlate with price spikes, confirming higher investor conviction on rises, reinforcing trend bias.</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">New Category: Technical Risk Signals</h3>
                <div className="space-y-1 ml-4">
                  <p className="text-sm">• <strong>Insight 1:</strong> Proximity to 52W high puts DRIV at potential resistance; watch for breakouts or pullbacks for actionable signals.</p>
                  <p className="text-sm">• <strong>Insight 2:</strong> RSI and Bollinger Band proximity indicate strong momentum but caution over short-term pullback risk.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm leading-relaxed">
                The Global X Autonomous & Electric Vehicles ETF (DRIV) representing Tesla's sector is currently in a confirmed medium and long-term uptrend with accelerating momentum and positive recent monthly returns. It trades near its 52-week high with moderate volatility and a positive seasonal bias in September. Relative strength vs the broad market SPY suggests the EV/autonomous vehicle sector retains a relative performance advantage. These conditions support a stable and constructive industry backdrop for Tesla in the near-term.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IndustryTrends;