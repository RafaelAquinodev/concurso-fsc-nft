import { useState, useEffect } from "react";

export interface NFTMetadata {
  name?: string;
  description?: string;
  image?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface NFT {
  token_address: string;
  token_id: string;
  owner_of: string;
  block_number: string;
  block_number_minted: string;
  token_hash: string;
  amount: string;
  contract_type: string;
  name: string;
  symbol: string;
  token_uri?: string;
  floor_price: string;
  floor_price_currency: string;
  floor_price_usd: string;
  list_price?: {
    price: string;
    price_currency: string;
    price_usd: string;
  };
  metadata?: NFTMetadata;
  last_token_uri_sync?: string;
  last_metadata_sync?: string;
  minter_address?: string;
  normalized_metadata?: {
    image?: string;
  };
  resolvedImageUrl?: string;
}

export interface NFTResponse {
  total: number;
  page: number;
  page_size: number;
  cursor?: string;
  result: NFT[];
}

type SortKey = "name" | "floor_price";
type SortOrder = "asc" | "desc";

interface UseWalletNFTsProps {
  address: string;
  chain?: string;
  limit?: number;
  cursor?: string;
  normalizeMetadata?: boolean;
  mediaItems?: boolean;
  includePrices?: boolean;
  excludeSpam?: boolean;
  sortBy?: SortKey;
  sortOrder?: SortOrder;
}

interface UseWalletNFTsReturn {
  nfts: NFT[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasNextPage: boolean;
  cursor: string | null;
  refetch: () => void;
  loadMore: () => void;
}

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

      console.log("Resultados filtrados e ordenados:", sortedResults);

      if (loadMore) {
        setNfts((prev) =>
          sortNFTs([...prev, ...sortedResults], sortBy, sortOrder),
        );
      } else {
        setNfts(sortedResults);
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
