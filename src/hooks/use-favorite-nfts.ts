import { FavoriteNFT, NFT } from "@/types/nfts-types";
import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export const useFavoriteNFTs = () => {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  const [favorites, setFavorites] = useState<FavoriteNFT[]>([]);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFavoritesKey = useCallback(() => {
    if (!user?.id) return null;
    return `favorites_${user.id}`;
  }, [user?.id]);

  const loadFavorites = useCallback(() => {
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
  }, [getFavoritesKey]);

  const saveFavorites = useCallback(
    (favoritesToSave: FavoriteNFT[]) => {
      const favoritesKey = getFavoritesKey();
      if (!favoritesKey) return;

      try {
        localStorage.setItem(favoritesKey, JSON.stringify(favoritesToSave));
      } catch (error) {
        console.error("Erro ao salvar favoritos:", error);
      }
    },
    [getFavoritesKey],
  );

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

        if (pathname === "/nfts") {
          saveFavorites(updated);
        }
      }
    },
    [favorites, pathname, saveFavorites],
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
    if (isLoaded) {
      loadFavorites();
    }
  }, [isLoaded, loadFavorites]);

  useEffect(() => {
    if (pathname === "/favorites" && isLoaded) {
      fetchFavorites();
    }
  }, [pathname, favorites, fetchFavorites, isLoaded]);

  useEffect(() => {
    if (isLoaded && !user) {
      setFavorites([]);
      setNfts([]);
    }
  }, [isLoaded, user]);

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
