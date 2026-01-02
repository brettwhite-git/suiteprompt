"use client"

import { useState, useMemo } from "react"
import { getPrompts, getSkills } from "@/lib/marketplace"
import { PromptCard } from "@/components/marketplace/PromptCard"
import { PromptDetailModal } from "@/components/marketplace/PromptDetailModal"
import { SkillCard } from "@/components/marketplace/SkillCard"
import { AnimatedCardGrid } from "@/components/animations/AnimatedCardGrid"
import { FilterOptions } from "@/types/marketplace"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function MarketplacePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const filters: FilterOptions = {
    sortBy: "popularity",
  }
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const prompts = useMemo(() => getPrompts(filters), [filters])
  const skills = useMemo(() => getSkills(filters), [filters])

  const handlePromptClick = (promptId: string) => {
    setSelectedPromptId(promptId)
    setIsModalOpen(true)
  }

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
        <p className="text-muted-foreground mt-2">
          Discover prompts and skills for NetSuite development
        </p>
      </div>

      <div className="flex gap-4 flex-wrap">
        <Button asChild variant="outline">
          <Link href="/marketplace/prompts">Browse All Prompts</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/marketplace/skills">Browse All Skills</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/marketplace/learn">Learning Center</Link>
        </Button>
      </div>

      <div className="space-y-6">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Featured Prompts</h2>
            <Button asChild variant="ghost">
              <Link href="/marketplace/prompts">View All →</Link>
            </Button>
          </div>
          <AnimatedCardGrid animationKey="home-prompts">
            {prompts.slice(0, 6).map((prompt) => (
              <PromptCard 
                key={prompt.id} 
                prompt={prompt}
                onClick={() => handlePromptClick(prompt.id)}
              />
            ))}
          </AnimatedCardGrid>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Popular Skills</h2>
            <Button asChild variant="ghost">
              <Link href="/marketplace/skills">View All →</Link>
            </Button>
          </div>
          <AnimatedCardGrid animationKey="home-skills">
            {skills.slice(0, 6).map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </AnimatedCardGrid>
        </section>
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

