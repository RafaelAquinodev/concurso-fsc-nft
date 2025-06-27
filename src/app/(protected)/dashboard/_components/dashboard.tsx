"use client";

/* eslint-disable @next/next/no-img-element */
import { useWallet } from "@/context/wallet-context";
import { useWalletStats } from "@/hooks/use-wallet-stats";
import { useWalletTransfers } from "@/hooks/use-wallet-transfers";
import { truncateAddress } from "@/utils/truncate-address";
import React from "react";
import { useTrendingNFTs } from "@/hooks/use-trending-nfts";
import TrendingNFTsCarousel from "./trending-nft-carousel";
import RecentTransferCard from "./recent-transfer-card";

const Dashboard = () => {
  const { walletAddress, allWallets } = useWallet();
  const { stats } = useWalletStats({
    address: walletAddress,
  });
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
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
            {/* Informações da Wallet */}
            <div className="gradient-border col-span-2 space-y-4 rounded-lg bg-neutral-900 p-4 text-white">
              <div className="mx-auto flex flex-col items-center justify-center">
                <h1>{walletName}</h1>
                <p>{truncateAddress(walletAddress)}</p>
              </div>

              <div className="mx-auto flex w-full items-center justify-center gap-4">
                <img src="./logo.svg" alt="Logo" />

                <div className="flex gap-6">
                  <div className="space-y-1">
                    <p className="text-xs">Valor da carteira</p>
                    <p className="font-mono">2.00 ETH</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs">Valor em USD</p>
                    <p className="font-mono">$3,000.00</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs">NFTs da Carteira</p>
                    <p className="font-mono">{stats?.nfts}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs">Coleções da Carteira</p>
                    <p className="font-mono">{stats?.collections}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transações Recentes */}
            <div className="gradient-border col-span-1 min-h-[292px] w-full rounded-lg bg-neutral-900 p-4 text-white">
              <h2 className="text-center text-lg font-semibold">
                Transações Recentes
              </h2>
              {transfers.length > 0 ? (
                <div className="mt-4 max-h-72 overflow-y-auto">
                  {transfers.slice(0, 3).map((transfer, index) => (
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

          {/* Carrossel de NFTs Trending */}
          <TrendingNFTsCarousel
            collections={trendingCollections}
            loading={loading}
          />
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
