"use client"

import type React from "react"
import { useState } from "react"
import { Keyboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

export const KeyboardShortcutsHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  const shortcuts = [
    {
      category: "Tools",
      items: [
        { key: "V", description: "Move tool" },
        { key: "R", description: "Rectangle tool" },
        { key: "C", description: "Circle tool" },
        { key: "B", description: "Pen tool" },
        { key: "T", description: "Text tool" },
        { key: "M", description: "Measurement tool" },
        { key: "I", description: "Color picker" },
      ],
    },
    {
      category: "View",
      items: [
        { key: "G", description: "Toggle grid" },
        { key: "+/=", description: "Zoom in" },
        { key: "-", description: "Zoom out" },
        { key: "0", description: "Reset zoom" },
        { key: "Ctrl+B", description: "Toggle sidebar" },
      ],
    },
    {
      category: "Comparison",
      items: [
        { key: "1", description: "Overlay mode" },
        { key: "2", description: "Split mode" },
        { key: "3", description: "Slider mode" },
      ],
    },
    {
      category: "History",
      items: [
        { key: "Ctrl+Z", description: "Undo" },
        { key: "Ctrl+Y", description: "Redo" },
        { key: "Ctrl+Shift+Z", description: "Redo (alternative)" },
      ],
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-[#00E5FF] p-2 h-8 w-8">
          <Keyboard className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-[#0B1120] border-[#00E5FF]/30">
        <DialogHeader>
          <DialogTitle className="text-[#00E5FF] flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {shortcuts.map((section) => (
            <div key={section.category} className="space-y-3">
              <h3 className="text-sm font-semibold text-[#00E5FF] uppercase tracking-wide">{section.category}</h3>
              <div className="space-y-2">
                {section.items.map((shortcut) => (
                  <div key={shortcut.key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">{shortcut.description}</span>
                    <kbd className="px-2 py-1 text-xs font-mono bg-[#00E5FF]/10 border border-[#00E5FF]/30 rounded text-[#00E5FF]">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
              {section !== shortcuts[shortcuts.length - 1] && <Separator className="bg-[#00E5FF]/15" />}
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Press <kbd className="px-1 py-0.5 text-xs bg-[#00E5FF]/10 border border-[#00E5FF]/30 rounded">?</kbd> to
            toggle this help
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
