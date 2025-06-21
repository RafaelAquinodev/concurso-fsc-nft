"use client";

import { walletCatalog } from "@/data/wallet-catalog";
import { createContext, useContext, useState, useEffect } from "react";

type Wallet = {
  address: string;
  name: string;
  description: string;
};

type WalletContextType = {
  walletAddress: string;
  setWalletAddress: (address: string) => void;
  allWallets: Wallet[];
  customWallets: Wallet[];
  addCustomWallet: (
    wallet: Omit<Wallet, "address"> & { address: string },
  ) => boolean;
  removeCustomWallet: (address: string) => void;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const WALLET_STORAGE_KEY = "selected_wallet_address";
const CUSTOM_WALLETS_KEY = "custom_wallets";

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [walletAddress, setWalletAddressState] = useState(
    walletCatalog[0].address,
  );
  const [customWallets, setCustomWallets] = useState<Wallet[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const allWallets = [...walletCatalog, ...customWallets];

  useEffect(() => {
    try {
      const savedCustomWallets = localStorage.getItem(CUSTOM_WALLETS_KEY);
      if (savedCustomWallets) {
        const parsedWallets = JSON.parse(savedCustomWallets);
        setCustomWallets(parsedWallets);
      }

      const savedAddress = localStorage.getItem(WALLET_STORAGE_KEY);
      if (savedAddress) {
        const addressExists =
          walletCatalog.some((wallet) => wallet.address === savedAddress) ||
          (savedCustomWallets &&
            JSON.parse(savedCustomWallets).some(
              (wallet: Wallet) => wallet.address === savedAddress,
            ));

        if (addressExists) {
          setWalletAddressState(savedAddress);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados das carteiras:", error);
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

  const addCustomWallet = (
    wallet: Omit<Wallet, "address"> & { address: string },
  ): boolean => {
    if (allWallets.some((w) => w.address === wallet.address)) {
      return false;
    }

    const newWallet: Wallet = {
      address: wallet.address,
      name: wallet.name,
      description: wallet.description,
    };

    const updatedCustomWallets = [...customWallets, newWallet];
    setCustomWallets(updatedCustomWallets);

    try {
      localStorage.setItem(
        CUSTOM_WALLETS_KEY,
        JSON.stringify(updatedCustomWallets),
      );
      return true;
    } catch (error) {
      console.error("Erro ao salvar carteira customizada:", error);
      return false;
    }
  };

  const removeCustomWallet = (address: string) => {
    const updatedCustomWallets = customWallets.filter(
      (wallet) => wallet.address !== address,
    );
    setCustomWallets(updatedCustomWallets);

    try {
      localStorage.setItem(
        CUSTOM_WALLETS_KEY,
        JSON.stringify(updatedCustomWallets),
      );

      if (walletAddress === address) {
        setWalletAddress(walletCatalog[0].address);
      }
    } catch (error) {
      console.error("Erro ao remover carteira customizada:", error);
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        setWalletAddress,
        allWallets,
        customWallets,
        addCustomWallet,
        removeCustomWallet,
      }}
    >
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
