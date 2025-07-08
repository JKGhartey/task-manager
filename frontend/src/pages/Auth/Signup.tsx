import AuthLayout from "@/components/layouts/AuthLayout";
import { SignupForm } from "@/components/SignupForm";

export default function Signup() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}
