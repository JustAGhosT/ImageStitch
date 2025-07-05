"use client"

import { useEffect } from "react"
import { useAppStore } from "@/src/store/useAppStore"

export function useKeyboardShortcuts() {
  const {
    setCurrentTool,
    setZoom,
    zoom,
    undo,
    redo,
    canUndo,
    canRedo,
    setComparisonMode,
    comparisonMode,
    setViewMode,
    viewMode,
    setShowGrid,
    showGrid,
  } = useAppStore()

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

      const { key, ctrlKey, metaKey, shiftKey, altKey } = event
      const isModifierPressed = ctrlKey || metaKey

      // Tool shortcuts
      switch (key.toLowerCase()) {
        case "v":
          if (!isModifierPressed) {
            event.preventDefault()
            setCurrentTool("select")
          }
          break
        case "b":
          if (!isModifierPressed) {
            event.preventDefault()
            setCurrentTool("draw")
          }
          break
        case "m":
          if (!isModifierPressed) {
            event.preventDefault()
            setCurrentTool("measure")
          }
          break
        case "h":
          if (!isModifierPressed) {
            event.preventDefault()
            setCurrentTool("flip-h")
          }
          break
        case "r":
          if (!isModifierPressed) {
            event.preventDefault()
            if (shiftKey) {
              setCurrentTool("rotate-ccw")
            } else {
              setCurrentTool("rotate-cw")
            }
          }
          break
        case "c":
          if (!isModifierPressed) {
            event.preventDefault()
            setCurrentTool("crop")
          }
          break
      }

      // Zoom shortcuts
      if (isModifierPressed) {
        switch (key) {
          case "=":
          case "+":
            event.preventDefault()
            setZoom(Math.min(zoom * 1.2, 5))
            break
          case "-":
            event.preventDefault()
            setZoom(Math.max(zoom / 1.2, 0.1))
            break
          case "0":
            event.preventDefault()
            setZoom(1)
            break
        }
      }

      // History shortcuts
      if (isModifierPressed) {
        switch (key.toLowerCase()) {
          case "z":
            event.preventDefault()
            if (shiftKey && canRedo) {
              redo()
            } else if (canUndo) {
              undo()
            }
            break
          case "y":
            if (canRedo) {
              event.preventDefault()
              redo()
            }
            break
        }
      }

      // Comparison mode shortcuts
      if (altKey) {
        switch (key) {
          case "1":
            event.preventDefault()
            setComparisonMode("single")
            break
          case "2":
            event.preventDefault()
            setComparisonMode("side-by-side")
            break
          case "3":
            event.preventDefault()
            setComparisonMode("overlay")
            break
          case "4":
            event.preventDefault()
            setComparisonMode("split")
            break
          case "5":
            event.preventDefault()
            setComparisonMode("difference")
            break
        }
      }

      // View shortcuts
      switch (key.toLowerCase()) {
        case "tab":
          if (!isModifierPressed) {
            event.preventDefault()
            setViewMode(viewMode === "single" ? "split" : "single")
          }
          break
        case "g":
          if (!isModifierPressed) {
            event.preventDefault()
            setShowGrid(!showGrid)
          }
          break
        case " ":
          event.preventDefault()
          setCurrentTool("pan")
          break
      }

      // Function key shortcuts
      switch (key) {
        case "F1":
          event.preventDefault()
          // Show help modal
          break
        case "F11":
          event.preventDefault()
          // Toggle fullscreen
          break
        case "Escape":
          event.preventDefault()
          setCurrentTool("select")
          break
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      // Reset pan tool when spacebar is released
      if (event.key === " ") {
        setCurrentTool("select")
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("keyup", handleKeyUp)
    }
  }, [
    setCurrentTool,
    setZoom,
    zoom,
    undo,
    redo,
    canUndo,
    canRedo,
    setComparisonMode,
    comparisonMode,
    setViewMode,
    viewMode,
    setShowGrid,
    showGrid,
  ])

  // Return keyboard shortcut information for help display
  return {
    shortcuts: [
      {
        category: "Tools",
        shortcuts: [
          { key: "V", description: "Select tool" },
          { key: "B", description: "Draw tool" },
          { key: "M", description: "Measure tool" },
          { key: "H", description: "Flip horizontal" },
          { key: "R", description: "Rotate right" },
          { key: "Shift+R", description: "Rotate left" },
          { key: "C", description: "Crop tool" },
          { key: "Space", description: "Pan tool (hold)" },
        ],
      },
      {
        category: "Zoom",
        shortcuts: [
          { key: "Ctrl/Cmd + +", description: "Zoom in" },
          { key: "Ctrl/Cmd + -", description: "Zoom out" },
          { key: "Ctrl/Cmd + 0", description: "Reset zoom" },
        ],
      },
      {
        category: "History",
        shortcuts: [
          { key: "Ctrl/Cmd + Z", description: "Undo" },
          { key: "Ctrl/Cmd + Shift + Z", description: "Redo" },
          { key: "Ctrl/Cmd + Y", description: "Redo" },
        ],
      },
      {
        category: "Comparison",
        shortcuts: [
          { key: "Alt + 1", description: "Single view" },
          { key: "Alt + 2", description: "Side by side" },
          { key: "Alt + 3", description: "Overlay" },
          { key: "Alt + 4", description: "Split view" },
          { key: "Alt + 5", description: "Difference" },
        ],
      },
      {
        category: "View",
        shortcuts: [
          { key: "Tab", description: "Toggle view mode" },
          { key: "G", description: "Toggle grid" },
          { key: "Esc", description: "Reset to select tool" },
          { key: "F1", description: "Show help" },
          { key: "F11", description: "Toggle fullscreen" },
        ],
      },
    ],
  }
}
