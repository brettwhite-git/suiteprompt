"use client"

import * as React from "react"
import {
  Code,
  Command,
  GraduationCap,
  LifeBuoy,
  MessageSquare,
  Package,
  Send,
  Sparkles,
  Zap,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
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
  navMain: [
    {
      title: "MCP Prompts",
      url: "/marketplace/prompts",
      icon: MessageSquare,
      isActive: false,
      items: [
        {
          title: "All Prompts",
          url: "/marketplace/prompts",
        },
        {
          title: "Sales",
          url: "/marketplace/prompts/sales",
        },
        {
          title: "Forecasting",
          url: "/marketplace/prompts/forecasting",
        },
        {
          title: "Inventory",
          url: "/marketplace/prompts/inventory",
        },
        {
          title: "Manufacturing",
          url: "/marketplace/prompts/manufacturing",
        },
        {
          title: "Accounting",
          url: "/marketplace/prompts/accounting",
        },
        {
          title: "Field Service",
          url: "/marketplace/prompts/field-service",
        },
        {
          title: "Support",
          url: "/marketplace/prompts/support",
        },
      ],
    },
    {
      title: "Prompt Studio",
      url: "/marketplace/prompt-studio",
      icon: Sparkles,
      isActive: false,
      items: [],
    },
    {
      title: "Advisor",
      url: "/marketplace/advisor",
      icon: Command,
      isActive: false,
      items: [],
    },
    {
      title: "Skills",
      url: "/marketplace/skills",
      icon: Package,
      isActive: false,
      items: [],
    },
    {
      title: "SuiteCloud",
      url: "/marketplace/learning",
      icon: GraduationCap,
      isActive: false,
      items: [
        {
          title: "Architecture Overview",
          url: "/marketplace/learn/functional-users",
        },
        {
          title: "SuiteCloud Basics",
          url: "/marketplace/learn/developers",
        },
        {
          title: "Advanced Strategies",
          url: "/marketplace/learn/advanced",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/marketplace">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Zap className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    NetSuite Marketplace
                  </span>
                  <span className="truncate text-xs">Prompts & Skills</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
