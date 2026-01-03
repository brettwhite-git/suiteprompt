"use client"

import * as React from "react"
import { Star, User, Calendar, Download as DownloadIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CopyButton } from "./CopyButton"
import { DownloadButton } from "./DownloadButton"
import { Skill } from "@/types/marketplace"
import { cn } from "@/lib/utils"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

interface SkillContentTabProps {
  skill: Skill
}

export function SkillContentTab({ skill }: SkillContentTabProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get the full skill content
  const skillContent = React.useMemo(() => {
    return skill.skillContent || skill.content || ""
  }, [skill.skillContent, skill.content])

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{skill.title}</h2>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{skill.author.name}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(skill.updatedAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="capitalize">{skill.format}</Badge>
          <Badge variant="secondary" className="capitalize">{skill.businessArea}</Badge>
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{skill.rating.average.toFixed(1)}</span>
            <span className="text-muted-foreground">({skill.rating.count})</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <DownloadIcon className="h-4 w-4" />
            <span>{skill.downloads} downloads</span>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">About this skill</h3>
        <p className="text-muted-foreground">
          {skill.metadata?.description || skill.description}
        </p>
      </div>

      {/* Dependencies */}
      {skill.metadata?.dependencies && skill.metadata.dependencies.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Dependencies</h3>
          <div className="flex flex-wrap gap-2">
            {skill.metadata.dependencies.map((dep) => (
              <Badge key={dep} variant="outline" className="font-mono">
                {dep}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Skill Content - Full SKILL.md in Code Block */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Skill Documentation</h3>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-muted-foreground">SKILL.md</h4>
            <CopyButton
              content={skillContent}
              variant="ghost"
              size="sm"
            />
          </div>
          <div className="relative">
            <SyntaxHighlighter
              language="markdown"
              style={vscDarkPlus}
              customStyle={{
                borderRadius: "0.5rem",
                padding: "1rem",
                fontSize: "0.875rem",
                lineHeight: "1.5",
                margin: 0,
              }}
              PreTag="div"
            >
              {skillContent}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {skill.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 pt-4 border-t">
        <CopyButton
          content={skillContent}
          variant="default"
          size="default"
        />
        <DownloadButton
          content={skillContent}
          filename={`${skill.metadata?.name || skill.title.replace(/\s+/g, "-").toLowerCase()}.md`}
          variant="outline"
          size="default"
        />
      </div>
    </div>
  )
}
