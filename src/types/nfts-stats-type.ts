type WalletStats = {
  nfts: string;
  collections: string;
  transactions: {
    total: string;
  };
  nft_transfers: {
    total: string;
  };
  token_transfers: {
    total: string;
  };
};

interface UseWalletStatsProps {
  address: string;
  chain?: string;
}

interface UseWalletStatsReturn {
  stats: WalletStats | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
}

export type { WalletStats, UseWalletStatsProps, UseWalletStatsReturn };
