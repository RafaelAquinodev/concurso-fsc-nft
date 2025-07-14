import React from "react";
import { WalletRoiChart } from "./wallet-roi-chart";
import { WalletInvestimentChart } from "./wallet-investiment-chart";
import { useWalletPerformance } from "@/hooks/use-wallet-performance";
import { Separator } from "@/components/ui/separator";

interface WalletPerformanceCardProps {
  address: string;
}

const WalletPerformanceCard = ({ address }: WalletPerformanceCardProps) => {
  const { performance, loading, error } = useWalletPerformance({
    address: address,
    enabled: !!address,
  });

  return (
    <div className="gradient-border bg-brand-indigo col-span-1 rounded-xl p-6 xl:col-span-2">
      <h2 className="mb-4 text-lg font-semibold">Balanço</h2>

      {/* Gráfico de Investimento */}
      <div className="flex items-center justify-center">
        {loading && (
          <div className="bg-brand-accent-muted flex h-48 w-[350px] animate-pulse items-center justify-center rounded-lg p-4"></div>
        )}
        {error && (
          <div className="bg-brand-accent-muted flex h-48 w-[350px] items-center justify-center rounded-lg p-4">
            <p>Erro ao carregar gráfico.</p>
          </div>
        )}
        {!loading && !error && performance && (
          <WalletInvestimentChart performance={performance} />
        )}
      </div>

      {!loading && !error && performance && <Separator className="my-1" />}

      {/* Gráfico de ROI */}
      <div className="flex w-full items-center justify-center">
        {loading && (
          <div className="bg-brand-accent-muted mt-4 flex h-[72px] w-[465px] animate-pulse items-center justify-center rounded-lg p-4"></div>
        )}
        {error && (
          <div className="bg-brand-accent-muted mt-4 flex h-[72px] w-[465px] items-center justify-center rounded-lg p-4">
            <p>Erro ao carregar gráfico.</p>
          </div>
        )}
        {!loading && !error && performance && (
          <WalletRoiChart
            roiPercentage={Number(performance?.totalROIPercentage)}
          />
        )}
      </div>
    </div>
  );
};

export default WalletPerformanceCard;
