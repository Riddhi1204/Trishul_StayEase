import { ButtonHTMLAttributes, ReactNode } from 'react'

/** Supported visual styles for the Button */
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger'

/** Supported size presets for the Button */
type ButtonSize = 'sm' | 'md' | 'lg'

/** Props for the reusable Button component */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button */
  variant?: ButtonVariant
  /** Size preset */
  size?: ButtonSize
  /** Show a loading spinner and disable interaction */
  loading?: boolean
  /** Icon or text content */
  children: ReactNode
  /** Full-width button */
  fullWidth?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-600 hover:bg-primary-800 text-white shadow-md hover:shadow-lg',
  secondary:
    'bg-slate-200 hover:bg-slate-300 text-slate-800 ' +
    'dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100',
  outline:
    'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white ' +
    'dark:border-primary-400 dark:text-primary-300 dark:hover:bg-primary-700 dark:hover:text-white',
  danger:
    'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3 text-base gap-2.5',
}

/**
 * Reusable Button component.
 *
 * @example
 * <Button variant="primary" size="md">Save</Button>
 * <Button variant="danger" size="sm" loading>Deleting…</Button>
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      {...rest}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center font-semibold rounded-full',
        'transition-all duration-200 ease-in-out select-none',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        'active:scale-[0.97]',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </button>
  )
}
