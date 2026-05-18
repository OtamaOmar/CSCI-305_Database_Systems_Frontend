import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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
  const [email, setEmail] = useState(emailFromQuery);
  const [invitation, setInvitation] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [departmentMode, setDepartmentMode] = useState("existing");
  const [inviteStatus, setInviteStatus] = useState({ loading: false, error: "" });

  useEffect(() => {
    if (!email || !email.includes("@")) {
      setInvitation(null);
      setDepartments([]);
      setInviteStatus({ loading: false, error: "" });
      return undefined;
    }

    let cancelled = false;
    const timeout = setTimeout(async () => {
      setInviteStatus({ loading: true, error: "" });
      try {
        const json = await apiFetch(
          `/api/auth/invitation-details?email=${encodeURIComponent(email)}`
        );
        if (cancelled) return;
        const list = Array.isArray(json.departments) ? json.departments : [];
        setInvitation(json.invitation || null);
        setDepartments(list);
        setDepartmentMode(list.length > 0 ? "existing" : "new");
        setInviteStatus({ loading: false, error: "" });
      } catch (err) {
        if (cancelled) return;
        setInvitation(null);
        setDepartments([]);
        setInviteStatus({ loading: false, error: err.message });
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [email]);

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

    if (departmentMode === "existing") {
      body.department_id = data.get("department_id");
    } else {
      body.department_name = data.get("department_name");
      body.department_code = data.get("department_code");
      body.department_location = data.get("department_location");
      body.department_create = true;
    }

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
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@hospital.org"
          required
        />

        {inviteStatus.loading && (
          <p className="text-[12px] text-light-secondary/70 dark:text-dark-text/70">
            Checking invitation...
          </p>
        )}

        {inviteStatus.error && (
          <p className="text-[12px] text-red-600 dark:text-red-400">
            {inviteStatus.error}
          </p>
        )}

        {invitation && (
          <div className="rounded-md border border-dark-border/30 bg-light-card/70 p-3 text-[12px] text-light-text dark:border-dark-border dark:bg-dark-bg/60 dark:text-dark-text">
            <p>
              Hospital: <span className="font-semibold">{invitation.hospital_name}</span>
            </p>
            <p>
              Role: <span className="font-semibold">{invitation.role}</span>
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <AuthField label="First name" name="first_name" placeholder="John" required />
          <AuthField label="Last name" name="last_name" placeholder="Doe" required />
        </div>

        {invitation && (
          <div className="space-y-3 rounded-md border border-dark-border/30 bg-light-card/70 p-3 text-[12px] text-light-text dark:border-dark-border dark:bg-dark-bg/60 dark:text-dark-text">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-[12px] font-medium">Department</span>
              <div className="flex items-center gap-4 text-[12px]">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="department_mode"
                    value="existing"
                    checked={departmentMode === "existing"}
                    onChange={() => setDepartmentMode("existing")}
                    disabled={departments.length === 0}
                  />
                  Select existing
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="department_mode"
                    value="new"
                    checked={departmentMode === "new"}
                    onChange={() => setDepartmentMode("new")}
                  />
                  Create new
                </label>
              </div>
            </div>

            {departmentMode === "existing" ? (
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-medium text-light-text dark:text-dark-text">
                  Choose department
                </span>
                <select
                  name="department_id"
                  required
                  className="block w-full rounded-md border border-dark-border/30 bg-light-card px-3 py-2 text-[13px] text-light-text focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text dark:focus:border-dark-accent dark:focus:ring-dark-accent/25"
                >
                  <option value="" disabled>
                    Select a department
                  </option>
                  {departments.map((dep) => (
                    <option key={dep.id} value={dep.id}>
                      {dep.name} ({dep.code})
                    </option>
                  ))}
                </select>
                {departments.length === 0 && (
                  <p className="mt-2 text-[11px] text-light-secondary/70 dark:text-dark-text/70">
                    No departments found yet. Create a new one.
                  </p>
                )}
              </label>
            ) : (
              <div className="grid gap-3">
                <AuthField
                  label="Department name"
                  name="department_name"
                  placeholder="Emergency"
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <AuthField
                    label="Department code"
                    name="department_code"
                    placeholder="ER"
                  />
                  <AuthField
                    label="Location"
                    name="department_location"
                    placeholder="Ground floor"
                  />
                </div>
              </div>
            )}
          </div>
        )}

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
