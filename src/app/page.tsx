"use client"
import { CollapsibleSidebar } from "@/components/layout/collapsible-sidebar"
import { MainToolbar } from "@/components/layout/main-toolbar"
import { DockableToolbar } from "@/components/features/dockable-toolbar/dockable-toolbar"
import { CanvasRenderer } from "@/components/features/canvas/canvas-renderer"
import { StatusBar } from "@/components/layout/status-bar"

export default function ImageCompareProPage() {
  return (
    <div className="h-screen flex flex-col bg-[#0B1120] text-white overflow-hidden">
      {/* Main Toolbar */}
      <MainToolbar />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Sidebar */}
        <CollapsibleSidebar />

        {/* Canvas Area */}
        <div className="flex-1 relative">
          <CanvasRenderer />
          <DockableToolbar />
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar />
    </div>
  )
}
