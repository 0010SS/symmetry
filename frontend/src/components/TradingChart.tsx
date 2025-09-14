import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Bar } from 'recharts';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { IndicatorHeader } from './IndicatorHeader';
import tslaData from '/public/data/TSLA_ohlc.json';

// Process TSLA OHLC data - take recent 50 trading days for better visualization
const processedData = tslaData
  .slice(-50)
  .map((item: any, index: number) => ({
    ...item,
    time: new Date(item.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    // Calculate candlestick body and wicks for visual representation
    bodyLow: Math.min(item.open, item.close),
    bodyHigh: Math.max(item.open, item.close),
    isGreen: item.close > item.open,
    change: index > 0 ? item.close - tslaData.slice(-50)[index - 1].close : 0,
    changePercent: index > 0 ? ((item.close - tslaData.slice(-50)[index - 1].close) / tslaData.slice(-50)[index - 1].close) * 100 : 0
  }));

// Get latest data point for current price display
const latestData = processedData[processedData.length - 1];
const currentPrice = latestData?.close || 0;
const priceChange = latestData?.change || 0;
const percentChange = latestData?.changePercent || 0;

interface TradingChartProps {
  symbol: string;
}

export const TradingChart = ({ symbol }: TradingChartProps) => {
  return (
    <div className="chart-container h-full flex flex-col relative">
      {/* Technical Indicators Header */}
      <IndicatorHeader />
      
      {/* Chart Header */}
      <div className="flex items-center justify-between p-6 pb-2">
        <div>
          <h2 className="text-2xl font-bold text-foreground">TSLA</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>${currentPrice.toFixed(2)}</span>
            <span className={priceChange >= 0 ? "text-trading-green" : "text-trading-red"}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({percentChange >= 0 ? '+' : ''}{percentChange.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Last updated: {latestData?.time || 'N/A'}
        </div>
      </div>
      
      {/* Chart */}
      <div className="flex-1 px-6 pb-16">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              domain={['dataMin - 5', 'dataMax + 5']}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--panel-bg))',
                border: '1px solid hsl(var(--panel-border))',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow-md)'
              }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-panel-bg p-3 border border-panel-border rounded-lg shadow-md">
                      <p className="text-sm font-medium">{label}</p >
                      <div className="space-y-1 text-xs">
                        <p>Open: <span className="font-medium">${data.open?.toFixed(2)}</span></p >
                        <p>High: <span className="font-medium text-trading-green">${data.high?.toFixed(2)}</span></p >
                        <p>Low: <span className="font-medium text-trading-red">${data.low?.toFixed(2)}</span></p >
                        <p>Close: <span className="font-medium">${data.close?.toFixed(2)}</span></p >
                        <p>Volume: <span className="font-medium">{(data.volume / 1000000).toFixed(1)}M</span></p >
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Price line chart */}
            <Line 
              type="monotone" 
              dataKey="close" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={false}
              connectNulls={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};