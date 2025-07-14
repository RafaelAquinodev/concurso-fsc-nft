import { useQuery } from "@tanstack/react-query";
import {
  UseWalletStatsProps,
  UseWalletStatsReturn,
  WalletStats,
} from "@/types/nfts-stats-type";

const fetchWalletStats = async (
  address: string,
  chain: string,
): Promise<WalletStats> => {
  if (!address || !address.trim()) {
    throw new Error("Endereço da wallet é obrigatório");
  }

  const params = new URLSearchParams({
    address: address.trim(),
    chain,
  });

  const url = `/api/wallet/stats?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `Erro ${response.status}: ${response.statusText}`,
    );
  }

  return response.json();
};

export const useWalletStats = ({
  address,
  chain = "eth",
  enabled = true,
}: UseWalletStatsProps & { enabled?: boolean }): UseWalletStatsReturn => {
  const {
    data: stats,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["walletStats", address, chain],
    queryFn: () => fetchWalletStats(address, chain),
    enabled: !!address && !!address.trim() && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
    retry: 3,
  });

  return {
    stats: stats || null,
    isLoading,
    isError,
    error: error ? (error as Error).message : null,
  };
};
