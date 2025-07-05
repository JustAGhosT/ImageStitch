"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import {
  Move,
  Ruler,
  Palette,
  Eye,
  Layers,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Crop,
  GripVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { useAppStore } from "@/src/store/useAppStore"
import { cn } from "@/lib/utils"

type DockPosition = "floating" | "top" | "bottom" | "left" | "right"

interface DockableToolbarProps {
  className?: string
}

export const DockableToolbar: React.FC<DockableToolbarProps> = ({ className }) => {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 120, y: 120 })
  const [dockPosition, setDockPosition] = useState<DockPosition>("floating")
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [showDockZones, setShowDockZones] = useState(false)

  const toolbarRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    ui: { selectedTool },
    updateUI,
    images,
  } = useAppStore()

  // Handle drag start
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (dockPosition !== "floating") return

      const rect = toolbarRef.current?.getBoundingClientRect()
      if (!rect) return

      setIsDragging(true)
      setShowDockZones(true)
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      e.preventDefault()
      e.stopPropagation()
    },
    [dockPosition],
  )

  // Handle drag move
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || dockPosition !== "floating") return

      const containerRect = containerRef.current?.getBoundingClientRect()
      if (!containerRect) return

      const newX = e.clientX - containerRect.left - dragOffset.x
      const newY = e.clientY - containerRect.top - dragOffset.y

      // Constrain to container bounds
      const toolbarRect = toolbarRef.current?.getBoundingClientRect()
      if (!toolbarRect) return

      const maxX = containerRect.width - toolbarRect.width
      const maxY = containerRect.height - toolbarRect.height

      setPosition({
        x: Math.max(0, Math.min(maxX, newX)),
        y: Math.max(0, Math.min(maxY, newY)),
      })

      // Check for docking zones
      const threshold = 60
      const centerX = e.clientX - containerRect.left
      const centerY = e.clientY - containerRect.top

      if (
        centerX < threshold ||
        centerX > containerRect.width - threshold ||
        centerY < threshold ||
        centerY > containerRect.height - threshold
      ) {
        setShowDockZones(true)
      }
    },
    [isDragging, dragOffset, dockPosition],
  )

  // Handle drag end
  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return

      setIsDragging(false)
      setShowDockZones(false)

      const containerRect = containerRef.current?.getBoundingClientRect()
      if (!containerRect) return

      const threshold = 60
      const centerX = e.clientX - containerRect.left
      const centerY = e.clientY - containerRect.top

      // Check for docking
      if (centerX < threshold) {
        setDockPosition("left")
      } else if (centerX > containerRect.width - threshold) {
        setDockPosition("right")
      } else if (centerY < threshold) {
        setDockPosition("top")
      } else if (centerY > containerRect.height - threshold) {
        setDockPosition("bottom")
      }
    },
    [isDragging],
  )

  // Add event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // Undock toolbar
  const handleUndock = useCallback(() => {
    setDockPosition("floating")
    setPosition({ x: 120, y: 120 })
  }, [])

  const getToolbarStyle = (): React.CSSProperties => {
    switch (dockPosition) {
      case "top":
        return {
          position: "absolute",
          top: 8,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 50,
        }
      case "bottom":
        return {
          position: "absolute",
          bottom: 8,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 50,
        }
      case "left":
        return {
          position: "absolute",
          left: 8,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 50,
        }
      case "right":
        return {
          position: "absolute",
          right: 8,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 50,
        }
      default:
        return {
          position: "absolute",
          left: position.x,
          top: position.y,
          zIndex: 50,
        }
    }
  }

  const isVertical = dockPosition === "left" || dockPosition === "right"

  // Only show toolbar if there are images
  if (images.length === 0) {
    return null
  }

  return (
    <TooltipProvider>
      <div ref={containerRef} className="absolute inset-0 pointer-events-none">
        {/* Docking zones */}
        {showDockZones && dockPosition === "floating" && (
          <>
            <div className="absolute top-0 left-0 right-0 h-16 bg-[#00E5FF]/10 border-2 border-dashed border-[#00E5FF]/50 flex items-center justify-center text-[#00E5FF] text-sm font-medium pointer-events-none z-40">
              Drop to dock to top
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#00E5FF]/10 border-2 border-dashed border-[#00E5FF]/50 flex items-center justify-center text-[#00E5FF] text-sm font-medium pointer-events-none z-40">
              Drop to dock to bottom
            </div>
            <div className="absolute top-0 bottom-0 left-0 w-16 bg-[#00E5FF]/10 border-2 border-dashed border-[#00E5FF]/50 flex items-center justify-center text-[#00E5FF] text-sm font-medium pointer-events-none z-40">
              <span className="transform -rotate-90 whitespace-nowrap">Drop to dock to left</span>
            </div>
            <div className="absolute top-0 bottom-0 right-0 w-16 bg-[#00E5FF]/10 border-2 border-dashed border-[#00E5FF]/50 flex items-center justify-center text-[#00E5FF] text-sm font-medium pointer-events-none z-40">
              <span className="transform rotate-90 whitespace-nowrap">Drop to dock to right</span>
            </div>
          </>
        )}

        {/* Toolbar */}
        <div
          ref={toolbarRef}
          style={getToolbarStyle()}
          className={cn(
            "flex items-center gap-1 bg-[#0B1120]/95 backdrop-blur-sm border border-[#00E5FF]/30 rounded-lg p-2 shadow-lg shadow-[#00E5FF]/20 pointer-events-auto",
            isDragging && "shadow-2xl shadow-[#00E5FF]/30 scale-105",
            isVertical && "flex-col",
            className,
          )}
        >
          {/* Drag handle */}
          {dockPosition === "floating" && (
            <div
              className="cursor-move p-1 text-gray-400 hover:text-[#00E5FF] transition-colors select-none"
              onMouseDown={handleMouseDown}
              title="Drag to move toolbar"
            >
              <GripVertical className="w-4 h-4" />
            </div>
          )}

          {/* Undock button for docked toolbars */}
          {dockPosition !== "floating" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUndock}
                  className="text-gray-400 hover:text-[#00E5FF] p-1 h-8 w-8"
                >
                  <Move className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Undock toolbar</p>
              </TooltipContent>
            </Tooltip>
          )}

          {!isVertical && <Separator orientation="vertical" className="h-6 bg-[#00E5FF]/15" />}
          {isVertical && <Separator orientation="horizontal" className="w-6 bg-[#00E5FF]/15" />}

          {/* Image transformation tools */}
          <div className={cn("flex gap-1", isVertical && "flex-col")}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-[#00E5FF] p-1 h-8 w-8">
                  <RotateCw className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Rotate Clockwise</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-[#00E5FF] p-1 h-8 w-8">
                  <FlipHorizontal className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Flip Horizontal</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-[#00E5FF] p-1 h-8 w-8">
                  <FlipVertical className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Flip Vertical</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {!isVertical && <Separator orientation="vertical" className="h-6 bg-[#00E5FF]/15" />}
          {isVertical && <Separator orientation="horizontal" className="w-6 bg-[#00E5FF]/15" />}

          {/* Analysis tools */}
          <div className={cn("flex gap-1", isVertical && "flex-col")}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateUI({ selectedTool: "measurement" })}
                  className={cn(
                    "p-1 h-8 w-8 transition-colors",
                    selectedTool === "measurement"
                      ? "text-[#00E5FF] bg-[#00E5FF]/20"
                      : "text-gray-400 hover:text-[#00E5FF]",
                  )}
                >
                  <Ruler className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Measurement Tool (M)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateUI({ selectedTool: "colorPicker" })}
                  className={cn(
                    "p-1 h-8 w-8 transition-colors",
                    selectedTool === "colorPicker"
                      ? "text-[#00E5FF] bg-[#00E5FF]/20"
                      : "text-gray-400 hover:text-[#00E5FF]",
                  )}
                >
                  <Palette className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Color Picker (I)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateUI({ selectedTool: "crop" })}
                  className={cn(
                    "p-1 h-8 w-8 transition-colors",
                    selectedTool === "crop" ? "text-[#00E5FF] bg-[#00E5FF]/20" : "text-gray-400 hover:text-[#00E5FF]",
                  )}
                >
                  <Crop className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Crop Tool (C)</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {!isVertical && <Separator orientation="vertical" className="h-6 bg-[#00E5FF]/15" />}
          {isVertical && <Separator orientation="horizontal" className="w-6 bg-[#00E5FF]/15" />}

          {/* View tools */}
          <div className={cn("flex gap-1", isVertical && "flex-col")}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-[#00E5FF] p-1 h-8 w-8">
                  <Eye className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle Layer Visibility</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-[#00E5FF] p-1 h-8 w-8">
                  <Layers className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Layer Controls</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
