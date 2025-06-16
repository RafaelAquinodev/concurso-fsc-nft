interface NFTMetadata {
  name?: string;
  description?: string;
  image?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

interface NFT {
  token_address: string;
  token_id: string;
  owner_of: string;
  block_number: string;
  block_number_minted: string;
  token_hash: string;
  amount: string;
  contract_type: string;
  name: string;
  symbol: string;
  token_uri?: string;
  floor_price: string;
  floor_price_currency: string;
  floor_price_usd: string;
  list_price?: {
    price: string;
    price_currency: string;
    price_usd: string;
  };
  metadata?: NFTMetadata;
  last_token_uri_sync?: string;
  last_metadata_sync?: string;
  minter_address?: string;
  normalized_metadata?: {
    image?: string;
  };
  resolvedImageUrl?: string | null;
}
interface NFTResponse {
  total: number;
  page: number;
  page_size: number;
  cursor?: string;
  result: NFT[];
}
type SortKey = "name" | "floor_price";
type SortOrder = "asc" | "desc";
interface UseWalletNFTsProps {
  address: string;
  chain?: string;
  limit?: number;
  cursor?: string;
  normalizeMetadata?: boolean;
  mediaItems?: boolean;
  includePrices?: boolean;
  excludeSpam?: boolean;
  sortBy?: SortKey;
  sortOrder?: SortOrder;
}

interface UseWalletNFTsReturn {
  nfts: NFT[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasNextPage: boolean;
  cursor: string | null;
  refetch: () => void;
  loadMore: () => void;
}

export type {
  NFT,
  NFTMetadata,
  NFTResponse,
  SortKey,
  SortOrder,
  UseWalletNFTsProps,
  UseWalletNFTsReturn,
};
