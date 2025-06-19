import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNotifications } from "../store/clientStore";
import GorgeousButton from "./GorgeousButton";
import LoadingSpinner from "./LoadingSpinner";
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";

interface AuthFormProps {
  mode: "login" | "register";
  onToggleMode: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onToggleMode }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { login, register, isLoading } = useAuthStore();
  const { showSuccess, showError } = useNotifications();

  // Show loading spinner during authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear errors when user starts typingNo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (mode === "register" && !formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (mode === "register" && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (mode === "login") {
        await login(formData.email, formData.password);
        showSuccess("Welcome back!", "Successfully logged in");
      } else {
        await register(formData.username, formData.email, formData.password);
        showSuccess("Account created!", "Welcome to The Old Stand");
      }
    } catch (error) {
      showError(
        mode === "login" ? "Login failed" : "Registration failed",
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[url('/img/wood-pattern.png')] flex items-center justify-center p-4">
      <div className="bg-orange-950 border-4 border-amber-200 rounded-lg p-8 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-amber-200 text-3xl font-serif mb-2">
            The Old Stand
          </h1>
          <p className="text-slate-100 text-sm italic">
            {mode === "login"
              ? "Welcome back, mate! Ready for another round?"
              : "Join the pub family - let's get you set up!"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === "register" && (
            <div>
              <label
                htmlFor="username"
                className="block text-amber-200 text-sm font-medium mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-lg bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  errors.username ? "border-red-500" : "border-amber-300"
                }`}
                placeholder="Choose a username"
              />
              {errors.username && (
                <p className="text-red-400 text-xs mt-1">{errors.username}</p>
              )}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-amber-200 text-sm font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-lg bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                errors.email ? "border-red-500" : "border-amber-300"
              }`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-amber-200 text-sm font-medium mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 pr-10 border rounded-lg bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  errors.password ? "border-red-500" : "border-amber-300"
                }`}
                placeholder={
                  mode === "register"
                    ? "Create a password"
                    : "Enter your password"
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-700"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <GorgeousButton
            type="submit"
            disabled={isLoading}
            variant="green"
            className="w-full flex items-center justify-center gap-2"
          >
            {isLoading ? (
              "..."
            ) : mode === "login" ? (
              <>
                <LogIn className="w-4 h-4" />
                Sign In
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Create Account
              </>
            )}
          </GorgeousButton>

          {/* Toggle Mode */}
          <div className="text-center">
            <button
              type="button"
              onClick={onToggleMode}
              disabled={isLoading}
              className="text-amber-300 hover:text-amber-200 text-sm underline"
            >
              {mode === "login"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
