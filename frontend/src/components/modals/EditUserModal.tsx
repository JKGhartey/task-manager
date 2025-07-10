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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type User, type UpdateUserData } from "@/hooks/useUsers";
import {
  getActiveDepartments,
  type Department,
} from "@/utils/departmentService";

interface EditUserModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSubmit: (userId: string, userData: UpdateUserData) => Promise<void>;
}

export function EditUserModal({
  isOpen,
  onOpenChange,
  user,
  onSubmit,
}: EditUserModalProps) {
  const [editUserData, setEditUserData] = useState<UpdateUserData>({
    firstName: "",
    lastName: "",
    email: "",
    role: "user",
    status: "active",
    department: "",
    position: "",
    phone: "",
    dateOfBirth: "",
    hireDate: "",
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  // Fetch departments when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchDepartments();
    }
  }, [isOpen]);

  const fetchDepartments = async () => {
    try {
      setLoadingDepartments(true);
      const response = await getActiveDepartments();
      setDepartments(response.data.departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoadingDepartments(false);
    }
  };

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setEditUserData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        role: user.role || "user",
        status: user.status || "active",
        department: user.department || "",
        position: user.position || "",
        phone: user.phone || "",
        dateOfBirth: "", // dateOfBirth is not in User interface, will be empty
        hireDate: user.hireDate || "",
      });
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!user) return;

    try {
      await onSubmit(user._id, editUserData);
      onOpenChange(false);
    } catch (error) {
      // Error is already handled by the parent component
      console.error("Failed to update user:", error);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and settings.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-firstName">First Name</Label>
                <Input
                  id="edit-firstName"
                  value={editUserData.firstName}
                  onChange={(e) =>
                    setEditUserData({
                      ...editUserData,
                      firstName: e.target.value,
                    })
                  }
                  placeholder="Enter first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lastName">Last Name</Label>
                <Input
                  id="edit-lastName"
                  value={editUserData.lastName}
                  onChange={(e) =>
                    setEditUserData({
                      ...editUserData,
                      lastName: e.target.value,
                    })
                  }
                  placeholder="Enter last name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editUserData.email}
                  onChange={(e) =>
                    setEditUserData({
                      ...editUserData,
                      email: e.target.value,
                    })
                  }
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-dateOfBirth">Date of Birth</Label>
                <Input
                  id="edit-dateOfBirth"
                  type="date"
                  value={editUserData.dateOfBirth}
                  onChange={(e) =>
                    setEditUserData({
                      ...editUserData,
                      dateOfBirth: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Role and Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Role & Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={editUserData.role}
                  onValueChange={(value: "user" | "admin" | "manager") =>
                    setEditUserData({ ...editUserData, role: value })
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
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editUserData.status}
                  onValueChange={(value: "active" | "inactive" | "suspended") =>
                    setEditUserData({ ...editUserData, status: value })
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
            </div>
          </div>

          {/* Work Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Work Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department</Label>
                <Select
                  value={editUserData.department || "none"}
                  onValueChange={(value) =>
                    setEditUserData({
                      ...editUserData,
                      department: value === "none" ? "" : value,
                    })
                  }
                  disabled={loadingDepartments}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loadingDepartments
                          ? "Loading departments..."
                          : "Select department"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Department</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept._id} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-position">Position</Label>
                <Input
                  id="edit-position"
                  value={editUserData.position}
                  onChange={(e) =>
                    setEditUserData({
                      ...editUserData,
                      position: e.target.value,
                    })
                  }
                  placeholder="Enter position"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editUserData.phone}
                  onChange={(e) =>
                    setEditUserData({
                      ...editUserData,
                      phone: e.target.value,
                    })
                  }
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-hireDate">Hire Date</Label>
                <Input
                  id="edit-hireDate"
                  type="date"
                  value={editUserData.hireDate}
                  onChange={(e) =>
                    setEditUserData({
                      ...editUserData,
                      hireDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Update User</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
