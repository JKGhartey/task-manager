import { IconEdit, IconTrash } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import type { Department } from "@/utils/departmentService";

interface DepartmentColumnsProps {
  onEdit: (department: Department) => void;
  onDelete: (id: string) => void;
}

export const departmentColumns = (
  onEdit: (department: Department) => void,
  onDelete: (id: string) => void
): ColumnDef<Department>[] => [
  {
    accessorKey: "name",
    header: "Department Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => {
      const code = row.getValue("code") as string;
      return code ? (
        <Badge variant="secondary">{code}</Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: "manager",
    header: "Manager",
    cell: ({ row }) => {
      const manager = row.original.manager;
      return manager ? (
        <div>
          <div className="font-medium">
            {manager.firstName} {manager.lastName}
          </div>
          <div className="text-sm text-muted-foreground">{manager.email}</div>
        </div>
      ) : (
        <span className="text-muted-foreground">No manager assigned</span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusMap = {
        active: { label: "Active", variant: "default" as const },
        inactive: { label: "Inactive", variant: "secondary" as const },
        archived: { label: "Archived", variant: "destructive" as const },
      };
      const statusInfo =
        statusMap[status as keyof typeof statusMap] || statusMap.inactive;

      return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const location = row.getValue("location") as string;
      return location || <span className="text-muted-foreground">-</span>;
    },
  },
  {
    accessorKey: "budget",
    header: "Budget",
    cell: ({ row }) => {
      const budget = row.getValue("budget") as number;
      return budget ? (
        <span>${budget.toLocaleString()}</span>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: "employeeCount",
    header: "Employees",
    cell: ({ row }) => {
      const count = row.original.employeeCount || 0;
      return <span>{count}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const department = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(department)}
            className="h-8 w-8 p-0"
          >
            <IconEdit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(department._id)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <IconTrash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
