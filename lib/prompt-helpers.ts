import type { Prompt, BusinessArea, PromptFormat, TargetPlatform } from "@/types/marketplace"

export interface SubmitPromptRequest {
  // Basic info
  title: string
  format: PromptFormat
  description: string

  // General & MCP: Content
  content?: string
  inputVariables?: string[]

  // Prompt Studio: System prompt and model settings
  systemPrompt?: string
  temperature?: number
  maxTokens?: number

  // Skill: Skill content
  skillContent?: string

  // Classification
  businessArea: BusinessArea
  targetPlatform?: TargetPlatform[]
  mcpTools?: string[]

  // Metadata
  tags?: string[]

  // Submitter (note: email handled separately in API, not included here)
  submitterName: string
  agreeToTerms: boolean
}

/**
 * Generate a unique ID for a submitted prompt
 */
export function generatePromptId(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 7)
  return `submitted-${timestamp}-${random}`
}

/**
 * Extract variables from prompt content
 * Matches patterns like [VARIABLE] and ${VARIABLE}
 */
export function extractVariables(content: string): string[] {
  const bracketVars = content.match(/\[([A-Z_]+)\]/g) || []
  const dollarVars = content.match(/\$\{([A-Za-z_]+)\}/g) || []

  const allVars = [
    ...bracketVars.map((v) => v.slice(1, -1)),
    ...dollarVars.map((v) => v.slice(2, -1)),
  ]

  return [...new Set(allVars)] // Remove duplicates
}

/**
 * Convert form submission to Prompt object
 */
export function formatSubmissionAsPrompt(
  submission: SubmitPromptRequest,
  promptId: string
): Prompt {
  const now = new Date().toISOString()

  // Format-specific content handling
  let content = ""
  let modelSettings = undefined

  switch (submission.format) {
    case "general":
    case "mcp":
      content = submission.content || ""
      break
    case "prompt-studio":
      content = submission.systemPrompt || ""
      modelSettings = {
        temperature: submission.temperature,
        maxTokens: submission.maxTokens,
      }
      break
    case "skill":
      content = submission.skillContent || ""
      break
  }

  return {
    id: promptId,
    title: submission.title,
    description: submission.description,
    content: content,
    format: submission.format,
    businessArea: submission.businessArea,
    targetPlatform: submission.targetPlatform?.[0], // Take first platform for now
    mcpTools: submission.mcpTools,
    inputVariables:
      submission.inputVariables && submission.inputVariables.length > 0
        ? submission.inputVariables
        : submission.content
        ? extractVariables(submission.content)
        : [],
    compatibility: [],
    modelSettings: modelSettings,
    author: {
      id: `submitted-${Date.now()}`,
      name: submission.submitterName,
      avatar: "",
    },
    rating: {
      average: 0,
      count: 0,
    },
    downloads: 0,
    tags: submission.tags || [],
    createdAt: now,
    updatedAt: now,
  }
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    .trim()
}
