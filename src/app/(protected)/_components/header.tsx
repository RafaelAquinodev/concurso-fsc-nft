"use client";

import { Avatar } from "@/components/ui/avatar";
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
import { PlusIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useWallet } from "@/context/wallet-context";
import { AddWalletModal } from "./add-wallet-modal";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  const { walletAddress, setWalletAddress, allWallets } = useWallet();

  const defaultWallets = allWallets.filter((wallet) =>
    walletCatalog.some(
      (catalogWallet) => catalogWallet.address === wallet.address,
    ),
  );
  const customWallets = allWallets.filter(
    (wallet) =>
      !walletCatalog.some(
        (catalogWallet) => catalogWallet.address === wallet.address,
      ),
  );

  return (
    <header className="flex w-full items-center justify-between gap-2 border-b p-4">
      <div>
        {!["/favorites", "/upgrade"].includes(pathname) && (
          <div className="flex items-center gap-2">
            <Select value={walletAddress} onValueChange={setWalletAddress}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Selecione uma carteira" />
              </SelectTrigger>
              <SelectContent>
                {/* Carteiras customizadas */}
                {customWallets.length > 0 && (
                  <SelectGroup>
                    <SelectLabel>Minhas Carteiras</SelectLabel>
                    {customWallets.map((wallet) => (
                      <Tooltip key={wallet.address}>
                        <TooltipTrigger asChild>
                          <SelectItem value={wallet.address}>
                            <div className="flex w-full items-center justify-between">
                              <span>{wallet.name}</span>
                            </div>
                          </SelectItem>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <div className="space-y-1">
                            <div className="text-sm text-gray-500">
                              {wallet.description}
                            </div>
                            <div className="hidden font-mono text-xs text-gray-400 md:block">
                              {wallet.address}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </SelectGroup>
                )}

                {/* Carteiras padrão */}
                <SelectGroup>
                  <SelectLabel>Carteiras Padrão</SelectLabel>
                  {defaultWallets.map((wallet) => (
                    <Tooltip key={wallet.address}>
                      <TooltipTrigger asChild>
                        <SelectItem value={wallet.address}>
                          {wallet.name}
                        </SelectItem>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-500">
                            {wallet.description}
                          </div>
                          <div className="hidden font-mono text-xs text-gray-400 md:block">
                            {wallet.address}
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Tooltip>
              <AddWalletModal>
                <TooltipTrigger asChild>
                  <Button className="flex items-center gap-2 rounded-lg bg-purple-600 px-2 py-1 text-white transition-colors hover:bg-purple-700">
                    <PlusIcon width={20} />
                  </Button>
                </TooltipTrigger>
              </AddWalletModal>
              <TooltipContent side="right">
                <div className="text-sm text-gray-500">
                  Adicionar nova carteira
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
      <Avatar>
        <UserButton />
      </Avatar>
    </header>
  );
};

export default Header;
