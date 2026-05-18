import { useEffect, useState } from 'react'
import TopBar from '../components/TopBar'
import useAlert from '../hooks/useAlert'
import { apiFetch } from '../lib/api'
import { Lock, Mail, User } from 'lucide-react'

function Profile() {
  const { notify } = useAlert()
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false

    return (
      document.documentElement.classList.contains('dark')
      || window.matchMedia('(prefers-color-scheme: dark)').matches
    )
  })
  const [isSaving, setIsSaving] = useState(false)
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
  const usernameValue = currentUser?.email ? currentUser.email.split('@')[0] : ''

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  async function handleSubmit(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const fullName = (data.get('fullName') || '').trim()
    const spaceIdx = fullName.indexOf(' ')
    const first_name = spaceIdx === -1 ? fullName : fullName.slice(0, spaceIdx)
    const last_name = spaceIdx === -1 ? '' : fullName.slice(spaceIdx + 1)

    setIsSaving(true)
    try {
      await apiFetch(`/api/users/${currentUser?.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ first_name, last_name }),
      })
      notify({ tone: 'success', message: 'Profile updated successfully.' })
    } catch (err) {
      notify({ tone: 'error', title: 'Save failed', message: err.message || 'Could not update profile.' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <TopBar
        navItems={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Profile', to: '/profile' },
        ]}
        activePath="/profile"
        isDark={isDark}
        onToggleTheme={() => setIsDark((value) => !value)}
        showNotifications
        notificationsAsLink
        showUserMenu
      />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            <User className="h-3.5 w-3.5" />
            Profile
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">User personal information</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Update your personal information and account settings.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Personal information</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Full name</span>
                <input
                  type="text"
                  name="fullName"
                  defaultValue={displayName}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Title</span>
                <input
                  type="text"
                  defaultValue={roleLabel}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Department</span>
                <input
                  type="text"
                  defaultValue={departmentLabel}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone number</span>
                <input
                  type="tel"
                  defaultValue=""
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-brand" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Contact details</h2>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Work email</span>
                <input
                  type="email"
                  defaultValue={currentUser?.email || ''}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Emergency contact</span>
                <input
                  type="text"
                  defaultValue=""
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-brand" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Account settings</h2>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Username</span>
                <input
                  type="text"
                  defaultValue={usernameValue}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</span>
                <input
                  type="password"
                  defaultValue="********"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
              </label>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Two-factor auth</span>
                <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <option>Enabled</option>
                  <option>Disabled</option>
                </select>
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Account status</span>
                <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <option>Active</option>
                  <option>On leave</option>
                  <option>Suspended</option>
                </select>
              </label>
            </div>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand/90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving…' : 'Save profile'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default Profile
