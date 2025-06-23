"use client";

import { useWallet } from "@/context/wallet-context";
import { useWalletTransfers } from "@/hooks/use-wallet-transfers";
import { TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatUsd } from "@/utils/format-usd";

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
        <div
          key={`${transfer.transaction_hash}-${index}`}
          className="flex justify-between rounded-xl bg-neutral-900 p-4"
        >
          <div className="flex items-center gap-4">
            {transfer.metadata?.image ? (
              <Image
                src={transfer.metadata.image}
                alt={transfer.metadata.name || "NFT"}
                width={50}
                height={50}
                className="rounded-sm"
              />
            ) : (
              <div className="flex h-[50px] w-[50px] items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-gray-200">
                    <svg
                      className="h-8 w-8"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            <div>
              <p className="font-semibold">
                {transfer.metadata?.name || "NFT sem nome"}
              </p>
              <p className="text-xs text-gray-600">
                Coleção: {transfer.collection_name || "Desconhecida"}
              </p>
              {transfer.price_formatted &&
              walletAddress === transfer.buyer_address ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                      <p className="text-chart-2 flex cursor-help gap-1 text-sm underline decoration-dotted">
                        {transfer.price_formatted} {transfer.token_symbol}
                        <TrendingDown className="text-chart-2" width={16} />
                      </p>
                    </div>
                  </TooltipTrigger>
                  {transfer.current_usd_value && (
                    <TooltipContent side="right">
                      <div className="text-sm text-gray-500">
                        {`Valor atual: ${formatUsd(transfer.current_usd_value)}`}
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                      <p className="text-chart-1 flex cursor-help gap-1 text-sm underline decoration-dotted">
                        {transfer.price_formatted} {transfer.token_symbol}
                        <TrendingUp className="text-chart-1" width={16} />
                      </p>
                    </div>
                  </TooltipTrigger>
                  {transfer.current_usd_value && (
                    <TooltipContent side="right">
                      <div className="text-sm text-gray-500">
                        {`Valor atual: ${formatUsd(transfer.current_usd_value)}`}
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end justify-center gap-2">
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600">
                {transfer.block_timestamp &&
                  new Date(transfer.block_timestamp).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                {transfer.block_timestamp &&
                  new Date(transfer.block_timestamp).toLocaleTimeString()}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {transfer?.marketplace &&
              walletAddress === transfer.buyer_address ? (
                <p className="text-sm">
                  Comprado em: {""}
                  {transfer.marketplace}
                </p>
              ) : (
                <p className="text-sm">
                  Vendido em: {""} {transfer.marketplace}
                </p>
              )}
            </div>
          </div>
        </div>
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
