export type PromptCategory = "prompt-studio" | "advisor" | "mcp"

export type PromptType = "prompt-studio" | "advisor" | "mcp"

export interface Author {
  id: string
  name: string
  avatar?: string
}

export interface Rating {
  average: number
  count: number
}

export interface MarketplaceItem {
  id: string
  title: string
  description: string
  content: string
  author: Author
  rating: Rating
  downloads: number
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface Prompt extends MarketplaceItem {
  type: PromptType
  category: PromptCategory
  chatbot?: "claude" | "chatgpt" | "both"
  // Enhanced fields for detail view
  usageExamples?: string[]         // Example use cases
  inputVariables?: string[]        // Extracted placeholders like [CRITERIA]
  compatibility?: string[]         // e.g., ["cursor", "claude-desktop", "chatgpt"]
  longDescription?: string         // Extended description for detail page
}

export interface SkillMetadata {
  name: string
  description: string
  version: string
  author: string
  repository?: string
  license?: string
  marketplace?: boolean
  stars?: number
  forks?: number
  tags: string[]
  dependencies?: string[]
}

export interface Skill extends MarketplaceItem {
  category: string
  version?: string
  dependencies?: string[]
  metadata?: SkillMetadata
  skillContent?: string  // Full SKILL.md markdown content
}

export interface MarketplaceData {
  prompts: Prompt[]
  skills: Skill[]
}

export interface FilterOptions {
  category?: string
  minRating?: number
  sortBy?: "popularity" | "rating" | "newest" | "downloads"
  search?: string
  tags?: string[]
}

