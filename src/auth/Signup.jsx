import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthLayout } from "./AuthLayout";
import AuthField from "./AuthField";

export default function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      navigate({ to: "/" });
    }, 400);
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start managing emergency operations in minutes."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-light-text hover:text-brand dark:text-dark-text"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <AuthField label="First name" placeholder="John" required />
          <AuthField label="Last name" placeholder="Doe" required />
        </div>

        <AuthField
          label="Work email"
          type="email"
          placeholder="you@hospital.org"
          required
        />

        <AuthField
          label="Hospital / Organization"
          placeholder="St. Mercy General"
          required
        />

        <AuthField
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          required
        />

        <button
          disabled={loading}
          className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-light-secondary px-4 py-2.5 text-[13px] font-semibold text-light-card transition hover:opacity-90 disabled:opacity-60 dark:bg-dark-accent dark:text-dark-text"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>

        <p className="text-center text-[11px] text-light-secondary/70 dark:text-dark-text/70">
          By continuing you agree to our Terms and Privacy Policy.
        </p>
      </form>
    </AuthLayout>
  );
}
