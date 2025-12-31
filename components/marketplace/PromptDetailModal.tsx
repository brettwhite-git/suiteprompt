"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PromptContentTab } from "./PromptContentTab"
import { PromptUsageTab } from "./PromptUsageTab"
import { PromptRelatedTab } from "./PromptRelatedTab"
import { Prompt } from "@/types/marketplace"
import { getPromptById } from "@/lib/marketplace"

interface PromptDetailModalProps {
  promptId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onPromptClick?: (promptId: string) => void
}

export function PromptDetailModal({
  promptId,
  open,
  onOpenChange,
  onPromptClick,
}: PromptDetailModalProps) {
  const prompt = React.useMemo(() => {
    if (!promptId) return null
    return getPromptById(promptId)
  }, [promptId])

  if (!prompt) return null

  const handleRelatedPromptClick = (relatedPromptId: string) => {
    // Close current modal first
    onOpenChange(false)
    // Update the selected prompt ID after a brief delay to allow modal to close
    setTimeout(() => {
      onPromptClick?.(relatedPromptId)
    }, 150)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{prompt.title}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="content" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="related">Related</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-y-auto mt-4 pr-2">
            <TabsContent value="content" className="mt-0">
              <PromptContentTab prompt={prompt} />
            </TabsContent>
            
            <TabsContent value="usage" className="mt-0">
              <PromptUsageTab prompt={prompt} />
            </TabsContent>
            
            <TabsContent value="related" className="mt-0">
              <PromptRelatedTab 
                prompt={prompt} 
                onPromptClick={handleRelatedPromptClick}
              />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
