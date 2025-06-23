"use client";

import React from "react";
import FavoriteNftCard from "./favorite-card";
import { useFavoriteNFTs } from "@/hooks/use-favorite-nfts";

const FavoriteNftCards = () => {
  const { nfts, loading, error, favorites, removeFavorite } = useFavoriteNFTs();

  return (
    <div className="min-h-full w-full">
      {/* Loading */}
      {loading && nfts.length === 0 && (
        <div className="mx-auto flex min-h-screen w-full items-center justify-center">
          <div className="mx-auto flex items-center justify-center p-12">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-purple-600"></div>
              <p className="text-gray-100">Carregando NFTs...</p>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mx-auto flex min-h-screen w-full items-center justify-center">
          <div className="mb-8 rounded-xl border border-red-200 bg-neutral-900 p-6">
            <div className="flex items-center">
              <div className="mr-3 text-red-500">⚠️</div>
              <div>
                <h3 className="font-semibold text-red-800">
                  Erro ao carregar NFTs
                </h3>
                <p className="mt-1 text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sem NFTs favoritos ainda */}
      {favorites.length === 0 && !loading && !error && (
        <div className="mx-auto flex min-h-screen w-full items-center justify-center">
          <div className="mb-8 rounded-xl border border-gray-200 bg-neutral-900 p-6">
            <div className="text-center">
              <h3 className="mb-2 text-lg font-semibold text-gray-100">
                Nenhum NFT favorito encontrado
              </h3>
              <p className="text-sm text-gray-400">
                Adicione NFTs aos seus favoritos para vê-los aqui.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grid de NFTs */}
      {nfts.length > 0 && (
        <div className="mb-8 grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
          {nfts.map((nft) => (
            <FavoriteNftCard
              key={`${nft.token_address}-${nft.token_id}`}
              nft={nft}
              removeFavorite={removeFavorite}
              favorites={favorites}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteNftCards;
