"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatUsd } from "@/utils/format-usd";
import { FavoriteNFT, NFT } from "@/types/nfts-types";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

type NftCardProps = {
  nft: NFT;
  removeFavorite?: (nft: FavoriteNFT) => void;
  addFavorite?: (nft: FavoriteNFT) => void;
  favorites?: FavoriteNFT[];
};

const NftCard: React.FC<NftCardProps> = ({
  nft,
  addFavorite,
  removeFavorite,
  favorites,
}) => {
  const isFavorite = (favorites || []).some(
    (fav) =>
      fav.token_address === nft.token_address &&
      fav.token_id === nft.token_id &&
      fav.chain === nft.chain,
  );

  const handleFavoriteClick = () => {
    const favoriteNFT: FavoriteNFT = {
      token_address: nft.token_address,
      token_id: nft.token_id,
      chain: nft.chain,
    };

    if (isFavorite) {
      removeFavorite?.(favoriteNFT);
    } else {
      addFavorite?.(favoriteNFT);
    }
  };

  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const topOfferRaw = nft.last_sale?.price_formatted;
  const topOffer = topOfferRaw ? Number(topOfferRaw).toFixed(2) : "Não listado";

  const paymentTokenSymbol = nft.last_sale?.payment_token.token_symbol || "";

  const usdValueAtSale = formatUsd(nft.last_sale?.usd_price_at_sale || 0);
  const currentUsdValue = formatUsd(nft.last_sale?.current_usd_value || 0);

  const rarityLabel = nft.rarity_label || "N/A";
  const { user } = useUser();
  const premiumPlan = user?.publicMetadata.subscriptionPlan === "premium";

  return (
    <div className="overflow-hidden rounded-xl bg-neutral-900 shadow-[0_5px_0_0_#6934ab] transition-all duration-300 hover:scale-102 hover:shadow-[0_0px_5px_0_#6934ab] max-[550px]:mx-auto max-[550px]:max-w-[280px]">
      {/* Imagem do NFT */}
      <div className="bg-brand-indigo relative h-64">
        {nft.normalized_metadata?.image && !imageError ? (
          <>
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-brand-purple h-8 w-8 animate-spin rounded-full border-b-2"></div>
              </div>
            )}
            <Image
              src={nft.normalized_metadata?.image}
              alt={nft.metadata?.name || `NFT ${nft.token_id}`}
              loading="lazy"
              width={300}
              height={300}
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
          <div className="flex h-full w-full min-w-[240px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-lg bg-gray-400">
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
      <div className="bg-brand-indigo p-4">
        <div className="mb-2 flex">
          <h3 className="truncate text-lg font-bold text-white">
            {nft.metadata?.name || nft.name || `Token #${nft.token_id}`}
          </h3>
          <div className="ml-auto flex items-center">
            {premiumPlan && (
              <StarIcon
                onClick={handleFavoriteClick}
                className={`h-5 w-5 cursor-pointer transition-colors duration-200 ${
                  isFavorite
                    ? "fill-brand-purple text-brand-purple"
                    : "text-brand-purple hover:fill-brand-purple"
                }`}
              />
            )}
          </div>
        </div>

        <div className="space-y-2 text-xs text-gray-50">
          <div className="flex justify-between">
            <p className="text-sm text-gray-50">{nft.symbol}</p>
            <p className="font-mono">#{nft.token_id}</p>
          </div>

          <div className="flex justify-between">
            <span>Raridade </span>
            <span className="font-semibold">{rarityLabel}</span>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex justify-between gap-2">
                <span>Top Oferta </span>
                <div className="space-x-1 font-semibold">
                  <span
                    className={
                      topOfferRaw && `cursor-help underline decoration-dotted`
                    }
                  >
                    {topOffer}
                  </span>
                  <span>{paymentTokenSymbol}</span>
                </div>
              </div>
            </TooltipTrigger>
            {topOfferRaw && (
              <TooltipContent side="right">
                <div className="text-sm text-gray-500">
                  {usdValueAtSale ? `Valor na venda: ${usdValueAtSale}` : ""}
                </div>
                <div className="text-sm text-gray-500">
                  {usdValueAtSale ? `Valor atual: ${currentUsdValue}` : ""}
                </div>
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default NftCard;
