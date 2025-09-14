import { ArrowLeft, TrendingUp, TrendingDown, MessageSquare, Users, BarChart3, AlertTriangle, Target, Calendar, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
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
        </div>

        {/* Executive Summary Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Company Sentiment */}
          <Card className="trading-panel-enhanced">
            <CardHeader className="flex flex-row items-center gap-2">
              <ArrowUpCircle className="h-5 w-5 text-trading-green" />
              <CardTitle className="text-lg">Company Sentiment (TSLA)</CardTitle>
              <Badge variant="default" className="ml-auto bg-trading-green text-white">Strongly Positive ↑</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm">Largest Daily Move</h3>
                  <div className="text-xl font-bold text-trading-green">+$48.15</div>
                  <p className="text-xs text-muted-foreground">+13.9% on Sep 11–12, 2025</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Peak Daily Mentions</h3>
                  <div className="text-xl font-bold">2,500+</div>
                  <p className="text-xs text-muted-foreground">September 11, 2025</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Brightest Narrative</h3>
                <p className="text-sm text-muted-foreground">
                  Tesla's rapid AI/robotics advancement ("game-changing" chips), high optimism for future product impact
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Darkest Narrative</h3>
                <p className="text-sm text-muted-foreground">
                  Minimal negative narrative present, aside from generic market volatility talk
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Current Sentiment</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Positive</span>
                    <span className="text-sm font-medium text-trading-green">{">"} 80%</span>
                  </div>
                  <Progress value={80} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Negative: {"<"} 10%</span>
                    <span>Neutral: ~10%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Industry Sentiment */}
          <Card className="trading-panel-enhanced">
            <CardHeader className="flex flex-row items-center gap-2">
              <ArrowDownCircle className="h-5 w-5 text-trading-red" />
              <CardTitle className="text-lg">Industry Sentiment (EV Sector)</CardTitle>
              <Badge variant="destructive" className="ml-auto">Negative ↓</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm">Net Sentiment Score</h3>
                  <div className="text-xl font-bold text-trading-red">-0.37</div>
                  <p className="text-xs text-muted-foreground">13 headlines analyzed</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Peak Mention Date</h3>
                  <div className="text-xl font-bold">Sep 8</div>
                  <p className="text-xs text-muted-foreground">EV sales spike concerns</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Brightest Narrative</h3>
                <p className="text-sm text-muted-foreground">
                  Autonomy/robotaxi competition (Zoox launch, positive public reaction)
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Darkest Narrative</h3>
                <p className="text-sm text-muted-foreground">
                  EV demand spike tied only to U.S. federal tax-credit expiration (risk of demand cliff)
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Sentiment Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Negative</span>
                    <span className="text-sm font-medium text-trading-red">8 items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Neutral</span>
                    <span className="text-sm font-medium">3 items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Positive</span>
                    <span className="text-sm font-medium text-trading-green">2 items</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Company Timeline */}
          <Card className="trading-panel-enhanced">
            <CardHeader>
              <CardTitle>Company Volume & Sentiment Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-2 border-trading-green pl-4">
                  <h3 className="font-semibold text-sm">September 6–9</h3>
                  <p className="text-sm text-muted-foreground">~900–1,200 mentions/day</p>
                  <p className="text-xs text-muted-foreground">60% positive, 30% neutral, 10% negative</p>
                </div>
                <div className="border-l-2 border-trading-green pl-4">
                  <h3 className="font-semibold text-sm">September 10</h3>
                  <p className="text-sm text-muted-foreground">1,900+ mentions, +$27 intraday move</p>
                  <p className="text-xs text-muted-foreground">~75% positive—AI5/AI6 chip news spike</p>
                </div>
                <div className="border-l-2 border-trading-green pl-4">
                  <h3 className="font-semibold text-sm">September 11</h3>
                  <p className="text-sm text-muted-foreground">~2,500 mentions (+13.9% move)</p>
                  <p className="text-xs text-muted-foreground">80% positive—AI chips & technical breakout</p>
                </div>
                <div className="border-l-2 border-trading-green pl-4">
                  <h3 className="font-semibold text-sm">September 12–13</h3>
                  <p className="text-sm text-muted-foreground">Volume near peak, "TSLA to $500?" threads</p>
                  <p className="text-xs text-muted-foreground">{">"} 80% positive, {"<"} 10% negative</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Industry Timeline */}
          <Card className="trading-panel-enhanced">
            <CardHeader>
              <CardTitle>Industry Volume & Sentiment Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-2 border-trading-red pl-4">
                  <h3 className="font-semibold text-sm">2025-09-08</h3>
                  <p className="text-sm text-muted-foreground">4 major items, net negative</p>
                  <p className="text-xs text-muted-foreground">U.S. EV sales spike + tax credit concerns</p>
                </div>
                <div className="border-l-2 border-trading-red pl-4">
                  <h3 className="font-semibold text-sm">2025-09-09</h3>
                  <p className="text-sm text-muted-foreground">3 mentions, net negative</p>
                  <p className="text-xs text-muted-foreground">CATL lithium mine restart catalyst</p>
                </div>
                <div className="border-l-2 border-amber-500 pl-4">
                  <h3 className="font-semibold text-sm">2025-09-10</h3>
                  <p className="text-sm text-muted-foreground">Autonomy/robotaxi coverage spike</p>
                  <p className="text-xs text-muted-foreground">Positive/neutral—Zoox public trials</p>
                </div>
                <div className="border-l-2 border-trading-red pl-4">
                  <h3 className="font-semibold text-sm">Sept 11–13</h3>
                  <p className="text-sm text-muted-foreground">Neutral to negative</p>
                  <p className="text-xs text-muted-foreground">Lithium pricing, BEV trends, supply chain risks</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Narratives & Evidence Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Company Narratives */}
          <Card className="trading-panel-enhanced">
            <CardHeader>
              <CardTitle>Company Narratives & Evidence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-trading-green">Product/Technology Advances (Confirmed)</h3>
                <p className="text-sm text-muted-foreground">
                  "AI5 and AI6" chips labeled as "game-changing" by Musk; excitement about new autonomous driving/robotics prospects
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-trading-green">Trader/Investor Success (Confirmed)</h3>
                <p className="text-sm text-muted-foreground">
                  Options trading anecdotes report outsized recent returns on call/put spreads
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-trading-green">Technical Breakout/Price Action (Confirmed)</h3>
                <p className="text-sm text-muted-foreground">
                  Significant price movement discussed as momentum shift; bullish reposts of chart patterns
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Other/Emergent</h3>
                <p className="text-sm text-muted-foreground">
                  Very few negative or risk-based narratives visible in major threads
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Industry Narratives */}
          <Card className="trading-panel-enhanced">
            <CardHeader>
              <CardTitle>Industry Narratives & Evidence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-trading-red">Demand Dynamics & Incentives</h3>
                <p className="text-sm text-muted-foreground">
                  EV surge ahead of $7,500 U.S. credit expiry; concern for Q4 demand cliff (WaPo, negative, high confidence)
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-trading-red">Tesla Competitive Pressure</h3>
                <p className="text-sm text-muted-foreground">
                  U.S. EV share drops to ~38% (Reuters, negative, confirmed)
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-amber-600">Lithium/Raw Materials</h3>
                <p className="text-sm text-muted-foreground">
                  CATL mine restarting, significant impact on supply/price volatility (Reuters; med-high confidence)
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-trading-green">Autonomy/Robotaxi</h3>
                <p className="text-sm text-muted-foreground">
                  Amazon Zoox launched public service (positive), intensifies debate with Tesla/Waymo (Reuters; neutral/confidence high)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Social Media Analyst Insights */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader>
            <CardTitle>Social Media Analyst Insights - Company Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Theme</TableHead>
                    <TableHead className="font-semibold">Source/Platform</TableHead>
                    <TableHead className="font-semibold">Date/Window</TableHead>
                    <TableHead className="font-semibold">Metric</TableHead>
                    <TableHead className="font-semibold">Value</TableHead>
                    <TableHead className="font-semibold">Confidence</TableHead>
                    <TableHead className="font-semibold">Takeaway</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Price/sentiment breakout</TableCell>
                    <TableCell>Reddit, Twitter</TableCell>
                    <TableCell>Sep 10–13, 2025</TableCell>
                    <TableCell>Daily mentions</TableCell>
                    <TableCell>1,900–2,500 (peak)</TableCell>
                    <TableCell><Badge variant="default" className="bg-trading-green text-white">High</Badge></TableCell>
                    <TableCell>Record bullishness, driven by product/momentum news</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">AI/Chip narrative</TableCell>
                    <TableCell>Teslarati, Reddit</TableCell>
                    <TableCell>Sep 10–13, 2025</TableCell>
                    <TableCell>Positivity%</TableCell>
                    <TableCell>~80% positive</TableCell>
                    <TableCell><Badge variant="default" className="bg-trading-green text-white">High</Badge></TableCell>
                    <TableCell>New "AI5/6 chip" breakthrough a key catalyst</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Options trader stories</TableCell>
                    <TableCell>Reddit, Medium</TableCell>
                    <TableCell>Sep 8–12, 2025</TableCell>
                    <TableCell>Anecdotal returns</TableCell>
                    <TableCell>$674→$5,000; {">"} 100% in 48 hrs</TableCell>
                    <TableCell><Badge variant="secondary">Med-High</Badge></TableCell>
                    <TableCell>Options wins stoking FOMO, reinforcing bullish narrative</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Risk/dark narratives</TableCell>
                    <TableCell>Twitter, Reddit</TableCell>
                    <TableCell>Sep 6–13, 2025</TableCell>
                    <TableCell>Negative%</TableCell>
                    <TableCell>{"<"} 10%</TableCell>
                    <TableCell><Badge variant="default" className="bg-trading-green text-white">High</Badge></TableCell>
                    <TableCell>Little visible fear or skepticism</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Industry Social Analyst Insights */}
        <Card className="trading-panel-enhanced mb-8">
          <CardHeader>
            <CardTitle>Industry Social Analyst Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Theme</TableHead>
                    <TableHead className="font-semibold">Platform</TableHead>
                    <TableHead className="font-semibold">Source</TableHead>
                    <TableHead className="font-semibold">Date/Window</TableHead>
                    <TableHead className="font-semibold">Metric</TableHead>
                    <TableHead className="font-semibold">Value</TableHead>
                    <TableHead className="font-semibold">Confidence</TableHead>
                    <TableHead className="font-semibold">Takeaway</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Demand/incentive cliff</TableCell>
                    <TableCell>News/social amplify</TableCell>
                    <TableCell>Washington Post</TableCell>
                    <TableCell>2025-09-08</TableCell>
                    <TableCell>Sales spike</TableCell>
                    <TableCell>Peak before credit expiration</TableCell>
                    <TableCell><Badge variant="default" className="bg-trading-green text-white">High</Badge></TableCell>
                    <TableCell>Risk: Q4 demand rollover likely after U.S. tax credits end</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Market share erosion</TableCell>
                    <TableCell>News/social</TableCell>
                    <TableCell>Reuters</TableCell>
                    <TableCell>2025-09-08</TableCell>
                    <TableCell>U.S. EV share</TableCell>
                    <TableCell>Tesla drops to ~38%</TableCell>
                    <TableCell><Badge variant="default" className="bg-trading-green text-white">High</Badge></TableCell>
                    <TableCell>Competition driving Tesla share loss; price war impact amplified</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Lithium/input shock</TableCell>
                    <TableCell>News/social</TableCell>
                    <TableCell>Reuters/Barron's</TableCell>
                    <TableCell>2025-09-09</TableCell>
                    <TableCell>Mine restart</TableCell>
                    <TableCell>CATL ≈8% global lithium resumes</TableCell>
                    <TableCell><Badge variant="secondary">Med-High</Badge></TableCell>
                    <TableCell>Commodity volatility threatens sector input pricing, hits battery supply chain</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Robotaxi/AV competition</TableCell>
                    <TableCell>News/social</TableCell>
                    <TableCell>Reuters</TableCell>
                    <TableCell>2025-09-10</TableCell>
                    <TableCell>Launch event</TableCell>
                    <TableCell>Zoox opens free Las Vegas service</TableCell>
                    <TableCell><Badge variant="default" className="bg-trading-green text-white">High</Badge></TableCell>
                    <TableCell>Robotaxi battle escalates; Amazon/Waymo threat to first-mover narrative for Tesla</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Actionable Watchlists Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Company Watchlist */}
          <Card className="trading-panel-enhanced">
            <CardHeader className="flex flex-row items-center gap-2">
              <Target className="h-5 w-5 text-trading-blue" />
              <CardTitle className="text-lg">Company Actionable Watchlist</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>1. Watch for confirmation/details on new "game-changing" AI chip (AI5/6) deployment timetables.</li>
                <li>2. Monitor recurring large options trades for possible sentiment reversals or abnormal volume spikes.</li>
                <li>3. Track official company statements (especially Elon Musk's channels) for product launches, guidance, or regulatory news.</li>
                <li>4. Stay alert for any pushback or skepticism as bullishness saturates (contrarian risk rising).</li>
                <li>5. Eyes on the next quarterly earnings date for signpost on tech contribution to revenue.</li>
                <li>6. Follow global macro/EV competitive news to anticipate narrative pivots.</li>
              </ol>
            </CardContent>
          </Card>

          {/* Industry Watchlist */}
          <Card className="trading-panel-enhanced">
            <CardHeader className="flex flex-row items-center gap-2">
              <Target className="h-5 w-5 text-trading-blue" />
              <CardTitle className="text-lg">Industry Actionable Watchlist</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>1. Watch September–October U.S. EV sales for reversal post-tax credit expiry.</li>
                <li>2. Lithium contract/futures moves after CATL mine restarts.</li>
                <li>3. Autonomy/robotaxi regulatory/pilot expansions (Zoox, Waymo, Tesla schedules).</li>
                <li>4. U.S. EV incentive policy updates—Congressional/executive actions imminent.</li>
                <li>5. BEV adoption data for Europe: OEM pipeline response and possible allocation shifts.</li>
                <li>6. Cross-sector supplier reactions (battery/auto parts) to potential volatility in input prices.</li>
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Key Insights & Synthesis */}
        <Card className="trading-panel-enhanced">
          <CardHeader className="flex flex-row items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-lg">Non-obvious Synthesis Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3 text-trading-green">Company Level Insights</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>1. The surge of options-trading success stories is likely reinforcing bullish sentiment feedback loops—this can create short-term euphoria, but also raises risk if expectations race ahead of fundamentals.</p>
                <p>2. The narrative dominance by AI/chip advancements has temporarily crowded out usual risk/skeptical themes—if any negative or supply-chain news breaks, sentiment could reverse sharply due to lack of "hedged" discourse.</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-trading-red">Industry Level Insights</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>1. The U.S. EV demand spike is heavily front-loaded ahead of policy deadlines, suggesting a likely "air pocket" in demand in Q4—OEMs' production pausing is a rare real-time indicator of incentive-driven volatility, now amplified in social-and-news markets.</p>
                <p>2. Robotaxi competition is shifting from a technology race to a public/regulatory adoption battle; Amazon Zoox's publicity for public trials, not technical specs, is capturing more positive sentiment—Tesla's autonomous narrative faces new, non-technical challenges.</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-trading-blue">Comparative Summary</h3>
              <p className="text-sm text-muted-foreground">
                <strong>Company sentiment</strong> is strongly positive driven by AI chip breakthrough narratives and technical momentum. 
                <strong>Industry sentiment</strong> is net negative due to policy uncertainty and competitive pressures. 
                This divergence suggests TSLA may be benefiting from company-specific catalysts while facing sector headwinds, 
                creating both opportunity and risk for sentiment reversals.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}