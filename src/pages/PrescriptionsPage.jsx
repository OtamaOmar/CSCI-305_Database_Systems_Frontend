import { ClipboardList, Pencil, Pill, PlusCircle, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import TopBar from '../components/TopBar'
import useAlert from '../hooks/useAlert'
import { createPrescription, getPrescriptions } from './hospitalApi'
import { apiFetch } from '../lib/api'
import useCurrentUser from '../hooks/useCurrentUser'
import { hasPermission } from '../lib/rbac'

function validateDates(start, end) {
  if (start && end && end <= start) {
    return 'End date must be after start date.'
  }
  return null
}

export default function PrescriptionsPage() {
  const { confirm, notify } = useAlert()
  const currentUser = useCurrentUser()
  const canWrite = hasPermission(currentUser, 'prescriptions:write')
  const [message, setMessage] = useState('')
  const [prescriptions, setPrescriptions] = useState([])
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingPrescription, setEditingPrescription] = useState(null)

  async function loadData() {
    setIsLoading(true)
    try {
      const [rxData, patientsData, doctorsData] = await Promise.all([
        getPrescriptions(),
        apiFetch('/api/patients'),
        apiFetch('/api/doctors'),
      ])

      setPrescriptions(Array.isArray(rxData) ? rxData : [])
      setPatients(Array.isArray(patientsData) ? patientsData : [])
      setDoctors(Array.isArray(doctorsData) ? doctorsData : [])
    } catch (err) {
      notify({ tone: 'error', message: err.message })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()

    const data = new FormData(event.target)
    const start = data.get('start')
    const end = data.get('end')

    const dateError = validateDates(start, end)
    if (dateError) {
      setMessage(dateError)
      return
    }

    const prescription = {
      patient: data.get('patient'),
      doctor: data.get('doctor'),
      medication: data.get('medication'),
      dosage: data.get('dosage'),
      directions: data.get('directions'),
      start,
      end,
      notes: data.get('notes'),
    }

    try {
      await createPrescription(prescription)
      setMessage('Prescription saved.')
      await loadData()
      event.target.reset()
    } catch (err) {
      setMessage(err.message)
    }
  }

  function openEdit(prescription) {
    setEditingPrescription(prescription)
    setIsEditOpen(true)
  }

  function closeEdit() {
    setIsEditOpen(false)
    setEditingPrescription(null)
  }

  async function handleEdit(event) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const start = data.get('start')
    const end = data.get('end')

    const dateError = validateDates(start, end)
    if (dateError) {
      notify({ tone: 'error', message: dateError })
      return
    }

    const payload = {
      patient: data.get('patient'),
      doctor: data.get('doctor'),
      medication: data.get('medication'),
      dosage: data.get('dosage'),
      directions: data.get('directions'),
      start,
      end,
      notes: data.get('notes'),
    }

    try {
      await apiFetch(`/api/prescriptions/${editingPrescription.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      })
      notify({ tone: 'success', message: 'Prescription updated.' })
      await loadData()
      closeEdit()
    } catch (err) {
      notify({ tone: 'error', message: err.message })
    }
  }

  async function handleDelete(id) {
    const ok = await confirm({
      title: 'Delete prescription?',
      message: 'Delete this prescription? This cannot be undone.',
      tone: 'warning',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    })
    if (!ok) return

    try {
      await apiFetch(`/api/prescriptions/${id}`, { method: 'DELETE' })
      notify({ tone: 'success', message: 'Prescription deleted.' })
      await loadData()
    } catch (err) {
      notify({ tone: 'error', message: err.message })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <TopBar activePath="/prescriptions" showNotifications showUserMenu />

      <main className="mx-auto max-w-7xl px-5 py-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
          Prescriptions
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
          Prescriptions &amp; Medications
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Covers prescriptions list, patient prescriptions, medication dosage, directions,
          start/end dates, doctor notes, and medication history.
        </p>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <h2 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <ClipboardList size={20} />
                Prescriptions List
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase text-slate-500 dark:bg-slate-800">
                  <tr>
                    <th className="px-5 py-3">ID</th>
                    <th className="px-5 py-3">Patient</th>
                    <th className="px-5 py-3">Doctor</th>
                    <th className="px-5 py-3">Medication</th>
                    <th className="px-5 py-3">Dosage</th>
                    <th className="px-5 py-3">Directions</th>
                    <th className="px-5 py-3">Dates</th>
                    {canWrite && <th className="px-5 py-3" />}
                  </tr>
                </thead>

                <tbody>
                  {isLoading && (
                    <tr className="border-t border-slate-100 dark:border-slate-800">
                      <td colSpan={canWrite ? 8 : 7} className="px-5 py-6 text-sm text-slate-500 dark:text-slate-400">
                        Loading prescriptions…
                      </td>
                    </tr>
                  )}

                  {prescriptions.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-slate-100 dark:border-slate-800 dark:text-slate-200"
                    >
                      <td className="px-5 py-4 font-semibold">{item.id}</td>
                      <td className="px-5 py-4">{item.patient}</td>
                      <td className="px-5 py-4">{item.doctor}</td>
                      <td className="px-5 py-4">{item.medication}</td>
                      <td className="px-5 py-4">{item.dosage}</td>
                      <td className="px-5 py-4">{item.directions}</td>
                      <td className="px-5 py-4">{item.start_date} → {item.end_date || '—'}</td>
                      {canWrite && (
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEdit(item)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/35 dark:text-red-400 dark:hover:bg-red-950/60"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}

                  {!isLoading && prescriptions.length === 0 && (
                    <tr className="border-t border-slate-100 dark:border-slate-800">
                      <td colSpan={canWrite ? 8 : 7} className="px-5 py-6 text-sm text-slate-500 dark:text-slate-400">
                        No prescriptions yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
              <PlusCircle size={22} />
              Create Prescription
            </h2>

            {!canWrite && (
              <p className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                You don&apos;t have permission to create prescriptions.
              </p>
            )}

            {canWrite && (
              <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="patient"
                required
                list="patient-options"
                placeholder="Search patient…"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />

              <input
                name="doctor"
                required
                list="doctor-options"
                placeholder="Search doctor…"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />

              <input
                name="medication"
                required
                placeholder="Medication"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />

              <input
                name="dosage"
                required
                placeholder="Dosage"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />

              <textarea
                name="directions"
                required
                placeholder="Directions"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Start date</label>
                  <input
                    name="start"
                    type="date"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">End date</label>
                  <input
                    name="end"
                    type="date"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <textarea
                name="notes"
                placeholder="Doctor notes"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />

              <button className="w-full rounded-2xl bg-brand px-5 py-3 font-semibold text-white">
                <Pill className="mr-2 inline h-4 w-4" />
                Save Prescription
              </button>
              </form>
            )}

            <datalist id="patient-options">
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
              {patients.map((patient) => (
                <option key={`${patient.id}-name`} value={patient.name}>
                  {patient.id}
                </option>
              ))}
            </datalist>

            <datalist id="doctor-options">
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
              {doctors.map((doctor) => (
                <option key={`${doctor.id}-name`} value={doctor.name}>
                  {doctor.id}
                </option>
              ))}
            </datalist>

            {message && (
              <p className="mt-4 rounded-2xl bg-slate-100 p-4 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {message}
              </p>
            )}
          </section>
        </div>
      </main>

      {isEditOpen && editingPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm dark:bg-slate-950/70">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Edit prescription</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  ID: {editingPrescription.id}
                </p>
              </div>
              <button
                type="button"
                onClick={closeEdit}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleEdit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Patient</span>
                  <input
                    name="patient"
                    required
                    list="edit-patient-options"
                    defaultValue={editingPrescription.patient ?? ''}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Doctor</span>
                  <input
                    name="doctor"
                    required
                    list="edit-doctor-options"
                    defaultValue={editingPrescription.doctor ?? ''}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Medication</span>
                  <input
                    name="medication"
                    required
                    defaultValue={editingPrescription.medication ?? ''}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Dosage</span>
                  <input
                    name="dosage"
                    required
                    defaultValue={editingPrescription.dosage ?? ''}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  />
                </label>
              </div>

              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Directions</span>
                <textarea
                  name="directions"
                  required
                  rows={2}
                  defaultValue={editingPrescription.directions ?? ''}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Start date</span>
                  <input
                    name="start"
                    type="date"
                    defaultValue={editingPrescription.start_date ?? ''}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">End date</span>
                  <input
                    name="end"
                    type="date"
                    defaultValue={editingPrescription.end_date ?? ''}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  />
                </label>
              </div>

              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Doctor notes</span>
                <textarea
                  name="notes"
                  rows={2}
                  defaultValue={editingPrescription.notes ?? ''}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand/90"
                >
                  Update prescription
                </button>
              </div>
            </form>

            <datalist id="edit-patient-options">
              {patients.map((patient) => (
                <option key={patient.id} value={patient.name} />
              ))}
            </datalist>
            <datalist id="edit-doctor-options">
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.name} />
              ))}
            </datalist>
          </div>
        </div>
      )}
    </div>
  )
}
