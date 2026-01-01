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
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "NetSuite User",
    email: "user@netsuite.com",
    avatar: "/avatars/netsuite.jpg",
  },
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
  navMCPPrompts: [
    {
      title: "Categories",
      url: "/marketplace/mcp-prompts",
      icon: Atom,
      isActive: false,
      items: [
        {
          title: "Accounting",
          url: "/marketplace/mcp-prompts?category=accounting",
        },
        {
          title: "Field Service",
          url: "/marketplace/mcp-prompts?category=field-service",
        },
        {
          title: "Forecasting",
          url: "/marketplace/mcp-prompts?category=forecasting",
        },
        {
          title: "Inventory",
          url: "/marketplace/mcp-prompts?category=inventory",
        },
        {
          title: "Manufacturing",
          url: "/marketplace/mcp-prompts?category=manufacturing",
        },
        {
          title: "Sales",
          url: "/marketplace/mcp-prompts?category=sales",
        },
      ],
    },
  ],
  navSkills: [
    {
      title: "Skills",
      url: "/marketplace/skills",
      icon: Package,
      isActive: false,
      items: [
        {
          title: "MCP Custom Tools",
          url: "/marketplace/skills?category=mcp-custom-tools",
        },
        {
          title: "SuiteScript",
          url: "/marketplace/skills?category=suitescript",
        },
        {
          title: "System Audit",
          url: "/marketplace/skills?category=system-audit",
        },
        {
          title: "Admin",
          url: "/marketplace/skills?category=admin",
        },
        {
          title: "DevOps",
          url: "/marketplace/skills?category=devops",
        },
        {
          title: "LLM",
          url: "/marketplace/skills?category=llm",
        },
      ],
    },
  ],
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
                  <span className="truncate text-xs">NetSuite Prompts</span>
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
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
