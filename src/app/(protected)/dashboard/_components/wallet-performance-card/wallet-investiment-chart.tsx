"use client";

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { WalletPerformance } from "@/hooks/use-wallet-performance";

interface WalletInvestimentChartProps {
  performance: WalletPerformance | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const formattedValue = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

    return (
      <div className="rounded-lg border border-purple-400 bg-gray-700 p-3 shadow-lg">
        <p className="font-medium text-gray-300">{label}</p>
        <p className="font-bold text-gray-100">{formattedValue}</p>
      </div>
    );
  }
  return null;
};

export function WalletInvestimentChart({
  performance,
}: WalletInvestimentChartProps) {
  const investedValue = performance?.estimatedTotalInvestedUSD || 0;
  const currentValue = performance?.estimatedCurrentPortfolioValueUSD || 0;

  const isProfit = currentValue >= investedValue;
  const currentColor = isProfit ? "#4ade80" : "#f87171";

  const data = [
    {
      name: "Investimento",
      value: investedValue,
      fill: "#ffffff",
    },
    {
      name: "Valor Atual",
      value: currentValue,
      fill: currentColor,
    },
  ];

  return (
    <Card className="bg-brand-indigo w-full max-w-md border-none p-0 text-white shadow-none">
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <XAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "white", fontSize: 12 }}
            />
            <YAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "white", fontSize: 10 }}
              tickFormatter={(value) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(value)
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[5, 5, 0, 0]} stroke="none" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
