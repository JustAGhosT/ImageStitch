"use client"

import type React from "react"
import { Monitor, Cpu, HardDrive, Wifi } from "lucide-react"
import { useAppStore } from "@/src/store/useAppStore"
import { cn } from "@/lib/utils"

interface StatusBarProps {
  className?: string
}

export const StatusBar: React.FC<StatusBarProps> = ({ className }) => {
  const { images, comparisonMode, ui } = useAppStore()

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  const totalSize = images.reduce((sum, img) => sum + (img.size || 0), 0)
  const avgDimensions =
    images.length > 0
      ? {
          width: Math.round(images.reduce((sum, img) => sum + img.width, 0) / images.length),
          height: Math.round(images.reduce((sum, img) => sum + img.height, 0) / images.length),
        }
      : { width: 0, height: 0 }

  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-2 bg-[#0B1120]/95 backdrop-blur-sm border-t border-[#00E5FF]/15 text-xs text-gray-400",
        className,
      )}
    >
      {/* Left side - Project info */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Monitor className="w-3 h-3" />
          <span>Images: {images.length}/6</span>
        </div>

        {images.length > 0 && (
          <>
            <div className="flex items-center space-x-2">
              <HardDrive className="w-3 h-3" />
              <span>Total: {formatFileSize(totalSize)}</span>
            </div>

            <div>
              Avg: {avgDimensions.width} × {avgDimensions.height}
            </div>
          </>
        )}

        <div>
          Mode: <span className="text-[#00E5FF] capitalize">{comparisonMode}</span>
        </div>
      </div>

      {/* Center - Tool info */}
      <div className="flex items-center space-x-4">
        <div>
          Tool: <span className="text-[#00E5FF] capitalize">{ui.selectedTool}</span>
        </div>

        <div>
          Zoom: <span className="text-[#00E5FF]">{ui.zoom}%</span>
        </div>

        {ui.showGrid && <div className="text-[#00E5FF]">Grid: ON</div>}
      </div>

      {/* Right side - System info */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Cpu className="w-3 h-3" />
          <span>Ready</span>
        </div>

        <div className="flex items-center space-x-2">
          <Wifi className="w-3 h-3 text-green-400" />
          <span>Online</span>
        </div>

        <div className="text-gray-500">v2.0.0</div>
      </div>
    </div>
  )
}
