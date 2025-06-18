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
import { Bell } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Header = () => {
  return (
    <header className="flex w-full items-center justify-between border-b p-4">
      <Select>
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
        <Avatar>
          <AvatarFallback>FSC</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Header;
