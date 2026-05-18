import { Pencil, ShieldCheck, UserMinus, UserCog, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import TopBar from '../components/TopBar'
import useAlert from '../hooks/useAlert'
import { getStatusClass } from './hospitalData'
import { createInvitation, getInvitations, getRoles, getUsers, revokeInvitation } from './hospitalApi'
import { apiFetch, getUser } from '../lib/api'
import { hasPermission } from '../lib/rbac'

function Badge({ value }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(value)}`}>
      {value}
    </span>
  )
}

export default function AdminPanelPage() {
  const { notify, confirm } = useAlert()
  const currentUser = useMemo(() => getUser(), [])
  const canManage = useMemo(() => hasPermission(currentUser, 'users:manage'), [currentUser])

  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [invitations, setInvitations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingUser, setEditingUser] = useState(null)
  const [editRole, setEditRole] = useState('')

  async function loadData() {
    setIsLoading(true)
    try {
      const [usersData, rolesData, invitationsData] = await Promise.all([
        getUsers(),
        getRoles(),
        getInvitations(),
      ])
      setUsers(Array.isArray(usersData) ? usersData : [])
      setRoles(Array.isArray(rolesData) ? rolesData : [])
      setInvitations(Array.isArray(invitationsData) ? invitationsData : [])
    } catch (err) {
      notify({ tone: 'error', message: err.message })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!canManage) return
    loadData()
  }, [canManage])

  async function handleInvite(event) {
    event.preventDefault()
    const data = new FormData(event.target)
    const email = String(data.get('email') || '').trim()
    const role = String(data.get('role') || '').trim()

    try {
      const result = await createInvitation({ email, role })
      notify({
        tone: 'success',
        message: 'Invite created and emailed.',
      })
      event.target.reset()
      await loadData()
    } catch (err) {
      notify({ tone: 'error', message: err.message })
    }
  }

  async function handleRevoke(invite) {
    const ok = await confirm({
      title: 'Revoke invitation?',
      message: `Revoke invitation for ${invite.email}?`,
      tone: 'warning',
      confirmText: 'Revoke',
      cancelText: 'Cancel',
    })
    if (!ok) return

    try {
      await revokeInvitation(invite.id)
      await loadData()
    } catch (err) {
      notify({ tone: 'error', message: err.message })
    }
  }

  function openEditRole(user) {
    setEditRole(user.role)
    setEditingUser(user)
  }

  async function handleChangeRole(event) {
    event.preventDefault()
    try {
      await apiFetch(`/api/users/${editingUser.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ role: editRole }),
      })
      notify({ tone: 'success', message: `Role updated to "${editRole}".` })
      setEditingUser(null)
      await loadData()
    } catch (err) {
      notify({ tone: 'error', message: err.message })
    }
  }

  async function handleDeactivate(user) {
    const ok = await confirm({
      title: 'Deactivate account?',
      message: `Deactivate ${[user.first_name, user.last_name].filter(Boolean).join(' ') || user.email}? They will no longer be able to log in.`,
      tone: 'warning',
      confirmText: 'Deactivate',
      cancelText: 'Cancel',
    })
    if (!ok) return

    try {
      await apiFetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: 0 }),
      })
      notify({ tone: 'success', message: 'Account deactivated.' })
      await loadData()
    } catch (err) {
      notify({ tone: 'error', message: err.message })
    }
  }

  if (!canManage) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <TopBar activePath="/admin-panel" showNotifications showUserMenu />
        <main className="mx-auto max-w-4xl px-5 py-10">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Access denied</h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              You don&apos;t have permission to access the Admin module.
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <TopBar activePath="/admin-panel" showNotifications showUserMenu />

      <main className="mx-auto max-w-7xl px-5 py-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
          Admin & System
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
          Admin Dashboard, Users Management & Roles
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Covers system-wide statistics, users management, admin roles, permissions, and access
          control frontend.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">System Users</p>
                <p className="mt-2 text-3xl font-bold dark:text-white">{users.length}</p>
              </div>
              <Users className="text-brand" size={28} />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Roles</p>
                <p className="mt-2 text-3xl font-bold dark:text-white">{roles.length}</p>
              </div>
              <ShieldCheck className="text-brand" size={28} />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Active Accounts</p>
                <p className="mt-2 text-3xl font-bold dark:text-white">
                  {users.filter((user) => user.is_active).length}
                </p>
              </div>
              <UserCog className="text-brand" size={28} />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <h2 className="font-bold text-slate-900 dark:text-white">
                Users Management
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase text-slate-500 dark:bg-slate-800">
                  <tr>
                    <th className="px-5 py-3">User ID</th>
                    <th className="px-5 py-3">Name</th>
                    <th className="px-5 py-3">Role</th>
                    <th className="px-5 py-3">Access</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>

                <tbody>
                  {isLoading && (
                    <tr className="border-t border-slate-100 dark:border-slate-800">
                      <td colSpan={6} className="px-5 py-6 text-sm text-slate-500 dark:text-slate-400">
                        Loading users…
                      </td>
                    </tr>
                  )}

                  {users.map((user) => {
                    const isOwner = user.role === 'owner'
                    return (
                      <tr
                        key={user.id}
                        className="border-t border-slate-100 dark:border-slate-800 dark:text-slate-200"
                      >
                        <td className="px-5 py-4 font-semibold">{user.id}</td>
                        <td className="px-5 py-4">{[user.first_name, user.last_name].filter(Boolean).join(' ') || user.email}</td>
                        <td className="px-5 py-4">{user.role}</td>
                        <td className="px-5 py-4">Hospital scoped</td>
                        <td className="px-5 py-4">
                          <Badge value={user.is_active ? 'Active' : 'Disabled'} />
                        </td>
                        <td className="px-5 py-4">
                          {!isOwner && (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openEditRole(user)}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit role
                              </button>
                              {user.is_active ? (
                                <button
                                  type="button"
                                  onClick={() => handleDeactivate(user)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/35 dark:text-red-400 dark:hover:bg-red-950/60"
                                >
                                  <UserMinus className="h-3.5 w-3.5" />
                                  Deactivate
                                </button>
                              ) : (
                                <span className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-400 dark:border-slate-700">
                                  Inactive
                                </span>
                              )}
                            </div>
                          )}
                          {isOwner && (
                            <span className="text-xs text-slate-400 dark:text-slate-500">Owner</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
              <ShieldCheck size={22} />
              Roles & Permissions
            </h2>

            <div className="space-y-4">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
                >
                  <p className="font-bold text-slate-900 dark:text-white">{role.role_name}</p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {role.description || '—'}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <h2 className="font-bold text-slate-900 dark:text-white">
                Invitations
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Invite users by email. Users can only register using an invitation token.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase text-slate-500 dark:bg-slate-800">
                  <tr>
                    <th className="px-5 py-3">Email</th>
                    <th className="px-5 py-3">Role</th>
                    <th className="px-5 py-3">Expires</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {invitations.map((invite) => {
                    const status = invite.revoked_at
                      ? 'Revoked'
                      : invite.used_at
                        ? 'Used'
                        : 'Active'
                    return (
                      <tr
                        key={invite.id}
                        className="border-t border-slate-100 dark:border-slate-800 dark:text-slate-200"
                      >
                        <td className="px-5 py-4 font-semibold">{invite.email}</td>
                        <td className="px-5 py-4">{invite.role}</td>
                        <td className="px-5 py-4">{invite.expires_at}</td>
                        <td className="px-5 py-4">
                          <Badge value={status} />
                        </td>
                        <td className="px-5 py-4 text-right">
                          {!invite.used_at && !invite.revoked_at && (
                            <button
                              type="button"
                              onClick={() => handleRevoke(invite)}
                              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                              Revoke
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}

                  {!isLoading && invitations.length === 0 && (
                    <tr className="border-t border-slate-100 dark:border-slate-800">
                      <td colSpan={5} className="px-5 py-6 text-sm text-slate-500 dark:text-slate-400">
                        No invitations yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 font-bold text-slate-900 dark:text-white">Invite User</h2>

            <form onSubmit={handleInvite} className="space-y-4">
              <input
                name="email"
                type="email"
                required
                placeholder="user@hospital.org"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />

              <select
                name="role"
                required
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="admin">Admin</option>
              </select>

              <button className="w-full rounded-2xl bg-brand px-5 py-3 font-semibold text-white">
                Create invitation
              </button>
            </form>
          </section>
        </div>
      </main>

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm dark:bg-slate-950/70">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Edit role</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {[editingUser.first_name, editingUser.last_name].filter(Boolean).join(' ') || editingUser.email}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleChangeRole}>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Role</span>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <option value="admin">Admin</option>
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                </select>
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand/90"
                >
                  Save role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
