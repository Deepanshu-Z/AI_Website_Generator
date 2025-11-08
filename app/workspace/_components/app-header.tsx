import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";

export default function AppHeader() {
  return (
    <div className="flex items-center p-4 shadow w-full justify-between">
      <SidebarTrigger />
      <UserButton />
    </div>
  );
}
