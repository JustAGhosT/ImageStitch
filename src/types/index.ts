export interface Point {
  x: number
  y: number
}

export interface ImageState {
  id: string
  file: File
  url: string
  metadata: {
    width: number
    height: number
    size: number
    format: string
    lastModified: Date
  }
  thumbnail?: string
  annotations: Annotation[]
}

export interface Annotation {
  id: string
  type: "rectangle" | "circle" | "pen" | "text" | "measurement"
  data: any
  style: {
    strokeColor: string
    strokeWidth: number
    fillColor?: string
  }
  timestamp: Date
}

export type ComparisonMode = "overlay" | "split" | "slider"

export type DrawingTool = "move" | "rectangle" | "circle" | "pen" | "text" | "measurement" | "colorPicker" | "crop"

export interface ImageData {
  id: number
  name: string
  url: string
  size: number
  width: number
  height: number
  type: string
  uploadProgress?: number
}

export interface UIState {
  zoom: number
  showGrid: boolean
  selectedTool: string
  strokeWidth: number
  strokeColor: string
  sidebarCollapsed: boolean
}

export interface HistoryState {
  past: any[]
  present: any
  future: any[]
}

export interface AppState {
  images: ImageData[]
  comparisonMode: ComparisonMode
  ui: UIState
  history: HistoryState
}

export interface DrawingElement {
  id: string
  type: DrawingTool
  x: number
  y: number
  width?: number
  height?: number
  strokeColor: string
  strokeWidth: number
  fillColor?: string
  text?: string
  fontSize?: number
  points?: { x: number; y: number }[]
}

export interface User {
  id: string
  name: string
  avatar?: string
  color: string
}

export interface Comment {
  id: string
  author: User
  content: string
  timestamp: Date
  replies: Comment[]
}

export interface CollaborationState {
  sessionId: string
  participants: User[]
  sharedAnnotations: Annotation[]
  realTimeUpdates: boolean
  commentThread: Comment[]
}

export interface AccessibilitySettings {
  clickDelay: number
  dragThreshold: number
  doubleClickSpeed: number
  touchTargetSize: number
  reducedMotion: boolean
  highContrast: boolean
}

export interface Plugin {
  name: string
  version: string
  activate: (api: PluginAPI) => void
  deactivate: () => void
}

export interface PluginAPI {
  registerTool: (tool: DrawingTool) => void
  registerExporter: (exporter: ExportFormat) => void
  getImages: () => ImageState[]
  getAnnotations: () => Annotation[]
}

export interface ExportFormat {
  name: string
  extension: string
  export: (data: ExportData) => Promise<Blob>
}

export interface ExportData {
  images: ImageState[]
  annotations: Annotation[]
  settings: any
}

export interface DockPosition {
  type: "floating" | "top" | "bottom" | "left" | "right"
  x?: number
  y?: number
}

export interface ToolbarState {
  position: DockPosition
  isDragging: boolean
  showDockZones: boolean
}
