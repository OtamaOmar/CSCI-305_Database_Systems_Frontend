import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthLayout } from "./AuthLayout";
import AuthField from "./AuthField";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      navigate({ to: "/dashboard" });
    }, 400);
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your PulseED account."
      footer={
        <>
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-light-text hover:text-brand dark:text-dark-text"
          >
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          label="Username"
          type="text"
          placeholder="Enter any username"
          required
        />

        <AuthField
          label="Password"
          type="password"
          placeholder="••••••••"
          required
        />

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
