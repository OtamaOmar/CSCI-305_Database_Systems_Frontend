import { Activity, Bed, Stethoscope, Users } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import TopBar from '../components/TopBar'
import { mockReports } from './hospitalData'

function StatCard({ icon: Icon, label, value, note }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
        <div className="rounded-2xl bg-brand/10 p-3 text-brand">
          <Icon size={24} />
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{note}</p>
    </div>
  )
}

export default function ReportsDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <TopBar activePath="/reports-dashboard" showNotifications showUserMenu />

      <main className="mx-auto max-w-7xl px-5 py-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
          Hospital Operations
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
          Reports Dashboard
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Database reports page for aggregation, grouping, joins, workload analysis, ICU usage,
          emergency statistics, appointments, and room allocation.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <StatCard icon={Users} label="Patients / Department" value="107" note="Grouped by department" />
          <StatCard icon={Stethoscope} label="Doctor Workload" value="43" note="Appointments per doctor" />
          <StatCard icon={Bed} label="Room Allocation" value="22" note="Free, occupied, reserved" />
          <StatCard icon={Activity} label="Emergency Cases" value="124" note="Cases by severity and day" />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 font-bold text-slate-900 dark:text-white">Patients Per Department</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockReports.patientsPerDepartment}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="patients" fill="#0f766e" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 font-bold text-slate-900 dark:text-white">Doctor Workload</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockReports.doctorWorkload}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="appointments" fill="#7c3aed" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 font-bold text-slate-900 dark:text-white">ICU Usage</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={mockReports.icuUsage} dataKey="value" nameKey="name" outerRadius={95} label>
                    {mockReports.icuUsage.map((entry, index) => (
                      <Cell key={entry.name} fill={['#dc2626', '#16a34a', '#f59e0b'][index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 font-bold text-slate-900 dark:text-white">Emergency Cases Trend</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockReports.emergencyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="cases" stroke="#0f766e" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}