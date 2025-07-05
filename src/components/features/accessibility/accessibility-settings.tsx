"use client"

import type React from "react"
import { useAppStore } from "@/store/useAppStore"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const AccessibilitySettings: React.FC = () => {
  const { accessibility, updateAccessibility } = useAppStore()

  return (
    <Card className="bg-[#0B1120]/80 border-[#00E5FF]/15">
      <CardHeader>
        <CardTitle className="text-white">Accessibility Settings</CardTitle>
        <CardDescription className="text-gray-400">Customize the interface for better accessibility</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="high-contrast" className="text-sm text-gray-300">
            High Contrast Mode
          </Label>
          <Switch
            id="high-contrast"
            checked={accessibility.highContrast}
            onCheckedChange={(checked) => updateAccessibility({ highContrast: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="reduced-motion" className="text-sm text-gray-300">
            Reduce Motion
          </Label>
          <Switch
            id="reduced-motion"
            checked={accessibility.reducedMotion}
            onCheckedChange={(checked) => updateAccessibility({ reducedMotion: checked })}
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm text-gray-300">Click Delay ({accessibility.clickDelay}ms)</Label>
          <Slider
            value={[accessibility.clickDelay]}
            onValueChange={(value) => updateAccessibility({ clickDelay: value[0] })}
            max={1000}
            min={0}
            step={50}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm text-gray-300">Drag Threshold ({accessibility.dragThreshold}px)</Label>
          <Slider
            value={[accessibility.dragThreshold]}
            onValueChange={(value) => updateAccessibility({ dragThreshold: value[0] })}
            max={20}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm text-gray-300">Touch Target Size ({accessibility.touchTargetSize}px)</Label>
          <Slider
            value={[accessibility.touchTargetSize]}
            onValueChange={(value) => updateAccessibility({ touchTargetSize: value[0] })}
            max={60}
            min={32}
            step={4}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  )
}
