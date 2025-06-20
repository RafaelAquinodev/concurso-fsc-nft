import {
  NFT,
  NFTResponse,
  UseWalletNFTsProps,
  UseWalletNFTsReturn,
} from "@/types/nfts-types";
import { useState, useEffect, useCallback } from "react";

export const useWalletNFTs = ({
  address,
  chain = "eth",
  limit = 40,
  cursor,
  normalizeMetadata = true,
  mediaItems = false,
  includePrices = true,
  excludeSpam = true,
}: UseWalletNFTsProps): UseWalletNFTsReturn => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // const hasPrice = (nft: NFT): boolean => {
  //   const floorPrice = nft.floor_price || nft.list_price?.price;

  //   return Boolean(floorPrice && floorPrice.trim());
  // };

  const resolveImageUrl = (nft: NFT): string | null => {
    const rawImage = nft.normalized_metadata?.image;
    if (!rawImage) return null;

    if (rawImage.startsWith("ipfs://")) {
      return rawImage.replace("ipfs://", "https://ipfs.io/ipfs/");
    }

    return rawImage;
  };

  const fetchNFTs = useCallback(
    async (loadMore = false, customCursor?: string, retryAttempt = 0) => {
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

        // const filteredResults = data.result.filter(hasPrice);
        const enhancedResults = data.result.map((nft) => ({
          ...nft,
          resolvedImageUrl: resolveImageUrl(nft),
        }));

        if (
          !loadMore &&
          enhancedResults.length === 0 &&
          data.cursor &&
          retryAttempt === 0
        ) {
          console.log("Primeira página sem NFTs, tentando próxima página...");
          setLoading(false);
          return fetchNFTs(false, data.cursor, 1);
        }

        if (loadMore) {
          setNfts((prev) => [...prev, ...enhancedResults]);
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
    },
    [
      address,
      chain,
      cursor,
      limit,
      normalizeMetadata,
      mediaItems,
      includePrices,
      excludeSpam,
    ],
  );

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
      setNfts([]);
      setNextCursor(null);
      fetchNFTs();
    }
  }, [address, fetchNFTs]);

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
