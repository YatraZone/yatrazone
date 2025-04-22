import '@/app/globals.css'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

export const metadata = {
    title: "Admin Dashboard",
}

export default function RootLayout({
    children,
}) {
    return (
        <>
            <SidebarProvider className="!font-barlow">
                <AppSidebar className="py-12 bg-blue-100" />
                {children}
            </SidebarProvider>
        </>
    )
}

