import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Settings, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const IndicatorHeader = () => {
  const indicators = [
    { id: 'rsi', label: 'RSI', checked: true },
    { id: 'macd', label: 'MACD', checked: true },
    { id: 'bollinger', label: 'Bollinger Bands', checked: false },
    { id: 'sma', label: 'SMA', checked: true },
    { id: 'ema', label: 'EMA', checked: false },
  ];

  return (
    <div className="bg-surface-1 border-b border-panel-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Select defaultValue="AAPL">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select symbol" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-panel-border z-50">
              <SelectItem value="AAPL">AAPL</SelectItem>
              <SelectItem value="MSFT">MSFT</SelectItem>
              <SelectItem value="GOOGL">GOOGL</SelectItem>
              <SelectItem value="AMZN">AMZN</SelectItem>
              <SelectItem value="TSLA">TSLA</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings size={16} />
                Indicators
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-background border border-panel-border z-50">
              {indicators.map((indicator) => (
                <DropdownMenuCheckboxItem
                  key={indicator.id}
                  checked={indicator.checked}
                  onCheckedChange={() => {}}
                >
                  {indicator.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <TrendingUp size={16} />
                Strategy
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-background border border-panel-border z-50">
              <DropdownMenuItem className="flex items-center gap-2 text-trading-red hover:text-trading-red hover:bg-trading-red/10">
                <TrendingDown className="h-3 w-3" />
                <span>Aggressive</span>
                <div className="ml-auto text-xs opacity-60">High Risk</div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-accent">
                <Minus className="h-3 w-3" />
                <span>Neutral</span>
                <div className="ml-auto text-xs opacity-60">Balanced</div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 text-trading-green hover:text-trading-green hover:bg-trading-green/10">
                <TrendingUp className="h-3 w-3" />
                <span>Conservative</span>
                <div className="ml-auto text-xs opacity-60">Low Risk</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};