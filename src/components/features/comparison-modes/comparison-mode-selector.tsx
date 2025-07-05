"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/store/useAppStore"
import { cn } from "@/lib/utils"

export const ComparisonModeSelector: React.FC = () => {
  const { comparisonMode, setComparisonMode } = useAppStore()

  const modes = [
    { id: "overlay", label: "Overlay", description: "Layer images on top of each other" },
    { id: "split", label: "Split", description: "Show images side by side" },
    { id: "slider", label: "Slider", description: "Use a slider to reveal differences" },
  ] as const

  return (
    <div className="space-y-2">
      {modes.map((mode) => (
        <Button
          key={mode.id}
          variant={comparisonMode === mode.id ? "default" : "outline"}
          size="sm"
          onClick={() => setComparisonMode(mode.id)}
          className={cn(
            "w-full justify-start text-left",
            comparisonMode === mode.id ? "bg-primary text-primary-foreground" : "bg-transparent hover:bg-accent",
          )}
        >
          <div>
            <div className="font-medium">{mode.label}</div>
            <div className="text-xs opacity-70">{mode.description}</div>
          </div>
        </Button>
      ))}
    </div>
  )
}
