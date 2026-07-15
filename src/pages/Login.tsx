import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LoginForm } from "@/components/Auth/LoginForm";
import { SignupForm } from "@/components/Auth/SignupForm";

function sanitizeNext(next: string | null): string {
  if (!next) return "/";
  if (!next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}

const Login = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = sanitizeNext(params.get("next"));
  const [mode, setMode] = useState<"login" | "signup">("login");

  const goNext = () => navigate(next, { replace: true });

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16 bg-background">
      <div className="w-full max-w-md space-y-6 rounded-lg border border-border bg-card p-8 shadow-sm">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-foreground">
            {mode === "login" ? "Sign in to Tech Faculty" : "Create your Tech Faculty account"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "login" ? "Access your dashboard, courses, and integrations." : "Join to enroll in courses and connect AI clients."}
          </p>
        </div>

        {mode === "login" ? (
          <LoginForm onSuccess={goNext} onForgotPassword={() => {}} />
        ) : (
          <SignupForm onSuccess={goNext} />
        )}

        <div className="text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              New here?{" "}
              <button className="text-primary hover:underline" onClick={() => setMode("signup")}>
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button className="text-primary hover:underline" onClick={() => setMode("login")}>
                Sign in
              </button>
            </>
          )}
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:underline">← Back to home</Link>
        </div>
      </div>
    </main>
  );
};

export default Login;