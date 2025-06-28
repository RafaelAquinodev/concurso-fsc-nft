import { useState, useEffect, useMemo } from "react";
import { useWalletNFTs } from "./use-wallet-nfts";
import { useWalletStats } from "./use-wallet-stats";

interface UseWalletValueProps {
  address: string;
  chain?: string;
}

interface WalletValue {
  estimatedValueUSD: string;
  estimatedValueETH: string;
  averageFloorPriceUSD: string;
  averageFloorPriceETH: string;
  nftsWithPrices: number;
  totalNfts: number;
  nftsSize: number;
}

interface UseWalletValueReturn {
  value: WalletValue | null;
  loading: boolean;
  error: string | null;
}

export const useWalletValue = ({
  address,
  chain = "eth",
}: UseWalletValueProps): UseWalletValueReturn => {
  const [value, setValue] = useState<WalletValue | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar amostra de NFTs (primeiros 40)
  const {
    nfts,
    loading: nftsLoading,
    error: nftsError,
  } = useWalletNFTs({
    address,
    chain,
    limit: 40,
    includePrices: true,
  });

  // Buscar estatísticas totais da carteira
  const {
    stats,
    loading: statsLoading,
    error: statsError,
  } = useWalletStats({
    address,
    chain,
  });

  // Calcular estimativa baseada na amostra
  const calculatedValue = useMemo(() => {
    if (!nfts || nfts.length === 0 || !stats) {
      return null;
    }

    const totalNfts = parseInt(stats.nfts);
    const nftsSize = nfts.length;
    console.log("Total dasd NFTs:", nfts.length);

    // Filtrar NFTs que têm preços válidos
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

    // Calcular médias dos floor prices
    const totalFloorPriceUSD = nftsWithPrices.reduce((sum, nft) => {
      return sum + parseFloat(nft.floor_price_usd || "0");
    }, 0);

    const totalFloorPriceETH = nftsWithPrices.reduce((sum, nft) => {
      return sum + parseFloat(nft.floor_price || "0");
    }, 0);

    const averageFloorPriceUSD = totalFloorPriceUSD / nftsWithPrices.length;
    const averageFloorPriceETH = totalFloorPriceETH / nftsWithPrices.length;

    // Extrapolação para o total da carteira
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

  // Gerenciar estados de loading e error
  useEffect(() => {
    const isLoading = nftsLoading || statsLoading;
    const hasError = nftsError || statsError;

    setLoading(isLoading);
    setError(hasError);

    if (!isLoading && !hasError) {
      setValue(calculatedValue);
    }
  }, [nftsLoading, statsLoading, nftsError, statsError, calculatedValue]);

  return {
    value,
    loading,
    error,
  };
};
