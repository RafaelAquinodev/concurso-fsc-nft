"use client";

import React from "react";
import FavoriteNftCard from "./favorite-card";
import { useFavoriteNFTs } from "@/hooks/use-favorite-nfts";
import Link from "next/link";
import LoadingSpin from "../../_components/loading-spin";

const FavoriteNftCards = () => {
  const { nfts, loading, error, favorites, removeFavorite } = useFavoriteNFTs();

  return (
    <div className="h-full min-h-full w-full">
      {/* Loading */}
      {loading && nfts.length === 0 && (
        <div className="mx-auto flex min-h-full w-full items-center justify-center">
          <div className="mx-auto flex items-center justify-center p-12">
            <div className="flex flex-col justify-center gap-4">
              <LoadingSpin />
              <p className="text-gray-100">Carregando Favoritos...</p>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mx-auto flex min-h-full w-full items-center justify-center">
          <div className="bg-brand-indigo mb-8 rounded-xl border border-red-200 p-6">
            <div className="flex items-center">
              <div className="mr-3 text-red-200">⚠️</div>
              <div>
                <h3 className="font-semibold text-white">
                  Erro ao carregar Favoritos
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sem NFTs favoritos ainda */}
      {!loading && !error && favorites.length === 0 && (
        <div className="mx-auto flex min-h-full w-full items-center justify-center">
          <div className="bg-brand-indigo mb-8 rounded-xl border border-gray-200 p-6">
            <div className="text-center">
              <div className="mb-4 text-4xl">⭐</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-100">
                Nenhum NFT favorito encontrado
              </h3>
              <p className="mb-4 text-sm text-gray-400">
                Adicione NFTs aos seus favoritos para vê-los aqui.
              </p>
              <Link
                href="/nfts"
                className="gradient-brand mt-3 w-full cursor-pointer rounded-lg px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:shadow-[0_0_8px_rgba(255,0,204,0.6)]"
              >
                Explorar NFTs
              </Link>
            </div>
          </div>
        </div>
      )}

      {nfts.length > 0 && (
        <div className="space-y-6">
          {/* Header com contador */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Meus Favoritos ({nfts.length})
            </h2>
          </div>

          {/* Grid de NFTs */}
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
        </div>
      )}
    </div>
  );
};

export default FavoriteNftCards;
