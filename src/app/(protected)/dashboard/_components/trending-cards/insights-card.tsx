"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useInsights } from "@/hooks/use-insights";
import { useUser } from "@clerk/nextjs";
import { Crown } from "lucide-react";
import Link from "next/link";

interface InsightsCardProps {
  collection: string;
}

const InsightsCard = ({ collection }: InsightsCardProps) => {
  const { user } = useUser();
  const premiumPlan = user?.publicMetadata.subscriptionPlan === "premium";

  const { insight, loading, error } = useInsights(collection, premiumPlan);

  if (loading) {
    return (
      <Card className="rounded-xl">
        <CardContent className="px-4">
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="rounded-xl">
        <CardContent className="px-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="text-lg">❌</div>
            <div className="text-sm font-medium text-red-400">
              Erro ao buscar insights
            </div>
          </div>
          <div className="text-sm text-red-300">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!insight && premiumPlan) {
    return (
      <Card className="rounded-xl">
        <CardContent className="px-4">
          <div className="text-sm text-gray-400">Nenhum insight disponível</div>
        </CardContent>
      </Card>
    );
  }

  if (!insight && !premiumPlan) {
    return (
      <Card className="rounded-xl py-4">
        <CardContent className="space-y-3 px-4">
          <div className="flex items-center gap-2 text-gray-200">
            <Crown size={16} />
            <span className="text-sm font-medium">
              Upgrade para o Plano Premium
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-300">
              Receba insights diários sobre as coleções.
            </p>
            <p className="text-sm text-gray-300">
              Ative o{" "}
              <Link href="/upgrade" className="gradient-underline text-white">
                Plano Premium
              </Link>{" "}
              para obter um resumo do mercardo para cada coleção utilizando IA.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insight) {
    return null;
  }

  return (
    <Card className="rounded-xl py-4">
      <CardContent className="space-y-3 px-4">
        <div className="text-sm leading-relaxed text-gray-200">
          {insight.insight}
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-gray-400">
            Gerado em:{" "}
            {new Date(insight.generatedAt).toLocaleString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
          <span className="text-xs text-gray-400">Insight gerado por IA</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightsCard;
