import marketplaceData from "@/data/marketplace.json"
import { Prompt, Skill, MarketplaceData, FilterOptions, BusinessArea } from "@/types/marketplace"

export const marketplace: MarketplaceData = marketplaceData as MarketplaceData

export function getPrompts(filters?: FilterOptions): Prompt[] {
  let prompts = [...marketplace.prompts]

  if (filters?.format) {
    prompts = prompts.filter((p) => p.format === filters.format)
  }

  if (filters?.businessArea) {
    prompts = prompts.filter((p) => p.businessArea === filters.businessArea)
  }

  if (filters?.targetPlatform) {
    prompts = prompts.filter((p) => p.targetPlatform === filters.targetPlatform)
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

  if (filters?.netsuiteModules && filters.netsuiteModules.length > 0) {
    prompts = prompts.filter((p) =>
      p.netsuiteModules &&
      filters.netsuiteModules!.some((module) => p.netsuiteModules!.includes(module))
    )
  }

  if (filters?.sortBy) {
    switch (filters.sortBy) {
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

  if (filters?.businessArea) {
    skills = skills.filter((s) => s.businessArea === filters.businessArea)
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

  if (filters?.netsuiteModules && filters.netsuiteModules.length > 0) {
    skills = skills.filter((s) =>
      s.netsuiteModules &&
      filters.netsuiteModules!.some((module) => s.netsuiteModules!.includes(module))
    )
  }

  if (filters?.sortBy) {
    switch (filters.sortBy) {
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

export function getRelatedPrompts(promptId: string, limit: number = 6): Prompt[] {
  const prompt = getPromptById(promptId)
  if (!prompt) return []

  const related = marketplace.prompts
    .filter((p) => {
      // Exclude the current prompt
      if (p.id === promptId) return false
      
      // Match by business area, format, or shared tags
      const hasSharedTags = p.tags.some((tag) => prompt.tags.includes(tag))
      const sameBusinessArea = p.businessArea === prompt.businessArea
      const sameFormat = p.format === prompt.format
      const sameAuthor = p.author.id === prompt.author.id
      
      return hasSharedTags || sameBusinessArea || sameFormat || sameAuthor
    })
    .sort((a, b) => {
      // Prioritize prompts with more shared tags
      const aSharedTags = a.tags.filter((tag) => prompt.tags.includes(tag)).length
      const bSharedTags = b.tags.filter((tag) => prompt.tags.includes(tag)).length
      if (aSharedTags !== bSharedTags) return bSharedTags - aSharedTags
      
      // Then by downloads
      return b.downloads - a.downloads
    })
    .slice(0, limit)

  return related
}

export function getRelatedSkills(skillId: string, limit: number = 6): Skill[] {
  const skill = getSkillById(skillId)
  if (!skill) return []

  const related = marketplace.skills
    .filter((s) => {
      // Exclude the current skill
      if (s.id === skillId) return false
      
      // Match by business area or shared tags
      const hasSharedTags = s.tags.some((tag) => skill.tags.includes(tag))
      const sameBusinessArea = s.businessArea === skill.businessArea
      const sameAuthor = s.author.id === skill.author.id
      
      return hasSharedTags || sameBusinessArea || sameAuthor
    })
    .sort((a, b) => {
      // Prioritize skills with more shared tags
      const aSharedTags = a.tags.filter((tag) => skill.tags.includes(tag)).length
      const bSharedTags = b.tags.filter((tag) => skill.tags.includes(tag)).length
      if (aSharedTags !== bSharedTags) return bSharedTags - aSharedTags
      
      // Then by downloads
      return b.downloads - a.downloads
    })
    .slice(0, limit)

  return related
}

/**
 * Extract unique business areas from a list of prompts
 */
export function getAvailableBusinessAreasFromPrompts(prompts: Prompt[]): BusinessArea[] {
  const areas = new Set<BusinessArea>()
  prompts.forEach((prompt) => {
    areas.add(prompt.businessArea)
  })
  return Array.from(areas).sort()
}

/**
 * Extract unique business areas from a list of skills
 */
export function getAvailableBusinessAreasFromSkills(skills: Skill[]): BusinessArea[] {
  const areas = new Set<BusinessArea>()
  skills.forEach((skill) => {
    areas.add(skill.businessArea)
  })
  return Array.from(areas).sort()
}
