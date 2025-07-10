"use client";

import * as React from "react";

import {
  IconActivity,
  IconAlertTriangle,
  IconBuilding,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileDescription,
  IconFolder,
  IconHelp,
  IconKey,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconShield,
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

const managerData = {
  navMain: [
    {
      title: "Manager Dashboard",
      url: ROUTES.ADMIN.DASHBOARD,
      icon: IconDashboard,
    },
    {
      title: "Manage Tasks",
      url: ROUTES.ADMIN.MANAGE_TASKS,
      icon: IconListDetails,
    },
    {
      title: "Manage Projects",
      url: ROUTES.ADMIN.MANAGE_PROJECTS,
      icon: IconFolder,
    },
    {
      title: "Manage Departments",
      url: ROUTES.ADMIN.MANAGE_DEPARTMENTS,
      icon: IconBuilding,
    },
    {
      title: "System Analytics",
      url: ROUTES.ADMIN.SYSTEM_ANALYTICS,
      icon: IconChartBar,
    },
    {
      title: "System Health",
      url: ROUTES.ADMIN.SYSTEM_HEALTH,
      icon: IconActivity,
    },
  ],
  navClouds: [
    {
      title: "Management Tools",
      icon: IconShield,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Team Management",
          url: "#",
        },
        {
          title: "Project Settings",
          url: "#",
        },
        {
          title: "Department Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Reports & Analytics",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Team Activity Reports",
          url: "#",
        },
        {
          title: "Project Performance",
          url: "#",
        },
        {
          title: "Task Analytics",
          url: "#",
        },
      ],
    },
    {
      title: "Access Control",
      icon: IconKey,
      url: "#",
      items: [
        {
          title: "Team Access",
          url: "#",
        },
        {
          title: "Project Permissions",
          url: "#",
        },
        {
          title: "Activity Logs",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Manager Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "System Alerts",
      url: "#",
      icon: IconAlertTriangle,
    },
    {
      title: "Manager Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search System",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Team Data",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Manager Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "System Logs",
      url: "#",
      icon: IconFileDescription,
    },
  ],
};

export function ManagerSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
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
                    Manager Panel
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <div className="space-y-6">
          <NavMain items={managerData.navMain} />

          <SidebarSeparator className="bg-border/50" />

          <NavDocuments items={managerData.documents} />

          <SidebarSeparator className="bg-border/50" />

          <NavSecondary items={managerData.navSecondary} className="mt-auto" />
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
