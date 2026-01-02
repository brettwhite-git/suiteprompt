"use client"

import * as React from "react"
import { Star, User, Calendar, Download as DownloadIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CopyButton } from "./CopyButton"
import { DownloadButton } from "./DownloadButton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Prompt } from "@/types/marketplace"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

interface PromptContentTabProps {
  prompt: Prompt
}

export function PromptContentTab({ prompt }: PromptContentTabProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Extract input variables from prompt content (e.g., [CRITERIA], ${VARIABLE})
  const extractInputVariables = (content: string): string[] => {
    const bracketMatches = content.match(/\[([A-Z_]+)\]/g)
    const dollarMatches = content.match(/\$\{([A-Z_]+)\}/g)
    const allMatches = [...(bracketMatches || []), ...(dollarMatches || [])]
    return allMatches ? [...new Set(allMatches)] : []
  }

  const inputVariables = prompt.inputVariables || extractInputVariables(prompt.content)
  
  // State for variable substitution and preview
  const [variableValues, setVariableValues] = React.useState<Record<string, string>>({})
  const [previewPrompt, setPreviewPrompt] = React.useState<string>("")

  // Generate preview with substituted values
  const generatePreview = () => {
    let preview = prompt.content
    Object.entries(variableValues).forEach(([key, value]) => {
      // Replace both [VARIABLE] and ${variable} formats
      preview = preview.replace(new RegExp(`\\[${key}\\]`, 'g'), value || `[${key}]`)
      preview = preview.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), value || `\${${key}}`)
    })
    setPreviewPrompt(preview)
  }

  const handleVariableChange = (variable: string, value: string) => {
    setVariableValues(prev => ({ ...prev, [variable]: value }))
  }

  // Text Enhance View - Simple prompt content
  if (prompt.targetPlatform === "text-enhance") {
    return (
      <div className="space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{prompt.title}</h2>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{prompt.author.name}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(prompt.updatedAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="capitalize">text-enhance</Badge>
            <Badge variant="secondary" className="capitalize">{prompt.businessArea}</Badge>
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{prompt.rating.average.toFixed(1)}</span>
              <span className="text-muted-foreground">({prompt.rating.count})</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <DownloadIcon className="h-4 w-4" />
              <span>{prompt.downloads} downloads</span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">About this prompt</h3>
          <p className="text-muted-foreground">
            {prompt.longDescription || prompt.description}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Use this prompt with NetSuite's Text Enhance feature to improve text content directly in NetSuite fields.
          </p>
        </div>

        {/* Prompt Content */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Prompt</h3>
            <CopyButton
              content={prompt.content}
              variant="ghost"
              size="sm"
            />
          </div>
          
          <div className="relative">
            <SyntaxHighlighter
              language="text"
              style={vscDarkPlus}
              customStyle={{
                borderRadius: "0.5rem",
                padding: "1rem",
                fontSize: "0.875rem",
                lineHeight: "1.5",
                margin: 0,
              }}
              PreTag="div"
            >
              {prompt.content}
            </SyntaxHighlighter>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {prompt.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <CopyButton
            content={prompt.content}
            variant="default"
            size="default"
          />
          <DownloadButton
            content={prompt.content}
            filename={`${prompt.title.replace(/\s+/g, "-").toLowerCase()}.txt`}
            variant="outline"
            size="default"
          />
        </div>
      </div>
    )
  }

  // NetSuite Advisor View - Natural language query
  if (prompt.targetPlatform === "advisor") {
    return (
      <div className="space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{prompt.title}</h2>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{prompt.author.name}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(prompt.updatedAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="capitalize">advisor</Badge>
            <Badge variant="secondary" className="capitalize">{prompt.businessArea}</Badge>
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{prompt.rating.average.toFixed(1)}</span>
              <span className="text-muted-foreground">({prompt.rating.count})</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <DownloadIcon className="h-4 w-4" />
              <span>{prompt.downloads} downloads</span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">About this prompt</h3>
          <p className="text-muted-foreground">
            {prompt.longDescription || prompt.description}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Use this query with NetSuite Advisor, the native chatbot. Note: NetSuite Advisor provides instant answers but cannot generate artifacts or files.
          </p>
        </div>

        {/* Variables Section */}
        {inputVariables.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Variables</CardTitle>
              <CardDescription>Customize variables in the query</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {inputVariables.map((variable) => {
                const cleanVar = variable.replace(/[\[\]${}]/g, '')
                return (
                  <div key={variable} className="space-y-1">
                    <Label className="text-sm font-mono">{variable}</Label>
                    <Input
                      placeholder={`Enter value for ${cleanVar}`}
                      value={variableValues[cleanVar] || ''}
                      onChange={(e) => handleVariableChange(cleanVar, e.target.value)}
                      className="text-sm"
                    />
                  </div>
                )
              })}
              <Button
                variant="outline"
                onClick={generatePreview}
                className="w-full"
              >
                Generate Preview
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Query Content */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Query</h3>
            <CopyButton
              content={previewPrompt || prompt.content}
              variant="ghost"
              size="sm"
            />
          </div>
          
          <div className="relative">
            <SyntaxHighlighter
              language="text"
              style={vscDarkPlus}
              customStyle={{
                borderRadius: "0.5rem",
                padding: "1rem",
                fontSize: "0.875rem",
                lineHeight: "1.5",
                margin: 0,
              }}
              PreTag="div"
            >
              {previewPrompt || prompt.content}
            </SyntaxHighlighter>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {prompt.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <CopyButton
            content={previewPrompt || prompt.content}
            variant="default"
            size="default"
          />
          <DownloadButton
            content={previewPrompt || prompt.content}
            filename={`${prompt.title.replace(/\s+/g, "-").toLowerCase()}.txt`}
            variant="outline"
            size="default"
          />
        </div>
      </div>
    )
  }

  // MCP Prompt View (like Skills)
  if (prompt.format === "mcp") {
    return (
      <div className="space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{prompt.title}</h2>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{prompt.author.name}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(prompt.updatedAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="capitalize">{prompt.format}</Badge>
            <Badge variant="secondary" className="capitalize">{prompt.businessArea}</Badge>
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{prompt.rating.average.toFixed(1)}</span>
              <span className="text-muted-foreground">({prompt.rating.count})</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <DownloadIcon className="h-4 w-4" />
              <span>{prompt.downloads} downloads</span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">About this prompt</h3>
          <p className="text-muted-foreground">
            {prompt.longDescription || prompt.description}
          </p>
        </div>

        {/* MCP Tools Used */}
        {prompt.mcpTools && prompt.mcpTools.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">MCP Tools Used</h3>
            <div className="flex flex-wrap gap-2">
              {prompt.mcpTools.map((tool) => (
                <Badge key={tool} variant="outline" className="font-mono">
                  {tool}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Prompt Content - Markdown Code Block */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Prompt Content</h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-muted-foreground">Query</h4>
              <CopyButton
                content={prompt.content}
                variant="ghost"
                size="sm"
              />
            </div>
            <div className="relative">
              <SyntaxHighlighter
                language="markdown"
                style={vscDarkPlus}
                customStyle={{
                  borderRadius: "0.5rem",
                  padding: "1rem",
                  fontSize: "0.875rem",
                  lineHeight: "1.5",
                  margin: 0,
                }}
                PreTag="div"
              >
                {prompt.content}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {prompt.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <CopyButton
            content={prompt.content}
            variant="default"
            size="default"
          />
          <DownloadButton
            content={prompt.content}
            filename={`${prompt.title.replace(/\s+/g, "-").toLowerCase()}.txt`}
            variant="outline"
            size="default"
          />
        </div>
      </div>
    )
  }

  // General Prompt View (Prompt Studio Style)
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{prompt.title}</h2>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{prompt.author.name}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(prompt.updatedAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {prompt.targetPlatform && (
            <Badge variant="outline" className="capitalize">{prompt.targetPlatform}</Badge>
          )}
          <Badge variant="outline" className="capitalize">{prompt.format}</Badge>
          <Badge variant="secondary" className="capitalize">{prompt.businessArea}</Badge>
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{prompt.rating.average.toFixed(1)}</span>
            <span className="text-muted-foreground">({prompt.rating.count})</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <DownloadIcon className="h-4 w-4" />
            <span>{prompt.downloads} downloads</span>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">About this prompt</h3>
        <p className="text-muted-foreground">
          {prompt.longDescription || prompt.description}
        </p>
        {prompt.targetPlatform === "prompt-studio" && (
          <p className="text-sm text-muted-foreground mt-2">
            This is a full Prompt Studio template with variables, model settings, and preview functionality.
          </p>
        )}
      </div>

      {/* Variables and Model Settings */}
      {inputVariables.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Variables Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Variables</CardTitle>
              <CardDescription>Customize variables in the prompt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {inputVariables.map((variable) => {
                const cleanVar = variable.replace(/[\[\]${}]/g, '')
                return (
                  <div key={variable} className="space-y-1">
                    <Label className="text-sm font-mono">{variable}</Label>
                    <Input
                      placeholder={`Enter value for ${cleanVar}`}
                      value={variableValues[cleanVar] || ''}
                      onChange={(e) => handleVariableChange(cleanVar, e.target.value)}
                      className="text-sm"
                    />
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Model Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Model Settings</CardTitle>
              <CardDescription>Recommended configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                {prompt.modelSettings?.temperature !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Temperature</span>
                    <span className="font-medium">{prompt.modelSettings.temperature}</span>
                  </div>
                )}
                {prompt.modelSettings?.topP !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Top P</span>
                    <span className="font-medium">{prompt.modelSettings.topP}</span>
                  </div>
                )}
                {prompt.modelSettings?.topK !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Top K</span>
                    <span className="font-medium">{prompt.modelSettings.topK}</span>
                  </div>
                )}
                {prompt.modelSettings?.maxTokens !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Tokens</span>
                    <span className="font-medium">{prompt.modelSettings.maxTokens}</span>
                  </div>
                )}
                {prompt.modelSettings?.presencePenalty !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Presence Penalty</span>
                    <span className="font-medium">{prompt.modelSettings.presencePenalty}</span>
                  </div>
                )}
                {prompt.modelSettings?.frequencyPenalty !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frequency Penalty</span>
                    <span className="font-medium">{prompt.modelSettings.frequencyPenalty}</span>
                  </div>
                )}
                {!prompt.modelSettings && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Temperature</span>
                      <span className="font-medium">0.2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Top P</span>
                      <span className="font-medium">0.7</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Top K</span>
                      <span className="font-medium">500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Max Tokens</span>
                      <span className="font-medium">2000</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Prompt Template */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Prompt Template</h3>
          <CopyButton
            content={prompt.content}
            variant="ghost"
            size="sm"
          />
        </div>
        
        <div className="space-y-2">
          <div className="relative">
            <SyntaxHighlighter
              language="text"
              style={vscDarkPlus}
              customStyle={{
                borderRadius: "0.5rem",
                padding: "1rem",
                fontSize: "0.875rem",
                lineHeight: "1.5",
                margin: 0,
              }}
              PreTag="div"
            >
              {prompt.content}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      {inputVariables.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preview</CardTitle>
            <CardDescription>See how the prompt looks with your values</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              onClick={generatePreview}
              className="w-full"
            >
              Generate Preview
            </Button>
            {previewPrompt && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Prompt to Preview</Label>
                <div className="relative">
                  <SyntaxHighlighter
                    language="text"
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: "0.5rem",
                      padding: "1rem",
                      fontSize: "0.875rem",
                      lineHeight: "1.5",
                      margin: 0,
                    }}
                    PreTag="div"
                  >
                    {previewPrompt}
                  </SyntaxHighlighter>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {prompt.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 pt-4 border-t">
        <CopyButton
          content={previewPrompt || prompt.content}
          variant="default"
          size="default"
        />
        <DownloadButton
          content={previewPrompt || prompt.content}
          filename={`${prompt.title.replace(/\s+/g, "-").toLowerCase()}.txt`}
          variant="outline"
          size="default"
        />
      </div>
    </div>
  )
}
