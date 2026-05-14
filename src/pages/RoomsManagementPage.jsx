import { Bed, CalendarCheck, DoorOpen } from 'lucide-react'
import { useState } from 'react'
import TopBar from '../components/TopBar'
import { createRoomReservation } from './hospitalApi'
import { getStatusClass, mockRooms } from './hospitalData'

function Badge({ value }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(value)}`}>
      {value}
    </span>
  )
}

export default function RoomsManagementPage() {
  const [message, setMessage] = useState('')

  async function handleReserve(event) {
    event.preventDefault()

    const data = new FormData(event.target)

    const reservation = {
      patient: data.get('patient'),
      roomType: data.get('roomType'),
      date: data.get('date'),
      notes: data.get('notes'),
    }

    try {
      await createRoomReservation(reservation)
      setMessage('Room reservation saved through backend API.')
    } catch {
      setMessage('Demo mode: room reservation form is ready for backend integration.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <TopBar activePath="/rooms-management" showNotifications showUserMenu />

      <main className="mx-auto max-w-7xl px-5 py-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
          Rooms Management
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
          ICU, Operation Rooms & Room Reservations
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Covers occupied/free rooms, ICU monitoring, operation room availability, treatment room
          reservations, assigned patients, and room details.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Rooms</p>
                <p className="mt-2 text-3xl font-bold dark:text-white">{mockRooms.length}</p>
              </div>
              <Bed className="text-brand" size={28} />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Free Rooms</p>
                <p className="mt-2 text-3xl font-bold dark:text-white">
                  {mockRooms.filter((room) => room.status === 'Free').length}
                </p>
              </div>
              <DoorOpen className="text-brand" size={28} />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Reserved Rooms</p>
                <p className="mt-2 text-3xl font-bold dark:text-white">
                  {mockRooms.filter((room) => room.status === 'Reserved').length}
                </p>
              </div>
              <CalendarCheck className="text-brand" size={28} />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <section className="xl:col-span-2">
            <div className="grid gap-4 md:grid-cols-2">
              {mockRooms.map((room) => (
                <div
                  key={room.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <Bed className="text-brand" />
                    <Badge value={room.status} />
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{room.id}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{room.type}</p>

                  <div className="mt-4 space-y-2 text-sm">
                    <p className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800 dark:text-slate-200">
                      Assigned Patient: {room.patient}
                    </p>
                    <p className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800 dark:text-slate-200">
                      Room Info: {room.monitor}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
              Room Reservation
            </h2>

            <form onSubmit={handleReserve} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold dark:text-slate-200">
                  Patient Name
                </label>
                <input
                  name="patient"
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold dark:text-slate-200">
                  Room Type
                </label>
                <select
                  name="roomType"
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option>ICU</option>
                  <option>Operation Room</option>
                  <option>Treatment Room</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold dark:text-slate-200">
                  Reservation Date
                </label>
                <input
                  name="date"
                  type="date"
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold dark:text-slate-200">
                  Notes
                </label>
                <textarea
                  name="notes"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <button className="w-full rounded-2xl bg-brand px-5 py-3 font-semibold text-white">
                Reserve Room
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