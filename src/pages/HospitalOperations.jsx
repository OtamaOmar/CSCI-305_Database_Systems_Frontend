import { useEffect, useMemo, useState } from 'react'
import TopBar from '../components/TopBar'
import {
  Activity,
  Ambulance,
  Bed,
  CalendarDays,
  ClipboardList,
  FileUp,
  Hospital,
  MapPin,
  Pill,
  Search,
  ShieldCheck,
  Stethoscope,
  Users,
} from 'lucide-react'
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

const tabs = [
  'Appointments',
  'Emergency',
  'Rooms',
  'Prescriptions',
  'Medical Files',
  'Departments',
  'Locations',
  'Reports',
  'Admin',
]

const appointments = [
  {
    id: 'APT-1001',
    patient: 'Omar Hassan',
    doctor: 'Dr. Mona Adel',
    department: 'Emergency',
    date: '2026-05-16',
    time: '10:30 AM',
    status: 'Confirmed',
    payment: 'Paid',
    refund: 'Not requested',
  },
  {
    id: 'APT-1002',
    patient: 'Sara Ali',
    doctor: 'Dr. Karim Samir',
    department: 'Internal Medicine',
    date: '2026-05-16',
    time: '12:00 PM',
    status: 'Pending',
    payment: 'Unpaid',
    refund: 'Not requested',
  },
  {
    id: 'APT-1003',
    patient: 'Ahmed Tarek',
    doctor: 'Dr. Nada Youssef',
    department: 'Surgery',
    date: '2026-05-17',
    time: '03:15 PM',
    status: 'Cancelled',
    payment: 'Paid',
    refund: 'Processing',
  },
]

const ambulances = [
  {
    id: 'AMB-01',
    patient: 'Unknown Case',
    location: 'Nasr City',
    eta: '7 min',
    severity: 'Critical',
    status: 'Incoming',
  },
  {
    id: 'AMB-04',
    patient: 'Mahmoud Fathy',
    location: 'Heliopolis',
    eta: '12 min',
    severity: 'Urgent',
    status: 'On route',
  },
  {
    id: 'AMB-07',
    patient: 'Nour Mohamed',
    location: 'Dokki',
    eta: '18 min',
    severity: 'Stable',
    status: 'Waiting',
  },
]

const triageCases = [
  {
    queue: 'Q-001',
    patient: 'Unknown Case',
    severity: 'Critical',
    symptoms: 'Chest pain, low oxygen',
    priority: 1,
    nurse: 'Nurse Salma',
  },
  {
    queue: 'Q-002',
    patient: 'Mahmoud Fathy',
    severity: 'Urgent',
    symptoms: 'Head injury',
    priority: 2,
    nurse: 'Nurse Yara',
  },
  {
    queue: 'Q-003',
    patient: 'Nour Mohamed',
    severity: 'Stable',
    symptoms: 'Fever and dizziness',
    priority: 3,
    nurse: 'Nurse Ali',
  },
]

const rooms = [
  {
    id: 'R-ICU-01',
    type: 'ICU',
    status: 'Occupied',
    patient: 'Omar Hassan',
    monitor: 'Ventilator active',
  },
  {
    id: 'R-ICU-02',
    type: 'ICU',
    status: 'Free',
    patient: 'None',
    monitor: 'Ready',
  },
  {
    id: 'OR-01',
    type: 'Operation Room',
    status: 'Reserved',
    patient: 'Ahmed Tarek',
    monitor: 'Surgery at 4:00 PM',
  },
  {
    id: 'TR-05',
    type: 'Treatment Room',
    status: 'Free',
    patient: 'None',
    monitor: 'Ready',
  },
]

const prescriptions = [
  {
    id: 'RX-501',
    patient: 'Sara Ali',
    doctor: 'Dr. Karim Samir',
    medication: 'Amoxicillin',
    dosage: '500mg',
    directions: 'Twice daily after meals',
    start: '2026-05-14',
    end: '2026-05-20',
  },
  {
    id: 'RX-502',
    patient: 'Omar Hassan',
    doctor: 'Dr. Mona Adel',
    medication: 'Paracetamol',
    dosage: '1g',
    directions: 'Every 8 hours if needed',
    start: '2026-05-14',
    end: '2026-05-17',
  },
]

const files = [
  {
    id: 'FILE-01',
    patient: 'Omar Hassan',
    type: 'X-Ray',
    name: 'chest_xray_omar.pdf',
    uploaded: '2026-05-14',
    size: '2.4 MB',
  },
  {
    id: 'FILE-02',
    patient: 'Sara Ali',
    type: 'Blood Report',
    name: 'blood_test_sara.pdf',
    uploaded: '2026-05-13',
    size: '800 KB',
  },
]

const departments = [
  {
    code: 'ER',
    name: 'Emergency Department',
    chairman: 'Dr. Mona Adel',
    location: 'Ground Floor',
    staff: 18,
    patients: 42,
  },
  {
    code: 'IM',
    name: 'Internal Medicine',
    chairman: 'Dr. Karim Samir',
    location: 'Floor 2',
    staff: 12,
    patients: 31,
  },
  {
    code: 'SUR',
    name: 'Surgery Department',
    chairman: 'Dr. Nada Youssef',
    location: 'Floor 3',
    staff: 15,
    patients: 20,
  },
]

const locations = [
  {
    name: 'Main Emergency Entrance',
    type: 'Emergency Gate',
    distance: '0.1 km',
    availability: 'Open 24/7',
  },
  {
    name: 'ICU Wing',
    type: 'Critical Care',
    distance: '0.3 km',
    availability: 'Limited beds',
  },
  {
    name: 'Operation Building',
    type: 'Surgery',
    distance: '0.4 km',
    availability: 'Available',
  },
]

const users = [
  {
    id: 'USR-01',
    name: 'Admin User',
    role: 'Admin',
    access: 'Full Access',
    status: 'Active',
  },
  {
    id: 'USR-02',
    name: 'Dr. Mona Adel',
    role: 'Doctor',
    access: 'Medical Records',
    status: 'Active',
  },
  {
    id: 'USR-03',
    name: 'Nurse Salma',
    role: 'Nurse',
    access: 'Triage + Rooms',
    status: 'Active',
  },
]

const departmentChart = [
  { name: 'Emergency', patients: 42 },
  { name: 'Internal Med', patients: 31 },
  { name: 'Surgery', patients: 20 },
  { name: 'ICU', patients: 14 },
]

const workloadChart = [
  { name: 'Dr. Mona', appointments: 16 },
  { name: 'Dr. Karim', appointments: 11 },
  { name: 'Dr. Nada', appointments: 9 },
  { name: 'Dr. Ali', appointments: 7 },
]

const icuChart = [
  { name: 'Occupied', value: 7 },
  { name: 'Free', value: 3 },
  { name: 'Reserved', value: 2 },
]

const emergencyTrend = [
  { day: 'Sun', cases: 18 },
  { day: 'Mon', cases: 25 },
  { day: 'Tue', cases: 22 },
  { day: 'Wed', cases: 31 },
  { day: 'Thu', cases: 28 },
]

function getBadgeClass(value) {
  const styles = {
    Critical: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300',
    Urgent: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
    Stable: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
    Confirmed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
    Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
    Cancelled: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300',
    Paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
    Unpaid: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300',
    Free: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
    Occupied: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300',
    Reserved: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
    Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
  }

  return styles[value] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
}

function Badge({ value }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getBadgeClass(value)}`}>
      {value}
    </span>
  )
}

function StatCard({ icon: Icon, label, value, note }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
        </div>
        <div className="rounded-2xl bg-brand/10 p-3 text-brand">
          <Icon size={24} />
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{note}</p>
    </div>
  )
}

function SectionTitle({ title, description }) {
  return (
    <div className="mb-5">
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        {title}
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  )
}

function HospitalOperations() {
  const [activeTab, setActiveTab] = useState('Appointments')
  const [appointmentSearch, setAppointmentSearch] = useState('')
  const [doctorFilter, setDoctorFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('')
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false
    return (
      document.documentElement.classList.contains('dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    )
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const search = appointmentSearch.toLowerCase()
      const matchesSearch =
        !search ||
        appointment.patient.toLowerCase().includes(search) ||
        appointment.doctor.toLowerCase().includes(search) ||
        appointment.id.toLowerCase().includes(search)

      const matchesDoctor = doctorFilter === 'All' || appointment.doctor === doctorFilter
      const matchesDate = !dateFilter || appointment.date === dateFilter

      return matchesSearch && matchesDoctor && matchesDate
    })
  }, [appointmentSearch, doctorFilter, dateFilter])

  const doctors = ['All', ...new Set(appointments.map((appointment) => appointment.doctor))]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <TopBar
        isDark={isDark}
        onToggleTheme={() => setIsDark((value) => !value)}
        showNotifications
        showUserMenu
      />

      <main className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
              Emergency Department Frontend
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
              Hospital Operations System
            </h1>
            <p className="mt-3 max-w-3xl text-slate-500 dark:text-slate-400">
              Frontend structure for appointments, ambulance tracking, triage, rooms,
              prescriptions, medical files, departments, reports, users, and roles.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">Frontend Mode</p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Mock Data Ready for API
            </p>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <StatCard icon={CalendarDays} label="Appointments" value="128" note="Today and upcoming" />
          <StatCard icon={Ambulance} label="Incoming Ambulances" value="3" note="Active emergency arrivals" />
          <StatCard icon={Bed} label="ICU Usage" value="70%" note="7 of 10 beds occupied" />
          <StatCard icon={Activity} label="Critical Cases" value="6" note="Need immediate attention" />
        </div>

        <div className="mb-8 overflow-x-auto rounded-3xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex min-w-max gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab
                    ? 'bg-brand text-white'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'Appointments' && (
          <section>
            <SectionTitle
              title="Appointments Module"
              description="Covers appointments list, filtering, booking, details, editing, cancellation, payment, and refund workflow."
            />

            <div className="mb-6 grid gap-4 lg:grid-cols-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Search appointment
                </label>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700">
                  <Search size={18} className="text-slate-400" />
                  <input
                    value={appointmentSearch}
                    onChange={(event) => setAppointmentSearch(event.target.value)}
                    placeholder="Search by patient, doctor, or appointment ID"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Doctor filter
                </label>
                <select
                  value={doctorFilter}
                  onChange={(event) => setDoctorFilter(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-900"
                >
                  {doctors.map((doctor) => (
                    <option key={doctor} value={doctor}>
                      {doctor}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Date filter
                </label>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(event) => setDateFilter(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-900"
                />
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">
                <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                  <h3 className="font-bold">Appointments List</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left text-sm">
                    <thead className="bg-slate-100 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      <tr>
                        <th className="px-5 py-3">ID</th>
                        <th className="px-5 py-3">Patient</th>
                        <th className="px-5 py-3">Doctor</th>
                        <th className="px-5 py-3">Date</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3">Payment</th>
                        <th className="px-5 py-3">Refund</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAppointments.map((appointment) => (
                        <tr key={appointment.id} className="border-t border-slate-100 dark:border-slate-800">
                          <td className="px-5 py-4 font-semibold">{appointment.id}</td>
                          <td className="px-5 py-4">{appointment.patient}</td>
                          <td className="px-5 py-4">{appointment.doctor}</td>
                          <td className="px-5 py-4">
                            {appointment.date} / {appointment.time}
                          </td>
                          <td className="px-5 py-4">
                            <Badge value={appointment.status} />
                          </td>
                          <td className="px-5 py-4">
                            <Badge value={appointment.payment} />
                          </td>
                          <td className="px-5 py-4">{appointment.refund}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-4 font-bold">Book / Edit Appointment</h3>
                <form className="space-y-3">
                  <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900" placeholder="Patient name" />
                  <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900">
                    <option>Select doctor</option>
                    <option>Dr. Mona Adel</option>
                    <option>Dr. Karim Samir</option>
                    <option>Dr. Nada Youssef</option>
                  </select>
                  <input type="date" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
                  <input type="time" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
                  <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900">
                    <option>Payment status</option>
                    <option>Paid</option>
                    <option>Unpaid</option>
                    <option>Refund Processing</option>
                  </select>
                  <button type="button" className="w-full rounded-2xl bg-brand px-4 py-3 font-semibold text-white">
                    Save Appointment
                  </button>
                  <button type="button" className="w-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                    Cancel / Request Refund
                  </button>
                </form>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'Emergency' && (
          <section>
            <SectionTitle
              title="Emergency Operations"
              description="Covers incoming ambulance tracking, triage management, patient prioritization, and live emergency queue mockup."
            />

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-4 flex items-center gap-2 font-bold">
                  <Ambulance size={20} /> Incoming Ambulances
                </h3>
                <div className="space-y-3">
                  {ambulances.map((ambulance) => (
                    <div key={ambulance.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-bold">{ambulance.id} - {ambulance.patient}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {ambulance.location} / ETA: {ambulance.eta}
                          </p>
                        </div>
                        <Badge value={ambulance.severity} />
                      </div>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Status: {ambulance.status}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-4 flex items-center gap-2 font-bold">
                  <ClipboardList size={20} /> Triage Management
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left text-sm">
                    <thead className="bg-slate-100 text-xs uppercase text-slate-500 dark:bg-slate-800">
                      <tr>
                        <th className="px-4 py-3">Queue</th>
                        <th className="px-4 py-3">Patient</th>
                        <th className="px-4 py-3">Severity</th>
                        <th className="px-4 py-3">Symptoms</th>
                        <th className="px-4 py-3">Priority</th>
                      </tr>
                    </thead>
                    <tbody>
                      {triageCases.map((item) => (
                        <tr key={item.queue} className="border-t border-slate-100 dark:border-slate-800">
                          <td className="px-4 py-3 font-semibold">{item.queue}</td>
                          <td className="px-4 py-3">{item.patient}</td>
                          <td className="px-4 py-3"><Badge value={item.severity} /></td>
                          <td className="px-4 py-3">{item.symptoms}</td>
                          <td className="px-4 py-3">#{item.priority}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'Rooms' && (
          <section>
            <SectionTitle
              title="Rooms Management"
              description="Covers ICU status, operation room availability, room reservation, assigned patient, and room details."
            />

            <div className="grid gap-4 md:grid-cols-4">
              {rooms.map((room) => (
                <div key={room.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-4 flex items-center justify-between">
                    <Bed className="text-brand" />
                    <Badge value={room.status} />
                  </div>
                  <h3 className="text-lg font-bold">{room.id}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{room.type}</p>
                  <div className="mt-4 space-y-1 text-sm">
                    <p><span className="font-semibold">Patient:</span> {room.patient}</p>
                    <p><span className="font-semibold">Info:</span> {room.monitor}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-4 font-bold">Room Reservation</h3>
              <div className="grid gap-4 md:grid-cols-4">
                <input className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900" placeholder="Patient name" />
                <select className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900">
                  <option>Select room type</option>
                  <option>ICU</option>
                  <option>Treatment Room</option>
                  <option>Operation Room</option>
                </select>
                <input type="date" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
                <button className="rounded-2xl bg-brand px-4 py-3 font-semibold text-white">
                  Reserve Room
                </button>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'Prescriptions' && (
          <section>
            <SectionTitle
              title="Prescriptions & Medications"
              description="Covers prescription list, patient prescriptions, medications, dosage, directions, dates, and doctor notes."
            />

            <div className="grid gap-6 xl:grid-cols-3">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">
                <table className="w-full min-w-[800px] text-left text-sm">
                  <thead className="bg-slate-100 text-xs uppercase text-slate-500 dark:bg-slate-800">
                    <tr>
                      <th className="px-5 py-3">ID</th>
                      <th className="px-5 py-3">Patient</th>
                      <th className="px-5 py-3">Doctor</th>
                      <th className="px-5 py-3">Medication</th>
                      <th className="px-5 py-3">Dosage</th>
                      <th className="px-5 py-3">Directions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptions.map((item) => (
                      <tr key={item.id} className="border-t border-slate-100 dark:border-slate-800">
                        <td className="px-5 py-4 font-semibold">{item.id}</td>
                        <td className="px-5 py-4">{item.patient}</td>
                        <td className="px-5 py-4">{item.doctor}</td>
                        <td className="px-5 py-4">{item.medication}</td>
                        <td className="px-5 py-4">{item.dosage}</td>
                        <td className="px-5 py-4">{item.directions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-4 flex items-center gap-2 font-bold">
                  <Pill size={20} /> Create Prescription
                </h3>
                <form className="space-y-3">
                  <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900" placeholder="Patient name" />
                  <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900" placeholder="Medication" />
                  <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900" placeholder="Dosage" />
                  <textarea className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900" placeholder="Directions / doctor notes" />
                  <button type="button" className="w-full rounded-2xl bg-brand px-4 py-3 font-semibold text-white">
                    Save Prescription
                  </button>
                </form>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'Medical Files' && (
          <section>
            <SectionTitle
              title="Medical Files & Uploads"
              description="Covers patient scans, reports, uploaded documents, and static file serving UI."
            />

            <div className="grid gap-6 xl:grid-cols-3">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">
                <table className="w-full min-w-[750px] text-left text-sm">
                  <thead className="bg-slate-100 text-xs uppercase text-slate-500 dark:bg-slate-800">
                    <tr>
                      <th className="px-5 py-3">File ID</th>
                      <th className="px-5 py-3">Patient</th>
                      <th className="px-5 py-3">Type</th>
                      <th className="px-5 py-3">File Name</th>
                      <th className="px-5 py-3">Uploaded</th>
                      <th className="px-5 py-3">Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file) => (
                      <tr key={file.id} className="border-t border-slate-100 dark:border-slate-800">
                        <td className="px-5 py-4 font-semibold">{file.id}</td>
                        <td className="px-5 py-4">{file.patient}</td>
                        <td className="px-5 py-4">{file.type}</td>
                        <td className="px-5 py-4">{file.name}</td>
                        <td className="px-5 py-4">{file.uploaded}</td>
                        <td className="px-5 py-4">{file.size}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-4 flex items-center gap-2 font-bold">
                  <FileUp size={20} /> Upload Scan / Report
                </h3>
                <form className="space-y-3">
                  <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900" placeholder="Patient name" />
                  <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900">
                    <option>Report type</option>
                    <option>X-Ray</option>
                    <option>Blood Report</option>
                    <option>CT Scan</option>
                    <option>Medical Note</option>
                  </select>
                  <input type="file" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
                  <button type="button" className="w-full rounded-2xl bg-brand px-4 py-3 font-semibold text-white">
                    Upload File
                  </button>
                </form>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'Departments' && (
          <section>
            <SectionTitle
              title="Departments Module"
              description="Covers departments list, department codes, chairman doctor, locations, staff, and department statistics."
            />

            <div className="grid gap-4 md:grid-cols-3">
              {departments.map((department) => (
                <div key={department.code} className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-4 flex items-center justify-between">
                    <Hospital className="text-brand" />
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold dark:bg-slate-800">
                      {department.code}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold">{department.name}</h3>
                  <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <p><span className="font-semibold">Chairman:</span> {department.chairman}</p>
                    <p><span className="font-semibold">Location:</span> {department.location}</p>
                    <p><span className="font-semibold">Staff:</span> {department.staff}</p>
                    <p><span className="font-semibold">Patients:</span> {department.patients}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'Locations' && (
          <section>
            <SectionTitle
              title="Hospital Locations & Geo Features"
              description="Covers hospital locations, nearest department, distance, availability, and maps integration placeholder."
            />

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-4 flex items-center gap-2 font-bold">
                  <MapPin size={20} /> Location List
                </h3>
                <div className="space-y-3">
                  {locations.map((location) => (
                    <div key={location.name} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                      <p className="font-bold">{location.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {location.type} / Distance: {location.distance} / {location.availability}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-5 text-center dark:border-slate-700 dark:bg-slate-900">
                <div>
                  <MapPin className="mx-auto mb-3 text-brand" size={42} />
                  <h3 className="text-xl font-bold">Map Integration Mockup</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    This area is prepared for future maps integration. For the frontend demo,
                    it shows nearest hospital areas and department locations.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'Reports' && (
          <section>
            <SectionTitle
              title="Reports Dashboard"
              description="Important database frontend page showing joins, aggregation, group by, statistics, and relational analysis outputs."
            />

            <div className="mb-6 grid gap-4 md:grid-cols-4">
              <StatCard icon={Users} label="Patients / Department" value="107" note="Grouped by department" />
              <StatCard icon={Stethoscope} label="Doctor Workload" value="43" note="Appointments per doctor" />
              <StatCard icon={Bed} label="Room Allocation" value="22" note="Free / occupied / reserved" />
              <StatCard icon={Activity} label="Emergency Stats" value="124" note="Cases by severity" />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-4 font-bold">Patients Per Department</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={departmentChart}>
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
                <h3 className="mb-4 font-bold">Doctor Workload</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={workloadChart}>
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
                <h3 className="mb-4 font-bold">ICU Usage</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={icuChart} dataKey="value" nameKey="name" outerRadius={95} label>
                        {icuChart.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={['#dc2626', '#16a34a', '#f59e0b'][index]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-4 font-bold">Emergency Cases Trend</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={emergencyTrend}>
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
          </section>
        )}

        {activeTab === 'Admin' && (
          <section>
            <SectionTitle
              title="Admin & System Pages"
              description="Covers admin dashboard, users management, roles, permissions, and access control frontend."
            />

            <div className="grid gap-6 xl:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-4 flex items-center gap-2 font-bold">
                  <ShieldCheck size={20} /> Role Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <p className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-800">Admin: full access</p>
                  <p className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-800">Doctor: patients + prescriptions</p>
                  <p className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-800">Nurse: triage + rooms</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">
                <table className="w-full min-w-[650px] text-left text-sm">
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
                    {users.map((user) => (
                      <tr key={user.id} className="border-t border-slate-100 dark:border-slate-800">
                        <td className="px-5 py-4 font-semibold">{user.id}</td>
                        <td className="px-5 py-4">{user.name}</td>
                        <td className="px-5 py-4">{user.role}</td>
                        <td className="px-5 py-4">{user.access}</td>
                        <td className="px-5 py-4"><Badge value={user.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default HospitalOperations