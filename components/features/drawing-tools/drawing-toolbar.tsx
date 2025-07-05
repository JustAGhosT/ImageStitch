"use client"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Brush, Eraser, Type, Circle, Square, ArrowRight, Palette, Minus } from "lucide-react"
import { useAppStore } from "@/src/store/useAppStore"

const drawingTools = [
  { id: "brush", icon: Brush, label: "Brush", shortcut: "B" },
  { id: "eraser", icon: Eraser, label: "Eraser", shortcut: "E" },
  { id: "line", icon: Minus, label: "Line", shortcut: "L" },
  { id: "circle", icon: Circle, label: "Circle", shortcut: "O" },
  { id: "rectangle", icon: Square, label: "Rectangle", shortcut: "R" },
  { id: "arrow", icon: ArrowRight, label: "Arrow", shortcut: "A" },
  { id: "text", icon: Type, label: "Text", shortcut: "T" },
]

const colorPalette = [
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ffff00",
  "#ff00ff",
  "#00ffff",
  "#000000",
  "#ffffff",
  "#808080",
  "#800000",
  "#008000",
  "#000080",
  "#808000",
  "#800080",
  "#008080",
  "#c0c0c0",
  "#ff8000",
  "#8000ff",
]

export function DrawingToolbar() {
  const {
    currentTool,
    setCurrentTool,
    drawingColor,
    setDrawingColor,
    strokeWidth,
    setStrokeWidth,
    opacity,
    setOpacity,
  } = useAppStore()

  return (
    <div className="space-y-4">
      {/* Drawing Tools */}
      <div className="grid grid-cols-2 gap-2">
        {drawingTools.map((tool) => (
          <Button
            key={tool.id}
            variant={currentTool === tool.id ? "default" : "outline"}
            size="sm"
            className="justify-start"
            onClick={() => setCurrentTool(tool.id as any)}
          >
            <tool.icon className="h-4 w-4 mr-2" />
            <span className="text-xs">{tool.label}</span>
            <Badge variant="secondary" className="ml-auto text-xs">
              {tool.shortcut}
            </Badge>
          </Button>
        ))}
      </div>

      <Separator />

      {/* Color Palette */}
      <div>
        <div className="text-xs font-medium mb-2 flex items-center">
          <Palette className="h-3 w-3 mr-1" />
          Color
        </div>
        <div className="grid grid-cols-6 gap-1">
          {colorPalette.map((color) => (
            <button
              key={color}
              className={`w-6 h-6 rounded border-2 ${drawingColor === color ? "border-gray-800" : "border-gray-300"}`}
              style={{ backgroundColor: color }}
              onClick={() => setDrawingColor(color)}
              title={color}
            />
          ))}
        </div>
        <div className="mt-2">
          <input
            type="color"
            value={drawingColor}
            onChange={(e) => setDrawingColor(e.target.value)}
            className="w-full h-8 rounded border border-gray-300"
          />
        </div>
      </div>

      <Separator />

      {/* Stroke Width */}
      <div>
        <div className="text-xs font-medium mb-2">Stroke Width: {strokeWidth}px</div>
        <Slider
          value={[strokeWidth]}
          onValueChange={(value) => setStrokeWidth(value[0])}
          min={1}
          max={20}
          step={1}
          className="w-full"
        />
      </div>

      <Separator />

      {/* Opacity */}
      <div>
        <div className="text-xs font-medium mb-2">Opacity: {Math.round(opacity * 100)}%</div>
        <Slider
          value={[opacity]}
          onValueChange={(value) => setOpacity(value[0])}
          min={0.1}
          max={1}
          step={0.1}
          className="w-full"
        />
      </div>
    </div>
  )
}
