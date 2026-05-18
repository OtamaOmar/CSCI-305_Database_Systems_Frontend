import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getToken } from "../lib/api";

export default function RequireAuth({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate({ to: "/login" });
    }
  }, [navigate]);

  return children;
}

