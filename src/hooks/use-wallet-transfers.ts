import { useInfiniteQuery } from "@tanstack/react-query";
import {
  TransferResponse,
  UseWalletTransfersProps,
  UseWalletTransfersReturn,
} from "@/types/transfers-types";
import { resolveIpfsUrl } from "@/utils/resolve-ipfs-url";

export const useWalletTransfers = ({
  address,
  chain = "eth",
  limit = 40,
  cursor,
  enabled = true,
}: UseWalletTransfersProps & {
  enabled?: boolean;
}): UseWalletTransfersReturn => {
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
    queryKey: ["walletTransfers", address, chain, limit],
    enabled: !!address && address.trim() !== "" && enabled,
    queryFn: async ({ pageParam }: { pageParam: string }) => {
      const params = new URLSearchParams({
        address: address!.trim(),
        chain,
        limit: String(limit),
      });

      if (pageParam) {
        params.append("cursor", pageParam);
      }

      const res = await fetch(`/api/wallet/transfers?${params.toString()}`);
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return {
        result: data.result,
        cursor: data.cursor,
      } as TransferResponse;
    },
    getNextPageParam: (lastPage) => lastPage.cursor || undefined,
    initialPageParam: cursor || "",
  });

  const allTransfers = data?.pages.flatMap((page) => page.result) || [];

  const resolvedTransfers = allTransfers.map((transfer) => ({
    ...transfer,
    metadata: {
      ...transfer.metadata,
      image: resolveIpfsUrl(transfer?.metadata?.image || ""),
    },
  }));

  const nextCursor = data?.pages[data.pages.length - 1]?.cursor || null;

  return {
    transfers: resolvedTransfers,
    isLoading,
    isError,
    error: error?.message || null,
    hasNextPage: !!hasNextPage,
    cursor: nextCursor,
    refetch: () => refetch(),
    loadMore: () => fetchNextPage(),
    fetchNextPage,
    isFetchingNextPage,
  };
};
