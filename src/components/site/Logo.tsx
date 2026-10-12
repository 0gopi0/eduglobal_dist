import { cn } from '../../lib/cn'

/**
 * The full brand lockup: the EG globe emblem with the EduGlobal Innovations
 * name and tagline. The name is part of the artwork, so no text is set beside
 * it. The image has an opaque white ground; on dark surfaces it sits on a
 * white tile so it doesn't read as a bare white box.
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
        inverse && 'rounded-xl bg-white p-2',
        className,
      )}
    >
      <img
        src="/brand/logo-full.png"
        alt="EduGlobal Innovations"
        width={836}
        height={298}
        className={cn('w-auto', inverse ? 'h-12' : 'h-11')}
      />
    </span>
  )
}
