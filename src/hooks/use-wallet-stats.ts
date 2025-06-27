import {
  UseWalletStatsProps,
  UseWalletStatsReturn,
  WalletStats,
} from "@/types/nfts-stats-type";
import { useState, useEffect, useCallback } from "react";

export const useWalletStats = ({
  address,
  chain = "eth",
}: UseWalletStatsProps): UseWalletStatsReturn => {
  const [stats, setStats] = useState<WalletStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWalletStats = useCallback(async () => {
    if (!address || !address.trim()) {
      setError("Endereço da wallet é obrigatório");
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_MORALIS_API_KEY;
    if (!apiKey) {
      setError("MORALIS_API_KEY não configurada");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = new URL(
        `https://deep-index.moralis.io/api/v2.2/wallets/${address.trim()}/stats`,
      );
      url.searchParams.set("chain", chain);

      const response = await fetch(url.toString(), {
        headers: {
          "X-API-Key": apiKey,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data: WalletStats = await response.json();
      setStats(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro ao buscar estatísticas da wallet";
      setError(errorMessage);
      console.error("Erro ao buscar estatísticas da wallet:", err);
    } finally {
      setLoading(false);
    }
  }, [address, chain]);

  useEffect(() => {
    if (address) {
      fetchWalletStats();
    } else {
      setStats(null);
    }
  }, [address, fetchWalletStats]);

  return {
    stats,
    loading,
    error,
  };
};
