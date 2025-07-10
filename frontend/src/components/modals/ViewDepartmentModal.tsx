import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { type Department } from "@/utils/departmentService";
import {
  IconBuilding,
  IconUser,
  IconMapPin,
  IconCurrencyDollar,
  IconCalendar,
  IconUsers,
} from "@tabler/icons-react";

interface ViewDepartmentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
}

export function ViewDepartmentModal({
  isOpen,
  onOpenChange,
  department,
}: ViewDepartmentModalProps) {
  if (!department) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "archived":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return "Not specified";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconBuilding className="w-5 h-5" />
            Department Details
          </DialogTitle>
          <DialogDescription>
            View complete department information and settings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Basic Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold border-b pb-2 text-primary">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Department Name
                </label>
                <p className="text-sm font-medium">{department.name}</p>
              </div>
              {department.code && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Department Code
                  </label>
                  <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {department.code}
                  </p>
                </div>
              )}
              {department.description && (
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Description
                  </label>
                  <p className="text-sm">{department.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Management & Status */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold border-b pb-2 text-primary">
              Management & Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <IconUser className="w-4 h-4" />
                  Manager
                </label>
                {department.manager ? (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {department.manager.firstName}{" "}
                      {department.manager.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {department.manager.email}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No manager assigned
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Status
                </label>
                <Badge className={getStatusColor(department.status)}>
                  {department.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Location & Budget */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold border-b pb-2 text-primary">
              Location & Budget
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {department.location && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <IconMapPin className="w-4 h-4" />
                    Location
                  </label>
                  <p className="text-sm">{department.location}</p>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <IconCurrencyDollar className="w-4 h-4" />
                  Budget
                </label>
                <p className="text-sm">{formatCurrency(department.budget)}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <IconUsers className="w-4 h-4" />
                  Employee Count
                </label>
                <p className="text-sm">
                  {department.employeeCount || 0} employees
                </p>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold border-b pb-2 text-primary">
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <IconCalendar className="w-4 h-4" />
                  Created
                </label>
                <p className="text-sm">{formatDate(department.createdAt)}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <IconCalendar className="w-4 h-4" />
                  Last Updated
                </label>
                <p className="text-sm">{formatDate(department.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
