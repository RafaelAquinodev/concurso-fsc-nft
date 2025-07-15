import { NFT } from "@/types/nfts-types";
import { resolveIpfsUrl } from "@/utils/resolve-ipfs-url";
import { useQuery } from "@tanstack/react-query";

interface TokenIdentifier {
  token_address: string;
  token_id: string;
}

export interface UseFavoriteNFTsQueryProps {
  tokens: TokenIdentifier[];
  enabled?: boolean;
}

export const useFavoriteNFTsQuery = ({
  tokens,
  enabled = true,
}: UseFavoriteNFTsQueryProps) => {
  return useQuery<NFT[]>({
    queryKey: ["favorites", tokens],
    enabled: enabled && tokens.length > 0,
    placeholderData: (previousData) => previousData, // Evita refazer o fetch ao remover favorito
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const validTokens = tokens.filter(
        (token) => token.token_address && token.token_id,
      );

      if (validTokens.length === 0) {
        return [];
      }

      const res = await fetch("/api/nfts/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tokens: validTokens }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error || "Erro ao buscar NFTs favoritos.");
      }

      const data = await res.json();

      const enhancedResults = (data.result || []).map((nft: NFT) => ({
        ...nft,
        normalized_metadata: {
          ...nft.normalized_metadata,
          image: resolveIpfsUrl(nft.normalized_metadata?.image),
        },
      }));

      return enhancedResults;
    },
  });
};
