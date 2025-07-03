import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#fffaf0] flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row gap-6">
        <LoginForm />
        <RegisterForm />
      </div>
    </div>
  );
}
