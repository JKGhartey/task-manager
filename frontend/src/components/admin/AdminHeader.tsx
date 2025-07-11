import {
  IconActivity,
  IconAlertTriangle,
  IconShield,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AdminHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex items-center gap-2">
          <IconShield className="h-5 w-5 text-red-600" />
          <h1 className="text-base font-medium">Admin Panel</h1>
          <Badge variant="outline" className="text-xs">
            System Management
          </Badge>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-green-600 border-green-200"
            >
              <IconActivity className="w-3 h-3 mr-1" />
              System Online
            </Badge>
            <Badge
              variant="outline"
              className="text-orange-600 border-orange-200"
            >
              <IconAlertTriangle className="w-3 h-3 mr-1" />3 Alerts
            </Badge>
          </div>
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://task-manager-x8af.onrender.com/api-docs/"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              Documentation
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
