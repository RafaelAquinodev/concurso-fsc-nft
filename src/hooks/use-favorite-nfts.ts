import { FavoriteNFT, NFT } from "@/types/nfts-types";
import { useEffect, useState, useCallback } from "react";

export const useFavoriteNFTs = () => {
  const [favorites, setFavorites] = useState<FavoriteNFT[]>([]);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carrega os favoritos do localStorage
  const loadFavorites = useCallback(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
      setFavorites(saved);
    } catch {
      setFavorites([]);
    }
  }, []);

  // Adiciona um NFT aos favoritos
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
      localStorage.setItem("favorites", JSON.stringify(updated));
    }
  };

  // Remove um NFT dos favoritos
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

  // Fetch dos NFTs
  const fetchFavorites = useCallback(async () => {
    if (favorites.length === 0) {
      setNfts([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = new URL(
        "https://deep-index.moralis.io/api/v2.2/nft/multiple",
      );
      url.searchParams.set("normalizeMetadata", "true");
      url.searchParams.set("media_items", "true");
      url.searchParams.set("chain", "eth");

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
      setNfts(data.result || []);
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
    fetchFavorites();
  }, [favorites, fetchFavorites]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

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
