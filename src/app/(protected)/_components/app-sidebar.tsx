"use client";

import {
  ArrowRightLeft,
  LayoutDashboard,
  Palette,
  StarIcon,
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
  useSidebar,
} from "@/components/ui/sidebar";
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
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const premiumPlan = user?.publicMetadata.subscriptionPlan === "premium";
  const { open } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      className="group w-64 transition-all duration-300 group-data-[collapsible=icon]:w-14"
    >
      <SidebarHeader className="flex min-h-[70px] items-center justify-center">
        {open ? (
          <div className="flex items-center gap-4">
            <Image src="/logo.svg" alt="Logo" width={32} height={32} />
            <h2 className="gradient-underline text-xl font-semibold">
              NFTMetrics
            </h2>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Image src="/logo.svg" alt="Logo" width={22} height={22} />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent className="group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:items-center">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 group-data-[collapsible=icon]:mt-2 group-data-[collapsible=icon]:gap-6">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    size="lg"
                    asChild
                    isActive={pathname === item.url}
                    className="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:[&>span]:hidden [&>svg]:h-6 [&>svg]:w-6"
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span className="text-lg">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            {premiumPlan ? (
              <SidebarMenu className="mt-2 group-data-[collapsible=icon]:mt-6 group-data-[collapsible=icon]:gap-6">
                <SidebarMenuButton
                  size="lg"
                  asChild
                  isActive={pathname === "/favorites"}
                  className="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:[&>span]:hidden [&>svg]:h-6 [&>svg]:w-6"
                >
                  <Link href="/favorites">
                    <StarIcon />
                    <span className="text-lg">Favoritos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenu>
            ) : (
              <SidebarMenu className="mt-2 group-data-[collapsible=icon]:mt-6 group-data-[collapsible=icon]:gap-6">
                <SidebarMenuButton
                  size="lg"
                  asChild
                  isActive={pathname === "/favorites"}
                  className="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:[&>span]:hidden [&>svg]:h-6 [&>svg]:w-6"
                >
                  <span className="opacity-5">
                    <StarIcon />
                    <span>Favoritos</span>
                  </span>
                </SidebarMenuButton>
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
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
