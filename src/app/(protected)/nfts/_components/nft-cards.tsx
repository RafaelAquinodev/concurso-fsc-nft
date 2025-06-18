"use client";

import { useWalletNFTs } from "@/hooks/use-wallet-nfts";
import React from "react";
import NftCard from "./nft-card";

const NftCards = () => {
  const [walletAddress, setWalletAddress] = React.useState(
    // "0xb7f7f6c52f2e2fdb1963eab30438024864c313f6", // Maior carteira de CryptoPunks
    "0xe2a83b15fc300d8457eb9e176f98d92a8ff40a49", // Maior carteira de Bored Apes
    // "0xc4505db8cc490767fa6f4b6f0f2bdd668b357a5d" // Neymar Jr. Wallet
  );

  const { nfts, loading, error, hasNextPage, refetch, loadMore } =
    useWalletNFTs({
      address: walletAddress,
      normalizeMetadata: true,
    });

  return (
    <div className="mx-auto min-h-full w-full place-content-center">
      {/* Loading */}
      {loading && nfts.length === 0 && (
        <div className="mx-auto flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-purple-600"></div>
            <p className="text-gray-600">Carregando NFTs...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-6">
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
      )}

      {/* Grid de NFTs */}
      {nfts.length > 0 && (
        <>
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {nfts.map((nft) => (
              <NftCard key={`${nft.token_address}-${nft.token_id}`} nft={nft} />
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
