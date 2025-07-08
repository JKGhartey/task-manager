import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import type React from "react";
import { authService } from "@/utils/authService";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";

export function VerifyEmailForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const providedToken = location.state?.verificationToken || "";

  const [verificationToken, setVerificationToken] = useState(providedToken);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationToken.trim()) {
      toast.error("Please enter the verification code");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.verifyEmail(verificationToken);

      if (response.success) {
        toast.success(response.message);
        // Redirect to dashboard after successful verification
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred during verification";
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

  const handleResendCode = async () => {
    setLoading(true);

    try {
      const response = await authService.resendVerification();
      if (response.success) {
        toast.success(
          "Verification code sent successfully. Please check your email."
        );
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while resending the code";
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
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Verify your email</CardTitle>
          <CardDescription>
            {providedToken
              ? "Your verification token has been pre-filled below. Click 'Verify Email' to complete the verification."
              : "We've sent a verification code to your email address. Enter the code below to verify your account."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {email && (
                <div className="text-center text-sm text-muted-foreground">
                  Verification code sent to: <strong>{email}</strong>
                </div>
              )}

              {providedToken && (
                <div className="text-center text-sm text-green-600 bg-green-50 border border-green-200 rounded-md p-2">
                  Verification token has been pre-filled for testing purposes.
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                  id="verification-code"
                  type="text"
                  placeholder="Enter verification code"
                  value={verificationToken}
                  onChange={(e) => setVerificationToken(e.target.value)}
                  className="text-center text-lg tracking-widest"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verifying..." : "Verify Email"}
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                type="button"
                onClick={handleResendCode}
                disabled={loading}
              >
                {loading ? "Sending..." : "Resend Code"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Didn't receive the code? Check your spam folder or{" "}
              <button
                type="button"
                className="underline underline-offset-4 hover:text-primary"
                onClick={handleResendCode}
              >
                resend the code
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
