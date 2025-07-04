"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import {
  Upload,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Download,
  Grid3X3,
  Square,
  Circle,
  Brush,
  Move,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type ComparisonMode = "overlay" | "split" | "slider"
type DrawingTool = "rectangle" | "ellipse" | "brush" | "move"

export default function ImageComparePro() {
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>("overlay")
  const [showGrid, setShowGrid] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [selectedTool, setSelectedTool] = useState<DrawingTool>("move")
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [images, setImages] = useState<{ left?: string; right?: string }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (files && files.length > 0) {
        const file = files[0]
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          if (!images.left) {
            setImages((prev) => ({ ...prev, left: result }))
          } else {
            setImages((prev) => ({ ...prev, right: result }))
          }
        }
        reader.readAsDataURL(file)
      }
    },
    [images.left],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const files = e.dataTransfer.files
      if (files.length > 0) {
        const file = files[0]
        if (file.type.startsWith("image/")) {
          const reader = new FileReader()
          reader.onload = (event) => {
            const result = event.target?.result as string
            if (!images.left) {
              setImages((prev) => ({ ...prev, left: result }))
            } else {
              setImages((prev) => ({ ...prev, right: result }))
            }
          }
          reader.readAsDataURL(file)
        }
      }
    },
    [images.left],
  )

  const getCursorStyle = () => {
    switch (selectedTool) {
      case "move":
        return "cursor-grab active:cursor-grabbing"
      case "brush":
        return "cursor-crosshair"
      case "rectangle":
      case "ellipse":
        return "cursor-crosshair"
      default:
        return "cursor-default"
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        // Undo functionality
      } else if ((e.ctrlKey || e.metaKey) && e.key === "z" && e.shiftKey) {
        e.preventDefault()
        // Redo functionality
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <TooltipProvider>
      <div className="h-screen bg-gradient-to-br from-[#0B1120] to-[#101828] text-white flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-[#0B1120]/80 border-r border-[#00E5FF]/15 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-[#00E5FF]/15">
            <h1 className="text-xl font-semibold tracking-wide text-[#00E5FF]">ImageCompare Pro</h1>
            <p className="text-sm text-gray-400 mt-1">Professional Image Comparison</p>
          </div>

          {/* Upload Section */}
          <div className="p-6 border-b border-[#00E5FF]/15">
            <h3 className="text-sm font-medium text-gray-300 mb-4 uppercase tracking-wider">Upload Images (2-6)</h3>
            <div
              className="border-2 border-dashed border-[#00E5FF]/25 rounded-lg p-6 text-center hover:border-[#00E5FF]/40 transition-colors cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 mx-auto mb-3 text-[#00E5FF]/60" />
              <p className="text-sm text-gray-400 mb-1">Drag & drop images or click to browse</p>
              <p className="text-xs text-gray-500">PNG, JPG, WebP up to 10MB each</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Comparison Mode */}
          <div className="p-6 border-b border-[#00E5FF]/15">
            <h3 className="text-sm font-medium text-gray-300 mb-4 uppercase tracking-wider">Comparison Mode</h3>
            <div className="flex rounded-lg bg-[#101828] p-1">
              {(["overlay", "split", "slider"] as ComparisonMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setComparisonMode(mode)}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all capitalize ${
                    comparisonMode === mode
                      ? "bg-[#00E5FF]/20 text-[#00E5FF] shadow-lg shadow-[#00E5FF]/10"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Drawing Tools */}
          <div className="p-6 border-b border-[#00E5FF]/15">
            <h3 className="text-sm font-medium text-gray-300 mb-4 uppercase tracking-wider">Drawing Tools</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { tool: "rectangle" as DrawingTool, icon: Square, label: "Rectangle" },
                { tool: "ellipse" as DrawingTool, icon: Circle, label: "Ellipse" },
                { tool: "brush" as DrawingTool, icon: Brush, label: "Brush" },
                { tool: "move" as DrawingTool, icon: Move, label: "Move" },
              ].map(({ tool, icon: Icon, label }) => (
                <Tooltip key={tool}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setSelectedTool(tool)}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedTool === tool
                          ? "bg-[#00E5FF]/20 border-[#00E5FF]/40 text-[#00E5FF]"
                          : "bg-[#101828] border-[#00E5FF]/15 text-gray-400 hover:text-gray-300 hover:border-[#00E5FF]/25"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            {/* Stroke Width */}
            <div className="space-y-3">
              <label className="text-xs text-gray-400 uppercase tracking-wider">Stroke Width</label>
              <Slider
                value={[strokeWidth]}
                onValueChange={(value) => setStrokeWidth(value[0])}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1px</span>
                <span>{strokeWidth}px</span>
                <span>10px</span>
              </div>
            </div>

            {/* Color Picker */}
            <div className="mt-4">
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Color</label>
              <div className="w-8 h-8 rounded-lg bg-[#00E5FF] border border-[#00E5FF]/40 cursor-pointer"></div>
            </div>
          </div>

          {/* Export */}
          <div className="p-6 mt-auto">
            <Button className="w-full bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 text-[#00E5FF] border border-[#00E5FF]/40">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-[#0B1120]/60 border-b border-[#00E5FF]/15 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-[#00E5FF]">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Undo (Ctrl+Z)</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-[#00E5FF]">
                      <RotateCw className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Redo (Ctrl+Shift+Z)</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <Separator orientation="vertical" className="h-6 bg-[#00E5FF]/15" />

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setZoom(Math.max(25, zoom - 25))}
                  className="text-gray-400 hover:text-[#00E5FF]"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-400 min-w-[60px] text-center">{zoom}%</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setZoom(Math.min(400, zoom + 25))}
                  className="text-gray-400 hover:text-[#00E5FF]"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6 bg-[#00E5FF]/15" />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
                className={`${showGrid ? "text-[#00E5FF]" : "text-gray-400"} hover:text-[#00E5FF]`}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-sm text-gray-400">Agent will use this as a design reference</div>
          </div>

          {/* Canvas */}
          <div className="flex-1 relative overflow-hidden">
            <div
              className={`w-full h-full flex items-center justify-center ${getCursorStyle()}`}
              style={{
                backgroundImage: showGrid ? `radial-gradient(circle, #00E5FF20 1px, transparent 1px)` : "none",
                backgroundSize: showGrid ? "20px 20px" : "auto",
              }}
            >
              {!images.left && !images.right ? (
                <div className="text-center text-gray-500">
                  <Upload className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg mb-2">Upload images to start comparing</p>
                  <p className="text-sm">Drag and drop or click the upload area</p>
                </div>
              ) : (
                <div className="relative max-w-4xl max-h-full">
                  <canvas
                    ref={canvasRef}
                    className="border border-[#00E5FF]/25 rounded-lg shadow-2xl shadow-[#00E5FF]/5"
                    style={{ transform: `scale(${zoom / 100})` }}
                  />
                  {images.left && (
                    <img
                      src={images.left || "/placeholder.svg"}
                      alt="Comparison"
                      className="max-w-full max-h-full rounded-lg shadow-2xl shadow-[#00E5FF]/10"
                      style={{
                        transform: `scale(${zoom / 100})`,
                        opacity: comparisonMode === "overlay" ? 0.7 : 1,
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
