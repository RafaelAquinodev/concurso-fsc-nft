"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingCollection } from "@/hooks/use-trending-nfts";
import { useCollectionNFTs } from "@/hooks/use-collection-nfts";
import { formatUsd } from "@/utils/format-usd";
import Image from "next/image";

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
  const { nfts, loading, error, fetchNFTs } = useCollectionNFTs();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen && collection?.collection_address) {
      fetchNFTs(collection.collection_address);
    }
  }, [isOpen, collection?.collection_address, fetchNFTs]);

  const handleImageError = (tokenId: string) => {
    setImageErrors((prev) => ({ ...prev, [tokenId]: true }));
  };

  const convertIpfsToHttp = (url: string) => {
    if (url.startsWith("ipfs://")) {
      return url.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
    return url;
  };

  const handleClose = () => {
    setImageErrors({});
    onClose();
  };

  if (!collection) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-secondary max-h-[80vh] overflow-y-auto p-4 sm:max-w-[700px] sm:p-6">
        <DialogHeader className="gap-3">
          <DialogTitle>
            {loading && (
              <Skeleton className="mt-6 h-24 w-full rounded-lg sm:mt-3 sm:h-44" />
            )}

            {!loading && nfts.length > 0 && nfts[0].collection_banner_image && (
              <Image
                src={convertIpfsToHttp(nfts[0].collection_banner_image)}
                alt={collection.collection_title}
                width={700}
                height={200}
                className="mt-6 rounded-lg object-cover sm:mt-3"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
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
          </DialogDescription>
        </DialogHeader>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">
            NFTs da Coleção
          </h3>

          {loading && (
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

          {error && (
            <div className="py-8 text-center">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {!loading && !error && nfts.length > 0 && (
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {nfts.map((nft) => (
                <Card
                  key={`${nft.token_address}-${nft.token_id}`}
                  className="bg-brand-indigo rounded-xl p-0"
                >
                  <CardContent className="p-2">
                    <div className="aspect-square overflow-hidden rounded-lg bg-gray-700">
                      {(nft.normalized_metadata?.image ||
                        nft.parsedMetadata?.image) &&
                      !imageErrors[nft.token_id] ? (
                        <Image
                          src={convertIpfsToHttp(
                            nft.normalized_metadata?.image ||
                              nft.parsedMetadata?.image ||
                              "",
                          )}
                          alt={
                            nft.normalized_metadata?.name ||
                            nft.parsedMetadata?.name ||
                            `NFT #${nft.token_id}`
                          }
                          width={128}
                          height={128}
                          className="h-full w-full object-cover"
                          onError={() => handleImageError(nft.token_id)}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-700">
                          <svg
                            className="h-12 w-12 text-gray-500"
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
                    <div className="flex flex-col p-1">
                      <h2 className="truncate text-sm font-semibold text-white">
                        {nft.normalized_metadata?.name ||
                          nft.parsedMetadata?.name ||
                          `#${nft.token_id}`}
                      </h2>

                      <p className="text-xs text-gray-400">{nft.symbol}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && !error && nfts.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-gray-400">
                Nenhum NFT encontrado nesta coleção
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CollectionModal;
