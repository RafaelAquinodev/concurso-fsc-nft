"use client";

import { useWallet } from "@/context/wallet-context";
import { useWalletTransfers } from "@/hooks/use-wallet-transfers";
import { truncateAddress } from "@/utils/truncate-address";
import React from "react";
import { useTrendingNFTs } from "@/hooks/use-trending-nfts";
import RecentTransferCard from "./recent-transfer-card";
import InfoCards from "./info-cards";
import TrendingNFTsCards from "./trending-nfts-cards";
import { WalletIcon } from "lucide-react";

const Dashboard = () => {
  const { walletAddress, allWallets } = useWallet();
  const { transfers } = useWalletTransfers({
    address: walletAddress,
  });
  const { trendingCollections, loading } = useTrendingNFTs();

  const walletName = allWallets.find(
    (wallet) => wallet.address === walletAddress,
  )?.name;

  return (
    <>
      {walletName && walletAddress ? (
        <div className="space-y-6">
          <div className="mb-6 flex items-center gap-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-white">
              <WalletIcon className="h-5 w-5 text-purple-400" />
              {walletName}
            </h2>
            <span className="mt-1 text-sm text-gray-400">
              {truncateAddress(walletAddress)}
            </span>
          </div>
          {/* Informações da Wallet */}
          <InfoCards />

          {/* Cards de NFTs Trending */}
          <TrendingNFTsCards
            collections={trendingCollections}
            loading={loading}
          />

          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
            {/* Balanço */}
            <div className="gradient-border bg-brand-indigo col-span-2 rounded-xl p-6 lg:col-span-2">
              <h2 className="mb-4 text-xl font-bold">Balanço</h2>
              <div className="mb-6 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Total ETH</div>
                  <div className="text-2xl font-bold">21,533.10</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Gains</div>
                  <div className="text-2xl font-bold text-green-400">
                    +7.048 ETH
                  </div>
                  <div className="chart-line mt-2"></div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Expenses</div>
                  <div className="text-2xl font-bold text-red-400">
                    -2.013 ETH
                  </div>
                  <div className="chart-line red mt-2"></div>
                </div>
              </div>
              <div className="flex h-40 items-center justify-center rounded-lg bg-[#2a2a3a]">
                <span className="text-gray-500">
                  Balance chart visualization
                </span>
              </div>
            </div>

            {/* Transações Recentes */}
            <div className="gradient-border bg-brand-indigo col-span-1 min-h-[372px] w-full rounded-lg p-6 text-white">
              <h2 className="mb-4 text-lg font-semibold">
                Transações Recentes
              </h2>
              {transfers.length > 0 ? (
                <div className="flex flex-col gap-2 overflow-y-auto">
                  {transfers.slice(0, 4).map((transfer, index) => (
                    <RecentTransferCard
                      key={`${transfer.transaction_hash}-${index}`}
                      transfer={transfer}
                      walletAddress={walletAddress}
                    />
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-center text-sm">
                  Nenhuma transferência encontrada.
                </p>
              )}
            </div>
          </div>

          {/* Se não houver carteira selecionada, exibe mensagem */}
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-white">
            Selecione uma carteira para ver o dashboard
          </p>
        </div>
      )}
    </>
  );
};

export default Dashboard;
