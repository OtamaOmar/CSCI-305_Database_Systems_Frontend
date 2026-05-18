import { useEffect, useState } from 'react'
import TopBar from '../components/TopBar'
import { AlertTriangle, Bell, CheckCircle2, Clock, Info, ShieldCheck, Siren } from 'lucide-react'
import useAlert from '../hooks/useAlert'
import { apiFetch } from '../lib/api'

const iconMap = { CheckCircle2, ShieldCheck, Info }

const alertToneClass = {
  Critical: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300',
  Warning: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300',
  Info: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300',
}

function Notifications() {
  const { notify } = useAlert()
  const [emergencyAlerts, setEmergencyAlerts] = useState([])
  const [systemNotifications, setSystemNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false

    return (
      document.documentElement.classList.contains('dark')
      || window.matchMedia('(prefers-color-scheme: dark)').matches
    )
  })

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      setIsLoading(true)
      try {
        const data = await apiFetch('/api/notifications')
        if (!isMounted) return

        setEmergencyAlerts((data || []).filter((item) => item.type === 'emergency'))
        setSystemNotifications(
          (data || [])
            .filter((item) => item.type !== 'emergency')
            .map((item) => ({ ...item, icon: iconMap[item.icon] ?? Info }))
        )
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
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <TopBar
        navItems={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Charts', to: '/charts' },
          { label: 'Notifications', to: '/notifications' },
        ]}
        activePath="/notifications"
        isDark={isDark}
        onToggleTheme={() => setIsDark((value) => !value)}
        showNotifications
        notificationsAsLink
        showUserMenu
      />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            <Bell className="h-3.5 w-3.5" />
            Notifications
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Emergency alerts</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Critical updates and system notifications for the emergency department.
          </p>
        </div>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Emergency alerts</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Live alerts from triage and ICU.</p>
            </div>
            <ul>
              {isLoading && (
                <li className="px-5 py-6 text-sm text-slate-500 dark:text-slate-400">
                  Loading alerts…
                </li>
              )}
              {emergencyAlerts.map((alert) => (
                <li
                  key={alert.id}
                  className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4 last:border-b-0 dark:border-slate-700"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{alert.title}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{alert.message}</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <Clock className="h-3.5 w-3.5" /> {alert.time}
                    </span>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${alertToneClass[alert.level]}`}
                  >
                    <Siren className="h-3.5 w-3.5" />
                    {alert.level}
                  </span>
                </li>
              ))}
              {!isLoading && emergencyAlerts.length === 0 && (
                <li className="px-5 py-6 text-sm text-slate-500 dark:text-slate-400">
                  No emergency alerts.
                </li>
              )}
            </ul>
          </article>

          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">System notifications</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Operational updates and reminders.</p>
            </div>
            <ul>
              {isLoading && (
                <li className="px-5 py-6 text-sm text-slate-500 dark:text-slate-400">
                  Loading notifications…
                </li>
              )}
              {systemNotifications.map((item) => {
                const Icon = item.icon

                return (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 border-b border-slate-200 px-5 py-4 last:border-b-0 dark:border-slate-700"
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.message}</p>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <Clock className="h-3.5 w-3.5" /> {item.time}
                      </span>
                    </div>
                  </li>
                )
              })}
              {!isLoading && systemNotifications.length === 0 && (
                <li className="px-5 py-6 text-sm text-slate-500 dark:text-slate-400">
                  No system notifications.
                </li>
              )}
            </ul>
          </article>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <AlertTriangle className="h-4 w-4 text-brand" />
            Notifications are updated every 60 seconds and prioritized by severity.
          </div>
        </section>
      </main>
    </div>
  )
}

export default Notifications
