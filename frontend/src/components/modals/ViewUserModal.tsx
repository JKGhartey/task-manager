import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { type User } from "@/hooks/useUsers";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconBuilding,
  IconBriefcase,
  IconCalendar,
  IconShield,
} from "@tabler/icons-react";

interface ViewUserModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export function ViewUserModal({
  isOpen,
  onOpenChange,
  user,
}: ViewUserModalProps) {
  if (!user) return null;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <IconShield className="w-4 h-4 text-red-500" />;
      case "manager":
        return <IconShield className="w-4 h-4 text-blue-500" />;
      default:
        return <IconUser className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getRoleIcon(user.role)}
            User Details
          </DialogTitle>
          <DialogDescription>
            View complete user information and settings.
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
                <label className="text-sm font-medium text-muted-foreground">
                  Full Name
                </label>
                <p className="text-sm">
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <IconMail className="w-4 h-4" />
                  Email
                </label>
                <p className="text-sm">{user.email}</p>
              </div>
              {user.phone && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <IconPhone className="w-4 h-4" />
                    Phone
                  </label>
                  <p className="text-sm">{user.phone}</p>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Email Verified
                </label>
                <Badge variant={user.isEmailVerified ? "default" : "secondary"}>
                  {user.isEmailVerified ? "Verified" : "Not Verified"}
                </Badge>
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
                <label className="text-sm font-medium text-muted-foreground">
                  Role
                </label>
                <div className="flex items-center gap-2">
                  {getRoleIcon(user.role)}
                  <span className="text-sm capitalize">{user.role}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Status
                </label>
                <Badge className={getStatusColor(user.status)}>
                  {user.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Work Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.department && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <IconBuilding className="w-4 h-4" />
                    Department
                  </label>
                  <p className="text-sm">{user.department}</p>
                </div>
              )}
              {user.position && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <IconBriefcase className="w-4 h-4" />
                    Position
                  </label>
                  <p className="text-sm">{user.position}</p>
                </div>
              )}
              {user.hireDate && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <IconCalendar className="w-4 h-4" />
                    Hire Date
                  </label>
                  <p className="text-sm">{formatDate(user.hireDate)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Member Since
                </label>
                <p className="text-sm">{formatDate(user.createdAt)}</p>
              </div>
              {user.lastLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Last Login
                  </label>
                  <p className="text-sm">{formatDate(user.lastLogin)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
