import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import type {
  CharmKind,
  CreatureKind,
  EyeKind,
  FabricZoneColors,
  FabricZoneId,
  HatKind,
  TailAccentKind,
  WingKind,
} from '../types'
import type { FabricChoiceId } from '../constants'
import { FABRICS, svgFabricFill } from '../constants'
import type { FabricPatternKey } from '../fabricPatterns/types'
import { getPatternDataUrl } from '../fabricPatterns/textureCache'
import {
  BAT_WING_FILL_D,
  BAT_WING_RIB_MID_D,
  BAT_WING_RIB_OUTER_D,
  BAT_WING_TOP_HIGHLIGHT_D,
} from './batWingGeometry'

type Props = {
  creature: CreatureKind
  fabricZones: FabricZoneColors
  fabricByZone: Record<FabricZoneId, FabricChoiceId>
  eyeKind: EyeKind
  hat: HatKind
  charm: CharmKind
  wings: WingKind
  tailAccent: TailAccentKind
  className?: string
}

const plushStroke = {
  stroke: '#18181b',
  strokeOpacity: 0.2,
  strokeWidth: 1.15,
} as const

/** Ilustración SVG del mismo peluche personalizable (vista 2D vectorial). */
export function GloomiVector({
  creature,
  fabricZones,
  fabricByZone,
  eyeKind,
  hat,
  charm,
  wings,
  tailAccent,
  className = '',
}: Props) {
  const { t } = useTranslation()
  const uid = useId().replace(/:/g, '')
  const { body: charmBodyHex } = fabricZones
  const cHead = svgFabricFill(uid, fabricByZone.head)
  const cBody = svgFabricFill(uid, fabricByZone.body)
  const cLimbs = svgFabricFill(uid, fabricByZone.limbs)

  const noseCy =
    creature === 'mouse'
      ? 126
      : creature === 'cat'
        ? 118
        : creature === 'dog'
          ? 122
          : creature === 'rabbit'
            ? 118
            : 121

  const eyesCy =
    creature === 'mouse'
      ? 100
      : creature === 'cat'
        ? 98
        : creature === 'dog'
          ? 92
          : creature === 'rabbit'
            ? 96
            : 94

  const charmCy =
    creature === 'mouse'
      ? 154
      : creature === 'cat'
        ? 160
        : creature === 'rabbit'
          ? 161
          : 162

  const hatAnchorY =
    creature === 'mouse' ? 58 : creature === 'cat' ? 50 : creature === 'rabbit' ? 48 : 52

  return (
    <div className={`flex w-full flex-col ${className}`}>
      <div className="relative mx-auto w-full max-w-[28rem]">
        <svg
          viewBox="0 0 220 268"
          className="size-full max-h-[min(52vh,420px)] min-h-[260px] touch-none rounded-2xl sm:max-h-[min(56vh,460px)] sm:min-h-[300px]"
          role="img"
          aria-label={t('customizer.vectorAria', {
            creature: t(`customizer.creature.${creature}`).toLowerCase(),
          })}
        >
          <defs>
            <linearGradient id={`${uid}-floor`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#18181b" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#18181b" stopOpacity="0.06" />
            </linearGradient>
            {FABRICS.filter(
              (f): f is (typeof FABRICS)[number] & { pattern: FabricPatternKey } =>
                'pattern' in f && f.pattern != null,
            ).map((f) => (
                <pattern
                  key={f.id}
                  id={`${uid}-fp-${f.id}`}
                  patternUnits="userSpaceOnUse"
                  width={256}
                  height={256}
                >
                  {typeof document !== 'undefined' ? (
                    <image
                      href={getPatternDataUrl(f.pattern)}
                      width={256}
                      height={256}
                      preserveAspectRatio="none"
                    />
                  ) : (
                    <rect width={256} height={256} fill={f.swatch} />
                  )}
                </pattern>
            ))}
          </defs>

          <ellipse cx="110" cy="252" rx="76" ry="10" fill={`url(#${uid}-floor)`} />

          {wings === 'bat' && <BatWingsLayer limbs={cLimbs} />}

          {creature === 'bear' && (
            <BearLayers cHead={cHead} cBody={cBody} cLimbs={cLimbs} />
          )}
          {creature === 'cat' && (
            <CatLayers cHead={cHead} cBody={cBody} cLimbs={cLimbs} />
          )}
          {creature === 'dog' && (
            <DogLayers cHead={cHead} cBody={cBody} cLimbs={cLimbs} />
          )}
          {creature === 'mouse' && (
            <MouseLayers cHead={cHead} cBody={cBody} cLimbs={cLimbs} />
          )}
          {creature === 'rabbit' && (
            <RabbitLayers cHead={cHead} cBody={cBody} cLimbs={cLimbs} />
          )}

          {tailAccent === 'devil' && <DevilTailLayer creature={creature} />}

          <ellipse
            cx="110"
            cy={noseCy}
            rx="5"
            ry="4.5"
            fill="#141417"
            {...plushStroke}
          />

          <CharmLayer charm={charm} fabricBody={charmBodyHex} cx={110} cy={charmCy} />
          <EyesLayer eyeKind={eyeKind} cx={110} cy={eyesCy} />
          <HatLayer hat={hat} anchorY={hatAnchorY} />
        </svg>
      </div>
      <p className="mt-3 text-center text-[11px] text-zinc-500 sm:text-xs">
        {t('customizer.vectorCaption')}
      </p>
    </div>
  )
}

function BearLayers({
  cHead,
  cBody,
  cLimbs,
}: {
  cHead: string
  cBody: string
  cLimbs: string
}) {
  return (
    <g>
      <ellipse cx="110" cy="178" rx="56" ry="62" fill={cBody} {...plushStroke} />
      <ellipse
        cx="62"
        cy="148"
        rx="14"
        ry="38"
        fill={cLimbs}
        transform="rotate(-42 62 148)"
        {...plushStroke}
      />
      <ellipse
        cx="158"
        cy="148"
        rx="14"
        ry="38"
        fill={cLimbs}
        transform="rotate(42 158 148)"
        {...plushStroke}
      />
      <ellipse cx="86" cy="222" rx="20" ry="16" fill={cLimbs} {...plushStroke} />
      <ellipse cx="134" cy="222" rx="20" ry="16" fill={cLimbs} {...plushStroke} />
      <circle cx="110" cy="92" r="42" fill={cHead} {...plushStroke} />
      <ellipse cx="110" cy="116" rx="21" ry="17" fill={cHead} {...plushStroke} />
      <circle cx="74" cy="66" r="15" fill={cHead} {...plushStroke} />
      <circle cx="146" cy="66" r="15" fill={cHead} {...plushStroke} />
      <line
        x1="110"
        y1="136"
        x2="110"
        y2="208"
        stroke="#fafafa"
        strokeOpacity={0.18}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </g>
  )
}

function CatLayers({
  cHead,
  cBody,
  cLimbs,
}: {
  cHead: string
  cBody: string
  cLimbs: string
}) {
  return (
    <g>
      <path
        d="M 158 188 Q 208 165 200 118 Q 195 95 182 108"
        fill="none"
        stroke={cLimbs}
        strokeWidth={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse cx="110" cy="176" rx="50" ry="58" fill={cBody} {...plushStroke} />
      <ellipse
        cx="64"
        cy="150"
        rx="11"
        ry="36"
        fill={cLimbs}
        transform="rotate(-40 64 150)"
        {...plushStroke}
      />
      <ellipse
        cx="156"
        cy="150"
        rx="11"
        ry="36"
        fill={cLimbs}
        transform="rotate(40 156 150)"
        {...plushStroke}
      />
      <ellipse cx="88" cy="220" rx="18" ry="15" fill={cLimbs} {...plushStroke} />
      <ellipse cx="132" cy="220" rx="18" ry="15" fill={cLimbs} {...plushStroke} />
      <circle cx="110" cy="96" r="39" fill={cHead} {...plushStroke} />
      <ellipse cx="110" cy="118" rx="18" ry="15" fill={cHead} {...plushStroke} />
      <polygon points="78,58 92,88 66,84" fill={cHead} {...plushStroke} />
      <polygon points="142,58 128,88 154,84" fill={cHead} {...plushStroke} />
      <line
        x1="110"
        y1="128"
        x2="110"
        y2="200"
        stroke="#fafafa"
        strokeOpacity={0.18}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </g>
  )
}

function DogLayers({
  cHead,
  cBody,
  cLimbs,
}: {
  cHead: string
  cBody: string
  cLimbs: string
}) {
  return (
    <g>
      <path
        d="M 152 200 Q 178 185 172 162"
        fill="none"
        stroke={cLimbs}
        strokeWidth={11}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse cx="110" cy="176" rx="54" ry="58" fill={cBody} {...plushStroke} />
      <ellipse
        cx="58"
        cy="146"
        rx="13"
        ry="36"
        fill={cLimbs}
        transform="rotate(-38 58 146)"
        {...plushStroke}
      />
      <ellipse
        cx="162"
        cy="146"
        rx="13"
        ry="36"
        fill={cLimbs}
        transform="rotate(38 162 146)"
        {...plushStroke}
      />
      <ellipse cx="86" cy="222" rx="19" ry="16" fill={cLimbs} {...plushStroke} />
      <ellipse cx="134" cy="222" rx="19" ry="16" fill={cLimbs} {...plushStroke} />
      <circle cx="110" cy="90" r="40" fill={cHead} {...plushStroke} />
      <ellipse cx="110" cy="118" rx="28" ry="19" fill={cHead} {...plushStroke} />
      <ellipse
        cx="72"
        cy="84"
        rx="14"
        ry="26"
        fill={cHead}
        transform="rotate(-28 72 84)"
        {...plushStroke}
      />
      <ellipse
        cx="148"
        cy="84"
        rx="14"
        ry="26"
        fill={cHead}
        transform="rotate(28 148 84)"
        {...plushStroke}
      />
      <line
        x1="110"
        y1="132"
        x2="110"
        y2="206"
        stroke="#fafafa"
        strokeOpacity={0.18}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </g>
  )
}

function MouseLayers({
  cHead,
  cBody,
  cLimbs,
}: {
  cHead: string
  cBody: string
  cLimbs: string
}) {
  return (
    <g>
      <path
        d="M 148 165 Q 188 140 196 98 Q 198 82 188 88"
        fill="none"
        stroke={cLimbs}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse cx="110" cy="170" rx="38" ry="46" fill={cBody} {...plushStroke} />
      <ellipse
        cx="76"
        cy="138"
        rx="8"
        ry="26"
        fill={cLimbs}
        transform="rotate(-35 76 138)"
        {...plushStroke}
      />
      <ellipse
        cx="144"
        cy="138"
        rx="8"
        ry="26"
        fill={cLimbs}
        transform="rotate(35 144 138)"
        {...plushStroke}
      />
      <ellipse cx="94" cy="210" rx="13" ry="11" fill={cLimbs} {...plushStroke} />
      <ellipse cx="126" cy="210" rx="13" ry="11" fill={cLimbs} {...plushStroke} />
      <circle cx="110" cy="100" r="36" fill={cHead} {...plushStroke} />
      <ellipse cx="110" cy="118" rx="16" ry="14" fill={cHead} {...plushStroke} />
      <ellipse cx="66" cy="98" rx="24" ry="28" fill={cHead} {...plushStroke} />
      <ellipse cx="154" cy="98" rx="24" ry="28" fill={cHead} {...plushStroke} />
      <line
        x1="110"
        y1="126"
        x2="110"
        y2="188"
        stroke="#fafafa"
        strokeOpacity={0.18}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </g>
  )
}

function BatWingsLayer({ limbs }: { limbs: string }) {
  const cx = 110
  const cy = 157
  const rim = '#0a0a0b'
  const hi = '#64748b'

  const wingPair = (mirror: boolean) => (
    <g transform={mirror ? 'scale(-1, 1)' : ''}>
      <path d={BAT_WING_FILL_D} fill={limbs} stroke={rim} strokeWidth={1.35} />
      <path
        d={BAT_WING_TOP_HIGHLIGHT_D}
        fill="none"
        stroke={hi}
        strokeWidth={3.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.52}
      />
      <path
        d={BAT_WING_RIB_OUTER_D}
        fill="none"
        stroke={hi}
        strokeWidth={2.4}
        strokeLinecap="round"
        opacity={0.46}
      />
      <path
        d={BAT_WING_RIB_MID_D}
        fill="none"
        stroke={hi}
        strokeWidth={2.1}
        strokeLinecap="round"
        opacity={0.42}
      />
    </g>
  )

  return (
    <g opacity={0.98}>
      <g transform={`translate(${cx} ${cy})`}>
        {wingPair(true)}
        {wingPair(false)}
      </g>
    </g>
  )
}

function RabbitLayers({
  cHead,
  cBody,
  cLimbs,
}: {
  cHead: string
  cBody: string
  cLimbs: string
}) {
  return (
    <g>
      <ellipse cx="110" cy="176" rx="52" ry="60" fill={cBody} {...plushStroke} />
      <ellipse
        cx="64"
        cy="148"
        rx="13"
        ry="37"
        fill={cLimbs}
        transform="rotate(-42 64 148)"
        {...plushStroke}
      />
      <ellipse
        cx="156"
        cy="148"
        rx="13"
        ry="37"
        fill={cLimbs}
        transform="rotate(42 156 148)"
        {...plushStroke}
      />
      <ellipse cx="88" cy="220" rx="19" ry="15" fill={cLimbs} {...plushStroke} />
      <ellipse cx="132" cy="220" rx="19" ry="15" fill={cLimbs} {...plushStroke} />
      <circle cx="110" cy="94" r="41" fill={cHead} {...plushStroke} />
      <ellipse cx="110" cy="116" rx="19" ry="16" fill={cHead} {...plushStroke} />
      <ellipse
        cx="84"
        cy="54"
        rx="11"
        ry="36"
        fill={cHead}
        transform="rotate(-6 84 54)"
        {...plushStroke}
      />
      <ellipse
        cx="136"
        cy="54"
        rx="11"
        ry="36"
        fill={cHead}
        transform="rotate(6 136 54)"
        {...plushStroke}
      />
      <circle cx="158" cy="186" r="15" fill={cLimbs} {...plushStroke} />
      <line
        x1="110"
        y1="130"
        x2="110"
        y2="204"
        stroke="#fafafa"
        strokeOpacity={0.18}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </g>
  )
}

function DevilTailLayer({ creature }: { creature: CreatureKind }) {
  const y0 = creature === 'mouse' ? 188 : creature === 'dog' ? 198 : 200
  return (
    <g>
      <path
        d={`M 114 ${y0} Q 146 168 142 128 Q 138 98 130 86`}
        fill="none"
        stroke="#b91c1c"
        strokeWidth={9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon points="130,86 120,76 138,80" fill="#7f1d1d" stroke="#450a0a" strokeWidth={0.8} />
    </g>
  )
}

function EyesLayer({
  eyeKind,
  cx,
  cy,
}: {
  eyeKind: EyeKind
  cx: number
  cy: number
}) {
  const ox = 15
  const g = `translate(${cx} ${cy})`
  if (eyeKind === 'round') {
    return (
      <g transform={g}>
        <g transform={`translate(${-ox} 2)`}>
          <circle r="11" fill="#f4f4f5" {...plushStroke} />
          <circle cx="2" cy="2" r="6" fill="#0a0a0b" />
          <circle cx="-4" cy="-3" r="2.2" fill="#fff" opacity={0.85} />
        </g>
        <g transform={`translate(${ox} 2)`}>
          <circle r="11" fill="#f4f4f5" {...plushStroke} />
          <circle cx="2" cy="2" r="6" fill="#0a0a0b" />
          <circle cx="-4" cy="-3" r="2.2" fill="#fff" opacity={0.85} />
        </g>
      </g>
    )
  }
  if (eyeKind === 'button') {
    const btn = (dx: number) => (
      <g transform={`translate(${dx} 0)`}>
        <circle r="11" fill="#171717" stroke="#3f3f46" strokeWidth={2} />
        <circle cx="-3.6" cy="-3.4" r="2.1" fill="#09090b" />
        <circle cx="3.6" cy="-3.4" r="2.1" fill="#09090b" />
        <circle cx="-3.6" cy="3.4" r="2.1" fill="#09090b" />
        <circle cx="3.6" cy="3.4" r="2.1" fill="#09090b" />
        <line x1="-6" y1="-6" x2="6" y2="6" stroke="#e4e4e7" strokeWidth={1.4} strokeLinecap="round" />
        <line x1="-6" y1="6" x2="6" y2="-6" stroke="#e4e4e7" strokeWidth={1.4} strokeLinecap="round" />
      </g>
    )
    return (
      <g transform={g}>
        {btn(-ox)}
        {btn(ox)}
      </g>
    )
  }
  if (eyeKind === 'slit') {
    return (
      <g transform={g}>
        <ellipse cx={-ox} cy="0" rx="4" ry="12" fill="#070708" />
        <ellipse cx={ox} cy="0" rx="4" ry="12" fill="#070708" />
      </g>
    )
  }
  if (eyeKind === 'star') {
    return (
      <g transform={g}>
        <polygon
          points="0,-14 4,-4 14,-4 5,2 9,14 0,8 -9,14 -5,2 -14,-4 -4,-4"
          fill="#fde047"
          stroke="#ca8a04"
          strokeWidth={0.8}
          transform={`translate(${-ox} 0) scale(0.85)`}
        />
        <polygon
          points="0,-14 4,-4 14,-4 5,2 9,14 0,8 -9,14 -5,2 -14,-4 -4,-4"
          fill="#fde047"
          stroke="#ca8a04"
          strokeWidth={0.8}
          transform={`translate(${ox} 0) scale(0.85)`}
        />
      </g>
    )
  }
  if (eyeKind === 'heart') {
    return (
      <g transform={g}>
        <path
          d="M 0 8 C -10 -6 -18 4 -8 14 C -4 18 0 20 0 20 C 0 20 4 18 8 14 C 18 4 10 -6 0 8 Z"
          fill="#e11d48"
          transform={`translate(${-ox} -4) scale(0.62)`}
        />
        <path
          d="M 0 8 C -10 -6 -18 4 -8 14 C -4 18 0 20 0 20 C 0 20 4 18 8 14 C 18 4 10 -6 0 8 Z"
          fill="#e11d48"
          transform={`translate(${ox} -4) scale(0.62)`}
        />
      </g>
    )
  }
  if (eyeKind === 'spiral') {
    return (
      <g transform={g}>
        <circle cx={-ox} r="9" fill="#6d28d9" opacity={0.95} />
        <circle cx={ox} r="9" fill="#6d28d9" opacity={0.95} />
        <circle cx={-ox} r="3.5" fill="#c4b5fd" />
        <circle cx={ox} r="3.5" fill="#c4b5fd" />
      </g>
    )
  }
  return (
    <g transform={g}>
      <polygon
        points="0,-12 10,-2 6,12 -6,12 -10,-2"
        fill="#22d3ee"
        stroke="#67e8f9"
        strokeWidth={0.6}
        transform={`translate(${-ox} 0)`}
      />
      <polygon
        points="0,-12 10,-2 6,12 -6,12 -10,-2"
        fill="#22d3ee"
        stroke="#67e8f9"
        strokeWidth={0.6}
        transform={`translate(${ox} 0)`}
      />
    </g>
  )
}

function HatLayer({ hat, anchorY }: { hat: HatKind; anchorY: number }) {
  const gx = 110
  const gy = anchorY
  if (hat === 'none') return null
  if (hat === 'mini') {
    return (
      <g transform={`translate(${gx} ${gy})`}>
        <ellipse cx="0" cy="14" rx="36" ry="7" fill="#171717" {...plushStroke} />
        <rect x="-22" y="-8" width="44" height="20" rx="3" fill="#27272a" {...plushStroke} />
      </g>
    )
  }
  if (hat === 'tulle') {
    return (
      <g transform={`translate(${gx} ${gy})`}>
        <path
          d="M -42 22 Q 0 -28 42 22 Q 22 34 0 38 Q -22 34 -42 22 Z"
          fill="#e4e4e7"
          fillOpacity={0.45}
          stroke="#a1a1aa"
          strokeWidth={1}
        />
      </g>
    )
  }
  if (hat === 'beanie') {
    return (
      <g transform={`translate(${gx} ${gy})`}>
        <path
          d="M -34 18 Q 0 -36 34 18 Q 20 28 0 30 Q -20 28 -34 18 Z"
          fill="#3f3f46"
          {...plushStroke}
        />
        <ellipse cx="0" cy="20" rx="38" ry="9" fill="#27272a" {...plushStroke} />
      </g>
    )
  }
  if (hat === 'horns') {
    return (
      <g transform={`translate(${gx} ${gy})`}>
        <polygon points="-28,-4 -34,-32 -18,-18" fill="#18181b" {...plushStroke} />
        <polygon points="28,-4 34,-32 18,-18" fill="#18181b" {...plushStroke} />
      </g>
    )
  }
  return (
    <g transform={`translate(${gx} ${gy + 6})`}>
      <ellipse cx="-14" cy="0" rx="16" ry="10" fill="#c9264a" transform="rotate(-25)" {...plushStroke} />
      <ellipse cx="14" cy="0" rx="16" ry="10" fill="#c9264a" transform="rotate(25)" {...plushStroke} />
      <circle r="5" fill="#9f1239" {...plushStroke} />
    </g>
  )
}

function CharmLayer({
  charm,
  fabricBody,
  cx,
  cy,
}: {
  charm: CharmKind
  fabricBody: string
  cx: number
  cy: number
}) {
  const t = `translate(${cx} ${cy})`
  if (charm === 'moon') {
    return (
      <g transform={t}>
        <path
          d="M 8 -14 A 16 16 0 1 1 8 14 A 13 13 0 1 0 8 -14 Z"
          fill="none"
          stroke="#f4f4f5"
          strokeWidth={3}
          strokeLinecap="round"
          transform="rotate(18)"
        />
      </g>
    )
  }
  if (charm === 'web') {
    return (
      <g transform={t}>
        <line x1="-14" y1="-14" x2="14" y2="14" stroke="#d4d4d8" strokeWidth={1.5} />
        <line x1="14" y1="-14" x2="-14" y2="14" stroke="#d4d4d8" strokeWidth={1.5} />
        <line x1="0" y1="-18" x2="0" y2="18" stroke="#d4d4d8" strokeWidth={1.5} />
        <line x1="-18" y1="0" x2="18" y2="0" stroke="#d4d4d8" strokeWidth={1.5} />
        <circle r="15" fill="none" stroke="#d4d4d8" strokeWidth={1.2} />
      </g>
    )
  }
  if (charm === 'heart') {
    return (
      <g transform={t}>
        <circle r="9" fill="#71717a" stroke="#52525b" strokeWidth={1} />
        <circle r="4" fill={fabricBody} fillOpacity={0.35} />
      </g>
    )
  }
  if (charm === 'sparkle') {
    return (
      <g transform={t}>
        <polygon
          points="0,-14 3,-4 14,-4 5,2 8,14 0,8 -8,14 -5,2 -14,-4 -3,-4"
          fill="#fde047"
          stroke="#eab308"
          strokeWidth={0.7}
        />
      </g>
    )
  }
  if (charm === 'skull') {
    return (
      <g transform={t}>
        <ellipse cx="0" cy="1" rx="12" ry="14" fill="#d4d4d8" {...plushStroke} />
        <circle cx="-5" cy="2" r="3.5" fill="#27272a" />
        <circle cx="5" cy="2" r="3.5" fill="#27272a" />
      </g>
    )
  }
  return (
    <g transform={t}>
      <circle cx="-5" cy="-3" r="7" fill="#9f1239" {...plushStroke} />
      <circle cx="6" cy="-4" r="6" fill="#be123c" {...plushStroke} />
      <circle cx="0" cy="5" r="5.5" fill="#fb7185" {...plushStroke} />
    </g>
  )
}
