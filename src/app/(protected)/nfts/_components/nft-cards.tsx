"use client";

import { useWalletNFTs } from "@/hooks/use-wallet-nfts";
import React from "react";
import NftCard from "./nft-card";
import { useWallet } from "@/context/wallet-context";
import { useFavoriteNFTs } from "@/hooks/use-favorite-nfts";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import LoadingSpin from "../../_components/loading-spin";

const NftCards = () => {
  const { walletAddress } = useWallet();

  const {
    nfts,
    loading,
    error,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    loadMore,
  } = useWalletNFTs({
    address: walletAddress,
  });

  const { addFavorite, removeFavorite, favorites } = useFavoriteNFTs();

  const infiniteScrollRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage: loadMore,
    rootMargin: "200px", // Distância para o final da page
  });

  return (
    <div className="h-full min-h-full w-full">
      {/* Loading */}
      {loading && (
        <div className="mx-auto flex min-h-full w-full items-center justify-center">
          <div className="mx-auto flex items-center justify-center p-12">
            <div className="flex flex-col justify-center gap-4">
              <LoadingSpin />
              <p className="text-gray-100">Carregando NFTs...</p>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mx-auto flex h-full w-full items-center justify-center">
          <div className="bg-brand-accent-muted mb-8 rounded-xl border border-red-200 p-6">
            <div className="flex items-center">
              <div className="mr-3 text-red-500">⚠️</div>
              <div className="space-y-3">
                <p className="font-semibold text-white">
                  Erro ao carregar as NFTs
                </p>
                <button
                  onClick={refetch}
                  className="w-full rounded-lg bg-red-400 px-4 py-2 text-white transition-colors hover:bg-red-500"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && nfts.length === 0 && (
        <div className="mx-auto flex h-full w-full items-center justify-center">
          <p className="text-gray-100">
            Nenhum NFT encontrado. Os NFTs marcados como possíveis Spam não são
            carregados.
          </p>
        </div>
      )}

      {/* Grid de NFTs */}
      {nfts.length > 0 && (
        <div className="mb-8 grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6 max-[550px]:justify-center">
          {nfts.map((nft) => (
            <NftCard
              key={`${nft.token_address}-${nft.token_id}`}
              nft={nft}
              addFavorite={addFavorite}
              removeFavorite={removeFavorite}
              favorites={favorites}
            />
          ))}
        </div>
      )}

      {/* Aqui fica o obeserver do infinite scroll */}
      {hasNextPage && (
        <div ref={infiniteScrollRef} className="flex justify-center py-8">
          {isFetchingNextPage ? (
            <div className="flex items-center justify-center gap-2">
              <div>
                <LoadingSpin size="sm" />
              </div>
              <span className="text-gray-100">Carregando mais...</span>
            </div>
          ) : (
            <div className="h-4 w-4" />
          )}
        </div>
      )}

      {/* Indica fim dos NFTs */}
      {!hasNextPage && nfts.length > 0 && (
        <div className="flex justify-center py-6">
          <p className="text-sm text-gray-400">
            ✨ Todos os NFTs foram carregados
          </p>
        </div>
      )}
    </div>
  );
};

export default NftCards;
