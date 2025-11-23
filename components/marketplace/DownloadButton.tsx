"use client"

import * as React from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DownloadButtonProps {
  content: string
  filename: string
  className?: string
  variant?: "default" | "outline" | "ghost" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
}

export function DownloadButton({
  content,
  filename,
  className,
  variant = "outline",
  size = "default",
}: DownloadButtonProps) {
  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      className={cn(className)}
    >
      <Download className="h-4 w-4 mr-2" />
      Download
    </Button>
  )
}

