'use client'
export const dynamic = "force-dynamic";

import AppSidebar from "@/components/FrontendComponents/admin/sidebar/page"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useState, useEffect } from "react"
import { SidebarProvider } from "@/components/ui/sidebar" // ✅ Ensure path is correct

export default function AdminLayout({ children }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <>
      {isMobile ? (
        <Sheet>
          <div className="p-4 flex items-center gap-2 bg-black text-white">
            <SheetTrigger>
              <Menu />
            </SheetTrigger>
            <span className="font-semibold">Admin Panel</span>
          </div>
          <SheetContent
            side="left"
            className="w-[250px] max-w-full p-0 overflow-y-auto h-full"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Sidebar</SheetTitle>
            </SheetHeader>
            
            {/* ✅ SidebarProvider moved inside for mobile */}
            <SidebarProvider>
              <AppSidebar />
            </SidebarProvider>
          </SheetContent>

          <main className="p-4">{children}</main>
        </Sheet>
      ) : (
        <SidebarProvider>
          <div className="flex min-h-screen">
            <aside className="w-[250px] bg-black text-white">
              <AppSidebar />
            </aside>
            <main className="flex-1 p-4">{children}</main>
          </div>
        </SidebarProvider>
      )}
    </>
  )
}
