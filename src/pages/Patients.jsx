import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Bell, Filter, HeartPulse, MoreHorizontal, Moon, Plus, Search, Sun } from 'lucide-react'

const patients = [
  {
    id: 'ED-2841',
    name: 'Adan Khalid',
    age: 42,
    gender: 'Male',
    condition: 'Acute chest pain',
    doctor: 'Dr. Sara Ahmed',
    bay: 'Bay 03',
    level: 'Critical',
  },
  {
    id: 'ED-2840',
    name: 'Maria Lopez',
    age: 28,
    gender: 'Female',
    condition: 'Closed tibia fracture',
    doctor: 'Dr. Karim Nasser',
    bay: 'Bay 07',
    level: 'Urgent',
  },
  {
    id: 'ED-2839',
    name: 'Yuki Tanaka',
    age: 8,
    gender: 'Male',
    condition: 'High fever, suspected viral',
    doctor: 'Dr. Mei Chen',
    bay: 'Bay 12',
    level: 'Stable',
  },
  {
    id: 'ED-2838',
    name: 'Omar Said',
    age: 51,
    gender: 'Male',
    condition: 'Multi-trauma (RTA)',
    doctor: 'Dr. Karim Nasser',
    bay: 'Bay 01',
    level: 'Critical',
  },
  {
    id: 'ED-2837',
    name: 'Lina Park',
    age: 34,
    gender: 'Female',
    condition: 'Severe asthma exacerbation',
    doctor: 'Dr. Tom Becker',
    bay: 'Bay 09',
    level: 'Urgent',
  },
]

const levels = ['All', 'Critical', 'Urgent', 'Stable']

const levelStyles = {
  Critical: 'bg-brand/10 text-brand',
  Urgent: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Stable: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
}

function Patients() {
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState('All')
  const [isAddOpen, setIsAddOpen] = useState(false)
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

  const filtered = useMemo(() => {
    return patients.filter((patient) => {
      const lowered = query.toLowerCase()
      const matchQuery = !query
        || patient.name.toLowerCase().includes(lowered)
        || patient.id.toLowerCase().includes(lowered)
        || patient.condition.toLowerCase().includes(lowered)
      const matchLevel = level === 'All' || patient.level === level
      return matchQuery && matchLevel
    })
  }, [query, level])

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
                to="/patient"
                className="rounded-xl bg-slate-200 px-4 py-2 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Patients
              </Link>
              <Link
                to="/doctors"
                to="/doctors"
                className="rounded-xl px-4 py-2 font-semibold text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Doctors
              </Link>
              <Link
                to="/emergency"
                className="rounded-xl px-4 py-2 font-semibold text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Emergency
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

            <div className="hidden items-center gap-2.5 sm:flex">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                SA
              </div>
              <div className="leading-tight">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Dr. Sara Ahmed</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">St. Mercy General</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-5xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Patients</h1>
            <p className="mt-2 text-xl text-slate-600 dark:text-slate-400">
              {patients.length} total - {filtered.length} shown
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-3 text-base font-semibold text-white transition hover:bg-brand/90"
          >
            <Plus className="h-4 w-4" /> Add patient
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base dark:border-slate-700 dark:bg-slate-900">
            <Search className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, ID, condition..."
              className="w-full bg-transparent text-slate-700 placeholder:text-slate-400 focus:outline-none dark:text-slate-200 dark:placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
            <Filter className="ml-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
            {levels.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setLevel(option)}
                className={`rounded-xl px-3 py-1.5 text-sm font-medium transition ${
                  level === option
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
          <table className="w-full text-base">
            <thead className="border-b border-slate-200 bg-slate-100/80 text-left text-sm uppercase tracking-widest text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-400">
              <tr>
                <th className="px-5 py-4 font-medium">Patient</th>
                <th className="px-5 py-4 font-medium">Condition</th>
                <th className="px-5 py-4 font-medium">Doctor</th>
                <th className="px-5 py-4 font-medium">Bay</th>
                <th className="px-5 py-4 font-medium">Level</th>
                <th className="px-5 py-4" />
              </tr>
            </thead>

            <tbody>
              {filtered.map((patient) => (
                <tr
                  key={patient.id}
                  className="border-b border-slate-200 transition hover:bg-slate-100/70 last:border-0 dark:border-slate-700 dark:hover:bg-slate-800/70"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-sm font-semibold dark:bg-slate-800">
                        {patient.name.split(' ').map((part) => part[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{patient.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {patient.id} - {patient.age} {patient.gender[0]}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{patient.condition}</td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{patient.doctor}</td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{patient.bay}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-sm font-medium ${levelStyles[patient.level]}`}>
                      {patient.level}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500 dark:text-slate-400">
                    No patients match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm dark:bg-slate-950/70">
          <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Add patient</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Enter patient details for emergency registration.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Patient ID</span>
                  <input
                    type="text"
                    placeholder="ED-2842"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Full name</span>
                  <input
                    type="text"
                    placeholder="Patient name"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Age</span>
                  <input
                    type="number"
                    placeholder="35"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Gender</span>
                  <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Condition</span>
                  <input
                    type="text"
                    placeholder="Primary condition"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Assigned doctor</span>
                  <input
                    type="text"
                    placeholder="Doctor name"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Bay</span>
                  <input
                    type="text"
                    placeholder="Bay 01"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Emergency level</span>
                  <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    <option value="">Select level</option>
                    <option value="Critical">Critical</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Stable">Stable</option>
                  </select>
                </label>
              </div>

              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Notes</span>
                <textarea
                  rows={3}
                  placeholder="Additional notes"
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                />
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand/90"
                >
                  Save patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Patients
