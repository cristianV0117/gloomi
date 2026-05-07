import { Box, ChevronDown, PenLine } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { Button } from '../../components/ui/Button'
import {
  ACCESSORY_GROUPS,
  BACK_ACCESSORY_GROUPS,
  CREATURES,
  EYES,
  FABRICS,
  FABRIC_ZONES,
  PREVIEW_MODE_OPTIONS,
  type FabricChoiceId,
  swatchHex,
} from './constants'
import type { CharmKind, HatKind, TailAccentKind, WingKind } from './types'
import { CustomizerDetailInset } from './preview/CustomizerDetailInset'
import { GloomiVector } from './preview/GloomiVector'
import { useGloomiCustomizer } from './useGloomiCustomizer'

const GloomiBear3D = lazy(async () => {
  const m = await import('./preview/GloomiBear3D')
  return { default: m.GloomiBear3D }
})

const ALL_ACCESSORY_GROUPS = [...ACCESSORY_GROUPS, ...BACK_ACCESSORY_GROUPS]

export function CustomizePage() {
  const {
    previewMode,
    setPreviewMode,
    creatureId,
    setCreatureId,
    fabricByZone,
    setFabricByZone,
    activeFabricZone,
    setActiveFabricZone,
    eyeId,
    setEyeId,
    hatId,
    setHatId,
    charmId,
    setCharmId,
    wingKind,
    setWingKind,
    tailAccentKind,
    setTailAccentKind,
    openHat,
    setOpenHat,
    openCharm,
    setOpenCharm,
    openWing,
    setOpenWing,
    openTailAccent,
    setOpenTailAccent,
    detailFocus,
    setDetailFocus,
    fabricZones,
    fabricHexForInset,
  } = useGloomiCustomizer()

  return (
    <div className="w-full pt-6 lg:pt-10">
      <h1 className="font-display mb-2 text-center text-2xl tracking-wide sm:text-3xl">
        Personalización
      </h1>
      <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-zinc-500 sm:text-base">
        Elige cómo ver tu diseño: modelo 3D interactivo o ilustración vectorial (SVG). Misma forma, telas por
        zona, ojos y accesorios en ambos modos.
      </p>

      <div className="lg:grid lg:grid-cols-[minmax(280px,1fr)_minmax(320px,520px)] lg:items-start lg:gap-12 xl:gap-16">
        <section className="relative mb-10 flex min-h-[18rem] flex-col items-center justify-center rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/80 to-zinc-950/90 p-4 sm:p-6 lg:sticky lg:top-28 lg:mb-0 lg:min-h-[min(70vh,34rem)] lg:p-8">
          <div
            className="mb-4 flex w-full max-w-[28rem] justify-center gap-1 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-1"
            role="tablist"
            aria-label="Tipo de vista previa"
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
                creature={creatureId}
                fabricZones={fabricZones}
                fabricByZone={fabricByZone}
                eyeKind={eyeId}
                hat={hatId}
                charm={charmId}
                wings={wingKind}
                tailAccent={tailAccentKind}
                className="w-full max-w-[28rem]"
              />
            </Suspense>
          ) : (
            <GloomiVector
              creature={creatureId}
              fabricZones={fabricZones}
              fabricByZone={fabricByZone}
              eyeKind={eyeId}
              hat={hatId}
              charm={charmId}
              wings={wingKind}
              tailAccent={tailAccentKind}
              className="w-full max-w-[28rem]"
            />
          )}

          {previewMode === 'three_d' && (
            <CustomizerDetailInset
              eyeKind={eyeId}
              hat={hatId}
              charm={charmId}
              fabricHex={fabricHexForInset}
              focus={detailFocus}
              onFocusChange={setDetailFocus}
            />
          )}
        </section>

        <div className="min-w-0">
          <section className="mb-8">
            <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.25em] text-zinc-600">
              Paso 1
            </p>
            <h2 className="mb-4 text-sm font-semibold tracking-wide text-zinc-200">
              Modelo
            </h2>
            <div className="flex flex-wrap gap-2">
              {CREATURES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`rounded-xl border px-3 py-2 text-xs transition sm:px-4 sm:py-2.5 sm:text-sm ${c.id === creatureId ? 'border-zinc-100 bg-zinc-900 text-white shadow-[inset_0_0_0_1px_rgb(244_244_245)]' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}
                  onClick={() => setCreatureId(c.id)}
                  aria-pressed={c.id === creatureId}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.25em] text-zinc-600">
              Paso 2
            </p>
            <p className="mb-3 max-w-md text-xs leading-relaxed text-zinc-500">
              Activa una zona y elige tela; cada parte puede ser un color distinto. Inspirado en{' '}
              <span className="text-[color:var(--color-gloom-violet)]">Glitter Up</span>
              — brillos discretos según la tela.
            </p>
            <div
              className="mb-4 flex flex-wrap gap-2"
              role="tablist"
              aria-label="Zona del peluche a colorear"
            >
              {FABRIC_ZONES.map(({ id, label }) => {
                const active = activeFabricZone === id
                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveFabricZone(id)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition sm:text-sm ${active ? 'border-zinc-100 bg-zinc-900 text-white shadow-[inset_0_0_0_1px_rgb(244_244_245)]' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}
                  >
                    <span
                      className="size-5 shrink-0 rounded-md border border-zinc-600 shadow-inner sm:size-6"
                      style={{ backgroundColor: swatchHex(fabricByZone[id]) }}
                      aria-hidden
                    />
                    {label}
                  </button>
                )
              })}
            </div>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {FABRICS.map((f) => {
                const selectedForActiveZone = fabricByZone[activeFabricZone] === f.id
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() =>
                      setFabricByZone((prev) => ({
                        ...prev,
                        [activeFabricZone]: f.id as FabricChoiceId,
                      }))
                    }
                    className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-2 transition ${selectedForActiveZone ? 'border-zinc-100 ring-2 ring-zinc-100 ring-offset-2 ring-offset-zinc-950' : 'border-transparent hover:border-zinc-700'}`}
                    aria-label={`${f.label} para ${FABRIC_ZONES.find((z) => z.id === activeFabricZone)?.label ?? 'zona'}`}
                    aria-pressed={selectedForActiveZone}
                  >
                    <span
                      className="h-11 w-11 rounded-xl border border-zinc-600 shadow-inner sm:h-12 sm:w-12"
                      style={{ backgroundColor: f.swatch }}
                    />
                    <span className="max-w-[4.5rem] text-center text-[10px] leading-tight text-zinc-400 sm:text-xs">
                      {f.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="mb-8">
            <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.25em] text-zinc-600">
              Paso 3
            </p>
            <h2 className="mb-4 text-sm font-semibold tracking-wide text-zinc-200">
              Detalles / Ojos
            </h2>
            <div className="flex flex-wrap gap-2">
              {EYES.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  className={`rounded-xl border px-3 py-2 text-xs transition sm:px-4 sm:py-2.5 sm:text-sm ${e.id === eyeId ? 'border-zinc-100 bg-zinc-900 text-white shadow-[inset_0_0_0_1px_rgb(244_244_245)]' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}
                  onClick={() => {
                    setEyeId(e.id)
                    setDetailFocus('eyes')
                  }}
                  aria-pressed={e.id === eyeId}
                >
                  {e.label}
                </button>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.25em] text-zinc-600">
              Paso 4
            </p>
            <h2 className="mb-4 text-sm font-semibold tracking-wide text-zinc-200">
              Accesorios
            </h2>
            <div className="divide-y divide-zinc-800 rounded-2xl border border-zinc-800">
              {ALL_ACCESSORY_GROUPS.map((group) => {
                const open =
                  group.id === 'hat'
                    ? openHat
                    : group.id === 'charm'
                      ? openCharm
                      : group.id === 'wing'
                        ? openWing
                        : openTailAccent
                const setOpen =
                  group.id === 'hat'
                    ? setOpenHat
                    : group.id === 'charm'
                      ? setOpenCharm
                      : group.id === 'wing'
                        ? setOpenWing
                        : setOpenTailAccent
                return (
                  <div key={group.id}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-zinc-200 sm:px-5"
                      onClick={() => setOpen(!open)}
                      aria-expanded={open}
                    >
                      {group.title}
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-zinc-500 transition ${open ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {open && (
                      <ul className="space-y-2 px-4 pb-4 pt-0 text-sm text-zinc-400 sm:px-5">
                        {group.options.map((opt) => {
                          const checked =
                            group.id === 'hat'
                              ? hatId === opt.id
                              : group.id === 'charm'
                                ? charmId === opt.id
                                : group.id === 'wing'
                                  ? wingKind === opt.id
                                  : tailAccentKind === opt.id
                          return (
                            <li key={opt.id}>
                              <label className="flex cursor-pointer items-center gap-3 rounded-lg py-1.5 hover:bg-zinc-900/50">
                                <input
                                  type="radio"
                                  name={group.id}
                                  value={opt.id}
                                  checked={checked}
                                  onChange={() => {
                                    if (group.id === 'hat') {
                                      setHatId(opt.id as HatKind)
                                      setDetailFocus('hat')
                                    } else if (group.id === 'charm') {
                                      setCharmId(opt.id as CharmKind)
                                      setDetailFocus('charm')
                                    } else if (group.id === 'wing') {
                                      setWingKind(opt.id as WingKind)
                                    } else {
                                      setTailAccentKind(opt.id as TailAccentKind)
                                    }
                                  }}
                                  className="size-4 shrink-0 border-zinc-600 bg-zinc-900 text-zinc-100 focus:ring-zinc-500"
                                />
                                <span className={checked ? 'text-zinc-100' : ''}>{opt.label}</span>
                              </label>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          <div className="mx-auto max-w-md pb-12 lg:mx-0 lg:max-w-sm">
            <Button>Crear mi Gloomi</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
