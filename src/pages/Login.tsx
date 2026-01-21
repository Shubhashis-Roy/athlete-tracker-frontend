import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Activity, User, Eye, ShieldCheck, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>("coach");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const success = await login(data.email, data.password, selectedRole);
      if (success) {
        toast.success(`Welcome! Logged in as ${selectedRole}`);
        navigate("/dashboard");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/95 to-primary/90 p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-accent shadow-2xl mb-4">
            <Activity className="w-10 h-10 text-accent-foreground" />
          </div>
          <h1 className="font-display text-4xl font-bold text-primary-foreground">
            AthleteTrack
          </h1>
          <p className="text-primary-foreground/70 mt-2">
            Performance Management System
          </p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to access your dashboard</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole("coach")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedRole === "coach"
                      ? "border-accent bg-accent/5 shadow-md"
                      : "border-border hover:border-accent/50"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      selectedRole === "coach" ? "bg-accent" : "bg-muted"
                    }`}
                  >
                    <ShieldCheck
                      className={`w-6 h-6 ${
                        selectedRole === "coach"
                          ? "text-accent-foreground"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Coach</p>
                    <p className="text-xs text-muted-foreground">Full access</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole("viewer")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedRole === "viewer"
                      ? "border-accent bg-accent/5 shadow-md"
                      : "border-border hover:border-accent/50"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      selectedRole === "viewer" ? "bg-accent" : "bg-muted"
                    }`}
                  >
                    <Eye
                      className={`w-6 h-6 ${
                        selectedRole === "viewer"
                          ? "text-accent-foreground"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Viewer</p>
                    <p className="text-xs text-muted-foreground">Read only</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 4,
                        message: "Password must be at least 4 characters",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="accent"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  `Sign in as ${selectedRole === "coach" ? "Coach" : "Viewer"}`
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
