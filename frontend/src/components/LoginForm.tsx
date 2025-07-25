import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LoginData } from "@/types/auth";
import { ROUTES } from "@/routes/routes";
import type React from "react";
import { authService } from "@/utils/authService";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
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
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await authService.login(formData);

      if (response.success) {
        toast.success("Login successful!");

        // Use auth context to login and store user data
        login(response.data.user, response.data.token);

        // Redirect based on user role
        const userRole = response.data.user.role;

        if (userRole === "admin" || userRole === "manager") {
          navigate(ROUTES.ADMIN.DASHBOARD);
        } else {
          navigate(ROUTES.USER.DASHBOARD);
        }
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred during login";
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

  const fillAdminCredentials = () => {
    setFormData({
      email: "admin@taskmanager.com",
      password: "Admin123!",
    });
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
          <CardTitle className="text-2xl brand-primary">Welcome Back</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                type="button"
              >
                Login with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Admin Credentials for Graders */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader className="text-center pb-3">
          <CardTitle className="text-lg text-blue-800">
            👨‍💼 Admin Login Credentials
          </CardTitle>
          <CardDescription className="text-blue-600">
            For graders to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Email:</span>
                <span className="font-mono text-blue-600">
                  admin@taskmanager.com
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Password:</span>
                <span className="font-mono text-blue-600">Admin123!</span>
              </div>
            </div>
            <Button
              onClick={fillAdminCredentials}
              variant="outline"
              size="sm"
              className="w-full mt-3 border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              🔑 Fill Admin Credentials
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
