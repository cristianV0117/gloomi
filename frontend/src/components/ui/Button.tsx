import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'solid' | 'outline' | 'cta'

type Props = {
  children: ReactNode
  variant?: Variant
  className?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
  children,
  variant = 'solid',
  className = '',
  type = 'button',
  ...rest
}: Props) {
  const base =
    'inline-flex w-full items-center justify-center rounded-2xl px-5 py-3.5 text-sm font-semibold tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100 disabled:opacity-50'
  const styles: Record<Variant, string> = {
    solid: 'bg-zinc-100 text-zinc-950 hover:bg-white',
    outline:
      'border border-zinc-600 bg-transparent text-zinc-100 hover:border-zinc-400 hover:bg-zinc-900/60',
    cta:
      'border border-white/15 bg-gradient-to-br from-violet-600/95 to-rose-700/90 text-white shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.14)] hover:brightness-110',
  }
  return (
    <button type={type} className={`${base} ${styles[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}
