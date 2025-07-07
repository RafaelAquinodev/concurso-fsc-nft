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
    <>
      <div className="flex items-center justify-start">
        <div className="bg-brand-indigo flex items-center gap-6 rounded-md px-4 py-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-green-400" />
            <p className="text-sm text-white">Vendas</p>
          </div>

          <div className="flex items-center gap-2">
            <TrendingDown className="text-red-400" />
            <p className="text-sm text-white">Compras</p>
          </div>
        </div>
      </div>

      <div className="h-[calc(100%-40px)] w-full space-y-4 pt-4">
        {loading && (
          <div className="mx-auto flex min-h-full w-full items-center justify-center">
            <div className="mx-auto flex items-center justify-center p-12">
              <div className="text-center">
                <div className="border-brand-purple mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
                <p className="text-gray-100">Carregando Transações...</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mx-auto flex h-full w-full items-center justify-center">
            <div className="bg-brand-accent-muted mb-8 rounded-xl border border-red-200 p-6">
              <div className="flex items-center">
                <div className="mr-3 text-red-500">⚠️</div>
                <div>
                  <h3 className="font-semibold text-white">
                    Erro ao carregar Transações
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

        {!loading && !error && transfers.length === 0 && (
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
          <div className="flex justify-center">
            <button
              onClick={loadMore}
              disabled={loading}
              className="gradient-brand cursor-pointer rounded-xl px-8 py-3 text-white shadow-lg transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Carregando..." : "Carregar mais"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
