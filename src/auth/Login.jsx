import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthLayout } from "./AuthLayout";
import AuthField from "./AuthField";
import useAlert from "../hooks/useAlert";
import { Eye, EyeOff } from "lucide-react";
import { apiFetch } from "../lib/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const { notify } = useAlert();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const data = new FormData(e.target);
    const email = data.get("email");
    const password = data.get("password");

    try {
      const json = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("token", json.token);
      if (json.user) localStorage.setItem("user", JSON.stringify(json.user));
      navigate({ to: "/dashboard" });
    } catch (err) {
      notify({ tone: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your PulseED account."
      footer={
        <>
          Need access?{" "}
          <span className="text-light-secondary/70 dark:text-dark-text/70">
            Ask your hospital admin for an invitation.
          </span>
          <span className="mx-2 text-light-secondary/40 dark:text-dark-text/40">·</span>
          <Link
            to="/onboard"
            className="font-medium text-light-text hover:text-brand dark:text-dark-text"
          >
            Set up a new hospital
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          label="Work email"
          type="email"
          name="email"
          placeholder="you@hospital.org"
          required
        />

        <label className="block">
          <span className="mb-1.5 block text-[12px] font-medium text-light-text dark:text-dark-text">
            Password
          </span>

          <div className="flex items-center gap-2 rounded-md border border-dark-border/30 bg-light-card px-3 py-2 dark:border-dark-border dark:bg-dark-bg">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              required
              className="w-full bg-transparent text-[13px] text-light-text placeholder:text-light-secondary/55 focus:outline-none dark:text-dark-text dark:placeholder:text-dark-text/45"
            />

            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="grid h-7 w-7 place-items-center rounded-md text-light-secondary/70 transition hover:text-light-text dark:text-dark-text/70 dark:hover:text-dark-text"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>

        <div className="flex items-center justify-between text-[12px]">
          <label className="flex items-center gap-2 text-light-secondary/70 dark:text-dark-text/70">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 rounded border border-dark-border/40 bg-light-card text-brand focus:ring-2 focus:ring-brand/30 dark:border-dark-border dark:bg-dark-card"
            />
            Remember me
          </label>

          <a
            href="#"
            className="text-light-secondary/70 hover:text-light-text dark:text-dark-text/70 dark:hover:text-dark-text"
          >
            Forgot password?
          </a>
        </div>

        <button
          disabled={loading}
          className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-light-secondary px-4 py-2.5 text-[13px] font-semibold text-light-card transition hover:opacity-90 disabled:opacity-60 dark:bg-dark-accent dark:text-dark-text"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  );
}
