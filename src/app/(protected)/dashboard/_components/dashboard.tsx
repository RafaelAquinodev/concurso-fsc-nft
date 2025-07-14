"use client";

import { useWallet } from "@/context/wallet-context";
import { truncateAddress } from "@/utils/truncate-address";
import React from "react";
import InfoCards from "./info-cards/info-cards";
import TrendingNFTsCards from "./trending-cards/trending-nfts-cards";
import { WalletIcon } from "lucide-react";
import WalletPerformanceCard from "./wallet-performance-card/wallet-performance-card";
import RecentTransferCards from "./recent-transfer-card/recent-tranfer-cards";

const Dashboard = () => {
  const { walletAddress, allWallets } = useWallet();

  const walletName = allWallets.find(
    (wallet) => wallet.address === walletAddress,
  )?.name;

  return (
    <>
      {walletName && walletAddress ? (
        <div className="space-y-8">
          <div className="mb-4 flex items-center gap-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-white">
              <WalletIcon className="text-brand-purple h-5 w-5" />
              {walletName}
            </h2>
            <span className="mt-1 text-sm text-gray-400">
              {truncateAddress(walletAddress)}
            </span>
          </div>
          {/* Informações da Wallet */}
          <InfoCards />

          {/* Cards de NFTs Trending */}
          <TrendingNFTsCards />

          <div className="grid w-full grid-cols-1 gap-4 min-[1000px]:grid-cols-2 xl:grid-cols-3">
            {/* Performance da Carteira */}
            <WalletPerformanceCard address={walletAddress} />

            {/* Transações Recentes */}
            <RecentTransferCards address={walletAddress} />
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
