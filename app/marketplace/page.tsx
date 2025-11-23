import { getPrompts, getSkills } from "@/lib/marketplace"
import { PromptCard } from "@/components/marketplace/PromptCard"
import { SkillCard } from "@/components/marketplace/SkillCard"
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

  const prompts = getPrompts(filters)
  const skills = getSkills(filters)

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <div className="p-6 space-y-8">
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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {prompts.slice(0, 6).map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} />
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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {skills.slice(0, 6).map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

