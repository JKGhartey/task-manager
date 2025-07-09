"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconEdit,
  IconEye,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconShield,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUsers, type CreateUserData } from "@/hooks/useUsers";
import { useAuth } from "@/hooks/useAuth";

export default function ManageUsers() {
  const { isAuthenticated } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createUserData, setCreateUserData] = useState<CreateUserData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "user",
    status: "active",
    department: "",
    position: "",
    phone: "",
    dateOfBirth: "",
    hireDate: "",
  });

  // Use the custom hook for user management
  const {
    users,
    loading,
    error,
    filters,
    pagination,
    createUser,
    updateUserStatus,
    updateUserRole,
    updateFilters,
    changePage,
    refreshUsers,
  } = useUsers();

  // Handle create user
  const handleCreateUser = async () => {
    try {
      await createUser(createUserData);
      setIsCreateDialogOpen(false);
      setCreateUserData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "user",
        status: "active",
        department: "",
        position: "",
        phone: "",
        dateOfBirth: "",
        hireDate: "",
      });
    } catch (error) {
      // Error is already handled by the hook
      console.error("Failed to create user:", error);
    }
  };

  // Handle filter changes
  const handleSearchChange = (value: string) => {
    updateFilters({ search: value });
  };

  const handleRoleFilterChange = (value: string) => {
    updateFilters({ role: value === "all" ? undefined : value });
  };

  const handleStatusFilterChange = (value: string) => {
    updateFilters({ status: value === "all" ? undefined : value });
  };

  // Filter users based on current filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName
        .toLowerCase()
        .includes((filters.search || "").toLowerCase()) ||
      user.lastName
        .toLowerCase()
        .includes((filters.search || "").toLowerCase()) ||
      user.email.toLowerCase().includes((filters.search || "").toLowerCase());

    const matchesRole = !filters.role || user.role === filters.role;
    const matchesStatus = !filters.status || user.status === filters.status;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <IconShield className="w-4 h-4" />;
      case "manager":
        return <IconUsers className="w-4 h-4" />;
      default:
        return <IconUser className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "suspended":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!isAuthenticated) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">
            Please login to access user management.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">
              Manage system users, roles, and permissions
            </p>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <IconPlus className="w-4 h-4 mr-2" />
                Create User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Add a new user to the system. You can assign roles and set
                  initial status.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={createUserData.firstName}
                    onChange={(e) =>
                      setCreateUserData({
                        ...createUserData,
                        firstName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={createUserData.lastName}
                    onChange={(e) =>
                      setCreateUserData({
                        ...createUserData,
                        lastName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={createUserData.email}
                    onChange={(e) =>
                      setCreateUserData({
                        ...createUserData,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={createUserData.password}
                    onChange={(e) =>
                      setCreateUserData({
                        ...createUserData,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={createUserData.role}
                    onValueChange={(value: "user" | "admin" | "manager") =>
                      setCreateUserData({ ...createUserData, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={createUserData.status}
                    onValueChange={(
                      value: "active" | "inactive" | "suspended"
                    ) =>
                      setCreateUserData({ ...createUserData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={createUserData.department}
                    onChange={(e) =>
                      setCreateUserData({
                        ...createUserData,
                        department: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={createUserData.position}
                    onChange={(e) =>
                      setCreateUserData({
                        ...createUserData,
                        position: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={createUserData.phone}
                    onChange={(e) =>
                      setCreateUserData({
                        ...createUserData,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="hireDate">Hire Date</Label>
                  <Input
                    id="hireDate"
                    type="date"
                    value={createUserData.hireDate}
                    onChange={(e) =>
                      setCreateUserData({
                        ...createUserData,
                        hireDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateUser}>Create User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <IconSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name or email..."
                    value={filters.search || ""}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="role-filter">Role</Label>
                <Select
                  value={filters.role || "all"}
                  onValueChange={handleRoleFilterChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All roles</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status-filter">Status</Label>
                <Select
                  value={filters.status || "all"}
                  onValueChange={handleStatusFilterChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="outline" onClick={refreshUsers}>
                  <IconRefresh className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
            <CardDescription>
              Manage user accounts, roles, and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-destructive">{error}</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.position}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{user.email}</div>
                          {user.isEmailVerified && (
                            <Badge variant="outline" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1 w-fit"
                        >
                          {getRoleIcon(user.role)}
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(user.status)}`}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.department || "-"}</TableCell>
                      <TableCell>
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : "Never"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <IconEdit className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <IconEye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <IconEdit className="w-4 h-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => updateUserRole(user._id, "user")}
                            >
                              Set as User
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateUserRole(user._id, "manager")
                              }
                            >
                              Set as Manager
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateUserRole(user._id, "admin")}
                            >
                              Set as Admin
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                updateUserStatus(user._id, "active")
                              }
                            >
                              Activate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateUserStatus(user._id, "inactive")
                              }
                            >
                              Deactivate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateUserStatus(user._id, "suspended")
                              }
                            >
                              Suspend
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} results.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => changePage(pagination.page - 1)}
                disabled={!pagination.hasPrev}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => changePage(pagination.page + 1)}
                disabled={!pagination.hasNext}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
