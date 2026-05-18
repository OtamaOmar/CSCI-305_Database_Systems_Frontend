import { MapPin, Navigation, Building2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import TopBar from '../components/TopBar'
import useAlert from '../hooks/useAlert'
import { getLocations } from './hospitalApi'

export default function HospitalLocationsPage() {
  const { notify } = useAlert()
  const [locations, setLocations] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      setIsLoading(true)
      try {
        const data = await getLocations()
        if (!isMounted) return
        setLocations(Array.isArray(data) ? data : [])
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <TopBar activePath="/hospital-locations" showNotifications showUserMenu />

      <main className="mx-auto max-w-7xl px-5 py-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
          Hospital Locations
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
          Hospital Locations & Geo Features
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Covers hospital locations, nearest hospital department, distance, availability,
          and maps integration placeholder.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
              <MapPin size={22} />
              Hospital Location List
            </h2>

            <div className="space-y-4">
              {isLoading && (
                <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  Loading locations…
                </div>
              )}

              {locations.map((location) => (
                <div
                  key={location.id}
                  className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {location.name}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {location.type}
                      </p>
                    </div>

                    <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">
                      {location.type}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
                    <p className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800 dark:text-slate-200">
                      Address: {location.address}
                    </p>
                    <p className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800 dark:text-slate-200">
                      Coordinates: {location.latitude ?? '—'}, {location.longitude ?? '—'}
                    </p>
                  </div>
                </div>
              ))}

              {!isLoading && locations.length === 0 && (
                <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  No locations configured yet. (Phase 2 module placeholder)
                </div>
              )}
            </div>
          </section>

          <section className="flex min-h-[420px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div>
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-brand/10 text-brand">
                <Navigation size={34} />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Map Integration Mockup
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm text-slate-500 dark:text-slate-400">
                This frontend area is prepared for future map integration. It can later connect
                to a maps API to show nearest departments, ambulance routes, and hospital zones.
              </p>

              <div className="mt-6 grid gap-3 text-left sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
                  <Building2 className="mb-2 text-brand" size={22} />
                  <p className="font-semibold text-slate-900 dark:text-white">Nearest Department</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Emergency Department</p>
                </div>

                <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
                  <MapPin className="mb-2 text-brand" size={22} />
                  <p className="font-semibold text-slate-900 dark:text-white">Distance</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">0.1 km from entrance</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
