"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { getSkills } from "@/lib/marketplace"
import { SkillCard } from "@/components/marketplace/SkillCard"
import { SkillDetailModal } from "@/components/marketplace/SkillDetailModal"
import { FilterBar } from "@/components/marketplace/FilterBar"
import { AnimatedCardGrid } from "@/components/animations/AnimatedCardGrid"
import { FilterOptions } from "@/types/marketplace"

const capabilityMap: Record<string, string[]> = {
  development: ["suitescript", "suiteql", "customization"],
  administration: ["system-audit", "user-management", "roles-permissions"],
  integration: ["mcp-tools", "connectors", "apis"],
  analytics: ["reporting", "dashboards", "data-analysis"],
  automation: ["workflows", "scheduled-scripts", "process-automation"],
}

function getPageTitle(capability?: string | null, sub?: string | null): string {
  if (sub) {
    const subTitle = sub
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
    return `${subTitle} Skills`
  }
  if (capability) {
    const capabilityTitle = capability
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
    return `${capabilityTitle} Skills`
  }
  return "Skills"
}

function getPageDescription(capability?: string | null, sub?: string | null): string {
  if (sub) {
    return `Discover Claude skills for ${sub.replace("-", " ")} in NetSuite`
  }
  if (capability) {
    return `Discover Claude skills for ${capability.replace("-", " ")} in NetSuite`
  }
  return "Discover Claude skills for NetSuite development"
}

function SkillsPageContent() {
  const searchParams = useSearchParams()
  const capability = searchParams.get("capability")
  const sub = searchParams.get("sub")
  
  const [filters, setFilters] = useState<FilterOptions>({})
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Update filters based on URL params
  useEffect(() => {
    const newFilters: FilterOptions = {
      sortBy: "popularity",
    }

    if (capability && capabilityMap[capability]) {
      if (sub) {
        // Filter by specific sub-tag
        newFilters.tags = [sub]
      } else {
        // Filter by capability tags
        newFilters.tags = capabilityMap[capability]
      }
    }

    setFilters(newFilters)
  }, [capability, sub])

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

  const pageTitle = getPageTitle(capability, sub)
  const pageDescription = getPageDescription(capability, sub)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
        <p className="text-muted-foreground mt-2">{pageDescription}</p>
      </div>

      <FilterBar filters={filters} onFiltersChange={setFilters} />

      {skills.length > 0 ? (
        <AnimatedCardGrid animationKey={`skills-${capability || 'all'}-${sub || 'all'}`}>
          {skills.map((skill) => (
            <SkillCard 
              key={skill.id} 
              skill={skill} 
              onClick={() => handleSkillClick(skill.id)}
            />
          ))}
        </AnimatedCardGrid>
      ) : (
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

export default function SkillsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SkillsPageContent />
    </Suspense>
  )
}
