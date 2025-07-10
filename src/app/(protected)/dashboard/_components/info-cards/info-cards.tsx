import React from "react";
import InfoCard from "./info-card";
import { useWalletStats } from "@/hooks/use-wallet-stats";
import { useWallet } from "@/context/wallet-context";
import {
  ActivityIcon,
  BoxesIcon,
  Layers2Icon,
  WalletMinimalIcon,
} from "lucide-react";
import { useWalletValue } from "@/hooks/use-wallet-value";
import { useSidebar } from "@/components/ui/sidebar";

const InfoCards = () => {
  const { open } = useSidebar();
  const { walletAddress } = useWallet();
  const { stats } = useWalletStats({
    address: walletAddress,
  });
  const { value } = useWalletValue({
    address: walletAddress,
  });

  const estimatedValueUSDFormatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parseFloat(value?.estimatedValueUSD || "0"));

  const infos = [
    {
      name: "Total NFTs",
      value: stats?.nfts || "0",
      icon: <Layers2Icon />,
      gradient: "from-yellow-500 to-amber-400",
    },
    {
      name: "Total Collections",
      value: stats?.collections || "0",
      icon: <BoxesIcon />,
      gradient: "from-pink-500 to-red-400",
    },
    {
      name: "Valor da Carteira",
      value: estimatedValueUSDFormatted || "0",
      icon: <WalletMinimalIcon />,
      gradient: "from-green-600 to-emerald-400",
    },
    {
      name: "Valor em ETH",
      value: value?.estimatedValueETH || "0",
      icon: <ActivityIcon />,
      gradient: "from-purple-600 to-indigo-400",
    },
  ];

  return (
    <>
      {open ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 min-[1100px]:max-[1380px]:grid-cols-2">
          {infos.map((info) => (
            <InfoCard
              key={info.name}
              name={info.name}
              value={info.value}
              icon={info.icon}
              gradient={info.gradient}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 min-[910px]:max-[1180px]:grid-cols-2">
          {infos.map((info) => (
            <InfoCard
              key={info.name}
              name={info.name}
              value={info.value}
              icon={info.icon}
              gradient={info.gradient}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default InfoCards;
