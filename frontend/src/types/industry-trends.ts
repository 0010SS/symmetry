export interface IndustryTrend {
  id: string;
  category: string;
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  timeframe: string;
}

export interface IndustryTrendsData {
  industry: string;
  sector: string;
  last_updated: string;
  status: string;
  pageTitle: string;
  executiveSummary: any;
  levelsRegime: any;
  momentumVolatility: any;
  seasonality: any;
  indicatorPanel: any;
  companyLinkage: any;
  additionalInsights: any;
  summary: any;
  trends?: IndustryTrend[];
}