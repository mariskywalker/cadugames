import { cn } from '@/lib/cn'

export function Card({
  className,
  children,
  hover = false,
}: {
  className?: string
  children: React.ReactNode
  hover?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-3xl bg-white/90 backdrop-blur-sm border border-white/60 shadow-cadu p-4 md:p-5',
        hover && 'transition-transform hover:-translate-y-0.5 hover:shadow-cadu-lg',
        className,
      )}
    >
      {children}
    </div>
  )
}
