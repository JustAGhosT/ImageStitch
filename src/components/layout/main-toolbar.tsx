"use client"

import type React from "react"
import {
  FileText,
  FolderOpen,
  Save,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  Settings,
  HelpCircle,
  Download,
  Share2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { useAppStore } from "@/store/useAppStore"
import { cn } from "@/lib/utils"

interface MainToolbarProps {
  className?: string
}

export const MainToolbar: React.FC<MainToolbarProps> = ({ className }) => {
  const {
    ui: { zoom, showGrid },
    updateUI,
    undo,
    redo,
    history,
    clearImages,
    images,
  } = useAppStore()

  const handleZoomIn = () => {
    const newZoom = Math.min(400, zoom + 25)
    updateUI({ zoom: newZoom })
  }

  const handleZoomOut = () => {
    const newZoom = Math.max(25, zoom - 25)
    updateUI({ zoom: newZoom })
  }

  const handleZoomReset = () => {
    updateUI({ zoom: 100 })
  }

  const handleToggleGrid = () => {
    updateUI({ showGrid: !showGrid })
  }

  const canUndo = history.past.length > 0
  const canRedo = history.future.length > 0
  const hasImages = images.length > 0

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex items-center gap-1 px-4 py-2 bg-[#0B1120]/95 backdrop-blur-sm border-b border-[#00E5FF]/15",
          className,
        )}
      >
        {/* File Operations */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-[#00E5FF] p-2 h-8">
                <FileText className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>New Project (Ctrl+N)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-[#00E5FF] p-2 h-8">
                <FolderOpen className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Open Project (Ctrl+O)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-[#00E5FF] p-2 h-8"
                disabled={!hasImages}
              >
                <Save className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save Project (Ctrl+S)</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6 bg-[#00E5FF]/15" />

        {/* History Operations */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={undo}
                disabled={!canUndo}
                className={cn(
                  "p-2 h-8",
                  canUndo ? "text-gray-400 hover:text-[#00E5FF]" : "text-gray-600 cursor-not-allowed",
                )}
              >
                <Undo2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Undo (Ctrl+Z)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={redo}
                disabled={!canRedo}
                className={cn(
                  "p-2 h-8",
                  canRedo ? "text-gray-400 hover:text-[#00E5FF]" : "text-gray-600 cursor-not-allowed",
                )}
              >
                <Redo2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Redo (Ctrl+Y)</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6 bg-[#00E5FF]/15" />

        {/* View Controls */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 25}
                className="text-gray-400 hover:text-[#00E5FF] p-2 h-8"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom Out (-)</p>
            </TooltipContent>
          </Tooltip>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomReset}
            className="text-gray-400 hover:text-[#00E5FF] px-3 h-8 min-w-[60px] text-xs font-mono"
          >
            {zoom}%
          </Button>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 400}
                className="text-gray-400 hover:text-[#00E5FF] p-2 h-8"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom In (+)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleGrid}
                className={cn(
                  "p-2 h-8",
                  showGrid ? "text-[#00E5FF] bg-[#00E5FF]/10" : "text-gray-400 hover:text-[#00E5FF]",
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Grid (G)</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6 bg-[#00E5FF]/15" />

        {/* Export & Share */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-[#00E5FF] p-2 h-8"
                disabled={!hasImages}
              >
                <Download className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export (Ctrl+E)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-[#00E5FF] p-2 h-8"
                disabled={!hasImages}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share Project</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side controls */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-[#00E5FF] p-2 h-8">
                <Settings className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-[#00E5FF] p-2 h-8">
                <HelpCircle className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Help & Shortcuts (F1)</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
