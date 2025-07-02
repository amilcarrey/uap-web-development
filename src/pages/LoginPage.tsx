import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#fffaf0] flex flex-col items-center justify-center gap-10 p-4">
      <LoginForm />
      <RegisterForm />
    </div>
  );
}