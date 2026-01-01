"use client"

import { useState, useMemo } from "react"
import { getPrompts } from "@/lib/marketplace"
import { PromptCard } from "@/components/marketplace/PromptCard"
import { PromptDetailModal } from "@/components/marketplace/PromptDetailModal"
import { FilterBar } from "@/components/marketplace/FilterBar"
import { FilterOptions } from "@/types/marketplace"

export default function AdvisorPage() {
  const [filters, setFilters] = useState<FilterOptions>({
    targetPlatform: "advisor"
  })
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const prompts = useMemo(() => {
    return getPrompts({ ...filters, targetPlatform: "advisor" })
  }, [filters])

  const handlePromptClick = (promptId: string) => {
    setSelectedPromptId(promptId)
    setIsModalOpen(true)
  }

  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open)
    if (!open) {
      setTimeout(() => setSelectedPromptId(null), 150)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">NetSuite Advisor</h1>
        <p className="text-muted-foreground mt-2">
          Natural language queries for NetSuite's native chatbot. Use these prompts to get instant answers from NetSuite Advisor without generating artifacts.
        </p>
      </div>

      <FilterBar filters={filters} onFiltersChange={setFilters} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {prompts.map((prompt) => (
          <PromptCard 
            key={prompt.id} 
            prompt={prompt}
            onClick={() => handlePromptClick(prompt.id)}
          />
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
