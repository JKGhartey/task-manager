import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { IconPlus, IconBuilding } from "@tabler/icons-react";
import { type CreateDepartmentRequest } from "@/utils/departmentService";
import { userService, type User } from "@/utils/userService";

interface CreateDepartmentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (departmentData: CreateDepartmentRequest) => Promise<void>;
  trigger?: React.ReactNode;
}

export function CreateDepartmentModal({
  isOpen,
  onOpenChange,
  onSubmit,
  trigger,
}: CreateDepartmentModalProps) {
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
  const [managers, setManagers] = useState<User[]>([]);
  const [loadingManagers, setLoadingManagers] = useState(false);

  // Fetch managers when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchManagers();
    }
  }, [isOpen]);

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
    setCreateFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(createFormData);
      // Reset form
      setCreateFormData({
        name: "",
        description: "",
        manager: "none",
        status: "active",
        code: "",
        location: "",
        budget: undefined,
      });
      onOpenChange(false);
    } catch (error) {
      // Error is already handled by the parent component
      console.error("Failed to create department:", error);
    }
  };

  const handleCancel = () => {
    // Reset form
    setCreateFormData({
      name: "",
      description: "",
      manager: "none",
      status: "active",
      code: "",
      location: "",
      budget: undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconBuilding className="w-5 h-5" />
            Create Department
          </DialogTitle>
          <DialogDescription>
            Create a new department. All fields marked with * are required.
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
                <Label htmlFor="create-name">Department Name *</Label>
                <Input
                  id="create-name"
                  value={createFormData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("name", e.target.value)
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
                    handleInputChange("code", e.target.value.toUpperCase())
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
                <Label htmlFor="create-manager">Manager</Label>
                <Select
                  value={createFormData.manager}
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
                <Label htmlFor="create-status">Status *</Label>
                <Select
                  value={createFormData.status}
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
                <Label htmlFor="create-location">Location</Label>
                <Input
                  id="create-location"
                  value={createFormData.location}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("location", e.target.value)
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
            <Button type="submit">Create Department</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Default trigger component
export function CreateDepartmentTrigger({ onClick }: { onClick: () => void }) {
  return (
    <Button className="w-full sm:w-auto" onClick={onClick}>
      <IconPlus className="w-4 h-4 mr-2" />
      Create Department
    </Button>
  );
}
