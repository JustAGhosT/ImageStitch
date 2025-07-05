"use client"

import type React from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { CollapsibleSidebar } from "./collapsible-sidebar"
import { useAppStore } from "@/store/useAppStore"

export const ResponsiveSidebar: React.FC = () => {
  const { ui } = useAppStore()

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <CollapsibleSidebar />
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-[#00E5FF] p-2 h-8 w-8">
              <Menu className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0 bg-[#0B1120] border-[#00E5FF]/15">
            <CollapsibleSidebar className="border-r-0" />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
