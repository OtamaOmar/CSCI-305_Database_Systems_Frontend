import { Link } from '@tanstack/react-router'
import { HeartPulse } from 'lucide-react'

export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text lg:grid-cols-2">
      {/* Left - form */}
      <div className="flex flex-col bg-light-card px-6 py-8 sm:px-12 dark:bg-dark-card">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-light-text text-light-card dark:bg-dark-text dark:text-dark-bg">
            <HeartPulse className="h-4 w-4" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-light-text dark:text-dark-text">
            Pulse<span className="text-brand">ED</span>
          </span>
        </Link>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <h1 className="text-2xl font-semibold tracking-tight text-light-text dark:text-dark-text">{title}</h1>
          <p className="mt-1.5 text-[13px] text-light-secondary/70 dark:text-dark-text/70">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-center text-[12.5px] text-light-secondary/70 dark:text-dark-text/70">{footer}</div>
        </div>

        <p className="text-[11px] text-light-secondary/70 dark:text-dark-text/70">
          (c) {new Date().getFullYear()} PulseED. All rights reserved.
        </p>
      </div>

      {/* Right - brand panel */}
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 bg-linear-to-br from-light-secondary via-brand to-light-accentSoft dark:from-dark-bg dark:via-dark-accent dark:to-brand" />
        <div className="absolute inset-0 bg-light-card/10 dark:bg-dark-card/30" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-wider backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FB7185]" />
            Live - v3.2
          </div>

          <div>
            <p className="max-w-md text-2xl font-medium leading-snug tracking-tight">
              "PulseED cut our average triage time by 31% in the first quarter - it's now part of every shift."
            </p>
            <p className="mt-5 text-[13px] text-white/70">
              Dr. Hana Reyes - Chief of Emergency Medicine, St. Mercy General
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
