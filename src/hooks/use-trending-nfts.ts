import { useQuery } from "@tanstack/react-query";
import { TrendingCollection } from "@/types/trending-collections-types";

export const useTrendingNFTs = () => {
  return useQuery<TrendingCollection[]>({
    queryKey: ["trendingNFTs"],
    queryFn: async () => {
      const res = await fetch("/api/nfts/trending");

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data.result as TrendingCollection[];
    },
    staleTime: 1000 * 60 * 5, // dados obsoletos em 5 minutos
  });
};
