"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/wallet-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlusIcon, TrashIcon, WalletIcon } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AddWalletModalProps {
  children?: React.ReactNode;
}

export const AddWalletModal = ({ children }: AddWalletModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    name: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addCustomWallet, customWallets, removeCustomWallet } = useWallet();

  const customWallet = customWallets.filter((wallet) => {
    return (
      !wallet.address.startsWith("preset_") ||
      wallet.description.includes("Carteira customizada")
    );
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateAddress = (address: string): boolean => {
    const ethRegex = /^0x[a-fA-F0-9]{40}$/;
    return ethRegex.test(address);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.address.trim() || !formData.name.trim()) {
      toast("Endereço e nome são obrigatórios");
      return;
    }

    if (!validateAddress(formData.address.trim())) {
      toast("Endereço inválido. Use um endereço Ethereum válido (0x...)");
      return;
    }

    setIsSubmitting(true);

    try {
      const success = addCustomWallet({
        address: formData.address.trim(),
        name: formData.name.trim(),
        description: formData.description.trim() || formData.name.trim(),
      });

      if (success) {
        toast("Carteira adicionada com sucesso");
        setFormData({ address: "", name: "", description: "" });
      } else {
        toast("Este endereço já existe na lista");
      }
    } catch (error) {
      toast(
        "Erro ao adicionar carteira",
        (error && error) || "Erro desconhecido",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveWallet = (address: string) => {
    try {
      removeCustomWallet(address);
      toast("Carteira removida com sucesso");
    } catch (error) {
      toast(
        "Erro ao remover carteira",
        (error && error) || "Erro desconhecido",
      );
    }
  };

  const handleClose = () => {
    setFormData({ address: "", name: "", description: "" });
    setOpen(false);
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <PlusIcon width={16} />
            Gerenciar Carteiras
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="h-full max-h-[80vh] overflow-y-auto p-4 sm:max-w-[600px] sm:p-6">
        <DialogHeader>
          <DialogTitle>Gerenciar Carteiras</DialogTitle>
          <DialogDescription>
            Adicione novas carteiras ou gerencie suas carteiras.
          </DialogDescription>
        </DialogHeader>

        {/* Formulário para Adicionar Nova Carteira */}
        <div>
          <h3 className="mb-3 flex items-center gap-1 text-sm font-medium">
            <PlusIcon size={16} />
            Adicionar nova carteira
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Endereço *
                </Label>
                <Input
                  id="address"
                  placeholder="0x..."
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome *
                </Label>
                <Input
                  id="name"
                  placeholder="Minha Carteira"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Descrição
                </Label>
                <Textarea
                  id="description"
                  placeholder="Descrição opcional..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="col-span-3"
                  rows={3}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adicionando..." : "Adicionar"}
              </Button>
            </div>
          </form>
        </div>
        <Separator className="mt-4" />

        {/* Lista de Carteiras Customizadas */}
        {customWallet && customWallet.length > 0 && (
          <div className="py-">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-medium">
              <WalletIcon size={16} />
              Suas carteiras ({customWallet.length})
            </h3>
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {customWallet.map((wallet) => (
                <div
                  key={wallet.address}
                  className="bg-muted/50 flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{wallet.name}</span>
                      <code className="bg-muted rounded px-2 py-1 font-mono text-xs">
                        {truncateAddress(wallet.address)}
                      </code>
                    </div>
                    {wallet.description && (
                      <p className="text-muted-foreground mt-1 truncate text-xs">
                        {wallet.description}
                      </p>
                    )}
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <TrashIcon size={14} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover Carteira</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza de que deseja remover a carteira? Esta
                          ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRemoveWallet(wallet.address)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Remover
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
