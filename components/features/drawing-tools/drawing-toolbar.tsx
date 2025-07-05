"use client"

import type React from "react"
import { Square, Circle, Pen, Type, Move, Ruler, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { useAppStore } from "@/src/store/useAppStore"
import { cn } from "@/lib/utils"

interface DrawingToolbarProps {
  className?: string
}

export const DrawingToolbar: React.FC<DrawingToolbarProps> = ({ className }) => {
  const {
    ui: { selectedTool, strokeWidth, strokeColor },
    updateUI,
  } = useAppStore()

  const tools = [
    { id: "move", name: "Move", icon: Move, shortcut: "V" },
    { id: "rectangle", name: "Rectangle", icon: Square, shortcut: "R" },
    { id: "circle", name: "Circle", icon: Circle, shortcut: "C" },
    { id: "pen", name: "Pen", icon: Pen, shortcut: "P" },
    { id: "text", name: "Text", icon: Type, shortcut: "T" },
    { id: "measurement", name: "Measure", icon: Ruler, shortcut: "M" },
    { id: "colorPicker", name: "Color Picker", icon: Palette, shortcut: "I" },
  ]

  const colors = [
    "#00E5FF", // Cyan
    "#FF4DA3", // Pink
    "#4AFF4A", // Green
    "#FFD700", // Gold
    "#FF6B35", // Orange
    "#8A2BE2", // Blue Violet
    "#FF1744", // Red
    "#FFFFFF", // White
  ]

  const handleToolSelect = (toolId: string) => {
    updateUI({ selectedTool: toolId })
  }

  const handleStrokeWidthChange = (value: number[]) => {
    updateUI({ strokeWidth: value[0] })
  }

  const handleColorSelect = (color: string) => {
    updateUI({ strokeColor: color })
  }

  return (
    <Card className={cn("bg-[#0B1120]/50 border-[#00E5FF]/20", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-[#00E5FF]">Drawing Tools</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tool Selection */}
        <div className="grid grid-cols-2 gap-2">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleToolSelect(tool.id)}
              className={cn(
                "justify-start text-xs h-auto p-2",
                selectedTool === tool.id
                  ? "bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF]"
                  : "border-[#00E5FF]/40 text-gray-300 hover:text-[#00E5FF] bg-transparent hover:bg-[#00E5FF]/10",
              )}
            >
              <tool.icon className="w-4 h-4 mr-2" />
              <div className="flex-1 text-left">
                <div>{tool.name}</div>
                <div className="text-xs opacity-50 font-mono">{tool.shortcut}</div>
              </div>
            </Button>
          ))}
        </div>

        <Separator className="bg-[#00E5FF]/15" />

        {/* Stroke Width */}
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 mb-2 block">STROKE WIDTH</label>
            <div className="flex items-center space-x-3">
              <span className="text-xs text-gray-500 w-6">1px</span>
              <Slider
                value={[strokeWidth]}
                onValueChange={handleStrokeWidthChange}
                max={20}
                min={1}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-gray-500 w-8">20px</span>
            </div>
            <div className="text-center mt-1">
              <span className="text-xs text-[#00E5FF]">{strokeWidth}px</span>
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">COLOR</label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className={cn(
                    "w-8 h-8 rounded border-2 transition-all hover:scale-110",
                    strokeColor === color ? "border-white shadow-lg" : "border-gray-600 hover:border-gray-400",
                  )}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <div className="mt-2 text-center">
              <span className="text-xs text-gray-400">Selected: </span>
              <span className="text-xs text-[#00E5FF] font-mono">{strokeColor}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
