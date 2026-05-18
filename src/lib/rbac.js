const rolePermissions = {
  owner: ["*"],
  admin: ["*"],
  doctor: [
    "appointments:read",
    "appointments:write",
    "patients:read",
    "prescriptions:read",
    "prescriptions:write",
    "medical_files:read",
    "medical_files:write",
    "reports:read",
    "notifications:read",
    "doctors:read",
    "departments:read",
  ],
  nurse: [
    "patients:read",
    "triage:*",
    "cases:*",
    "rooms:*",
    "room_reservations:*",
    "notifications:read",
    "appointments:read",
    "doctors:read",
    "departments:read",
  ],
};

function matchesPermission(granted, required) {
  if (granted === "*" || granted === required) return true;
  const [gDomain, gAction] = String(granted).split(":");
  const [rDomain, rAction] = String(required).split(":");
  if (!gDomain || !gAction || !rDomain || !rAction) return false;
  return (gDomain === "*" || gDomain === rDomain) && (gAction === "*" || gAction === rAction);
}

export function hasPermission(user, permission) {
  if (!user?.role) return false;
  const granted = rolePermissions[user.role] || [];
  return granted.some((p) => matchesPermission(p, permission));
}

