"use client"

import * as React from "react"
import { Package, Calendar, User, GitBranch, Star, FileText, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skill } from "@/types/marketplace"
import { cn } from "@/lib/utils"

interface SkillMetadataTabProps {
  skill: Skill
}

export function SkillMetadataTab({ skill }: SkillMetadataTabProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const metadata = skill.metadata

  if (!metadata) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No metadata available for this skill.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Skill Metadata</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Structured information about this skill, including dependencies and repository details.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Basic Information
          </h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium">Name</div>
                <div className="text-sm text-muted-foreground font-mono">{metadata.name}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium">Author</div>
                <div className="text-sm text-muted-foreground">{skill.author.name}</div>
              </div>
            </div>

            {metadata.description && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Description</div>
                  <div className="text-sm text-muted-foreground">{metadata.description}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Repository & Stats */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Repository & Stats
          </h4>
          <div className="space-y-3">
            {metadata.repository && (
              <div className="flex items-start gap-3">
                <GitBranch className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Repository</div>
                  <div className="text-sm text-muted-foreground font-mono break-all">
                    {metadata.repository}
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 mt-1"
                    onClick={() => {
                      const repoUrl = metadata.repository?.startsWith("http")
                        ? metadata.repository
                        : `https://github.com/${metadata.repository}`
                      window.open(repoUrl, "_blank")
                    }}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Open Repository
                  </Button>
                </div>
              </div>
            )}

            {metadata.stars !== undefined && (
              <div className="flex items-start gap-3">
                <Star className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Stars</div>
                  <div className="text-sm text-muted-foreground">{metadata.stars.toLocaleString()}</div>
                </div>
              </div>
            )}

            {metadata.forks !== undefined && (
              <div className="flex items-start gap-3">
                <GitBranch className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Forks</div>
                  <div className="text-sm text-muted-foreground">{metadata.forks.toLocaleString()}</div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium">Last Updated</div>
                <div className="text-sm text-muted-foreground">{formatDate(skill.updatedAt)}</div>
              </div>
            </div>

            {metadata.license && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium">License</div>
                  <div className="text-sm text-muted-foreground">{metadata.license}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tags */}
      {metadata.tags && metadata.tags.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Tags
          </h4>
          <div className="flex flex-wrap gap-2">
            {metadata.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Dependencies */}
      {metadata.dependencies && metadata.dependencies.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Dependencies
          </h4>
          <div className="flex flex-wrap gap-2">
            {metadata.dependencies.map((dep) => (
              <Badge key={dep} variant="secondary" className="font-mono">
                {dep}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            These skills must be installed before using this skill.
          </p>
        </div>
      )}

      {/* Marketplace Status */}
      {metadata.marketplace !== undefined && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Marketplace Status
          </h4>
          <div className="flex items-center gap-2">
            <Badge variant={metadata.marketplace ? "default" : "outline"}>
              {metadata.marketplace ? "Published" : "Draft"}
            </Badge>
          </div>
        </div>
      )}
    </div>
  )
}
