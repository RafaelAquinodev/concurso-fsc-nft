import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import Image from "next/image";

const NftCard = () => {
  return (
    <div className="bg-black w-[200px] h-[280px] rounded-md" style={{ boxShadow: "0px 5px 0px 0px #b22ecd" }}>
      <Skeleton className="h-[190px] w-full" /> {/* No lugar do skeleton só colocar o component Image (manter as classes)*/}
      <div className="p-3 flex flex-col justify-between h-[90px]">
        <div className="flex justify-between">
          <span className="font-semibold">Crippled world</span>
          <Heart size={16} className="text-primary"/>
        </div>

        <div className="flex justify-between">
          <p className="text-chart-1 text-xs">Para venda</p>
          <div className="flex items-center">
            <Image src="/ether.svg" alt="etherIcon" width={20} height={20} />
            <span className="text-sm text-muted-foreground">0.98</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NftCard;