"use client"

import * as React from "react"
import { Star, User, Calendar, Download as DownloadIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CopyButton } from "./CopyButton"
import { DownloadButton } from "./DownloadButton"
import { Prompt } from "@/types/marketplace"
import { cn } from "@/lib/utils"

interface PromptCardProps {
  prompt: Prompt
  className?: string
}

export function PromptCard({ prompt, className }: PromptCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{prompt.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {prompt.description}
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline">{prompt.category}</Badge>
          {prompt.chatbot && (
            <Badge variant="secondary">{prompt.chatbot}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
          <div className="flex flex-wrap gap-1">
            {prompt.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {prompt.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{prompt.tags.length - 3}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span>{prompt.author.name}</span>
            <span>•</span>
            <Calendar className="h-3 w-3" />
            <span>{formatDate(prompt.updatedAt)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <CopyButton
          content={prompt.content}
          variant="outline"
          size="sm"
          className="flex-1"
        />
        <DownloadButton
          content={prompt.content}
          filename={`${prompt.title.replace(/\s+/g, "-").toLowerCase()}.txt`}
          variant="outline"
          size="sm"
          className="flex-1"
        />
      </CardFooter>
    </Card>
  )
}

