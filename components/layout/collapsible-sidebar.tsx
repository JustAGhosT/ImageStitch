"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Upload, Images, Layers, Settings, Square, Circle, Pen, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { useAppStore } from "@/src/store/useAppStore"
import { cn } from "@/lib/utils"

interface CollapsibleSidebarProps {
  className?: string
}

export const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({ className }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")

  const {
    ui: { sidebarCollapsed, selectedTool, strokeWidth, strokeColor },
    updateUI,
    comparisonMode,
    setComparisonMode,
    images,
    addImage,
  } = useAppStore()

  // Sync with store state
  useEffect(() => {
    setIsCollapsed(sidebarCollapsed)
  }, [sidebarCollapsed])

  const handleToggleCollapse = () => {
    const newCollapsed = !isCollapsed
    setIsCollapsed(newCollapsed)
    updateUI({ sidebarCollapsed: newCollapsed })
  }

  const handleToolSelect = (tool: string) => {
    updateUI({ selectedTool: tool })
  }

  const handleStrokeWidthChange = (value: number[]) => {
    updateUI({ strokeWidth: value[0] })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file, index) => {
      if (images.length + index < 6) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const img = new Image()
          img.onload = () => {
            addImage({
              id: Date.now() + index + "",
              name: file.name,
              url: e.target?.result as string,
              size: file.size,
              width: img.width,
              height: img.height,
              type: file.type,
            })
          }
          img.src = e.target?.result as string
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const files = Array.from(e.dataTransfer.files)
    files.forEach((file, index) => {
      if (images.length + index < 6 && file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const img = new Image()
          img.onload = () => {
            addImage({
              id: Date.now() + index + "",
              name: file.name,
              url: e.target?.result as string,
              size: file.size,
              width: img.width,
              height: img.height,
              type: file.type,
            })
          }
          img.src = e.target?.result as string
        }
        reader.readAsDataURL(file)
      }
    })
  }

  return (
    <div
      className={cn(
        "relative bg-[#0B1120]/95 backdrop-blur-sm border-r border-[#00E5FF]/15 transition-all duration-300 ease-in-out flex flex-col",
        isCollapsed ? "w-16" : "w-80",
        className,
      )}
    >
      {/* Header with collapse button */}
      <div className="flex items-center justify-between p-4 border-b border-[#00E5FF]/15">
        {!isCollapsed && (
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-[#00E5FF] tracking-wide">ImageCompare Pro</h1>
            <p className="text-xs text-gray-400 mt-1">Professional Image Analysis</p>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleCollapse}
          className="text-gray-400 hover:text-[#00E5FF] p-2 h-8 w-8 shrink-0"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Content */}
      {isCollapsed ? (
        // Collapsed state - icon-only navigation
        <div className="flex flex-col items-center py-4 space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsCollapsed(false)
              updateUI({ sidebarCollapsed: false })
              setActiveTab("upload")
            }}
            className="text-gray-400 hover:text-[#00E5FF] p-2 h-10 w-10 relative"
            title="Upload Images"
          >
            <Upload className="w-5 h-5" />
            {images.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#00E5FF] text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {images.length}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsCollapsed(false)
              updateUI({ sidebarCollapsed: false })
              setActiveTab("images")
            }}
            className="text-gray-400 hover:text-[#00E5FF] p-2 h-10 w-10"
            title="Image Gallery"
          >
            <Images className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsCollapsed(false)
              updateUI({ sidebarCollapsed: false })
              setActiveTab("tools")
            }}
            className="text-gray-400 hover:text-[#00E5FF] p-2 h-10 w-10"
            title="Drawing Tools"
          >
            <Layers className="w-5 h-5" />
          </Button>

          <Separator className="w-8 bg-[#00E5FF]/15 my-2" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsCollapsed(false)
              updateUI({ sidebarCollapsed: false })
              setActiveTab("more")
            }}
            className="text-gray-400 hover:text-[#00E5FF] p-2 h-10 w-10"
            title="More Options"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      ) : (
        // Expanded state - full sidebar content
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Upload Section */}
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-[#00E5FF] mb-3">UPLOAD IMAGES ({images.length}/6)</h3>
              <div
                className="border-2 border-dashed border-[#00E5FF]/30 rounded-lg p-8 text-center hover:border-[#00E5FF]/50 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <Upload className="w-8 h-8 mx-auto mb-4 text-[#00E5FF]" />
                <p className="text-sm text-gray-300 mb-2">Drag & drop images or click to browse</p>
                <p className="text-xs text-gray-500">PNG, JPG, WebP up to 10MB each</p>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Image Thumbnails */}
            {images.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-400">UPLOADED IMAGES</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {images.map((image, index) => (
                    <div key={image.id} className="flex items-center space-x-2 p-2 bg-[#00E5FF]/5 rounded">
                      <div className="w-8 h-8 bg-[#00E5FF]/20 rounded flex items-center justify-center text-xs text-[#00E5FF]">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-300 truncate">{image.name}</p>
                        <p className="text-xs text-gray-500">
                          {image.width}×{image.height}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator className="bg-[#00E5FF]/15" />

            {/* Comparison Mode */}
            <div>
              <h3 className="text-sm font-medium text-[#00E5FF] mb-3">COMPARISON MODE</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={comparisonMode === "overlay" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setComparisonMode("overlay")}
                  className={cn(
                    "text-xs",
                    comparisonMode === "overlay"
                      ? "bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF]"
                      : "border-[#00E5FF]/40 text-gray-300 hover:text-[#00E5FF] bg-transparent",
                  )}
                >
                  Overlay
                </Button>
                <Button
                  variant={comparisonMode === "split" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setComparisonMode("split")}
                  className={cn(
                    "text-xs",
                    comparisonMode === "split"
                      ? "bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF]"
                      : "border-[#00E5FF]/40 text-gray-300 hover:text-[#00E5FF] bg-transparent",
                  )}
                >
                  Split
                </Button>
                <Button
                  variant={comparisonMode === "slider" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setComparisonMode("slider")}
                  className={cn(
                    "text-xs",
                    comparisonMode === "slider"
                      ? "bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF]"
                      : "border-[#00E5FF]/40 text-gray-300 hover:text-[#00E5FF] bg-transparent",
                  )}
                >
                  Slider
                </Button>
              </div>
            </div>

            <Separator className="bg-[#00E5FF]/15" />

            {/* Drawing Tools */}
            <div>
              <h3 className="text-sm font-medium text-[#00E5FF] mb-3">DRAWING TOOLS</h3>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <Button
                  variant={selectedTool === "rectangle" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToolSelect("rectangle")}
                  className={cn(
                    "justify-start text-xs",
                    selectedTool === "rectangle"
                      ? "bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF]"
                      : "border-[#00E5FF]/40 text-gray-300 hover:text-[#00E5FF] bg-transparent",
                  )}
                >
                  <Square className="w-4 h-4 mr-2" />
                  Rectangle
                </Button>
                <Button
                  variant={selectedTool === "circle" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToolSelect("circle")}
                  className={cn(
                    "justify-start text-xs",
                    selectedTool === "circle"
                      ? "bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF]"
                      : "border-[#00E5FF]/40 text-gray-300 hover:text-[#00E5FF] bg-transparent",
                  )}
                >
                  <Circle className="w-4 h-4 mr-2" />
                  Circle
                </Button>
                <Button
                  variant={selectedTool === "pen" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToolSelect("pen")}
                  className={cn(
                    "justify-start text-xs",
                    selectedTool === "pen"
                      ? "bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF]"
                      : "border-[#00E5FF]/40 text-gray-300 hover:text-[#00E5FF] bg-transparent",
                  )}
                >
                  <Pen className="w-4 h-4 mr-2" />
                  Pen
                </Button>
                <Button
                  variant={selectedTool === "text" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToolSelect("text")}
                  className={cn(
                    "justify-start text-xs",
                    selectedTool === "text"
                      ? "bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF]"
                      : "border-[#00E5FF]/40 text-gray-300 hover:text-[#00E5FF] bg-transparent",
                  )}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Text
                </Button>
              </div>

              {/* Stroke Width */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">STROKE WIDTH</label>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-gray-500 w-6">1px</span>
                    <Slider
                      value={[strokeWidth]}
                      onValueChange={handleStrokeWidthChange}
                      max={10}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-500 w-8">10px</span>
                  </div>
                  <div className="text-center mt-1">
                    <span className="text-xs text-[#00E5FF]">{strokeWidth}px</span>
                  </div>
                </div>

                {/* Color */}
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">COLOR</label>
                  <div
                    className="w-8 h-8 rounded border-2 border-gray-600 cursor-pointer"
                    style={{ backgroundColor: strokeColor }}
                    onClick={() => {
                      // Color picker would open here
                      console.log("Open color picker")
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-[#00E5FF]/15">
          <div className="text-xs text-gray-500 text-center">v2.0.0 • Professional Edition</div>
        </div>
      )}
    </div>
  )
}
