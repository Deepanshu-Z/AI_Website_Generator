import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./_components/app-sidebar";
import AppHeader from "./_components/app-header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col w-full">
        <AppHeader />
        <main className="flex-1">
          <div className="w-full">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
