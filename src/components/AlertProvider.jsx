import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { AlertContext } from './AlertContext'

const toneStyles = {
  info: {
    card: 'border-sky-200/80 bg-white text-slate-900 shadow-xl shadow-slate-900/10 dark:border-sky-900/60 dark:bg-slate-900 dark:text-slate-100',
    icon: 'text-sky-600 dark:text-sky-300',
    iconWrap: 'bg-sky-100 dark:bg-sky-950/60',
    button: 'bg-sky-600 text-white hover:bg-sky-500',
  },
  success: {
    card: 'border-emerald-200/80 bg-white text-slate-900 shadow-xl shadow-emerald-900/10 dark:border-emerald-900/60 dark:bg-slate-900 dark:text-slate-100',
    icon: 'text-emerald-600 dark:text-emerald-300',
    iconWrap: 'bg-emerald-100 dark:bg-emerald-950/60',
    button: 'bg-emerald-600 text-white hover:bg-emerald-500',
  },
  warning: {
    card: 'border-amber-200/80 bg-white text-slate-900 shadow-xl shadow-amber-900/10 dark:border-amber-900/60 dark:bg-slate-900 dark:text-slate-100',
    icon: 'text-amber-600 dark:text-amber-300',
    iconWrap: 'bg-amber-100 dark:bg-amber-950/60',
    button: 'bg-amber-600 text-white hover:bg-amber-500',
  },
  error: {
    card: 'border-rose-200/80 bg-white text-slate-900 shadow-xl shadow-rose-900/10 dark:border-rose-900/60 dark:bg-slate-900 dark:text-slate-100',
    icon: 'text-rose-600 dark:text-rose-300',
    iconWrap: 'bg-rose-100 dark:bg-rose-950/60',
    button: 'bg-rose-600 text-white hover:bg-rose-500',
  },
}

const toneTitles = {
  info: 'Notice',
  success: 'Success',
  warning: 'Attention',
  error: 'Error',
}

const toneIcons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
}

function createId() {
  return `alert-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([])
  const [confirmState, setConfirmState] = useState(null)
  const timeoutMap = useRef(new Map())

  const dismissAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
    const timeout = timeoutMap.current.get(id)
    if (timeout) {
      clearTimeout(timeout)
      timeoutMap.current.delete(id)
    }
  }, [])

  const notify = useCallback(
    ({ message, title, tone = 'info', duration = 4500 } = {}) => {
      const id = createId()
      const safeTone = toneStyles[tone] ? tone : 'info'
      setAlerts((prev) => [
        ...prev,
        {
          id,
          message: String(message || ''),
          title: title || toneTitles[safeTone],
          tone: safeTone,
        },
      ])

      if (duration > 0) {
        const timeout = setTimeout(() => {
          dismissAlert(id)
        }, duration)
        timeoutMap.current.set(id, timeout)
      }
    },
    [dismissAlert],
  )

  const confirm = useCallback(
    ({
      title = 'Please confirm',
      message = '',
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      tone = 'warning',
    } = {}) => {
      return new Promise((resolve) => {
        const safeTone = toneStyles[tone] ? tone : 'warning'
        setConfirmState({
          id: createId(),
          title,
          message: String(message),
          confirmText,
          cancelText,
          tone: safeTone,
          resolve,
        })
      })
    },
  )

  const handleConfirm = useCallback(() => {
    setConfirmState((current) => {
      if (current?.resolve) current.resolve(true)
      return null
    })
  }, [])

  const handleCancel = useCallback(() => {
    setConfirmState((current) => {
      if (current?.resolve) current.resolve(false)
      return null
    })
  }, [])

  useEffect(() => {
    return () => {
      timeoutMap.current.forEach((timeout) => clearTimeout(timeout))
      timeoutMap.current.clear()
    }
  }, [])

  useEffect(() => {
    if (!confirmState) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleCancel()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [confirmState, handleCancel])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const nativeAlert = window.alert
    window.alert = (message) => notify({ message, tone: 'info' })

    return () => {
      window.alert = nativeAlert
    }
  }, [notify])

  const contextValue = useMemo(() => ({ notify, confirm }), [notify, confirm])

  return (
    <AlertContext.Provider value={contextValue}>
      {children}

      <div className="pointer-events-none fixed inset-x-4 top-4 z-[80] flex flex-col items-end gap-3 sm:inset-auto sm:right-6 sm:top-6">
        {alerts.map((alert) => {
          const Icon = toneIcons[alert.tone] || Info
          const styles = toneStyles[alert.tone] || toneStyles.info

          return (
            <div
              key={alert.id}
              role="status"
              className={`pointer-events-auto w-full max-w-sm rounded-2xl border px-4 py-4 backdrop-blur ${styles.card}`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${styles.iconWrap}`}>
                  <Icon className={`h-5 w-5 ${styles.icon}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold tracking-wide">
                    {alert.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {alert.message}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => dismissAlert(alert.id)}
                  className="rounded-xl border border-transparent p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  aria-label="Dismiss alert"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {confirmState && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-start gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneStyles[confirmState.tone].iconWrap}`}>
                {(() => {
                  const Icon = toneIcons[confirmState.tone] || AlertTriangle
                  return <Icon className={`h-6 w-6 ${toneStyles[confirmState.tone].icon}`} />
                })()}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {confirmState.title}
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {confirmState.message}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {confirmState.cancelText}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${toneStyles[confirmState.tone].button}`}
              >
                {confirmState.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  )
}
