"use client"

import * as React from "react"
import { Star, User, Calendar, Download as DownloadIcon, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CopyButton } from "./CopyButton"
import { DownloadButton } from "./DownloadButton"
import { Button } from "@/components/ui/button"
import { Prompt } from "@/types/marketplace"
import { cn } from "@/lib/utils"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

interface PromptContentTabProps {
  prompt: Prompt
}

export function PromptContentTab({ prompt }: PromptContentTabProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Extract input variables from prompt content (e.g., [CRITERIA], [ISSUE])
  const extractInputVariables = (content: string): string[] => {
    const matches = content.match(/\[([A-Z_]+)\]/g)
    return matches ? [...new Set(matches)] : []
  }

  const inputVariables = prompt.inputVariables || extractInputVariables(prompt.content)

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{prompt.title}</h2>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{prompt.author.name}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(prompt.updatedAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{prompt.category}</Badge>
          {prompt.chatbot && (
            <Badge variant="secondary">{prompt.chatbot}</Badge>
          )}
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{prompt.rating.average.toFixed(1)}</span>
            <span className="text-muted-foreground">({prompt.rating.count})</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <DownloadIcon className="h-4 w-4" />
            <span>{prompt.downloads} downloads</span>
          </div>
        </div>
      </div>

      {/* Context Section */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">About this prompt</h3>
        <p className="text-muted-foreground">
          {prompt.longDescription || prompt.description}
        </p>
      </div>

      {/* Input Variables */}
      {inputVariables.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Input Variables</h3>
          <div className="flex flex-wrap gap-2">
            {inputVariables.map((variable) => (
              <Badge key={variable} variant="outline" className="font-mono">
                {variable}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Replace these placeholders with your specific values when using this prompt.
          </p>
        </div>
      )}

      {/* Prompt Content */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Prompt Content</h3>
        </div>
        <div className="relative">
          <SyntaxHighlighter
            language="text"
            style={vscDarkPlus}
            customStyle={{
              borderRadius: "0.5rem",
              padding: "1rem",
              fontSize: "0.875rem",
              lineHeight: "1.5",
            }}
            showLineNumbers
          >
            {prompt.content}
          </SyntaxHighlighter>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {prompt.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 pt-4 border-t">
        <CopyButton
          content={prompt.content}
          variant="default"
          size="default"
        />
        <DownloadButton
          content={prompt.content}
          filename={`${prompt.title.replace(/\s+/g, "-").toLowerCase()}.txt`}
          variant="outline"
          size="default"
        />
        {prompt.compatibility?.includes("cursor") && (
          <Button
            variant="outline"
            size="default"
            onClick={() => {
              // Try to open in Cursor if available
              window.location.href = `cursor://prompt?content=${encodeURIComponent(prompt.content)}`
            }}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Use in Cursor
          </Button>
        )}
        {prompt.chatbot && (
          <Button
            variant="outline"
            size="default"
            onClick={() => {
              // Copy to clipboard with a note about Claude Desktop
              navigator.clipboard.writeText(prompt.content)
              alert("Prompt copied! Paste it into Claude Desktop.")
            }}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Use in Claude Desktop
          </Button>
        )}
      </div>
    </div>
  )
}
