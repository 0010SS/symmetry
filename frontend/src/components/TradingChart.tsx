import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { IndicatorHeader } from './IndicatorHeader';

// Mock candlestick data
const mockData = [
  { time: '09:30', price: 150.25, volume: 1200 },
  { time: '10:00', price: 152.10, volume: 1580 },
  { time: '10:30', price: 151.75, volume: 980 },
  { time: '11:00', price: 153.40, volume: 2100 },
  { time: '11:30', price: 154.20, volume: 1650 },
  { time: '12:00', price: 152.85, volume: 1320 },
  { time: '12:30', price: 155.15, volume: 2250 },
  { time: '13:00', price: 156.30, volume: 1890 },
  { time: '13:30', price: 154.90, volume: 1560 },
  { time: '14:00', price: 157.25, volume: 2180 },
];

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
          <h2 className="text-2xl font-bold text-foreground">{symbol}</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>$157.25</span>
            <span className="text-trading-green">+2.15 (+1.39%)</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Last updated: 2:00 PM EST
        </div>
      </div>
      
      {/* Chart */}
      <div className="flex-1 px-6 pb-16">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              domain={['dataMin - 1', 'dataMax + 1']}
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
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};