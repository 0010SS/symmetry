import { ArrowLeft, TrendingUp, TrendingDown, MessageSquare, Users, BarChart3, AlertTriangle, Target, Calendar, ArrowUpCircle, ArrowDownCircle, ChevronRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

export default function MarketSentiment() {
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
          <h1 className="text-3xl font-bold">Market Sentiment Analysis</h1>
          <div className="ml-auto text-sm text-muted-foreground">
            Period: September 6-13, 2025
          </div>
        </div>

        {/* Executive Summary Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Company Sentiment */}
          <Card className="trading-panel-enhanced">
            <CardHeader className="flex flex-row items-center gap-2">
              <ArrowUpCircle className="h-5 w-5 text-trading-green" />
              <CardTitle className="text-lg">Tesla Company Sentiment</CardTitle>
              <Badge variant="default" className="ml-auto bg-trading-green text-white">POSITIVE</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm">Stock Price</h3>
                  <div className="text-xl font-bold text-trading-green">$395.94</div>
                  <p className="text-xs text-muted-foreground">Slight positive intraday</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Peak Mentions</h3>
                  <div className="text-xl font-bold">Sep 6-9</div>
                  <p className="text-xs text-muted-foreground">High volume period</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Key Focus Areas</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <ChevronRight className="h-3 w-3 text-trading-green" />
                    <span>AI chips (AI5 and AI6 designs) for market-leading inference</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="h-3 w-3 text-trading-green" />
                    <span>Optimus Version 3 described as "sublime"</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="h-3 w-3 text-trading-green" />
                    <span>Megablock 20 MWh AC battery technology</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="h-3 w-3 text-trading-green" />
                    <span>$1 trillion compensation package positive sentiment</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Market Stability</h3>
                <p className="text-sm text-muted-foreground">
                  No signs of social media manipulation, brigading, or pump-and-dump activity detected
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Industry Sentiment */}
          <Card className="trading-panel-enhanced">
            <CardHeader className="flex flex-row items-center gap-2">
              <TrendingUp className="h-5 w-5 text-trading-green" />
              <CardTitle className="text-lg">Industry Sentiment (Auto/EV)</CardTitle>
              <Badge variant="secondary" className="ml-auto">SLIGHTLY POSITIVE (+0.06)</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm">Net Score</h3>
                  <div className="text-xl font-bold text-trading-green">+0.06</div>
                  <p className="text-xs text-muted-foreground">Balanced sentiment</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Sentiment Breakdown</h3>
                  <div className="text-sm">
                    <div className="text-trading-green">Positive: 7</div>
                    <div className="text-trading-red">Negative: 6</div>
                    <div className="text-muted-foreground">Neutral: 3</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Key Industry Dynamics</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-trading-green" />
                    <span>Tesla NACS charging standard adoption by Porsche, Audi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-3 w-3 text-trading-red" />
                    <span>EV tax-credit expiry driving consumer rush</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-3 w-3 text-trading-red" />
                    <span>GM cutting EV production ahead of credit expiry</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3 text-amber-500" />
                    <span>Trade policy frictions: Mexico tariffs, US chip controls</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Supply Chain Developments</h3>
                <p className="text-sm text-muted-foreground">
                  CATL Hungary plant expansion, Tesla Megapack 3 and Megablock products continuing battery supply growth
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Company Timeline */}
          <Card className="trading-panel-enhanced">
            <CardHeader>
              <CardTitle>Tesla Sentiment Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-2 border-trading-green pl-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-sm">September 6-9, 2025</h3>
                    <Badge variant="secondary" className="bg-trading-green text-white">Peak Volume</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Most significant volume of mentions tied to technical innovation narratives and executive announcements
                  </p>
                  <div className="mt-2 text-xs space-y-1">
                    <div>• AI chip updates (AI5 and AI6 designs)</div>
                    <div>• Optimus Version 3 announcement</div>
                    <div>• Megablock 20 MWh launch</div>
                    <div>• Positive analyst commentary</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Industry Timeline */}
          <Card className="trading-panel-enhanced">
            <CardHeader>
              <CardTitle>Industry Sentiment Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-2 border-trading-green pl-4">
                  <h3 className="font-semibold text-sm">Sep 6: Tesla Supercharger + Porsche</h3>
                  <p className="text-sm text-muted-foreground">Positive spike (+0.3 to +0.4 sentiment)</p>
                  <p className="text-xs text-muted-foreground">Business sales launch and access announced</p>
                </div>
                
                <div className="border-l-2 border-gray-400 pl-4">
                  <h3 className="font-semibold text-sm">Sep 7: CATL Hungary Plant</h3>
                  <p className="text-sm text-muted-foreground">Neutral sentiment</p>
                  <p className="text-xs text-muted-foreground">Battery factory expansion news</p>
                </div>
                
                <div className="border-l-2 border-trading-red pl-4">
                  <h3 className="font-semibold text-sm">Sep 8: Policy & Production</h3>
                  <p className="text-sm text-muted-foreground">Negative (-0.4 to -0.5 sentiment)</p>
                  <p className="text-xs text-muted-foreground">US chip export controls + GM cuts EV production</p>
                </div>
                
                <div className="border-l-2 border-trading-red pl-4">
                  <h3 className="font-semibold text-sm">Sep 10: Mexico Tariffs</h3>
                  <p className="text-sm text-muted-foreground">Negative (-0.6 sentiment), VW delays (-0.2)</p>
                  <p className="text-xs text-muted-foreground">Trade friction impacts</p>
                </div>
                
                <div className="border-l-2 border-trading-green pl-4">
                  <h3 className="font-semibold text-sm">Sep 11+: Audi Access</h3>
                  <p className="text-sm text-muted-foreground">Positive (+0.35 sentiment)</p>
                  <p className="text-xs text-muted-foreground">Tesla Supercharger access + industry adaptation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tesla Social Media Analyst Insights */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader>
            <CardTitle>Tesla Social Media Analyst Insights</CardTitle>
          </CardHeader>
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
                  <TableRow>
                    <TableCell className="font-medium">AI Chip Development</TableCell>
                    <TableCell>Multiple (news sites)</TableCell>
                    <TableCell>Sep 6-8, 2025</TableCell>
                    <TableCell>Headline mentions</TableCell>
                    <TableCell>3 major announcements</TableCell>
                    <TableCell><Badge className="bg-trading-green text-white">High</Badge></TableCell>
                    <TableCell>Tesla advancing leading AI chip designs with strong CEO backing</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Optimus Robot Version</TableCell>
                    <TableCell>Social media/news</TableCell>
                    <TableCell>Sep 7, 2025</TableCell>
                    <TableCell>Positive sentiment</TableCell>
                    <TableCell>CEO calls v3 "sublime"</TableCell>
                    <TableCell><Badge className="bg-trading-green text-white">High</Badge></TableCell>
                    <TableCell>Optimus V3 might boost robotics segment interest</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Battery Megablock</TableCell>
                    <TableCell>News</TableCell>
                    <TableCell>Sep 9, 2025</TableCell>
                    <TableCell>Product launch</TableCell>
                    <TableCell>20 MWh AC blocks, 50 GWh/yr</TableCell>
                    <TableCell><Badge className="bg-trading-green text-white">High</Badge></TableCell>
                    <TableCell>Energy storage scale and efficiency improvements</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Compensation Package</TableCell>
                    <TableCell>Analyst commentary</TableCell>
                    <TableCell>Sep 7, 2025</TableCell>
                    <TableCell>Positive analyst</TableCell>
                    <TableCell>Morgan Stanley optimistic</TableCell>
                    <TableCell><Badge className="bg-trading-green text-white">High</Badge></TableCell>
                    <TableCell>$1 trillion CEO package seen as shareholder positive</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Industry Social Media Analyst Insights */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader>
            <CardTitle>Industry Social Media Analyst Insights</CardTitle>
          </CardHeader>
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
                  <TableRow>
                    <TableCell className="font-medium">EV Tax Credit & Production</TableCell>
                    <TableCell>News websites</TableCell>
                    <TableCell>The Verge, WP</TableCell>
                    <TableCell>2025-09-06 to 13</TableCell>
                    <TableCell>Sentiment score</TableCell>
                    <TableCell>-0.5 to 0.0</TableCell>
                    <TableCell><Badge className="bg-trading-green text-white">High</Badge></TableCell>
                    <TableCell>Tax credit expiry causes visible production cuts and sales timing acceleration</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Charging Standard (NACS) Adoption</TableCell>
                    <TableCell>Industry portals</TableCell>
                    <TableCell>CBT News, EVCS</TableCell>
                    <TableCell>2025-09-06 to 13</TableCell>
                    <TableCell>Sentiment score</TableCell>
                    <TableCell>+0.25 to +0.4</TableCell>
                    <TableCell><Badge className="bg-trading-green text-white">High</Badge></TableCell>
                    <TableCell>NACS spreading, cross-brand access gains momentum but VW technical delays persist</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Trade/Policy Impact</TableCell>
                    <TableCell>Reuters</TableCell>
                    <TableCell>Reuters</TableCell>
                    <TableCell>2025-09-08 to 10</TableCell>
                    <TableCell>Sentiment score</TableCell>
                    <TableCell>-0.6 to -0.4</TableCell>
                    <TableCell><Badge className="bg-trading-green text-white">High</Badge></TableCell>
                    <TableCell>Tariffs and export-controls add material headwinds to supply chain and pricing</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Battery Supply Growth</TableCell>
                    <TableCell>Reuters</TableCell>
                    <TableCell>Reuters</TableCell>
                    <TableCell>2025-09-07</TableCell>
                    <TableCell>Neutral</TableCell>
                    <TableCell>0.0</TableCell>
                    <TableCell><Badge className="bg-trading-green text-white">High</Badge></TableCell>
                    <TableCell>Expanding battery production called out as positive foundation for long-term EV supply</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Utility Storage & Infrastructure</TableCell>
                    <TableCell>News / Industry blogs</TableCell>
                    <TableCell>The Verge, TeslaNorth</TableCell>
                    <TableCell>2025-09-06 to 13</TableCell>
                    <TableCell>Sentiment score</TableCell>
                    <TableCell>+0.2 to +0.3</TableCell>
                    <TableCell><Badge className="bg-trading-green text-white">High</Badge></TableCell>
                    <TableCell>Fast charging and grid storage tech continue innovation and new commercial offerings</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">EV Market Consolidation & Pricing</TableCell>
                    <TableCell>Financial news</TableCell>
                    <TableCell>FT</TableCell>
                    <TableCell>2025-09-07 to 10</TableCell>
                    <TableCell>Sentiment score</TableCell>
                    <TableCell>-0.3</TableCell>
                    <TableCell><Badge variant="secondary">Medium</Badge></TableCell>
                    <TableCell>Market consolidation in China signals returning pricing power and winnowing weaker brands</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Narratives & Evidence */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Company Narratives */}
          <Card className="trading-panel-enhanced">
            <CardHeader>
              <CardTitle>Tesla Detailed Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3 text-trading-green">Two Non-Obvious Insights</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-trading-green/10 rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Strategic Silicon Consolidation</h4>
                    <p className="text-sm text-muted-foreground">
                      Elon Musk's focus on a single-chip architecture (AI5) signals strategic consolidation of Tesla's silicon efforts, 
                      potentially increasing R&D efficiency and innovation speed, unlike competitors spreading resources across multiple chip platforms.
                    </p>
                  </div>
                  <div className="p-3 bg-trading-green/10 rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Robotics Strategy Maturation</h4>
                    <p className="text-sm text-muted-foreground">
                      The staggered reveal of Optimus versions (2.5 followed by promised v3) suggests Tesla is pacing robotic product readiness carefully, 
                      possibly to ensure robustness before commercialization, indicating a maturing robotics strategy rather than hype.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Action Watchlist</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-primary" />
                    <span>Watch for official Tesla releases on Optimus Version 3</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-primary" />
                    <span>Monitor Megablock installations starting 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-primary" />
                    <span>Track compensation package implications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-primary" />
                    <span>Follow AI chip production volume disclosures</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-primary" />
                    <span>Observe AI chip performance benchmarks</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Industry Narratives */}
          <Card className="trading-panel-enhanced">
            <CardHeader>
              <CardTitle>Industry Detailed Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Key Industry Narratives</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2 text-trading-red">EV Tax Credit Expiry & Production Adjustments</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      GM cuts EV output ahead of credit expiry; retail rush noted across US consumers/dealers.
                    </p>
                    <div className="flex items-center gap-1 text-xs text-trading-green">
                      <ExternalLink className="h-3 w-3" />
                      <span>High confidence - confirmed sources</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2 text-trading-green">Charging Standard Consolidation (NACS)</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Porsche and Audi launch soft access to Tesla Superchargers; Nissan to launch NACS entry-level EV, VW delays adapter rollout.
                    </p>
                    <div className="flex items-center gap-1 text-xs text-trading-green">
                      <ExternalLink className="h-3 w-3" />
                      <span>High confidence - multiple confirmed sources</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2 text-amber-600">Trade & Supply Chain Policies</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Mexico raises tariffs on Chinese cars (50%), US weighs tighter chip export controls on fabs in China.
                    </p>
                    <div className="flex items-center gap-1 text-xs text-trading-green">
                      <ExternalLink className="h-3 w-3" />
                      <span>High confidence - Reuters confirmed</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Actionable Industry Watchlist</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-primary" />
                    <span>Monitor Sept 30 EV tax credit deadline impact</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-primary" />
                    <span>Track NACS adoption pace by other OEMs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3 text-primary" />
                    <span>Watch China supply chain policies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-primary" />
                    <span>Follow CATL Hungary plant progress (early 2026)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-3 w-3 text-primary" />
                    <span>Track EV market pricing dynamics in China</span>
                  </div>
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
                Tesla Final Proposal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <Badge className="bg-amber-500 text-white text-lg px-4 py-2">HOLD</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                No signs of social media brigading or manipulation were found. Sentiment is overall positive and aligned with verified product and corporate updates. 
                Market impact is likely neutral to moderately positive barring unforeseen operational issues.
              </p>
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
                <Badge className="bg-amber-500 text-white text-lg px-4 py-2">HOLD</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                The EV auto manufacturing industry shows balanced sentiment with immediate-term tax-credit-driven dynamics, 
                decisive shift to Tesla's NACS standard, emerging trade barriers, and advancing infrastructure. 
                Market consolidation themes emerging in China.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}