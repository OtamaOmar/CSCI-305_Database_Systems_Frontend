const API_BASE_URL = 'http://localhost:5000/api'

async function request(endpoint, options = {}) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!res.ok) {
    throw new Error(`API error: ${endpoint}`)
  }

  return res.json()
}

export function getAppointments() {
  return request('/appointments')
}

export function getAppointmentById(id) {
  return request(`/appointments/${id}`)
}

export function createAppointment(data) {
  return request('/appointments', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateAppointment(id, data) {
  return request(`/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function cancelAppointment(id) {
  return request(`/appointments/${id}`, {
    method: 'DELETE',
  })
}

export function getAmbulances() {
  return request('/ambulances')
}

export function getTriageCases() {
  return request('/triage')
}

export function getRooms() {
  return request('/rooms')
}

export function createRoomReservation(data) {
  return request('/room-reservations', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function getDepartments() {
  return request('/departments')
}

export function getLocations() {
  return request('/locations')
}

export function getPrescriptions() {
  return request('/prescriptions')
}

export function createPrescription(data) {
  return request('/prescriptions', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function getMedicalFiles() {
  return request('/medical-files')
}

export function getReportsDashboard() {
  return request('/reports/dashboard')
}

export function getUsers() {
  return request('/users')
}

export function getRoles() {
  return request('/roles')
}