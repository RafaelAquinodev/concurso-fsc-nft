"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { TrendingCollection } from "@/hooks/use-trending-nfts";
import TrendingNftCard from "./trending-nfts-card";

type TrendingNFTsCarouselProps = {
  collections: TrendingCollection[];
  loading?: boolean;
};

const MAX_CARDS = 10;

const TrendingNFTsCarousel: React.FC<TrendingNFTsCarouselProps> = ({
  collections,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="mx-auto w-full max-w-screen-md rounded-xl bg-neutral-950 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            NFTs em Alta
          </h2>
        </div>
        <div className="flex gap-4 overflow-x-auto">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="w-44 flex-shrink-0 animate-pulse overflow-hidden rounded-xl bg-neutral-900"
            >
              <div className="h-32 bg-neutral-800"></div>
              <div className="space-y-2 p-3">
                <div className="h-4 rounded bg-neutral-800"></div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <div className="h-3 w-8 rounded bg-neutral-800"></div>
                    <div className="h-3 w-12 rounded bg-neutral-800"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-3 w-6 rounded bg-neutral-800"></div>
                    <div className="h-3 w-10 rounded bg-neutral-800"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!collections || collections.length === 0) {
    return (
      <div className="w-full rounded-xl bg-neutral-950 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            NFTs em Alta
          </h2>
        </div>
        <div className="py-8 text-center">
          <p className="text-gray-400">Nenhuma coleção encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full rounded-xl bg-neutral-950 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-white">
          <TrendingUp className="h-5 w-5 text-purple-500" />
          NFTs em Alta
        </h2>
      </div>
      <div className="flex gap-4">
        {collections.slice(0, MAX_CARDS).map((collection) => (
          <TrendingNftCard
            key={collection.collection_id}
            collection={collection}
          />
        ))}
      </div>
    </div>
  );
};

export default TrendingNFTsCarousel;
