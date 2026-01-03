"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { getPrompts } from "@/lib/marketplace"
import { PromptCard } from "@/components/marketplace/PromptCard"
import { PromptDetailModal } from "@/components/marketplace/PromptDetailModal"
import { FilterBar } from "@/components/marketplace/FilterBar"
import { AnimatedCardGrid } from "@/components/animations/AnimatedCardGrid"
import { FilterOptions } from "@/types/marketplace"

// Map category names to business areas or tags
const categoryMap: Record<string, { businessArea?: string; tags?: string[] }> = {
  finance: { tags: ["accounting", "finance", "forecasting", "fixed-assets"] },
  operations: { tags: ["inventory", "manufacturing", "procurement", "field-service"] },
  sales: { tags: ["sales", "crm", "support", "ecommerce"] },
  platform: { tags: ["suitecloud", "administration", "admin"] },
  "workforce-global": { tags: ["project-management", "human-resources", "international"] },
}

const moduleMap: Record<string, string> = {
  accounting: "accounting",
  forecasting: "forecasting",
  "fixed-assets": "fixed-assets",
  inventory: "inventory",
  manufacturing: "manufacturing",
  procurement: "procurement",
  "field-service": "field-service",
  sales: "sales",
  crm: "crm",
  support: "support",
  ecommerce: "ecommerce",
  suitecloud: "suitecloud",
  administration: "administration",
  "project-management": "project-management",
  "human-resources": "human-resources",
  international: "international",
}

function getPageTitle(category?: string | null, module?: string | null): string {
  if (module && moduleMap[module]) {
    const moduleTitle = moduleMap[module]
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
    return `${moduleTitle} Prompts`
  }
  if (category && categoryMap[category]) {
    const categoryTitle = category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
    return `${categoryTitle} Prompts`
  }
  return "All Prompts"
}

function getPageDescription(category?: string | null, module?: string | null): string {
  if (module && moduleMap[module]) {
    return `Prompts for ${moduleMap[module].replace("-", " ")} in NetSuite`
  }
  if (category && categoryMap[category]) {
    return `Browse prompts for ${category.replace("-", " ")} in NetSuite`
  }
  return "Browse and discover prompts for NetSuite development"
}

function PromptsPageContent() {
  const searchParams = useSearchParams()
  const category = searchParams.get("category")
  const module = searchParams.get("module")
  
  const [filters, setFilters] = useState<FilterOptions>({})
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Update filters based on URL params
  useEffect(() => {
    const newFilters: FilterOptions = {}

    if (category && categoryMap[category]) {
      const categoryInfo = categoryMap[category]
      if (module && moduleMap[module]) {
        // Filter by specific module tag
        newFilters.tags = [moduleMap[module]]
      } else {
        // Filter by category tags
        newFilters.tags = categoryInfo.tags
      }
    }

    setFilters(newFilters)
  }, [category, module])

  const prompts = useMemo(() => getPrompts(filters), [filters])

  const handlePromptClick = (promptId: string) => {
    setSelectedPromptId(promptId)
    setIsModalOpen(true)
  }

  const pageTitle = getPageTitle(category, module)
  const pageDescription = getPageDescription(category, module)

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
          <p className="text-muted-foreground mt-2">{pageDescription}</p>
        </div>

        <FilterBar filters={filters} onFiltersChange={setFilters} />

        {prompts.length > 0 ? (
          <AnimatedCardGrid animationKey={`prompts-${category || 'all'}-${module || 'all'}`}>
            {prompts.map((prompt) => (
              <PromptCard 
                key={prompt.id} 
                prompt={prompt}
                onClick={() => handlePromptClick(prompt.id)}
              />
            ))}
          </AnimatedCardGrid>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No prompts found matching your filters.</p>
          </div>
        )}
      </div>

      <PromptDetailModal
        promptId={selectedPromptId}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onPromptClick={handlePromptClick}
      />
    </>
  )
}

export default function PromptsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PromptsPageContent />
    </Suspense>
  )
}
