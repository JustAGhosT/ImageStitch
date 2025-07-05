"use client"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Square, Columns2, Layers, SplitSquareHorizontal, Diff, Eye } from "lucide-react"
import { useAppStore } from "@/src/store/useAppStore"

const comparisonModes = [
  {
    id: "single",
    label: "Single View",
    icon: Square,
    description: "View one image at a time",
    shortcut: "Alt+1",
  },
  {
    id: "side-by-side",
    label: "Side by Side",
    icon: Columns2,
    description: "Compare images side by side",
    shortcut: "Alt+2",
  },
  {
    id: "overlay",
    label: "Overlay",
    icon: Layers,
    description: "Overlay images with opacity control",
    shortcut: "Alt+3",
  },
  {
    id: "split",
    label: "Split View",
    icon: SplitSquareHorizontal,
    description: "Split screen comparison",
    shortcut: "Alt+4",
  },
  {
    id: "difference",
    label: "Difference",
    icon: Diff,
    description: "Highlight differences between images",
    shortcut: "Alt+5",
  },
] as const

export function ComparisonModeSelector() {
  const { comparisonMode, setComparisonMode, images } = useAppStore()

  const handleModeChange = (mode: typeof comparisonMode) => {
    setComparisonMode(mode)
  }

  return (
    <div className="space-y-3">
      {comparisonModes.map((mode) => (
        <Card
          key={mode.id}
          className={`cursor-pointer transition-all duration-200 ${
            comparisonMode === mode.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
          }`}
          onClick={() => handleModeChange(mode.id)}
        >
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg ${
                    comparisonMode === mode.id ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <mode.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium text-sm">{mode.label}</div>
                  <div className="text-xs text-gray-500">{mode.description}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {mode.shortcut}
                </Badge>
                {comparisonMode === mode.id && <Eye className="h-4 w-4 text-blue-600" />}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {images.length < 2 && comparisonMode !== "single" && (
        <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
          Upload at least 2 images to use comparison modes
        </div>
      )}
    </div>
  )
}
