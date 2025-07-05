// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  startMeasure(name: string): () => void {
    const startTime = performance.now()

    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime

      if (!this.metrics.has(name)) {
        this.metrics.set(name, [])
      }

      const measurements = this.metrics.get(name)!
      measurements.push(duration)

      // Keep only last 100 measurements
      if (measurements.length > 100) {
        measurements.shift()
      }
    }
  }

  getAverageTime(name: string): number {
    const measurements = this.metrics.get(name)
    if (!measurements || measurements.length === 0) return 0

    return measurements.reduce((sum, time) => sum + time, 0) / measurements.length
  }

  getMetrics() {
    const result: Record<string, { average: number; count: number; latest: number }> = {}

    for (const [name, measurements] of this.metrics) {
      result[name] = {
        average: this.getAverageTime(name),
        count: measurements.length,
        latest: measurements[measurements.length - 1] || 0,
      }
    }

    return result
  }

  clearMetrics() {
    this.metrics.clear()
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance()
