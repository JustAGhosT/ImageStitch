"use client"
import { CollapsibleSidebar } from "@/components/layout/collapsible-sidebar"
import { MainToolbar } from "@/components/layout/main-toolbar"
import { DockableToolbar } from "@/components/features/dockable-toolbar/dockable-toolbar"
import { CanvasRenderer } from "@/components/features/canvas/canvas-renderer"
import { StatusBar } from "@/components/layout/status-bar"
import { useKeyboardShortcuts } from "@/src/hooks/useKeyboardShortcuts"

export default function ImageComparePage() {
  // Initialize keyboard shortcuts
  useKeyboardShortcuts()

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Main Toolbar */}
      <MainToolbar />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Sidebar */}
        <CollapsibleSidebar />

        {/* Canvas Area */}
        <div className="flex-1 relative">
          <CanvasRenderer />

          {/* Dockable Toolbar */}
          <DockableToolbar />
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar />
    </div>
  )
}
