import { cn } from '@/lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'coral'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: 'sm' | 'md' | 'lg'
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-cadu-pink to-cadu-coral text-white shadow-cadu hover:brightness-105',
  secondary: 'bg-white text-cadu-ink border-2 border-cadu-pink/30 hover:border-cadu-coral/50',
  ghost: 'bg-transparent text-cadu-ink hover:bg-white/70',
  coral: 'bg-cadu-coral text-white shadow-cadu hover:brightness-105',
}

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-2xl',
  md: 'px-6 py-3 text-base rounded-3xl',
  lg: 'px-8 py-4 text-lg rounded-3xl min-h-[56px]',
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all active:scale-[0.98] disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
