import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useAlert } from '../components/AlertProvider'
import { Headset, Hospital, Mail, MapPin, Phone, Send, Sun, Moon } from 'lucide-react'

function ContactUs() {
  const { notify } = useAlert()
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false

    return (
      document.documentElement.classList.contains('dark')
      || window.matchMedia('(prefers-color-scheme: dark)').matches
    )
  })
  const [currentUser] = useState(() => {
    if (typeof window === 'undefined') return null

    try {
      const storedUser = localStorage.getItem('user')
      return storedUser ? JSON.parse(storedUser) : null
    } catch {
      return null
    }
  })

  const displayName = currentUser
    ? [currentUser.first_name, currentUser.last_name].filter(Boolean).join(' ') || currentUser.email
    : ''

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  function handleSubmit(event) {
    event.preventDefault()
    notify({
      tone: 'success',
      title: 'Message sent',
      message: 'Your message has been submitted successfully.',
    })
    event.currentTarget.reset()
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-slate-100/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-white dark:bg-slate-50 dark:text-slate-950">
              <Hospital className="h-4 w-4" />
            </div>
            <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Pulse<span className="text-brand">ED</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsDark((value) => !value)}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Link
              to="/dashboard"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-slate-200 bg-white/95 shadow-xl dark:border-slate-700 dark:bg-slate-900/95">
          <div className="grid gap-0 lg:grid-cols-[1fr_1.35fr]">
            <aside className="rounded-t-[28px] bg-slate-50 p-6 dark:bg-slate-900/60 lg:rounded-l-[28px] lg:rounded-tr-none lg:border-r lg:border-slate-200 dark:lg:border-slate-700">
              <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                Contact center
              </p>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Contact Us</h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Submit an inquiry or support request and our hospital operations team will respond quickly.
              </p>

              <div className="mt-6 space-y-3">
                <article className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Hospital contact information</p>
                  <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand" /> St. Mercy General Hospital, Emergency Wing, Main Street</p>
                    <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-brand" /> +1 (555) 010-2380</p>
                    <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand" /> support@pulseed-hospital.org</p>
                  </div>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Support requests</p>
                  <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                    <li className="flex items-center gap-2"><Headset className="h-4 w-4 text-brand" /> Technical support for login and dashboard issues</li>
                    <li className="flex items-center gap-2"><Headset className="h-4 w-4 text-brand" /> Patient and doctor record assistance</li>
                    <li className="flex items-center gap-2"><Headset className="h-4 w-4 text-brand" /> Emergency workflow and reporting help</li>
                  </ul>
                </article>
              </div>
            </aside>

            <section className="rounded-b-[28px] p-6 lg:rounded-r-[28px] lg:rounded-bl-none">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Inquiry Form</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Please provide complete details so we can route your request to the right team.</p>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-1.5">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Full name</span>
                    <input
                      name="fullName"
                      type="text"
                      required
                      placeholder="Your full name"
                      defaultValue={displayName}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                    />
                  </label>

                  <label className="space-y-1.5">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</span>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="you@hospital.org"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                    />
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-1.5">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone</span>
                    <input
                      name="phone"
                      type="tel"
                      required
                      placeholder="+1 555 000 0000"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                    />
                  </label>

                  <label className="space-y-1.5">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Request type</span>
                    <select
                      name="requestType"
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    >
                      <option value="">Select request type</option>
                      <option value="Inquiry">Inquiry</option>
                      <option value="Support request">Support request</option>
                      <option value="Emergency coordination">Emergency coordination</option>
                    </select>
                  </label>
                </div>

                <label className="space-y-1.5 block">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Subject</span>
                  <input
                    name="subject"
                    type="text"
                    required
                    placeholder="Short summary of your request"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </label>

                <label className="space-y-1.5 block">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Message</span>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    placeholder="Explain your inquiry or support request in detail"
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </label>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand/90"
                  >
                    <Send className="h-4 w-4" />
                    Submit request
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ContactUs
