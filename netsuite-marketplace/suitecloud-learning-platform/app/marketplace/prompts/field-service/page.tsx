"use client"

import { useState, useMemo, useEffect } from "react"
import { getPrompts } from "@/lib/marketplace"
import { PromptCard } from "@/components/marketplace/PromptCard"
import { FilterBar } from "@/components/marketplace/FilterBar"
import { FilterOptions } from "@/types/marketplace"
import { cn } from "@/lib/utils"

export default function FieldServicePromptsPage() {
  const [filters, setFilters] = useState<FilterOptions>({
    tags: ["field-service"],
    sortBy: "popularity",
  })

  const prompts = useMemo(() => getPrompts(filters), [filters])
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    // Trigger fade-in animation after a brief delay to ensure smooth transition
    const timer = setTimeout(() => {
      setHasAnimated(true)
    }, 50)
    return () => clearTimeout(timer)
  }, []) // Empty deps - only run on mount

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Field Service Prompts</h1>
        <p className="text-muted-foreground mt-2">
          Prompts for field service management, scheduling, and service delivery in NetSuite
        </p>
      </div>

      <FilterBar filters={filters} onFiltersChange={setFilters} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
        {prompts.map((prompt, index) => (
          <div
            key={prompt.id}
            className={cn(
              "transition-all duration-300 ease-out h-full",
              hasAnimated
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-1"
            )}
            style={{
              transitionDelay: hasAnimated ? `${index * 50}ms` : "0ms",
            }}
          >
            <PromptCard prompt={prompt} />
          </div>
        ))}
      </div>

      {prompts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No prompts found matching your filters.</p>
        </div>
      )}
    </div>
  )
}

