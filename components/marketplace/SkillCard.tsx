"use client"

import * as React from "react"
import { Star, User, Calendar, Download as DownloadIcon, Package } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skill } from "@/types/marketplace"
import { cn } from "@/lib/utils"

interface SkillCardProps {
  skill: Skill
  className?: string
  onClick?: () => void
}

export function SkillCard({ skill, className, onClick }: SkillCardProps) {
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

  const skillContent = skill.skillContent || skill.content
  const metadata = skill.metadata

  return (
    <Card 
      className={cn("flex flex-col", onClick && "cursor-pointer hover:shadow-md transition-shadow", className)}
      onClick={handleCardClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{skill.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {metadata?.description || skill.description}
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="capitalize">{skill.format}</Badge>
          <Badge variant="secondary" className="capitalize">{skill.businessArea}</Badge>
          {metadata?.version && (
            <Badge variant="outline">v{metadata.version}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{skill.rating.average.toFixed(1)}</span>
              <span className="text-xs">({skill.rating.count})</span>
            </div>
            <div className="flex items-center gap-1">
              <DownloadIcon className="h-4 w-4" />
              <span>{skill.downloads}</span>
            </div>
          </div>
          {(metadata?.dependencies && metadata.dependencies.length > 0) || (skill.dependencies && skill.dependencies.length > 0) ? (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Package className="h-3 w-3" />
              <span>Requires: {(metadata?.dependencies || skill.dependencies || []).join(", ")}</span>
            </div>
          ) : null}
          <div className="flex flex-wrap gap-1">
            {skill.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {skill.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{skill.tags.length - 3}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span>{skill.author.name}</span>
            <span>•</span>
            <Calendar className="h-3 w-3" />
            <span>{formatDate(skill.updatedAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

