"use client";

import { FavoriteNFT, NFT } from "@/types/nfts-types";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ImageErrorFallback from "../../_components/image-error-fallback";

type FavoriteNftCardProps = {
  nft: NFT;
  removeFavorite: (nft: FavoriteNFT) => void;
  favorites?: FavoriteNFT[];
};

const FavoriteNftCard: React.FC<FavoriteNftCardProps> = ({
  nft,
  favorites,
  removeFavorite,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

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
    removeFavorite?.(favoriteNFT);
  };

  const rarityLabel = nft.rarity_label || "N/A";

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
              alt={nft.normalized_metadata?.name || `NFT ${nft.token_id}`}
              loading="lazy"
              width={300}
              height={300}
              unoptimized
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
          <ImageErrorFallback />
        )}
      </div>

      {/* Informações do NFT */}
      <div className="bg-brand-indigo p-4">
        <div className="mb-2 flex">
          <h3 className="truncate text-lg font-bold text-white">
            {nft.normalized_metadata?.name ||
              nft.name ||
              `Token #${nft.token_id}`}
          </h3>
          <div className="ml-auto flex items-center">
            <StarIcon
              onClick={handleFavoriteClick}
              className={`h-5 w-5 cursor-pointer transition-colors duration-200 ${
                isFavorite
                  ? "fill-brand-purple text-brand-purple"
                  : "text-brand-purple hover:fill-brand-purple"
              }`}
            />
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
          <Button className="mt-2 w-full" variant="outline" size="sm" asChild>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-purple-400 hover:text-purple-500"
              href={`https://opensea.io/item/ethereum/${nft.token_address}/${nft.token_id}`}
            >
              Ver na OpenSea
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FavoriteNftCard;
