import AuthLayout from "@/components/layouts/AuthLayout";
import { SEO } from "@/components/SEO";
import { SignupForm } from "@/components/SignupForm";

export default function Signup() {
  return (
    <>
      <SEO
        title="Sign Up - TaskManager | Create Your Free Account"
        description="Create your free TaskManager account and start boosting your team's productivity. No credit card required. Join 10,000+ teams already using TaskManager."
        keywords="sign up, register, create account, free task management, team collaboration, productivity tools"
        url="https://taskmanager.com/signup"
        type="website"
      />
      <AuthLayout>
        <SignupForm />
      </AuthLayout>
    </>
  );
}
