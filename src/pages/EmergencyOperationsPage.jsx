import { Activity, Ambulance, ClipboardList } from 'lucide-react'
import TopBar from '../components/TopBar'
import { getStatusClass, mockAmbulances, mockTriageCases } from './hospitalData'

function Badge({ value }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(value)}`}>
      {value}
    </span>
  )
}

export default function EmergencyOperationsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <TopBar activePath="/emergency-operations" showNotifications showUserMenu />

      <main className="mx-auto max-w-7xl px-5 py-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
          Emergency Operations
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
          Ambulance Tracking & Triage Management
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Covers incoming ambulance tracking, emergency case details, triage severity,
          patient prioritization, and live emergency queue.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Incoming Ambulances</p>
                <p className="mt-2 text-3xl font-bold dark:text-white">{mockAmbulances.length}</p>
              </div>
              <Ambulance className="text-brand" size={28} />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Triage Cases</p>
                <p className="mt-2 text-3xl font-bold dark:text-white">{mockTriageCases.length}</p>
              </div>
              <ClipboardList className="text-brand" size={28} />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Critical Priority</p>
                <p className="mt-2 text-3xl font-bold dark:text-white">
                  {mockTriageCases.filter((item) => item.severity === 'Critical').length}
                </p>
              </div>
              <Activity className="text-brand" size={28} />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
              <Ambulance size={22} />
              Incoming Ambulance Page
            </h2>

            <div className="space-y-4">
              {mockAmbulances.map((ambulance) => (
                <div
                  key={ambulance.id}
                  className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {ambulance.id} - {ambulance.patient}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Location: {ambulance.location}
                      </p>
                    </div>

                    <Badge value={ambulance.severity} />
                  </div>

                  <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
                    <p className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800 dark:text-slate-200">
                      ETA: {ambulance.eta}
                    </p>
                    <p className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800 dark:text-slate-200">
                      Status: {ambulance.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
              <ClipboardList size={22} />
              Triage Management Page
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase text-slate-500 dark:bg-slate-800">
                  <tr>
                    <th className="px-4 py-3">Queue</th>
                    <th className="px-4 py-3">Patient</th>
                    <th className="px-4 py-3">Severity</th>
                    <th className="px-4 py-3">Symptoms</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Nurse</th>
                  </tr>
                </thead>

                <tbody>
                  {mockTriageCases.map((item) => (
                    <tr
                      key={item.queue}
                      className="border-t border-slate-100 dark:border-slate-800 dark:text-slate-200"
                    >
                      <td className="px-4 py-3 font-semibold">{item.queue}</td>
                      <td className="px-4 py-3">{item.patient}</td>
                      <td className="px-4 py-3">
                        <Badge value={item.severity} />
                      </td>
                      <td className="px-4 py-3">{item.symptoms}</td>
                      <td className="px-4 py-3">#{item.priority}</td>
                      <td className="px-4 py-3">{item.nurse}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}