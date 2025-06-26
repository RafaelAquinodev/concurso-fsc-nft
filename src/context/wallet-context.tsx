"use client";

import { walletCatalog } from "@/data/wallet-catalog";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
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
  const { user, isLoaded } = useUser();

  const [walletAddress, setWalletAddressState] = useState(
    walletCatalog[0].address,
  );
  const [customWallets, setCustomWallets] = useState<Wallet[]>([]);

  const allWallets = useMemo(
    () => [...walletCatalog, ...customWallets],
    [customWallets],
  );

  const getWalletKey = useCallback(() => {
    if (!user?.id) return null;
    return `selected_wallet_address_${user.id}`;
  }, [user?.id]);

  const getCustomWalletsKey = useCallback(() => {
    if (!user?.id) return null;
    return `custom_wallets_${user.id}`;
  }, [user?.id]);

  const loadWalletData = useCallback(() => {
    const walletKey = getWalletKey();
    const customWalletsKey = getCustomWalletsKey();

    if (!walletKey || !customWalletsKey) {
      setCustomWallets([]);
      setWalletAddressState(walletCatalog[0].address);
      return;
    }

    try {
      const savedCustomWallets = localStorage.getItem(customWalletsKey);
      const parsedCustomWallets = savedCustomWallets
        ? JSON.parse(savedCustomWallets)
        : [];
      setCustomWallets(parsedCustomWallets);

      const savedAddress = localStorage.getItem(walletKey);
      if (savedAddress) {
        const addressExists =
          walletCatalog.some((wallet) => wallet.address === savedAddress) ||
          parsedCustomWallets.some(
            (wallet: Wallet) => wallet.address === savedAddress,
          );

        if (addressExists) {
          setWalletAddressState(savedAddress);
        } else {
          setWalletAddressState(walletCatalog[0].address);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados das carteiras:", error);
      setCustomWallets([]);
      setWalletAddressState(walletCatalog[0].address);
    }
  }, [getWalletKey, getCustomWalletsKey]);

  const saveCustomWallets = useCallback(
    (walletsToSave: Wallet[]) => {
      const customWalletsKey = getCustomWalletsKey();
      if (!customWalletsKey) return;

      try {
        localStorage.setItem(customWalletsKey, JSON.stringify(walletsToSave));
      } catch (error) {
        console.error("Erro ao salvar carteiras customizadas:", error);
      }
    },
    [getCustomWalletsKey],
  );

  useEffect(() => {
    if (isLoaded) {
      loadWalletData();
    }
  }, [isLoaded, loadWalletData]);

  useEffect(() => {
    if (isLoaded && !user) {
      setCustomWallets([]);
      setWalletAddressState(walletCatalog[0].address);
    }
  }, [isLoaded, user]);

  const setWalletAddress = useCallback(
    (address: string) => {
      setWalletAddressState(address);

      const walletKey = getWalletKey();
      if (!walletKey) return;

      try {
        localStorage.setItem(walletKey, address);
      } catch (error) {
        console.error("Erro ao salvar endereço da carteira:", error);
      }
    },
    [getWalletKey],
  );

  const addCustomWallet = useCallback(
    (wallet: Omit<Wallet, "address"> & { address: string }): boolean => {
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
      saveCustomWallets(updatedCustomWallets);

      return true;
    },
    [allWallets, customWallets, saveCustomWallets],
  );

  const removeCustomWallet = useCallback(
    (address: string) => {
      const updatedCustomWallets = customWallets.filter(
        (wallet) => wallet.address !== address,
      );
      setCustomWallets(updatedCustomWallets);
      saveCustomWallets(updatedCustomWallets);

      if (walletAddress === address) {
        setWalletAddress(walletCatalog[0].address);
      }
    },
    [customWallets, walletAddress, setWalletAddress, saveCustomWallets],
  );

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
