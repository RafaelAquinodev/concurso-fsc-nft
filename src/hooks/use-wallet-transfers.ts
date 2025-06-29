import {
  Transfer,
  TransferResponse,
  UseWalletTransfersProps,
  UseWalletTransfersReturn,
} from "@/types/transfers-types";
import { useState, useEffect, useCallback } from "react";

export const useWalletTransfers = ({
  address,
  chain = "eth",
  limit = 40,
  cursor,
}: UseWalletTransfersProps): UseWalletTransfersReturn => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const resolveIPFS = (url: string) => {
    if (url?.startsWith("ipfs://")) {
      return url.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
    return url;
  };

  const fetchTransfers = useCallback(
    async (loadMore = false, customCursor?: string) => {
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
          `https://deep-index.moralis.io/api/v2.2/wallets/${address.trim()}/nfts/trades`,
        );
        url.searchParams.set("chain", chain);
        url.searchParams.set("format", "decimal");
        url.searchParams.set("order", "desc");
        url.searchParams.set("limit", limit.toString());
        url.searchParams.set("include_prices", "true");
        url.searchParams.set("cursor", customCursor || cursor || "");

        const response = await fetch(url.toString(), {
          headers: {
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data: TransferResponse = await response.json();

        const resolvedTransfers = data.result.map((item) => ({
          ...item,
          metadata: {
            ...item.metadata,
            image: resolveIPFS(item?.metadata?.image || ""),
          },
        }));

        console.log("Transferências encontradas:", resolvedTransfers);

        if (loadMore) {
          setTransfers((prev) => [...prev, ...resolvedTransfers]);
        } else {
          setTransfers(resolvedTransfers);
        }

        setTotalCount(data.total);
        setNextCursor(data.cursor || null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao buscar transferências";
        setError(errorMessage);
        console.error("Erro ao buscar transferências:", err);
      } finally {
        setLoading(false);
      }
    },
    [address, chain, cursor, limit],
  );

  const refetch = () => {
    setTransfers([]);
    setNextCursor(null);
    fetchTransfers(false);
  };

  const loadMore = () => {
    if (nextCursor && !loading) {
      fetchTransfers(true, nextCursor);
    }
  };

  useEffect(() => {
    if (address) {
      setTransfers([]);
      setNextCursor(null);
      fetchTransfers();
    }
  }, [address, fetchTransfers]);

  return {
    transfers,
    loading,
    error,
    totalCount,
    hasNextPage: !!nextCursor,
    cursor: nextCursor,
    refetch,
    loadMore,
  };
};
