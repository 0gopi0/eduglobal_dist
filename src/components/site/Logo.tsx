import { cn } from '../../lib/cn'

/**
 * The full brand lockup: the EG globe emblem with the EduGlobal Innovations
 * name and tagline. The name is part of the artwork, so no text is set beside
 * it. The image has a transparent ground, so it sits directly on both the
 * light header and the dark footer.
 */
export function Logo({
  inverse = false,
  className,
}: {
  inverse?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center',
        inverse && 'rounded-2xl bg-white px-3 py-2',
        className,
      )}
    >
      <img
        src="/brand/logo-full.png"
        alt="EduGlobal Innovations"
        width={1228}
        height={453}
        className={cn('w-auto', inverse ? 'h-11' : 'h-10 sm:h-11')}
      />
    </span>
  )
}
