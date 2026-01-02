"use client"

import { useState, useEffect } from "react"
import { ChevronRight, type LucideIcon } from "lucide-react"

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
import { cn } from "@/lib/utils"

export function NavMain({
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
  // Track open state for each collapsible item
  const [openStates, setOpenStates] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    items.forEach((item) => {
      if (item.items?.length) {
        initial[item.title] = true // Default to open
      }
    })
    return initial
  })

  // Track if initial animation has completed (only animate on first mount)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    // Trigger fade-in animation after a brief delay to ensure smooth transition
    const timer = setTimeout(() => {
      setHasAnimated(true)
    }, 50)
    return () => clearTimeout(timer)
  }, []) // Empty deps - only run on mount

  const toggleOpen = (itemTitle: string) => {
    setOpenStates((prev) => ({
      ...prev,
      [itemTitle]: !prev[itemTitle],
    }))
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, itemIndex) => {
          if (item.items?.length) {
            const isOpen = openStates[item.title] ?? true
            const isVisible = hasAnimated
            return (
              <Collapsible 
                key={item.title} 
                asChild 
                open={isOpen}
                onOpenChange={() => toggleOpen(item.title)}
              >
                <SidebarMenuItem
                  className={cn(
                    "transition-all duration-300 ease-out",
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-1"
                  )}
                  style={{
                    transitionDelay: isVisible ? `${itemIndex * 50}ms` : "0ms",
                  }}
                >
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90 transition-transform duration-200">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem, index) => {
                        // Items are visible when open AND either:
                        // - hasAnimated is true (initial animation completed), OR
                        // - hasAnimated is false but we're on initial mount (will animate soon)
                        // This ensures fade-in only happens on initial load, not on subsequent toggles
                        const subIsVisible = isOpen && hasAnimated
                        return (
                          <SidebarMenuSubItem 
                            key={subItem.title}
                            className={cn(
                              "transition-all duration-300 ease-out",
                              subIsVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-1"
                            )}
                            style={{
                              // Only apply stagger delay on initial animation
                              // Add delay for parent item animation plus sub-item delay
                              transitionDelay: subIsVisible ? `${(itemIndex * 50) + ((index + 1) * 50)}ms` : "0ms",
                            }}
                          >
                            <SidebarMenuSubButton asChild>
                              <a href={subItem.url}>
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          }
          
          return (
            <SidebarMenuItem 
              key={item.title}
              className={cn(
                "transition-all duration-300 ease-out",
                hasAnimated
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-1"
              )}
              style={{
                transitionDelay: hasAnimated ? `${itemIndex * 50}ms` : "0ms",
              }}
            >
              <SidebarMenuButton asChild tooltip={item.title}>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
