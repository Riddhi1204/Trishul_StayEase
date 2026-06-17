import { ReactNode, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

/** Props for the Modal component */
export interface ModalProps {
  /** Whether the modal is visible */
  isOpen: boolean
  /** Callback fired when the modal should close */
  onClose: () => void
  /** Modal heading */
  title?: string
  /** Content rendered inside the modal body */
  children: ReactNode
  /** Optional footer content */
  footer?: ReactNode
  /** Controls max width of the panel */
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeMap: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
}

/**
 * Accessible Modal with backdrop, ESC-to-close, outside-click-to-close,
 * focus trap awareness, and smooth fade+slide animation.
 *
 * @example
 * <Modal isOpen={open} onClose={() => setOpen(false)} title="Confirm Booking">
 *   <p>Are you sure you want to book?</p>
 * </Modal>
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  // ESC key handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={[
          'relative w-full bg-white dark:bg-slate-900',
          'rounded-2xl shadow-2xl dark:shadow-black/60',
          'border border-slate-200 dark:border-slate-700',
          'animate-slide-up',
          sizeMap[size],
        ].join(' ')}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          {title && (
            <h2
              id="modal-title"
              className="text-lg font-bold text-slate-900 dark:text-white font-outfit"
            >
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className={[
              'ml-auto flex items-center justify-center w-8 h-8 rounded-full',
              'text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200',
              'hover:bg-slate-100 dark:hover:bg-slate-800',
              'transition-colors duration-150',
            ].join(' ')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
