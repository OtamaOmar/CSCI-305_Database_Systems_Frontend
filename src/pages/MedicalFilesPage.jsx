import { FileText, FileUp, ScanLine } from 'lucide-react'
import { useEffect, useState } from 'react'
import TopBar from '../components/TopBar'
import useAlert from '../hooks/useAlert'
import { apiFetch } from '../lib/api'
import useCurrentUser from '../hooks/useCurrentUser'
import { hasPermission } from '../lib/rbac'

export default function MedicalFilesPage() {
  const { notify } = useAlert()
  const currentUser = useCurrentUser()
  const canWrite = hasPermission(currentUser, 'medical_files:write')
  const [message, setMessage] = useState('')
  const [files, setFiles] = useState([])
  const [patients, setPatients] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  async function loadData() {
    setIsLoading(true)
    try {
      const [filesData, patientsData] = await Promise.all([
        apiFetch('/api/medical-files'),
        apiFetch('/api/patients'),
      ])
      setFiles(Array.isArray(filesData) ? filesData : [])
      setPatients(Array.isArray(patientsData) ? patientsData : [])
    } catch (err) {
      notify({ tone: 'error', message: err.message })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleUpload(event) {
    event.preventDefault()
    const data = new FormData(event.target)
    const patient = data.get('patient')
    const fileType = data.get('file_type')
    const file = data.get('file')

    const fileName = file && typeof file === 'object' && file.name ? file.name : ''

    try {
      await apiFetch('/api/medical-files', {
        method: 'POST',
        body: JSON.stringify({
          patient,
          file_type: fileType,
          file_name: fileName || data.get('file_name'),
        }),
      })
      setMessage('File record created.')
      event.target.reset()
      await loadData()
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <TopBar activePath="/medical-files" showNotifications showUserMenu />

      <main className="mx-auto max-w-7xl px-5 py-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
          Medical Files
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
          Medical Files & Uploads
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Covers patient scans, reports, uploaded documents, file upload form, and static file
          serving integration area.
        </p>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <h2 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <FileText size={20} />
                Uploaded Medical Files
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
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
                  {isLoading && (
                    <tr className="border-t border-slate-100 dark:border-slate-800">
                      <td colSpan={6} className="px-5 py-6 text-sm text-slate-500 dark:text-slate-400">
                        Loading files…
                      </td>
                    </tr>
                  )}

                  {files.map((file) => (
                    <tr
                      key={file.id}
                      className="border-t border-slate-100 dark:border-slate-800 dark:text-slate-200"
                    >
                      <td className="px-5 py-4 font-semibold">{file.id}</td>
                      <td className="px-5 py-4">{file.patient}</td>
                      <td className="px-5 py-4">{file.file_type}</td>
                      <td className="px-5 py-4">{file.file_name}</td>
                      <td className="px-5 py-4">{file.uploaded_date}</td>
                      <td className="px-5 py-4">{file.size || '—'}</td>
                    </tr>
                  ))}

                  {!isLoading && files.length === 0 && (
                    <tr className="border-t border-slate-100 dark:border-slate-800">
                      <td colSpan={6} className="px-5 py-6 text-sm text-slate-500 dark:text-slate-400">
                        No files uploaded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
              <FileUp size={22} />
              Upload Scan / Report
            </h2>

            {!canWrite && (
              <p className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                You don&apos;t have permission to upload medical files.
              </p>
            )}

            {canWrite && (
              <form onSubmit={handleUpload} className="space-y-4">
              <input
                name="patient"
                required
                list="patient-options"
                placeholder="Patient name or ID"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />

              <select
                name="file_type"
                required
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                <option>X-Ray</option>
                <option>Blood Report</option>
                <option>CT Scan</option>
                <option>MRI Scan</option>
                <option>Medical Note</option>
              </select>

              <input
                name="file"
                type="file"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />

              <textarea
                placeholder="File notes"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />

              <button className="w-full rounded-2xl bg-brand px-5 py-3 font-semibold text-white">
                <ScanLine className="mr-2 inline h-4 w-4" />
                Upload File
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
