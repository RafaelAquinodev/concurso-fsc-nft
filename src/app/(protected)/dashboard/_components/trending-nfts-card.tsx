"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { TrendingCollection } from "@/hooks/use-trending-nfts";

type NftCardProps = {
  collection: TrendingCollection;
};

const TrendingNftCard: React.FC<NftCardProps> = ({ collection }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    }
    if (price >= 1000) {
      return `$${(price / 1000).toFixed(1)}k`;
    }
    return `$${price.toFixed(0)}`;
  };

  const formatPercentage = (percentage: number) => {
    const isPositive = percentage >= 0;
    return {
      value: `${isPositive ? "+" : ""}${percentage.toFixed(1)}%`,
      isPositive,
    };
  };

  const priceChange = formatPercentage(
    Number(collection.floor_price_24hr_percent_change) || 0,
  );

  return (
    <div className="group relative flex">
      {/* Imagem */}
      <div className="absolute top-1/2 left-0 z-10 h-12 w-12 -translate-y-1/2 transform">
        <div className="bg-brand-indigo relative flex h-full w-full items-center justify-center rounded-lg ring-1 ring-neutral-600 transition duration-300 group-hover:ring-purple-500">
          {collection.collection_image && !imageError ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-500 border-t-transparent"></div>
                </div>
              )}
              <img
                src={collection.collection_image}
                alt={collection.collection_title}
                className={`h-full w-full rounded-lg object-cover transition-opacity duration-300 ${
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
            <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-700">
              <svg
                className="h-6 w-6 text-gray-500"
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
          )}
        </div>
      </div>

      {/* Card */}
      <div className="group bg-brand-indigo ml-6 flex w-40 cursor-pointer items-center overflow-hidden rounded-xl border border-neutral-600 transition-all duration-300 hover:scale-102 hover:border-purple-500">
        <div className="flex min-w-0 flex-1 flex-col justify-between space-y-2 p-3 pl-8">
          <h3 className="truncate text-sm font-semibold text-white transition-colors group-hover:text-purple-400">
            {collection.collection_title}
          </h3>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="flex-shrink-0 text-xs text-gray-400">Floor</span>
              <span className="ml-2 truncate font-mono text-xs text-white">
                {formatPrice(Number(collection.floor_price_usd))}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex-shrink-0 text-xs text-gray-400">24h</span>
              <div className="flex min-w-0 items-center gap-1">
                {priceChange.isPositive ? (
                  <TrendingUp className="h-3 w-3 flex-shrink-0 text-green-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 flex-shrink-0 text-red-400" />
                )}
                <span
                  className={`truncate text-xs font-semibold ${
                    priceChange.isPositive ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {priceChange.value}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingNftCard;
