import "@/app/globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function PackageLayout({ children }) {
  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  );
}
