import { Hospital, Pencil, Plus, Trash2, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import TopBar from '../components/TopBar'
import useAlert from '../hooks/useAlert'
import { apiFetch } from '../lib/api'
import { getDepartments } from './hospitalApi'

export default function DepartmentsPage() {
  const { confirm, notify } = useAlert()
  const [departments, setDepartments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState(null)

  async function refreshDepartments() {
    const data = await getDepartments()
    setDepartments(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      setIsLoading(true)
      try {
        const [deptData, doctorData] = await Promise.all([
          getDepartments(),
          apiFetch('/api/doctors'),
        ])
        if (!isMounted) return
        setDepartments(Array.isArray(deptData) ? deptData : [])
        setDoctors(Array.isArray(doctorData) ? doctorData : [])
      } catch (err) {
        if (!isMounted) return
        notify({ tone: 'error', message: err.message })
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    load()
    return () => { isMounted = false }
  }, [notify])

  function openAdd() {
    setEditingDepartment(null)
    setIsFormOpen(true)
  }

  function openEdit(department) {
    setEditingDepartment(department)
    setIsFormOpen(true)
  }

  function closeForm() {
    setIsFormOpen(false)
    setEditingDepartment(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const payload = {
      name: String(formData.get('name') || '').trim(),
      code: String(formData.get('code') || '').trim(),
      location: String(formData.get('location') || '').trim(),
      chairman: String(formData.get('chairman') || '').trim() || null,
      staff_count: Number(formData.get('staff_count') || 0),
    }

    try {
      if (editingDepartment) {
        await apiFetch(`/api/departments/${editingDepartment.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        notify({ tone: 'success', message: 'Department updated.' })
      } else {
        await apiFetch('/api/departments', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        notify({ tone: 'success', message: 'Department created.' })
      }
      await refreshDepartments()
      closeForm()
    } catch (err) {
      notify({ tone: 'error', message: err.message })
    }
  }

  async function handleDelete(id) {
    const ok = await confirm({
      title: 'Delete department?',
      message: 'Delete this department? This cannot be undone.',
      tone: 'warning',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    })
    if (!ok) return

    try {
      await apiFetch(`/api/departments/${id}`, { method: 'DELETE' })
      notify({ tone: 'success', message: 'Department deleted.' })
      await refreshDepartments()
    } catch (err) {
      notify({ tone: 'error', message: err.message })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <TopBar activePath="/departments-page" showNotifications showUserMenu />

      <main className="mx-auto max-w-7xl px-5 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
              Departments
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
              Departments List &amp; Details
            </h1>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Covers all departments, department codes, chairman doctor, locations, staff,
              patient statistics, and relational department analysis.
            </p>
          </div>

          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-3 text-base font-semibold text-white transition hover:bg-brand/90"
          >
            <Plus className="h-4 w-4" /> Add Department
          </button>
        </div>

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

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(department)}
                  className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(department.id)}
                  className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/35 dark:text-red-400 dark:hover:bg-red-950/60"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
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

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm dark:bg-slate-950/70">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                  {editingDepartment ? 'Edit department' : 'Add department'}
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {editingDepartment ? 'Update department details.' : 'Enter details for the new department.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Department name</span>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="e.g. Cardiology"
                    defaultValue={editingDepartment?.name ?? ''}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Code</span>
                  <input
                    name="code"
                    type="text"
                    required
                    placeholder="e.g. CARD"
                    defaultValue={editingDepartment?.code ?? ''}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Location</span>
                  <input
                    name="location"
                    type="text"
                    required
                    placeholder="e.g. Wing B, Floor 3"
                    defaultValue={editingDepartment?.location ?? ''}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Staff count</span>
                  <input
                    name="staff_count"
                    type="number"
                    min="0"
                    placeholder="0"
                    defaultValue={editingDepartment?.staff_count ?? ''}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </label>
              </div>

              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Chairman</span>
                <select
                  name="chairman"
                  defaultValue={editingDepartment?.chairman ?? ''}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <option value="">Unassigned</option>
                  {editingDepartment?.chairman
                    && !doctors.some((d) => d.name === editingDepartment.chairman)
                    && (
                      <option value={editingDepartment.chairman}>{editingDepartment.chairman}</option>
                    )}
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.name}>
                      {doctor.name}{doctor.department ? ` — ${doctor.department}` : ''}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand/90"
                >
                  {editingDepartment ? 'Update department' : 'Save department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
