"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { UserButton } from "@clerk/nextjs";
import { walletCatalog } from "@/data/wallet-catalog";
import { Bell } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useWallet } from "@/context/wallet-context";

const Header = () => {
  const { walletAddress, setWalletAddress } = useWallet();

  return (
    <header className="flex w-full items-center justify-between border-b p-4">
      <Select value={walletAddress} onValueChange={setWalletAddress}>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Selecione uma carteira" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Opções de carteiras</SelectLabel>
            {walletCatalog.map((wallet) => (
              <Tooltip key={wallet.address}>
                <TooltipTrigger asChild>
                  <SelectItem value={wallet.address}>{wallet.name}</SelectItem>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <div className="text-sm text-gray-500">
                    {wallet.description}
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="flex items-center gap-5">
        <Bell strokeWidth={1.5} width={18} />
        {/* <Avatar className="items center flex h-full justify-center"> */}
        <Avatar>
          <UserButton />
        </Avatar>
      </div>
    </header>
  );
};

export default Header;
