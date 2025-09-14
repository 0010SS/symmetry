import { useNavigate } from 'react-router-dom';
import { TradingChart } from './TradingChart';
import { AIPanel } from './AIPanel';
import data from "@/data/company-news.json";

export const TradingDashboard = () => {
  const navigate = useNavigate();
  
  const aiPanels = [
    {
      title: "Company Fundamentals",
      summary: "Strong quarterly earnings with 15% revenue growth. P/E ratio of 24.5 indicates fair valuation. Debt-to-equity ratio improved to 0.42.",
      route: "/company-fundamentals"
    },
    {
      title: "Company Trends", 
      summary: "Upward momentum in stock price with consistent volume. Technical indicators showing bullish patterns across multiple timeframes.",
      route: "/company-trends"
    },
    {
      title: "Industry Fundamentals",
      summary: "Sector P/E ratio normalizing after recent correction. Growth projections remain optimistic at 12% annually. Market cap expansion expected.",
      route: "/industry-fundamentals"
    },
    {
      title: "Industry Trends",
      summary: "Cloud adoption accelerating. AI integration driving competitive advantages. Digital transformation creating new revenue streams.",
      route: "/industry-trends"
    },
    {
      title: "Market Sentiment",
      summary: "Company sentiment at 72% positive with analyst upgrades from 3 major institutions. Technology sector momentum remains strong.",
      route: "/market-sentiment"
    },
    {
      title: "Cross Signals",
      summary: "Golden cross pattern detected. MACD showing bullish divergence. Volume confirmation suggests sustainable uptrend.",
      route: "/cross-signals"
    },
    {
      title: "Final Decision",
      summary: "BUY recommendation based on strong fundamentals, positive technical signals, and favorable sentiment confluence. Target: $165.",
      route: "/final-decision"
    },
    {
      title: "News",
      summary: data.one_sentence_summary || "Latest news impacting the stock and market sentiment.",
      route: "/news"
    }
  ];

  const handlePanelClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface-1 to-surface-2 p-6">
      <div className="grid grid-cols-6 grid-rows-4 gap-4 h-screen max-h-[95vh]">
        {/* Top Row - 4 panels spanning first 4 columns */}
        <AIPanel
          title={aiPanels[0].title}
          summary={aiPanels[0].summary}
          onClick={() => handlePanelClick(aiPanels[0].route)}
          className="col-span-1 row-span-1"
        />
        
        <AIPanel
          title={aiPanels[1].title}
          summary={aiPanels[1].summary}
          onClick={() => handlePanelClick(aiPanels[1].route)}
          className="col-span-1 row-span-1"
        />
        
        <AIPanel
          title={aiPanels[2].title}
          summary={aiPanels[2].summary}
          onClick={() => handlePanelClick(aiPanels[2].route)}
          className="col-span-1 row-span-1"
        />
        
        <AIPanel
          title={aiPanels[3].title}
          summary={aiPanels[3].summary}
          onClick={() => handlePanelClick(aiPanels[3].route)}
          className="col-span-1 row-span-1"
        />

        {/* Right side tall panel spanning 2 columns and 4 rows */}
        <div className="col-span-2 row-span-4 flex flex-col gap-4">
          <AIPanel
            title={aiPanels[4].title}
            summary={aiPanels[4].summary}
            onClick={() => handlePanelClick(aiPanels[4].route)}
            className="flex-1"
            panelType="sentiment"
          />
          
          <AIPanel
            title={aiPanels[5].title}
            summary={aiPanels[5].summary}
            onClick={() => handlePanelClick(aiPanels[5].route)}
            className="flex-1"
            panelType="technical"
          />
          
          <AIPanel
            title={aiPanels[6].title}
            summary={aiPanels[6].summary}
            onClick={() => handlePanelClick(aiPanels[6].route)}
            className="flex-1"
            panelType="decision"
          />
        </div>

        {/* Main Chart Area - Large center taking 4 columns, 2 rows */}
        <div className="col-span-4 row-span-2">
          <TradingChart symbol="TSLA" />
        </div>

        {/* Bottom panel spanning same width as chart */}
        <AIPanel
          title={aiPanels[7].title}
          summary={aiPanels[7].summary}
          onClick={() => handlePanelClick(aiPanels[7].route)}
          className="col-span-4 row-span-1"
          panelType="news"
        />
      </div>
    </div>
  );
};