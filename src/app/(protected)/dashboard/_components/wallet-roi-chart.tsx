import { Progress } from "@/components/ui/progress";

export function WalletRoiChart({ roiPercentage }: { roiPercentage: number }) {
  const percentage = Math.min(Math.abs(roiPercentage), 100);

  return (
    <div className="space-y-2">
      <div className="text-muted-foreground text-center text-sm font-medium">
        ROI
      </div>
      <Progress
        value={percentage}
        className={roiPercentage >= 0 ? "bg-green-400" : "bg-red-400"}
      />
      <div className="text-center text-lg font-bold">
        {roiPercentage.toFixed(2)}%
      </div>
    </div>
  );
}
