import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import TopBar from '../components/TopBar'
import { createAppointment } from './hospitalApi'

export default function BookAppointmentPage() {
  const [message, setMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    const data = new FormData(event.target)
    const appointment = {
      patient: data.get('patient'),
      doctor: data.get('doctor'),
      department: data.get('department'),
      date: data.get('date'),
      time: data.get('time'),
      payment: data.get('payment'),
    }

    try {
      await createAppointment(appointment)
      setMessage('Appointment saved through backend API.')
    } catch {
      setMessage('Demo mode: appointment form is ready for backend integration.')
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
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold dark:text-slate-200">Patient name</label>
              <input name="patient" required className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold dark:text-slate-200">Doctor</label>
              <select name="doctor" required className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                <option>Dr. Mona Adel</option>
                <option>Dr. Karim Samir</option>
                <option>Dr. Nada Youssef</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold dark:text-slate-200">Department</label>
              <select name="department" required className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                <option>Emergency</option>
                <option>Internal Medicine</option>
                <option>Surgery</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold dark:text-slate-200">Payment workflow</label>
              <select name="payment" required className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                <option>Paid</option>
                <option>Unpaid</option>
                <option>Insurance pending</option>
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