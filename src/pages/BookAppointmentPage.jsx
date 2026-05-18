import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import TopBar from '../components/TopBar'
import { createAppointment } from './hospitalApi'
import useAlert from '../hooks/useAlert'
import { apiFetch } from '../lib/api'
import useCurrentUser from '../hooks/useCurrentUser'
import { hasPermission } from '../lib/rbac'

export default function BookAppointmentPage() {
  const { notify } = useAlert()
  const currentUser = useCurrentUser()
  const canWrite = hasPermission(currentUser, 'appointments:write')
  const [message, setMessage] = useState('')
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      setIsLoading(true)
      try {
        const [patientsData, doctorsData] = await Promise.all([
          apiFetch('/api/patients'),
          apiFetch('/api/doctors'),
        ])
        if (!isMounted) return
        setPatients(Array.isArray(patientsData) ? patientsData : [])
        setDoctors(Array.isArray(doctorsData) ? doctorsData : [])
      } catch (err) {
        if (!isMounted) return
        notify({ tone: 'error', message: err.message })
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [notify])

  async function handleSubmit(event) {
    event.preventDefault()

    const data = new FormData(event.target)
    const appointment = {
      patient_id: data.get('patient_id'),
      doctor_id: data.get('doctor_id'),
      date: data.get('date'),
      time: data.get('time'),
      status: 'Scheduled',
    }

    try {
      await createAppointment(appointment)
      setMessage('Appointment saved.')
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <TopBar activePath="/appointments" showNotifications showUserMenu />

      <main className="mx-auto max-w-4xl px-5 py-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Appointments</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Book Appointment</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Patient selects doctor, date, time, and payment status.
        </p>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {!canWrite && (
            <p className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              You don&apos;t have permission to create appointments.
            </p>
          )}

          {canWrite && (
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold dark:text-slate-200">Patient</label>
              <select
                name="patient_id"
                required
                disabled={isLoading}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                <option value="">{isLoading ? 'Loading patients…' : 'Select a patient'}</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} ({patient.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold dark:text-slate-200">Doctor</label>
              <select
                name="doctor_id"
                required
                disabled={isLoading}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                <option value="">{isLoading ? 'Loading doctors…' : 'Select a doctor'}</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}{doctor.department ? ` - ${doctor.department}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold dark:text-slate-200">Date</label>
              <input name="date" type="date" required className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold dark:text-slate-200">Time</label>
              <input name="time" type="time" required className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
            </div>

            <div className="flex gap-3 md:col-span-2">
              <button className="rounded-2xl bg-brand px-5 py-3 font-semibold text-white">
                Save Appointment
              </button>
              <Link to="/appointments" className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
                Back to appointments
              </Link>
            </div>
          </form>
          )}

          {message && (
            <p className="mt-4 rounded-2xl bg-slate-100 p-4 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {message}
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
