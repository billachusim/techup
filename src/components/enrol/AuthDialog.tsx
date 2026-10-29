import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SignupForm } from "@/components/Auth/SignupForm";
import { LoginForm } from "@/components/Auth/LoginForm";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planTitle?: string;
  free?: boolean;
  onSuccess: () => void;
}

/** Sign up (or sign in) before enrolling; enrolment carries on afterwards. */
export const AuthDialog = ({
  open,
  onOpenChange,
  planTitle,
  free,
  onSuccess,
}: AuthDialogProps) => {
  const [mode, setMode] = useState<"signup" | "login">("signup");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "signup" ? "Create your free account" : "Welcome back"}
          </DialogTitle>
          <DialogDescription>
            {mode === "signup"
              ? `One quick step${planTitle ? ` before ${free ? "you join" : "you pay for"} ${planTitle}` : ""}. Your Faculty ID is created when you enrol.`
              : `Sign in to carry on${planTitle ? ` with ${planTitle}` : ""}.`}
          </DialogDescription>
        </DialogHeader>

        {mode === "signup" ? (
          <SignupForm onSuccess={onSuccess} />
        ) : (
          <LoginForm
            onSuccess={onSuccess}
            onForgotPassword={() => {
              onOpenChange(false);
              window.location.assign("/#get-started");
            }}
          />
        )}

        <p className="text-center text-sm text-muted-foreground">
          {mode === "signup"
            ? "Already have an account? "
            : "New to Tech Faculty? "}
          <button
            type="button"
            className="font-medium text-primary hover:underline"
            onClick={() => setMode(mode === "signup" ? "login" : "signup")}
          >
            {mode === "signup" ? "Sign in" : "Create an account"}
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
};
