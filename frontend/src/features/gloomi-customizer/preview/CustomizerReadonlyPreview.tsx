import { Box, PenLine } from 'lucide-react'
import { lazy, Suspense, useMemo, useState } from 'react'
import type { FabricChoiceId } from '../constants'
import { PREVIEW_MODE_OPTIONS, swatchHex } from '../constants'
import type { FabricZoneId } from '../types'
import type { SavedGloomiConfig } from '../savedConfig'
import { GloomiVector } from './GloomiVector'

const GloomiBear3D = lazy(async () => {
  const m = await import('./GloomiBear3D')
  return { default: m.GloomiBear3D }
})

type Props = {
  config: SavedGloomiConfig
  className?: string
}

/**
 * Misma vista previa 3D / vector que el personalizador, sin paneles de opciones.
 */
export function CustomizerReadonlyPreview({ config, className }: Props) {
  const [previewMode, setPreviewMode] = useState(
    config.previewMode ?? 'three_d',
  )

  const fabricZones = useMemo(
    () => ({
      head: swatchHex(config.fabricByZone.head),
      body: swatchHex(config.fabricByZone.body),
      limbs: swatchHex(config.fabricByZone.limbs),
    }),
    [config.fabricByZone],
  )

  const fabricByZone = useMemo(
    () =>
      ({
        head: config.fabricByZone.head,
        body: config.fabricByZone.body,
        limbs: config.fabricByZone.limbs,
      }) as Record<FabricZoneId, FabricChoiceId>,
    [config.fabricByZone],
  )

  return (
    <div
      className={
        className ??
        'flex min-h-[18rem] flex-col items-center justify-center rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/80 to-zinc-950/90 p-4 sm:p-6'
      }
    >
      <div
        className="mb-4 flex w-full max-w-[28rem] justify-center gap-1 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-1"
        role="tablist"
        aria-label="Vista del modelo (solo lectura)"
      >
        {PREVIEW_MODE_OPTIONS.map((opt) => {
          const active = previewMode === opt.id
          const Icon = opt.id === 'three_d' ? Box : PenLine
          return (
            <button
              key={opt.id}
              type="button"
              role="tab"
              aria-selected={active}
              title={opt.hint}
              onClick={() => setPreviewMode(opt.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition sm:text-sm ${active ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'}`}
            >
              <Icon className="size-4 shrink-0 opacity-80" aria-hidden />
              {opt.label}
            </button>
          )
        })}
      </div>

      {previewMode === 'three_d' ? (
        <Suspense
          fallback={
            <div className="flex h-[min(52vh,400px)] w-full max-w-[28rem] min-h-[280px] items-center justify-center rounded-2xl border border-zinc-800/80 bg-zinc-950/50 text-sm text-zinc-500">
              Cargando vista 3D…
            </div>
          }
        >
          <GloomiBear3D
            creature={config.creatureId}
            fabricZones={fabricZones}
            fabricByZone={fabricByZone}
            eyeKind={config.eyeId}
            hat={config.hatId}
            charm={config.charmId}
            wings={config.wingKind}
            tailAccent={config.tailAccentKind}
            className="w-full max-w-[28rem]"
          />
        </Suspense>
      ) : (
        <GloomiVector
          creature={config.creatureId}
          fabricZones={fabricZones}
          fabricByZone={fabricByZone}
          eyeKind={config.eyeId}
          hat={config.hatId}
          charm={config.charmId}
          wings={config.wingKind}
          tailAccent={config.tailAccentKind}
          className="w-full max-w-[28rem]"
        />
      )}
    </div>
  )
}
