import {
  NFT,
  NFTResponse,
  SortKey,
  SortOrder,
  UseWalletNFTsProps,
  UseWalletNFTsReturn,
} from "@/types/nfts-types";
import { useState, useEffect } from "react";

export const useWalletNFTs = ({
  address,
  chain = "eth",
  limit = 40,
  cursor,
  normalizeMetadata = true,
  mediaItems = false,
  includePrices = true,
  excludeSpam = true,
  sortBy = "floor_price",
  sortOrder = "asc",
}: UseWalletNFTsProps): UseWalletNFTsReturn => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const sortNFTs = (nfts: NFT[], key: SortKey, order: SortOrder) => {
    return [...nfts].sort((a, b) => {
      const valA = a[key] ?? "";
      const valB = b[key] ?? "";

      if (!isNaN(Number(valA)) && !isNaN(Number(valB))) {
        return order === "asc"
          ? Number(valA) - Number(valB)
          : Number(valB) - Number(valA);
      }

      return order === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  };

  const hasPrice = (nft: NFT): boolean => {
    const floorPrice = nft.floor_price || nft.list_price?.price;

    return Boolean(floorPrice && floorPrice.trim());
  };

  const resolveImageUrl = (nft: NFT): string | null => {
    const rawImage = nft.normalized_metadata?.image;
    if (!rawImage) return null;

    if (rawImage.startsWith("ipfs://")) {
      return rawImage.replace("ipfs://", "https://ipfs.io/ipfs/");
    }

    return rawImage;
  };

  const fetchNFTs = async (loadMore = false, customCursor?: string) => {
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
        `https://deep-index.moralis.io/api/v2.2/${address.trim()}/nft`,
      );
      url.searchParams.set("chain", chain);
      url.searchParams.set("format", "decimal");
      url.searchParams.set("limit", limit.toString());
      url.searchParams.set("normalizeMetadata", normalizeMetadata.toString());
      url.searchParams.set("media_items", mediaItems.toString());
      url.searchParams.set("include_prices", includePrices.toString());
      url.searchParams.set("exclude_spam", excludeSpam.toString());

      if (customCursor || cursor) {
        url.searchParams.set("cursor", customCursor || cursor || "");
      }

      const response = await fetch(url.toString(), {
        headers: {
          "X-API-Key": apiKey,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data: NFTResponse = await response.json();

      console.log("Dados recebidos:", data);

      const filteredResults = data.result.filter(hasPrice);
      const sortedResults = sortNFTs(filteredResults, sortBy, sortOrder);

      const enhancedResults = sortedResults.map((nft) => ({
        ...nft,
        resolvedImageUrl: resolveImageUrl(nft),
      }));

      console.log("Resultados filtrados e ordenados:", sortedResults);

      if (loadMore) {
        setNfts((prev) =>
          sortNFTs([...prev, ...enhancedResults], sortBy, sortOrder),
        );
      } else {
        setNfts(enhancedResults);
      }

      setTotalCount(data.total);
      setNextCursor(data.cursor || null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao buscar NFTs";
      setError(errorMessage);
      console.error("Erro ao buscar NFTs:", err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    setNfts([]);
    setNextCursor(null);
    fetchNFTs(false);
  };

  const loadMore = () => {
    if (nextCursor && !loading) {
      fetchNFTs(true, nextCursor);
    }
  };

  useEffect(() => {
    if (address) {
      fetchNFTs();
    }
  }, [address, chain, limit, normalizeMetadata, mediaItems, includePrices]);

  return {
    nfts,
    loading,
    error,
    totalCount,
    hasNextPage: !!nextCursor,
    cursor: nextCursor,
    refetch,
    loadMore,
  };
};
