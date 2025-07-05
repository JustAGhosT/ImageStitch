"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore } from "@/src/store/useAppStore"
import { cn } from "@/lib/utils"
import { Layers, Split, FileSlidersIcon as Slider } from "lucide-react"

interface ComparisonModeSelectorProps {
  className?: string
}

export const ComparisonModeSelector: React.FC<ComparisonModeSelectorProps> = ({ className }) => {
  const { comparisonMode, setComparisonMode } = useAppStore()

  const modes = [
    {
      id: "overlay" as const,
      name: "Overlay",
      description: "Layer images on top of each other",
      icon: Layers,
      shortcut: "1",
    },
    {
      id: "split" as const,
      name: "Split View",
      description: "Show images side by side",
      icon: Split,
      shortcut: "2",
    },
    {
      id: "slider" as const,
      name: "Slider",
      description: "Interactive comparison slider",
      icon: Slider,
      shortcut: "3",
    },
  ]

  return (
    <Card className={cn("bg-[#0B1120]/50 border-[#00E5FF]/20", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-[#00E5FF]">Comparison Mode</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {modes.map((mode) => (
          <Button
            key={mode.id}
            variant={comparisonMode === mode.id ? "default" : "outline"}
            size="sm"
            onClick={() => setComparisonMode(mode.id)}
            className={cn(
              "w-full justify-start text-xs h-auto p-3",
              comparisonMode === mode.id
                ? "bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF]"
                : "border-[#00E5FF]/40 text-gray-300 hover:text-[#00E5FF] bg-transparent hover:bg-[#00E5FF]/10",
            )}
          >
            <div className="flex items-center space-x-3 w-full">
              <mode.icon className="w-4 h-4 shrink-0" />
              <div className="flex-1 text-left">
                <div className="font-medium">{mode.name}</div>
                <div className="text-xs opacity-70">{mode.description}</div>
              </div>
              <div className="text-xs opacity-50 font-mono">{mode.shortcut}</div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
