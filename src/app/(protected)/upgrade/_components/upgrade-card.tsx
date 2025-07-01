import { CircleCheckIcon } from "lucide-react";
import AcquirePlanButton from "./acquire-plan-button";

const freeItems = [
  {
    text: "Até 2 carteiras monitoradas",
  },
  {
    text: "Histórico recente de transações",
  },
];

const premiumItems = [
  {
    text: "Monitorar carteiras ilimitadas",
  },
  {
    text: "Histórico recente de transações",
  },
  {
    text: "Favoritar NFTs",
  },
];

const UpgradePlan = () => {
  return (
    <div className="flex h-full w-full max-w-4xl items-center justify-center">
      <div className="grid h-full grid-cols-1 grid-rows-[2fr,1fr] gap-8 sm:grid-cols-2">
        {/* Basic */}
        <div className="bg-brand-indigo row-span-1 h-full max-w-[250px] space-y-6 rounded-xl p-6 max-sm:order-2">
          <div className="flex flex-col items-center">
            <p className="text-3xl font-bold text-gray-100">Basic</p>
          </div>

          <div className="flex flex-col gap-4">
            {freeItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="h-5 w-5">
                  <CircleCheckIcon size={20} className="text-green-400" />
                </div>
                <p>{item.text}</p>
              </div>
            ))}
          </div>

          <div className="bg-brand-accent-muted flex justify-center rounded-lg p-4">
            <p className="opacity-60">Plano Ativo</p>
          </div>
        </div>

        {/* Premium */}
        <div className="bg-brand-indigo row-span-2 h-full w-full max-w-[250px] space-y-6 rounded-xl p-6">
          <div className="flex flex-col items-center">
            <p className="text-3xl font-bold text-gray-100">Premium</p>
          </div>

          <div className="flex flex-col gap-4">
            {premiumItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="h-5 w-5">
                  <CircleCheckIcon size={20} className="text-green-400" />
                </div>
                <p>{item.text}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-2">
            <p className="text-center font-bold text-gray-100">Apenas 19,90</p>
            <AcquirePlanButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePlan;
