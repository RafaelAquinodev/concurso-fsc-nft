import {
  CollectionNFT,
  CollectionNFTsResponse,
  UseCollectionNFTsReturn,
} from "@/types/collections-types";
import { useState, useCallback } from "react";

export interface UseCollectionNFTsProps {
  collectionAddress?: string;
  chain?: string;
  limit?: number;
}

export const useCollectionNFTs = ({
  chain = "eth",
  limit = 4,
}: UseCollectionNFTsProps = {}): UseCollectionNFTsReturn => {
  const [nfts, setNfts] = useState<CollectionNFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTs = useCallback(
    async (collectionAddress: string) => {
      const apiKey = process.env.NEXT_PUBLIC_MORALIS_API_KEY;
      if (!apiKey) {
        setError("MORALIS_API_KEY não configurada");
        return;
      }

      if (!collectionAddress) {
        setError("Endereço da coleção é obrigatório");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const url = new URL(
          `https://deep-index.moralis.io/api/v2.2/nft/${collectionAddress}`,
        );
        url.searchParams.append("chain", chain);
        url.searchParams.append("format", "decimal");
        url.searchParams.append("limit", limit.toString());
        url.searchParams.append("withMetadata", "true");

        const response = await fetch(url.toString(), {
          headers: {
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data: CollectionNFTsResponse = await response.json();

        const nftsWithParsedMetadata = data.result.map((nft) => {
          let parsedMetadata;
          try {
            if (nft.metadata) {
              parsedMetadata = JSON.parse(nft.metadata);
            }
          } catch (error) {
            console.warn("Erro ao fazer parse do metadata:", error);
          }

          return {
            ...nft,
            parsedMetadata,
          };
        });

        setNfts(nftsWithParsedMetadata || []);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao buscar NFTs da coleção";
        setError(errorMessage);
        console.error("Erro ao buscar NFTs da coleção:", err);
      } finally {
        setLoading(false);
      }
    },
    [chain, limit],
  );

  return {
    nfts,
    loading,
    error,
    fetchNFTs,
  };
};
