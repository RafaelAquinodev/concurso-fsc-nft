import { FavoriteNFT, NFT } from "@/types/nfts-types";
import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

export const useFavoriteNFTs = () => {
  const pathname = usePathname();

  const [favorites, setFavorites] = useState<FavoriteNFT[]>([]);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = useCallback(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
      setFavorites(saved);
    } catch {
      setFavorites([]);
    }
  }, []);

  const addFavorite = (nft: FavoriteNFT) => {
    const existing = favorites.find(
      (favorite) =>
        favorite.token_address === nft.token_address &&
        favorite.token_id === nft.token_id &&
        favorite.chain === nft.chain,
    );
    if (!existing) {
      const updated = [...favorites, nft];
      setFavorites(updated);

      if (pathname === "/nfts") {
        localStorage.setItem("favorites", JSON.stringify(updated));
      }
    }
  };

  const removeFavorite = (nft: FavoriteNFT) => {
    const updated = favorites.filter(
      (favorite) =>
        !(
          favorite.token_address === nft.token_address &&
          favorite.token_id === nft.token_id &&
          favorite.chain === nft.chain
        ),
    );
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const resolveImageUrl = (nft: NFT): string | null => {
    const rawImage = nft.normalized_metadata?.image;
    if (!rawImage) return null;

    if (rawImage.startsWith("ipfs://")) {
      return rawImage.replace("ipfs://", "https://ipfs.io/ipfs/");
    }

    return rawImage;
  };

  const fetchFavorites = useCallback(async () => {
    if (favorites.length === 0) {
      setNfts([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = new URL(
        "https://deep-index.moralis.io/api/v2.2/nft/getMultipleNFTs?",
      );
      url.searchParams.set("chain", "eth");
      url.searchParams.set("normalizeMetadata", "true");
      url.searchParams.set("media_items", "true");

      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "X-API-Key": process.env.NEXT_PUBLIC_MORALIS_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tokens: favorites.map(({ token_address, token_id }) => ({
            token_address,
            token_id,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Dados de NFTs favoritos:", data);

      const enhancedResults = data.map((nft: NFT) => ({
        ...nft,
        resolvedImageUrl: resolveImageUrl(nft),
      }));

      setNfts(enhancedResults || []);
    } catch (err) {
      console.error("Erro ao buscar NFTs favoritos:", err);
      setError("Não foi possível carregar os favoritos.");
    } finally {
      setLoading(false);
    }
  }, [favorites]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  useEffect(() => {
    if (pathname === "/favorites") {
      fetchFavorites();
    }
  }, [pathname, favorites, fetchFavorites]);

  return {
    nfts,
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    reload: loadFavorites,
  };
};
