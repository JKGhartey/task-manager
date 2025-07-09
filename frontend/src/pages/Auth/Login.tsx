import AuthLayout from "@/components/layouts/AuthLayout";
import { LoginForm } from "@/components/LoginForm";
import { SEO } from "@/components/SEO";

export default function Login() {
  return (
    <>
      <SEO
        title="Sign In - TaskManager | Login to Your Account"
        description="Sign in to your TaskManager account to access your tasks, projects, and team collaboration tools. Secure login with email and password."
        keywords="login, sign in, task manager login, user authentication, secure login"
        url="https://taskmanager.com/login"
        type="website"
      />
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    </>
  );
}
