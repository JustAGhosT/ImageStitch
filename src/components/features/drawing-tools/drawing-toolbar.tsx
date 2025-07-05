"use client"

import type React from "react"
import { Move, Square, Circle, Pen, Type, Ruler, Pipette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useAppStore } from "@/store/useAppStore"
import { cn } from "@/lib/utils"

export const DrawingToolbar: React.FC = () => {
  const { ui, updateUI } = useAppStore()
  const { selectedTool, strokeWidth, strokeColor } = ui

  const tools = [
    { id: "move", icon: Move, label: "Move", shortcut: "V" },
    { id: "rectangle", icon: Square, label: "Rectangle", shortcut: "R" },
    { id: "circle", icon: Circle, label: "Circle", shortcut: "C" },
    { id: "pen", icon: Pen, label: "Pen", shortcut: "P" },
    { id: "text", icon: Type, label: "Text", shortcut: "T" },
    { id: "measurement", icon: Ruler, label: "Measure", shortcut: "M" },
    { id: "colorPicker", icon: Pipette, label: "Color Picker", shortcut: "I" },
  ] as const

  return (
    <div className="space-y-4">
      {/* Tool Selection */}
      <div className="grid grid-cols-2 gap-2">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant={selectedTool === tool.id ? "default" : "outline"}
            size="sm"
            onClick={() => updateUI({ selectedTool: tool.id as any })}
            className={cn(
              "justify-start",
              selectedTool === tool.id ? "bg-primary text-primary-foreground" : "bg-transparent hover:bg-accent",
            )}
            title={`${tool.label} (${tool.shortcut})`}
          >
            <tool.icon className="w-4 h-4 mr-2" />
            {tool.label}
          </Button>
        ))}
      </div>

      {/* Tool Properties */}
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium mb-2 block">Stroke Width</label>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-muted-foreground w-6">1px</span>
            <Slider
              value={[strokeWidth]}
              onValueChange={(value) => updateUI({ strokeWidth: value[0] })}
              max={20}
              min={1}
              step={1}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-8">20px</span>
          </div>
          <div className="text-center mt-1">
            <span className="text-xs text-primary">{strokeWidth}px</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Color</label>
          <div className="flex items-center space-x-2">
            <div
              className="w-8 h-8 rounded border-2 border-border cursor-pointer hover:border-primary transition-colors"
              style={{ backgroundColor: strokeColor }}
              onClick={() => {
                // Color picker would open here
                console.log("Open color picker")
              }}
            />
            <span className="text-xs text-muted-foreground font-mono">{strokeColor}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
