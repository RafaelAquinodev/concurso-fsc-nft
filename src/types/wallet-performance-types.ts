export interface WalletPerformance {
  totalROIPercentage: number;
  totalProfitLossUSD: number;
  estimatedTotalInvestedUSD: number;
  estimatedCurrentPortfolioValueUSD: number;
  profitableNFTs: number;
  unprofitableNFTs: number;
  nftsWithSaleHistory: number;
}

export interface UseWalletPerformanceReturn {
  performance: WalletPerformance | null;
  loading: boolean;
  error: string | null;
}
