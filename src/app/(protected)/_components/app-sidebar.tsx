"use client";

import {
  ArrowRightLeft,
  LayoutDashboard,
  LockIcon,
  Palette,
  StarIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUser } from "@clerk/nextjs";
import {
  TooltipTrigger,
  TooltipContent,
  Tooltip,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  fontClass: string;
};

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "NFTs",
    url: "/nfts",
    icon: Palette,
  },
  {
    title: "Transações",
    url: "/transactions",
    icon: ArrowRightLeft,
  },
];

export function AppSidebar({ fontClass }: Props) {
  const pathname = usePathname();
  const { user } = useUser();
  const premiumPlan = user?.publicMetadata.subscriptionPlan === "premium";
  const { open, openMobile, setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    if (openMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      className="group w-64 border-[#34323f] transition-all duration-300 group-data-[collapsible=icon]:w-14"
    >
      <SidebarHeader className="flex min-h-[70px] items-center justify-center">
        {open || openMobile ? (
          <div className="ml-2 flex items-center gap-2 self-start">
            <Image src="/logo.svg" alt="Logo" width={32} height={32} />
            <div className="relative flex flex-col">
              <h2 className={`${fontClass} text-2xl`}>Etrics</h2>
              <span
                className={`${fontClass} absolute top-[22px] left-0 text-[10px]`}
              >
                NFT&apos;s
              </span>
            </div>
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
                    className="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:[&>span]:hidden [&>svg]:h-5 [&>svg]:w-5"
                  >
                    <Link href={item.url} onClick={handleLinkClick}>
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
                  className="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:[&>span]:hidden [&>svg]:h-5 [&>svg]:w-5"
                >
                  <Link href="/favorites" onClick={handleLinkClick}>
                    <StarIcon />
                    <span className="text-lg">Favoritos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenu>
            ) : (
              <SidebarMenu className="mt-2 group-data-[collapsible=icon]:mt-6 group-data-[collapsible=icon]:gap-6">
                {!openMobile ? (
                  <Tooltip>
                    <TooltipTrigger>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          size="lg"
                          asChild
                          isActive={pathname === "/favorites"}
                          className="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:[&>span]:hidden [&>svg]:h-5 [&>svg]:w-5"
                        >
                          <div className="opacity-50 transition-opacity duration-200">
                            <StarIcon />
                            <span className="text-lg">Favoritos</span>
                            <SidebarMenuBadge className="">
                              <LockIcon size={12} className="mr-4" />
                            </SidebarMenuBadge>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="">Disponível apenas no plano Premium</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Popover>
                    <PopoverTrigger>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          size="lg"
                          asChild
                          isActive={pathname === "/favorites"}
                          className="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:[&>span]:hidden [&>svg]:h-5 [&>svg]:w-5"
                        >
                          <div className="opacity-50 transition-opacity duration-200">
                            <StarIcon />
                            <span className="text-lg">Favoritos</span>
                            <SidebarMenuBadge className="">
                              <LockIcon size={12} className="mr-4" />
                            </SidebarMenuBadge>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </PopoverTrigger>
                    <PopoverContent
                      side="bottom"
                      className="bg-brand-accent-muted mx-auto max-w-4/5 p-2"
                    >
                      <p className="text-center text-xs">
                        Disponível apenas no{" "}
                        <span className="gradient-underline">
                          Plano Premium
                        </span>
                      </p>
                    </PopoverContent>
                  </Popover>
                )}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {!premiumPlan && (
        <SidebarFooter>
          {open || openMobile ? (
            <div className="mt-auto px-4 py-6">
              <div className="bg-secondary rounded-xl border border-gray-600 p-4">
                <h3 className="text-sm font-medium text-white">
                  Upgrade para Premium
                </h3>
                <p className="mt-1 text-xs text-gray-300">
                  Monitore carteiras ilimitadas, favorite NFTs e obtenha
                  insights de IA sobre as coleções em alta.
                </p>
                <Link href="/upgrade" onClick={handleLinkClick}>
                  <button className="gradient-brand mt-3 w-full cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:shadow-[0_0_8px_rgba(255,0,204,0.6)]">
                    Upgrade Now
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
