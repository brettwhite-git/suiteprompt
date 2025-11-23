"use client"

import { useState, useMemo } from "react"
import { getSkills } from "@/lib/marketplace"
import { SkillCard } from "@/components/marketplace/SkillCard"
import { FilterBar } from "@/components/marketplace/FilterBar"
import { FilterOptions } from "@/types/marketplace"

export default function SkillsPage() {
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: "popularity",
  })

  const skills = useMemo(() => getSkills(filters), [filters])

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
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No skills found matching your filters.</p>
        </div>
      )}
    </div>
  )
}

