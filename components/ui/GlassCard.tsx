import { cn } from '@/lib/cn'

export function GlassCard({
  className,
  children,
  glow = false,
  tone = 'dark',
}: {
  className?: string
  children: React.ReactNode
  glow?: boolean
  /** 'dark' = sobre fundo dreamscape; 'light' = sobre fundo claro */
  tone?: 'dark' | 'light'
}) {
  return (
    <div
      className={cn(
        'rounded-3xl backdrop-blur-xl p-4 md:p-5',
        tone === 'light'
          ? 'border border-white/70 bg-white/65 text-cadu-ink shadow-[0_10px_30px_rgba(120,100,140,0.10)]'
          : 'border border-white/25 bg-white/15 text-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]',
        glow && (tone === 'light' ? 'ring-1 ring-white/80' : 'ring-1 ring-white/30'),
        className,
      )}
    >
      {children}
    </div>
  )
}
