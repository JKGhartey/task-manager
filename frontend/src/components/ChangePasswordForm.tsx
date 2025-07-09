import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import type { ChangePasswordData } from "@/types/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type React from "react";
import { authService } from "@/utils/authService";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function ChangePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<
    ChangePasswordData & { confirmPassword: string }
  >({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.currentPassword) {
      toast.error("Current password is required");
      return false;
    }
    if (!formData.newPassword) {
      toast.error("New password is required");
      return false;
    }
    if (formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match");
      return false;
    }
    if (formData.currentPassword === formData.newPassword) {
      toast.error("New password must be different from current password");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const { currentPassword, newPassword } = formData;
      const response = await authService.changePassword({
        currentPassword,
        newPassword,
      });

      if (response.success) {
        toast.success("Password changed successfully!");
        // Redirect to appropriate dashboard
        navigate("/");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while changing password";
      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        toast.error(axiosError.response?.data?.message || errorMessage);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img
              src="/logo.jpg"
              alt="TaskManager Logo"
              className="h-12 w-12 rounded-lg object-cover"
            />
          </div>
          <CardTitle className="text-2xl">Change your password</CardTitle>
          <CardDescription>
            Enter your current password and new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-new-password">
                  Confirm New Password
                </Label>
                <Input
                  id="confirm-new-password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              <a href="/" className="underline underline-offset-4">
                Back to dashboard
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
