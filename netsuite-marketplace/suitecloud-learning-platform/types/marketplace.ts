export type PromptFormat = "mcp" | "skill" | "general"
export type BusinessArea = "accounting" | "sales" | "inventory" | "crm" | "suitecloud" | "admin" | "manufacturing" | "field-service" | "forecasting" | "support" | "procurement" | "project-mgmt" | "hr" | "international"
export type TargetPlatform = "text-enhance" | "prompt-studio" | "advisor" | "mcp" | "claude" | "chatgpt"
export type SkillCapability = "development" | "administration" | "integration" | "analytics" | "automation"

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
  netsuiteModules?: string[]       // NetSuite product modules this prompt relates to
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
  netsuiteModules?: string[]  // NetSuite product modules this skill relates to
  skillCapability?: SkillCapability  // Which capability group this skill belongs to
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
  netsuiteModules?: string[]  // Filter by NetSuite product modules
}

// Taxonomy Types
export interface PlatformFeature {
  id: string
  displayName: string
  description: string
  category: string
  icon?: string
}

export interface BusinessAreaDefinition {
  id: string
  displayName: string
  description: string
  modules: string[]
  icon?: string
}

export interface ModuleDefinition {
  id: string
  displayName: string
  businessArea: BusinessArea
  description: string
  category?: string  // NetSuite product category (e.g., "Financials", "CRM/eComm")
}

export interface SkillCapabilityDefinition {
  id: string
  displayName: string
  description: string
  relatedBusinessAreas: BusinessArea[]
  icon?: string
}

export interface Taxonomy {
  platformFeatures: {
    targetPlatform: Record<string, PlatformFeature>
    format: Record<string, PlatformFeature>
  }
  businessAreas: Record<string, BusinessAreaDefinition>
  modules: Record<string, ModuleDefinition>
  skillCapabilities: Record<string, SkillCapabilityDefinition>
}
