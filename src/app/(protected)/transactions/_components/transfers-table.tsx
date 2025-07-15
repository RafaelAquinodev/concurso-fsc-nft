"use client";

import { useWallet } from "@/context/wallet-context";
import { useWalletTransfers } from "@/hooks/use-wallet-transfers";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { TrendingDown, TrendingUp } from "lucide-react";
import TransferCard from "./transfer-card";
import LoadingSpin from "../../_components/loading-spin";

export default function TransferTable() {
  const { walletAddress } = useWallet();

  const {
    transfers,
    isLoading,
    isError,
    hasNextPage,
    loadMore,
    refetch,
    isFetchingNextPage,
  } = useWalletTransfers({
    address: walletAddress,
    limit: 40,
    includePrices: true,
  });

  const infiniteScrollRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage: loadMore,
    rootMargin: "200px", // Distância para o final da page
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
        {/* Loading inicial */}
        {isLoading && transfers.length === 0 && (
          <div className="mx-auto flex min-h-full w-full items-center justify-center">
            <div className="mx-auto flex items-center justify-center p-12">
              <div className="flex flex-col justify-center gap-4">
                <LoadingSpin />
                <p className="text-gray-100">Carregando Transações...</p>
              </div>
            </div>
          </div>
        )}

        {/* Se tiver Erro */}
        {isError && (
          <div className="mx-auto flex h-full w-full items-center justify-center">
            <div className="bg-brand-accent-muted mb-8 rounded-xl border border-red-200 p-6">
              <div className="flex items-center">
                <div className="mr-3 text-red-500">⚠️</div>
                <div className="space-y-3">
                  <p className="font-semibold text-white">
                    Erro ao carregar as transações
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

        {/* Se não tiver transferências */}
        {!isLoading && !isError && transfers.length === 0 && (
          <div className="mx-auto flex h-full w-full items-center justify-center">
            <p className="text-gray-100">Nenhuma transferência encontrada.</p>
          </div>
        )}

        {/* Transferências */}
        {transfers.map((transfer, index) => (
          <TransferCard
            key={`${transfer.transaction_hash}-${index}`}
            transfer={transfer}
            walletAddress={walletAddress}
          />
        ))}

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

        {/* Indica fim das transferências */}
        {!hasNextPage && transfers.length > 0 && (
          <div className="flex justify-center py-6">
            <p className="text-sm text-gray-400">
              ✨ Todas as transferências foram carregadas
            </p>
          </div>
        )}
      </div>
    </>
  );
}
