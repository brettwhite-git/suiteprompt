export type PromptFormat = "mcp" | "skill" | "general"
export type BusinessArea = "accounting" | "sales" | "inventory" | "crm" | "suitecloud" | "admin"
export type TargetPlatform = "text-enhance" | "prompt-studio" | "advisor" | "mcp" | "claude" | "chatgpt"

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

export interface ModelSettings {
  temperature?: number
  topP?: number
  topK?: number
  maxTokens?: number
  presencePenalty?: number
  frequencyPenalty?: number
}

export interface Prompt extends MarketplaceItem {
  format: PromptFormat
  businessArea: BusinessArea
  targetPlatform?: TargetPlatform  // Which platform/feature this prompt is for
  mcpTools?: string[]              // For MCP prompts - which tools are used
  usageExamples?: string[]         // Example use cases
  inputVariables?: string[]        // Extracted placeholders like [CRITERIA]
  compatibility?: string[]         // e.g., ["claude", "chatgpt"]
  longDescription?: string         // Extended description for detail page
  modelSettings?: ModelSettings    // LLM configuration (for Prompt Studio style)
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
  format: "skill"
  businessArea: BusinessArea
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
  format?: PromptFormat
  businessArea?: BusinessArea
  targetPlatform?: TargetPlatform
  minRating?: number
  sortBy?: "popularity" | "rating" | "newest" | "downloads"
  search?: string
  tags?: string[]
}

