"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Activity, Cpu, HardDrive, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface PerformanceMetrics {
  memoryUsage: number
  cpuUsage: number
  renderTime: number
  imageProcessingTime: number
  canvasOperations: number
  fps: number
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    memoryUsage: 0,
    cpuUsage: 0,
    renderTime: 0,
    imageProcessingTime: 0,
    canvasOperations: 0,
    fps: 60,
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Performance monitoring
    const interval = setInterval(() => {
      // Simulate performance metrics
      setMetrics({
        memoryUsage: Math.random() * 100,
        cpuUsage: Math.random() * 80,
        renderTime: Math.random() * 16,
        imageProcessingTime: Math.random() * 200,
        canvasOperations: Math.floor(Math.random() * 1000),
        fps: 60 - Math.random() * 10,
      })
    }, 1000)

    // Show performance monitor in development
    if (process.env.NODE_ENV === "development") {
      setIsVisible(true)
    }

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  const getPerformanceStatus = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return { status: "good", color: "text-green-400 bg-green-400/20" }
    if (value <= thresholds.warning) return { status: "warning", color: "text-yellow-400 bg-yellow-400/20" }
    return { status: "critical", color: "text-red-400 bg-red-400/20" }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="bg-[#0B1120]/95 backdrop-blur-sm border-[#00E5FF]/15 w-80">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2 text-sm">
            <Activity className="w-4 h-4 text-[#00E5FF]" />
            Performance Monitor
          </CardTitle>
          <CardDescription className="text-xs text-gray-400">Real-time performance metrics</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Memory Usage */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-300">Memory</span>
              </div>
              <Badge
                variant="secondary"
                className={getPerformanceStatus(metrics.memoryUsage, { good: 50, warning: 80 }).color}
              >
                {metrics.memoryUsage.toFixed(1)}%
              </Badge>
            </div>
            <Progress value={metrics.memoryUsage} className="h-1" />
          </div>

          {/* CPU Usage */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-300">CPU</span>
              </div>
              <Badge
                variant="secondary"
                className={getPerformanceStatus(metrics.cpuUsage, { good: 30, warning: 60 }).color}
              >
                {metrics.cpuUsage.toFixed(1)}%
              </Badge>
            </div>
            <Progress value={metrics.cpuUsage} className="h-1" />
          </div>

          {/* Render Performance */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-gray-400" />
                <span className="text-gray-300">FPS</span>
              </div>
              <div className="text-white font-mono">{metrics.fps.toFixed(1)}</div>
            </div>

            <div className="space-y-1">
              <span className="text-gray-300">Render Time</span>
              <div className="text-white font-mono">{metrics.renderTime.toFixed(1)}ms</div>
            </div>

            <div className="space-y-1">
              <span className="text-gray-300">Processing</span>
              <div className="text-white font-mono">{metrics.imageProcessingTime.toFixed(0)}ms</div>
            </div>

            <div className="space-y-1">
              <span className="text-gray-300">Canvas Ops</span>
              <div className="text-white font-mono">{metrics.canvasOperations}</div>
            </div>
          </div>

          {/* Performance Tips */}
          {(metrics.memoryUsage > 80 || metrics.cpuUsage > 70) && (
            <div className="bg-yellow-400/10 border border-yellow-400/20 rounded p-2">
              <p className="text-xs text-yellow-400">
                High resource usage detected. Consider reducing image size or closing other applications.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
