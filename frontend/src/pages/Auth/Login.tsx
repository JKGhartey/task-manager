import AuthLayout from "@/components/layouts/AuthLayout";
import { LoginForm } from "@/components/LoginForm";

export default function Login() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
