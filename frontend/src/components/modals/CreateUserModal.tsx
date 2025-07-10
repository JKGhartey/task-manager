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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconPlus } from "@tabler/icons-react";
import { type CreateUserData } from "@/hooks/useUsers";
import {
  getActiveDepartments,
  type Department,
} from "@/utils/departmentService";

interface CreateUserModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (userData: CreateUserData) => Promise<void>;
  trigger?: React.ReactNode;
}

export function CreateUserModal({
  isOpen,
  onOpenChange,
  onSubmit,
  trigger,
}: CreateUserModalProps) {
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

  const handleSubmit = async () => {
    try {
      await onSubmit(createUserData);
      // Reset form
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
      onOpenChange(false);
    } catch (error) {
      // Error is already handled by the parent component
      console.error("Failed to create user:", error);
    }
  };

  const handleCancel = () => {
    // Reset form
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
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to the system. You can assign roles and set initial
            status.
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
            </div>
          </div>

          {/* Role and Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Role & Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  onValueChange={(value: "active" | "inactive" | "suspended") =>
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
            </div>
          </div>

          {/* Work Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Work Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={createUserData.department || "none"}
                  onValueChange={(value) =>
                    setCreateUserData({
                      ...createUserData,
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
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create User</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Default trigger component
export function CreateUserTrigger({ onClick }: { onClick: () => void }) {
  return (
    <Button className="w-full sm:w-auto" onClick={onClick}>
      <IconPlus className="w-4 h-4 mr-2" />
      Create User
    </Button>
  );
}
