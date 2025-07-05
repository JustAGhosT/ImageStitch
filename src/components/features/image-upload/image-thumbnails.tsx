"use client"

import type React from "react"
import { X, Eye, EyeOff, MoreVertical, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/store/useAppStore"

export const ImageThumbnails: React.FC = () => {
  const { images, removeImage } = useAppStore()

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-sm">No images uploaded yet</div>
        <div className="text-xs mt-1">Upload images to get started</div>
      </div>
    )
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-3">
      {images.map((image, index) => (
        <div
          key={image.id}
          className="group relative bg-[#101828] border border-[#00E5FF]/15 rounded-lg p-3 hover:border-[#00E5FF]/30 transition-colors"
        >
          <div className="flex items-start space-x-3">
            {/* Thumbnail */}
            <div className="relative flex-shrink-0">
              <img
                src={image.thumbnail || image.url}
                alt={image.name}
                className="w-16 h-16 object-cover rounded-md border border-[#00E5FF]/20"
              />
              <div className="absolute -top-2 -left-2 bg-[#00E5FF] text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                <Eye className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-200 truncate" title={image.name}>
                    {image.name}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className="text-xs bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/20">
                      {image.width} × {image.height}
                    </Badge>
                    <span className="text-xs text-gray-500">{formatFileSize(image.size)}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {image.type?.split("/")[1]?.toUpperCase() || "IMAGE"}
                  </div>
                </div>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6 text-gray-400 hover:text-[#00E5FF]"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#0B1120] border-[#00E5FF]/15">
                    <DropdownMenuItem className="text-gray-300 hover:text-[#00E5FF] hover:bg-[#00E5FF]/10">
                      <Eye className="w-4 h-4 mr-2" />
                      View Full Size
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-gray-300 hover:text-[#00E5FF] hover:bg-[#00E5FF]/10">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-gray-300 hover:text-[#00E5FF] hover:bg-[#00E5FF]/10">
                      <EyeOff className="w-4 h-4 mr-2" />
                      Hide from Comparison
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => removeImage(image.id)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
