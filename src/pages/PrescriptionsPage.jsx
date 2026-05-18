import { Pill, PlusCircle, ClipboardList } from 'lucide-react'
import { useEffect, useState } from 'react'
import TopBar from '../components/TopBar'
import useAlert from '../hooks/useAlert'
import { createPrescription, getPrescriptions } from './hospitalApi'
import { apiFetch } from '../lib/api'
import useCurrentUser from '../hooks/useCurrentUser'
import { hasPermission } from '../lib/rbac'

export default function PrescriptionsPage() {
  const { notify } = useAlert()
  const currentUser = useCurrentUser()
  const canWrite = hasPermission(currentUser, 'prescriptions:write')
  const [message, setMessage] = useState('')
  const [prescriptions, setPrescriptions] = useState([])
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [isLoading, setIsLoading] = useState(true)

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

    const prescription = {
      patient: data.get('patient'),
      doctor: data.get('doctor'),
      medication: data.get('medication'),
      dosage: data.get('dosage'),
      directions: data.get('directions'),
      start: data.get('start'),
      end: data.get('end'),
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <TopBar activePath="/prescriptions" showNotifications showUserMenu />

      <main className="mx-auto max-w-7xl px-5 py-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
          Prescriptions
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
          Prescriptions & Medications
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
                  </tr>
                </thead>

                <tbody>
                  {isLoading && (
                    <tr className="border-t border-slate-100 dark:border-slate-800">
                      <td colSpan={7} className="px-5 py-6 text-sm text-slate-500 dark:text-slate-400">
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
                    </tr>
                  ))}

                  {!isLoading && prescriptions.length === 0 && (
                    <tr className="border-t border-slate-100 dark:border-slate-800">
                      <td colSpan={7} className="px-5 py-6 text-sm text-slate-500 dark:text-slate-400">
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
                <input
                  name="start"
                  type="date"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />

                <input
                  name="end"
                  type="date"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
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
    </div>
  )
}
