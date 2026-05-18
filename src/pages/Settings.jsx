import { useEffect, useState } from 'react'
import TopBar from '../components/TopBar'
import useAlert from '../hooks/useAlert'
import { Cog, User } from 'lucide-react'

function Settings() {
  const { notify } = useAlert()
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false

    return (
      document.documentElement.classList.contains('dark')
      || window.matchMedia('(prefers-color-scheme: dark)').matches
    )
  })
  const [currentUser] = useState(() => {
    if (typeof window === 'undefined') return null

    try {
      const storedUser = localStorage.getItem('user')
      return storedUser ? JSON.parse(storedUser) : null
    } catch {
      return null
    }
  })

  const displayName = currentUser
    ? [currentUser.first_name, currentUser.last_name].filter(Boolean).join(' ') || currentUser.email
    : ''
  const roleLabelMap = {
    admin: 'Administrator',
    doctor: 'Doctor',
    nurse: 'Nurse',
    staff: 'Staff',
  }
  const roleLabel = currentUser?.role ? roleLabelMap[currentUser.role] || currentUser.role : ''
  const departmentLabel = currentUser?.hospital || ''

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  function handleSubmit(event) {
    event.preventDefault()
    notify({ tone: 'success', message: 'Settings saved successfully.' })
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <TopBar
        navItems={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Settings', to: '/settings' },
        ]}
        activePath="/settings"
        isDark={isDark}
        onToggleTheme={() => setIsDark((value) => !value)}
        showNotifications
        notificationsAsLink
        showUserMenu
      />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            <Cog className="h-3.5 w-3.5" />
            Settings
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Profile settings</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Update user preferences, notification choices, and system defaults.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-brand" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">User preferences</h2>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Full name</span>
                <input
                  type="text"
                  defaultValue={displayName}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Work email</span>
                <input
                  type="email"
                  defaultValue={currentUser?.email || ''}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Role</span>
                <select
                  defaultValue={roleLabel || undefined}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  {roleLabel && !['Administrator', 'Doctor', 'Nurse', 'Staff'].includes(roleLabel) && (
                    <option>{roleLabel}</option>
                  )}
                  <option>Staff</option>
                  <option>Doctor</option>
                  <option>Nurse</option>
                  <option>Administrator</option>
                </select>
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Department</span>
                <select
                  defaultValue={departmentLabel || undefined}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  {departmentLabel && !['Emergency', 'ICU', 'Surgery', 'Pediatrics'].includes(departmentLabel) && (
                    <option>{departmentLabel}</option>
                  )}
                  <option>Emergency</option>
                  <option>ICU</option>
                  <option>Surgery</option>
                  <option>Pediatrics</option>
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">System preferences</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Language</span>
                <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>Arabic</option>
                </select>
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Time zone</span>
                <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <option>UTC-05:00 (EST)</option>
                  <option>UTC+01:00 (CET)</option>
                  <option>UTC+03:00 (AST)</option>
                </select>
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Default theme</span>
                <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <option>System</option>
                  <option>Light</option>
                  <option>Dark</option>
                </select>
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Data refresh</span>
                <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <option>Every 1 minute</option>
                  <option>Every 5 minutes</option>
                  <option>Manual</option>
                </select>
              </label>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-brand" />
                Send emergency alerts to email
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-brand" />
                Push system notifications to mobile
              </label>
            </div>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand/90"
            >
              Save settings
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default Settings
