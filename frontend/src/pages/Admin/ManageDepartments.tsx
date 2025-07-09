import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { IconPlus, IconSearch, IconBuilding } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { departmentColumns } from "./departmentColumns";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  type Department,
  type CreateDepartmentRequest,
  type UpdateDepartmentRequest,
} from "@/utils/departmentService";
import { userService, type User } from "@/utils/userService";
import { AdminLayout } from "@/components/layouts/AdminLayout";

export default function ManageDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );
  const [managers, setManagers] = useState<User[]>([]);

  // Form states
  const [createFormData, setCreateFormData] = useState<CreateDepartmentRequest>(
    {
      name: "",
      description: "",
      manager: "none",
      status: "active",
      code: "",
      location: "",
      budget: undefined,
    }
  );

  const [editFormData, setEditFormData] = useState<UpdateDepartmentRequest>({
    name: "",
    description: "",
    manager: "none",
    status: "active",
    code: "",
    location: "",
    budget: undefined,
  });

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await getDepartments(
        pagination.page,
        pagination.limit,
        search,
        statusFilter === "all" ? undefined : statusFilter
      );
      setDepartments(response.data.departments);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to fetch departments");
    } finally {
      setLoading(false);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await userService.getUsers({
        page: 1,
        limit: 100,
        role: "admin,manager",
      });
      setManagers(response.data.users);
    } catch (error) {
      console.error("Error fetching managers:", error);
      toast.error("Failed to fetch managers");
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchManagers();
  }, [pagination.page, pagination.limit, search, statusFilter]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDepartment(id);
      toast.success("Department deleted successfully");
      fetchDepartments();
    } catch (error: unknown) {
      console.error("Error deleting department:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete department";
      toast.error(errorMessage);
    }
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setEditFormData({
      name: department.name,
      description: department.description || "",
      manager: department.manager?._id || "none",
      status: department.status,
      code: department.code || "",
      location: department.location || "",
      budget: department.budget,
    });
    setShowEditModal(true);
  };

  const handleCreate = () => {
    setCreateFormData({
      name: "",
      description: "",
      manager: "none",
      status: "active",
      code: "",
      location: "",
      budget: undefined,
    });
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = {
        ...createFormData,
        manager:
          createFormData.manager === "none"
            ? undefined
            : createFormData.manager,
      };
      await createDepartment(submitData);
      toast.success("Department created successfully");
      setShowCreateModal(false);
      fetchDepartments();
    } catch (error: unknown) {
      console.error("Error creating department:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create department";
      toast.error(errorMessage);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDepartment) return;

    try {
      const submitData = {
        ...editFormData,
        manager:
          editFormData.manager === "none" ? undefined : editFormData.manager,
      };
      await updateDepartment(editingDepartment._id, submitData);
      toast.success("Department updated successfully");
      setShowEditModal(false);
      setEditingDepartment(null);
      fetchDepartments();
    } catch (error: unknown) {
      console.error("Error updating department:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update department";
      toast.error(errorMessage);
    }
  };

  const handleCreateInputChange = (
    field: string,
    value: string | number | undefined
  ) => {
    setCreateFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditInputChange = (
    field: string,
    value: string | number | undefined
  ) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Manage Departments
          </h2>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <IconPlus className="h-4 w-4" />
            Create Department
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Departments
              </CardTitle>
              <IconBuilding className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pagination.total}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Departments</CardTitle>
            <CardDescription>
              Manage all departments in the system. Only admins can create,
              edit, or delete departments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search departments..."
                  value={search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearch(e.target.value)
                  }
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DataTable
              columns={departmentColumns(handleEdit, handleDelete)}
              data={departments}
              loading={loading}
              pagination={pagination}
              onPageChange={(page) =>
                setPagination((prev) => ({ ...prev, page }))
              }
            />
          </CardContent>
        </Card>

        {/* Create Department Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Department</DialogTitle>
              <DialogDescription>
                Create a new department. All fields marked with * are required.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="create-name">Department Name *</Label>
                  <Input
                    id="create-name"
                    value={createFormData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleCreateInputChange("name", e.target.value)
                    }
                    placeholder="Enter department name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-code">Department Code</Label>
                  <Input
                    id="create-code"
                    value={createFormData.code}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleCreateInputChange(
                        "code",
                        e.target.value.toUpperCase()
                      )
                    }
                    placeholder="e.g., IT, HR, FIN"
                    maxLength={10}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-description">Description</Label>
                <Textarea
                  id="create-description"
                  value={createFormData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleCreateInputChange("description", e.target.value)
                  }
                  placeholder="Enter department description"
                  rows={3}
                  maxLength={500}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="create-manager">Manager</Label>
                  <Select
                    value={createFormData.manager}
                    onValueChange={(value: string) =>
                      handleCreateInputChange("manager", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a manager" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No manager assigned</SelectItem>
                      {managers.map((manager) => (
                        <SelectItem key={manager._id} value={manager._id}>
                          {manager.firstName} {manager.lastName} (
                          {manager.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-status">Status *</Label>
                  <Select
                    value={createFormData.status}
                    onValueChange={(value: string) =>
                      handleCreateInputChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="create-location">Location</Label>
                  <Input
                    id="create-location"
                    value={createFormData.location}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleCreateInputChange("location", e.target.value)
                    }
                    placeholder="e.g., Building A, Floor 3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-budget">Budget</Label>
                  <Input
                    id="create-budget"
                    type="number"
                    value={createFormData.budget || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleCreateInputChange(
                        "budget",
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                    placeholder="Enter budget amount"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Department</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Department Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Department</DialogTitle>
              <DialogDescription>
                Update department information. All fields marked with * are
                required.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Department Name *</Label>
                  <Input
                    id="edit-name"
                    value={editFormData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleEditInputChange("name", e.target.value)
                    }
                    placeholder="Enter department name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-code">Department Code</Label>
                  <Input
                    id="edit-code"
                    value={editFormData.code}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleEditInputChange(
                        "code",
                        e.target.value.toUpperCase()
                      )
                    }
                    placeholder="e.g., IT, HR, FIN"
                    maxLength={10}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editFormData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleEditInputChange("description", e.target.value)
                  }
                  placeholder="Enter department description"
                  rows={3}
                  maxLength={500}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-manager">Manager</Label>
                  <Select
                    value={editFormData.manager}
                    onValueChange={(value: string) =>
                      handleEditInputChange("manager", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a manager" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No manager assigned</SelectItem>
                      {managers.map((manager) => (
                        <SelectItem key={manager._id} value={manager._id}>
                          {manager.firstName} {manager.lastName} (
                          {manager.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status *</Label>
                  <Select
                    value={editFormData.status}
                    onValueChange={(value: string) =>
                      handleEditInputChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    value={editFormData.location}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleEditInputChange("location", e.target.value)
                    }
                    placeholder="e.g., Building A, Floor 3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-budget">Budget</Label>
                  <Input
                    id="edit-budget"
                    type="number"
                    value={editFormData.budget || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleEditInputChange(
                        "budget",
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                    placeholder="Enter budget amount"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Update Department</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
