import { useMemo } from "react";
import { useWalletNFTs } from "./use-wallet-nfts";
import { useWalletStats } from "./use-wallet-stats";
import { UseWalletValueReturn, WalletValue } from "@/types/wallet-value-types";

interface UseWalletValueProps {
  address: string;
  chain?: string;
  enabled?: boolean;
}

export const useWalletValue = ({
  address,
  chain = "eth",
  enabled = true,
}: UseWalletValueProps): UseWalletValueReturn => {
  const {
    nfts,
    loading: nftsLoading,
    error: nftsError,
  } = useWalletNFTs({
    address,
    chain,
    limit: 40,
    includePrices: true,
    enabled: !!address && enabled,
  });

  const {
    stats,
    isLoading: statsLoading,
    error: statsError,
  } = useWalletStats({
    address,
    chain,
    enabled: !!address && enabled,
  });

  const calculatedValue = useMemo((): WalletValue | null => {
    if (!nfts || nfts.length === 0 || !stats) {
      return null;
    }

    const totalNfts = parseInt(stats.nfts);
    const nftsSize = nfts.length;

    const nftsWithPrices = nfts.filter((nft) => {
      const floorPriceUSD = parseFloat(nft.floor_price_usd || "0");
      const floorPriceETH = parseFloat(nft.floor_price || "0");
      return floorPriceUSD > 0 || floorPriceETH > 0;
    });

    if (nftsWithPrices.length === 0) {
      return {
        estimatedValueUSD: "0.00",
        estimatedValueETH: "0.0000",
        averageFloorPriceUSD: "0.00",
        averageFloorPriceETH: "0.0000",
        nftsWithPrices: 0,
        totalNfts,
        nftsSize,
      };
    }

    const totalFloorPriceUSD = nftsWithPrices.reduce((sum, nft) => {
      return sum + parseFloat(nft.floor_price_usd || "0");
    }, 0);

    const totalFloorPriceETH = nftsWithPrices.reduce((sum, nft) => {
      return sum + parseFloat(nft.floor_price || "0");
    }, 0);

    const averageFloorPriceUSD = totalFloorPriceUSD / nftsWithPrices.length;
    const averageFloorPriceETH = totalFloorPriceETH / nftsWithPrices.length;

    const priceRatio = nftsWithPrices.length / nftsSize;
    const estimatedNftsWithValue = Math.floor(totalNfts * priceRatio);

    const estimatedValueUSD = estimatedNftsWithValue * averageFloorPriceUSD;
    const estimatedValueETH = estimatedNftsWithValue * averageFloorPriceETH;

    return {
      estimatedValueUSD: estimatedValueUSD.toFixed(2),
      estimatedValueETH: estimatedValueETH.toFixed(4),
      averageFloorPriceUSD: averageFloorPriceUSD.toFixed(2),
      averageFloorPriceETH: averageFloorPriceETH.toFixed(4),
      nftsWithPrices: nftsWithPrices.length,
      totalNfts,
      nftsSize,
    };
  }, [nfts, stats]);

  const loading = nftsLoading || statsLoading;
  const error = nftsError || statsError;

  return {
    value: calculatedValue,
    loading,
    error,
  };
};
