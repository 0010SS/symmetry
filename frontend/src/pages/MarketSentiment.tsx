import { ArrowLeft, TrendingUp, TrendingDown, MessageSquare, Users, BarChart3, AlertTriangle, Target, Calendar, ArrowUpCircle, ArrowDownCircle, ChevronRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

export default function MarketSentiment() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/data/market_sentiment.tsla.2025-09-06_13.json', { cache: 'no-store' })
      .then(r => r.json())
      .then(j => setData(j));
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface-1 to-surface-2 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="sm" onClick={() => navigate('/')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Loading…</h1>
          </div>
        </div>
      </div>
    );
  }

  const { meta, company, industry, timelines, company_insights_table, industry_insights_table, company_narratives, industry_narratives, final_proposals } = data;

  const toneBadge = (b) => (
    <Badge variant={b?.tone === 'green' ? 'default' : 'secondary'} className={b?.tone === 'green' ? 'ml-auto bg-trading-green text-white' : 'ml-auto'}>
      {b?.label}
    </Badge>
  );

  const tlColor = (t) => t === 'pos' ? 'border-trading-green' : t === 'neg' ? 'border-trading-red' : 'border-gray-400';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface-1 to-surface-2 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" onClick={() => navigate('/')} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">{meta.pageTitle}</h1>
          <div className="ml-auto text-sm text-muted-foreground">
            Period: {new Date(meta.period_start).toLocaleDateString()}–{new Date(meta.period_end).toLocaleDateString()}
          </div>
        </div>

        {/* Executive Summary Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Company Sentiment */}
          <Card className="trading-panel-enhanced">
            <CardHeader className="flex flex-row items-center gap-2">
              <ArrowUpCircle className="h-5 w-5 text-trading-green" />
              <CardTitle className="text-lg">{meta.ticker} Company Sentiment</CardTitle>
              {toneBadge(company.badge)}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm">Stock Price</h3>
                  <div className="text-xl font-bold text-trading-green">{company.stock_price}</div>
                  <p className="text-xs text-muted-foreground">{company.stock_note}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Peak Mentions</h3>
                  <div className="text-xl font-bold">{company.peak_mentions_range}</div>
                  <p className="text-xs text-muted-foreground">{company.peak_note}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Key Focus Areas</h3>
                <div className="space-y-2 text-sm">
                  {company.key_focus_areas.map((t, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 text-trading-green" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Market Stability</h3>
                <p className="text-sm text-muted-foreground">{company.market_stability_note}</p>
              </div>
            </CardContent>
          </Card>

          {/* Industry Sentiment */}
          <Card className="trading-panel-enhanced">
            <CardHeader className="flex flex-row items-center gap-2">
              <TrendingUp className="h-5 w-5 text-trading-green" />
              <CardTitle className="text-lg">Industry Sentiment (Auto/EV)</CardTitle>
              {toneBadge(industry.badge)}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm">Net Score</h3>
                  <div className="text-xl font-bold text-trading-green">{industry.net_score}</div>
                  <p className="text-xs text-muted-foreground">Balanced sentiment</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Sentiment Breakdown</h3>
                  <div className="text-sm">
                    <div className="text-trading-green">Positive: {industry.breakdown.positive}</div>
                    <div className="text-trading-red">Negative: {industry.breakdown.negative}</div>
                    <div className="text-muted-foreground">Neutral: {industry.breakdown.neutral}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Key Industry Dynamics</h3>
                <div className="space-y-2 text-sm">
                  {industry.dynamics.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {d.icon === 'up' ? <TrendingUp className="h-3 w-3 text-trading-green" /> :
                       d.icon === 'down' ? <TrendingDown className="h-3 w-3 text-trading-red" /> :
                       <AlertTriangle className="h-3 w-3 text-amber-500" />}
                      <span>{d.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Supply Chain Developments</h3>
                <p className="text-sm text-muted-foreground">{industry.supply_chain_note}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="trading-panel-enhanced">
            <CardHeader><CardTitle>{meta.ticker} Sentiment Timeline</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timelines.company.map((t, i) => (
                  <div key={i} className={`border-l-2 pl-4 ${tlColor(t.tone)}`}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-sm">{t.title}</h3>
                      <Badge variant="secondary" className={t.tone === 'pos' ? 'bg-trading-green text-white' : ''}>{t.window}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{t.summary}</p>
                    <div className="mt-2 text-xs">{t.note}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="trading-panel-enhanced">
            <CardHeader><CardTitle>Industry Sentiment Timeline</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timelines.industry.map((t, i) => (
                  <div key={i} className={`border-l-2 pl-4 ${tlColor(t.tone)}`}>
                    <h3 className="font-semibold text-sm">{t.title}</h3>
                    <p className="text-sm text-muted-foreground">{t.summary}</p>
                    <p className="text-xs text-muted-foreground">{t.note}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tesla Social Media Analyst Insights */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader><CardTitle>{meta.ticker} Social Media Analyst Insights</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Theme</TableHead>
                    <TableHead>Source/Platform</TableHead>
                    <TableHead>Date/Window</TableHead>
                    <TableHead>Metric</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Takeaway</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {company_insights_table.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{r.theme}</TableCell>
                      <TableCell>{r.platform}</TableCell>
                      <TableCell>{r.date_window}</TableCell>
                      <TableCell>{r.metric}</TableCell>
                      <TableCell>{r.value}</TableCell>
                      <TableCell><Badge className="bg-trading-green text-white">{r.confidence}</Badge></TableCell>
                      <TableCell>{r.takeaway}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Industry Social Media Analyst Insights */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader><CardTitle>Industry Social Media Analyst Insights</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Theme</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Date/Window</TableHead>
                    <TableHead>Metric</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Takeaway</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {industry_insights_table.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{r.theme}</TableCell>
                      <TableCell>{r.platform}</TableCell>
                      <TableCell>{r.source}</TableCell>
                      <TableCell>{r.date_window}</TableCell>
                      <TableCell>{r.metric}</TableCell>
                      <TableCell>{r.value}</TableCell>
                      <TableCell><Badge className="bg-trading-green text-white">{r.confidence}</Badge></TableCell>
                      <TableCell>{r.takeaway}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Narratives & Evidence */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="trading-panel-enhanced">
            <CardHeader><CardTitle>{meta.ticker} Detailed Analysis</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3 text-trading-green">Two Non-Obvious Insights</h3>
                <div className="space-y-3">
                  {company_narratives.non_obvious_insights.map((x, i) => (
                    <div key={i} className="p-3 bg-trading-green/10 rounded-lg">
                      <h4 className="font-medium text-sm mb-1">{x.title}</h4>
                      <p className="text-sm text-muted-foreground">{x.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Action Watchlist</h3>
                <div className="space-y-2 text-sm">
                  {company_narratives.action_watchlist.map((x, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Target className="h-3 w-3 text-primary" />
                      <span>{x.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="trading-panel-enhanced">
            <CardHeader><CardTitle>Industry Detailed Analysis</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Key Industry Narratives</h3>
                <div className="space-y-4">
                  {industry_narratives.key_narratives.map((x, i) => (
                    <div key={i}>
                      <h4 className="font-medium text-sm mb-2">{x.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{x.text}</p>
                      <div className="flex items-center gap-1 text-xs text-trading-green">
                        <ExternalLink className="h-3 w-3" />
                        <span>High confidence - confirmed sources</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Actionable Industry Watchlist</h3>
                <div className="space-y-2 text-sm">
                  {industry_narratives.action_watchlist.map((x, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-primary" />
                      <span>{x.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Final Investment Proposals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="trading-panel-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-trading-green" />
                {meta.ticker} Final Proposal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <Badge className="bg-amber-500 text-white text-lg px-4 py-2">{final_proposals.company.label}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{final_proposals.company.text}</p>
            </CardContent>
          </Card>

          <Card className="trading-panel-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-trading-green" />
                Industry Final Proposal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <Badge className="bg-amber-500 text-white text-lg px-4 py-2">{final_proposals.industry.label}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{final_proposals.industry.text}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
