"use client";

import { useWalletNFTs } from "@/hooks/use-wallet-nfts";
import React from "react";
import NftCard from "./nft-card";
import { useWallet } from "@/context/wallet-context";
import { useFavoriteNFTs } from "@/hooks/use-favorite-nfts";

const NftCards = () => {
  const { walletAddress } = useWallet();

  const { nfts, loading, error, hasNextPage, refetch, loadMore } =
    useWalletNFTs({
      address: walletAddress,
      normalizeMetadata: true,
    });

  const { addFavorite, removeFavorite, favorites } = useFavoriteNFTs();

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
                <button
                  onClick={refetch}
                  className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid de NFTs */}
      {nfts.length > 0 && (
        <>
          <div className="mb-8 grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
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

          {/* Botão carregar mais */}
          {hasNextPage && (
            <div className="text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-3 text-white shadow-lg transition-all duration-200 hover:from-purple-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Carregando..." : "Carregar mais NFTs"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NftCards;
