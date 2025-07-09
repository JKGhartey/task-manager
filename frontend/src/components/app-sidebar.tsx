"use client";

import * as React from "react";

import {
  IconBuilding,
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { ROUTES } from "@/routes/routes";

const data = {
  navMain: [
    {
      title: "My Dashboard",
      url: ROUTES.USER.DASHBOARD,
      icon: IconDashboard,
    },
    {
      title: "My Tasks",
      url: ROUTES.USER.MY_TASKS,
      icon: IconListDetails,
    },
    {
      title: "Departments",
      url: ROUTES.USER.VIEW_DEPARTMENTS,
      icon: IconBuilding,
    },
    {
      title: "My Progress",
      url: "#",
      icon: IconChartBar,
    },
    {
      title: "My Projects",
      url: "#",
      icon: IconFolder,
    },
    {
      title: "My Team",
      url: "#",
      icon: IconUsers,
    },
  ],
  navClouds: [
    {
      title: "Task Management",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Tasks",
          url: "#",
        },
        {
          title: "Completed Tasks",
          url: "#",
        },
      ],
    },
    {
      title: "Task Details",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Task History",
          url: "#",
        },
        {
          title: "Task Reports",
          url: "#",
        },
      ],
    },
    {
      title: "Task Templates",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Available Templates",
          url: "#",
        },
        {
          title: "My Templates",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "My Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search Tasks",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "My Data",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "My Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Task Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="offcanvas"
      className="bg-gradient-to-b from-background to-muted/20 backdrop-blur-sm"
      {...props}
    >
      <SidebarHeader className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-3 hover:bg-accent/50 transition-colors duration-200"
            >
              <a href="#" className="flex items-center gap-3">
                <img
                  src="/logo.jpg"
                  alt="TaskManager Logo"
                  className="h-8 w-8 rounded-lg object-cover shadow-sm"
                />
                <div className="flex flex-col items-start">
                  <span className="text-base font-semibold tracking-tight">
                    Task Manager
                  </span>
                  <span className="text-xs text-muted-foreground">
                    User Dashboard
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <div className="space-y-6">
          <NavMain items={data.navMain} />

          <SidebarSeparator className="bg-border/50" />

          <NavDocuments items={data.documents} />

          <SidebarSeparator className="bg-border/50" />

          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
