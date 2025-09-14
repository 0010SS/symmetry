import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import type { IndustryTrendsData } from "@/types/industry-trends";
import raw from "@/data/industry-trends.json"; // bundled at build-time
const data = raw as IndustryTrendsData;

const IndustryTrends = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate("/")} className="mb-4">
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold text-primary">{data.pageTitle}</h1>
        </div>

        {/* Executive Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Executive Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.executiveSummary.map((item, i) => (
                <p className="text-sm" key={i}>
                  <strong>{item.label}:</strong> {item.text}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Levels & Regime */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Levels & Regime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.levelsRegime.map((line, i) => (
                <p className="text-sm" key={i}>• {line}</p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Momentum & Volatility */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Momentum & Volatility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.momentumVolatility.map((line, i) => (
                <p className="text-sm" key={i}>• {line}</p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Seasonality */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Seasonality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.seasonality.map((line, i) => (
                <p className="text-sm" key={i}>• {line}</p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Indicator Panel */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Indicator Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Theme</TableHead>
                    <TableHead className="font-semibold">Metric/Signal</TableHead>
                    <TableHead className="font-semibold">Value</TableHead>
                    <TableHead className="font-semibold">Source/Tool</TableHead>
                    <TableHead className="font-semibold">Takeaway</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.indicatorPanel.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="p-2">{row.theme}</TableCell>
                      <TableCell className="p-2">{row.metric}</TableCell>
                      <TableCell className="p-2">{row.value}</TableCell>
                      <TableCell className="p-2">{row.source}</TableCell>
                      <TableCell className="p-2">{row.takeaway}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Company Linkage */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Company Linkage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.companyLinkage.map((line, i) => (
                <p className="text-sm" key={i}>• {line}</p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Insights */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Additional Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.additionalInsights.map((block, i) => (
                <div key={i}>
                  <h3 className="font-semibold mb-2">{block.title}</h3>
                  <div className="space-y-1 ml-4">
                    {block.insights.map((ins, j) => (
                      <p className="text-sm" key={j}>
                        • <strong>{ins.label}:</strong> {ins.text}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm leading-relaxed">{data.summary}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IndustryTrends;
