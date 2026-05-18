import { useMemo } from "react";
import { getUser } from "../lib/api";

export default function useCurrentUser() {
  return useMemo(() => getUser(), []);
}

