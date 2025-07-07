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
    <div className="h-full min-h-full w-full">
      {/* Loading */}
      {loading && (
        <div className="mx-auto flex min-h-full w-full items-center justify-center">
          <div className="mx-auto flex items-center justify-center p-12">
            <div className="text-center">
              <div className="border-brand-purple mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
              <p className="text-gray-100">Carregando Nfts...</p>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mx-auto flex min-h-full w-full items-center justify-center">
          <div className="bg-brand-accent-muted mb-8 rounded-xl border border-red-200 p-6">
            <div className="flex items-center">
              <div className="mr-3 text-red-500">⚠️</div>
              <div>
                <h3 className="font-semibold text-white">
                  Erro ao carregar NFTs
                </h3>
                <button
                  onClick={refetch}
                  className="mt-3 rounded-lg bg-red-400 px-4 py-2 text-white transition-colors hover:bg-red-500"
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

          {/* Botão carregar mais */}
          {hasNextPage && (
            <div className="flex justify-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="gradient-brand cursor-pointer rounded-xl px-8 py-3 text-white shadow-lg transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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
