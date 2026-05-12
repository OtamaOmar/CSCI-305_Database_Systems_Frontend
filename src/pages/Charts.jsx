import { useEffect, useMemo, useState } from 'react'
import TopBar from '../components/TopBar'
import { useAlert } from '../components/AlertProvider'
import { BarChart3 } from 'lucide-react'
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

const roomColors = ['#ef4444', '#22c55e']
const emergencyColors = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e']
const ROOM_CAPACITY = 80
const CHART_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function parseDate(value) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date
}

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
  const { notify } = useAlert()
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false

    return (
      document.documentElement.classList.contains('dark')
      || window.matchMedia('(prefers-color-scheme: dark)').matches
    )
  })

  const [cases, setCases] = useState([])
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  useEffect(() => {
    let isMounted = true

    const fetchList = async (url, label) => {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`${label} request failed.`)
      const data = await response.json()
      return Array.isArray(data) ? data : []
    }

    const loadCharts = async () => {
      const [casesResult, doctorsResult, patientsResult] = await Promise.allSettled([
        fetchList('http://localhost:5000/api/cases', 'Cases'),
        fetchList('http://localhost:5000/api/doctors', 'Doctors'),
        fetchList('http://localhost:5000/api/patients', 'Patients'),
      ])

      if (!isMounted) return

      if (casesResult.status === 'fulfilled') {
        setCases(casesResult.value)
      } else {
        console.error(casesResult.reason)
        notify({ tone: 'error', message: 'Failed to load emergency cases for charts.' })
      }

      if (doctorsResult.status === 'fulfilled') {
        setDoctors(doctorsResult.value)
      } else {
        console.error(doctorsResult.reason)
        notify({ tone: 'error', message: 'Failed to load doctors for charts.' })
      }

      if (patientsResult.status === 'fulfilled') {
        setPatients(patientsResult.value)
      } else {
        console.error(patientsResult.reason)
        notify({ tone: 'error', message: 'Failed to load patients for charts.' })
      }
    }

    loadCharts()

    return () => {
      isMounted = false
    }
  }, [notify])

  const roomData = useMemo(() => {
    const occupied = Math.min(patients.length, ROOM_CAPACITY)
    const available = Math.max(ROOM_CAPACITY - occupied, 0)
    return [
      { name: 'Occupied', value: occupied },
      { name: 'Available', value: available },
    ]
  }, [patients])

  const staffData = useMemo(() => {
    const counts = doctors.reduce((acc, doctor) => {
      const department = doctor.department || 'Unassigned'
      acc[department] = (acc[department] || 0) + 1
      return acc
    }, {})

    return Object.entries(counts)
      .map(([department, staff]) => ({ department, staff }))
      .sort((a, b) => b.staff - a.staff)
      .slice(0, 6)
  }, [doctors])

  const patientData = useMemo(() => {
    const now = new Date()
    const buckets = []

    for (let i = 5; i >= 0; i -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${date.getFullYear()}-${date.getMonth()}`
      buckets.push({
        key,
        month: date.toLocaleString('en-US', { month: 'short' }),
        patients: 0,
      })
    }

    const indexByKey = buckets.reduce((acc, item, index) => {
      acc[item.key] = index
      return acc
    }, {})

    patients.forEach((patient) => {
      const date = parseDate(patient.created_at)
      if (!date) return
      const key = `${date.getFullYear()}-${date.getMonth()}`
      const index = indexByKey[key]
      if (index !== undefined) {
        buckets[index].patients += 1
      }
    })

    return buckets
  }, [patients])

  const appointmentData = useMemo(() => {
    const now = new Date()
    const days = []

    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date(now)
      date.setDate(now.getDate() - i)
      const dayIndex = date.getDay()
      const label = CHART_DAYS[(dayIndex + 6) % 7]
      days.push({
        key: date.toDateString(),
        day: label,
        booked: 0,
        completed: 0,
      })
    }

    const indexByKey = days.reduce((acc, item, index) => {
      acc[item.key] = index
      return acc
    }, {})

    cases.forEach((item) => {
      const date = parseDate(item.created_at || item.arrival_time)
      if (!date) return
      const key = date.toDateString()
      const index = indexByKey[key]
      if (index === undefined) return
      days[index].booked += 1
      if (item.status === 'Discharged') {
        days[index].completed += 1
      }
    })

    return days
  }, [cases])

  const emergencyData = useMemo(() => {
    const levels = ['Critical', 'Urgent', 'Stable']
    const counts = cases.reduce((acc, item) => {
      if (!item.severity) return acc
      acc[item.severity] = (acc[item.severity] || 0) + 1
      return acc
    }, {})

    return levels.map((level) => ({
      level,
      cases: counts[level] || 0,
    }))
  }, [cases])

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <TopBar
        navItems={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Charts', to: '/charts' },
        ]}
        activePath="/charts"
        isDark={isDark}
        onToggleTheme={() => setIsDark((value) => !value)}
        showNotifications
      />

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