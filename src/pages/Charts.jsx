import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { BarChart3, Bell, HeartPulse, Moon, Sun } from 'lucide-react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts'

const roomData = [
  { name: 'Occupied', value: 54 },
  { name: 'Available', value: 26 },
]

const staffData = [
  { department: 'Emergency', staff: 18 },
  { department: 'Surgery', staff: 14 },
  { department: 'ICU', staff: 12 },
  { department: 'Pediatrics', staff: 9 },
  { department: 'Radiology', staff: 7 },
]

const patientData = [
  { month: 'Jan', patients: 1180 },
  { month: 'Feb', patients: 1225 },
  { month: 'Mar', patients: 1310 },
  { month: 'Apr', patients: 1288 },
  { month: 'May', patients: 1365 },
  { month: 'Jun', patients: 1420 },
]

const appointmentData = [
  { day: 'Mon', booked: 52, completed: 46 },
  { day: 'Tue', booked: 57, completed: 50 },
  { day: 'Wed', booked: 61, completed: 55 },
  { day: 'Thu', booked: 54, completed: 47 },
  { day: 'Fri', booked: 66, completed: 59 },
  { day: 'Sat', booked: 39, completed: 31 },
  { day: 'Sun', booked: 28, completed: 22 },
]

const emergencyData = [
  { level: 'Critical', cases: 18 },
  { level: 'Urgent', cases: 34 },
  { level: 'Moderate', cases: 27 },
  { level: 'Stable', cases: 16 },
]

const roomColors = ['#ef4444', '#22c55e']
const emergencyColors = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e']

function ChartCard({ title, subtitle, children }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      <div className="mt-4 h-72">{children}</div>
    </article>
  )
}

function Charts() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false

    return (
      document.documentElement.classList.contains('dark')
      || window.matchMedia('(prefers-color-scheme: dark)').matches
    )
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-slate-100/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-white dark:bg-slate-50 dark:text-slate-950">
                <HeartPulse className="h-4 w-4" />
              </div>
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Pulse<span className="text-brand">ED</span>
              </p>
            </div>

            <nav className="hidden items-center gap-2 text-sm md:flex">
              <Link
                to="/dashboard"
                className="rounded-xl px-4 py-2 font-semibold text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Dashboard
              </Link>
              <Link
                to="/charts"
                className="rounded-xl bg-slate-200 px-4 py-2 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Charts
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsDark((value) => !value)}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Bell className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            <BarChart3 className="h-3.5 w-3.5" />
            Analytics and charts
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Advanced visual statistics</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Visualized data for rooms, staff, patients, appointments, and emergency operations.
          </p>
        </div>

        <section className="grid gap-4 xl:grid-cols-2">
          <ChartCard title="Room status" subtitle="Best-fit: Donut chart for occupancy ratio">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roomData}
                  cx="50%"
                  cy="50%"
                  innerRadius={72}
                  outerRadius={106}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                >
                  {roomData.map((entry, index) => (
                    <Cell key={entry.name} fill={roomColors[index % roomColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Staff distribution" subtitle="Best-fit: Bar chart by department">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={staffData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                <XAxis dataKey="department" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="staff" radius={[8, 8, 0, 0]} fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Patient trend" subtitle="Best-fit: Line chart for monthly movement">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={patientData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="patients"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#8b5cf6' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Appointments flow" subtitle="Best-fit: Area chart for booked vs completed">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={appointmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="booked" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.25} />
                <Area type="monotone" dataKey="completed" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </section>

        <section className="mt-4">
          <ChartCard title="Emergency severity" subtitle="Best-fit: Horizontal bar chart for triage load">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emergencyData} layout="vertical" margin={{ left: 24, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis type="category" dataKey="level" tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="cases" radius={[0, 8, 8, 0]}>
                  {emergencyData.map((entry, index) => (
                    <Cell key={entry.level} fill={emergencyColors[index % emergencyColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </section>
      </main>
    </div>
  )
}

export default Charts