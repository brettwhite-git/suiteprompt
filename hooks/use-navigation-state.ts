"use client"

import { useState, useEffect, useCallback } from "react"

const STORAGE_KEY = "suiteprompt_nav_state"

interface NavigationState {
  expandedFolders: Set<string>
}

export function useNavigationState() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [isHydrated, setIsHydrated] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as string[]
        setExpandedFolders(new Set(parsed))
      }
    } catch (error) {
      console.error("Failed to load navigation state:", error)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!isHydrated) return
    
    try {
      const foldersArray = Array.from(expandedFolders)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(foldersArray))
    } catch (error) {
      console.error("Failed to save navigation state:", error)
    }
  }, [expandedFolders, isHydrated])

  const toggleFolder = useCallback((folderId: string, markInteracted: boolean = true) => {
    if (markInteracted) {
      setHasInteracted(true) // Mark as interacted when user manually toggles
    }
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(folderId)) {
        next.delete(folderId)
      } else {
        next.add(folderId)
      }
      return next
    })
  }, [])

  const isExpanded = useCallback(
    (folderId: string) => {
      return expandedFolders.has(folderId)
    },
    [expandedFolders]
  )

  const resetNavigation = useCallback(() => {
    setExpandedFolders(new Set())
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error("Failed to reset navigation state:", error)
    }
  }, [])

  return {
    toggleFolder,
    isExpanded,
    resetNavigation,
    isHydrated,
    hasInteracted,
  }
}
