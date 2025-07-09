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
  IconHelp,
  IconKey,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconShield,
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

const adminData = {
  navMain: [
    {
      title: "Admin Dashboard",
      url: ROUTES.ADMIN.DASHBOARD,
      icon: IconDashboard,
    },
    {
      title: "Manage Tasks",
      url: ROUTES.ADMIN.MANAGE_TASKS,
      icon: IconListDetails,
    },
    {
      title: "Manage Users",
      url: ROUTES.ADMIN.MANAGE_USERS,
      icon: IconUsers,
    },
    {
      title: "System Analytics",
      url: ROUTES.ADMIN.SYSTEM_ANALYTICS,
      icon: IconChartBar,
    },
    {
      title: "Department Management",
      url: "#",
      icon: IconBuilding,
    },
    {
      title: "System Health",
      url: ROUTES.ADMIN.SYSTEM_HEALTH,
      icon: IconActivity,
    },
  ],
  navClouds: [
    {
      title: "Administrative Tools",
      icon: IconShield,
      isActive: true,
      url: "#",
      items: [
        {
          title: "User Permissions",
          url: "#",
        },
        {
          title: "Role Management",
          url: "#",
        },
        {
          title: "System Settings",
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
          title: "User Activity Reports",
          url: "#",
        },
        {
          title: "System Performance",
          url: "#",
        },
        {
          title: "Task Analytics",
          url: "#",
        },
      ],
    },
    {
      title: "Security & Access",
      icon: IconKey,
      url: "#",
      items: [
        {
          title: "Access Logs",
          url: "#",
        },
        {
          title: "Security Alerts",
          url: "#",
        },
        {
          title: "Audit Trail",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Admin Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "System Alerts",
      url: "#",
      icon: IconAlertTriangle,
    },
    {
      title: "Admin Help",
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
      name: "System Data",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Admin Reports",
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

export function AdminSidebar({
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
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-700 text-white shadow-sm">
                  <IconShield className="!size-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-base font-semibold tracking-tight">
                    Task Manager
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Admin Panel
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <div className="space-y-6">
          <NavMain items={adminData.navMain} />

          <SidebarSeparator className="bg-border/50" />

          <NavDocuments items={adminData.documents} />

          <SidebarSeparator className="bg-border/50" />

          <NavSecondary items={adminData.navSecondary} className="mt-auto" />
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
