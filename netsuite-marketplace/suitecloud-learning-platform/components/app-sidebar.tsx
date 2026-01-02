"use client"

import * as React from "react"
import {
  Code,
  Command,
  Folder,
  GraduationCap,
  Home,
  Atom,
  MessageSquare,
  Package,
  Sparkles,
  Type,
  Waves,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import taxonomyData from "@/data/taxonomy.json"

// Generate MCP Prompts categories from all business areas in taxonomy
function generateMCPPromptsCategories() {
  const categories = Object.entries(taxonomyData.businessAreas).map(([key, area]) => ({
    title: area.displayName,
    url: `/marketplace/mcp-prompts?businessArea=${key}`,
  }))

  return [
    {
      title: "Categories",
      url: "/marketplace/mcp-prompts",
      icon: Atom,
      isActive: false,
      items: categories,
    },
  ]
}

// Generate Skills categories from capability groups in taxonomy
function generateSkillsCategories() {
  const categories = Object.entries(taxonomyData.skillCapabilities).map(([key, capability]) => ({
    title: capability.displayName,
    url: `/marketplace/skills?capability=${key}`,
  }))

  return [
    {
      title: "Skills",
      url: "/marketplace/skills",
      icon: Package,
      isActive: false,
      items: categories,
    },
  ]
}

const data = {
  navPlatform: [
    {
      title: "Native Features",
      url: "#",
      icon: Home,
      isActive: false,
      items: [
        {
          title: "Text Enhance",
          url: "/marketplace/text-enhance",
        },
        {
          title: "Prompt Studio",
          url: "/marketplace/prompt-studio",
        },
        {
          title: "NetSuite Adviser",
          url: "/marketplace/advisor",
        },
      ],
    },
  ],
  navMCPPrompts: generateMCPPromptsCategories(),
  navSkills: generateSkillsCategories(),
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="[&_svg]:!size-6">
              <a href="/marketplace">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-lg [&>svg]:size-6">
                  <Waves className="text-sidebar-primary-foreground" style={{ width: '1.5rem', height: '1.5rem' }} />
                </div>
                <div className="grid flex-1 text-left text-base leading-tight">
                  <span className="truncate font-normal">
                    SuitePrompt
                  </span>
                  <span className="truncate text-xs">NetSuite Ai Skills</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navPlatform} label="Platform" />
        <NavMain items={data.navMCPPrompts} label="MCP Prompts" />
        <NavMain items={data.navSkills} label="Skills" />
      </SidebarContent>
    </Sidebar>
  )
}
