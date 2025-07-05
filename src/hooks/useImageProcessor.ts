"use client"

import { useState, useCallback } from "react"
import type { ImageState } from "@/types"

class ImageProcessor {
  private worker: Worker | null = null

  constructor() {
    if (typeof window !== "undefined") {
      this.worker = new Worker("/workers/image-processor.js")
    }
  }

  async processImage(file: File): Promise<ImageState> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const url = e.target?.result as string
        const img = new Image()
        img.onload = async () => {
          const thumbnail = await this.generateThumbnail(img, 150)

          const imageState: ImageState = {
            id: crypto.randomUUID(),
            file,
            url,
            metadata: {
              width: img.width,
              height: img.height,
              size: file.size,
              format: file.type,
              lastModified: new Date(file.lastModified),
            },
            thumbnail,
            annotations: [],
          }
          resolve(imageState)
        }
        img.onerror = reject
        img.src = url
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  private async generateThumbnail(img: HTMLImageElement, size: number): Promise<string> {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!

    const aspectRatio = img.width / img.height
    if (aspectRatio > 1) {
      canvas.width = size
      canvas.height = size / aspectRatio
    } else {
      canvas.width = size * aspectRatio
      canvas.height = size
    }

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL("image/jpeg", 0.8)
  }

  async detectChanges(img1: ImageData, img2: ImageData): Promise<ImageData> {
    if (!this.worker) throw new Error("Worker not available")

    return new Promise((resolve, reject) => {
      this.worker!.postMessage({ type: "detectChanges", img1, img2 })
      this.worker!.onmessage = (e) => {
        if (e.data.type === "changesDetected") {
          resolve(e.data.result)
        }
      }
      this.worker!.onerror = reject
    })
  }
}

export const useImageProcessor = () => {
  const [processor] = useState(() => new ImageProcessor())
  const [isProcessing, setIsProcessing] = useState(false)

  const processImage = useCallback(
    async (file: File) => {
      setIsProcessing(true)
      try {
        const result = await processor.processImage(file)
        return result
      } finally {
        setIsProcessing(false)
      }
    },
    [processor],
  )

  const detectChanges = useCallback(
    async (img1: ImageData, img2: ImageData) => {
      setIsProcessing(true)
      try {
        const result = await processor.detectChanges(img1, img2)
        return result
      } finally {
        setIsProcessing(false)
      }
    },
    [processor],
  )

  return {
    processImage,
    detectChanges,
    isProcessing,
  }
}
