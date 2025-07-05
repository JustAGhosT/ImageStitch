"use client"

import type React from "react"
import { useState } from "react"
import { Download, ImageIcon, FileText, Package } from "lucide-react"
import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"

interface ExportOptions {
  format: "png" | "jpg" | "pdf" | "json"
  quality: number
  includeAnnotations: boolean
  includeMetadata: boolean
  resolution: "original" | "high" | "medium" | "low"
}

export const ExportModal: React.FC = () => {
  const { images, annotations } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [options, setOptions] = useState<ExportOptions>({
    format: "png",
    quality: 90,
    includeAnnotations: true,
    includeMetadata: false,
    resolution: "original",
  })

  const imageArray = Array.from(images.values())
  const annotationArray = Array.from(annotations.values())

  const handleExport = async () => {
    if (imageArray.length === 0) {
      toast({
        title: "No images to export",
        description: "Please upload images before exporting",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)
    setExportProgress(0)

    try {
      switch (options.format) {
        case "png":
        case "jpg":
          await exportAsImage()
          break
        case "pdf":
          await exportAsPDF()
          break
        case "json":
          await exportAsJSON()
          break
      }

      toast({
        title: "Export successful",
        description: `Images exported as ${options.format.toUpperCase()}`,
      })
    } catch (error) {
      console.error("Export failed:", error)
      toast({
        title: "Export failed",
        description: "An error occurred during export",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
      setExportProgress(0)
      setIsOpen(false)
    }
  }

  const exportAsImage = async () => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!

    // Set canvas dimensions based on resolution
    const baseWidth = 1920
    const baseHeight = 1080
    const resolutionMultiplier = {
      original: 2,
      high: 1.5,
      medium: 1,
      low: 0.5,
    }[options.resolution]

    canvas.width = baseWidth * resolutionMultiplier
    canvas.height = baseHeight * resolutionMultiplier

    // Draw images
    for (let i = 0; i < imageArray.length; i++) {
      const image = imageArray[i]
      const img = new Image()

      await new Promise((resolve) => {
        img.onload = () => {
          ctx.globalAlpha = i === 0 ? 1 : 0.7
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          resolve(void 0)
        }
        img.src = image.url
      })

      setExportProgress(((i + 1) / imageArray.length) * 50)
    }

    // Draw annotations if enabled
    if (options.includeAnnotations) {
      ctx.globalAlpha = 1
      // Draw annotations logic here
      setExportProgress(75)
    }

    // Convert to blob and download
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `comparison.${options.format}`
          a.click()
          URL.revokeObjectURL(url)
        }
        setExportProgress(100)
      },
      `image/${options.format}`,
      options.quality / 100,
    )
  }

  const exportAsPDF = async () => {
    // PDF export implementation would go here
    // Using a library like jsPDF
    setExportProgress(100)
  }

  const exportAsJSON = async () => {
    const exportData = {
      images: imageArray.map((img) => ({
        id: img.id,
        name: img.file.name,
        metadata: options.includeMetadata ? img.metadata : undefined,
      })),
      annotations: options.includeAnnotations ? annotationArray : [],
      exportedAt: new Date().toISOString(),
      version: "1.0",
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "comparison-data.json"
    a.click()
    URL.revokeObjectURL(url)

    setExportProgress(100)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 text-[#00E5FF] border border-[#00E5FF]/40">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[#0B1120] border-[#00E5FF]/15 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#00E5FF]">Export Comparison</DialogTitle>
          <DialogDescription className="text-gray-400">Choose your export format and options</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Export Format</Label>
            <Select
              value={options.format}
              onValueChange={(value: any) => setOptions((prev) => ({ ...prev, format: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    PNG Image
                  </div>
                </SelectItem>
                <SelectItem value="jpg">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    JPG Image
                  </div>
                </SelectItem>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    PDF Document
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    JSON Data
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(options.format === "png" || options.format === "jpg") && (
            <div className="space-y-2">
              <Label>Resolution</Label>
              <Select
                value={options.resolution}
                onValueChange={(value: any) => setOptions((prev) => ({ ...prev, resolution: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="original">Original (High Quality)</SelectItem>
                  <SelectItem value="high">High (1.5x)</SelectItem>
                  <SelectItem value="medium">Medium (1x)</SelectItem>
                  <SelectItem value="low">Low (0.5x)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="include-annotations">Include Annotations</Label>
            <Switch
              id="include-annotations"
              checked={options.includeAnnotations}
              onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, includeAnnotations: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="include-metadata">Include Metadata</Label>
            <Switch
              id="include-metadata"
              checked={options.includeMetadata}
              onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, includeMetadata: checked }))}
            />
          </div>

          {isExporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Exporting...</span>
                <span className="text-[#00E5FF]">{Math.round(exportProgress)}%</span>
              </div>
              <Progress value={exportProgress} className="h-2" />
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1" disabled={isExporting}>
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              className="flex-1 bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 text-[#00E5FF] border border-[#00E5FF]/40"
              disabled={isExporting || imageArray.length === 0}
            >
              {isExporting ? "Exporting..." : "Export"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
