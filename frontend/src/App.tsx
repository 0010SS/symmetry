import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CompanyFundamentals from "./pages/CompanyFundamentals";
import CompanyTrends from "./pages/CompanyTrends";
import IndustryFundamentals from "./pages/IndustryFundamentals";
import IndustryTrends from "./pages/IndustryTrends";
import MarketSentiment from "./pages/MarketSentiment";
import CrossSignals from "./pages/CrossSignals";
import FinalDecision from "./pages/FinalDecision";
import News from "./pages/News";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/company-fundamentals" element={<CompanyFundamentals />} />
          <Route path="/company-trends" element={<CompanyTrends />} />
          <Route path="/industry-fundamentals" element={<IndustryFundamentals />} />
          <Route path="/industry-trends" element={<IndustryTrends />} />
          <Route path="/market-sentiment" element={<MarketSentiment />} />
          <Route path="/cross-signals" element={<CrossSignals />} />
          <Route path="/final-decision" element={<FinalDecision />} />
          <Route path="/news" element={<News />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
