import React, { InputHTMLAttributes, ReactNode, useId } from 'react'

/** Supported visual variants for the Input */
type InputVariant = 'default' | 'error'

/** Props for the reusable Input component */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  /** Label text displayed above the input */
  label?: string
  /** Helper text shown below the input */
  helperText?: string
  /** Error message — switches input to error variant when provided */
  error?: string
  /** Visual variant (overridden automatically when error is set) */
  variant?: InputVariant
  /** Left icon / adornment */
  leftIcon?: ReactNode
  /** Right icon / adornment */
  rightIcon?: ReactNode
}

/**
 * Reusable Input component with label, helper text, error state, and icon support.
 *
 * @example
 * <Input label="Email" placeholder="you@example.com" error="Required" />
 * <Input label="Search" leftIcon={<SearchIcon />} helperText="Type to filter" />
 */
export function Input({
  label,
  helperText,
  error,
  variant = 'default',
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...rest
}: InputProps) {
  const id = useId()
  const hasError = !!error
  const resolvedVariant: InputVariant = hasError ? 'error' : variant

  const baseInput =
    'w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ' +
    'placeholder:text-slate-400 dark:placeholder:text-slate-500 ' +
    'rounded-lg px-3 py-2.5 text-sm outline-none transition-all duration-200 ' +
    'focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variantInput: Record<InputVariant, string> = {
    default:
      'border border-slate-300 dark:border-slate-600 ' +
      'focus:border-primary-500 focus:ring-primary-500/20',
    error:
      'border border-red-400 dark:border-red-500 ' +
      'focus:border-red-500 focus:ring-red-400/20',
  }

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-semibold text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3 text-slate-400 dark:text-slate-500 pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          id={id}
          disabled={disabled}
          className={[
            baseInput,
            variantInput[resolvedVariant],
            leftIcon  ? 'pl-9'  : '',
            rightIcon ? 'pr-9'  : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          aria-describedby={hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          aria-invalid={hasError}
          {...rest}
        />
        {rightIcon && (
          <span className="absolute right-3 text-slate-400 dark:text-slate-500 pointer-events-none">
            {rightIcon}
          </span>
        )}
      </div>

      {hasError && (
        <p id={`${id}-error`} className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
      {!hasError && helperText && (
        <p id={`${id}-helper`} className="text-xs text-slate-500 dark:text-slate-400">
          {helperText}
        </p>
      )}
    </div>
  )
}
