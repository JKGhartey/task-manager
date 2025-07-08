import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Quick Create"
              className="w-full bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 active:from-primary/80 active:to-primary/70 h-9 px-3 text-sm duration-200 ease-out flex items-center gap-2 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <IconCirclePlusFilled className="size-4" />
              <span className="font-medium">Quick Create</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu className="space-y-1">
          {items.map((item) => (
            <SidebarMenuItem key={item.title} className="w-full">
              <SidebarMenuButton
                tooltip={item.title}
                className="w-full h-10 px-3 text-sm flex items-center gap-3 rounded-lg hover:bg-accent/80 hover:text-accent-foreground transition-all duration-200 group border-0"
              >
                {item.icon && (
                  <item.icon className="size-4 text-muted-foreground group-hover:text-accent-foreground transition-colors duration-200" />
                )}
                <span className="font-medium">{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
