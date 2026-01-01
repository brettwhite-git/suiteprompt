"use client"

import { useState, useMemo } from "react"
import { getPrompts } from "@/lib/marketplace"
import { PromptCard } from "@/components/marketplace/PromptCard"
import { FilterBar } from "@/components/marketplace/FilterBar"
import { FilterOptions } from "@/types/marketplace"

export default function PromptStudioPage() {
  const [filters, setFilters] = useState<FilterOptions>({
    targetPlatform: "prompt-studio",
    sortBy: "popularity",
  })

  const prompts = useMemo(() => getPrompts(filters), [filters])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Prompt Studio</h1>
        <p className="text-muted-foreground mt-2">
          Prompts designed for NetSuite Prompt Studio
        </p>
      </div>

      <FilterBar filters={filters} onFiltersChange={setFilters} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {prompts.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
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

