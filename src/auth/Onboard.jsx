import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthLayout } from "./AuthLayout";
import AuthField from "./AuthField";
import useAlert from "../hooks/useAlert";
import { apiFetch } from "../lib/api";

export default function OnboardPage() {
  const navigate = useNavigate();
  const { notify } = useAlert();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const data = new FormData(e.target);
    const body = {
      first_name: data.get("first_name"),
      last_name: data.get("last_name"),
      email: data.get("email"),
      hospital_name: data.get("hospital_name"),
      rooms_count: Number(data.get("rooms_count") || 0),
      password: data.get("password"),
    };

    try {
      const json = await apiFetch("/api/auth/register-owner", {
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
      title="Set up your hospital"
      subtitle="Create your organization and owner account."
      footer={
        <>
          Already have access?{" "}
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
          <AuthField label="First name" name="first_name" placeholder="John" required />
          <AuthField label="Last name" name="last_name" placeholder="Doe" required />
        </div>

        <AuthField
          label="Owner email"
          type="email"
          name="email"
          placeholder="owner@hospital.org"
          required
        />

        <AuthField
          label="Hospital name"
          name="hospital_name"
          placeholder="St. Mercy General"
          required
        />

        <AuthField
          label="Number of rooms"
          type="number"
          name="rooms_count"
          min="0"
          max="5000"
          placeholder="20"
          required
        />

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
          {loading ? "Creating hospital…" : "Create hospital"}
        </button>
      </form>
    </AuthLayout>
  );
}
