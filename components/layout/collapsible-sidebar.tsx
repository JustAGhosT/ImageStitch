"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Settings,
  Layers,
  Palette,
  Move,
  RotateCcw,
  Download,
  Share2,
  History,
} from "lucide-react"
import { useAppStore } from "@/src/store/useAppStore"
import { ImageUploadZone } from "@/src/components/features/image-upload/image-upload-zone"
import { ImageThumbnails } from "@/src/components/features/image-upload/image-thumbnails"
import { ComparisonModeSelector } from "@/components/features/comparison-modes/comparison-mode-selector"
import { DrawingToolbar } from "@/components/features/drawing-tools/drawing-toolbar"

export function CollapsibleSidebar() {
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    images,
    currentTool,
    setCurrentTool,
    comparisonMode,
    setComparisonMode,
    canUndo,
    canRedo,
    undo,
    redo,
  } = useAppStore()

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const tools = [
    { id: "select", icon: Move, label: "Select", shortcut: "V" },
    { id: "draw", icon: Palette, label: "Draw", shortcut: "B" },
    { id: "measure", icon: Layers, label: "Measure", shortcut: "M" },
  ]

  return (
    <div
      className={`
      relative bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
      ${sidebarCollapsed ? "w-12" : "w-80"}
      flex flex-col h-full
    `}
    >
      {/* Collapse Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSidebar}
        className="absolute -right-3 top-4 z-10 h-6 w-6 rounded-full border bg-white shadow-md hover:bg-gray-50"
      >
        {sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      {/* Sidebar Content */}
      <div className={`flex-1 overflow-hidden ${sidebarCollapsed ? "hidden" : "block"}`}>
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">ImageCompare Pro</h2>
            <Badge variant="secondary" className="text-xs">
              v2.0
            </Badge>
          </div>

          <Separator />

          {/* Main Tabs */}
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload" className="text-xs">
                <ImageIcon className="h-3 w-3 mr-1" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="tools" className="text-xs">
                <Settings className="h-3 w-3 mr-1" />
                Tools
              </TabsTrigger>
              <TabsTrigger value="compare" className="text-xs">
                <ImageIcon className="h-3 w-3 mr-1" />
                Compare
              </TabsTrigger>
            </TabsList>

            {/* Upload Tab */}
            <TabsContent value="upload" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Image Upload</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ImageUploadZone />
                  {images.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-700">Uploaded Images ({images.length})</h4>
                      <ImageThumbnails />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tools Tab */}
            <TabsContent value="tools" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Drawing Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <DrawingToolbar />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Quick Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {tools.map((tool) => (
                    <Button
                      key={tool.id}
                      variant={currentTool === tool.id ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setCurrentTool(tool.id as any)}
                    >
                      <tool.icon className="h-4 w-4 mr-2" />
                      {tool.label}
                      <Badge variant="outline" className="ml-auto text-xs">
                        {tool.shortcut}
                      </Badge>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!canUndo}
                      onClick={undo}
                      className="flex-1 bg-transparent"
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Undo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!canRedo}
                      onClick={redo}
                      className="flex-1 bg-transparent"
                    >
                      <History className="h-3 w-3 mr-1" />
                      Redo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Compare Tab */}
            <TabsContent value="compare" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Comparison Mode</CardTitle>
                </CardHeader>
                <CardContent>
                  <ComparisonModeSelector />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Export & Share</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Export Results
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Project
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Collapsed State - Icon Only */}
      {sidebarCollapsed && (
        <div className="flex flex-col items-center py-4 space-y-3">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setSidebarCollapsed(false)}>
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ImageIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
