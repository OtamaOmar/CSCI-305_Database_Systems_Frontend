import { Link } from '@tanstack/react-router'
import { Bell, Contact, HeartPulse, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

const defaultNavItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Charts', to: '/charts' },
]

const allowedTopbarPaths = new Set(['/dashboard', '/charts'])

function TopBar({
  navItems = defaultNavItems,
  activePath = typeof window !== 'undefined' ? window.location.pathname : '',
  isDark,
  onToggleTheme,
  showContact = false,
  showNotifications = true,
  notificationsAsLink = false,
  showUserMenu = false,
  heightClass = 'h-16',
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const [internalIsDark, setInternalIsDark] = useState(() => {
    if (typeof window === 'undefined') return false

    const savedTheme = localStorage.getItem('theme')

    if (savedTheme === 'dark') return true
    if (savedTheme === 'light') return false

    return (
      document.documentElement.classList.contains('dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    )
  })

  const currentIsDark = typeof isDark === 'boolean' ? isDark : internalIsDark

  useEffect(() => {
    if (typeof window === 'undefined') return

    document.documentElement.classList.toggle('dark', currentIsDark)
    localStorage.setItem('theme', currentIsDark ? 'dark' : 'light')
  }, [currentIsDark])

  function handleThemeToggle() {
    if (onToggleTheme) {
      onToggleTheme()
      return
    }

    setInternalIsDark((value) => !value)
  }

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
    : 'Signed in user'

  const displayMeta = currentUser?.hospital || currentUser?.role || 'PulseED'

  const displayInitials = currentUser
    ? [currentUser.first_name, currentUser.last_name]
        .filter(Boolean)
        .map((value) => value.charAt(0))
        .join('')
        .toUpperCase() || currentUser.email?.charAt(0)?.toUpperCase() || 'U'
    : 'U'

  const filteredNavItems = (Array.isArray(navItems) ? navItems : defaultNavItems).filter((item) =>
    allowedTopbarPaths.has(item.to)
  )
  const visibleNavItems = filteredNavItems.length > 0 ? filteredNavItems : defaultNavItems

  return (
    <header className="border-b border-slate-200 bg-slate-100/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className={`mx-auto flex ${heightClass} w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8`}>
        <div className="flex min-w-0 flex-1 items-center gap-6">
          <div className="flex shrink-0 items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-white dark:bg-slate-50 dark:text-slate-950">
              <HeartPulse className="h-4 w-4" />
            </div>

            <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Pulse<span className="text-brand">ED</span>
            </p>
          </div>

          {visibleNavItems.length > 0 && (
            <nav className="hidden min-w-0 flex-1 items-center gap-2 overflow-x-auto whitespace-nowrap text-sm md:flex">
              {visibleNavItems.map((item) => {
                const isActive = item.isActive ?? item.to === activePath

                const className = isActive
                  ? 'rounded-xl bg-slate-200 px-4 py-2 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  : 'rounded-xl px-4 py-2 font-semibold text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'

                return (
                  <Link key={item.to} to={item.to} className={className}>
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleThemeToggle}
            aria-label={currentIsDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {currentIsDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {showContact && (
            <Link
              to="/contact-us"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Contact className="h-4 w-4" />
              Contact
            </Link>
          )}

          {showNotifications &&
            (notificationsAsLink ? (
              <Link
                to="/notifications"
                className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
              </Link>
            ) : (
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
              </button>
            ))}

          {showUserMenu && (
            <div className="relative hidden items-center gap-2.5 sm:flex">
              <button
                type="button"
                onClick={() => setIsMenuOpen((value) => !value)}
                className="flex items-center gap-2.5 rounded-xl px-2 py-1 transition hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {displayInitials}
                </div>

                <div className="leading-tight text-left">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {displayName}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {displayMeta}
                  </p>
                </div>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-full z-20 mt-2 w-44 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                  <Link
                    to="/settings"
                    onClick={() => setIsMenuOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Settings
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Profile settings
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default TopBar
