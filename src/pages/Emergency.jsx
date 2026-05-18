import { useEffect, useMemo, useState } from 'react'
import TopBar from '../components/TopBar'
import useAlert from '../hooks/useAlert'
import { Filter, Pencil, Plus, Search, Siren, Trash2 } from 'lucide-react'
import { apiFetch } from '../lib/api'

const statusFilters = ['All', 'Incoming', 'In treatment', 'Stabilized', 'Discharged']

const severityStyles = {
  Critical: 'bg-brand/10 text-brand',
  Urgent: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Stable: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
}

const statusStyles = {
  Incoming: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  'In treatment': 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Stabilized: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  Discharged: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
}

function Emergency() {
  const { confirm, notify } = useAlert()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const [caseRows, setCaseRows] = useState([])
  const [doctorOptions, setDoctorOptions] = useState([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingCase, setEditingCase] = useState(null)
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false

    return (
      document.documentElement.classList.contains('dark')
      || window.matchMedia('(prefers-color-scheme: dark)').matches
    )
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  async function fetchCases() {
    try {
      const data = await apiFetch('/api/cases')
      setCaseRows(data)
    } catch (err) {
      console.error(err)
      notify({ tone: 'error', message: err.message })
    }
  }

  async function fetchDoctors() {
    try {
      const data = await apiFetch('/api/doctors')
      setDoctorOptions(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      notify({ tone: 'error', message: err.message })
    }
  }

  useEffect(() => {
    fetchCases()
    fetchDoctors()
  }, [])

  async function handleAddCase(event) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const id = `EC-${Date.now().toString().slice(-6)}`
    const arrivalTime = String(formData.get('arrival_time') || '').trim()

    const nextCase = {
      id,
      name: String(formData.get('name') || '').trim(),
      age: Number(formData.get('age') || 0),
      gender: String(formData.get('gender') || '').trim(),
      complaint: String(formData.get('complaint') || '').trim(),
      room: String(formData.get('room') || '').trim(),
      doctor: String(formData.get('doctor') || '').trim() || 'Unassigned',
      severity: String(formData.get('severity') || '').trim(),
      status: String(formData.get('status') || '').trim(),
      arrival_time: arrivalTime ? arrivalTime.replace('T', ' ') : null,
      notes: String(formData.get('notes') || '').trim(),
    }

    try {
      await apiFetch('/api/cases', {
        method: 'POST',
        body: JSON.stringify(nextCase),
      })
      await fetchCases()
      form.reset()
      setIsAddOpen(false)
    } catch (err) {
      notify({ tone: 'error', message: err.message })
    }
  }

  function openEditCase(item) {
    setEditingCase(item)
    setIsEditOpen(true)
  }

  async function handleEditCase(event) {
    event.preventDefault()
    if (!editingCase) return

    const formData = new FormData(event.currentTarget)
    const arrivalTime = String(formData.get('arrival_time') || '').trim()
    const updated = {
      id: editingCase.id,
      name: String(formData.get('name') || '').trim(),
      age: Number(formData.get('age') || 0),
      gender: String(formData.get('gender') || '').trim(),
      complaint: String(formData.get('complaint') || '').trim(),
      room: String(formData.get('room') || '').trim(),
      doctor: String(formData.get('doctor') || '').trim() || 'Unassigned',
      severity: String(formData.get('severity') || '').trim(),
      status: String(formData.get('status') || '').trim(),
      arrival_time: arrivalTime ? arrivalTime.replace('T', ' ') : editingCase.arrival_time,
      notes: String(formData.get('notes') || '').trim(),
    }

    try {
      await apiFetch(`/api/cases/${editingCase.id}`, {
        method: 'PUT',
        body: JSON.stringify(updated),
      })
      await fetchCases()
      notify({ tone: 'success', message: 'Case updated successfully.' })
      setIsEditOpen(false)
      setEditingCase(null)
    } catch (err) {
      notify({ tone: 'error', message: err.message })
    }
  }

  async function handleDeleteCase(caseId) {
    const ok = await confirm({
      title: 'Delete case?',
      message: 'Delete this emergency case? This cannot be undone.',
      tone: 'warning',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    })
    if (!ok) return

    try {
      await apiFetch(`/api/cases/${caseId}`, { method: 'DELETE' })
      await fetchCases()
      notify({ tone: 'success', message: 'Case deleted.' })
    } catch (err) {
      notify({ tone: 'error', message: err.message })
    }
  }

  const filtered = useMemo(() => {
    return caseRows.filter((item) => {
      const lowered = query.toLowerCase()
      const matchQuery = !query
        || (item.name || '').toLowerCase().includes(lowered)
        || (item.id || '').toLowerCase().includes(lowered)
        || (item.complaint || '').toLowerCase().includes(lowered)
      const matchStatus = status === 'All' || item.status === status
      return matchQuery && matchStatus
    })
  }, [query, status, caseRows])

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <TopBar
        navItems={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Patients', to: '/patient' },
          { label: 'Doctors', to: '/doctors' },
          { label: 'Emergency', to: '/emergency' },
          { label: 'Staff', to: '/staff' },
        ]}
        activePath="/emergency"
        isDark={isDark}
        onToggleTheme={() => setIsDark((value) => !value)}
        showNotifications
      />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-5xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              <Siren className="h-8 w-8 text-brand" />
              Emergency cases
            </h1>
            <p className="mt-2 text-xl text-slate-600 dark:text-slate-400">
              {caseRows.length} total - {filtered.length} shown
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-3 text-base font-semibold text-white transition hover:bg-brand/90"
          >
            <Plus className="h-4 w-4" /> New case
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex min-w-60 flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base dark:border-slate-700 dark:bg-slate-900">
            <Search className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by patient, ID, complaint..."
              className="w-full bg-transparent text-slate-700 placeholder:text-slate-400 focus:outline-none dark:text-slate-200 dark:placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
            <Filter className="ml-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
            {statusFilters.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setStatus(option)}
                className={`rounded-xl px-3 py-1.5 text-sm font-medium transition ${
                  status === option
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
          <table className="w-full text-base">
            <thead className="border-b border-slate-200 bg-slate-100/80 text-left text-sm uppercase tracking-widest text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-400">
              <tr>
                <th className="px-5 py-4 font-medium">Case</th>
                <th className="px-5 py-4 font-medium">Complaint</th>
                <th className="px-5 py-4 font-medium">Room</th>
                <th className="px-5 py-4 font-medium">Doctor</th>
                <th className="px-5 py-4 font-medium">Severity</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4" />
              </tr>
            </thead>

            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-200 transition hover:bg-slate-100/70 last:border-0 dark:border-slate-700 dark:hover:bg-slate-800/70"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-sm font-semibold dark:bg-slate-800">
                        {item.name.split(' ').map((part) => part[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {item.id} - {item.age} {item.gender ? item.gender[0] : ''}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{item.complaint}</td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{item.room}</td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{item.doctor}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-sm font-medium ${severityStyles[item.severity]}`}>
                      {item.severity}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusStyles[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditCase(item)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCase(item.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/35 dark:text-red-400 dark:hover:bg-red-950/60"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500 dark:text-slate-400">
                    No emergency cases match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm dark:bg-slate-950/70">
          <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">New emergency case</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Enter case details for emergency intake and tracking.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleAddCase}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Patient name</span>
                  <input
                    name="name"
                    type="text"
                    placeholder="Patient full name"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </label>
                <div className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Case ID</span>
                  <div className="w-full rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Auto-generated on save
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Age</span>
                  <input
                    name="age"
                    type="number"
                    placeholder="35"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Gender</span>
                  <select
                    name="gender"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Complaint</span>
                  <input
                    name="complaint"
                    type="text"
                    placeholder="Primary complaint"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Room</span>
                  <input
                    name="room"
                    type="text"
                    placeholder="Trauma 1 / Bay 07"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Assigned doctor</span>
                  <select
                    name="doctor"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <option value="">Select doctor</option>
                    {doctorOptions.map((doctor) => (
                      <option key={doctor.id} value={doctor.name}>
                        {doctor.name}{doctor.department ? ` - ${doctor.department}` : ''}
                      </option>
                    ))}
                    <option value="Unassigned">Unassigned</option>
                  </select>
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Severity</span>
                  <select
                    name="severity"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <option value="">Select severity</option>
                    <option value="Critical">Critical</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Stable">Stable</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Case status</span>
                  <select
                    name="status"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <option value="">Select status</option>
                    <option value="Incoming">Incoming</option>
                    <option value="In treatment">In treatment</option>
                    <option value="Stabilized">Stabilized</option>
                    <option value="Discharged">Discharged</option>
                  </select>
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Arrival time</span>
                  <input
                    name="arrival_time"
                    type="datetime-local"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  />
                </label>
              </div>

              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Notes</span>
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="Additional notes"
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                />
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand/90"
                >
                  Save case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditOpen && editingCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm dark:bg-slate-950/70">
          <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Edit emergency case</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Update case details.
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setIsEditOpen(false); setEditingCase(null) }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleEditCase}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Patient name</span>
                  <input
                    name="name"
                    type="text"
                    defaultValue={editingCase.name}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Case ID</span>
                  <input
                    type="text"
                    value={editingCase.id}
                    disabled
                    className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Age</span>
                  <input
                    name="age"
                    type="number"
                    defaultValue={editingCase.age}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Gender</span>
                  <select
                    name="gender"
                    defaultValue={editingCase.gender}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Complaint</span>
                  <input
                    name="complaint"
                    type="text"
                    defaultValue={editingCase.complaint}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Room</span>
                  <input
                    name="room"
                    type="text"
                    defaultValue={editingCase.room}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Assigned doctor</span>
                  <select
                    name="doctor"
                    defaultValue={editingCase.doctor}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <option value="">Select doctor</option>
                    {editingCase.doctor
                      && !doctorOptions.some((d) => d.name === editingCase.doctor)
                      && <option value={editingCase.doctor}>{editingCase.doctor}</option>}
                    {doctorOptions.map((doctor) => (
                      <option key={doctor.id} value={doctor.name}>
                        {doctor.name}{doctor.department ? ` - ${doctor.department}` : ''}
                      </option>
                    ))}
                    <option value="Unassigned">Unassigned</option>
                  </select>
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Severity</span>
                  <select
                    name="severity"
                    defaultValue={editingCase.severity}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <option value="">Select severity</option>
                    <option value="Critical">Critical</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Stable">Stable</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Case status</span>
                  <select
                    name="status"
                    defaultValue={editingCase.status}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <option value="">Select status</option>
                    <option value="Incoming">Incoming</option>
                    <option value="In treatment">In treatment</option>
                    <option value="Stabilized">Stabilized</option>
                    <option value="Discharged">Discharged</option>
                  </select>
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Arrival time</span>
                  <input
                    name="arrival_time"
                    type="datetime-local"
                    defaultValue={editingCase.arrival_time ? editingCase.arrival_time.replace(' ', 'T') : ''}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  />
                </label>
              </div>

              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Notes</span>
                <textarea
                  name="notes"
                  rows={3}
                  defaultValue={editingCase.notes}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                />
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsEditOpen(false); setEditingCase(null) }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand/90"
                >
                  Update case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Emergency
