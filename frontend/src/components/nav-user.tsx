import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/hooks/use-sidebar";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { user, logout } = useAuth();

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  const userName = `${user.firstName} ${user.lastName}`;
  const userInitials = `${user.firstName[0]}${user.lastName[0]}`;

  const handleLogout = () => {
    logout();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem className="w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-full h-12 px-3 flex items-center gap-3 rounded-lg transition-all duration-200 group border-0">
              <Avatar className="h-8 w-8 rounded-lg ring-2 ring-background shadow-sm">
                <AvatarImage src={user.avatar} alt={userName} />
                <AvatarFallback className="rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-medium">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-xs leading-tight">
                <span className="truncate font-semibold text-sm">
                  {userName}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4 text-muted-foreground group-hover:text-accent-foreground transition-colors duration-200" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-72 rounded-xl shadow-2xl border border-border/50 bg-background/95 backdrop-blur-sm"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-4 p-4 text-left">
                <Avatar className="h-12 w-12 rounded-xl ring-2 ring-primary/20 shadow-lg">
                  <AvatarImage src={user.avatar} alt={userName} />
                  <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-lg">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-semibold text-base text-foreground">
                    {userName}
                  </span>
                  <span className="text-muted-foreground truncate text-sm">
                    {user.email}
                  </span>
                  <span className="text-xs text-primary/70 font-medium mt-1">
                    {user.role === "admin"
                      ? "Administrator"
                      : user.role === "manager"
                      ? "Manager"
                      : "User"}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="mx-4" />
            <DropdownMenuGroup className="p-2">
              <DropdownMenuItem className="gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-colors duration-200 cursor-pointer">
                <IconUserCircle className="size-4 text-muted-foreground" />
                <span className="font-medium">Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-colors duration-200 cursor-pointer">
                <IconCreditCard className="size-4 text-muted-foreground" />
                <span className="font-medium">Billing & Plans</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-colors duration-200 cursor-pointer">
                <IconNotification className="size-4 text-muted-foreground" />
                <span className="font-medium">Notifications</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="mx-4" />
            <DropdownMenuItem
              className="gap-3 px-3 py-2.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors duration-200 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
              onClick={handleLogout}
            >
              <IconLogout className="size-4" />
              <span className="font-medium">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
