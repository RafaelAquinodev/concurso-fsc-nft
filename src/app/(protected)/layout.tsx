import { SidebarProvider } from "@/components/ui/sidebar";

import { AppSidebar } from "./_components/app-sidebar";
import Header from "./_components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider open={true} className="overflow-hidden">
      <AppSidebar />
      <main className="w-full">
        <Header />
        {children}
      </main>
    </SidebarProvider>
  );
}
