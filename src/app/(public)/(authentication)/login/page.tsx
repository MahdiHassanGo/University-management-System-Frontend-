import LoginForm from "@/components/form/login-form";

export const metadata = {
  title: "Portal Sign In | University Management System",
  description:
    "Sign in to access your Super Admin, Faculty, or Student academic workspace.",
};

export default function LoginPage() {
  return <LoginForm />;
}
