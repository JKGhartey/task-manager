"use client";

import * as React from "react";

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconAlertTriangle,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconLayoutColumns,
  IconPlus,
  IconShield,
  IconUser,
} from "@tabler/icons-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

// Admin-specific data interface
interface AdminDataItem {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  lastLogin: string;
  tasksAssigned: number;
  tasksCompleted: number;
  department: string;
  joinDate: string;
  permissions: string[];
}

// Sample admin data
const adminData: AdminDataItem[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@company.com",
    role: "Admin",
    status: "active",
    lastLogin: "2024-01-15 10:30",
    tasksAssigned: 25,
    tasksCompleted: 22,
    department: "Engineering",
    joinDate: "2023-01-15",
    permissions: ["read", "write", "delete", "admin"],
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@company.com",
    role: "Manager",
    status: "active",
    lastLogin: "2024-01-15 09:15",
    tasksAssigned: 18,
    tasksCompleted: 16,
    department: "Marketing",
    joinDate: "2023-03-20",
    permissions: ["read", "write"],
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob.johnson@company.com",
    role: "User",
    status: "inactive",
    lastLogin: "2024-01-10 14:45",
    tasksAssigned: 12,
    tasksCompleted: 8,
    department: "Sales",
    joinDate: "2023-06-10",
    permissions: ["read"],
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice.brown@company.com",
    role: "Manager",
    status: "pending",
    lastLogin: "Never",
    tasksAssigned: 0,
    tasksCompleted: 0,
    department: "HR",
    joinDate: "2024-01-14",
    permissions: ["read", "write"],
  },
  {
    id: 5,
    name: "Charlie Wilson",
    email: "charlie.wilson@company.com",
    role: "User",
    status: "active",
    lastLogin: "2024-01-15 11:20",
    tasksAssigned: 30,
    tasksCompleted: 28,
    department: "Engineering",
    joinDate: "2023-02-28",
    permissions: ["read"],
  },
];

const columns: ColumnDef<AdminDataItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <IconUser className="w-4 h-4" />
        </div>
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.email}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={
          row.original.role === "Admin"
            ? "text-red-600 border-red-200"
            : row.original.role === "Manager"
            ? "text-blue-600 border-blue-200"
            : "text-green-600 border-green-200"
        }
      >
        {row.original.role === "Admin" && (
          <IconShield className="w-3 h-3 mr-1" />
        )}
        {row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={
          row.original.status === "active"
            ? "text-green-600 border-green-200"
            : row.original.status === "inactive"
            ? "text-red-600 border-red-200"
            : "text-yellow-600 border-yellow-200"
        }
      >
        {row.original.status === "active" && (
          <IconCircleCheckFilled className="w-3 h-3 mr-1" />
        )}
        {row.original.status === "pending" && (
          <IconAlertTriangle className="w-3 h-3 mr-1" />
        )}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => <div className="text-sm">{row.original.department}</div>,
  },
  {
    accessorKey: "tasksAssigned",
    header: "Tasks",
    cell: ({ row }) => (
      <div className="text-sm">
        <div className="font-medium">{row.original.tasksAssigned} assigned</div>
        <div className="text-muted-foreground">
          {row.original.tasksCompleted} completed
        </div>
      </div>
    ),
  },
  {
    accessorKey: "lastLogin",
    header: "Last Login",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.original.lastLogin}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <IconDotsVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View Profile</DropdownMenuItem>
          <DropdownMenuItem>Edit User</DropdownMenuItem>
          <DropdownMenuItem>Manage Permissions</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">
            Deactivate User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export function AdminDataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data: adminData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">User Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage system users, roles, and permissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedRows.length > 0 && (
            <Badge variant="secondary" className="mr-2">
              {selectedRows.length} selected
            </Badge>
          )}
          <Button size="sm">
            <IconPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search users..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <IconLayoutColumns className="mr-2 h-4 w-4" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
