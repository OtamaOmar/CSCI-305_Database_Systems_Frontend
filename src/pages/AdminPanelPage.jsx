import { ShieldCheck, Users, UserCog } from 'lucide-react'
import TopBar from '../components/TopBar'
import { getStatusClass, mockRoles, mockUsers } from './hospitalData'

function Badge({ value }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(value)}`}>
      {value}
    </span>
  )
}

export default function AdminPanelPage() {
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
                <p className="mt-2 text-3xl font-bold dark:text-white">{mockUsers.length}</p>
              </div>
              <Users className="text-brand" size={28} />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Roles</p>
                <p className="mt-2 text-3xl font-bold dark:text-white">{mockRoles.length}</p>
              </div>
              <ShieldCheck className="text-brand" size={28} />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Active Accounts</p>
                <p className="mt-2 text-3xl font-bold dark:text-white">
                  {mockUsers.filter((user) => user.status === 'Active').length}
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
                  </tr>
                </thead>

                <tbody>
                  {mockUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-t border-slate-100 dark:border-slate-800 dark:text-slate-200"
                    >
                      <td className="px-5 py-4 font-semibold">{user.id}</td>
                      <td className="px-5 py-4">{user.name}</td>
                      <td className="px-5 py-4">{user.role}</td>
                      <td className="px-5 py-4">{user.access}</td>
                      <td className="px-5 py-4">
                        <Badge value={user.status} />
                      </td>
                    </tr>
                  ))}
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
              {mockRoles.map((role) => (
                <div
                  key={role.role}
                  className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
                >
                  <p className="font-bold text-slate-900 dark:text-white">{role.role}</p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {role.permissions}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}