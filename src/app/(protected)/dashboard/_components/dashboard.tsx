"use client";

/* eslint-disable @next/next/no-img-element */
import { useWallet } from "@/context/wallet-context";
import { useWalletStats } from "@/hooks/use-wallet-stats";
import { useWalletTransfers } from "@/hooks/use-wallet-transfers";
import { truncateAddress } from "@/utils/truncate-address";
import React from "react";
import TransferCard from "../../transactions/_components/transfer-card";
import { useTrendingNFTs } from "@/hooks/use-trending-nfts";

const Dashboard = () => {
  const { walletAddress, allWallets } = useWallet();
  const { stats } = useWalletStats({
    address: walletAddress,
  });
  const { transfers } = useWalletTransfers({
    address: walletAddress,
  });
  const { trendingCollections } = useTrendingNFTs();

  const walletName = allWallets.find(
    (wallet) => wallet.address === walletAddress,
  )?.name;

  return (
    <>
      {walletName && walletAddress ? (
        <>
          <div className="grid w-full grid-cols-3 gap-4 p-4">
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
            <div className="gradient-border col-span-1 w-full rounded-lg bg-neutral-900 p-4 text-white">
              <h2 className="text-center text-lg font-semibold">
                Transações Recentes
              </h2>
              {transfers.length > 0 ? (
                transfers.map((transfer, index) => (
                  <TransferCard
                    key={`${transfer.transaction_hash}-${index}`}
                    transfer={transfer}
                    walletAddress={walletAddress}
                  />
                ))
              ) : (
                <p className="text-center text-sm">
                  Nenhuma transferência encontrada.
                </p>
              )}
            </div>
          </div>

          {/* Top NFTs */}
          <div>
            <h2 className="text-center text-lg font-semibold text-white">
              NFTs em Alta
            </h2>
            {trendingCollections &&
              trendingCollections.map((collection, index) => (
                <div
                  key={`${collection.collection_id}-${index}`}
                  className="p-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={collection.collection_image}
                      alt={collection.collection_title}
                      className="h-16 w-16 rounded-lg"
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {collection.collection_title}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
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
