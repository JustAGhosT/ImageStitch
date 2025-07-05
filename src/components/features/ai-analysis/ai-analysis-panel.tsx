"use client"

import type React from "react"
import { useState } from "react"
import { Brain, Zap, Target, TrendingUp, AlertTriangle } from "lucide-react"
import { useAppStore } from "@/store/useAppStore"
import { useImageProcessor } from "@/hooks/useImageProcessor"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AnalysisResult {
  type: "difference" | "similarity" | "quality" | "metadata"
  title: string
  description: string
  confidence: number
  severity: "low" | "medium" | "high"
  details: any
}

export const AIAnalysisPanel: React.FC = () => {
  const { images } = useAppStore()
  const { detectChanges, isProcessing } = useImageProcessor()
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])
  const [analysisProgress, setAnalysisProgress] = useState(0)

  const imageArray = Array.from(images.values())

  const runAIAnalysis = async () => {
    if (imageArray.length < 2) return

    setAnalysisProgress(0)
    const results: AnalysisResult[] = []

    try {
      // Simulate AI analysis steps
      const steps = [
        { name: "Loading images", progress: 20 },
        { name: "Detecting differences", progress: 40 },
        { name: "Analyzing quality", progress: 60 },
        { name: "Generating insights", progress: 80 },
        { name: "Finalizing results", progress: 100 },
      ]

      for (const step of steps) {
        await new Promise((resolve) => setTimeout(resolve, 800))
        setAnalysisProgress(step.progress)
      }

      // Mock analysis results
      results.push(
        {
          type: "difference",
          title: "Significant Changes Detected",
          description: "Found 23 areas with notable pixel differences",
          confidence: 92,
          severity: "high",
          details: {
            changedPixels: 15420,
            totalPixels: 2073600,
            changePercentage: 0.74,
            regions: [
              { x: 120, y: 80, width: 200, height: 150, type: "color_change" },
              { x: 450, y: 200, width: 100, height: 80, type: "object_added" },
            ],
          },
        },
        {
          type: "quality",
          title: "Image Quality Analysis",
          description: "Second image shows improved sharpness and contrast",
          confidence: 87,
          severity: "medium",
          details: {
            sharpness: { before: 72, after: 89 },
            contrast: { before: 65, after: 78 },
            brightness: { before: 128, after: 135 },
            noise: { before: 12, after: 8 },
          },
        },
        {
          type: "similarity",
          title: "Structural Similarity",
          description: "Images maintain 94% structural similarity",
          confidence: 96,
          severity: "low",
          details: {
            ssim: 0.94,
            mse: 156.7,
            psnr: 36.2,
          },
        },
      )

      setAnalysisResults(results)
    } catch (error) {
      console.error("AI analysis failed:", error)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-400 bg-red-400/20"
      case "medium":
        return "text-yellow-400 bg-yellow-400/20"
      case "low":
        return "text-green-400 bg-green-400/20"
      default:
        return "text-gray-400 bg-gray-400/20"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="w-4 h-4" />
      case "medium":
        return <TrendingUp className="w-4 h-4" />
      case "low":
        return <Target className="w-4 h-4" />
      default:
        return <Brain className="w-4 h-4" />
    }
  }

  return (
    <Card className="bg-[#0B1120]/80 border-[#00E5FF]/15">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-[#00E5FF]" />
          AI Analysis
        </CardTitle>
        <CardDescription className="text-gray-400">Intelligent comparison and quality analysis</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Button
          onClick={runAIAnalysis}
          disabled={imageArray.length < 2 || isProcessing}
          className="w-full bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 text-[#00E5FF] border border-[#00E5FF]/40"
        >
          <Zap className="w-4 h-4 mr-2" />
          {isProcessing ? "Analyzing..." : "Run AI Analysis"}
        </Button>

        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Processing images...</span>
              <span className="text-[#00E5FF]">{analysisProgress}%</span>
            </div>
            <Progress value={analysisProgress} className="h-2" />
          </div>
        )}

        {analysisResults.length > 0 && (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#101828]">
              <TabsTrigger value="overview" className="text-gray-400 data-[state=active]:text-[#00E5FF]">
                Overview
              </TabsTrigger>
              <TabsTrigger value="details" className="text-gray-400 data-[state=active]:text-[#00E5FF]">
                Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-3 mt-4">
              {analysisResults.map((result, index) => (
                <div key={index} className="bg-[#101828] rounded-lg p-3 border border-[#00E5FF]/10">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(result.severity)}
                      <h4 className="text-sm font-medium text-white">{result.title}</h4>
                    </div>
                    <Badge className={getSeverityColor(result.severity)} variant="secondary">
                      {result.confidence}%
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{result.description}</p>
                  <div className="w-full bg-gray-700 rounded-full h-1">
                    <div
                      className="bg-[#00E5FF] h-1 rounded-full transition-all duration-300"
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="details" className="space-y-3 mt-4">
              {analysisResults.map((result, index) => (
                <div key={index} className="bg-[#101828] rounded-lg p-3 border border-[#00E5FF]/10">
                  <h4 className="text-sm font-medium text-white mb-2">{result.title}</h4>
                  <div className="space-y-2 text-xs">
                    {result.type === "difference" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Changed Pixels:</span>
                          <span className="text-white">{result.details.changedPixels.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Change Percentage:</span>
                          <span className="text-white">{result.details.changePercentage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Regions Found:</span>
                          <span className="text-white">{result.details.regions.length}</span>
                        </div>
                      </>
                    )}
                    {result.type === "quality" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Sharpness:</span>
                          <span className="text-white">
                            {result.details.sharpness.before} → {result.details.sharpness.after}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Contrast:</span>
                          <span className="text-white">
                            {result.details.contrast.before} → {result.details.contrast.after}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Noise Level:</span>
                          <span className="text-white">
                            {result.details.noise.before} → {result.details.noise.after}
                          </span>
                        </div>
                      </>
                    )}
                    {result.type === "similarity" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-400">SSIM Score:</span>
                          <span className="text-white">{result.details.ssim}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">MSE:</span>
                          <span className="text-white">{result.details.mse}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">PSNR:</span>
                          <span className="text-white">{result.details.psnr} dB</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
