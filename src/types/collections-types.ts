export interface CollectionNFT {
  token_address: string;
  token_id: string;
  amount: string;
  token_hash: string;
  block_number: string;
  block_number_minted: string;
  contract_type: string;
  name: string;
  symbol: string;
  token_uri: string;
  metadata: string;
  parsedMetadata?: {
    image?: string;
    name?: string;
    description?: string;
    attributes?: Array<{
      trait_type: string;
      value: string;
    }>;
  };
  last_token_uri_sync: string;
  last_metadata_sync: string;
  minter_address: string;
  owner_of: string;
  rarity_rank: number;
  rarity_percentage: number;
  rarity_label: string;
  possible_spam: string;
  verified_collection: boolean;
  last_sale?: {
    transaction_hash: string;
    block_timestamp: string;
    buyer_address: string;
    seller_address: string;
    price: string;
    price_formatted: string;
    usd_price_at_sale: string;
    current_usd_value: string;
    token_id: string;
    payment_token: {
      token_name: string;
      token_symbol: string;
      token_logo: string;
      token_decimals: string;
      token_address: string;
    };
  };
  list_price: {
    listed: string;
    price: string;
    price_currency: string;
    price_usd: string;
    marketplace: string;
  };
  normalized_metadata: {
    name: string;
    description: string;
    animation_url: string;
    external_link: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string;
      display_type: string;
      max_value: string;
      trait_count: string;
      order: string;
      rarity_label: string;
      count: number;
      percentage: number;
    }>;
  };
  collection_logo: string;
  collection_banner_image: string;
  collection_category: string;
  project_url: string;
  wiki_url: string;
  discord_url: string;
  telegram_url: string;
  twitter_username: string;
  instagram_username: string;
  floor_price: string;
  floor_price_usd: string;
  floor_price_currency: string;
}

export interface CollectionNFTsResponse {
  cursor: string;
  page: string;
  page_size: number;
  result: CollectionNFT[];
}

export interface UseCollectionNFTsReturn {
  nfts: CollectionNFT[];
  loading: boolean;
  error: string | null;
  fetchNFTs: (address: string) => Promise<void>;
}
