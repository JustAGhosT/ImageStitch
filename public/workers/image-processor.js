// Web Worker for image processing
self.onmessage = (e) => {
  const { type, img1, img2 } = e.data

  switch (type) {
    case "detectChanges":
      const result = detectPixelDifferences(img1, img2)
      self.postMessage({ type: "changesDetected", result })
      break

    case "generateThumbnail":
      const thumbnail = generateThumbnail(e.data.imageData, e.data.size)
      self.postMessage({ type: "thumbnailGenerated", thumbnail })
      break

    case "optimizeImage":
      const optimized = optimizeImage(e.data.imageData, e.data.quality)
      self.postMessage({ type: "imageOptimized", optimized })
      break
  }
}

function detectPixelDifferences(img1, img2) {
  if (img1.width !== img2.width || img1.height !== img2.height) {
    throw new Error("Images must have the same dimensions")
  }

  const width = img1.width
  const height = img1.height
  const data1 = img1.data
  const data2 = img2.data
  const diffData = new Uint8ClampedArray(width * height * 4)

  for (let i = 0; i < data1.length; i += 4) {
    const r1 = data1[i]
    const g1 = data1[i + 1]
    const b1 = data1[i + 2]

    const r2 = data2[i]
    const g2 = data2[i + 1]
    const b2 = data2[i + 2]

    const diff = Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2)

    if (diff > 30) {
      // Threshold for significant difference
      diffData[i] = 255 // Red
      diffData[i + 1] = 0 // Green
      diffData[i + 2] = 0 // Blue
      diffData[i + 3] = 255 // Alpha
    } else {
      diffData[i] = r1
      diffData[i + 1] = g1
      diffData[i + 2] = b1
      diffData[i + 3] = data1[i + 3]
    }
  }

  return new ImageData(diffData, width, height)
}

function generateThumbnail(imageData, size) {
  // Thumbnail generation logic
  const canvas = new OffscreenCanvas(size, size)
  const ctx = canvas.getContext("2d")

  // Draw and resize image
  ctx.putImageData(imageData, 0, 0)

  return canvas.convertToBlob({ type: "image/jpeg", quality: 0.8 })
}

function optimizeImage(imageData, quality) {
  // Image optimization logic
  const canvas = new OffscreenCanvas(imageData.width, imageData.height)
  const ctx = canvas.getContext("2d")

  ctx.putImageData(imageData, 0, 0)

  return canvas.convertToBlob({ type: "image/jpeg", quality: quality / 100 })
}
