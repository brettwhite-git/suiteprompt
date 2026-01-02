"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SkillContentTab } from "./SkillContentTab"
import { SkillMetadataTab } from "./SkillMetadataTab"
import { SkillRelatedTab } from "./SkillRelatedTab"
import { Skill } from "@/types/marketplace"
import { getSkillById } from "@/lib/marketplace"

interface SkillDetailModalProps {
  skillId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSkillClick?: (skillId: string) => void
}

export function SkillDetailModal({
  skillId,
  open,
  onOpenChange,
  onSkillClick,
}: SkillDetailModalProps) {
  const skill = React.useMemo(() => {
    if (!skillId) return null
    return getSkillById(skillId)
  }, [skillId])

  if (!skill) return null

  const handleRelatedSkillClick = (relatedSkillId: string) => {
    // Close current modal first
    onOpenChange(false)
    // Update the selected skill ID after a brief delay to allow modal to close
    setTimeout(() => {
      onSkillClick?.(relatedSkillId)
    }, 150)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{skill.title}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="content" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            <TabsTrigger value="related">Related</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-y-auto mt-4 pr-2">
            <TabsContent value="content" className="mt-0">
              <SkillContentTab skill={skill} />
            </TabsContent>
            
            <TabsContent value="metadata" className="mt-0">
              <SkillMetadataTab skill={skill} />
            </TabsContent>
            
            <TabsContent value="related" className="mt-0">
              <SkillRelatedTab 
                skill={skill} 
                onSkillClick={handleRelatedSkillClick}
              />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
