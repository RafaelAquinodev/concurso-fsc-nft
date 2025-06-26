"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatUsd } from "@/utils/format-usd";
import { Transfer } from "@/types/transfers-types";

interface TransferCardProps {
  transfer: Transfer;
  walletAddress: string;
}

export default function TransferCard({ transfer, walletAddress }: TransferCardProps) {
  return (
    <div className="flex justify-between rounded-xl bg-neutral-900 p-4">
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
                    {`Valor em dolar: ${formatUsd(transfer.current_usd_value)}`}
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
                    {`Valor em dolar: ${formatUsd(transfer.current_usd_value)}`}
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
  );
}