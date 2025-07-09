import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { IconSearch, IconBuilding } from "@tabler/icons-react";

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
import { departmentColumns } from "../Admin/departmentColumns";
import {
  getDepartments,
  getPublicDepartments,
  type Department,
} from "@/utils/departmentService";
import { UserLayout } from "@/components/layouts/UserLayout";
import { useAuth } from "@/hooks/useAuth";

export default function ViewDepartments() {
  const { userRole } = useAuth();
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

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      // Use regular endpoints for admins/managers, public endpoints for users
      const isAdminOrManager = userRole === "admin" || userRole === "manager";
      const response = isAdminOrManager
        ? await getDepartments(
            pagination.page,
            pagination.limit,
            search,
            statusFilter === "all" ? undefined : statusFilter
          )
        : await getPublicDepartments(
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
  }, [pagination.page, pagination.limit, search, statusFilter, userRole]);

  return (
    <UserLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Departments</h2>
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
              View all departments in the system.
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
                () => {},
                () => {}
              )} // Empty functions for read-only view
              data={departments}
              loading={loading}
              pagination={pagination}
              onPageChange={(page) =>
                setPagination((prev) => ({ ...prev, page }))
              }
            />
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
}
