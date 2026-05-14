import { Hospital, Users } from 'lucide-react'
import TopBar from '../components/TopBar'
import { mockDepartments } from './hospitalData'

export default function DepartmentsPage() {
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
          {mockDepartments.map((department) => (
            <div
              key={department.code}
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
                  Chairman Doctor: {department.chairman}
                </p>

                <p className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800 dark:text-slate-200">
                  Location: {department.location}
                </p>

                <div className="grid gap-3 md:grid-cols-2">
                  <p className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800 dark:text-slate-200">
                    Staff: {department.staff}
                  </p>

                  <p className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800 dark:text-slate-200">
                    Patients: {department.patients}
                  </p>
                </div>
              </div>
            </div>
          ))}
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
                {mockDepartments.map((department) => (
                  <tr
                    key={department.code}
                    className="border-t border-slate-100 dark:border-slate-800 dark:text-slate-200"
                  >
                    <td className="px-5 py-4 font-semibold">{department.code}</td>
                    <td className="px-5 py-4">{department.name}</td>
                    <td className="px-5 py-4">{department.chairman}</td>
                    <td className="px-5 py-4">{department.location}</td>
                    <td className="px-5 py-4">{department.staff}</td>
                    <td className="px-5 py-4">{department.patients}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}