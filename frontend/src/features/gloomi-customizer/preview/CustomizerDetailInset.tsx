import { useTranslation } from 'react-i18next'
import type { CharmKind, DetailFocus, EyeKind, HatKind } from '../types'

type Props = {
  eyeKind: EyeKind
  hat: HatKind
  charm: CharmKind
  fabricHex: string
  focus: DetailFocus
  onFocusChange: (f: DetailFocus) => void
}

export function CustomizerDetailInset({
  eyeKind,
  hat,
  charm,
  fabricHex,
  focus,
  onFocusChange,
}: Props) {
  const { t } = useTranslation()
  const tabs: { id: DetailFocus; label: string }[] = [
    { id: 'eyes', label: t('detailInset.tabEyes') },
    { id: 'hat', label: t('detailInset.tabHat') },
    { id: 'charm', label: t('detailInset.tabCharm') },
  ]
  const caption =
    focus === 'eyes'
      ? t(`detailInset.eye.${eyeKind}`)
      : focus === 'hat'
        ? t(`detailInset.hat.${hat}`)
        : t(`detailInset.charm.${charm}`)

  return (
    <div
      className="pointer-events-auto absolute right-2 top-2 z-20 w-[8.25rem] rounded-xl border border-[rgb(201_38_74_/0.4)] bg-[rgb(12_8_10_/0.92)] p-2 shadow-[0_12px_40px_-8px_rgb(120_18_38_/0.55)] backdrop-blur-md sm:right-3 sm:top-3 sm:w-[9.25rem]"
      role="region"
      aria-label={t('customizer.detailAria')}
    >
      <p className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-500">
        {t('detailInset.zoomTitle')}
      </p>
      <div className="mb-2 flex gap-0.5 rounded-lg bg-zinc-950/80 p-0.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onFocusChange(tab.id)}
            className={`flex-1 rounded-md px-1 py-1 text-[10px] font-medium transition sm:text-[11px] ${focus === tab.id ? 'bg-[rgb(201_38_74_/0.35)] text-white shadow-inner' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-zinc-900/90 to-black/80 ring-1 ring-white/5">
        <svg
          viewBox="0 0 100 100"
          className="size-full"
          aria-hidden
        >
          <defs>
            <radialGradient id="insetGlow" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor={fabricHex} stopOpacity="0.35" />
              <stop offset="100%" stopColor="#09090b" stopOpacity="1" />
            </radialGradient>
          </defs>
          <rect width="100" height="100" fill="url(#insetGlow)" />
          {focus === 'eyes' && <EyeDetailArt kind={eyeKind} />}
          {focus === 'hat' && <HatDetailArt kind={hat} />}
          {focus === 'charm' && <CharmDetailArt kind={charm} />}
        </svg>
      </div>
      <p className="mt-1.5 truncate text-center text-[10px] leading-tight text-zinc-400">
        {caption}
      </p>
    </div>
  )
}

function EyeDetailArt({ kind }: { kind: EyeKind }) {
  switch (kind) {
    case 'round':
      return (
        <g transform="translate(50 52)">
          <circle r="22" fill="#27272a" stroke="#52525b" strokeWidth="1.5" />
          <circle r="14" fill="#fafafa" />
          <circle cx="4" cy="4" r="6" fill="#18181b" />
          <circle cx="-6" cy="-5" r="3" fill="#fff" opacity="0.85" />
        </g>
      )
    case 'slit':
      return (
        <g transform="translate(50 52)">
          <ellipse cx="-14" cy="0" rx="6" ry="18" fill="#0a0a0b" />
          <ellipse cx="14" cy="0" rx="6" ry="18" fill="#0a0a0b" />
          <ellipse cx="-14" cy="3" rx="2.5" ry="10" fill="#27272a" opacity="0.4" />
          <ellipse cx="14" cy="3" rx="2.5" ry="10" fill="#27272a" opacity="0.4" />
        </g>
      )
    case 'star':
      return (
        <g transform="translate(50 58)">
          <path
            d="M0,-26 L6,-8 L26,-8 L10,4 L16,24 L0,12 L-16,24 L-10,4 L-26,-8 L-6,-8 Z"
            fill="#fde047"
            stroke="#ca8a04"
            strokeWidth="1.2"
          />
          <circle cx="0" cy="2" r="5" fill="#451a03" opacity="0.35" />
        </g>
      )
    case 'heart':
      return (
        <g transform="translate(50 55) scale(1.15)">
          <path
            d="M0,12 C-18,-8 -28,8 -12,22 C-6,28 0,32 0,32 C0,32 6,28 12,22 C28,8 18,-8 0,12 Z"
            fill="#e11d48"
            stroke="#881337"
            strokeWidth="1.2"
          />
          <ellipse cx="-8" cy="6" rx="5" ry="7" fill="#fda4af" opacity="0.35" />
        </g>
      )
    case 'spiral':
      return (
        <g transform="translate(50 52)">
          <path
            d="M0,0 m-18,0 a18,18 0 1,1 36,0 a14,14 0 1,0 -28,0 a10,10 0 1,1 20,0"
            fill="none"
            stroke="#a78bfa"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle r="4" fill="#6d28d9" />
        </g>
      )
    case 'gem':
      return (
        <g transform="translate(50 54)">
          <path d="M0,-28 L22,-8 L14,22 L-14,22 L-22,-8 Z" fill="#22d3ee" stroke="#67e8f9" strokeWidth="1.5" />
          <path d="M0,-28 L0,22 M-22,-8 L22,-8" stroke="#cffafe" strokeWidth="0.8" opacity="0.6" />
          <circle cx="0" cy="-6" r="4" fill="#fff" opacity="0.45" />
        </g>
      )
    case 'button':
      return (
        <g transform="translate(50 52)">
          <circle cx="-16" cy="0" r="14" fill="#171717" stroke="#52525b" strokeWidth="2" />
          <circle cx="16" cy="0" r="14" fill="#171717" stroke="#52525b" strokeWidth="2" />
          <circle cx="-18.5" cy="-3.5" r="2.8" fill="#09090b" />
          <circle cx="-13.5" cy="-3.5" r="2.8" fill="#09090b" />
          <circle cx="-18.5" cy="3.5" r="2.8" fill="#09090b" />
          <circle cx="-13.5" cy="3.5" r="2.8" fill="#09090b" />
          <circle cx="13.5" cy="-3.5" r="2.8" fill="#09090b" />
          <circle cx="18.5" cy="-3.5" r="2.8" fill="#09090b" />
          <circle cx="13.5" cy="3.5" r="2.8" fill="#09090b" />
          <circle cx="18.5" cy="3.5" r="2.8" fill="#09090b" />
          <line x1="-22" y1="-8" x2="-10" y2="8" stroke="#e4e4e7" strokeWidth={1.8} strokeLinecap="round" />
          <line x1="-22" y1="8" x2="-10" y2="-8" stroke="#e4e4e7" strokeWidth={1.8} strokeLinecap="round" />
          <line x1="10" y1="-8" x2="22" y2="8" stroke="#e4e4e7" strokeWidth={1.8} strokeLinecap="round" />
          <line x1="10" y1="8" x2="22" y2="-8" stroke="#e4e4e7" strokeWidth={1.8} strokeLinecap="round" />
        </g>
      )
    default:
      return null
  }
}

function HatDetailArt({ kind }: { kind: HatKind }) {
  if (kind === 'none') {
    return (
      <g transform="translate(50 50)">
        <circle r="28" fill="none" stroke="#52525b" strokeWidth="1" strokeDasharray="4 5" opacity="0.6" />
        <text textAnchor="middle" y="6" fill="#71717a" fontSize="11" fontFamily="system-ui">
          —
        </text>
      </g>
    )
  }
  if (kind === 'mini') {
    return (
      <g transform="translate(50 62)">
        <ellipse rx="34" ry="9" fill="#18181b" stroke="#3f3f46" />
        <rect x="-22" y="-32" width="44" height="22" rx="3" fill="#27272a" stroke="#52525b" strokeWidth="1" />
      </g>
    )
  }
  if (kind === 'tulle') {
    return (
      <g transform="translate(50 58)">
        <path
          d="M-38,18 Q0,-28 38,18 Q24,28 0,32 Q-24,28 -38,18 Z"
          fill="none"
          stroke="#d4d4d8"
          strokeWidth="1.5"
          opacity="0.85"
        />
        <path d="M-26,12 Q0,-12 26,12" fill="none" stroke="#a1a1aa" strokeWidth="1" strokeDasharray="3 4" opacity="0.7" />
      </g>
    )
  }
  if (kind === 'beanie') {
    return (
      <g transform="translate(50 58)">
        <path
          d="M-32,18 Q0,-34 32,18 Q20,28 0,30 Q-20,28 -32,18 Z"
          fill="#3f3f46"
          stroke="#52525b"
          strokeWidth="1.2"
        />
        <ellipse cx="0" cy="20" rx="36" ry="10" fill="#27272a" opacity="0.9" />
      </g>
    )
  }
  if (kind === 'horns') {
    return (
      <g transform="translate(50 58)">
        <path d="M-22,14 L-34,-18 L-18,-8 Z" fill="#18181b" stroke="#3f3f46" />
        <path d="M22,14 L34,-18 L18,-8 Z" fill="#18181b" stroke="#3f3f46" />
        <ellipse cx="0" cy="18" rx="20" ry="8" fill="#27272a" opacity="0.4" />
      </g>
    )
  }
  /* bow */
  return (
    <g transform="translate(50 56)">
      <path d="M-24,-8 Q-24,-22 -8,-22 Q8,-22 8,-8 Q8,8 -8,8 Q-24,8 -24,-8 Z" fill="#c9264a" opacity="0.95" />
      <path d="M8,-8 Q8,-22 24,-22 Q38,-22 38,-8 Q38,8 24,8 Q8,8 8,-8 Z" fill="#c9264a" opacity="0.95" />
      <rect x="-6" y="-10" width="12" height="22" rx="2" fill="#9f1239" />
    </g>
  )
}

function CharmDetailArt({ kind }: { kind: CharmKind }) {
  switch (kind) {
    case 'moon':
      return (
        <g transform="translate(50 52)">
          <path
            d="M12,-18 A22,22 0 1,1 12,18 A18,18 0 1,0 12,-18 Z"
            fill="none"
            stroke="#f4f4f5"
            strokeWidth="3.5"
          />
          <circle cx="-6" cy="-4" r="3" fill="#fafafa" opacity="0.35" />
        </g>
      )
    case 'web':
      return (
        <g transform="translate(50 52)" stroke="#d4d4d8" strokeWidth="1.2" opacity="0.9">
          <line x1="-28" y1="-28" x2="28" y2="28" />
          <line x1="28" y1="-28" x2="-28" y2="28" />
          <line x1="0" y1="-34" x2="0" y2="34" />
          <line x1="-34" y1="0" x2="34" y2="0" />
          <circle r="26" fill="none" />
        </g>
      )
    case 'heart':
      return (
        <g transform="translate(50 56) scale(1.1)">
          <path
            d="M0,10 C-14,-10 -26,6 -10,20 C-4,26 0,28 0,28 C0,28 4,26 10,20 C26,6 14,-10 0,10 Z"
            fill="#71717a"
            stroke="#52525b"
          />
        </g>
      )
    case 'sparkle':
      return (
        <g transform="translate(50 54)">
          <path
            d="M0,-30 L8,-8 L30,-8 L12,6 L18,30 L0,16 L-18,30 L-12,6 L-30,-8 L-8,-8 Z"
            fill="#fde047"
            stroke="#eab308"
            strokeWidth="1.5"
          />
          <circle cx="0" cy="0" r="6" fill="#fef08a" opacity="0.9" />
        </g>
      )
    case 'skull':
      return (
        <g transform="translate(50 54)">
          <ellipse cx="0" cy="4" rx="22" ry="26" fill="#d4d4d8" stroke="#71717a" strokeWidth="1.5" />
          <ellipse cx="-9" cy="4" rx="6" ry="8" fill="#27272a" />
          <ellipse cx="9" cy="4" rx="6" ry="8" fill="#27272a" />
          <path d="M-8,18 Q0,26 8,18" fill="none" stroke="#52525b" strokeWidth="2" strokeLinecap="round" />
        </g>
      )
    case 'rose':
      return (
        <g transform="translate(50 56)">
          <circle cx="-8" cy="-4" r="12" fill="#9f1239" opacity="0.95" />
          <circle cx="10" cy="-6" r="10" fill="#be123c" opacity="0.9" />
          <circle cx="0" cy="8" r="9" fill="#fb7185" opacity="0.85" />
          <circle cx="-6" cy="10" r="5" fill="#881337" opacity="0.8" />
        </g>
      )
    default:
      return null
  }
}
