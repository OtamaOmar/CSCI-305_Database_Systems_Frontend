import { useEffect, useMemo, useState } from 'react'
import TopBar from '../components/TopBar'
import useAlert from '../hooks/useAlert'
import { Filter, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { apiFetch } from '../lib/api'
import useCurrentUser from '../hooks/useCurrentUser'
import { hasPermission } from '../lib/rbac'

const statusFilters = ['All', 'On duty', 'On call', 'Off duty']

const statusStyles = {
  'On duty': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  'On call': 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  'Off duty': 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
}

function Doctors() {
  const { confirm, notify } = useAlert()
  const currentUser = useCurrentUser()
  const canWrite = hasPermission(currentUser, 'doctors:write')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const [doctorRows, setDoctorRows] = useState([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState(null)
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

  async function fetchDoctorsData() {
    const data = await apiFetch('/api/doctors')
    return Array.isArray(data) ? data : []
  }

  async function refreshDoctors() {
    try {
      const data = await fetchDoctorsData()
      setDoctorRows(data)
    } catch (err) {
      console.error(err)
      notify({ tone: 'error', message: err.message })
    }
  }

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const data = await fetchDoctorsData()
        if (!isMounted) return
        setDoctorRows(data)
      } catch (err) {
        if (!isMounted) return
        console.error(err)
        notify({ tone: 'error', message: err.message })
      }
    }

    void load()

    return () => {
      isMounted = false
    }
  }, [notify])

  async function handleAddDoctor(event) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const id = `DR-${Date.now().toString().slice(-6)}`

    const nextDoctor = {
      id,
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      specialty: String(formData.get('specialty') || '').trim(),
      department: String(formData.get('department') || '').trim(),
      shift: String(formData.get('shift') || '').trim(),
      status: String(formData.get('status') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      notes: String(formData.get('notes') || '').trim(),
    }

    try {
      await apiFetch('/api/doctors', {
        method: 'POST',
        body: JSON.stringify(nextDoctor),
      })
      await refreshDoctors()
      form.reset()
      setIsAddOpen(false)
    } catch (err) {
      notify({ tone: 'error', message: err.message })
    }
  }

  function openEditDoctor(doctor) {
    setEditingDoctor(doctor)
    setIsEditOpen(true)
  }

  async function handleEditDoctor(event) {
    event.preventDefault()

    if (!editingDoctor) return

    const formData = new FormData(event.currentTarget)
    const updatedDoctor = {
      id: editingDoctor.id,
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      specialty: String(formData.get('specialty') || '').trim(),
      department: String(formData.get('department') || '').trim(),
      shift: String(formData.get('shift') || '').trim(),
      status: String(formData.get('status') || '').trim(),
    }

    try {
      await apiFetch(`/api/doctors/${editingDoctor.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedDoctor),
      })
      await refreshDoctors()
      setIsEditOpen(false)
      setEditingDoctor(null)
    } catch (err) {
      notify({ tone: 'error', message: err.message })
    }
  }

  async function handleDeleteDoctor(doctorId) {
    const ok = await confirm({
      title: 'Delete doctor?',
      message: 'Delete this doctor record? This cannot be undone.',
      tone: 'warning',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    })
    if (!ok) return

    try {
      await apiFetch(`/api/doctors/${doctorId}`, { method: 'DELETE' })
      await refreshDoctors()
    } catch (err) {
      notify({ tone: 'error', message: err.message })
    }
  }

  const filtered = useMemo(() => {
    return doctorRows.filter((doctor) => {
      const lowered = query.toLowerCase()
      const matchQuery = !query
        || (doctor.name || '').toLowerCase().includes(lowered)
        || (doctor.id || '').toLowerCase().includes(lowered)
        || (doctor.specialty || '').toLowerCase().includes(lowered)
        || (doctor.department || '').toLowerCase().includes(lowered)
      const matchStatus = status === 'All' || doctor.status === status
      return matchQuery && matchStatus
    })
  }, [query, status, doctorRows])

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
        activePath="/doctors"
        isDark={isDark}
        onToggleTheme={() => setIsDark((value) => !value)}
        showNotifications
      />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-5xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Doctors &amp; Staff</h1>
            <p className="mt-2 text-xl text-slate-600 dark:text-slate-400">
              {doctorRows.length} total - {filtered.length} shown
            </p>
          </div>

          {canWrite && (
            <button
              type="button"
              onClick={() => setIsAddOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-3 text-base font-semibold text-white transition hover:bg-brand/90"
            >
              <Plus className="h-4 w-4" /> Add doctor
            </button>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex min-w-60 flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base dark:border-slate-700 dark:bg-slate-900">
            <Search className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, ID, specialty, department..."
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
                <th className="px-5 py-4 font-medium">Doctor</th>
                <th className="px-5 py-4 font-medium">Specialty</th>
                <th className="px-5 py-4 font-medium">Department</th>
                <th className="px-5 py-4 font-medium">Shift</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4" />
              </tr>
            </thead>

            <tbody>
              {filtered.map((doctor) => (
                <tr
                  key={doctor.id}
                  className="border-b border-slate-200 transition hover:bg-slate-100/70 last:border-0 dark:border-slate-700 dark:hover:bg-slate-800/70"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-sm font-semibold dark:bg-slate-800">
                        {doctor.name.replace('Dr. ', '').split(' ').map((part) => part[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{doctor.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {doctor.id} - {doctor.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{doctor.specialty}</td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{doctor.department}</td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{doctor.shift}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusStyles[doctor.status]}`}>
                      {doctor.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {canWrite && (
                        <>
                          <button
                            type="button"
                            onClick={() => openEditDoctor(doctor)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDoctor(doctor.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/35 dark:text-red-400 dark:hover:bg-red-950/60"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500 dark:text-slate-400">
                    No doctors match your filters.
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
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Add doctor</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Enter doctor details for staffing and scheduling.
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

            <form className="space-y-4" onSubmit={handleAddDoctor}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Full name</span>
                  <input
                    name="name"
                    type="text"
                    placeholder="Dr. Full name"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </label>
                <div className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Doctor ID</span>
                  <div className="w-full rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Auto-generated on save
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</span>
                  <input
                    name="email"
                    type="email"
                    placeholder="doctor@stmercy.org"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone</span>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="+1 555 000 0000"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Specialty</span>
                  <input
                    name="specialty"
                    type="text"
                    placeholder="Specialty"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Department</span>
                  <input
                    name="department"
                    type="text"
                    placeholder="Department"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Shift</span>
                  <select
                    name="shift"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <option value="">Select shift</option>
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</span>
                  <select
                    name="status"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <option value="">Select status</option>
                    <option value="On duty">On duty</option>
                    <option value="On call">On call</option>
                    <option value="Off duty">Off duty</option>
                  </select>
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
                  Save doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditOpen && editingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm dark:bg-slate-950/70">
          <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Edit doctor</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Update doctor profile details.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditOpen(false)
                  setEditingDoctor(null)
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleEditDoctor}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Doctor ID</span>
                  <input
                    type="text"
                    value={editingDoctor.id}
                    disabled
                    className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Full name</span>
                  <input
                    name="name"
                    type="text"
                    defaultValue={editingDoctor.name}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</span>
                  <input
                    name="email"
                    type="email"
                    defaultValue={editingDoctor.email}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Specialty</span>
                  <input
                    name="specialty"
                    type="text"
                    defaultValue={editingDoctor.specialty}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Department</span>
                  <input
                    name="department"
                    type="text"
                    defaultValue={editingDoctor.department}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Shift</span>
                  <select
                    name="shift"
                    defaultValue={editingDoctor.shift}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <option value="">Select shift</option>
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</span>
                  <select
                    name="status"
                    defaultValue={editingDoctor.status}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <option value="">Select status</option>
                    <option value="On duty">On duty</option>
                    <option value="On call">On call</option>
                    <option value="Off duty">Off duty</option>
                  </select>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditOpen(false)
                    setEditingDoctor(null)
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand/90"
                >
                  Update doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Doctors
