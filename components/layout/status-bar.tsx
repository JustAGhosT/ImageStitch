"use client"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAppStore } from "@/src/store/useAppStore"

export function StatusBar() {
  const { images, zoom, currentTool, comparisonMode, canUndo, canRedo, panOffset } = useAppStore()

  const getImageInfo = () => {
    if (images.length === 0) return "No images loaded"
    if (images.length === 1) return `1 image loaded (${images[0].name})`
    return `${images.length} images loaded`
  }

  const getToolStatus = () => {
    switch (currentTool) {
      case "select":
        return "Selection tool active"
      case "draw":
        return "Drawing tool active"
      case "measure":
        return "Measurement tool active"
      case "pan":
        return "Pan tool active"
      default:
        return "No tool selected"
    }
  }

  const getComparisonStatus = () => {
    switch (comparisonMode) {
      case "side-by-side":
        return "Side by side comparison"
      case "overlay":
        return "Overlay comparison"
      case "split":
        return "Split comparison"
      case "difference":
        return "Difference comparison"
      default:
        return "Single image view"
    }
  }

  return (
    <div className="bg-gray-50 border-t border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between text-xs text-gray-600">
        {/* Left Section - Image Info */}
        <div className="flex items-center space-x-4">
          <span>{getImageInfo()}</span>

          {images.length > 0 && (
            <>
              <Separator orientation="vertical" className="h-4" />
              <span>{getComparisonStatus()}</span>
            </>
          )}
        </div>

        {/* Center Section - Tool Status */}
        <div className="flex items-center space-x-4">
          <span>{getToolStatus()}</span>

          <Separator orientation="vertical" className="h-4" />

          <div className="flex items-center space-x-2">
            <span>Zoom:</span>
            <Badge variant="outline" className="text-xs">
              {Math.round(zoom * 100)}%
            </Badge>
          </div>

          {(panOffset.x !== 0 || panOffset.y !== 0) && (
            <>
              <Separator orientation="vertical" className="h-4" />
              <span>
                Pan: {Math.round(panOffset.x)}, {Math.round(panOffset.y)}
              </span>
            </>
          )}
        </div>

        {/* Right Section - History Status */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span>History:</span>
            <Badge variant={canUndo ? "default" : "secondary"} className="text-xs">
              {canUndo ? "Can Undo" : "No Undo"}
            </Badge>
            <Badge variant={canRedo ? "default" : "secondary"} className="text-xs">
              {canRedo ? "Can Redo" : "No Redo"}
            </Badge>
          </div>

          <Separator orientation="vertical" className="h-4" />

          <span className="text-green-600">Ready</span>
        </div>
      </div>
    </div>
  )
}
