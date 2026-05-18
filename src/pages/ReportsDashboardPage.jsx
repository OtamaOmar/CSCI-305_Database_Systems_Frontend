import { Activity, Bed, Stethoscope, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import TopBar from '../components/TopBar'
import useAlert from '../hooks/useAlert'
import { getReportsDashboard } from './hospitalApi'
import { apiFetch } from '../lib/api'
import useCurrentUser from '../hooks/useCurrentUser'
import { hasPermission } from '../lib/rbac'

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
  const { notify } = useAlert()
  const currentUser = useCurrentUser()
  const canUpload = hasPermission(currentUser, 'hospital_files:write')
  const [reportData, setReportData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [uploads, setUploads] = useState([])
  const [uploadMessage, setUploadMessage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [parsedPreview, setParsedPreview] = useState({ columns: [], rows: [] })
  const [tableQuery, setTableQuery] = useState('')
  const [sortKey, setSortKey] = useState('')
  const [sortDir, setSortDir] = useState('asc')

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      setIsLoading(true)
      try {
        const [data, uploadsData] = await Promise.all([
          getReportsDashboard(),
          apiFetch('/api/hospital-files'),
        ])
        if (!isMounted) return
        setReportData(data)
        setUploads(Array.isArray(uploadsData) ? uploadsData : [])
      } catch (err) {
        if (!isMounted) return
        notify({ tone: 'error', message: err.message })
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [notify])

  function parseCsv(text) {
    const rows = []
    let current = ''
    let inQuotes = false
    let row = []

    for (let index = 0; index < text.length; index += 1) {
      const char = text[index]
      const next = text[index + 1]

      if (char === '"' && inQuotes && next === '"') {
        current += '"'
        index += 1
        continue
      }

      if (char === '"') {
        inQuotes = !inQuotes
        continue
      }

      if (char === ',' && !inQuotes) {
        row.push(current)
        current = ''
        continue
      }

      if ((char === '\n' || char === '\r') && !inQuotes) {
        if (char === '\r' && next === '\n') index += 1
        row.push(current)
        current = ''
        if (row.some((value) => String(value).trim() !== '')) {
          rows.push(row)
        }
        row = []
        continue
      }

      current += char
    }

    row.push(current)
    if (row.some((value) => String(value).trim() !== '')) rows.push(row)
    return rows
  }

  async function handleSelectFile(event) {
    const file = event.target.files?.[0]
    setUploadMessage('')
    setSelectedFile(file || null)
    setParsedPreview({ columns: [], rows: [] })

    if (!file) return

    const name = file.name.toLowerCase()
    if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
      setUploadMessage('Excel parsing is scaffolded. Install an Excel parser (e.g. xlsx) or upload CSV for now.')
      return
    }

    if (!name.endsWith('.csv')) {
      setUploadMessage('Unsupported file type. Please upload a CSV or Excel file.')
      return
    }

    try {
      const text = await file.text()
      const matrix = parseCsv(text)
      if (!matrix.length) {
        setUploadMessage('No rows found in the CSV file.')
        return
      }

      const header = matrix[0].map((value, idx) => (String(value || '').trim() || `column_${idx + 1}`))
      const bodyRows = matrix.slice(1)
      const rows = bodyRows.slice(0, 200).map((cells, rowIndex) => {
        const obj = { __row: rowIndex + 1 }
        header.forEach((key, colIndex) => {
          obj[key] = cells[colIndex] ?? ''
        })
        return obj
      })

      setParsedPreview({ columns: header, rows })
    } catch (err) {
      setUploadMessage(err.message || 'Failed to parse file.')
    }
  }

  const filteredPreviewRows = useMemo(() => {
    const q = tableQuery.trim().toLowerCase()
    const base = parsedPreview.rows || []
    const filtered = !q
      ? base
      : base.filter((row) =>
          parsedPreview.columns.some((col) => String(row[col] ?? '').toLowerCase().includes(q))
        )

    if (!sortKey) return filtered

    const dir = sortDir === 'desc' ? -1 : 1
    return [...filtered].sort((a, b) => {
      const av = String(a[sortKey] ?? '')
      const bv = String(b[sortKey] ?? '')
      if (av === bv) return 0
      return av > bv ? dir : -dir
    })
  }, [parsedPreview, sortDir, sortKey, tableQuery])

  async function handleSaveUpload() {
    if (!selectedFile) return
    if (!parsedPreview.columns.length) {
      notify({ tone: 'error', message: 'Parse a CSV file before saving.' })
      return
    }

    setUploading(true)
    setUploadMessage('')
    try {
      const payload = {
        file_name: selectedFile.name,
        file_type: 'CSV',
        mime_type: selectedFile.type || 'text/csv',
        parsed_data: {
          columns: parsedPreview.columns,
          rows: parsedPreview.rows,
        },
      }

      await apiFetch('/api/hospital-files', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      const uploadsData = await apiFetch('/api/hospital-files')
      setUploads(Array.isArray(uploadsData) ? uploadsData : [])
      setUploadMessage('Upload saved.')
    } catch (err) {
      setUploadMessage(err.message)
    } finally {
      setUploading(false)
    }
  }

  const patientsPerDepartment = useMemo(() => {
    const rows = reportData?.patientsPerDepartment || []
    return rows.map((row) => ({ name: row.name, patients: Number(row.patient_count || 0) }))
  }, [reportData])

  const doctorWorkload = useMemo(() => {
    const rows = reportData?.doctorWorkload || []
    return rows.map((row) => ({ name: row.name, appointments: Number(row.appointment_count || 0) }))
  }, [reportData])

  const roomAllocation = useMemo(() => {
    const rows = reportData?.roomAllocation || []
    return rows.map((row) => ({ name: row.status, value: Number(row.count || 0) }))
  }, [reportData])

  const emergencyStats = useMemo(() => {
    const rows = reportData?.emergencyStats || []
    return rows.map((row) => ({ name: row.severity, cases: Number(row.count || 0) }))
  }, [reportData])

  const statTotals = useMemo(() => {
    const patients = patientsPerDepartment.reduce((sum, row) => sum + row.patients, 0)
    const appointments = doctorWorkload.reduce((sum, row) => sum + row.appointments, 0)
    const rooms = roomAllocation.reduce((sum, row) => sum + row.value, 0)
    const emergencies = emergencyStats.reduce((sum, row) => sum + row.cases, 0)
    return { patients, appointments, rooms, emergencies }
  }, [doctorWorkload, emergencyStats, patientsPerDepartment, roomAllocation])

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
          <StatCard icon={Users} label="Patients / Department" value={String(statTotals.patients)} note="Grouped by department" />
          <StatCard icon={Stethoscope} label="Doctor Workload" value={String(statTotals.appointments)} note="Appointments per doctor" />
          <StatCard icon={Bed} label="Room Allocation" value={String(statTotals.rooms)} note="Available, occupied, maintenance" />
          <StatCard icon={Activity} label="Emergency Cases" value={String(statTotals.emergencies)} note="Cases by severity" />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 font-bold text-slate-900 dark:text-white">Patients Per Department</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={patientsPerDepartment}>
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
                <BarChart data={doctorWorkload}>
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
            <h2 className="mb-4 font-bold text-slate-900 dark:text-white">Room Allocation</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={roomAllocation} dataKey="value" nameKey="name" outerRadius={95} label>
                    {roomAllocation.map((entry, index) => (
                      <Cell key={entry.name} fill={['#16a34a', '#dc2626', '#f59e0b', '#64748b'][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 font-bold text-slate-900 dark:text-white">Emergency Cases by Severity</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={emergencyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cases" fill="#0f766e" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {isLoading && (
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">Loading report data…</p>
        )}

        <section className="mt-8 grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-2 font-bold text-slate-900 dark:text-white">Upload (CSV/Excel)</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Upload hospital-related files. CSV preview is parsed locally and stored in the database.
            </p>

            <div className="mt-4 space-y-3">
              {!canUpload && (
                <p className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  You don&apos;t have permission to upload files.
                </p>
              )}

              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleSelectFile}
                disabled={!canUpload}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />

              <div className="flex flex-wrap items-center gap-3">
                <input
                  value={tableQuery}
                  onChange={(e) => setTableQuery(e.target.value)}
                  placeholder="Search preview…"
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleSaveUpload}
                  disabled={!canUpload || uploading || !selectedFile || parsedPreview.rows.length === 0}
                  className="rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {uploading ? 'Saving…' : 'Save upload'}
                </button>
              </div>

              {uploadMessage && (
                <p className="rounded-2xl bg-slate-100 p-4 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {uploadMessage}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-2 font-bold text-slate-900 dark:text-white">Saved Uploads</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Latest uploaded files for this hospital tenant.
            </p>

            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase tracking-widest text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Uploaded</th>
                  </tr>
                </thead>
                <tbody>
                  {uploads.map((file) => (
                    <tr key={file.id} className="border-t border-slate-200 dark:border-slate-700">
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">{file.file_name}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{file.file_type}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{file.created_at}</td>
                    </tr>
                  ))}
                  {uploads.length === 0 && (
                    <tr className="border-t border-slate-200 dark:border-slate-700">
                      <td colSpan={3} className="px-4 py-4 text-slate-500 dark:text-slate-400">
                        No uploads yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {parsedPreview.rows.length > 0 && (
          <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <h2 className="font-bold text-slate-900 dark:text-white">Preview</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Showing up to {parsedPreview.rows.length} rows (first 200) from the uploaded file.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase text-slate-500 dark:bg-slate-800">
                  <tr>
                    {parsedPreview.columns.map((col) => (
                      <th
                        key={col}
                        className="px-5 py-3 cursor-pointer select-none"
                        onClick={() => {
                          if (sortKey === col) {
                            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
                          } else {
                            setSortKey(col)
                            setSortDir('asc')
                          }
                        }}
                      >
                        {col}{sortKey === col ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredPreviewRows.map((row) => (
                    <tr key={row.__row} className="border-t border-slate-100 dark:border-slate-800 dark:text-slate-200">
                      {parsedPreview.columns.map((col) => (
                        <td key={`${row.__row}:${col}`} className="px-5 py-3">
                          {String(row[col] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {filteredPreviewRows.length === 0 && (
                    <tr className="border-t border-slate-100 dark:border-slate-800">
                      <td colSpan={parsedPreview.columns.length} className="px-5 py-6 text-sm text-slate-500 dark:text-slate-400">
                        No rows match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
