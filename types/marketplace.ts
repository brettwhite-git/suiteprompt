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
}

export interface Skill extends MarketplaceItem {
  category: string
  version?: string
  dependencies?: string[]
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

