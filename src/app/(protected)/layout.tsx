import { SidebarProvider } from "@/components/ui/sidebar";

import { AppSidebar } from "./_components/app-sidebar";
import Header from "./_components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
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
    <div className="fixed top-0 left-[255px] right-0 z-40 bg-background border-l">
      <Header />
    </div>
  );
}
