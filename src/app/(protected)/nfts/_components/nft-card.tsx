/* eslint-disable @next/next/no-img-element */
"use client";

import { NFT } from "@/types/nfts-types";
import { Heart } from "lucide-react";
import { useState } from "react";

const NftCard: React.FC<{ nft: NFT }> = ({ nft }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div className="overflow-hidden rounded-xl bg-black shadow-[0_5px_0_0_#b22ecd] transition-all duration-300 hover:scale-102 hover:shadow-xl">
      {/* Imagem do NFT */}
      <div className="relative h-64 bg-black">
        {nft.resolvedImageUrl && !imageError ? (
          <>
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-purple-600"></div>
              </div>
            )}
            <img
              src={nft.resolvedImageUrl}
              alt={nft.metadata?.name || `NFT ${nft.token_id}`}
              className={`h-full w-full rounded-xl object-cover transition-opacity duration-300 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
            />
          </>
        ) : (
          // Se a imagem não carregar, mostra svg
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-lg bg-gray-200">
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
              <p className="text-sm">Sem imagem</p>
            </div>
          </div>
        )}
      </div>

      {/* Informações do NFT */}
      <div className="p-4">
        <div className="mb-2 flex">
          <h3 className="truncate text-lg font-bold text-gray-100">
            {nft.metadata?.name || nft.name || `Token #${nft.token_id}`}
          </h3>
          <div className="ml-auto flex items-center">
            <Heart className="h-5 w-5 cursor-pointer text-red-500 transition-colors hover:text-red-600" />
          </div>
        </div>
        <p className="text-sm text-gray-50">{nft.symbol}</p>

        <div className="space-y-2 text-xs text-gray-50">
          <div className="flex justify-between">
            <span>Token ID:</span>
            <span className="font-mono">#{nft.token_id}</span>
          </div>
          <div className="flex justify-between">
            <span>Contrato:</span>
            <span className="ml-2 truncate font-mono">
              {nft.token_address.slice(0, 6)}...{nft.token_address.slice(-4)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Tipo:</span>
            <span className="font-semibold">{nft.contract_type}</span>
          </div>
        </div>

        {/* Atributos */}
        {nft.metadata?.attributes && nft.metadata.attributes.length > 0 && (
          <div className="mt-3 border-t border-gray-100 pt-3">
            <h4 className="mb-2 text-xs font-semibold text-gray-600">
              Atributos:
            </h4>
            <div className="flex flex-wrap gap-1">
              {nft.metadata.attributes.slice(0, 3).map((attr, index) => (
                <span
                  key={index}
                  className="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-800"
                >
                  {attr.trait_type}: {attr.value}
                </span>
              ))}
              {nft.metadata.attributes.length > 3 && (
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                  +{nft.metadata.attributes.length - 3} mais
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NftCard;
