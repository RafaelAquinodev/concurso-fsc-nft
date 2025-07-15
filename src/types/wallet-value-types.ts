export interface WalletValue {
  estimatedValueUSD: string;
  estimatedValueETH: string;
  averageFloorPriceUSD: string;
  averageFloorPriceETH: string;
  nftsWithPrices: number;
  totalNfts: number;
  nftsSize: number;
}

export interface UseWalletValueReturn {
  value: WalletValue | null;
  loading: boolean;
  error: string | null;
}
