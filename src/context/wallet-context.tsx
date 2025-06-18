"use client";

import { walletCatalog } from "@/data/wallet-catalog";
import { createContext, useContext, useState } from "react";

type WalletContextType = {
  walletAddress: string;
  setWalletAddress: (address: string) => void;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [walletAddress, setWalletAddress] = useState(walletCatalog[0].address);

  return (
    <WalletContext.Provider value={{ walletAddress, setWalletAddress }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet deve ser usado dentro de um WalletProvider");
  }
  return context;
};
