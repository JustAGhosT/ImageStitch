"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { useAppStore } from "@/src/store/useAppStore"
import { useKeyboardShortcuts } from "@/src/hooks/useKeyboardShortcuts"
import { cn } from "@/lib/utils"
import { Upload, ImageIcon } from "lucide-react"

interface CanvasRendererProps {
  className?: string
}

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })

  const {
    images,
    comparisonMode,
    ui: { zoom, showGrid, selectedTool },
    updateUI,
  } = useAppStore()

  // Enable keyboard shortcuts
  useKeyboardShortcuts()

  // Handle canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas size
    const container = containerRef.current
    if (container) {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    }

    // Apply zoom and pan transforms
    ctx.save()
    ctx.scale(zoom / 100, zoom / 100)
    ctx.translate(panOffset.x, panOffset.y)

    // Draw grid if enabled
    if (showGrid) {
      drawGrid(ctx, canvas.width, canvas.height)
    }

    // Draw images based on comparison mode
    if (images.length > 0) {
      drawImages(ctx, images, comparisonMode)
    }

    ctx.restore()
  }, [images, comparisonMode, zoom, showGrid, panOffset])

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gridSize = 20
    ctx.strokeStyle = "#00E5FF"
    ctx.globalAlpha = 0.1
    ctx.lineWidth = 1

    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    ctx.globalAlpha = 1
  }

  const drawImages = (ctx: CanvasRenderingContext2D, imageList: any[], mode: string) => {
    // Simple placeholder rendering - in a real app, you'd load and draw actual images
    const centerX = ctx.canvas.width / 2
    const centerY = ctx.canvas.height / 2
    const imageWidth = 300
    const imageHeight = 200

    // Draw first image
    if (imageList.length > 0) {
      ctx.fillStyle = "#00E5FF"
      ctx.globalAlpha = 0.4
      ctx.fillRect(centerX - imageWidth / 2 - 20, centerY - imageHeight / 2 - 20, imageWidth, imageHeight)
    }

    // Draw second image with different positioning based on mode
    if (imageList.length > 1) {
      ctx.fillStyle = "#FF4DA3"
      ctx.globalAlpha = 0.4

      switch (mode) {
        case "overlay":
          ctx.fillRect(centerX - imageWidth / 2 + 20, centerY - imageHeight / 2 + 20, imageWidth, imageHeight)
          break
        case "split":
          ctx.fillRect(centerX + 10, centerY - imageHeight / 2, imageWidth, imageHeight)
          break
        case "slider":
          ctx.fillRect(centerX - imageWidth / 2, centerY - imageHeight / 2, imageWidth / 2, imageHeight)
          break
      }
    }

    ctx.globalAlpha = 1

    // Add mode and image count indicator
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "16px monospace"
    ctx.fillText(`Mode: ${mode}`, 20, 30)
    ctx.fillText(`Images: ${imageList.length}/6`, 20, 55)
    ctx.fillText(`Tool: ${selectedTool}`, 20, 80)
  }

  // Handle mouse events for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (selectedTool === "move" || e.button === 1) {
      // Middle mouse button or move tool
      setIsPanning(true)
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  // Handle wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -25 : 25
    const newZoom = Math.max(25, Math.min(400, zoom + delta))
    updateUI({ zoom: newZoom })
  }

  const hasImages = images.length > 0

  return (
    <div
      ref={containerRef}
      className={cn("flex-1 relative overflow-hidden bg-[#0B1120]", className)}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {!hasImages ? (
        // Empty state
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="w-24 h-24 mx-auto bg-[#00E5FF]/10 rounded-full flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-[#00E5FF]/50" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#00E5FF] rounded-full flex items-center justify-center">
                <Upload className="w-4 h-4 text-black" />
              </div>
            </div>
            <h2 className="text-xl font-medium text-gray-300 mb-2">Upload images to start comparing</h2>
            <p className="text-gray-500 mb-4">Drag and drop up to 6 images or use the upload area in the sidebar</p>
            <div className="text-sm text-gray-600">
              <p>Supported formats: PNG, JPG, GIF, WebP, SVG</p>
              <p>Maximum file size: 50MB per image</p>
            </div>
          </div>
        </div>
      ) : (
        // Canvas with images
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{
            imageRendering: "pixelated",
            cursor: isPanning ? "grabbing" : selectedTool === "move" ? "grab" : "crosshair",
          }}
        />
      )}

      {/* Tool cursor indicator */}
      <div className="absolute top-4 left-4 bg-[#0B1120]/80 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-[#00E5FF] border border-[#00E5FF]/20">
        Tool: {selectedTool} | Zoom: {zoom}% | Images: {images.length}/6
      </div>

      {/* Grid indicator */}
      {showGrid && (
        <div className="absolute top-4 right-4 bg-[#0B1120]/80 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-[#00E5FF] border border-[#00E5FF]/20">
          Grid: ON
        </div>
      )}
    </div>
  )
}
