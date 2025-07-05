"use client"

import type React from "react"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, ImageIcon, AlertCircle, CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAppStore } from "@/store/useAppStore"
import { cn } from "@/lib/utils"

export const ImageUploadZone: React.FC = () => {
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [currentFile, setCurrentFile] = useState<string>("")

  const { addImage, images } = useAppStore()

  const processFile = useCallback(async (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      const img = new Image()

      reader.onload = (e) => {
        const result = e.target?.result as string
        img.onload = () => {
          // Create thumbnail
          const canvas = document.createElement("canvas")
          const ctx = canvas.getContext("2d")
          const maxSize = 150

          const ratio = Math.min(maxSize / img.width, maxSize / img.height)
          canvas.width = img.width * ratio
          canvas.height = img.height * ratio

          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
          const thumbnail = canvas.toDataURL("image/jpeg", 0.8)

          const imageData = {
            id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            url: result,
            width: img.width,
            height: img.height,
            size: file.size,
            thumbnail,
            file,
            type: file.type,
            lastModified: file.lastModified,
          }

          resolve(imageData)
        }
        img.onerror = () => reject(new Error("Failed to load image"))
        img.src = result
      }
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsDataURL(file)
    })
  }, [])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const currentCount = images.length
      const maxImages = 6
      const availableSlots = maxImages - currentCount

      if (availableSlots <= 0) {
        setUploadError("Maximum 6 images allowed. Remove some images first.")
        return
      }

      const filesToProcess = acceptedFiles.slice(0, availableSlots)

      if (acceptedFiles.length > availableSlots) {
        setUploadError(
          `Only ${availableSlots} more images can be added (${acceptedFiles.length - availableSlots} files skipped)`,
        )
      }

      setIsUploading(true)
      setUploadError(null)
      setUploadSuccess(false)
      setUploadProgress(0)

      try {
        for (let i = 0; i < filesToProcess.length; i++) {
          const file = filesToProcess[i]
          setCurrentFile(file.name)

          // Validate file
          if (!file.type.startsWith("image/")) {
            throw new Error(`${file.name} is not a valid image file`)
          }

          if (file.size > 50 * 1024 * 1024) {
            // 50MB limit
            throw new Error(`${file.name} is too large (max 50MB)`)
          }

          // Process file
          const imageData = await processFile(file)
          addImage(imageData)

          // Update progress
          setUploadProgress(((i + 1) / filesToProcess.length) * 100)

          // Small delay for visual feedback
          await new Promise((resolve) => setTimeout(resolve, 200))
        }

        setUploadSuccess(true)
        setCurrentFile("")
        setTimeout(() => {
          setUploadSuccess(false)
          setUploadProgress(0)
        }, 3000)
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : "Upload failed")
        setCurrentFile("")
      } finally {
        setIsUploading(false)
      }
    },
    [addImage, processFile, images.length],
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp", ".svg"],
    },
    maxFiles: 6,
    disabled: isUploading || images.length >= 6,
  })

  const remainingSlots = 6 - images.length

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200",
          isDragActive && !isDragReject && "border-[#00E5FF] bg-[#00E5FF]/5",
          isDragReject && "border-red-500 bg-red-500/5",
          !isDragActive && !isDragReject && "border-[#00E5FF]/30 hover:border-[#00E5FF]/50 hover:bg-[#00E5FF]/5",
          isUploading && "pointer-events-none opacity-50",
          images.length >= 6 && "pointer-events-none opacity-50 border-gray-600",
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center space-y-3">
          <div
            className={cn(
              "p-3 rounded-full transition-colors",
              isDragActive && !isDragReject && "bg-[#00E5FF]/10 text-[#00E5FF]",
              isDragReject && "bg-red-500/10 text-red-500",
              !isDragActive && !isDragReject && images.length < 6 && "bg-gray-800 text-gray-400",
              images.length >= 6 && "bg-gray-700 text-gray-600",
            )}
          >
            {isDragReject ? (
              <AlertCircle className="w-6 h-6" />
            ) : images.length >= 6 ? (
              <X className="w-6 h-6" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>

          <div>
            {images.length >= 6 ? (
              <p className="text-sm font-medium text-gray-500">Maximum images reached (6/6)</p>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-300">
                  {isDragActive && !isDragReject && "Drop images here"}
                  {isDragReject && "Invalid file type"}
                  {!isDragActive && !isDragReject && "Drag & drop images here"}
                </p>
                <p className="text-xs text-gray-500 mt-1">or click to browse • PNG, JPG, GIF, WebP • Max 50MB each</p>
                <p className="text-xs text-[#00E5FF] mt-1">
                  {remainingSlots} slot{remainingSlots !== 1 ? "s" : ""} remaining
                </p>
              </>
            )}
          </div>

          {!isDragActive && images.length < 6 && (
            <Button
              variant="outline"
              size="sm"
              className="border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF]/10 bg-transparent"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
          )}
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Uploading {currentFile}...</span>
            <span className="text-[#00E5FF]">{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* Success Message */}
      {uploadSuccess && (
        <Alert className="border-green-500/20 bg-green-500/5">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-400">Images uploaded successfully!</AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {uploadError && (
        <Alert className="border-red-500/20 bg-red-500/5">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-400">{uploadError}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
