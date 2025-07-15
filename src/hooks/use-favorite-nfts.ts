import { FavoriteNFT } from "@/types/nfts-types";
import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useFavoriteNFTsQuery } from "@/hooks/use-favorite-nfts-query";

export const useFavoriteNFTs = () => {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  const [favorites, setFavorites] = useState<FavoriteNFT[]>([]);

  const isClient = typeof window !== "undefined";

  const getFavoritesKey = useCallback(() => {
    if (!user?.id) return null;
    return `favorites_${user.id}`;
  }, [user?.id]);

  const loadFavorites = useCallback(() => {
    if (!isClient) return;

    const favoritesKey = getFavoritesKey();
    if (!favoritesKey) {
      setFavorites([]);
      return;
    }

    try {
      const saved = JSON.parse(localStorage.getItem(favoritesKey) || "[]");
      setFavorites(saved);
    } catch {
      setFavorites([]);
    }
  }, [getFavoritesKey, isClient]);

  const saveFavorites = useCallback(
    (favoritesToSave: FavoriteNFT[]) => {
      if (!isClient) return;

      const favoritesKey = getFavoritesKey();
      if (!favoritesKey) return;

      try {
        localStorage.setItem(favoritesKey, JSON.stringify(favoritesToSave));
      } catch (error) {
        console.error("Erro ao salvar favoritos:", error);
      }
    },
    [getFavoritesKey, isClient],
  );

  const tokens = favorites.map(({ token_address, token_id }) => ({
    token_address,
    token_id,
  }));

  const {
    data: nfts,
    isLoading: loading,
    error,
  } = useFavoriteNFTsQuery({
    tokens,
    enabled: pathname === "/favorites" && isLoaded && isClient,
  });

  const addFavorite = useCallback(
    (nft: FavoriteNFT) => {
      const existing = favorites.find(
        (favorite) =>
          favorite.token_address === nft.token_address &&
          favorite.token_id === nft.token_id &&
          favorite.chain === nft.chain,
      );

      if (!existing) {
        const updated = [...favorites, nft];
        setFavorites(updated);
        saveFavorites(updated);
      }
    },
    [favorites, saveFavorites],
  );

  const removeFavorite = useCallback(
    (nft: FavoriteNFT) => {
      const updated = favorites.filter(
        (favorite) =>
          !(
            favorite.token_address === nft.token_address &&
            favorite.token_id === nft.token_id &&
            favorite.chain === nft.chain
          ),
      );

      setFavorites(updated);
      saveFavorites(updated);
    },
    [favorites, saveFavorites],
  );

  const isFavorite = useCallback(
    (nft: Pick<FavoriteNFT, "token_address" | "token_id" | "chain">) => {
      return favorites.some(
        (favorite) =>
          favorite.token_address === nft.token_address &&
          favorite.token_id === nft.token_id &&
          favorite.chain === nft.chain,
      );
    },
    [favorites],
  );

  useEffect(() => {
    if (isLoaded && isClient) {
      loadFavorites();
    }
  }, [isLoaded, isClient, loadFavorites]);

  const filteredNfts = (nfts || []).filter((nft) =>
    favorites.some(
      (fav) =>
        fav.token_address === nft.token_address &&
        fav.token_id === nft.token_id &&
        fav.chain === nft.chain,
    ),
  );

  return {
    nfts: filteredNfts,
    favorites,
    loading,
    error: error?.message || null,
    addFavorite,
    removeFavorite,
    isFavorite,
    reload: loadFavorites,
  };
};
