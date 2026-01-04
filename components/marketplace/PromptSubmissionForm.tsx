"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Turnstile } from "@marsidev/react-turnstile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2, AlertCircle, Eye, X } from "lucide-react"
import type { Prompt } from "@/types/marketplace"
import { PromptPreviewModal } from "./PromptPreviewModal"
import taxonomyData from "@/data/taxonomy.json"

// Form validation schema (matches API)
const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  format: z.enum(["general", "prompt-studio", "mcp", "skill"], {
    message: "Please select a format",
  }),
  description: z.string().min(1, "Description is required").max(500),

  // General & MCP: prompt content
  content: z.string().max(5000).optional(),
  inputVariables: z.array(z.string()).optional(),

  // Prompt Studio: model settings and system prompt
  systemPrompt: z.string().max(5000).optional(),
  temperature: z.number().min(0).max(1).optional(),
  maxTokens: z.number().min(1).max(4096).optional(),

  // Skill: skill content
  skillContent: z.string().max(10000).optional(),

  // Business Area / Module / Skill Capability (dynamic based on format)
  businessArea: z.string().min(1, "Please select a module or capability"),

  targetPlatform: z
    .array(
      z.enum([
        "text-enhance",
        "prompt-studio",
        "advisor",
        "mcp",
      ])
    )
    .optional(),
  mcpTools: z.array(z.string()).optional(),
  tags: z.array(z.string()).max(5).optional(),
  submitterName: z.string().min(1, "Name is required"),
  submitterEmail: z.string().email("Valid email required").min(1, "Email is required"),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms",
  }),
})

type FormData = z.infer<typeof formSchema>

export function PromptSubmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{
    success: boolean
    message: string
    prUrl?: string
  } | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string>("")
  const [showPreview, setShowPreview] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const [varInput, setVarInput] = useState("")
  const [mcpToolInput, setMcpToolInput] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tags: [],
      inputVariables: [],
      mcpTools: [],
      targetPlatform: [],
    },
  })

  const watchedFormat = watch("format")
  const watchedTags = watch("tags") || []
  const watchedVariables = watch("inputVariables") || []
  const watchedMcpTools = watch("mcpTools") || []
  const watchedTargetPlatform = watch("targetPlatform") || []

  // Add tag
  const addTag = () => {
    if (tagInput.trim() && watchedTags.length < 5) {
      setValue("tags", [...watchedTags, tagInput.trim()])
      setTagInput("")
    }
  }

  // Remove tag
  const removeTag = (index: number) => {
    setValue(
      "tags",
      watchedTags.filter((_, i) => i !== index)
    )
  }

  // Add variable
  const addVariable = () => {
    if (varInput.trim()) {
      setValue("inputVariables", [...watchedVariables, varInput.trim()])
      setVarInput("")
    }
  }

  // Remove variable
  const removeVariable = (index: number) => {
    setValue(
      "inputVariables",
      watchedVariables.filter((_, i) => i !== index)
    )
  }

  // Add MCP tool
  const addMcpTool = () => {
    if (mcpToolInput.trim()) {
      setValue("mcpTools", [...watchedMcpTools, mcpToolInput.trim()])
      setMcpToolInput("")
    }
  }

  // Remove MCP tool
  const removeMcpTool = (index: number) => {
    setValue(
      "mcpTools",
      watchedMcpTools.filter((_, i) => i !== index)
    )
  }

  // Toggle target platform
  const togglePlatform = (platform: string) => {
    const current = watchedTargetPlatform
    if (current.includes(platform as any)) {
      setValue(
        "targetPlatform",
        current.filter((p) => p !== platform) as any
      )
    } else {
      setValue("targetPlatform", [...current, platform] as any)
    }
  }

  const onSubmit = async (data: FormData) => {
    if (!turnstileToken) {
      setSubmitResult({
        success: false,
        message: "Please complete the CAPTCHA verification",
      })
      return
    }

    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      const response = await fetch("/api/prompts/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          turnstileToken,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitResult({
          success: true,
          message: result.message,
          prUrl: result.prUrl,
        })
        reset()
      } else {
        setSubmitResult({
          success: false,
          message: result.error || "Submission failed. Please try again.",
        })
      }
    } catch (error) {
      setSubmitResult({
        success: false,
        message: "Network error. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Success/Error Message */}
      {submitResult && (
        <Card
          className={`p-4 ${
            submitResult.success
              ? "border-green-500 bg-green-50 dark:bg-green-950"
              : "border-red-500 bg-red-50 dark:bg-red-950"
          }`}
        >
          <div className="flex items-start gap-3">
            {submitResult.success ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            )}
            <div className="flex-1">
              <p
                className={`font-medium ${
                  submitResult.success
                    ? "text-green-900 dark:text-green-100"
                    : "text-red-900 dark:text-red-100"
                }`}
              >
                {submitResult.message}
              </p>
              {submitResult.prUrl && (
                <a
                  href={submitResult.prUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm text-blue-600 underline hover:text-blue-800 dark:text-blue-400"
                >
                  View your pull request on GitHub →
                </a>
              )}
            </div>
          </div>
        </Card>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Customer Balance Lookup"
                maxLength={100}
              />
              <p className="mt-1 text-sm text-muted-foreground">
                {watch("title")?.length || 0}/100
              </p>
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Format - Moved here */}
            <div>
              <Label>Format *</Label>
              <p className="mb-2 text-sm text-muted-foreground">
                Choose the type of prompt you're submitting
              </p>
              <div className="space-y-2">
                <label className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50 cursor-pointer">
                  <input
                    type="radio"
                    value="general"
                    {...register("format")}
                    className="mt-1 h-4 w-4"
                  />
                  <div>
                    <span className="font-medium">General Prompt</span>
                    <p className="text-sm text-muted-foreground">
                      Standard text prompts for Text Enhance and NetSuite Advisor
                    </p>
                  </div>
                </label>
                <label className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50 cursor-pointer">
                  <input
                    type="radio"
                    value="prompt-studio"
                    {...register("format")}
                    className="mt-1 h-4 w-4"
                  />
                  <div>
                    <span className="font-medium">Prompt Studio Template</span>
                    <p className="text-sm text-muted-foreground">
                      Advanced prompts with system instructions and model settings
                    </p>
                  </div>
                </label>
                <label className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50 cursor-pointer">
                  <input
                    type="radio"
                    value="mcp"
                    {...register("format")}
                    className="mt-1 h-4 w-4"
                  />
                  <div>
                    <span className="font-medium">MCP (Model Context Protocol)</span>
                    <p className="text-sm text-muted-foreground">
                      Prompts that use NetSuite MCP tools for data access
                    </p>
                  </div>
                </label>
                <label className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50 cursor-pointer">
                  <input
                    type="radio"
                    value="skill"
                    {...register("format")}
                    className="mt-1 h-4 w-4"
                  />
                  <div>
                    <span className="font-medium">Skill</span>
                    <p className="text-sm text-muted-foreground">
                      Claude Code skills with full markdown content
                    </p>
                  </div>
                </label>
              </div>
              {errors.format && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.format.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <p className="mb-2 text-sm text-muted-foreground">
                Brief summary of what this prompt does
              </p>
              <textarea
                id="description"
                {...register("description")}
                placeholder="Find a customer and show their current balance"
                maxLength={500}
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <p className="mt-1 text-sm text-muted-foreground">
                {watch("description")?.length || 0}/500
              </p>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Category Selection (Dynamic based on format) */}
            {watchedFormat && (
              <div>
                <Label htmlFor="businessArea">
                  {watchedFormat === "skill" ? "Skill Category *" : "Category *"}
                </Label>
                <p className="mb-2 text-sm text-muted-foreground">
                  {watchedFormat === "skill"
                    ? "Choose the specific skill category"
                    : "Choose the specific category for this prompt"}
                </p>
                <select
                  id="businessArea"
                  {...register("businessArea")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">
                    {watchedFormat === "skill" ? "Select a category..." : "Select a category..."}
                  </option>

                  {/* For Skills: Show skill categories grouped by parent capability */}
                  {watchedFormat === "skill" &&
                    Object.entries(
                      Object.entries(taxonomyData.submissionCategories.skills).reduce((acc: any, [key, category]: [string, any]) => {
                        const parent = category.parentCapability
                        if (!acc[parent]) acc[parent] = []
                        acc[parent].push(category)
                        return acc
                      }, {})
                    ).map(([parentCapability, categories]: [string, any]) => (
                      <optgroup
                        key={parentCapability}
                        label={taxonomyData.skillCapabilities[parentCapability as keyof typeof taxonomyData.skillCapabilities]?.displayName || parentCapability}
                      >
                        {categories.map((category: any) => (
                          <option key={category.id} value={category.id}>
                            {category.displayName}
                          </option>
                        ))}
                      </optgroup>
                    ))}

                  {/* For General/Prompt Studio/MCP: Show prompt categories grouped by parent category */}
                  {(watchedFormat === "general" || watchedFormat === "prompt-studio" || watchedFormat === "mcp") &&
                    Object.entries(
                      Object.entries(taxonomyData.submissionCategories.prompts).reduce((acc: any, [key, category]: [string, any]) => {
                        const parent = category.parentCategory
                        if (!acc[parent]) acc[parent] = []
                        acc[parent].push(category)
                        return acc
                      }, {})
                    ).map(([parentCategory, categories]: [string, any]) => {
                      // Map parent category to display name
                      const parentDisplayNames: Record<string, string> = {
                        finance: "Finance",
                        operations: "Operations",
                        sales: "Sales",
                        platform: "Platform",
                        "workforce-global": "Workforce & Global"
                      }
                      return (
                        <optgroup
                          key={parentCategory}
                          label={parentDisplayNames[parentCategory] || parentCategory}
                        >
                          {categories.map((category: any) => (
                            <option key={category.id} value={category.id}>
                              {category.displayName}
                            </option>
                          ))}
                        </optgroup>
                      )
                    })}
                </select>
                {errors.businessArea && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.businessArea.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Format-Specific Content Sections */}
        {watchedFormat && (
          <>
            {/* General Prompt & MCP: Prompt Content */}
            {(watchedFormat === "general" || watchedFormat === "mcp") && (
              <Card className="p-6">
                <h2 className="mb-4 text-xl font-semibold">
                  {watchedFormat === "general" ? "Prompt Content" : "MCP Prompt Content"}
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="content">Prompt Text *</Label>
                    <p className="mb-2 text-sm text-muted-foreground">
                      {watchedFormat === "general"
                        ? "The prompt text for Text Enhance or NetSuite Advisor"
                        : "The prompt that will use MCP tools to access NetSuite data"}
                    </p>
                    <textarea
                      id="content"
                      {...register("content")}
                      placeholder={
                        watchedFormat === "general"
                          ? 'Find customer "[CUSTOMER_NAME]" and show me their current balance...'
                          : 'Use the NetSuite MCP tools to find customer "[CUSTOMER_NAME]" and retrieve their open invoices...'
                      }
                      rows={12}
                      maxLength={5000}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <p className="mt-1 text-sm text-muted-foreground">
                      {watch("content")?.length || 0}/5000
                    </p>
                    {errors.content && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.content.message}
                      </p>
                    )}
                  </div>

                  {/* Variables */}
                  <div>
                    <Label>Input Variables (Optional)</Label>
                    <p className="mb-2 text-sm text-muted-foreground">
                      Add placeholders like [CUSTOMER_NAME] or $&#123;AMOUNT&#125;
                    </p>
                    <div className="flex gap-2">
                      <Input
                        value={varInput}
                        onChange={(e) => setVarInput(e.target.value)}
                        placeholder="CUSTOMER_NAME"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addVariable()
                          }
                        }}
                      />
                      <Button type="button" onClick={addVariable} variant="outline">
                        Add
                      </Button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {watchedVariables.map((variable, index) => (
                        <Badge key={index} variant="secondary">
                          {variable}
                          <button
                            type="button"
                            onClick={() => removeVariable(index)}
                            className="ml-2"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* MCP Tools Selection */}
                  {watchedFormat === "mcp" && (
                    <div>
                      <Label>NetSuite MCP Tools *</Label>
                      <p className="mb-2 text-sm text-muted-foreground">
                        Select the NetSuite MCP tools this prompt will use
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          "getRecord",
                          "searchRecords",
                          "createRecord",
                          "updateRecord",
                          "deleteRecord",
                          "executeSuiteQL",
                          "getCustomer",
                          "getVendor",
                          "getEmployee",
                          "getSavedSearch",
                        ].map((tool) => (
                          <label key={tool} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={watchedMcpTools.includes(tool)}
                              onChange={() => {
                                if (watchedMcpTools.includes(tool)) {
                                  setValue(
                                    "mcpTools",
                                    watchedMcpTools.filter((t) => t !== tool)
                                  )
                                } else {
                                  setValue("mcpTools", [...watchedMcpTools, tool])
                                }
                              }}
                              className="h-4 w-4"
                            />
                            <span className="text-sm font-mono">{tool}</span>
                          </label>
                        ))}
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">
                          Selected tools: {watchedMcpTools.length}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Prompt Studio: System Prompt + Model Settings */}
            {watchedFormat === "prompt-studio" && (
              <Card className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Prompt Studio Template</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="systemPrompt">System Instructions *</Label>
                    <p className="mb-2 text-sm text-muted-foreground">
                      The system-level instructions that guide the model's behavior
                    </p>
                    <textarea
                      id="systemPrompt"
                      {...register("systemPrompt")}
                      placeholder="You are a NetSuite expert assistant. Help users with NetSuite-related questions by providing clear, accurate information..."
                      rows={8}
                      maxLength={5000}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <p className="mt-1 text-sm text-muted-foreground">
                      {watch("systemPrompt")?.length || 0}/5000
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="temperature">Temperature</Label>
                      <p className="mb-2 text-xs text-muted-foreground">
                        Controls randomness (0.0 = focused, 1.0 = creative)
                      </p>
                      <Input
                        id="temperature"
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        {...register("temperature", { valueAsNumber: true })}
                        placeholder="0.7"
                      />
                    </div>

                    <div>
                      <Label htmlFor="maxTokens">Max Tokens</Label>
                      <p className="mb-2 text-xs text-muted-foreground">
                        Maximum length of response
                      </p>
                      <Input
                        id="maxTokens"
                        type="number"
                        min="1"
                        max="4096"
                        {...register("maxTokens", { valueAsNumber: true })}
                        placeholder="1024"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Skill: Skill Content */}
            {watchedFormat === "skill" && (
              <Card className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Skill Content</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="skillContent">Skill Markdown *</Label>
                    <p className="mb-2 text-sm text-muted-foreground">
                      The full markdown content of your Claude Code skill (SKILL.md)
                    </p>
                    <textarea
                      id="skillContent"
                      {...register("skillContent")}
                      placeholder="# Skill Name&#10;&#10;Description of what this skill does...&#10;&#10;## Usage&#10;..."
                      rows={16}
                      maxLength={10000}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <p className="mt-1 text-sm text-muted-foreground">
                      {watch("skillContent")?.length || 0}/10000
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </>
        )}


        {/* Metadata */}
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Metadata & Contact</h2>
          <div className="space-y-4">
            {/* Tags */}
            <div>
              <Label>Tags (Optional, max 5)</Label>
              <p className="mb-2 text-sm text-muted-foreground">
                Add keywords to help others find this prompt
              </p>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="reporting, analysis, customer"
                  disabled={watchedTags.length >= 5}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addTag}
                  variant="outline"
                  disabled={watchedTags.length >= 5}
                >
                  Add
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {watchedTags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-2"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Submitter Name */}
            <div>
              <Label htmlFor="submitterName">Your Name *</Label>
              <Input
                id="submitterName"
                {...register("submitterName")}
                placeholder="John Doe"
              />
              <p className="mt-1 text-sm text-muted-foreground">
                This will be shown as the prompt author
              </p>
              {errors.submitterName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.submitterName.message}
                </p>
              )}
            </div>

            {/* Submitter Email */}
            <div>
              <Label htmlFor="submitterEmail">Your Email *</Label>
              <Input
                id="submitterEmail"
                type="email"
                {...register("submitterEmail")}
                placeholder="john@example.com"
              />
              <p className="mt-1 text-sm text-muted-foreground">
                For notifications about your submission (not displayed publicly)
              </p>
              {errors.submitterEmail && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.submitterEmail.message}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Terms & Submit */}
        <Card className="p-6">
          <div className="space-y-4">
            {/* Terms */}
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                {...register("agreeToTerms")}
                className="mt-1 h-4 w-4"
              />
              <span className="text-sm">
                I agree to contribute this prompt under the MIT License and
                confirm this is my original work or I have rights to submit it
                *
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="text-sm text-red-600">
                {errors.agreeToTerms.message}
              </p>
            )}

            {/* CAPTCHA */}
            <div>
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                onSuccess={setTurnstileToken}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPreview(true)}
                disabled={!watch("title") || !watch("description")}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Submit Prompt
              </Button>
            </div>
          </div>
        </Card>
      </form>

      {/* Preview Modal */}
      {showPreview && (
        <PromptPreviewModal
          formData={watch()}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  )
}
