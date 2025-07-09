"use client";

import { useState, useEffect } from "react";
import { NFTInsight } from "@/types/insight";
import { generateInsight } from "@/app/actions/generate-insight";

export function useInsights() {
  const [insights, setInsights] = useState<Record<string, NFTInsight>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const cached = localStorage.getItem("nft-insights");
    if (cached) {
      setInsights(JSON.parse(cached));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("nft-insights", JSON.stringify(insights));
  }, [insights]);

  const getInsight = async (collection: string) => {
    if (insights[collection]) {
      return insights[collection];
    }

    setLoading((prev) => ({ ...prev, [collection]: true }));

    try {
      const result = await generateInsight(collection);

      if (result.success) {
        const newInsight: NFTInsight = {
          collection,
          insight: result.insight,
          generatedAt: new Date().toISOString(),
        };

        setInsights((prev) => ({
          ...prev,
          [collection]: newInsight,
        }));

        return newInsight;
      }
    } catch (error) {
      console.error("Error fetching insight:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [collection]: false }));
    }

    return null;
  };

  return {
    insights,
    getInsight,
    loading,
  };
}
