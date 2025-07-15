import { useQuery } from "@tanstack/react-query";
import { CollectionNFT } from "@/types/collections-types";
import { resolveIpfsUrl } from "@/utils/resolve-ipfs-url";

export interface UseCollectionNFTsProps {
  collectionAddress?: string;
  chain?: string;
  limit?: number;
  enabled?: boolean;
}

export const useCollectionNFTs = ({
  collectionAddress,
  chain = "eth",
  limit = 4,
  enabled = true,
}: UseCollectionNFTsProps) => {
  return useQuery<CollectionNFT[]>({
    queryKey: ["collectionNFTs", collectionAddress, chain, limit],
    enabled: !!collectionAddress && enabled,
    queryFn: async () => {
      const params = new URLSearchParams({
        collectionAddress: collectionAddress!,
        chain,
        limit: String(limit),
      });

      const res = await fetch(`/api/nfts/collection?${params.toString()}`);
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const resolvedData = (data.result as CollectionNFT[]).map((nft) => ({
        ...nft,
        normalized_metadata: {
          ...nft.normalized_metadata,
          image: resolveIpfsUrl(nft.normalized_metadata?.image),
        },
      }));

      return resolvedData;
    },
  });
};
