"use client"

import * as React from "react"
import { Prompt } from "@/types/marketplace"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Zap, Copy, Code } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PromptUsageTabProps {
  prompt: Prompt
}

export function PromptUsageTab({ prompt }: PromptUsageTabProps) {
  // Format-specific usage instructions
  const getFormatInstructions = () => {
    if (prompt.format === "mcp") {
      return {
        title: "Using MCP Prompts",
        steps: [
          {
            title: "Install MCP Standard Tools SuiteApp",
            description: "Install the MCP Standard Tools SuiteApp from the NetSuite SuiteApp Marketplace. This enables MCP tool access in your AI assistant.",
            link: "https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_143403258.html"
          },
          {
            title: "Configure MCP in Your AI Assistant",
            description: "Set up the NetSuite MCP server in Claude Desktop or ChatGPT. You'll need your NetSuite account credentials and MCP endpoint.",
            link: "https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_8204806632.html"
          },
          {
            title: "Use Natural Language Queries",
            description: "Simply copy the prompt text and paste it into your AI assistant. The assistant will automatically invoke the appropriate MCP tools.",
          },
          {
            title: "Review Results",
            description: "The AI will use the MCP tools to retrieve data from NetSuite and present it in a conversational format.",
          }
        ],
        tools: prompt.mcpTools || [],
        example: prompt.content
      }
    } else if (prompt.format === "general") {
      return {
        title: "Using General Prompts",
        steps: [
          {
            title: "Copy the Prompt",
            description: "Click the 'Copy Prompt' button or manually copy the prompt text from the template section.",
          },
          {
            title: "Customize Variables",
            description: "Replace any variables (shown as [VARIABLE] or ${variable}) with your specific values. Use the preview feature to see the filled-in prompt.",
          },
          {
            title: "Paste into Your AI Assistant",
            description: "Paste the customized prompt into Claude, ChatGPT, or any other AI assistant. The prompt is designed to work across platforms.",
          },
          {
            title: "Iterate and Refine",
            description: "Review the AI's response and refine your prompt as needed. You can add more context or adjust variables for better results.",
          }
        ],
        variables: prompt.inputVariables || [],
        example: prompt.content
      }
    }
    return null
  }

  const instructions = getFormatInstructions()
  const usageExamples = prompt.usageExamples || []

  if (!instructions) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">How to Use</h3>
          <p className="text-muted-foreground">
            Follow these steps to get the most out of this prompt:
          </p>
        </div>
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
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Format-Specific Instructions */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          {prompt.format === "mcp" && <Zap className="h-5 w-5 text-blue-500" />}
          {prompt.format === "general" && <Copy className="h-5 w-5 text-green-500" />}
          <h3 className="text-lg font-semibold">{instructions.title}</h3>
        </div>
        <p className="text-muted-foreground mb-4">
          {prompt.format === "mcp" 
            ? "MCP prompts use natural language to interact with NetSuite through Model Context Protocol tools."
            : "General prompts can be copied and used in any AI assistant with minimal customization."}
        </p>
      </div>

      {/* Step-by-Step Instructions */}
      <div className="space-y-4">
        {instructions.steps.map((step, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-base">
                Step {index + 1}: {step.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {step.description}
              </p>
              {step.link && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(step.link, "_blank")}
                >
                  <ExternalLink className="h-3 w-3 mr-2" />
                  View Documentation
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MCP Tools Section */}
      {prompt.format === "mcp" && instructions.tools && instructions.tools.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">MCP Tools Used</CardTitle>
            <CardDescription>
              This prompt uses the following NetSuite MCP tools:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {instructions.tools.map((tool) => (
                <Badge key={tool} variant="outline" className="font-mono">
                  {tool}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Variables Section */}
      {prompt.format === "general" && instructions.variables && instructions.variables.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Input Variables</CardTitle>
            <CardDescription>
              Customize these variables to personalize the prompt:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {instructions.variables.map((variable) => (
                <Badge key={variable} variant="outline" className="font-mono">
                  {variable}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Use the preview feature in the Content tab to see how the prompt looks with your values filled in.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Example Usage */}
      {instructions.example && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Example Query</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="text-sm bg-muted p-2 rounded block whitespace-pre-wrap">
              {instructions.example}
            </code>
          </CardContent>
        </Card>
      )}

      {/* Usage Examples */}
      {usageExamples.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Additional Examples</h3>
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
      )}

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            {prompt.format === "mcp" ? (
              <>
                <li>Ensure MCP Standard Tools SuiteApp is installed and configured</li>
                <li>Use natural language - the AI will translate to appropriate MCP tool calls</li>
                <li>Be specific about what data you need (dates, filters, etc.)</li>
                <li>Review the results for accuracy before using in business decisions</li>
              </>
            ) : (
              <>
                <li>Always replace input variables with specific, relevant values</li>
                <li>Provide context about your NetSuite environment when relevant</li>
                <li>Break down complex requests into smaller, focused prompts</li>
                <li>Review and refine the AI's response before implementing</li>
                <li>Test the suggestions in a sandbox environment first</li>
              </>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
