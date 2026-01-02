"use client"

import * as React from "react"
import { Star, User, Calendar, Download as DownloadIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Prompt } from "@/types/marketplace"
import { cn } from "@/lib/utils"

interface PromptCardProps {
  prompt: Prompt
  className?: string
  onClick?: () => void
}

export function PromptCard({ prompt, className, onClick }: PromptCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on buttons
    if ((e.target as HTMLElement).closest("button")) {
      return
    }
    onClick?.()
  }

  // Determine platform badge: use targetPlatform if available, otherwise fall back to format
  const platformFeature = prompt.targetPlatform || prompt.format
  const platformDisplayName = platformFeature.charAt(0).toUpperCase() + platformFeature.slice(1).replace(/-/g, " ")
  const businessAreaDisplayName = prompt.businessArea.charAt(0).toUpperCase() + prompt.businessArea.slice(1)

  return (
    <Card 
      className={cn("flex flex-col h-full", onClick && "cursor-pointer hover:shadow-md transition-shadow", className)}
      onClick={handleCardClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{prompt.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {prompt.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground shrink-0">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{prompt.rating.average.toFixed(1)}</span>
              <span className="text-xs">({prompt.rating.count})</span>
            </div>
            <div className="flex items-center gap-1">
              <DownloadIcon className="h-4 w-4" />
              <span>{prompt.downloads}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="outline" className="capitalize">{platformDisplayName}</Badge>
          <Badge variant="secondary" className="capitalize">{businessAreaDisplayName}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-end">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          <span>{prompt.author.name}</span>
          <span>•</span>
          <Calendar className="h-3 w-3" />
          <span>{formatDate(prompt.updatedAt)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
