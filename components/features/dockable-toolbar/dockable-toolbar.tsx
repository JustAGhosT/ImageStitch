"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  GripVertical,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Crop,
  Contrast,
  FlashlightIcon as Brightness4,
  Palette,
  Move3D,
} from "lucide-react"
import { useAppStore } from "@/src/store/useAppStore"

interface DockingZone {
  id: string
  label: string
  position: { x: number; y: number; width: number; height: number }
}

export function DockableToolbar() {
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [isDocked, setIsDocked] = useState(false)
  const [dockedPosition, setDockedPosition] = useState<string | null>(null)
  const [showDockingZones, setShowDockingZones] = useState(false)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const dragOffset = useRef({ x: 0, y: 0 })

  const { currentTool, setCurrentTool, images } = useAppStore()

  const dockingZones: DockingZone[] = [
    { id: "top", label: "Top", position: { x: 0, y: 0, width: window.innerWidth || 1200, height: 60 } },
    {
      id: "bottom",
      label: "Bottom",
      position: { x: 0, y: (window.innerHeight || 800) - 60, width: window.innerWidth || 1200, height: 60 },
    },
    { id: "left", label: "Left", position: { x: 0, y: 60, width: 60, height: (window.innerHeight || 800) - 120 } },
    {
      id: "right",
      label: "Right",
      position: { x: (window.innerWidth || 1200) - 60, y: 60, width: 60, height: (window.innerHeight || 800) - 120 },
    },
  ]

  const tools = [
    { id: "rotate-cw", icon: RotateCw, label: "Rotate Right", shortcut: "R" },
    { id: "rotate-ccw", icon: RotateCcw, label: "Rotate Left", shortcut: "Shift+R" },
    { id: "flip-h", icon: FlipHorizontal, label: "Flip Horizontal", shortcut: "H" },
    { id: "flip-v", icon: FlipVertical, label: "Flip Vertical", shortcut: "V" },
    { id: "crop", icon: Crop, label: "Crop", shortcut: "C" },
    { id: "contrast", icon: Contrast, label: "Contrast", shortcut: "Ctrl+T" },
    { id: "brightness", icon: Brightness4, label: "Brightness", shortcut: "Ctrl+B" },
    { id: "color", icon: Palette, label: "Color Adjust", shortcut: "Ctrl+U" },
  ]

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!toolbarRef.current) return

    const rect = toolbarRef.current.getBoundingClientRect()
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    setIsDragging(true)
    setShowDockingZones(true)

    if (isDocked) {
      setIsDocked(false)
      setDockedPosition(null)
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    const newPosition = {
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    }

    setPosition(newPosition)

    // Check for docking zones
    const centerX = newPosition.x + 150 // Half toolbar width
    const centerY = newPosition.y + 25 // Half toolbar height

    for (const zone of dockingZones) {
      if (
        centerX >= zone.position.x &&
        centerX <= zone.position.x + zone.position.width &&
        centerY >= zone.position.y &&
        centerY <= zone.position.y + zone.position.height
      ) {
        // Snap to docking zone
        switch (zone.id) {
          case "top":
            setPosition({ x: Math.max(0, Math.min(window.innerWidth - 300, newPosition.x)), y: 10 })
            break
          case "bottom":
            setPosition({
              x: Math.max(0, Math.min(window.innerWidth - 300, newPosition.x)),
              y: window.innerHeight - 60,
            })
            break
          case "left":
            setPosition({ x: 10, y: Math.max(60, Math.min(window.innerHeight - 110, newPosition.y)) })
            break
          case "right":
            setPosition({
              x: window.innerWidth - 310,
              y: Math.max(60, Math.min(window.innerHeight - 110, newPosition.y)),
            })
            break
        }
        break
      }
    }
  }

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging) return

    setIsDragging(false)
    setShowDockingZones(false)

    // Check if dropped in docking zone
    const centerX = position.x + 150
    const centerY = position.y + 25

    for (const zone of dockingZones) {
      if (
        centerX >= zone.position.x &&
        centerX <= zone.position.x + zone.position.width &&
        centerY >= zone.position.y &&
        centerY <= zone.position.y + zone.position.height
      ) {
        setIsDocked(true)
        setDockedPosition(zone.id)
        break
      }
    }
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, position])

  const getToolbarStyle = () => {
    const baseStyle = {
      position: "fixed" as const,
      zIndex: 1000,
      transition: isDragging ? "none" : "all 0.2s ease-in-out",
    }

    if (isDocked && dockedPosition) {
      switch (dockedPosition) {
        case "top":
          return { ...baseStyle, top: 10, left: position.x, flexDirection: "row" as const }
        case "bottom":
          return { ...baseStyle, bottom: 10, left: position.x, flexDirection: "row" as const }
        case "left":
          return { ...baseStyle, left: 10, top: position.y, flexDirection: "column" as const }
        case "right":
          return { ...baseStyle, right: 10, top: position.y, flexDirection: "column" as const }
      }
    }

    return {
      ...baseStyle,
      left: position.x,
      top: position.y,
      flexDirection: "row" as const,
    }
  }

  if (images.length === 0) {
    return null // Don't show toolbar if no images loaded
  }

  return (
    <>
      {/* Docking Zones */}
      {showDockingZones && (
        <div className="fixed inset-0 pointer-events-none z-999">
          {dockingZones.map((zone) => (
            <div
              key={zone.id}
              className="absolute bg-blue-500 bg-opacity-20 border-2 border-blue-500 border-dashed rounded-lg flex items-center justify-center"
              style={{
                left: zone.position.x,
                top: zone.position.y,
                width: zone.position.width,
                height: zone.position.height,
              }}
            >
              <Badge variant="secondary" className="text-xs">
                Drop to dock {zone.label}
              </Badge>
            </div>
          ))}
        </div>
      )}

      {/* Dockable Toolbar */}
      <Card
        ref={toolbarRef}
        className={`
          flex items-center gap-1 p-2 shadow-lg cursor-move
          ${isDragging ? "shadow-2xl scale-105" : ""}
          ${isDocked ? "bg-blue-50 border-blue-200" : "bg-white"}
        `}
        style={getToolbarStyle()}
        onMouseDown={handleMouseDown}
      >
        {/* Drag Handle */}
        <div className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-600">
          <GripVertical className="h-4 w-4" />
        </div>

        {/* Tools */}
        {tools.map((tool, index) => (
          <React.Fragment key={tool.id}>
            {index === 4 && <div className="w-px h-6 bg-gray-200 mx-1" />}
            <Button
              variant={currentTool === tool.id ? "default" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation()
                setCurrentTool(tool.id as any)
              }}
              title={`${tool.label} (${tool.shortcut})`}
            >
              <tool.icon className="h-4 w-4" />
            </Button>
          </React.Fragment>
        ))}

        {/* Undock Button */}
        {isDocked && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 ml-2"
            onClick={(e) => {
              e.stopPropagation()
              setIsDocked(false)
              setDockedPosition(null)
            }}
            title="Undock toolbar"
          >
            <Move3D className="h-4 w-4" />
          </Button>
        )}
      </Card>
    </>
  )
}
