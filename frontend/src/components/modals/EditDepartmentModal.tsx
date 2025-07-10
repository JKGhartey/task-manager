import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconBuilding } from "@tabler/icons-react";
import {
  type Department,
  type UpdateDepartmentRequest,
} from "@/utils/departmentService";
import { userService, type User } from "@/utils/userService";

interface EditDepartmentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
  onSubmit: (
    departmentId: string,
    departmentData: UpdateDepartmentRequest
  ) => Promise<void>;
}

export function EditDepartmentModal({
  isOpen,
  onOpenChange,
  department,
  onSubmit,
}: EditDepartmentModalProps) {
  const [editFormData, setEditFormData] = useState<UpdateDepartmentRequest>({
    name: "",
    description: "",
    manager: "none",
    status: "active",
    code: "",
    location: "",
    budget: undefined,
  });
  const [managers, setManagers] = useState<User[]>([]);
  const [loadingManagers, setLoadingManagers] = useState(false);

  // Fetch managers when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchManagers();
    }
  }, [isOpen]);

  // Update form data when department changes
  useEffect(() => {
    if (department) {
      setEditFormData({
        name: department.name,
        description: department.description || "",
        manager: department.manager?._id || "none",
        status: department.status,
        code: department.code || "",
        location: department.location || "",
        budget: department.budget,
      });
    }
  }, [department]);

  const fetchManagers = async () => {
    try {
      setLoadingManagers(true);
      // Fetch admins and managers separately and combine them
      const [adminResponse, managerResponse] = await Promise.all([
        userService.getUsers({
          page: 1,
          limit: 100,
          role: "admin",
        }),
        userService.getUsers({
          page: 1,
          limit: 100,
          role: "manager",
        }),
      ]);

      const allUsers = [
        ...adminResponse.data.users,
        ...managerResponse.data.users,
      ];
      setManagers(allUsers);
    } catch (error) {
      console.error("Error fetching managers:", error);
    } finally {
      setLoadingManagers(false);
    }
  };

  const handleInputChange = (
    field: string,
    value: string | number | undefined
  ) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!department) return;

    try {
      await onSubmit(department._id, editFormData);
      onOpenChange(false);
    } catch (error) {
      // Error is already handled by the parent component
      console.error("Failed to update department:", error);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!department) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconBuilding className="w-5 h-5" />
            Edit Department
          </DialogTitle>
          <DialogDescription>
            Update department information. All fields marked with * are
            required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold border-b pb-2 text-primary">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Department Name *</Label>
                <Input
                  id="edit-name"
                  value={editFormData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("name", e.target.value)
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
                    handleInputChange("code", e.target.value.toUpperCase())
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
                  handleInputChange("description", e.target.value)
                }
                placeholder="Enter department description"
                rows={3}
                maxLength={500}
              />
            </div>
          </div>

          {/* Management & Status */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold border-b pb-2 text-primary">
              Management & Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-manager">Manager</Label>
                <Select
                  value={editFormData.manager}
                  onValueChange={(value: string) =>
                    handleInputChange("manager", value)
                  }
                  disabled={loadingManagers}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loadingManagers
                          ? "Loading managers..."
                          : "Select a manager"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No manager assigned</SelectItem>
                    {managers.length > 0 && (
                      <>
                        {managers.filter((user) => user.role === "admin")
                          .length > 0 && (
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                            Administrators
                          </div>
                        )}
                        {managers
                          .filter((user) => user.role === "admin")
                          .map((admin) => (
                            <SelectItem key={admin._id} value={admin._id}>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                {admin.firstName} {admin.lastName}
                                <span className="text-muted-foreground text-xs">
                                  ({admin.email})
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        {managers.filter((user) => user.role === "manager")
                          .length > 0 && (
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                            Managers
                          </div>
                        )}
                        {managers
                          .filter((user) => user.role === "manager")
                          .map((manager) => (
                            <SelectItem key={manager._id} value={manager._id}>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                {manager.firstName} {manager.lastName}
                                <span className="text-muted-foreground text-xs">
                                  ({manager.email})
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                      </>
                    )}
                    {managers.length === 0 && !loadingManagers && (
                      <div className="px-2 py-1.5 text-xs text-muted-foreground">
                        No managers or admins available
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status *</Label>
                <Select
                  value={editFormData.status}
                  onValueChange={(value: string) =>
                    handleInputChange("status", value)
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
          </div>

          {/* Location & Budget */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold border-b pb-2 text-primary">
              Location & Budget
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={editFormData.location}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("location", e.target.value)
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
                    handleInputChange(
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
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Update Department</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
