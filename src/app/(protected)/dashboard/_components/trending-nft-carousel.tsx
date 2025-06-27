"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { TrendingUp } from "lucide-react";
import TrendingNftCard from "./trending-nfts-card";
import { TrendingCollection } from "@/hooks/use-trending-nfts";

type TrendingNFTsCarouselProps = {
  collections?: TrendingCollection[];
  loading?: boolean;
};

const SLIDE_WIDTH = 180;
const MAX_CARDS_LIMIT = 12;

const TrendingNFTsCarousel: React.FC<TrendingNFTsCarouselProps> = ({
  collections,
  loading = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxCards, setMaxCards] = useState(MAX_CARDS_LIMIT);

  const GAP = 16;

  const calculateMaxCards = useCallback(() => {
    if (!containerRef.current) return MAX_CARDS_LIMIT;

    const containerWidth = containerRef.current.getBoundingClientRect().width;

    let maxCards = MAX_CARDS_LIMIT;

    while (maxCards > 1) {
      const totalWidth = maxCards * SLIDE_WIDTH + (maxCards - 1) * GAP;

      if (totalWidth <= containerWidth) {
        break;
      }
      maxCards -= 1;
    }

    return maxCards;
  }, []);

  const handleResize = useCallback(() => {
    const newMaxCards = calculateMaxCards();
    if (newMaxCards !== maxCards) {
      setMaxCards(newMaxCards);
    }
  }, [calculateMaxCards, maxCards]);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        handleResize();
      });
    });

    resizeObserver.observe(containerRef.current);

    handleResize();

    return () => {
      resizeObserver.disconnect();
    };
  }, [handleResize]);

  useEffect(() => {
    const handleWindowResize = () => {
      setTimeout(handleResize, 80);
    };

    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [handleResize]);

  if (loading) {
    return (
      <div className="rounded-xl p-6">
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
    <div ref={containerRef} className="mx-auto w-full">
      <div className="mb-6 flex items-center justify-center">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          <TrendingUp className="h-5 w-5 text-purple-500" />
          NFTs em Alta
        </h2>
      </div>
      <div className="mx-auto flex justify-center gap-4">
        {collections.slice(0, maxCards).map((collection) => (
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
