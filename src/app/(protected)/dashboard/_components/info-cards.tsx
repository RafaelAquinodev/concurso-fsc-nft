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

const InfoCards = () => {
  const { walletAddress } = useWallet();
  const { stats } = useWalletStats({
    address: walletAddress,
  });

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
      value: "$3,000.00",
      icon: <WalletMinimalIcon />,
      gradient: "from-green-600 to-emerald-400",
    },
    {
      name: "Valor em ETH",
      value: "150",
      icon: <ActivityIcon />,
      gradient: "from-purple-600 to-indigo-400",
    },
  ];

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
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
  );
};

export default InfoCards;
