import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Bell, Filter, HeartPulse, MoreHorizontal, Moon, Plus, Search, Siren, Sun } from 'lucide-react'

const cases = [
  {
    id: 'EC-1042',
    name: 'Adan Khalid',
    age: 42,
    gender: 'Male',
    complaint: 'Acute chest pain, suspected MI',
    room: 'Trauma 1',
    doctor: 'Dr. Sara Ahmed',
    severity: 'Critical',
    status: 'In treatment',
  },
  {
    id: 'EC-1041',
    name: 'Omar Said',
    age: 51,
    gender: 'Male',
    complaint: 'Multi-trauma from RTA',
    room: 'Trauma 2',
    doctor: 'Dr. Karim Nasser',
    severity: 'Critical',
    status: 'In treatment',
  },
  {
    id: 'EC-1040',
    name: 'Maria Lopez',
    age: 28,
    gender: 'Female',
    complaint: 'Closed tibia fracture',
    room: 'Bay 07',
    doctor: 'Dr. Karim Nasser',
    severity: 'Urgent',
    status: 'Stabilized',
  },
  {
    id: 'EC-1039',
    name: 'Lina Park',
    age: 34,
    gender: 'Female',
    complaint: 'Severe asthma exacerbation',
    room: 'Bay 09',
    doctor: 'Dr. Tom Becker',
    severity: 'Urgent',
    status: 'In treatment',
  },
  {
    id: 'EC-1038',
    name: 'Yuki Tanaka',
    age: 8,
    gender: 'Male',
    complaint: 'High fever, suspected viral',
    room: 'Bay 12',
    doctor: 'Dr. Mei Chen',
    severity: 'Stable',
    status: 'Discharged',
  },
]

const statusFilters = ['All', 'Incoming', 'In treatment', 'Stabilized', 'Discharged']

const severityStyles = {
  Critical: 'bg-brand/10 text-brand',
  Urgent: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Stable: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
}

const statusStyles = {
  Incoming: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  'In treatment': 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Stabilized: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  Discharged: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
}

function Emergency() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
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
    return cases.filter((item) => {
      const lowered = query.toLowerCase()
      const matchQuery = !query
        || item.name.toLowerCase().includes(lowered)
        || item.id.toLowerCase().includes(lowered)
        || item.complaint.toLowerCase().includes(lowered)
      const matchStatus = status === 'All' || item.status === status
      return matchQuery && matchStatus
    })
  }, [query, status])

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
                className="rounded-xl px-4 py-2 font-semibold text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Patients
              </Link>
              
              <Link
                to="/doctors"
                className="rounded-xl px-4 py-2 font-semibold text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Doctors
              </Link>
              <button
                type="button"
                className="rounded-xl bg-slate-200 px-4 py-2 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Emergency
              </button>
              <Link
                to="/staff"
                className="rounded-xl px-4 py-2 font-semibold text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Staff
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
            <h1 className="flex items-center gap-2 text-5xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              <Siren className="h-8 w-8 text-brand" />
              Emergency cases
            </h1>
            <p className="mt-2 text-xl text-slate-600 dark:text-slate-400">
              {cases.length} total - {filtered.length} shown
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-3 text-base font-semibold text-white transition hover:bg-brand/90"
          >
            <Plus className="h-4 w-4" /> New case
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex min-w-60 flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base dark:border-slate-700 dark:bg-slate-900">
            <Search className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by patient, ID, complaint..."
              className="w-full bg-transparent text-slate-700 placeholder:text-slate-400 focus:outline-none dark:text-slate-200 dark:placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
            <Filter className="ml-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
            {statusFilters.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setStatus(option)}
                className={`rounded-xl px-3 py-1.5 text-sm font-medium transition ${
                  status === option
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
                <th className="px-5 py-4 font-medium">Case</th>
                <th className="px-5 py-4 font-medium">Complaint</th>
                <th className="px-5 py-4 font-medium">Room</th>
                <th className="px-5 py-4 font-medium">Doctor</th>
                <th className="px-5 py-4 font-medium">Severity</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4" />
              </tr>
            </thead>

            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-200 transition hover:bg-slate-100/70 last:border-0 dark:border-slate-700 dark:hover:bg-slate-800/70"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-sm font-semibold dark:bg-slate-800">
                        {item.name.split(' ').map((part) => part[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {item.id} - {item.age} {item.gender[0]}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{item.complaint}</td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{item.room}</td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{item.doctor}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-sm font-medium ${severityStyles[item.severity]}`}>
                      {item.severity}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusStyles[item.status]}`}>
                      {item.status}
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
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500 dark:text-slate-400">
                    No emergency cases match your filters.
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
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">New emergency case</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Enter case details for emergency intake and tracking.
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
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Case ID</span>
                  <input
                    type="text"
                    placeholder="EC-1043"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Patient name</span>
                  <input
                    type="text"
                    placeholder="Patient full name"
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
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Complaint</span>
                  <input
                    type="text"
                    placeholder="Primary complaint"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Room</span>
                  <input
                    type="text"
                    placeholder="Trauma 1 / Bay 07"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Assigned doctor</span>
                  <input
                    type="text"
                    placeholder="Doctor name"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Severity</span>
                  <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    <option value="">Select severity</option>
                    <option value="Critical">Critical</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Stable">Stable</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Case status</span>
                  <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    <option value="">Select status</option>
                    <option value="Incoming">Incoming</option>
                    <option value="In treatment">In treatment</option>
                    <option value="Stabilized">Stabilized</option>
                    <option value="Discharged">Discharged</option>
                  </select>
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Arrival time</span>
                  <input
                    type="datetime-local"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  />
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
                  Save case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Emergency
