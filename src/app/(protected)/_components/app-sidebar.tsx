"use client";

import {
  ArrowRightLeft,
  Heart,
  LayoutDashboard,
  Palette,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/nextjs";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "NFT's",
    url: "/nfts",
    icon: Palette,
  },
  {
    title: "Transaçoes",
    url: "/transactions",
    icon: ArrowRightLeft,
  },
  // {
  //   title: "Favoritos",
  //   url: "/favorites",
  //   icon: Heart,
  // },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const premiumPlan = user?.publicMetadata.subscriptionPlan === "premium";

  return (
    <Sidebar className="bg-sidebar fixed h-screen border-r" collapsible="none">
      <SidebarHeader className="flex justify-center p-4">
        <Image src="/logo.svg" alt="FSC" width={40} height={40} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            {premiumPlan ? (
              <SidebarMenuButton asChild isActive={pathname === "/favorites"}>
                <Link href="/favorites">
                  <Heart />
                  <span>Favoritos</span>
                </Link>
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton asChild isActive={pathname === "/favorites"}>
                {/* Aqui, trocar Link por span para desabilitar o clique */}
                <span style={{ cursor: "not-allowed", opacity: 0.5 }}>
                  <Heart />
                  <span>Favoritos</span>
                </span>
              </SidebarMenuButton>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/upgrade"}>
                  <Link href="/upgrade">
                    <Trophy color="#878036" />
                    <span>Upgrade</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
