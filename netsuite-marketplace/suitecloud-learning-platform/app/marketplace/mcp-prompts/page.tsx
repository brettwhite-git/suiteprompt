"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { getPrompts, getAvailableBusinessAreasFromPrompts } from "@/lib/marketplace"
import { PromptCard } from "@/components/marketplace/PromptCard"
import { PromptDetailModal } from "@/components/marketplace/PromptDetailModal"
import { FilterBar } from "@/components/marketplace/FilterBar"
import { FilterOptions, BusinessArea } from "@/types/marketplace"
import { cn } from "@/lib/utils"

function MCPPromptsContent() {
  const searchParams = useSearchParams()
  const businessAreaParam = searchParams.get("businessArea") as BusinessArea | null

  const [filters, setFilters] = useState<FilterOptions>({
    format: "mcp",
    ...(businessAreaParam && { businessArea: businessAreaParam }),
  })
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  const prompts = useMemo(() => {
    return getPrompts({ ...filters, format: "mcp" })
  }, [filters])
  const availableBusinessAreas = useMemo(() => getAvailableBusinessAreasFromPrompts(prompts), [prompts])

  // Update filters when URL params change
  useEffect(() => {
    const businessAreaParam = searchParams.get("businessArea") as BusinessArea | null
    setFilters((prev) => ({
      ...prev,
      format: "mcp",
      ...(businessAreaParam ? { businessArea: businessAreaParam } : { businessArea: undefined }),
    }))
  }, [searchParams])

  useEffect(() => {
    // Trigger fade-in animation after a brief delay to ensure smooth transition
    const timer = setTimeout(() => {
      setHasAnimated(true)
    }, 50)
    return () => clearTimeout(timer)
  }, []) // Empty deps - only run on mount

  const handlePromptClick = (promptId: string) => {
    setSelectedPromptId(promptId)
    setIsModalOpen(true)
  }

  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open)
    if (!open) {
      // Clear selected prompt after modal closes
      setTimeout(() => setSelectedPromptId(null), 150)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">MCP Prompts</h1>
        <p className="text-muted-foreground mt-2">
          MCP prompts for Claude and ChatGPT integration with NetSuite
        </p>
      </div>

      <FilterBar filters={filters} onFiltersChange={setFilters} availableBusinessAreas={availableBusinessAreas} />

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
            <PromptCard 
              prompt={prompt}
              onClick={() => handlePromptClick(prompt.id)}
            />
          </div>
        ))}
      </div>

      {prompts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No prompts found matching your filters.</p>
        </div>
      )}

      <PromptDetailModal
        promptId={selectedPromptId}
        open={isModalOpen}
        onOpenChange={handleModalOpenChange}
        onPromptClick={handlePromptClick}
      />
    </div>
  )
}

export default function MCPPromptsPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">MCP Prompts</h1>
          <p className="text-muted-foreground mt-2">
            MCP prompts for Claude and ChatGPT integration with NetSuite
          </p>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <MCPPromptsContent />
    </Suspense>
  )
}
