"use client";

import {
  IconDots,
  IconFolder,
  IconShare3,
  IconTrash,
  type Icon,
} from "@tabler/icons-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/hooks/use-sidebar";

export function NavDocuments({
  items,
}: {
  items: {
    name: string;
    url: string;
    icon: Icon;
  }[];
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
        Quick Access
      </SidebarGroupLabel>
      <SidebarMenu className="space-y-1">
        {items.map((item) => (
          <SidebarMenuItem key={item.name} className="w-full">
            <SidebarMenuButton
              asChild
              className="w-full h-9 px-3 text-sm flex items-center gap-3 rounded-lg hover:bg-accent/80 hover:text-accent-foreground transition-all duration-200 group border-0"
            >
              <a href={item.url}>
                <item.icon className="size-4 text-muted-foreground group-hover:text-accent-foreground transition-colors duration-200" />
                <span className="font-medium">{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  showOnHover
                  className="data-[state=open]:bg-accent rounded-md hover:bg-accent/80 transition-colors duration-200 border-0"
                >
                  <IconDots className="size-3" />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-32 rounded-lg shadow-lg border"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem className="gap-2">
                  <IconFolder className="size-4" />
                  <span>Open</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <IconShare3 className="size-4" />
                  <span>Share</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" className="gap-2">
                  <IconTrash className="size-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem className="w-full">
          <SidebarMenuButton className="w-full h-9 px-3 text-sm text-muted-foreground hover:text-accent-foreground flex items-center gap-3 rounded-lg hover:bg-accent/80 transition-all duration-200 group border-0">
            <IconDots className="size-4 text-muted-foreground group-hover:text-accent-foreground transition-colors duration-200" />
            <span className="font-medium">More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
