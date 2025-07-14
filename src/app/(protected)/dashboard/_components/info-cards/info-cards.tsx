import { useMemo } from "react";
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
    enabled: !!walletAddress,
  });

  const { value } = useWalletValue({
    address: walletAddress,
    enabled: !!walletAddress,
  });

  const estimatedValueUSDFormatted = useMemo(() => {
    if (!value?.estimatedValueUSD) return "$0.00";

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(value.estimatedValueUSD));
  }, [value?.estimatedValueUSD]);

  const estimatedValueETHFormatted = useMemo(() => {
    if (!value?.estimatedValueETH) return "0.0000 ETH";
    return `${value.estimatedValueETH} ETH`;
  }, [value?.estimatedValueETH]);

  const infos = useMemo(
    () => [
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
        value: estimatedValueUSDFormatted,
        icon: <WalletMinimalIcon />,
        gradient: "from-green-600 to-emerald-400",
      },
      {
        name: "Valor em ETH",
        value: estimatedValueETHFormatted,
        icon: <ActivityIcon />,
        gradient: "from-purple-600 to-indigo-400",
      },
    ],
    [
      stats?.nfts,
      stats?.collections,
      estimatedValueUSDFormatted,
      estimatedValueETHFormatted,
    ],
  );

  const getGridClasses = (isOpen: boolean) => {
    const baseClasses =
      "grid gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]";

    if (isOpen) {
      return `${baseClasses} min-[1100px]:max-[1380px]:grid-cols-2`;
    } else {
      return `${baseClasses} min-[910px]:max-[1180px]:grid-cols-2`;
    }
  };

  return (
    <div className={getGridClasses(open)}>
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
