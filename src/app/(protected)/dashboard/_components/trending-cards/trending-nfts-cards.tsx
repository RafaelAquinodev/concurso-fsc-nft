"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { TrendingUp } from "lucide-react";
import TrendingNftCard from "./trending-nfts-card";
import CollectionModal from "./collection-modal";
import { TrendingCollection } from "@/hooks/use-trending-nfts";
import { useSidebar } from "@/components/ui/sidebar";

type TrendingNFTsCardsProps = {
  collections?: TrendingCollection[];
  loading?: boolean;
};

const SLIDE_WIDTH = 210;
const MAX_CARDS_LIMIT = 14;

const TrendingNFTsCards: React.FC<TrendingNFTsCardsProps> = ({
  collections,
  loading = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxCards, setMaxCards] = useState(MAX_CARDS_LIMIT);
  const [selectedCollection, setSelectedCollection] =
    useState<TrendingCollection | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isMobile } = useSidebar();

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

  const handleCollectionClick = useCallback(
    (collection: TrendingCollection) => {
      setSelectedCollection(collection);
      setIsModalOpen(true);
    },
    [],
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCollection(null);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        handleResize();
      });
    });

    resizeObserver.observe(containerRef.current);

    requestAnimationFrame(() => {
      handleResize();
    });

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
      <div ref={containerRef} className="mx-auto w-full">
        <div className="mb-6 flex items-center gap-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-white">
            <TrendingUp className="text-brand-purple h-5 w-5" />
            NFTs em Alta
          </h2>
          <span className="mt-1 text-sm text-gray-400">Últimas 24 horas</span>
        </div>
        <div className="flex items-center justify-center gap-4 overflow-x-auto">
          <div className="mx-auto flex flex-col justify-center gap-4">
            <div className="mx-auto flex gap-4">
              {Array.from({ length: maxCards }).map((_, index) => (
                <div
                  key={index}
                  className="bg-brand-indigo h-[88px] w-[180px] animate-pulse rounded-lg"
                ></div>
              ))}
            </div>
            <div className="mx-auto flex gap-4">
              {Array.from({ length: maxCards }).map((_, index) => (
                <div
                  key={index}
                  className="bg-brand-indigo h-[88px] w-[180px] animate-pulse rounded-lg"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!collections || collections.length === 0) {
    return (
      <div ref={containerRef} className="mx-auto w-full">
        <div className="mb-6 flex items-center gap-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-white">
            <TrendingUp className="text-brand-purple h-5 w-5" />
            NFTs em Alta
          </h2>
          <span className="mt-1 text-sm text-gray-400">Últimas 24 horas</span>
        </div>
        <div className="bg-brand-indigo rounded-lg py-8 text-center">
          <p className="text-gray-400">Nenhuma coleção encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="mx-auto w-full">
      <div className="mb-6 flex items-center gap-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          <TrendingUp className="text-brand-purple h-5 w-5" />
          NFTs em Alta
        </h2>
        <span className="mt-1 text-sm text-gray-400">Últimas 24 horas</span>
      </div>
      {!isMobile ? (
        <div className="mx-auto flex flex-col justify-center gap-4">
          <div className="mx-auto flex gap-4">
            {collections.slice(0, maxCards).map((collection, index) => (
              <TrendingNftCard
                key={`${collection.collection_address}-${index}`}
                collection={collection}
                onClick={handleCollectionClick}
              />
            ))}
          </div>
          <div className="mx-auto hidden gap-4 max-[1921px]:flex">
            {collections
              .slice(maxCards, maxCards * 2)
              .map((collection, index) => (
                <TrendingNftCard
                  key={`${collection.collection_address}-${index}`}
                  collection={collection}
                  onClick={handleCollectionClick}
                />
              ))}
          </div>
        </div>
      ) : (
        <div className="max-[500px]:space-y-4 min-[500px]:columns-2">
          <div className="flex flex-col items-center justify-center gap-4">
            {collections.slice(0, 3).map((collection, index) => (
              <TrendingNftCard
                key={`${collection.collection_address}-${index}`}
                collection={collection}
                onClick={handleCollectionClick}
                cardWidth={200}
              />
            ))}
          </div>
          <div className="flex flex-col items-center justify-center gap-4">
            {collections.slice(3, 6).map((collection, index) => (
              <TrendingNftCard
                key={`${collection.collection_address}-${index}`}
                collection={collection}
                onClick={handleCollectionClick}
                cardWidth={200}
              />
            ))}
          </div>
        </div>
      )}

      <CollectionModal
        collection={selectedCollection}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default TrendingNFTsCards;
