import { Hospital, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import TopBar from '../components/TopBar'
import useAlert from '../hooks/useAlert'
import { getDepartments } from './hospitalApi'

export default function DepartmentsPage() {
  const { notify } = useAlert()
  const [departments, setDepartments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      setIsLoading(true)
      try {
        const data = await getDepartments()
        if (!isMounted) return
        setDepartments(Array.isArray(data) ? data : [])
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <TopBar activePath="/departments-page" showNotifications showUserMenu />

      <main className="mx-auto max-w-7xl px-5 py-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
          Departments
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
          Departments List & Details
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Covers all departments, department codes, chairman doctor, locations, staff,
          patient statistics, and relational department analysis.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {isLoading && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:col-span-3">
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading departments…</p>
            </div>
          )}

          {departments.map((department) => (
            <div
              key={department.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-2xl bg-brand/10 p-3 text-brand">
                  <Hospital size={24} />
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {department.code}
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {department.name}
              </h2>

              <div className="mt-4 space-y-3 text-sm">
                <p className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800 dark:text-slate-200">
                  Chairman Doctor: {department.chairman || 'Unassigned'}
                </p>

                <p className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800 dark:text-slate-200">
                  Location: {department.location}
                </p>

                <div className="grid gap-3 md:grid-cols-2">
                  <p className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800 dark:text-slate-200">
                    Staff: {department.staff_count ?? 0}
                  </p>

                  <p className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800 dark:text-slate-200">
                    Patients: {department.patient_count ?? 0}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {!isLoading && departments.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:col-span-3">
              <p className="text-sm text-slate-500 dark:text-slate-400">No departments yet.</p>
            </div>
          )}
        </div>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <Users size={22} />
            Department Statistics
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase text-slate-500 dark:bg-slate-800">
                <tr>
                  <th className="px-5 py-3">Department Code</th>
                  <th className="px-5 py-3">Department Name</th>
                  <th className="px-5 py-3">Chairman</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Staff</th>
                  <th className="px-5 py-3">Patients</th>
                </tr>
              </thead>

              <tbody>
                {departments.map((department) => (
                  <tr
                    key={department.id}
                    className="border-t border-slate-100 dark:border-slate-800 dark:text-slate-200"
                  >
                    <td className="px-5 py-4 font-semibold">{department.code}</td>
                    <td className="px-5 py-4">{department.name}</td>
                    <td className="px-5 py-4">{department.chairman || 'Unassigned'}</td>
                    <td className="px-5 py-4">{department.location}</td>
                    <td className="px-5 py-4">{department.staff_count ?? 0}</td>
                    <td className="px-5 py-4">{department.patient_count ?? 0}</td>
                  </tr>
                ))}

                {!isLoading && departments.length === 0 && (
                  <tr className="border-t border-slate-100 dark:border-slate-800">
                    <td colSpan={6} className="px-5 py-6 text-sm text-slate-500 dark:text-slate-400">
                      No departments to show.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
