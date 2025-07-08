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
import { Mail } from "lucide-react";
import type React from "react";
import { cn } from "@/lib/utils";

export function VerifyEmailForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Verify your email</CardTitle>
          <CardDescription>
            We've sent a verification code to your email address. Enter the code
            below to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                  id="verification-code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Verify Email
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                Resend Code
              </Button>
            </div>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Didn't receive the code? Check your spam folder or{" "}
              <button
                type="button"
                className="underline underline-offset-4 hover:text-primary"
              >
                try a different email
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
