// Analytics and monitoring utilities
export class Analytics {
  private static instance: Analytics
  private events: Array<{ name: string; data: any; timestamp: Date }> = []

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics()
    }
    return Analytics.instance
  }

  track(eventName: string, data?: any) {
    this.events.push({
      name: eventName,
      data,
      timestamp: new Date(),
    })

    // In production, send to analytics service
    if (process.env.NODE_ENV === "production") {
      this.sendToAnalytics(eventName, data)
    }
  }

  private sendToAnalytics(eventName: string, data?: any) {
    // Implementation for sending to analytics service
    console.log("Analytics:", eventName, data)
  }

  getEvents() {
    return this.events
  }

  clearEvents() {
    this.events = []
  }
}

export const analytics = Analytics.getInstance()
