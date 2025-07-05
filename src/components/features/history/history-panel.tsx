"use client"

import type React from "react"
import { History, RotateCcw, RotateCw, Trash2 } from "lucide-react"
import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface HistoryItem {
  id: string
  action: string
  timestamp: Date
  description: string
  canUndo: boolean
}

export const HistoryPanel: React.FC = () => {
  const { history, undo, redo } = useAppStore()

  // Mock history items for demonstration
  const historyItems: HistoryItem[] = [
    {
      id: "1",
      action: "add_annotation",
      timestamp: new Date(Date.now() - 30000),
      description: "Added rectangle annotation",
      canUndo: true,
    },
    {
      id: "2",
      action: "upload_image",
      timestamp: new Date(Date.now() - 120000),
      description: "Uploaded image: screenshot.png",
      canUndo: true,
    },
    {
      id: "3",
      action: "change_mode",
      timestamp: new Date(Date.now() - 180000),
      description: "Changed to overlay mode",
      canUndo: true,
    },
    {
      id: "4",
      action: "zoom",
      timestamp: new Date(Date.now() - 240000),
      description: "Zoomed to 150%",
      canUndo: true,
    },
  ]

  const getActionIcon = (action: string) => {
    switch (action) {
      case "add_annotation":
        return "✏️"
      case "upload_image":
        return "📁"
      case "change_mode":
        return "🔄"
      case "zoom":
        return "🔍"
      default:
        return "⚡"
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  return (
    <Card className="bg-[#0B1120]/80 border-[#00E5FF]/15">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <History className="w-5 h-5 text-[#00E5FF]" />
          History
        </CardTitle>
        <CardDescription className="text-gray-400">Track and manage your actions</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            onClick={undo}
            disabled={history.past.length === 0}
            className="flex-1 bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 text-[#00E5FF] border border-[#00E5FF]/40 disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Undo
          </Button>
          <Button
            onClick={redo}
            disabled={history.future.length === 0}
            className="flex-1 bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 text-[#00E5FF] border border-[#00E5FF]/40 disabled:opacity-50"
          >
            <RotateCw className="w-4 h-4 mr-2" />
            Redo
          </Button>
        </div>

        {/* History List */}
        <ScrollArea className="h-64">
          <div className="space-y-2">
            {historyItems.map((item, index) => (
              <div
                key={item.id}
                className={`
                  bg-[#101828] rounded-lg p-3 border transition-all cursor-pointer
                  ${index === 0 ? "border-[#00E5FF]/40 bg-[#00E5FF]/5" : "border-[#00E5FF]/10 hover:border-[#00E5FF]/20"}
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{getActionIcon(item.action)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.description}</p>
                      <p className="text-xs text-gray-400">{formatTimeAgo(item.timestamp)}</p>
                    </div>
                  </div>
                  {index === 0 && (
                    <Badge variant="secondary" className="bg-[#00E5FF]/20 text-[#00E5FF] text-xs">
                      Current
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* History Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-[#00E5FF]/15">
          <span>{historyItems.length} actions recorded</span>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-gray-400 hover:text-red-400">
            <Trash2 className="w-3 h-3 mr-1" />
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
