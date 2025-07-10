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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { AdminLayout } from "@/components/layouts/AdminLayout";
import {
  CreateDepartmentModal,
  EditDepartmentModal,
  ViewDepartmentModal,
} from "@/components/modals";

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
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  // Form states - removed as they're now handled in the modal components

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

  useEffect(() => {
    fetchDepartments();
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
    setShowEditModal(true);
  };

  const handleCreate = () => {
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (
    departmentData: CreateDepartmentRequest
  ) => {
    try {
      await createDepartment(departmentData);
      toast.success("Department created successfully");
      fetchDepartments();
    } catch (error: unknown) {
      console.error("Error creating department:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create department";
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleEditSubmit = async (
    departmentId: string,
    departmentData: UpdateDepartmentRequest
  ) => {
    try {
      await updateDepartment(departmentId, departmentData);
      toast.success("Department updated successfully");
      setEditingDepartment(null);
      fetchDepartments();
    } catch (error: unknown) {
      console.error("Error updating department:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update department";
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleViewDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setShowViewModal(true);
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
              columns={departmentColumns(
                handleEdit,
                handleDelete,
                handleViewDepartment
              )}
              data={departments}
              loading={loading}
              pagination={pagination}
              onPageChange={(page) =>
                setPagination((prev) => ({ ...prev, page }))
              }
            />
          </CardContent>
        </Card>

        {/* Modal Components */}
        <CreateDepartmentModal
          isOpen={showCreateModal}
          onOpenChange={setShowCreateModal}
          onSubmit={handleCreateSubmit}
          trigger={
            <Button onClick={handleCreate} className="flex items-center gap-2">
              <IconPlus className="h-4 w-4" />
              Create Department
            </Button>
          }
        />

        <EditDepartmentModal
          isOpen={showEditModal}
          onOpenChange={setShowEditModal}
          department={editingDepartment}
          onSubmit={handleEditSubmit}
        />

        <ViewDepartmentModal
          isOpen={showViewModal}
          onOpenChange={setShowViewModal}
          department={selectedDepartment}
        />
      </div>
    </AdminLayout>
  );
}
