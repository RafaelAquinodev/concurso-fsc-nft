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
            <SelectItem value="est">algum numero</SelectItem>
            <SelectItem value="cst">outro numero</SelectItem>
            <SelectItem value="mst">outro numero denovo kkkk</SelectItem>
            <SelectItem value="pst">disgraca</SelectItem>
            <SelectItem value="akst">outra porra de outro numero</SelectItem>
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
