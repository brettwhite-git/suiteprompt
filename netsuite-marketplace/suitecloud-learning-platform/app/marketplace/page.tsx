"use client"

import { useState, useMemo, useEffect } from "react"
import { getPrompts, getSkills } from "@/lib/marketplace"
import { PromptCard } from "@/components/marketplace/PromptCard"
import { PromptDetailModal } from "@/components/marketplace/PromptDetailModal"
import { SkillCard } from "@/components/marketplace/SkillCard"
import { FilterOptions } from "@/types/marketplace"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
  const [hasAnimated, setHasAnimated] = useState(false)

  const prompts = useMemo(() => getPrompts(filters), [filters])
  const skills = useMemo(() => getSkills(filters), [filters])

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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
            {prompts.slice(0, 6).map((prompt, index) => (
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
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Popular Skills</h2>
            <Button asChild variant="ghost">
              <Link href="/marketplace/skills">View All →</Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
            {skills.slice(0, 6).map((skill, index) => (
              <div
                key={skill.id}
                className={cn(
                  "transition-all duration-300 ease-out h-full",
                  hasAnimated
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-1"
                )}
                style={{
                  transitionDelay: hasAnimated ? `${(prompts.slice(0, 6).length + index) * 50}ms` : "0ms",
                }}
              >
                <SkillCard skill={skill} />
              </div>
            ))}
          </div>
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

