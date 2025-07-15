"use client";

import { useState, useEffect, useRef } from "react";
import { NFTInsight } from "@/types/insight";
import { generateInsight } from "@/app/actions/generate-insight";

interface CachedInsight extends NFTInsight {
  cacheDate: string;
}

const CACHE_KEY = "nft-insights-cache";

export function useInsights(collectionName: string, enabled = true) {
  const [insight, setInsight] = useState<CachedInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef<Set<string>>(new Set());

  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const getCacheFromStorage = (): CachedInsight[] => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  };

  const saveCacheToStorage = (cache: CachedInsight[]) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.error("Error saving cache:", error);
    }
  };

  useEffect(() => {
    if (!enabled || !collectionName) return;

    const findCachedInsight = (collection: string): CachedInsight | null => {
      const cache = getCacheFromStorage();
      const today = getCurrentDate();

      return (
        cache.find(
          (item) => item.collection === collection && item.cacheDate === today,
        ) || null
      );
    };

    const cacheKey = `${collectionName}-${getCurrentDate()}`;
    if (fetchedRef.current.has(cacheKey)) {
      return;
    }

    const cached = findCachedInsight(collectionName);
    if (cached) {
      setInsight(cached);
      fetchedRef.current.add(cacheKey);
      return;
    }

    const fetchInsight = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await generateInsight(collectionName);

        if (result.success) {
          const newInsight: CachedInsight = {
            collection: collectionName,
            insight: result.insight,
            generatedAt: new Date().toISOString(),
            cacheDate: getCurrentDate(),
          };

          const currentCache = getCacheFromStorage();
          const filteredCache = currentCache.filter(
            (item) => item.collection !== collectionName,
          );
          saveCacheToStorage([...filteredCache, newInsight]);

          setInsight(newInsight);
          fetchedRef.current.add(cacheKey);
        } else {
          setError("Erro ao gerar insight");
        }
      } catch (error) {
        console.error("Error fetching insight:", error);
        setError("Erro ao gerar insight");
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, [collectionName, enabled]);

  return {
    insight,
    loading,
    error,
  };
}
