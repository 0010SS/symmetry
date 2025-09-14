import { Card } from '@/components/ui/card';
import { ChevronRight, TrendingUp, AlertTriangle, Target, Newspaper, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AIPanelProps {
  title: string;
  summary: string;
  onClick?: () => void;
  className?: string;
  panelType?: 'fundamentals' | 'trends' | 'sentiment' | 'technical' | 'decision' | 'news';
}

export const AIPanel = ({ title, summary, onClick, className, panelType = 'fundamentals' }: AIPanelProps) => {
  const getIcon = () => {
    switch (panelType) {
      case 'sentiment':
        return <TrendingUp className="h-4 w-4" />;
      case 'technical':
        return <BarChart3 className="h-4 w-4" />;
      case 'decision':
        return <Target className="h-4 w-4" />;
      case 'news':
        return <Newspaper className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getBadgeVariant = () => {
    switch (panelType) {
      case 'sentiment':
        return 'sentiment';
      case 'technical':
        return 'technical';
      case 'decision':
        return 'decision';
      case 'news':
        return 'news';
      default:
        return 'default';
    }
  };

  const getConfidenceScore = () => {
    switch (panelType) {
      case 'sentiment':
        return '72%';
      case 'technical':
        return '85%';
      case 'decision':
        return '94%';
      default:
        return '78%';
    }
  };

  return (
    <Card 
      className={`trading-panel-enhanced panel-${panelType} p-4 cursor-pointer group relative overflow-hidden ${className}`}
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="panel-icon">
              {getIcon()}
            </div>
            <h3 className="panel-title">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            {panelType !== 'news' && (
              <Badge variant={getBadgeVariant() as any} className="confidence-badge">
                {getConfidenceScore()}
              </Badge>
            )}
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
          </div>
        </div>
        
        <div className="flex-1">
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4 relative">
            {summary}
            {panelType === 'decision' && (
              <span className="trend-indicator trend-up absolute -right-1 top-0"></span>
            )}
            {panelType === 'sentiment' && (
              <span className="trend-indicator trend-up absolute -right-1 top-0"></span>
            )}
            {panelType === 'technical' && (
              <span className="trend-indicator trend-neutral absolute -right-1 top-0"></span>
            )}
          </p>
        </div>

        {panelType === 'sentiment' && (
          <div className="mt-3 pt-2 border-t border-border/50">
            <div className="sentiment-bar">
              <div className="sentiment-fill" style={{ width: '72%' }}></div>
            </div>
          </div>
        )}

        {panelType === 'decision' && (
          <div className="mt-3 pt-2 border-t border-border/50">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Recommendation</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-yellow-500 animate-pulse">HOLD</span>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Target: <span className="font-semibold text-foreground">$330.00 - $335.00</span>
            </div>
          </div>
        )}

        {panelType === 'technical' && (
          <div className="mt-3 pt-2 border-t border-border/50">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Signal Strength</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`w-1 h-3 rounded-full ${
                      i <= 4 ? 'bg-trading-blue' : 'bg-muted'
                    } transition-all duration-300`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {panelType === 'news' && (
          <div className="mt-3 pt-2 border-t border-border/50">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Market Impact</span>
              <span className="font-semibold text-purple-600">MEDIUM</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};