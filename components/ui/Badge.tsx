import { cn } from '@/lib/cn'

export function Badge({
  children,
  tone = 'pink',
  className,
}: {
  children: React.ReactNode
  tone?: 'pink' | 'coral' | 'mint' | 'lavender' | 'cream'
  className?: string
}) {
  const tones = {
    pink: 'bg-cadu-pink/30 text-cadu-ink',
    coral: 'bg-cadu-coral/20 text-cadu-coral',
    mint: 'bg-cadu-mint/30 text-emerald-800',
    lavender: 'bg-cadu-lavender/40 text-violet-800',
    cream: 'bg-cadu-cream text-cadu-ink',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
