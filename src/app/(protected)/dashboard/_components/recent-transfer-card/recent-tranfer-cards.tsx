import { useWalletTransfers } from "@/hooks/use-wallet-transfers";
import React from "react";
import RecentTransferCard from "./recent-transfer-card";

interface RecentTransferCardsProps {
  address: string;
}

const RecentTransferCards = ({ address }: RecentTransferCardsProps) => {
  const { transfers, isLoading } = useWalletTransfers({
    address: address,
  });

  if (isLoading) {
    return (
      <div className="gradient-border bg-brand-indigo col-span-1 min-h-[372px] w-full rounded-lg p-6 text-white">
        <h2 className="mb-4 text-lg font-semibold">Transações Recentes</h2>
        <div className="flex flex-col gap-2 overflow-y-auto">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-brand-accent-muted h-16 w-full animate-pulse rounded-lg"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="gradient-border bg-brand-indigo col-span-1 min-h-[372px] w-full rounded-lg p-6 text-white">
      <h2 className="mb-4 text-lg font-semibold">Transações Recentes</h2>
      {transfers.length > 0 ? (
        <div className="flex flex-col gap-2 overflow-y-auto">
          {transfers.slice(0, 4).map((transfer, index) => (
            <RecentTransferCard
              key={`${transfer.transaction_hash}-${index}`}
              transfer={transfer}
              walletAddress={address}
            />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-center text-sm">
          Nenhuma transferência encontrada.
        </p>
      )}
    </div>
  );
};

export default RecentTransferCards;
