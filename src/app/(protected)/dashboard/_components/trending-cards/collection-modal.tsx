"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollectionNFTs } from "@/hooks/use-collection-nfts";
import { formatUsd } from "@/utils/format-usd";
import Image from "next/image";
import InsightsCard from "./insights-card";
import { resolveIpfsUrl } from "@/utils/resolve-ipfs-url";
import { TrendingCollection } from "@/types/trending-collections-types";
import { useState } from "react";
import LoadingSpin from "@/app/(protected)/_components/loading-spin";
import ImageErrorFallback from "@/app/(protected)/_components/image-error-fallback";

interface CollectionModalProps {
  collection: TrendingCollection | null;
  isOpen: boolean;
  onClose: () => void;
}

const CollectionModal: React.FC<CollectionModalProps> = ({
  collection,
  isOpen,
  onClose,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const collectionAddress = collection?.collection_address;

  const {
    data: nfts = [],
    isLoading,
    isError,
    error,
  } = useCollectionNFTs({
    collectionAddress,
    enabled: !!collectionAddress && isOpen,
  });

  if (!collection) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="bg-secondary max-h-[90vh] overflow-y-auto p-4 sm:max-w-[700px] sm:p-6"
        aria-describedby={undefined}
      >
        <DialogHeader className="gap-3">
          <DialogTitle>
            {isLoading && (
              <Skeleton className="mt-6 h-24 w-full rounded-lg sm:mt-3 sm:h-44" />
            )}

            {!isLoading &&
              nfts.length > 0 &&
              nfts[0].collection_banner_image && (
                <Image
                  src={resolveIpfsUrl(nfts[0].collection_banner_image)}
                  alt={collection.collection_title}
                  width={700}
                  height={400}
                  className="mt-6 max-h-52 rounded-lg border object-cover sm:mt-3"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
          </DialogTitle>
          <div className="flex items-center gap-2">
            {collection.collection_image && (
              <Image
                src={collection.collection_image}
                alt={collection.collection_title}
                width={50}
                height={50}
                className="rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
            <div>
              <h2 className="text-xl font-bold text-white">
                {collection.collection_title}
              </h2>
              <div className="mt-2 flex items-center gap-4 text-sm">
                <p className="text-gray-300">
                  Preço médio:{" "}
                  <span className="font-medium">
                    {formatUsd(collection.floor_price_usd)}
                  </span>
                </p>
                <p className="text-gray-300">
                  Volume 24h:{" "}
                  <span className="font-medium">
                    {formatUsd(collection.volume_usd)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div>
          <h3 className="mb-3 text-lg font-semibold text-white">
            NFTs da Coleção
          </h3>

          {isLoading && (
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="bg-brand-indigo rounded-xl p-0">
                  <CardContent className="p-2">
                    <Skeleton className="aspect-square w-full rounded-lg" />
                    <div className="mt-1 flex flex-col p-1">
                      <Skeleton className="mb-1 h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {isError && (
            <div className="py-8 text-center">
              <p className="text-red-400">
                {error?.message || "Erro ao buscar NFTs"}
              </p>
            </div>
          )}

          {/* Cards de NFTs */}
          {!isLoading && !isError && nfts.length > 0 && (
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {nfts.map((nft) => (
                <Card
                  key={`${nft.token_address}-${nft.token_id}`}
                  className="bg-brand-indigo rounded-xl p-0"
                >
                  <CardContent className="p-2">
                    <div className="relative overflow-hidden rounded-lg bg-gray-700">
                      {nft.normalized_metadata?.image && !imageError ? (
                        <>
                          {imageLoading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <LoadingSpin size="md" />
                            </div>
                          )}
                          <Image
                            src={nft.normalized_metadata?.image}
                            alt={
                              nft.normalized_metadata?.name ||
                              `NFT #${nft.token_id}`
                            }
                            width={240}
                            height={240}
                            className={`h-full w-full object-cover transition-opacity duration-300 ${
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
                        <ImageErrorFallback />
                      )}
                    </div>
                    <div className="flex flex-col p-1">
                      <h2 className="truncate text-sm font-semibold text-white">
                        {nft.normalized_metadata?.name || `#${nft.token_id}`}
                      </h2>

                      <p className="text-xs text-gray-400">{nft.symbol}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && !isError && nfts.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-gray-400">
                Nenhum NFT encontrado nesta coleção
              </p>
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold text-white">
            Insight Diário
          </h3>

          <InsightsCard collection={collection.collection_title} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CollectionModal;
