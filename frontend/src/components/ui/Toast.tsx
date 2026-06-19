import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

/** Supported toast notification types */
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastContextValue {
  /** Show a toast notification */
  showToast: (message: string, type?: ToastType, duration?: number) => void
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
})

const typeConfig: Record<ToastType, { icon: string; classes: string }> = {
  success: {
    icon: '✅',
    classes: 'bg-green-50 border-green-400 text-green-800 dark:bg-green-900/40 dark:border-green-500 dark:text-green-200',
  },
  error: {
    icon: '❌',
    classes: 'bg-red-50 border-red-400 text-red-800 dark:bg-red-900/40 dark:border-red-500 dark:text-red-200',
  },
  warning: {
    icon: '⚠️',
    classes: 'bg-yellow-50 border-yellow-400 text-yellow-800 dark:bg-yellow-900/40 dark:border-yellow-500 dark:text-yellow-200',
  },
  info: {
    icon: 'ℹ️',
    classes: 'bg-blue-50 border-blue-400 text-blue-800 dark:bg-blue-900/40 dark:border-blue-500 dark:text-blue-200',
  },
}

/** Individual Toast item rendered inside the provider */
function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const { icon, classes } = typeConfig[toast.type]

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration ?? 3000)
    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onDismiss])

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={[
        'flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg',
        'text-sm font-medium min-w-[280px] max-w-sm',
        'animate-slide-up',
        classes,
      ].join(' ')}
    >
      <span className="text-base shrink-0">{icon}</span>
      <p className="flex-1 leading-snug">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

/**
 * Wrap your app in ToastProvider to enable toast notifications anywhere.
 * Use the `useToast` hook to trigger toasts from any component.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration = 3000) => {
      const id = `toast-${Date.now()}-${Math.random()}`
      setToasts(prev => [...prev, { id, type, message, duration }])
    },
    []
  )

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div
          aria-label="Notifications"
          className="fixed bottom-5 right-5 z-[99999] flex flex-col gap-3 items-end"
        >
          {toasts.map(toast => (
            <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}

/**
 * Hook to trigger toast notifications from any component inside ToastProvider.
 *
 * @example
 * const { showToast } = useToast()
 * showToast('Booking confirmed!', 'success')
 */
export function useToast() {
  return useContext(ToastContext)
}
