"use client";

import { walletCatalog } from "@/data/wallet-catalog";
import { createContext, useContext, useState, useEffect } from "react";

type WalletContextType = {
  walletAddress: string;
  setWalletAddress: (address: string) => void;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const WALLET_STORAGE_KEY = "selected_wallet_address";

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [walletAddress, setWalletAddressState] = useState(
    walletCatalog[0].address,
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedAddress = localStorage.getItem(WALLET_STORAGE_KEY);

      if (
        savedAddress &&
        walletCatalog.some((wallet) => wallet.address === savedAddress)
      ) {
        setWalletAddressState(savedAddress);
      }
    } catch (error) {
      console.error("Erro ao carregar endereço da carteira:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const setWalletAddress = (address: string) => {
    setWalletAddressState(address);

    try {
      localStorage.setItem(WALLET_STORAGE_KEY, address);
    } catch (error) {
      console.error("Erro ao salvar endereço da carteira:", error);
    }
  };

  if (!isLoaded) {
    return null;
  }

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
