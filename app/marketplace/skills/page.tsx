"use client"

import { useState, useMemo } from "react"
import { getSkills } from "@/lib/marketplace"
import { SkillCard } from "@/components/marketplace/SkillCard"
import { SkillDetailModal } from "@/components/marketplace/SkillDetailModal"
import { FilterBar } from "@/components/marketplace/FilterBar"
import { FilterOptions } from "@/types/marketplace"

export default function SkillsPage() {
  const [filters, setFilters] = useState<FilterOptions>({})
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const skills = useMemo(() => getSkills(filters), [filters])

  const handleSkillClick = (skillId: string) => {
    setSelectedSkillId(skillId)
    setIsModalOpen(true)
  }

  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open)
    if (!open) {
      // Clear selected skill after modal closes
      setTimeout(() => setSelectedSkillId(null), 150)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
        <p className="text-muted-foreground mt-2">
          Discover Claude skills for NetSuite development
        </p>
      </div>

      <FilterBar filters={filters} onFiltersChange={setFilters} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => (
          <SkillCard 
            key={skill.id} 
            skill={skill} 
            onClick={() => handleSkillClick(skill.id)}
          />
        ))}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No skills found matching your filters.</p>
        </div>
      )}

      <SkillDetailModal
        skillId={selectedSkillId}
        open={isModalOpen}
        onOpenChange={handleModalOpenChange}
        onSkillClick={handleSkillClick}
      />
    </div>
  )
}

