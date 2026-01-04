"use client"

import * as React from "react"
import Link from "next/link"
import {
  Code,
  Home,
  Waves,
  Calculator,
  TrendingUp,
  Factory,
  Settings,
  Globe,
  BarChart,
  Zap,
  Plug,
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
import { useNavigationState } from "@/hooks/use-navigation-state"

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
  navMCPPrompts: [
    {
      title: "Finance",
      url: "/marketplace/prompts?category=finance",
      icon: Calculator,
      isActive: false,
      items: [
        {
          title: "Accounting",
          url: "/marketplace/prompts?category=finance&module=accounting",
        },
        {
          title: "Forecasting",
          url: "/marketplace/prompts?category=finance&module=forecasting",
        },
      ],
    },
    {
      title: "Operations",
      url: "/marketplace/prompts?category=operations",
      icon: Factory,
      isActive: false,
      items: [
        {
          title: "Inventory",
          url: "/marketplace/prompts?category=operations&module=inventory",
        },
        {
          title: "Manufacturing",
          url: "/marketplace/prompts?category=operations&module=manufacturing",
        },
        {
          title: "Procurement",
          url: "/marketplace/prompts?category=operations&module=procurement",
        },
        {
          title: "Field Service",
          url: "/marketplace/prompts?category=operations&module=field-service",
        },
      ],
    },
    {
      title: "Sales",
      url: "/marketplace/prompts?category=sales",
      icon: TrendingUp,
      isActive: false,
      items: [
        {
          title: "Sales",
          url: "/marketplace/prompts?category=sales&module=sales",
        },
        {
          title: "CRM",
          url: "/marketplace/prompts?category=sales&module=crm",
        },
        {
          title: "Support",
          url: "/marketplace/prompts?category=sales&module=support",
        },
        {
          title: "eCommerce",
          url: "/marketplace/prompts?category=sales&module=ecommerce",
        },
      ],
    },
    {
      title: "Platform",
      url: "/marketplace/prompts?category=platform",
      icon: Code,
      isActive: false,
      items: [
        {
          title: "SuiteCloud",
          url: "/marketplace/prompts?category=platform&module=suitecloud",
        },
        {
          title: "Administration",
          url: "/marketplace/prompts?category=platform&module=administration",
        },
      ],
    },
    {
      title: "Workforce & Global",
      url: "/marketplace/prompts?category=workforce-global",
      icon: Globe,
      isActive: false,
      items: [
        {
          title: "Project Management",
          url: "/marketplace/prompts?category=workforce-global&module=project-management",
        },
        {
          title: "Human Resources",
          url: "/marketplace/prompts?category=workforce-global&module=human-resources",
        },
        {
          title: "International",
          url: "/marketplace/prompts?category=workforce-global&module=international",
        },
      ],
    },
  ],
  navSkills: [
    {
      title: "Development",
      url: "/marketplace/skills?capability=development",
      icon: Code,
      isActive: false,
      items: [
        {
          title: "SuiteScript",
          url: "/marketplace/skills?capability=development&sub=suitescript",
        },
        {
          title: "SuiteQL",
          url: "/marketplace/skills?capability=development&sub=suiteql",
        },
        {
          title: "Customization",
          url: "/marketplace/skills?capability=development&sub=customization",
        },
      ],
    },
    {
      title: "Administration",
      url: "/marketplace/skills?capability=administration",
      icon: Settings,
      isActive: false,
      items: [
        {
          title: "System Audit",
          url: "/marketplace/skills?capability=administration&sub=system-audit",
        },
        {
          title: "User Management",
          url: "/marketplace/skills?capability=administration&sub=user-management",
        },
        {
          title: "Roles & Permissions",
          url: "/marketplace/skills?capability=administration&sub=roles-permissions",
        },
      ],
    },
    {
      title: "Integration",
      url: "/marketplace/skills?capability=integration",
      icon: Plug,
      isActive: false,
      items: [
        {
          title: "MCP Tools",
          url: "/marketplace/skills?capability=integration&sub=mcp-tools",
        },
        {
          title: "Connectors",
          url: "/marketplace/skills?capability=integration&sub=connectors",
        },
        {
          title: "APIs",
          url: "/marketplace/skills?capability=integration&sub=apis",
        },
      ],
    },
    {
      title: "Analytics",
      url: "/marketplace/skills?capability=analytics",
      icon: BarChart,
      isActive: false,
      items: [
        {
          title: "Reporting",
          url: "/marketplace/skills?capability=analytics&sub=reporting",
        },
        {
          title: "Dashboards",
          url: "/marketplace/skills?capability=analytics&sub=dashboards",
        },
        {
          title: "Data Analysis",
          url: "/marketplace/skills?capability=analytics&sub=data-analysis",
        },
      ],
    },
    {
      title: "Automation",
      url: "/marketplace/skills?capability=automation",
      icon: Zap,
      isActive: false,
      items: [
        {
          title: "Workflows",
          url: "/marketplace/skills?capability=automation&sub=workflows",
        },
        {
          title: "Scheduled Scripts",
          url: "/marketplace/skills?capability=automation&sub=scheduled-scripts",
        },
        {
          title: "Process Automation",
          url: "/marketplace/skills?capability=automation&sub=process-automation",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { resetNavigation } = useNavigationState()

  const handleLogoClick = () => {
    resetNavigation()
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="[&_svg]:!size-6">
              <Link href="/marketplace" onClick={handleLogoClick}>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-lg [&>svg]:size-6">
                  <Waves className="text-sidebar-primary-foreground" style={{ width: '1.5rem', height: '1.5rem' }} />
                </div>
                <div className="grid flex-1 text-left text-base leading-tight">
                  <span className="truncate font-normal">
                    SuitePrompt
                  </span>
                  <span className="truncate text-xs">NetSuite Prompts</span>
                </div>
              </Link>
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
