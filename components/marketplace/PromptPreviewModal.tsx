"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PromptCard } from "./PromptCard"
import type { Prompt } from "@/types/marketplace"

interface PromptPreviewModalProps {
  formData: any
  onClose: () => void
}

export function PromptPreviewModal({
  formData,
  onClose,
}: PromptPreviewModalProps) {
  // Create a mock Prompt object from form data
  const mockPrompt: Prompt = {
    id: "preview",
    title: formData.title || "Untitled Prompt",
    description: formData.description || "No description provided",
    longDescription: formData.longDescription,
    content: formData.content || "",
    format: formData.format || "general",
    businessArea: formData.businessArea || "admin",
    targetPlatform: formData.targetPlatform?.[0],
    mcpTools: formData.mcpTools,
    inputVariables: formData.inputVariables,
    compatibility: [],
    author: {
      id: "preview",
      name: formData.submitterName || "Anonymous",
      avatar: "",
    },
    rating: {
      average: 0,
      count: 0,
    },
    downloads: 0,
    tags: formData.tags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-900">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Preview</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This is how your prompt will appear in the marketplace:
          </p>
          <PromptCard prompt={mockPrompt} />

          {/* Full Content Preview */}
          {formData.content && (
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">Full Prompt Content:</h3>
              <pre className="whitespace-pre-wrap rounded bg-gray-100 p-3 text-sm dark:bg-gray-800">
                {formData.content}
              </pre>
            </div>
          )}

          {/* Variables Preview */}
          {formData.inputVariables && formData.inputVariables.length > 0 && (
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">Input Variables:</h3>
              <div className="flex flex-wrap gap-2">
                {formData.inputVariables.map((variable: string, index: number) => (
                  <code
                    key={index}
                    className="rounded bg-blue-100 px-2 py-1 text-sm dark:bg-blue-900"
                  >
                    {variable}
                  </code>
                ))}
              </div>
            </div>
          )}

          {/* Tags Preview */}
          {formData.tags && formData.tags.length > 0 && (
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="rounded-full bg-gray-200 px-3 py-1 text-sm dark:bg-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Close Preview</Button>
        </div>
      </div>
    </div>
  )
}
