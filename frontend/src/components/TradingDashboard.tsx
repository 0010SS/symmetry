import { useNavigate } from 'react-router-dom';
import { TradingChart } from './TradingChart';
import { AIPanel } from './AIPanel';
import data from "@/data/company-news.json";

export const TradingDashboard = () => {
  const navigate = useNavigate();
  
  const aiPanels = [
    {
      title: "Company Fundamentals",
      summary:
        "Multiple analyst set $400+ price targets. Leadership development from recent wage plan on Elon.",
      route: "/company-fundamentals",
    },
    {
      title: "Company Trends",
      summary:
        "Positive average September returns. Several bullish indicators. Under strong growth momentum.",
      route: "/company-trends",
    },
    {
      title: "Industry Fundamentals",
      summary:
        "Sector P/E ratio normalizing after recent correction. Growth projections remain optimistic at 12% annually. Market cap expansion expected.",
      route: "/industry-fundamentals",
    },
    {
      title: "Industry Trends",
      summary:
        "DRIV in a confirmed medium/long-term uptrend with accelerating momentum. Near 52-week highs, moderate volatility, and a positive September seasonal tilt.",
      route: "/industry-trends",
    },
    {
      title: "Market Sentiment",
      summary:
        "Positive company sentiment (72%) – driven by analyst upgrades and innovation (AI chips, Optimus v3, Megablock).\nIndustry slightly positive (+0.06) – charging standard adoption offsets tax-credit expiry and trade frictions.\nStable backdrop – no manipulation detected, sector momentum intact.",
      route: "/market-sentiment",
    },
    {
      title: "Cross Signals",
      summary:
        "Moderate linkage (53) – correlation 0.40, but high beta (3.11) amplifies volatility. Supply & policy risks – lithium constraints and U.S. EV credit expiry pressure Tesla’s cost/demand balance. ETF flows matter – 3% weight in QQQ makes index moves influence stock dynamics.",
      route: "/cross-signals",
    },
    {
      title: "Final Decision",
      summary:
        "HOLD recommendation based on technical analysis and market conditions. Target: $330-335.",
      route: "/final-decision",
    },
    {
      title: "News",
      summary:
        data.one_sentence_summary ||
        "Latest news impacting the stock and market sentiment.",
      route: "/news",
    },
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