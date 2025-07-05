"use client"

import type React from "react"
import { useRef, useEffect, useState, useCallback } from "react"
import { useAppStore } from "@/src/store/useAppStore"

interface Point {
  x: number
  y: number
}

export function CanvasRenderer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPanning, setIsPanning] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPanPoint, setLastPanPoint] = useState<Point>({ x: 0, y: 0 })
  const [lastDrawPoint, setLastDrawPoint] = useState<Point>({ x: 0, y: 0 })

  const {
    images,
    zoom,
    panOffset,
    setPanOffset,
    currentTool,
    comparisonMode,
    showGrid,
    drawingColor,
    strokeWidth,
    opacity,
    viewMode,
  } = useAppStore()

  // Canvas dimensions
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })

  // Update canvas size on container resize
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setCanvasSize({
          width: rect.width,
          height: rect.height,
        })
      }
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)
    return () => window.removeEventListener("resize", updateCanvasSize)
  }, [])

  // Main render function
  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvasSize.width
    canvas.height = canvasSize.height

    // Clear canvas
    ctx.fillStyle = "#f8f9fa"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Apply zoom and pan transformations
    ctx.save()
    ctx.translate(panOffset.x, panOffset.y)
    ctx.scale(zoom, zoom)

    // Draw grid if enabled
    if (showGrid) {
      drawGrid(ctx)
    }

    // Draw images based on comparison mode
    if (images.length > 0) {
      switch (comparisonMode) {
        case "side-by-side":
          drawSideBySide(ctx)
          break
        case "overlay":
          drawOverlay(ctx)
          break
        case "split":
          drawSplit(ctx)
          break
        case "difference":
          drawDifference(ctx)
          break
        default:
          drawSingle(ctx)
      }
    }

    ctx.restore()

    // Draw UI elements (not affected by zoom/pan)
    drawUI(ctx)
  }, [images, zoom, panOffset, comparisonMode, showGrid, canvasSize, opacity])

  // Grid drawing
  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    const gridSize = 20
    ctx.strokeStyle = "#e0e0e0"
    ctx.lineWidth = 1

    for (let x = 0; x < canvasSize.width / zoom; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvasSize.height / zoom)
      ctx.stroke()
    }

    for (let y = 0; y < canvasSize.height / zoom; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvasSize.width / zoom, y)
      ctx.stroke()
    }
  }

  // Single image drawing
  const drawSingle = (ctx: CanvasRenderingContext2D) => {
    if (images.length === 0) return

    const img = images[0]
    if (img.element) {
      const centerX = canvasSize.width / zoom / 2 - img.element.width / 2
      const centerY = canvasSize.height / zoom / 2 - img.element.height / 2
      ctx.drawImage(img.element, centerX, centerY)
    }
  }

  // Side by side comparison
  const drawSideBySide = (ctx: CanvasRenderingContext2D) => {
    if (images.length < 2) return

    const img1 = images[0]
    const img2 = images[1]

    if (img1.element && img2.element) {
      const centerY = canvasSize.height / zoom / 2
      const spacing = 50
      const totalWidth = img1.element.width + img2.element.width + spacing
      const startX = canvasSize.width / zoom / 2 - totalWidth / 2

      ctx.drawImage(img1.element, startX, centerY - img1.element.height / 2)
      ctx.drawImage(img2.element, startX + img1.element.width + spacing, centerY - img2.element.height / 2)
    }
  }

  // Overlay comparison
  const drawOverlay = (ctx: CanvasRenderingContext2D) => {
    if (images.length < 2) return

    const img1 = images[0]
    const img2 = images[1]

    if (img1.element && img2.element) {
      const centerX = canvasSize.width / zoom / 2 - img1.element.width / 2
      const centerY = canvasSize.height / zoom / 2 - img1.element.height / 2

      ctx.drawImage(img1.element, centerX, centerY)

      ctx.globalAlpha = opacity
      ctx.drawImage(img2.element, centerX, centerY)
      ctx.globalAlpha = 1
    }
  }

  // Split comparison
  const drawSplit = (ctx: CanvasRenderingContext2D) => {
    if (images.length < 2) return

    const img1 = images[0]
    const img2 = images[1]

    if (img1.element && img2.element) {
      const centerX = canvasSize.width / zoom / 2 - img1.element.width / 2
      const centerY = canvasSize.height / zoom / 2 - img1.element.height / 2
      const splitX = centerX + img1.element.width / 2

      // Draw left half of first image
      ctx.drawImage(
        img1.element,
        0,
        0,
        img1.element.width / 2,
        img1.element.height,
        centerX,
        centerY,
        img1.element.width / 2,
        img1.element.height,
      )

      // Draw right half of second image
      ctx.drawImage(
        img2.element,
        img2.element.width / 2,
        0,
        img2.element.width / 2,
        img2.element.height,
        splitX,
        centerY,
        img2.element.width / 2,
        img2.element.height,
      )

      // Draw split line
      ctx.strokeStyle = "#ff0000"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(splitX, centerY)
      ctx.lineTo(splitX, centerY + img1.element.height)
      ctx.stroke()
    }
  }

  // Difference comparison
  const drawDifference = (ctx: CanvasRenderingContext2D) => {
    if (images.length < 2) return
    // This would require pixel-level comparison - simplified for demo
    drawOverlay(ctx)
  }

  // UI elements drawing
  const drawUI = (ctx: CanvasRenderingContext2D) => {
    // Draw zoom indicator
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    ctx.fillRect(10, 10, 100, 30)
    ctx.fillStyle = "white"
    ctx.font = "14px Arial"
    ctx.fillText(`Zoom: ${Math.round(zoom * 100)}%`, 20, 30)

    // Draw tool indicator
    if (currentTool) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(10, 50, 120, 30)
      ctx.fillStyle = "white"
      ctx.fillText(`Tool: ${currentTool}`, 20, 70)
    }
  }

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    if (currentTool === "pan" || e.button === 1) {
      // Middle mouse button or pan tool
      setIsPanning(true)
      setLastPanPoint(point)
    } else if (currentTool === "draw") {
      setIsDrawing(true)
      setLastDrawPoint(point)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    if (isPanning) {
      const deltaX = point.x - lastPanPoint.x
      const deltaY = point.y - lastPanPoint.y

      setPanOffset({
        x: panOffset.x + deltaX,
        y: panOffset.y + deltaY,
      })

      setLastPanPoint(point)
    } else if (isDrawing && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        ctx.strokeStyle = drawingColor
        ctx.lineWidth = strokeWidth
        ctx.lineCap = "round"
        ctx.beginPath()
        ctx.moveTo(lastDrawPoint.x, lastDrawPoint.y)
        ctx.lineTo(point.x, point.y)
        ctx.stroke()
        setLastDrawPoint(point)
      }
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
    setIsDrawing(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
    const newZoom = Math.max(0.1, Math.min(5, zoom * zoomFactor))

    // Zoom towards mouse position
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      setPanOffset({
        x: panOffset.x - (mouseX - panOffset.x) * (newZoom / zoom - 1),
        y: panOffset.y - (mouseY - panOffset.y) * (newZoom / zoom - 1),
      })
    }

    useAppStore.getState().setZoom(newZoom)
  }

  // Render on state changes
  useEffect(() => {
    render()
  }, [render])

  return (
    <div ref={containerRef} className="flex-1 relative overflow-hidden bg-gray-100">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{
          cursor: currentTool === "pan" ? "grab" : currentTool === "draw" ? "crosshair" : "default",
        }}
      />

      {images.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-lg font-medium mb-2">No images loaded</div>
            <div className="text-sm">Upload images to start comparing</div>
          </div>
        </div>
      )}
    </div>
  )
}
