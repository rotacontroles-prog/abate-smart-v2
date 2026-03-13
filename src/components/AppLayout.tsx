import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import { Toaster } from "@/components/ui/sonner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background font-sans">
        <AppSidebar />
        <main className="flex-1 p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </SidebarProvider>
  );
}
