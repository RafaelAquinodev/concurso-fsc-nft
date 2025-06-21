"use client";

import { useWallet } from "@/context/wallet-context";
import { useWalletTransfers } from "@/hooks/use-wallet-transfers"; 
import Image from "next/image";

export default function WalletTransfersClient() {
  const { walletAddress } = useWallet();

  const {
    transfers,
    loading,
    error,
    hasNextPage,
    loadMore,
  } = useWalletTransfers({
    address: walletAddress,
    limit: 40,
    includePrices: true,
  });

  return (
    <div className="space-y-4 p-4">
      {loading && <p>Carregando...</p>}
      {error && <p className="text-red-500">Erro: {error}</p>}
      {!loading && transfers.length === 0 && <p>Nenhuma transferência encontrada.</p>}

      {transfers.map((transfer, index) => (
        <div
          key={`${transfer.transaction_hash}-${index}`}
          className="border rounded-xl p-4 shadow-sm space-y-2"
        >
          <p className="text-sm text-gray-500">
            Hash: <span className="font-mono">{transfer.transaction_hash.slice(0, 10)}...</span>
          </p>

          <div className="flex items-center gap-4">
            {transfer.metadata?.image && (
              <Image
                src={transfer.metadata.image}
                alt={transfer.metadata.name || "NFT"}
                width={20}
                height={20}
                className="rounded-sm"
              />
            )}

            <div>
              <p className="font-semibold">{transfer.metadata?.name || "NFT sem nome"}</p>
              <p className="text-xs text-gray-600">
                Coleção: {transfer.collection_name || "Desconhecida"}
              </p>
              {transfer.price_formatted && (
                <div className="flex items-center gap-2">
                  <p className="text-sm text-green-600">
                    {transfer.price_formatted} {transfer.token_symbol}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {hasNextPage && (
        <button
          onClick={loadMore}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Carregar mais
        </button>
      )}
    </div>
  );
}