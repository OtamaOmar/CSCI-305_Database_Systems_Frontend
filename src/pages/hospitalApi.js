import { apiFetch } from "../lib/api";

export function getAppointments() {
  return apiFetch("/api/appointments");
}

export function getAppointmentById(id) {
  return apiFetch(`/api/appointments/${id}`);
}

export function createAppointment(data) {
  return apiFetch("/api/appointments", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateAppointment(id, data) {
  return apiFetch(`/api/appointments/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function cancelAppointment(id) {
  return apiFetch(`/api/appointments/${id}`, { method: "DELETE" });
}

export function getAmbulances() {
  return apiFetch("/api/ambulances");
}

export function getTriageCases() {
  return apiFetch("/api/triage");
}

export function getRooms() {
  return apiFetch("/api/rooms");
}

export function createRoomReservation(data) {
  return apiFetch("/api/room-reservations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getDepartments() {
  return apiFetch("/api/departments");
}

export function getLocations() {
  return apiFetch("/api/locations");
}

export function getPrescriptions() {
  return apiFetch("/api/prescriptions");
}

export function createPrescription(data) {
  return apiFetch("/api/prescriptions", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getMedicalFiles() {
  return apiFetch("/api/medical-files");
}

export function getReportsDashboard() {
  return apiFetch("/api/reports/dashboard");
}

export function getUsers() {
  return apiFetch("/api/users");
}

export function getRoles() {
  return apiFetch("/api/roles");
}

export function getInvitations() {
  return apiFetch("/api/invitations");
}

export function createInvitation(data) {
  return apiFetch("/api/invitations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function revokeInvitation(id) {
  return apiFetch(`/api/invitations/${id}/revoke`, { method: "POST" });
}

