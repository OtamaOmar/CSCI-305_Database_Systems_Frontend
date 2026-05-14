import { FileText, FileUp, ScanLine } from 'lucide-react'
import { useState } from 'react'
import TopBar from '../components/TopBar'
import { mockMedicalFiles } from './hospitalData'

export default function MedicalFilesPage() {
  const [message, setMessage] = useState('')

  function handleUpload(event) {
    event.preventDefault()
    setMessage('Demo mode: file upload UI is ready for backend static file serving.')
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
                  {mockMedicalFiles.map((file) => (
                    <tr
                      key={file.id}
                      className="border-t border-slate-100 dark:border-slate-800 dark:text-slate-200"
                    >
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
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
              <FileUp size={22} />
              Upload Scan / Report
            </h2>

            <form onSubmit={handleUpload} className="space-y-4">
              <input
                required
                placeholder="Patient name"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />

              <select
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