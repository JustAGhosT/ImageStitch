"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Users, MessageCircle, Share2, Crown, Eye } from "lucide-react"
import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { User, Comment } from "@/types"

const mockUsers: User[] = [
  { id: "1", name: "Alice Johnson", avatar: "/placeholder-user.jpg", color: "#00E5FF" },
  { id: "2", name: "Bob Smith", avatar: "/placeholder-user.jpg", color: "#FF4DA3" },
  { id: "3", name: "Carol Davis", avatar: "/placeholder-user.jpg", color: "#3FFFA0" },
]

export const CollaborationPanel: React.FC = () => {
  const { collaboration } = useAppStore()
  const [isConnected, setIsConnected] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState<Comment[]>([])

  useEffect(() => {
    // Simulate WebSocket connection
    const timer = setTimeout(() => setIsConnected(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: crypto.randomUUID(),
      author: mockUsers[0],
      content: newComment,
      timestamp: new Date(),
      replies: [],
    }

    setComments((prev) => [...prev, comment])
    setNewComment("")
  }

  const handleShareSession = async () => {
    const sessionUrl = `${window.location.origin}/session/${crypto.randomUUID()}`
    await navigator.clipboard.writeText(sessionUrl)
    // Show toast notification
  }

  return (
    <Card className="bg-[#0B1120]/80 border-[#00E5FF]/15">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-[#00E5FF]" />
          Collaboration
          <Badge variant={isConnected ? "default" : "secondary"} className="ml-auto">
            {isConnected ? "Connected" : "Connecting..."}
          </Badge>
        </CardTitle>
        <CardDescription className="text-gray-400">Work together in real-time with your team</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Active Users */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">Active Users ({mockUsers.length})</h4>
          <div className="flex items-center gap-2">
            {mockUsers.map((user, index) => (
              <div key={user.id} className="relative">
                <Avatar className="w-8 h-8 border-2" style={{ borderColor: user.color }}>
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback style={{ backgroundColor: user.color + "20", color: user.color }}>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {index === 0 && <Crown className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400" />}
                <div
                  className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0B1120]"
                  style={{ backgroundColor: isConnected ? "#3FFFA0" : "#6B7280" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Share Session */}
        <div className="space-y-2">
          <Button
            onClick={handleShareSession}
            className="w-full bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 text-[#00E5FF] border border-[#00E5FF]/40"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Session
          </Button>
        </div>

        {/* Comments */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Comments ({comments.length})
          </h4>

          <div className="space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="bg-[#101828] border-[#00E5FF]/20 text-white placeholder:text-gray-500 resize-none"
              rows={3}
            />
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="w-full bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 text-[#00E5FF] border border-[#00E5FF]/40 disabled:opacity-50"
            >
              Add Comment
            </Button>
          </div>

          <ScrollArea className="h-48">
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-[#101828] rounded-lg p-3 border border-[#00E5FF]/10">
                  <div className="flex items-start gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                      <AvatarFallback
                        style={{ backgroundColor: comment.author.color + "20", color: comment.author.color }}
                      >
                        {comment.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white">{comment.author.name}</span>
                        <span className="text-xs text-gray-500">{comment.timestamp.toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm text-gray-300">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Real-time Indicators */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>2 viewing</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Live updates</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
