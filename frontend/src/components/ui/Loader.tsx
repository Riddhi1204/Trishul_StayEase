/** Supported size keys for Loader */
type LoaderSize = 'sm' | 'md' | 'lg' | 'xl'

/** Props for the Spinner component */
export interface SpinnerProps {
  /** Controls the width/height of the spinner */
  size?: LoaderSize
  /** Additional Tailwind classes */
  className?: string
  /** Accessible label */
  label?: string
}

/** Props for the PageLoader component */
export interface PageLoaderProps {
  /** Show a full-screen overlay instead of inline */
  fullscreen?: boolean
  /** Custom loading message */
  message?: string
}

const spinnerSize: Record<LoaderSize, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-[3px]',
  lg: 'w-12 h-12 border-4',
  xl: 'w-16 h-16 border-4',
}

/**
 * Lightweight spinning loader — use inline wherever a loading state is needed.
 *
 * @example
 * <Spinner size="md" label="Loading cards..." />
 */
export function Spinner({ size = 'md', className = '', label = 'Loading…' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={[
        'inline-block rounded-full animate-spin',
        'border-primary-200 dark:border-primary-900',
        'border-t-primary-600 dark:border-t-primary-400',
        spinnerSize[size],
        className,
      ].join(' ')}
    />
  )
}

/**
 * Full-page or section-level loader with branding and optional message.
 * Set `fullscreen` for a fixed overlay covering the whole viewport.
 *
 * @example
 * <PageLoader fullscreen message="Fetching stays…" />
 */
export function PageLoader({ fullscreen = false, message = 'Loading…' }: PageLoaderProps) {
  const wrapClass = fullscreen
    ? 'fixed inset-0 z-[9998] bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm'
    : 'w-full py-24'

  return (
    <div className={`${wrapClass} flex flex-col items-center justify-center gap-5`}>
      {/* Animated logo mark */}
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-primary-600/10 dark:bg-primary-400/10 flex items-center justify-center">
          <span className="text-3xl animate-bounce">🌿</span>
        </div>
        <Spinner
          size="xl"
          className="absolute inset-0"
          label={message}
        />
      </div>

      <div className="text-center">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{message}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Trishul StayEase</p>
      </div>
    </div>
  )
}
