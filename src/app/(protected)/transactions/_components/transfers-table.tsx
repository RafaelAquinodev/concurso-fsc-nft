"use client";

import { useWallet } from "@/context/wallet-context";
import { useWalletTransfers } from "@/hooks/use-wallet-transfers";
import { TrendingDown, TrendingUp } from "lucide-react";
import TransferCard from "./transfer-card";

export default function TransferTable() {
  const { walletAddress } = useWallet();

  const { transfers, loading, error, hasNextPage, loadMore, refetch } =
    useWalletTransfers({
      address: walletAddress,
      limit: 40,
      includePrices: true,
    });

  return (
    <div className="relative space-y-4">
      {/*TODO: Adicionar essa parte do código no lugar no select de carteiras*/}
      <div className="top-0 z-50 flex items-center justify-start">
        <div className="flex items-center gap-6 rounded-md bg-neutral-900 px-4 py-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-chart-1" />
            <p className="text-sm text-white">Vendas</p>
          </div>

          <div className="flex items-center gap-2">
            <TrendingDown className="text-chart-2" />
            <p className="text-sm text-white">Compras</p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="mx-auto flex min-h-screen w-full items-center justify-center">
          <div className="mx-auto flex items-center justify-center p-12">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-purple-600"></div>
              <p className="text-gray-100">Carregando Transações...</p>
            </div>
          </div>
        </div>
      )}
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
      {!loading && transfers.length === 0 && (
        <p>Nenhuma transferência encontrada.</p>
      )}

      {transfers.map((transfer, index) => (
        <TransferCard
          key={`${transfer.transaction_hash}-${index}`}
          transfer={transfer}
          walletAddress={walletAddress}
        />
      ))}

      {hasNextPage && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-3 text-white shadow-lg transition-all duration-200 hover:from-purple-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Carregando..." : "Carregar mais"}
        </button>
      )}
    </div>
  );
}
