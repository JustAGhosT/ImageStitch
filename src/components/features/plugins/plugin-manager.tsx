"use client"

import type React from "react"
import { useState } from "react"
import { Puzzle, Download, Settings, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Plugin } from "@/types"

const availablePlugins: Plugin[] = [
  {
    name: "Advanced Filters",
    version: "1.2.0",
    activate: () => console.log("Advanced Filters activated"),
    deactivate: () => console.log("Advanced Filters deactivated"),
  },
  {
    name: "Batch Processing",
    version: "2.1.0",
    activate: () => console.log("Batch Processing activated"),
    deactivate: () => console.log("Batch Processing deactivated"),
  },
  {
    name: "Cloud Sync",
    version: "1.0.5",
    activate: () => console.log("Cloud Sync activated"),
    deactivate: () => console.log("Cloud Sync deactivated"),
  },
]

interface PluginState {
  plugin: Plugin
  enabled: boolean
  installed: boolean
}

export const PluginManager: React.FC = () => {
  const [plugins, setPlugins] = useState<PluginState[]>(
    availablePlugins.map((plugin) => ({
      plugin,
      enabled: false,
      installed: Math.random() > 0.5, // Random for demo
    })),
  )
  const [searchQuery, setSearchQuery] = useState("")

  const togglePlugin = (index: number) => {
    setPlugins((prev) =>
      prev.map((p, i) =>
        i === index
          ? {
              ...p,
              enabled: !p.enabled,
            }
          : p,
      ),
    )

    const plugin = plugins[index]
    if (plugin.enabled) {
      plugin.plugin.deactivate()
    } else {
      plugin.plugin.activate({
        registerTool: (tool) => console.log("Registered tool:", tool),
        registerExporter: (exporter) => console.log("Registered exporter:", exporter),
        getImages: () => [],
        getAnnotations: () => [],
      })
    }
  }

  const installPlugin = (index: number) => {
    setPlugins((prev) =>
      prev.map((p, i) =>
        i === index
          ? {
              ...p,
              installed: true,
            }
          : p,
      ),
    )
  }

  const uninstallPlugin = (index: number) => {
    setPlugins((prev) =>
      prev.map((p, i) =>
        i === index
          ? {
              ...p,
              installed: false,
              enabled: false,
            }
          : p,
      ),
    )
  }

  const filteredPlugins = plugins.filter((p) => p.plugin.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <Card className="bg-[#0B1120]/80 border-[#00E5FF]/15">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Puzzle className="w-5 h-5 text-[#00E5FF]" />
          Plugin Manager
        </CardTitle>
        <CardDescription className="text-gray-400">Extend functionality with plugins</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input
          placeholder="Search plugins..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-[#101828] border-[#00E5FF]/20 text-white placeholder:text-gray-500"
        />

        <div className="space-y-3">
          {filteredPlugins.map((pluginState, index) => (
            <div key={pluginState.plugin.name} className="bg-[#101828] rounded-lg p-4 border border-[#00E5FF]/10">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-sm font-medium text-white">{pluginState.plugin.name}</h4>
                  <p className="text-xs text-gray-400">Version {pluginState.plugin.version}</p>
                </div>
                <div className="flex items-center gap-2">
                  {pluginState.installed && (
                    <Badge
                      variant={pluginState.enabled ? "default" : "secondary"}
                      className={pluginState.enabled ? "bg-green-500/20 text-green-400" : ""}
                    >
                      {pluginState.enabled ? "Active" : "Inactive"}
                    </Badge>
                  )}
                  {!pluginState.installed && (
                    <Badge variant="outline" className="text-gray-400">
                      Not Installed
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {pluginState.installed ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={pluginState.enabled}
                          onCheckedChange={() => togglePlugin(index)}
                          disabled={!pluginState.installed}
                        />
                        <span className="text-xs text-gray-400">{pluginState.enabled ? "Enabled" : "Disabled"}</span>
                      </div>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => installPlugin(index)}
                      className="bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 text-[#00E5FF] border border-[#00E5FF]/40"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Install
                    </Button>
                  )}
                </div>

                {pluginState.installed && (
                  <div className="flex items-center gap-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-[#00E5FF]">
                          <Settings className="w-3 h-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#0B1120] border-[#00E5FF]/15 text-white">
                        <DialogHeader>
                          <DialogTitle className="text-[#00E5FF]">{pluginState.plugin.name} Settings</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Configure plugin settings and preferences
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-sm text-gray-300">Plugin-specific settings would appear here.</p>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => uninstallPlugin(index)}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredPlugins.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Puzzle className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p>No plugins found matching your search.</p>
          </div>
        )}

        <div className="pt-4 border-t border-[#00E5FF]/15">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{plugins.filter((p) => p.installed).length} installed</span>
            <span>{plugins.filter((p) => p.enabled).length} active</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
