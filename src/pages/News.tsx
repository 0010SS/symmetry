import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ExternalLink, TrendingUp, TrendingDown, AlertTriangle, Building2, Globe, DollarSign, Scale, Shield } from "lucide-react";

const News = () => {
  const navigate = useNavigate();

  // Data extracted from the company news markdown
  const macroeconomicContext = [
    "The U.S. Federal Reserve is widely expected to start cutting interest rates soon, with analysts predicting total cuts of 125 basis points over the next few meetings.",
    "Asian markets, including Japan's Nikkei and indices in South Korea and China, have surged to record highs driven by Fed easing hopes.",
    "Political risks in some countries have had limited market impact, but Indonesia's fiscal concerns caused currency volatility.",
    "U.S. jobs data was revised down by nearly one million jobs year-to-date, making Fed rate cut expectations more cautious.",
    "Inflation remains above 3%, raising the possibility that the Fed may adjust its official inflation target upward."
  ];

  const sectorTrends = [
    "Tesla's U.S. market share dropped to its lowest since 2017, now at around 38%, as rivals gain traction.",
    "The federal tax credit for EV buyers in the U.S. will expire soon (September 2025).",
    "Tesla faces increasing competition in China both in cars and robotics, with rivals like BYD warning of a 'bloodbath'.",
    "Autonomous vehicle tech and robotaxi services are becoming key growth areas with Nevada approvals."
  ];

  const companyEvents = [
    "Tesla stock surged about 7% to reach a seven-month high near $395, driven by energy business and robotaxi approvals.",
    "CEO Elon Musk's board-approved pay package is unprecedented, worth up to $1 trillion contingent on performance targets.",
    "Tesla's robotaxi app was released to the public in select markets, intensifying competition with Waymo.",
    "Recent product launches include the Megapack 3 energy storage system receiving positive market attention.",
    "Tesla's board chair indicated Elon Musk has refocused on Tesla leadership after political engagements.",
    "A prominent Tesla engineer publicly criticized CEO leadership, suggesting internal discord.",
    "Despite delivery growth, Tesla faces margin pressures and price competition globally."
  ];

  const shareholderEvents = [
    "Tesla CFO Vaibhav Taneja and SVP Xiaotong Zhu sold shares in the last week for tax purposes.",
    "Elon Musk beneficially owns 714.7 million shares including performance awards.",
    "Multiple large institutional investors trimmed Tesla holdings during Q1 2025.",
    "Several law firms announced class action lawsuits citing securities law violations."
  ];

  const regulatoryLegal = [
    "Tesla is facing rising regulatory scrutiny with safety concerns raised over vehicle features.",
    "Numerous shareholder class action lawsuits have been filed, increasing legal risk.",
    "Tesla is navigating complex regulatory approvals for autonomous vehicle operations expansion."
  ];

  const analystInsights = [
    {
      theme: "Macroeconomic",
      event: "Anticipated U.S. Fed rate cuts",
      date: "Sep 2025",
      magnitude: "125 bps cuts expected",
      source: "Reuters",
      takeaway: "Supports risk appetite and equity rallies, boosting growth stocks including Tesla"
    },
    {
      theme: "Sector",
      event: "Tesla U.S. EV market share drops to 38%",
      date: "Aug 2025",
      magnitude: "Lowest since 2017",
      source: "Cox Automotive, Reuters",
      takeaway: "Intense competition eroding Tesla's dominance; margin and growth pressures"
    },
    {
      theme: "Company",
      event: "Tesla stock hits 7-month high near $395",
      date: "Sep 12, 2025",
      magnitude: "+7% price surge",
      source: "Yahoo Finance, CNBC",
      takeaway: "Driven by energy business, robotaxi approvals; technical breakout signaling further upside"
    },
    {
      theme: "Company",
      event: "Elon Musk $1 trillion pay package approved",
      date: "Sep 2025",
      magnitude: "Largest CEO package in history",
      source: "SEC Filings, Yahoo Finance",
      takeaway: "Controversial; performance-based incentives may align interests but raise governance concerns"
    },
    {
      theme: "Shareholder/Legal",
      event: "Class action lawsuits announced against Tesla",
      date: "Sep 2025",
      magnitude: "Pending legal risk",
      source: "Multiple law firm announcements",
      takeaway: "Heightened legal exposure for Tesla investors"
    },
    {
      theme: "Regulatory",
      event: "Robotaxi expansion approvals in Nevada and California",
      date: "Sep 2025",
      magnitude: "Regulatory milestones",
      source: "Company announcements",
      takeaway: "Key enabler for Tesla's autonomous vehicle business growth"
    }
  ];

  const themeIcons = {
    "Macroeconomic": Globe,
    "Sector": Building2,
    "Company": TrendingUp,
    "Shareholder/Legal": Scale,
    "Regulatory": Shield
  };

  const themeColors = {
    "Macroeconomic": "bg-blue-50 border-blue-200 text-blue-800",
    "Sector": "bg-purple-50 border-purple-200 text-purple-800", 
    "Company": "bg-green-50 border-green-200 text-green-800",
    "Shareholder/Legal": "bg-red-50 border-red-200 text-red-800",
    "Regulatory": "bg-orange-50 border-orange-200 text-orange-800"
  };

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
          
          <h1 className="text-4xl font-bold mb-2">Tesla (TSLA) Market and Company News Analysis</h1>
          <p className="text-muted-foreground">September 2025 - Comprehensive market intelligence and company-specific developments</p>
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
                Tesla remains in a strong growth and innovation phase with surging stock momentum driven by robotics, autonomous vehicle expansion, and energy business developments. However, growing competition in EV markets globally is eroding its U.S. market share to multi-year lows and pressuring margins. The macroeconomic environment favors growth stocks with expected U.S. Fed easing lifting general investor sentiment. CEO Elon Musk's unprecedented $1 trillion pay plan highlights ambitious growth targets but raises shareholder governance concerns. Ongoing and pending class action lawsuits add legal risk. Regulatory approvals for robotaxis represent critical enablers of Tesla's long-term vision beyond traditional automotive.
              </p>
              <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <p className="font-semibold text-blue-800">
                  FINAL TRANSACTION PROPOSAL: HOLD with close monitoring of legal developments and competitive market share trends before considering new BUY positions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Analysis Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Macroeconomic Context */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Macroeconomic Context
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {macroeconomicContext.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Sector/Industry Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Sector/Industry Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {sectorTrends.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Company-Specific Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Company-Specific Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {companyEvents.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Shareholder/Ownership Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Shareholder/Ownership Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {shareholderEvents.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Regulatory & Legal Developments */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Regulatory & Legal Developments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {regulatoryLegal.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-foreground leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* News Analyst Insights Table */}
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
            <div className="overflow-x-auto">
              <div className="space-y-4">
                {analystInsights.map((insight, index) => {
                  const IconComponent = themeIcons[insight.theme] || TrendingUp;
                  return (
                    <div key={index} className={`p-4 rounded-lg border-2 ${themeColors[insight.theme]}`}>
                      <div className="flex items-start gap-4">
                        <IconComponent className="h-5 w-5 mt-1 flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap gap-2 items-center">
                            <Badge variant="outline" className="text-xs">
                              {insight.theme}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{insight.date}</span>
                            <span className="text-xs font-medium">{insight.source}</span>
                          </div>
                          <h4 className="font-semibold text-sm">{insight.event}</h4>
                          <p className="text-xs text-muted-foreground">
                            <strong>Magnitude:</strong> {insight.magnitude}
                          </p>
                          <p className="text-sm leading-relaxed">{insight.takeaway}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default News;