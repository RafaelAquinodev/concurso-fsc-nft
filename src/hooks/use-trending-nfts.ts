import { useState, useEffect, useCallback } from "react";

export interface TrendingCollection {
  collection_address: string;
  collection_title: string;
  collection_image: string;
  collection_banner_image: string; // banner da coleção
  floor_price_usd: number;
  floor_price_native: number;
  floor_price_24hr_percent_change: number;
  market_cap_native: number;
  volume_usd: number;
  volume_native: number;
  volume_24hr_percent_change: number;
  average_price_usd: number;
  average_price_native: number;
}

export interface TrendingNFTsResponse {
  data: TrendingCollection[];
}

export interface UseTrendingNFTsProps {
  chain?: string;
  limit?: number;
}

export interface UseTrendingNFTsReturn {
  trendingCollections: TrendingCollection[];
  loading: boolean;
  error: string | null;
}

export const useTrendingNFTs =
  ({}: UseTrendingNFTsProps = {}): UseTrendingNFTsReturn => {
    const [trendingCollections, setTrendingCollections] = useState<
      TrendingCollection[]
    >([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTrendingNFTs = useCallback(async () => {
      const apiKey = process.env.NEXT_PUBLIC_MORALIS_API_KEY;
      if (!apiKey) {
        setError("MORALIS_API_KEY não configurada");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const url = new URL(
          "https://deep-index.moralis.io/api/v2.2/market-data/nfts/hottest-collections",
        );

        const response = await fetch(url.toString(), {
          headers: {
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);

        setTrendingCollections(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erro ao buscar NFTs em trending";
        setError(errorMessage);
        console.error("Erro ao buscar NFTs em trending:", err);
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      fetchTrendingNFTs();
    }, [fetchTrendingNFTs]);

    return {
      trendingCollections,
      loading,
      error,
    };
  };
