interface NFTMetadata {
  name?: string;
  description?: string;
  image?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

interface Transfer {
  transaction_hash: string;
  address: string;
  block_timestamp?: string;
  seller_address?: string;
  buyer_address?: string;
  token_address?: string;
  collection_name?: string;
  collection_logo?: string;
  marketplace?: string;
  marketplace_logo?: string;
  price?: string;
  price_formatted?: string;
  current_usd_value?: string;
  token_symbol?: string;
  token_decimals?: string;
  chain: string;
  metadata?: NFTMetadata;
}

interface TransferResponse {
  total: number;
  page?: number;
  page_size?: number;
  cursor?: string;
  result: Transfer[];
  resolvedTransfers: Transfer[];
}

interface UseWalletTransfersProps {
  address: string;
  chain?: string;
  limit?: number;
  cursor?: string;
  includePrices?: boolean;
}

interface UseWalletTransfersReturn {
  transfers: Transfer[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  hasNextPage: boolean;
  cursor: string | null;
  refetch: () => void;
  loadMore: () => void;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

export type {
  NFTMetadata,
  Transfer,
  TransferResponse,
  UseWalletTransfersProps,
  UseWalletTransfersReturn,
};
