"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import Header from "./_components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <SidebarProvider open={true} className="overflow-hidden">
      <AppSidebar />

      <div className="ml-[240px] w-full">
        <HeaderWrapper />
        <main className="pt-[64px]">{children}</main>
      </div>
    </SidebarProvider>
  );
}

function HeaderWrapper() {
  return (
    <div className="bg-background fixed top-0 right-0 left-[255px] z-40 border-l">
      <Header />
    </div>
  );
}
