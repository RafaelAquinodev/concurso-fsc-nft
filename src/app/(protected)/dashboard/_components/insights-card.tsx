"use client";

import { useInsights } from "@/hooks/use-insights";
import { useEffect, useState } from "react";

const InsightsCard = () => {
  const { insights, getInsight, loading } = useInsights();
  const [collections] = useState([
    "Azuki",
    "Bored Ape Yacht Club",
    "CryptoPunks",
  ]);

  useEffect(() => {
    // Gera insights para cada coleção
    collections.forEach((collection) => {
      getInsight(collection);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">NFT Dashboard</h1>

      {collections.map((collection) => (
        <div key={collection} className="mb-4 rounded-lg border p-4">
          <h3 className="text-lg font-semibold">{collection}</h3>

          {loading[collection] ? (
            <div className="mt-2 text-gray-500">
              🤖 Gerando insights de IA...
            </div>
          ) : insights[collection] ? (
            <div className="mt-2 rounded bg-blue-50 p-3">
              <div className="text-sm font-medium text-blue-800">
                AI Insights:
              </div>
              <div className="text-blue-700">
                {insights[collection].insight}
              </div>
              <div className="mt-1 text-xs text-blue-600">
                Gerado em:{" "}
                {new Date(insights[collection].generatedAt).toLocaleString()}
              </div>
            </div>
          ) : (
            <div className="mt-2 text-gray-400">Nenhum insight disponível</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default InsightsCard;
