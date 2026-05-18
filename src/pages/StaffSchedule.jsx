import { useEffect, useMemo, useState } from 'react'
import TopBar from '../components/TopBar'
import { CalendarDays, Clock, Users } from 'lucide-react'
import useAlert from '../hooks/useAlert'
import { apiFetch } from '../lib/api'

const shiftMeta = {
  Morning: { label: 'Morning shift', tone: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  Evening: { label: 'Evening shift', tone: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  Night: { label: 'Night shift', tone: 'bg-slate-500/10 text-slate-600 dark:text-slate-400' },
}

const statusStyles = {
  'On duty': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  'On call': 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Available: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  'Off duty': 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
}

function StaffSchedule() {
  const { notify } = useAlert()
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

  const [schedules, setSchedules] = useState([])
  const [doctors, setDoctors] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      setIsLoading(true)
      try {
        const [scheduleData, doctorData] = await Promise.all([
          apiFetch('/api/staff-schedule'),
          apiFetch('/api/doctors'),
        ])
        if (!isMounted) return
        setSchedules(Array.isArray(scheduleData) ? scheduleData : [])
        setDoctors(Array.isArray(doctorData) ? doctorData : [])
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

  const weeklySchedule = useMemo(() => {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const byDayShift = new Map()

    schedules.forEach((row) => {
      const date = new Date(row.date)
      const day = Number.isNaN(date.getTime()) ? '—' : weekdays[date.getDay()]
      const key = `${day}:${row.shift}`
      byDayShift.set(key, (byDayShift.get(key) || 0) + 1)
    })

    return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => ({
      day,
      morning: `${byDayShift.get(`${day}:Morning`) || 0} scheduled`,
      evening: `${byDayShift.get(`${day}:Evening`) || 0} scheduled`,
      night: `${byDayShift.get(`${day}:Night`) || 0} scheduled`,
    }))
  }, [schedules])

  const shiftSummary = useMemo(() => {
    const today = new Date()
    const todayKey = today.toISOString().slice(0, 10)
    const todaysSchedules = schedules.filter((row) => row.date === todayKey)

    const countForShift = (shift) => todaysSchedules.filter((row) => row.shift === shift).length

    return ['Morning', 'Evening', 'Night'].map((shift) => ({
      label: shiftMeta[shift].label,
      time: shift === 'Morning' ? '07:00 - 15:00' : shift === 'Evening' ? '15:00 - 23:00' : '23:00 - 07:00',
      onDuty: countForShift(shift),
      note: 'Based on schedules',
      tone: shiftMeta[shift].tone,
    }))
  }, [schedules])

  const availabilityRows = useMemo(() => {
    const nowLabel = 'This week'
    return doctors.slice(0, 8).map((doctor) => ({
      name: doctor.name,
      role: doctor.specialty || doctor.department || 'Doctor',
      status: doctor.status || 'Available',
      nextShift: nowLabel,
    }))
  }, [doctors])

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <TopBar
        navItems={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Patients', to: '/patient' },
          { label: 'Doctors', to: '/doctors' },
          { label: 'Emergency', to: '/emergency' },
          { label: 'Staff', to: '/staff' },
        ]}
        activePath="/staff"
        isDark={isDark}
        onToggleTheme={() => setIsDark((value) => !value)}
        showNotifications
      />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            <CalendarDays className="h-3.5 w-3.5" />
            Staff schedule
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Weekly staffing overview</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Track shifts, weekly assignments, and doctor availability across the emergency department.
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          {shiftSummary.map((shift) => (
            <article
              key={shift.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{shift.label}</p>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${shift.tone}`}>{shift.onDuty} on duty</span>
              </div>
              <p className="mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Clock className="h-4 w-4" /> {shift.time}
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{shift.note}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
          <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Weekly schedule</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Shift assignments for each day.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase tracking-widest text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3">Day</th>
                  <th className="px-5 py-3">Morning</th>
                  <th className="px-5 py-3">Evening</th>
                  <th className="px-5 py-3">Night</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr className="border-t border-slate-200 dark:border-slate-700">
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-400" colSpan={4}>
                      Loading schedule…
                    </td>
                  </tr>
                )}
                {weeklySchedule.map((row) => (
                  <tr key={row.day} className="border-t border-slate-200 dark:border-slate-700">
                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-slate-100">{row.day}</td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{row.morning}</td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{row.evening}</td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{row.night}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Doctor availability
            </h2>
            <span className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Users className="h-3.5 w-3.5" /> Updated 5 min ago
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {availabilityRows.map((row) => (
              <article
                key={row.name}
                className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{row.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{row.role}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[row.status]}`}>
                    {row.status}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Next shift: {row.nextShift}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default StaffSchedule
