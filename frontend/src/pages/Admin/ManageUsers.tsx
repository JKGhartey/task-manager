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
        <div className="flex items-center justify-center h-64 p-6">
          <p className="text-muted-foreground">
            Please login to access user management.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              User Management
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage system users, roles, and permissions
            </p>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
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
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
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
                    placeholder="Enter last name"
                  />
                </div>
                <div className="space-y-2">
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
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
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
                    placeholder="Enter password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={createUserData.role}
                    onValueChange={(value: "user" | "admin" | "manager") =>
                      setCreateUserData({ ...createUserData, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
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
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
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
                    placeholder="Enter department"
                  />
                </div>
                <div className="space-y-2">
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
                    placeholder="Enter position"
                  />
                </div>
                <div className="space-y-2">
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
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
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
              <DialogFooter className="gap-2">
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
        <Card className="border-0 shadow-sm bg-gradient-to-r from-gray-50 to-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Filters & Search</CardTitle>
            <CardDescription>
              Filter users by role, status, or search by name and email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="search" className="text-sm font-medium">
                  Search
                </Label>
                <div className="relative mt-1">
                  <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name or email..."
                    value={filters.search || ""}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="role-filter" className="text-sm font-medium">
                  Role
                </Label>
                <Select
                  value={filters.role || "all"}
                  onValueChange={handleRoleFilterChange}
                >
                  <SelectTrigger className="mt-1 h-10">
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
                <Label htmlFor="status-filter" className="text-sm font-medium">
                  Status
                </Label>
                <Select
                  value={filters.status || "all"}
                  onValueChange={handleStatusFilterChange}
                >
                  <SelectTrigger className="mt-1 h-10">
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
            </div>
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={refreshUsers}
                className="gap-2"
              >
                <IconRefresh className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Users</CardTitle>
                <CardDescription>
                  {filteredUsers.length} user
                  {filteredUsers.length !== 1 ? "s" : ""} found
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-sm">
                Total: {users.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-muted-foreground">Loading users...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center space-y-2">
                  <p className="text-destructive font-medium">{error}</p>
                  <Button variant="outline" onClick={refreshUsers} size="sm">
                    Try Again
                  </Button>
                </div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex items-center justify-center py-16 px-4">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <IconUsers className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">No users found</h3>
                    <p className="text-muted-foreground">
                      {filters.search || filters.role || filters.status
                        ? "Try adjusting your filters or search terms."
                        : "Get started by creating your first user."}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border mx-4 my-4">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">Role</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">
                        Department
                      </TableHead>
                      <TableHead className="font-semibold">
                        Last Login
                      </TableHead>
                      <TableHead className="font-semibold text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user, index) => (
                      <TableRow
                        key={user._id}
                        className={index % 2 === 0 ? "bg-white" : "bg-muted/30"}
                      >
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {user.firstName} {user.lastName}
                            </div>
                            {user.position && (
                              <div className="text-sm text-muted-foreground">
                                {user.position}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{user.email}</div>
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
                            className="flex items-center gap-1 w-fit font-medium"
                          >
                            {getRoleIcon(user.role)}
                            <span className="capitalize">{user.role}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${getStatusColor(
                              user.status
                            )} font-medium capitalize`}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-muted-foreground">
                            {user.department || "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {user.lastLogin
                              ? new Date(user.lastLogin).toLocaleDateString()
                              : "Never"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <IconEdit className="w-4 h-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
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
                                onClick={() =>
                                  updateUserRole(user._id, "admin")
                                }
                              >
                                Set as Admin
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>
                                Change Status
                              </DropdownMenuLabel>
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
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}
                  </span>{" "}
                  of <span className="font-medium">{pagination.total}</span>{" "}
                  results.
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => changePage(pagination.page - 1)}
                    disabled={!pagination.hasPrev}
                    className="gap-2"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => changePage(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                    className="gap-2"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
