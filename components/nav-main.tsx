"use client"

import { useState, useEffect, Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ChevronRight, type LucideIcon } from "lucide-react"
import { useNavigationState } from "@/hooks/use-navigation-state"
import { cn } from "@/lib/utils"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

function NavMainContent({
  items,
  label = "Platform",
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
  label?: string
}) {
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { toggleFolder, isExpanded, isHydrated, hasInteracted } = useNavigationState()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Generate a unique folder ID based on label and item title
  const getFolderId = (itemTitle: string) => {
    return `${label.toLowerCase().replace(/\s+/g, "-")}-${itemTitle.toLowerCase().replace(/\s+/g, "-")}`
  }

  // Check if current URL matches folder or any sub-item
  const isCurrentFolder = (item: { url: string; items?: { url: string }[] }) => {
    // Parse item URL to get base and params
    const [itemBase, itemQuery] = item.url.split("?")
    const itemParams = new URLSearchParams(itemQuery || "")
    const itemCategory = itemParams.get("category")
    const itemCapability = itemParams.get("capability")
    
    // Must match both path AND category/capability param (if present)
    if (pathname === itemBase) {
      // Check category (for prompts)
      if (itemCategory) {
        const currentCategory = searchParams.get("category")
        if (currentCategory === itemCategory) {
          return true
        }
      }
      // Check capability (for skills)
      else if (itemCapability) {
        const currentCapability = searchParams.get("capability")
        if (currentCapability === itemCapability) {
          return true
        }
      }
      // No filter params = matches if path matches
      else if (!itemCategory && !itemCapability) {
        return true
      }
    }
    
    // Check if any sub-item URL matches
    if (item.items) {
      return item.items.some((subItem) => {
        const [subBase, subQuery] = subItem.url.split("?")
        const subParams = new URLSearchParams(subQuery || "")
        const subCategory = subParams.get("category")
        const subCapability = subParams.get("capability")
        const subModule = subParams.get("module")
        const subSub = subParams.get("sub")
        
        // Match path
        if (pathname === subBase) {
          const currentCategory = searchParams.get("category")
          const currentCapability = searchParams.get("capability")
          const currentModule = searchParams.get("module")
          const currentSub = searchParams.get("sub")
          
          // Match category if present (prompts)
          if (subCategory && currentCategory !== subCategory) {
            return false
          }
          
          // Match capability if present (skills)
          if (subCapability && currentCapability !== subCapability) {
            return false
          }
          
          // Match module if present (prompts sub-item)
          if (subModule && currentModule !== subModule) {
            return false
          }
          
          // Match sub if present (skills sub-item)
          if (subSub && currentSub !== subSub) {
            return false
          }
          
          return true
        }
        
        return false
      })
    }
    
    return false
  }

  // Auto-expand folders that match current URL on mount/route change
  useEffect(() => {
    if (!isHydrated || !isMounted) return
    
    items.forEach((item) => {
      if (item.items?.length && isCurrentFolder(item)) {
        const folderId = getFolderId(item.title)
        // Only expand if not already expanded to avoid unnecessary state updates
        if (!isExpanded(folderId)) {
          // Use a small delay to avoid race conditions
          // Don't mark as interacted - this is programmatic expansion
          setTimeout(() => toggleFolder(folderId, false), 0)
        }
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams?.toString(), isHydrated, isMounted])

  if (!isMounted || !isHydrated) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>{label}</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    )
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          if (item.items?.length) {
            const folderId = getFolderId(item.title)
            const isOpen = isExpanded(folderId)

            return (
              <Collapsible 
                key={item.title} 
                asChild 
                open={isOpen}
                onOpenChange={() => toggleFolder(folderId)}
              >
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className={cn(
                      "data-[state=open]:rotate-90",
                      hasInteracted && "transition-transform duration-200"
                    )}>
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent className={cn(
                    hasInteracted && "data-[state=open]:animate-fade-slide-in"
                  )}>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          }
          
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export function NavMain(props: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
  label?: string
}) {
  return (
    <Suspense fallback={
      <SidebarGroup>
        <SidebarGroupLabel>{props.label || "Platform"}</SidebarGroupLabel>
        <SidebarMenu />
      </SidebarGroup>
    }>
      <NavMainContent {...props} />
    </Suspense>
  )
}
