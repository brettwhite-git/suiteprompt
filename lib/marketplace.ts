import marketplaceData from "@/data/marketplace.json"
import { Prompt, Skill, MarketplaceData, FilterOptions } from "@/types/marketplace"

export const marketplace: MarketplaceData = marketplaceData as MarketplaceData

export function getPrompts(filters?: FilterOptions): Prompt[] {
  let prompts = [...marketplace.prompts]

  if (filters?.category) {
    prompts = prompts.filter((p) => p.category === filters.category)
  }

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase()
    prompts = prompts.filter(
      (p) =>
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    )
  }

  if (filters?.minRating) {
    prompts = prompts.filter((p) => p.rating.average >= filters.minRating!)
  }

  if (filters?.tags && filters.tags.length > 0) {
    prompts = prompts.filter((p) =>
      filters.tags!.some((tag) => p.tags.includes(tag))
    )
  }

  if (filters?.sortBy) {
    switch (filters.sortBy) {
      case "popularity":
        prompts.sort((a, b) => b.downloads - a.downloads)
        break
      case "rating":
        prompts.sort((a, b) => b.rating.average - a.rating.average)
        break
      case "newest":
        prompts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        break
      case "downloads":
        prompts.sort((a, b) => b.downloads - a.downloads)
        break
    }
  }

  return prompts
}

export function getSkills(filters?: FilterOptions): Skill[] {
  let skills = [...marketplace.skills]

  if (filters?.category) {
    skills = skills.filter((s) => s.category === filters.category)
  }

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase()
    skills = skills.filter(
      (s) =>
        s.title.toLowerCase().includes(searchLower) ||
        s.description.toLowerCase().includes(searchLower) ||
        s.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    )
  }

  if (filters?.minRating) {
    skills = skills.filter((s) => s.rating.average >= filters.minRating!)
  }

  if (filters?.tags && filters.tags.length > 0) {
    skills = skills.filter((s) =>
      filters.tags!.some((tag) => s.tags.includes(tag))
    )
  }

  if (filters?.sortBy) {
    switch (filters.sortBy) {
      case "popularity":
        skills.sort((a, b) => b.downloads - a.downloads)
        break
      case "rating":
        skills.sort((a, b) => b.rating.average - a.rating.average)
        break
      case "newest":
        skills.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        break
      case "downloads":
        skills.sort((a, b) => b.downloads - a.downloads)
        break
    }
  }

  return skills
}

export function getPromptById(id: string): Prompt | undefined {
  return marketplace.prompts.find((p) => p.id === id)
}

export function getSkillById(id: string): Skill | undefined {
  return marketplace.skills.find((s) => s.id === id)
}

