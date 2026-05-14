import { Link, useSearch } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import TopBar from '../components/TopBar'
import { cancelAppointment, updateAppointment } from './hospitalApi'
import { getStatusClass, mockAppointments } from './hospitalData'

function Badge({ value }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(value)}`}>
      {value}
    </span>
  )
}

export default function AppointmentDetailsPage() {
  const search = useSearch({ strict: false })
  const appointmentId = search.id || 'APT-1001'

  const appointment = useMemo(() => {
    return mockAppointments.find((item) => item.id === appointmentId) || mockAppointments[0]
  }, [appointmentId])

  const [message, setMessage] = useState('')

  async function handleUpdate(event) {
    event.preventDefault()

    const data = new FormData(event.target)

    const updatedData = {
      date: data.get('date'),
      time: data.get('time'),
      status: data.get('status'),
      payment: data.get('payment'),
    }

    try {
      await updateAppointment(appointment.id, updatedData)
      setMessage('Appointment updated through backend API.')
    } catch {
      setMessage('Demo mode: update form is ready for backend integration.')
    }
  }

  async function handleCancel() {
    try {
      await cancelAppointment(appointment.id)
      setMessage('Appointment cancelled and refund request sent through backend API.')
    } catch {
      setMessage('Demo mode: cancel/refund workflow is ready for backend integration.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <TopBar activePath="/appointments" showNotifications showUserMenu />

      <main className="mx-auto max-w-6xl px-5 py-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
          Appointments
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
          Appointment Details
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          View appointment status, doctor information, patient information, reschedule details,
          cancellation workflow, and refund status.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
            <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
              Appointment Information
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">Appointment ID</p>
                <p className="font-bold text-slate-900 dark:text-white">{appointment.id}</p>
              </div>

              <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
                <div className="mt-1">
                  <Badge value={appointment.status} />
                </div>
              </div>

              <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">Patient</p>
                <p className="font-bold text-slate-900 dark:text-white">{appointment.patient}</p>
              </div>

              <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">Doctor</p>
                <p className="font-bold text-slate-900 dark:text-white">{appointment.doctor}</p>
              </div>

              <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">Department</p>
                <p className="font-bold text-slate-900 dark:text-white">{appointment.department}</p>
              </div>

              <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">Date / Time</p>
                <p className="font-bold text-slate-900 dark:text-white">
                  {appointment.date} / {appointment.time}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">Payment</p>
                <div className="mt-1">
                  <Badge value={appointment.payment} />
                </div>
              </div>

              <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">Refund</p>
                <p className="font-bold text-slate-900 dark:text-white">{appointment.refund}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
              Edit / Reschedule
            </h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold dark:text-slate-200">
                  New Date
                </label>
                <input
                  name="date"
                  type="date"
                  defaultValue={appointment.date}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold dark:text-slate-200">
                  New Time
                </label>
                <input
                  name="time"
                  type="time"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold dark:text-slate-200">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={appointment.status}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option>Confirmed</option>
                  <option>Pending</option>
                  <option>Cancelled</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold dark:text-slate-200">
                  Payment
                </label>
                <select
                  name="payment"
                  defaultValue={appointment.payment}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option>Paid</option>
                  <option>Unpaid</option>
                  <option>Insurance pending</option>
                </select>
              </div>

              <button className="w-full rounded-2xl bg-brand px-5 py-3 font-semibold text-white">
                Update Appointment
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="w-full rounded-2xl border border-red-200 bg-red-50 px-5 py-3 font-semibold text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
              >
                Cancel / Request Refund
              </button>

              <Link
                to="/appointments"
                className="block text-center font-semibold text-brand"
              >
                Back to appointments
              </Link>
            </form>

            {message && (
              <p className="mt-4 rounded-2xl bg-slate-100 p-4 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {message}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}