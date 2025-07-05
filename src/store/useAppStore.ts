"use client"

import { create } from "zustand"
import { devtools, subscribeWithSelector } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

// Types
export interface ImageData {
  id: string
  name: string
  url: string
  size: number
  width: number
  height: number
  type: string
  thumbnail?: string
}

export interface UIState {
  zoom: number
  showGrid: boolean
  selectedTool: string
  strokeWidth: number
  strokeColor: string
  sidebarCollapsed: boolean
  panX: number
  panY: number
}

export interface HistoryState {
  past: any[]
  present: any
  future: any[]
}

export interface AppState {
  // Images
  images: ImageData[]
  selectedImageIds: string[]

  // Comparison
  comparisonMode: "overlay" | "split" | "slider"

  // UI State
  ui: UIState

  // History
  history: HistoryState

  // Actions
  addImage: (image: ImageData) => void
  removeImage: (id: string) => void
  clearImages: () => void
  selectImage: (id: string) => void
  deselectImage: (id: string) => void
  setComparisonMode: (mode: "overlay" | "split" | "slider") => void
  updateUI: (updates: Partial<UIState>) => void
  undo: () => void
  redo: () => void
  saveToHistory: () => void
}

const initialUIState: UIState = {
  zoom: 100,
  showGrid: false,
  selectedTool: "move",
  strokeWidth: 2,
  strokeColor: "#00E5FF",
  sidebarCollapsed: false,
  panX: 0,
  panY: 0,
}

const initialHistoryState: HistoryState = {
  past: [],
  present: null,
  future: [],
}

export const useAppStore = create<AppState>()(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        // Initial state
        images: [],
        selectedImageIds: [],
        comparisonMode: "overlay",
        ui: initialUIState,
        history: initialHistoryState,

        // Actions
        addImage: (image: ImageData) => {
          set((state) => {
            if (state.images.length < 6) {
              state.images.push(image)
            }
          })
        },

        removeImage: (id: string) => {
          set((state) => {
            state.images = state.images.filter((img) => img.id !== id)
            state.selectedImageIds = state.selectedImageIds.filter((imgId) => imgId !== id)
          })
        },

        clearImages: () => {
          set((state) => {
            state.images = []
            state.selectedImageIds = []
          })
        },

        selectImage: (id: string) => {
          set((state) => {
            if (!state.selectedImageIds.includes(id)) {
              state.selectedImageIds.push(id)
            }
          })
        },

        deselectImage: (id: string) => {
          set((state) => {
            state.selectedImageIds = state.selectedImageIds.filter((imgId) => imgId !== id)
          })
        },

        setComparisonMode: (mode: "overlay" | "split" | "slider") => {
          set((state) => {
            state.comparisonMode = mode
          })
        },

        updateUI: (updates: Partial<UIState>) => {
          set((state) => {
            Object.assign(state.ui, updates)
          })
        },

        saveToHistory: () => {
          set((state) => {
            const currentState = {
              images: state.images,
              selectedImageIds: state.selectedImageIds,
              comparisonMode: state.comparisonMode,
              ui: state.ui,
            }

            state.history.past.push(state.history.present)
            state.history.present = currentState
            state.history.future = []

            // Limit history size
            if (state.history.past.length > 50) {
              state.history.past = state.history.past.slice(-50)
            }
          })
        },

        undo: () => {
          set((state) => {
            if (state.history.past.length > 0) {
              const previous = state.history.past.pop()
              state.history.future.unshift(state.history.present)
              state.history.present = previous

              // Restore state
              if (previous) {
                state.images = previous.images
                state.selectedImageIds = previous.selectedImageIds
                state.comparisonMode = previous.comparisonMode
                state.ui = previous.ui
              }
            }
          })
        },

        redo: () => {
          set((state) => {
            if (state.history.future.length > 0) {
              const next = state.history.future.shift()
              state.history.past.push(state.history.present)
              state.history.present = next

              // Restore state
              if (next) {
                state.images = next.images
                state.selectedImageIds = next.selectedImageIds
                state.comparisonMode = next.comparisonMode
                state.ui = next.ui
              }
            }
          })
        },
      })),
    ),
    {
      name: "image-compare-store",
    },
  ),
)
