"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import { formatUsd } from "@/utils/format-usd";
import { Transfer } from "@/types/transfers-types";

interface RecentTransferCardProps {
  transfer: Transfer;
  walletAddress: string;
}

export default function RecentTransferCard({
  transfer,
  walletAddress,
}: RecentTransferCardProps) {
  return (
    <div className="flex justify-between gap-2 space-y-2 rounded-xl">
      {/* Imagem */}
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

        <div className="flex flex-col justify-between">
          {/* Nome da coleção */}
          <p className="text-xs text-gray-500">
            {transfer.collection_name || "Desconhecida"}
          </p>
          <div>
            {/* Code do NFT */}
            <p className="font-semibold">
              {transfer.metadata?.name || "NFT sem nome"}
            </p>

            {/* Valor em ETH */}
            {transfer.price_formatted &&
            walletAddress === transfer.buyer_address ? (
              <p className="flex gap-1 text-sm text-red-400">
                {transfer.price_formatted} {transfer.token_symbol}
                <TrendingDown className="text-red-400" width={16} />
              </p>
            ) : (
              <p className="flex gap-1 text-sm text-green-400">
                {transfer.price_formatted} {transfer.token_symbol}
                <TrendingUp className="text-chart-1" width={16} />
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Data */}
      <div className="flex flex-col items-end justify-center gap-1">
        <p className="text-sm text-gray-400">
          {transfer.block_timestamp &&
            new Date(transfer.block_timestamp).toLocaleDateString()}
        </p>

        {/* Valor em USD */}
        {transfer.current_usd_value && (
          <div className="text-sm text-white">
            {formatUsd(transfer.current_usd_value)}
          </div>
        )}
      </div>
    </div>
  );
}
