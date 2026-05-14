import { Link } from '@tanstack/react-router'
import { CalendarDays, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import TopBar from '../components/TopBar'
import { getStatusClass, mockAppointments } from './hospitalData'

function Badge({ value }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(value)}`}>{value}</span>
}

export default function AppointmentsPage() {
  const [search, setSearch] = useState('')
  const [doctorFilter, setDoctorFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('')

  const doctors = ['All', ...new Set(mockAppointments.map((item) => item.doctor))]

  const filteredAppointments = useMemo(() => {
    return mockAppointments.filter((appointment) => {
      const text = search.toLowerCase()
      const matchesSearch =
        !text ||
        appointment.patient.toLowerCase().includes(text) ||
        appointment.doctor.toLowerCase().includes(text) ||
        appointment.id.toLowerCase().includes(text)

      const matchesDoctor = doctorFilter === 'All' || appointment.doctor === doctorFilter
      const matchesDate = !dateFilter || appointment.date === dateFilter

      return matchesSearch && matchesDoctor && matchesDate
    })
  }, [search, doctorFilter, dateFilter])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <TopBar activePath="/appointments" showNotifications showUserMenu />

      <main className="mx-auto max-w-7xl px-5 py-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Appointments</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Appointments List</h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              View all appointments and filter by patient, doctor, and date.
            </p>
          </div>

          <Link
            to="/book-appointment"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3 font-semibold text-white"
          >
            <CalendarDays size={18} />
            Book Appointment
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Search
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700">
              <Search size={18} className="text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by patient, doctor, or ID"
                className="w-full bg-transparent text-sm outline-none dark:text-white"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Doctor
            </label>
            <select
              value={doctorFilter}
              onChange={(event) => setDoctorFilter(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              {doctors.map((doctor) => (
                <option key={doctor} value={doctor}>{doctor}</option>
              ))}
            </select>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Date
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase text-slate-500 dark:bg-slate-800">
                <tr>
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Patient</th>
                  <th className="px-5 py-3">Doctor</th>
                  <th className="px-5 py-3">Department</th>
                  <th className="px-5 py-3">Date / Time</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Payment</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="border-t border-slate-100 dark:border-slate-800 dark:text-slate-200">
                    <td className="px-5 py-4 font-semibold">{appointment.id}</td>
                    <td className="px-5 py-4">{appointment.patient}</td>
                    <td className="px-5 py-4">{appointment.doctor}</td>
                    <td className="px-5 py-4">{appointment.department}</td>
                    <td className="px-5 py-4">{appointment.date} / {appointment.time}</td>
                    <td className="px-5 py-4"><Badge value={appointment.status} /></td>
                    <td className="px-5 py-4"><Badge value={appointment.payment} /></td>
                    <td className="px-5 py-4">
                      <Link
                        to="/appointment-details"
                        search={{ id: appointment.id }}
                        className="font-semibold text-brand"
                      >
                        View details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}