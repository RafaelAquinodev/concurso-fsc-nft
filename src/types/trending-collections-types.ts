export interface TrendingCollection {
  collection_address: string;
  collection_title: string;
  collection_image: string;
  collection_banner_image: string; // banner da coleção
  floor_price_usd: number;
  floor_price_native: number;
  floor_price_24hr_percent_change: number;
  market_cap_native: number;
  volume_usd: number;
  volume_native: number;
  volume_24hr_percent_change: number;
  average_price_usd: number;
  average_price_native: number;
}

export interface TrendingNFTsResponse {
  data: TrendingCollection[];
}

export interface UseTrendingNFTsProps {
  chain?: string;
  limit?: number;
}

export interface UseTrendingNFTsReturn {
  trendingCollections: TrendingCollection[];
  loading: boolean;
  error: string | null;
}
