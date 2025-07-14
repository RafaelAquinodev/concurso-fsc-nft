import { useInfiniteQuery } from "@tanstack/react-query";
import {
  NFT,
  NFTResponse,
  UseWalletNFTsProps,
  UseWalletNFTsReturn,
} from "@/types/nfts-types";
import { resolveIpfsUrl } from "@/utils/resolve-ipfs-url";

export const useWalletNFTs = ({
  address,
  chain = "eth",
  limit = 40,
  cursor,
  normalizeMetadata = true,
  includePrices = true,
  excludeSpam = true,
  enabled = true,
}: UseWalletNFTsProps & { enabled?: boolean }): UseWalletNFTsReturn => {
  const hasMetadata = (nft: NFT): boolean => {
    const metadata = nft.metadata || nft.normalized_metadata;

    return Boolean(metadata);
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: [
      "walletNFTs",
      address,
      chain,
      limit,
      normalizeMetadata,
      includePrices,
      excludeSpam,
    ],
    enabled: !!address && address.trim() !== "" && enabled,
    queryFn: async ({ pageParam = "" }) => {
      const params = new URLSearchParams({
        address: address.trim(),
        chain,
        limit: String(limit),
        normalizeMetadata: normalizeMetadata.toString(),
        includePrices: includePrices.toString(),
        excludeSpam: excludeSpam.toString(),
      });

      if (pageParam) {
        params.set("cursor", pageParam);
      }

      const url = `/api/wallet/nfts?${params.toString()}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data as NFTResponse;
    },
    getNextPageParam: (lastPage) => lastPage.cursor || undefined,
    initialPageParam: cursor || "",
  });

  const allNFTs = data?.pages.flatMap((page) => page.result) || [];
  const filteredResults = allNFTs.filter(hasMetadata);

  const resolvedNFTs = (filteredResults as NFT[]).map((nft) => ({
    ...nft,
    normalized_metadata: {
      ...nft.normalized_metadata,
      image: resolveIpfsUrl(nft.normalized_metadata?.image),
    },
  }));

  const nextCursor = data?.pages?.[data.pages.length - 1]?.cursor || null;

  return {
    nfts: resolvedNFTs,
    loading: isLoading,
    error: isError ? (error?.message ?? "Erro ao buscar NFTs") : null,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    cursor: nextCursor,
    refetch: () => refetch(),
    loadMore: () => fetchNextPage(),
  };
};
