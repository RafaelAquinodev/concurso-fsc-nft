import { Progress } from "@/components/ui/progress";

export function WalletRoiChart({ roiPercentage }: { roiPercentage: number }) {
  const percentage = Math.min(Math.abs(roiPercentage), 100);

  return (
    <div className="w-[50%] max-w-[500px] min-w-[260px] space-y-2">
      <div className="text-center text-lg font-bold">
        {roiPercentage.toFixed(2)}%
      </div>
      <Progress
        value={percentage}
        className={roiPercentage >= 0 ? "bg-green-400" : "bg-red-400"}
      />
      <div className="flex items-center justify-center gap-1 text-center text-sm">
        <p className="font-medium text-white">ROI</p>
        <span className="text-gray-300">Retorno sobre o Investimento</span>
      </div>
    </div>
  );
}
