"use client"

import * as React from "react"
import { Prompt } from "@/types/marketplace"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PromptUsageTabProps {
  prompt: Prompt
}

export function PromptUsageTab({ prompt }: PromptUsageTabProps) {
  // Default usage examples if not provided
  const usageExamples = prompt.usageExamples || [
    `Replace the placeholders in the prompt with your specific values. For example, if the prompt contains [CRITERIA], replace it with your actual search criteria.`,
    `Copy the entire prompt and paste it into your AI assistant (Claude, ChatGPT, etc.).`,
    `Review the response and iterate as needed to refine the results.`,
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">How to Use</h3>
        <p className="text-muted-foreground">
          Follow these steps to get the most out of this prompt:
        </p>
      </div>

      {/* Usage Examples */}
      <div className="space-y-4">
        {usageExamples.map((example, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-base">Example {index + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {example}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Best Practices */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Best Practices</h3>
        <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
          <li>Always replace input variables with specific, relevant values</li>
          <li>Provide context about your NetSuite environment when relevant</li>
          <li>Break down complex requests into smaller, focused prompts</li>
          <li>Review and refine the AI's response before implementing</li>
          <li>Test the suggestions in a sandbox environment first</li>
        </ul>
      </div>

      {/* Common Variations */}
      {prompt.inputVariables && prompt.inputVariables.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Common Variations</h3>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              You can customize this prompt by modifying the input variables:
            </p>
            <div className="flex flex-wrap gap-2">
              {prompt.inputVariables.map((variable) => (
                <Badge key={variable} variant="outline" className="font-mono">
                  {variable}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
