"use client"

import * as React from "react"
import { Prompt } from "@/types/marketplace"
import { PromptCard } from "./PromptCard"
import { getRelatedPrompts } from "@/lib/marketplace"

interface PromptRelatedTabProps {
  prompt: Prompt
  onPromptClick?: (promptId: string) => void
}

export function PromptRelatedTab({ prompt, onPromptClick }: PromptRelatedTabProps) {
  const relatedPrompts = React.useMemo(
    () => getRelatedPrompts(prompt.id, 6),
    [prompt.id]
  )

  if (relatedPrompts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No related prompts found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Related Prompts</h3>
        <p className="text-sm text-muted-foreground">
          Prompts similar to this one, based on category, tags, or author.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {relatedPrompts.map((relatedPrompt) => (
          <div
            key={relatedPrompt.id}
            onClick={() => onPromptClick?.(relatedPrompt.id)}
            className="cursor-pointer"
          >
            <PromptCard prompt={relatedPrompt} />
          </div>
        ))}
      </div>
    </div>
  )
}
