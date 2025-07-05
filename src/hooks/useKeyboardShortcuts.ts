"use client"

import { useEffect } from "react"
import { useAppStore } from "@/src/store/useAppStore"

export const useKeyboardShortcuts = () => {
  const { updateUI, undo, redo, ui, setComparisonMode } = useAppStore()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return
      }

      const { ctrlKey, metaKey, shiftKey, key } = event
      const isModifierPressed = ctrlKey || metaKey

      // File operations
      if (isModifierPressed) {
        switch (key.toLowerCase()) {
          case "z":
            event.preventDefault()
            if (shiftKey) {
              redo()
            } else {
              undo()
            }
            break
          case "y":
            event.preventDefault()
            redo()
            break
          case "s":
            event.preventDefault()
            // Save functionality would go here
            console.log("Save shortcut triggered")
            break
          case "o":
            event.preventDefault()
            // Open functionality would go here
            console.log("Open shortcut triggered")
            break
          case "n":
            event.preventDefault()
            // New project functionality would go here
            console.log("New project shortcut triggered")
            break
          case "e":
            event.preventDefault()
            // Export functionality would go here
            console.log("Export shortcut triggered")
            break
        }
        return
      }

      // Tool shortcuts (without modifier keys)
      switch (key.toLowerCase()) {
        case "v":
          event.preventDefault()
          updateUI({ selectedTool: "move" })
          break
        case "r":
          event.preventDefault()
          updateUI({ selectedTool: "rectangle" })
          break
        case "c":
          event.preventDefault()
          updateUI({ selectedTool: "circle" })
          break
        case "p":
          event.preventDefault()
          updateUI({ selectedTool: "pen" })
          break
        case "t":
          event.preventDefault()
          updateUI({ selectedTool: "text" })
          break
        case "m":
          event.preventDefault()
          updateUI({ selectedTool: "measurement" })
          break
        case "i":
          event.preventDefault()
          updateUI({ selectedTool: "colorPicker" })
          break
        case "g":
          event.preventDefault()
          updateUI({ showGrid: !ui.showGrid })
          break
        case "=":
        case "+":
          event.preventDefault()
          updateUI({ zoom: Math.min(400, ui.zoom + 25) })
          break
        case "-":
          event.preventDefault()
          updateUI({ zoom: Math.max(25, ui.zoom - 25) })
          break
        case "0":
          event.preventDefault()
          updateUI({ zoom: 100 })
          break
        case "1":
          event.preventDefault()
          setComparisonMode("overlay")
          break
        case "2":
          event.preventDefault()
          setComparisonMode("split")
          break
        case "3":
          event.preventDefault()
          setComparisonMode("slider")
          break
        case "f1":
          event.preventDefault()
          // Show help modal
          console.log("Help shortcut triggered")
          break
        case "escape":
          event.preventDefault()
          updateUI({ selectedTool: "move" })
          break
      }
    }

    // Add event listener
    document.addEventListener("keydown", handleKeyDown)

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [updateUI, undo, redo, ui, setComparisonMode])

  // Return keyboard shortcut info for help display
  return {
    shortcuts: [
      { key: "V", description: "Move tool" },
      { key: "R", description: "Rectangle tool" },
      { key: "C", description: "Circle tool" },
      { key: "P", description: "Pen tool" },
      { key: "T", description: "Text tool" },
      { key: "M", description: "Measurement tool" },
      { key: "I", description: "Color picker tool" },
      { key: "G", description: "Toggle grid" },
      { key: "+/-", description: "Zoom in/out" },
      { key: "0", description: "Reset zoom" },
      { key: "1/2/3", description: "Comparison modes" },
      { key: "Ctrl+Z", description: "Undo" },
      { key: "Ctrl+Y", description: "Redo" },
      { key: "Ctrl+S", description: "Save" },
      { key: "Ctrl+O", description: "Open" },
      { key: "Ctrl+N", description: "New project" },
      { key: "Ctrl+E", description: "Export" },
      { key: "F1", description: "Help" },
      { key: "Escape", description: "Select move tool" },
    ],
  }
}
