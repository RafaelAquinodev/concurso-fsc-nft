"use client";

import { walletCatalog } from "@/data/wallet-catalog";
import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

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

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [walletAddress, setWalletAddressState] = useState(
    walletCatalog[0].address,
  );
  const [customWallets, setCustomWallets] = useState<Wallet[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const allWallets = [...walletCatalog, ...customWallets];

  useEffect(() => {
    if (!user?.id) return;

    const keys = {
      walletKey: `selected_wallet_address_${user.id}`,
      customWalletsKey: `custom_wallets_${user.id}`,
    };

    try {
      const savedCustomWallets = localStorage.getItem(keys.customWalletsKey);
      if (savedCustomWallets) {
        const parsedWallets = JSON.parse(savedCustomWallets);
        setCustomWallets(parsedWallets);
      }

      const savedAddress = localStorage.getItem(keys.walletKey);
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
  }, [user?.id]);

  const setWalletAddress = (address: string) => {
    setWalletAddressState(address);

    if (!user?.id) return;

    const walletKey = `selected_wallet_address_${user.id}`;

    try {
      localStorage.setItem(walletKey, address);
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

    if (!user?.id) return false;

    const customWalletsKey = `custom_wallets_${user.id}`;

    const newWallet: Wallet = {
      address: wallet.address,
      name: wallet.name,
      description: wallet.description,
    };

    const updatedCustomWallets = [...customWallets, newWallet];
    setCustomWallets(updatedCustomWallets);

    try {
      localStorage.setItem(
        customWalletsKey,
        JSON.stringify(updatedCustomWallets),
      );
      return true;
    } catch (error) {
      console.error("Erro ao salvar carteira customizada:", error);
      return false;
    }
  };

  const removeCustomWallet = (address: string) => {
    if (!user?.id) return;

    const customWalletsKey = `custom_wallets_${user.id}`;

    const updatedCustomWallets = customWallets.filter(
      (wallet) => wallet.address !== address,
    );
    setCustomWallets(updatedCustomWallets);

    try {
      localStorage.setItem(
        customWalletsKey,
        JSON.stringify(updatedCustomWallets),
      );

      if (walletAddress === address) {
        setWalletAddress(walletCatalog[0].address);
      }
    } catch (error) {
      console.error("Erro ao remover carteira customizada:", error);
    }
  };

  if (!user?.id || !isLoaded) {
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
