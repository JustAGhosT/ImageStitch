import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

export interface ImageData {
  id: string
  name: string
  url: string
  element?: HTMLImageElement
  width: number
  height: number
  size: number
}

export interface HistoryState {
  images: ImageData[]
  zoom: number
  panOffset: { x: number; y: number }
  currentTool: string
  comparisonMode: string
}

export interface AppState {
  // UI State
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void

  // Images
  images: ImageData[]
  addImage: (image: ImageData) => void
  removeImage: (id: string) => void
  clearImages: () => void

  // Canvas State
  zoom: number
  setZoom: (zoom: number) => void
  panOffset: { x: number; y: number }
  setPanOffset: (offset: { x: number; y: number }) => void

  // Tools
  currentTool:
    | "select"
    | "draw"
    | "measure"
    | "pan"
    | "rotate-cw"
    | "rotate-ccw"
    | "flip-h"
    | "flip-v"
    | "crop"
    | "contrast"
    | "brightness"
    | "color"
  setCurrentTool: (tool: AppState["currentTool"]) => void

  // Comparison
  comparisonMode: "single" | "side-by-side" | "overlay" | "split" | "difference"
  setComparisonMode: (mode: AppState["comparisonMode"]) => void

  // Drawing
  drawingColor: string
  setDrawingColor: (color: string) => void
  strokeWidth: number
  setStrokeWidth: (width: number) => void
  opacity: number
  setOpacity: (opacity: number) => void

  // View
  viewMode: "single" | "split"
  setViewMode: (mode: "single" | "split") => void
  showGrid: boolean
  setShowGrid: (show: boolean) => void

  // History
  history: HistoryState[]
  historyIndex: number
  canUndo: boolean
  canRedo: boolean
  undo: () => void
  redo: () => void
  saveToHistory: () => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // UI State
        sidebarCollapsed: false,
        setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

        // Images
        images: [],
        addImage: (image) => {
          set((state) => ({
            images: [...state.images, image],
          }))
          get().saveToHistory()
        },
        removeImage: (id) => {
          set((state) => ({
            images: state.images.filter((img) => img.id !== id),
          }))
          get().saveToHistory()
        },
        clearImages: () => {
          set({ images: [] })
          get().saveToHistory()
        },

        // Canvas State
        zoom: 1,
        setZoom: (zoom) => set({ zoom }),
        panOffset: { x: 0, y: 0 },
        setPanOffset: (offset) => set({ panOffset: offset }),

        // Tools
        currentTool: "select",
        setCurrentTool: (tool) => set({ currentTool: tool }),

        // Comparison
        comparisonMode: "single",
        setComparisonMode: (mode) => set({ comparisonMode: mode }),

        // Drawing
        drawingColor: "#ff0000",
        setDrawingColor: (color) => set({ drawingColor: color }),
        strokeWidth: 2,
        setStrokeWidth: (width) => set({ strokeWidth: width }),
        opacity: 0.5,
        setOpacity: (opacity) => set({ opacity }),

        // View
        viewMode: "single",
        setViewMode: (mode) => set({ viewMode: mode }),
        showGrid: false,
        setShowGrid: (show) => set({ showGrid: show }),

        // History
        history: [],
        historyIndex: -1,
        canUndo: false,
        canRedo: false,

        saveToHistory: () => {
          const state = get()
          const currentState: HistoryState = {
            images: state.images,
            zoom: state.zoom,
            panOffset: state.panOffset,
            currentTool: state.currentTool,
            comparisonMode: state.comparisonMode,
          }

          const newHistory = state.history.slice(0, state.historyIndex + 1)
          newHistory.push(currentState)

          // Limit history to 50 entries
          if (newHistory.length > 50) {
            newHistory.shift()
          }

          set({
            history: newHistory,
            historyIndex: newHistory.length - 1,
            canUndo: newHistory.length > 1,
            canRedo: false,
          })
        },

        undo: () => {
          const state = get()
          if (state.canUndo && state.historyIndex > 0) {
            const newIndex = state.historyIndex - 1
            const historyState = state.history[newIndex]

            set({
              ...historyState,
              historyIndex: newIndex,
              canUndo: newIndex > 0,
              canRedo: true,
            })
          }
        },

        redo: () => {
          const state = get()
          if (state.canRedo && state.historyIndex < state.history.length - 1) {
            const newIndex = state.historyIndex + 1
            const historyState = state.history[newIndex]

            set({
              ...historyState,
              historyIndex: newIndex,
              canUndo: true,
              canRedo: newIndex < state.history.length - 1,
            })
          }
        },
      }),
      {
        name: "image-compare-store",
        partialize: (state) => ({
          sidebarCollapsed: state.sidebarCollapsed,
          drawingColor: state.drawingColor,
          strokeWidth: state.strokeWidth,
          opacity: state.opacity,
          showGrid: state.showGrid,
        }),
      },
    ),
    {
      name: "image-compare-store",
    },
  ),
)
