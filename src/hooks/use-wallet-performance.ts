import { useMemo } from "react";
import { useWalletNFTs } from "./use-wallet-nfts";
import { useWalletStats } from "./use-wallet-stats";
import {
  UseWalletPerformanceReturn,
  WalletPerformance,
} from "@/types/wallet-performance-types";

interface UseWalletPerformanceProps {
  address: string;
  chain?: string;
  enabled?: boolean;
}

export const useWalletPerformance = ({
  address,
  chain = "eth",
  enabled = true,
}: UseWalletPerformanceProps): UseWalletPerformanceReturn => {
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

  const calculatedPerformance = useMemo((): WalletPerformance | null => {
    if (!nfts || nfts.length === 0 || !stats) {
      return null;
    }

    const totalNfts = parseInt(stats.nfts);
    const sampleSize = nfts.length;

    // Filtrar NFTs com histórico de venda e valor atual
    const nftsWithSaleHistory = nfts.filter((nft) => {
      const hasSaleHistory =
        nft.last_sale &&
        nft.last_sale.usd_price_at_sale &&
        parseFloat(nft.last_sale.usd_price_at_sale) > 0;

      const hasCurrentValue =
        (nft.current_usd_value && parseFloat(nft.current_usd_value) > 0) ||
        (nft.floor_price_usd && parseFloat(nft.floor_price_usd) > 0);

      return hasSaleHistory && hasCurrentValue;
    });

    // Se não há NFTs com histórico, retornar zero
    if (nftsWithSaleHistory.length === 0) {
      return {
        totalROIPercentage: 0,
        totalProfitLossUSD: 0,
        estimatedTotalInvestedUSD: 0,
        estimatedCurrentPortfolioValueUSD: 0,
        profitableNFTs: 0,
        unprofitableNFTs: 0,
        nftsWithSaleHistory: 0,
      };
    }

    // Calcular performance de cada NFT
    const nftPerformanceData = nftsWithSaleHistory.map((nft) => {
      const purchasePriceUSD = parseFloat(
        nft.last_sale?.usd_price_at_sale ?? "0",
      );
      const purchasePriceETH = parseFloat(
        nft.last_sale?.price_formatted ?? "0",
      );

      const currentValueUSD = nft.current_usd_value
        ? parseFloat(nft.current_usd_value)
        : parseFloat(nft.floor_price_usd || "0");

      const currentValueETH = parseFloat(nft.floor_price || "0");

      const profitLossUSD = currentValueUSD - purchasePriceUSD;
      const profitLossETH = currentValueETH - purchasePriceETH;
      const roiPercentage =
        purchasePriceUSD > 0 ? (profitLossUSD / purchasePriceUSD) * 100 : 0;

      return {
        purchasePriceUSD,
        purchasePriceETH,
        currentValueUSD,
        currentValueETH,
        profitLossUSD,
        profitLossETH,
        roiPercentage,
      };
    });

    // Calcular totais
    const totalPurchasePriceUSD = nftPerformanceData.reduce(
      (sum, nft) => sum + nft.purchasePriceUSD,
      0,
    );
    const totalCurrentValueUSD = nftPerformanceData.reduce(
      (sum, nft) => sum + nft.currentValueUSD,
      0,
    );

    const totalProfitLossUSD = totalCurrentValueUSD - totalPurchasePriceUSD;
    const totalROIPercentage =
      totalPurchasePriceUSD > 0
        ? (totalProfitLossUSD / totalPurchasePriceUSD) * 100
        : 0;

    // Contar NFTs lucrativos vs não lucrativos
    const profitableNFTs = nftPerformanceData.filter(
      (nft) => nft.profitLossUSD > 0,
    ).length;
    const unprofitableNFTs = nftPerformanceData.filter(
      (nft) => nft.profitLossUSD < 0,
    ).length;

    // Estimar valores totais
    const historyRatio = nftsWithSaleHistory.length / sampleSize;
    const estimatedNftsWithHistory = Math.floor(totalNfts * historyRatio);

    const averagePurchasePriceUSD =
      totalPurchasePriceUSD / nftsWithSaleHistory.length;
    const averageCurrentValueUSD =
      totalCurrentValueUSD / nftsWithSaleHistory.length;

    const estimatedTotalInvestedUSD =
      estimatedNftsWithHistory * averagePurchasePriceUSD;
    const estimatedCurrentPortfolioValueUSD =
      estimatedNftsWithHistory * averageCurrentValueUSD;

    return {
      totalROIPercentage: Number(totalROIPercentage.toFixed(2)),
      totalProfitLossUSD: Number(totalProfitLossUSD.toFixed(2)),
      estimatedTotalInvestedUSD: Number(estimatedTotalInvestedUSD.toFixed(2)),
      estimatedCurrentPortfolioValueUSD: Number(
        estimatedCurrentPortfolioValueUSD.toFixed(2),
      ),
      profitableNFTs,
      unprofitableNFTs,
      nftsWithSaleHistory: nftsWithSaleHistory.length,
    };
  }, [nfts, stats]);

  const loading = nftsLoading || statsLoading;
  const error = nftsError || statsError;

  return {
    performance: calculatedPerformance,
    loading,
    error,
  };
};
