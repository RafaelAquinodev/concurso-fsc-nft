"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { WalletPerformance } from "@/hooks/use-wallet-performance";

interface WalletInvestimentChartProps {
  performance: WalletPerformance | null;
}

export function WalletInvestimentChart({
  performance,
}: WalletInvestimentChartProps) {
  const data = [
    {
      name: "Investimento",
      value: performance?.estimatedTotalInvestedUSD || 0,
    },
    {
      name: "Valor Atual",
      value: performance?.estimatedCurrentPortfolioValueUSD || 0,
    },
  ];

  return (
    <Card className="bg-brand-indigo w-full max-w-md border-none p-0 text-white shadow-none">
      <CardContent>
        <BarChart
          width={300}
          height={200}
          data={data}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          className="text-white"
        >
          <XAxis dataKey="name" type="category" />
          <YAxis type="number" />
          <Bar dataKey="value" fill="#22c55e" radius={[5, 5, 0, 0]}></Bar>
        </BarChart>
      </CardContent>
    </Card>
  );
}
