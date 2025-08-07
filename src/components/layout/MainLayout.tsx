import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SiemSidebar } from "./SiemSidebar";
import { TopNavBar } from "./TopNavBar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <SiemSidebar />
        <div className="flex-1 flex flex-col">
          <TopNavBar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}