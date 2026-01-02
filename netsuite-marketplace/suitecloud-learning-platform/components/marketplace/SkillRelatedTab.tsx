"use client"

import * as React from "react"
import { Skill } from "@/types/marketplace"
import { SkillCard } from "./SkillCard"
import { getRelatedSkills } from "@/lib/marketplace"

interface SkillRelatedTabProps {
  skill: Skill
  onSkillClick?: (skillId: string) => void
}

export function SkillRelatedTab({ skill, onSkillClick }: SkillRelatedTabProps) {
  const relatedSkills = React.useMemo(
    () => getRelatedSkills(skill.id, 6),
    [skill.id]
  )

  if (relatedSkills.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No related skills found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Related Skills</h3>
        <p className="text-sm text-muted-foreground">
          Skills similar to this one, based on category, tags, or author.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {relatedSkills.map((relatedSkill) => (
          <div
            key={relatedSkill.id}
            onClick={() => onSkillClick?.(relatedSkill.id)}
            className="cursor-pointer"
          >
            <SkillCard skill={relatedSkill} />
          </div>
        ))}
      </div>
    </div>
  )
}
