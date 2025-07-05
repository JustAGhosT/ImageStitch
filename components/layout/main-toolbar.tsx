"use client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  FolderOpen,
  Save,
  Download,
  Share2,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize,
  Grid,
  Eye,
  Settings,
  HelpCircle,
  Keyboard,
} from "lucide-react"
import { useAppStore } from "@/src/store/useAppStore"

export function MainToolbar() {
  const { zoom, setZoom, canUndo, canRedo, undo, redo, viewMode, setViewMode, showGrid, setShowGrid, images } =
    useAppStore()

  const handleZoomIn = () => {
    setZoom(Math.min(zoom * 1.2, 5))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom / 1.2, 0.1))
  }

  const handleZoomReset = () => {
    setZoom(1)
  }

  const handleFitToScreen = () => {
    setZoom(0.8) // Approximate fit
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Left Section - File Operations */}
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm">
            <FileText className="h-4 w-4 mr-1" />
            New
          </Button>
          <Button variant="ghost" size="sm">
            <FolderOpen className="h-4 w-4 mr-1" />
            Open
          </Button>
          <Button variant="ghost" size="sm" disabled={images.length === 0}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button variant="ghost" size="sm" disabled={images.length === 0}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button variant="ghost" size="sm" disabled={images.length === 0}>
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>

        {/* Center Section - History & Zoom */}
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" disabled={!canUndo} onClick={undo}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Undo
          </Button>
          <Button variant="ghost" size="sm" disabled={!canRedo} onClick={redo}>
            <RotateCw className="h-4 w-4 mr-1" />
            Redo
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button variant="ghost" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>

          <div className="flex items-center space-x-2 px-2">
            <Badge variant="outline" className="text-xs font-mono">
              {Math.round(zoom * 100)}%
            </Badge>
          </div>

          <Button variant="ghost" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm" onClick={handleZoomReset}>
            1:1
          </Button>

          <Button variant="ghost" size="sm" onClick={handleFitToScreen}>
            <Maximize className="h-4 w-4" />
          </Button>
        </div>

        {/* Right Section - View Options */}
        <div className="flex items-center space-x-1">
          <Button variant={showGrid ? "default" : "ghost"} size="sm" onClick={() => setShowGrid(!showGrid)}>
            <Grid className="h-4 w-4 mr-1" />
            Grid
          </Button>

          <Button
            variant={viewMode === "split" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode(viewMode === "split" ? "single" : "split")}
          >
            <Eye className="h-4 w-4 mr-1" />
            {viewMode === "split" ? "Split" : "Single"}
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button variant="ghost" size="sm">
            <Keyboard className="h-4 w-4 mr-1" />
            Shortcuts
          </Button>

          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </Button>

          <Button variant="ghost" size="sm">
            <HelpCircle className="h-4 w-4 mr-1" />
            Help
          </Button>
        </div>
      </div>
    </div>
  )
}
