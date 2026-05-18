import { Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AuthLayout } from "./AuthLayout";
import AuthField from "./AuthField";
import useAlert from "../hooks/useAlert";
import { apiFetch } from "../lib/api";

function getEmailFromQuery() {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  return params.get("email") || "";
}

export default function AcceptInvitePage() {
  const navigate = useNavigate();
  const { notify } = useAlert();
  const [loading, setLoading] = useState(false);
  const emailFromQuery = useMemo(() => getEmailFromQuery(), []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const data = new FormData(e.target);
    const body = {
      email: data.get("email"),
      first_name: data.get("first_name"),
      last_name: data.get("last_name"),
      password: data.get("password"),
    };

    try {
      const json = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
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
      title="Accept invitation"
      subtitle="Complete your account setup to join your hospital."
      footer={
        <>
          Already registered?{" "}
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
        <AuthField
          label="Invitation email"
          name="email"
          type="email"
          defaultValue={emailFromQuery}
          placeholder="you@hospital.org"
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <AuthField label="First name" name="first_name" placeholder="John" required />
          <AuthField label="Last name" name="last_name" placeholder="Doe" required />
        </div>

        <AuthField
          label="Password"
          type="password"
          name="password"
          placeholder="At least 8 characters"
          required
        />

        <button
          disabled={loading}
          className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-light-secondary px-4 py-2.5 text-[13px] font-semibold text-light-card transition hover:opacity-90 disabled:opacity-60 dark:bg-dark-accent dark:text-dark-text"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}
