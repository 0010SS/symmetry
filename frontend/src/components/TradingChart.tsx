// src/TradingChart.tsx
import { useEffect, useRef } from "react";
import { createChart, ColorType, ISeriesApi, CandlestickData } from "lightweight-charts";
import { IndicatorHeader } from "./IndicatorHeader";

interface TradingChartProps {
  symbol: string; // e.g., "TSLA", "AAPL"
}

export const TradingChart = ({ symbol }: TradingChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  // build chart once
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground") || "#999",
      },
      grid: { vertLines: { color: "rgba(128,128,128,0.2)" }, horzLines: { color: "rgba(128,128,128,0.2)" } },
      rightPriceScale: { borderVisible: false },
      timeScale: { rightOffset: 6, borderVisible: false, barSpacing: 7 },
      crosshair: { mode: 1 },
      autoSize: true,
    });
    chartRef.current = chart;

    const candles = chart.addCandlestickSeries({
      upColor: "rgba(16,185,129,1)",
      downColor: "rgba(244,63,94,1)",
      borderUpColor: "rgba(16,185,129,1)",
      borderDownColor: "rgba(244,63,94,1)",
      wickUpColor: "rgba(16,185,129,1)",
      wickDownColor: "rgba(244,63,94,1)",
    });
    seriesRef.current = candles;

    const ro = new ResizeObserver(() => chart.applyOptions({}));
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      chart.remove();
      seriesRef.current = null;
      chartRef.current = null;
    };
  }, []);

  // load data whenever symbol changes
  useEffect(() => {
    const path = `/data/${symbol.toUpperCase()}_ohlc.json`;
    fetch(path, { cache: "no-store" })
      .then((r) => r.json())
      .then((rows: { time: string; open: number; high: number; low: number; close: number }[]) => {
        const data: CandlestickData[] = rows.map((r) => ({
          time: r.time as any, open: r.open, high: r.high, low: r.low, close: r.close,
        }));
        seriesRef.current?.setData(data);
        chartRef.current?.timeScale().fitContent();
      })
      .catch((e) => console.error("Failed to load candles:", e));
  }, [symbol]);

  return (
    <div className="chart-container h-full flex flex-col relative">
      <IndicatorHeader />
      <div className="flex items-center justify-between p-6 pb-2">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{symbol}</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>OHLC</span>
          </div>
        </div>
      </div>
      <div className="flex-1 px-6 pb-16">
        <div ref={containerRef} className="w-full h-full" />
      </div>
    </div>
  );
};
