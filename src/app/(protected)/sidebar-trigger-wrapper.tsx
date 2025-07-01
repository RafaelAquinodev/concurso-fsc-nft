import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import React from "react";

const SidebarTriggerWrapper = () => {
  const { isMobile } = useSidebar();

  return (
    <>
      {isMobile && (
        <div className="bg-brand-accent-muted fixed right-6 bottom-8 z-50 rounded-full p-2 shadow">
          <SidebarTrigger />
        </div>
      )}
    </>
  );
};

export default SidebarTriggerWrapper;
