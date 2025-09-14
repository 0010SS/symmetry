import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  TrendingUp,
  Building2,
  Globe,
  Scale,
  Shield,
  AlertTriangle,
} from "lucide-react";
// If you're on Vite/CRA/Next, importing JSON like this works out of the box
import data from "@/data/company-news.json";

type Theme =
  | "Macroeconomic"
  | "Sector"
  | "Company"
  | "Shareholder/Legal"
  | "Regulatory";

type AnalystInsight = {
  theme: Theme;
  event: string;
  date: string;
  magnitude: string;
  source: string;
  takeaway: string;
};

const themeIcons: Record<Theme, React.ComponentType<{ className?: string }>> = {
  Macroeconomic: Globe,
  Sector: Building2,
  Company: TrendingUp,
  "Shareholder/Legal": Scale,
  Regulatory: Shield,
};

const themeColors: Record<Theme, string> = {
  Macroeconomic: "bg-blue-50 border-blue-200 text-blue-800",
  Sector: "bg-purple-50 border-purple-200 text-purple-800",
  Company: "bg-green-50 border-green-200 text-green-800",
  "Shareholder/Legal": "bg-red-50 border-red-200 text-red-800",
  Regulatory: "bg-orange-50 border-orange-200 text-orange-800",
};

export default function News() {
  const navigate = useNavigate();

  // If you want stronger typing, you can cast array items:
  const analystInsights = data.analystInsights as AnalystInsight[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <h1 className="text-4xl font-bold mb-2">{data.meta.title || "News Overview"}</h1>
          <p className="text-muted-foreground">
            {data.meta.asOf || ""} Comprehensive market intelligence and
            company-specific developments
          </p>
        </div>

        {/* Executive Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-foreground leading-relaxed">
                {data.executiveSummary}
              </p>
              <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <p className="font-semibold text-blue-800">
                  FINAL TRANSACTION PROPOSAL: {data.finalProposal}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Analysis Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Macroeconomic Context
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {data.macroeconomicContext.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-foreground leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Sector/Industry Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {data.sectorTrends.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-foreground leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Company-Specific Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {data.companyEvents.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-foreground leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Shareholder/Ownership Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {data.shareholderEvents.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-foreground leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Regulatory & Legal */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Regulatory & Legal Developments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {data.regulatoryLegal.map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-foreground leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Analyst Insights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              News Analyst Insights
            </CardTitle>
            <CardDescription>
              Detailed analysis of key events and their market implications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analystInsights.map((insight, idx) => {
                const Icon = themeIcons[insight.theme] ?? TrendingUp;
                const color =
                  themeColors[insight.theme] ??
                  "bg-gray-50 border-gray-200 text-gray-800";
                return (
                  <div key={idx} className={`p-4 rounded-lg border-2 ${color}`}>
                    <div className="flex items-start gap-4">
                      <Icon className="h-5 w-5 mt-1 flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap gap-2 items-center">
                          <Badge variant="outline" className="text-xs">
                            {insight.theme}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {insight.date}
                          </span>
                          <span className="text-xs font-medium">
                            {insight.source}
                          </span>
                        </div>
                        <h4 className="font-semibold text-sm">
                          {insight.event}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          <strong>Magnitude:</strong> {insight.magnitude}
                        </p>
                        <p className="text-sm leading-relaxed">
                          {insight.takeaway}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
