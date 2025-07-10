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
import { PlusIcon, TrashIcon, WalletIcon, Crown } from "lucide-react";
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
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

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

  const { user } = useUser();
  const {
    addCustomWallet,
    customWallets,
    removeCustomWallet,
    canAddMoreWallets,
  } = useWallet();

  const premiumPlan = user?.publicMetadata.subscriptionPlan === "premium";

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
      toast.error("Endereço e nome são obrigatórios");
      return;
    }

    if (!validateAddress(formData.address.trim())) {
      toast.error("Endereço inválido. Use um endereço Ethereum válido (0x...)");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = addCustomWallet({
        address: formData.address.trim(),
        name: formData.name.trim(),
        description: formData.description.trim() || formData.name.trim(),
      });

      if (result.success) {
        toast.success("Carteira adicionada com sucesso");
        setFormData({ address: "", name: "", description: "" });
      } else {
        toast.error(result.error || "Erro ao adicionar carteira");
      }
    } catch (error) {
      console.error("Erro ao adicionar carteira:", error);
      toast.error("Erro ao adicionar carteira");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveWallet = (address: string) => {
    try {
      removeCustomWallet(address);
      toast.success("Carteira removida com sucesso");
    } catch (error) {
      console.error("Erro ao remover carteira:", error);
      toast.error("Erro ao remover carteira");
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
      <DialogContent className="max-h-[90vh] overflow-y-auto p-4 sm:max-w-[600px] sm:p-6">
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

          {/* Aviso de limite Basic */}
          {!premiumPlan && !canAddMoreWallets && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <div className="flex items-center gap-2 text-amber-800">
                <Crown size={16} />
                <span className="text-sm font-medium">
                  Limite do Plano Basic atingido
                </span>
              </div>
              <p className="mt-1 text-sm text-amber-700">
                Você atingiu o limite de 2 carteiras monitoradas. Faça upgrade
                para o{" "}
                <Link href="/upgrade" className="underline">
                  Plano Premium
                </Link>{" "}
                para adicionar carteiras ilimitadas.
              </p>
            </div>
          )}

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
                  disabled={!canAddMoreWallets}
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
                  disabled={!canAddMoreWallets}
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
                  disabled={!canAddMoreWallets}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="submit"
                disabled={isSubmitting || !canAddMoreWallets}
              >
                {isSubmitting ? "Adicionando..." : "Adicionar"}
              </Button>
            </div>
          </form>
        </div>
        <Separator className="mt-4" />

        {/* Lista de Carteiras Próprias */}
        {customWallet && customWallet.length > 0 && (
          <div className="py-">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-medium">
              <WalletIcon size={16} />
              Suas carteiras ({customWallet.length}
              {!premiumPlan && "/2"})
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
