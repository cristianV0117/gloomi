import { ChevronDown } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'
import { Button } from '../components/ui/Button'
import { CustomizerDetailInset } from './CustomizerDetailInset'
import type { CharmKind, DetailFocus, EyeKind, HatKind } from './gloomiBearTypes'

const GloomiBear3D = lazy(async () => {
  const m = await import('./GloomiBear3D')
  return { default: m.GloomiBear3D }
})

const FABRICS = [
  { id: 'noir', label: 'Noir', swatch: '#1a1a1c' },
  { id: 'mist', label: 'Mist', swatch: '#52525b' },
  { id: 'bone', label: 'Hueso', swatch: '#d4d4d8' },
  { id: 'ash', label: 'Ceniza', swatch: '#71717a' },
  { id: 'void', label: 'Vacío', swatch: '#09090b' },
  { id: 'wine', label: 'Wine', swatch: '#5c1428' },
  { id: 'plum', label: 'Plum', swatch: '#422038' },
  { id: 'silver', label: 'Silver', swatch: '#a8a29e' },
  { id: 'emerald', label: 'Emerald', swatch: '#064e3b' },
  { id: 'cherry', label: 'Cherry', swatch: '#9f1239' },
] as const

const EYES: ReadonlyArray<{ id: EyeKind; label: string }> = [
  { id: 'round', label: 'Redondo' },
  { id: 'slit', label: 'Hendidura' },
  { id: 'star', label: 'Estrella' },
  { id: 'heart', label: 'Corazón' },
  { id: 'spiral', label: 'Espiral' },
  { id: 'gem', label: 'Gema' },
]

const ACCESSORY_GROUPS = [
  {
    id: 'hat' as const,
    title: 'Sombreros',
    options: [
      { id: 'mini' satisfies HatKind, label: 'Mini sombrero' },
      { id: 'tulle' satisfies HatKind, label: 'Corona tulle' },
      { id: 'beanie' satisfies HatKind, label: 'Gorro punto' },
      { id: 'horns' satisfies HatKind, label: 'Cuernitos' },
      { id: 'bow' satisfies HatKind, label: 'Lazo gótico' },
      { id: 'none' satisfies HatKind, label: 'Nada' },
    ],
  },
  {
    id: 'charm' as const,
    title: 'Dijes',
    options: [
      { id: 'moon' satisfies CharmKind, label: 'Luna' },
      { id: 'web' satisfies CharmKind, label: 'Telaraña' },
      { id: 'heart' satisfies CharmKind, label: 'Corazón oxidado' },
      { id: 'sparkle' satisfies CharmKind, label: 'Estrella (dije)' },
      { id: 'skull' satisfies CharmKind, label: 'Calavera mini' },
      { id: 'rose' satisfies CharmKind, label: 'Rosa oxidada' },
    ],
  },
] as const

export function Customize() {
  const [fabricId, setFabricId] = useState<(typeof FABRICS)[number]['id']>('noir')
  const [eyeId, setEyeId] = useState<EyeKind>('round')
  const [hatId, setHatId] = useState<HatKind>('none')
  const [charmId, setCharmId] = useState<CharmKind>('moon')
  const [openHat, setOpenHat] = useState(true)
  const [openCharm, setOpenCharm] = useState(true)
  const [detailFocus, setDetailFocus] = useState<DetailFocus>('eyes')

  const fabricHex =
    FABRICS.find((f) => f.id === fabricId)?.swatch ?? '#d4d4d8'

  return (
    <div className="w-full pt-6 lg:pt-10">
      <h1 className="font-display mb-2 text-center text-2xl tracking-wide sm:text-3xl">
        Personalización
      </h1>
      <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-zinc-500 sm:text-base">
        Elige tela, ojos y accesorios. Gira el modelo en 3D; usa el recuadro de zoom para ver el detalle
        ampliado.
      </p>

      <div className="lg:grid lg:grid-cols-[minmax(280px,1fr)_minmax(320px,520px)] lg:items-start lg:gap-12 xl:gap-16">
        <section className="relative mb-10 flex min-h-[18rem] flex-col items-center justify-center rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/80 to-zinc-950/90 p-4 sm:p-6 lg:sticky lg:top-28 lg:mb-0 lg:min-h-[min(70vh,34rem)] lg:p-8">
          <Suspense
            fallback={
              <div className="flex h-[min(52vh,400px)] w-full max-w-[28rem] min-h-[280px] items-center justify-center rounded-2xl border border-zinc-800/80 bg-zinc-950/50 text-sm text-zinc-500">
                Cargando vista 3D…
              </div>
            }
          >
            <GloomiBear3D
              fabricHex={fabricHex}
              eyeKind={eyeId}
              hat={hatId}
              charm={charmId}
              className="w-full max-w-[28rem]"
            />
          </Suspense>
          <CustomizerDetailInset
            eyeKind={eyeId}
            hat={hatId}
            charm={charmId}
            fabricHex={fabricHex}
            focus={detailFocus}
            onFocusChange={setDetailFocus}
          />
        </section>

        <div className="min-w-0">
          <section className="mb-8">
            <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.25em] text-zinc-600">
              Paso 1
            </p>
            <p className="mb-3 max-w-md text-xs leading-relaxed text-zinc-500">
              Incluye líneas inspiradas en <span className="text-[color:var(--color-gloom-violet)]">Glitter Up</span>{' '}
              — brillos discretos según la tela elegida.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {FABRICS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFabricId(f.id)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-2 transition ${fabricId === f.id ? 'border-zinc-100 ring-2 ring-zinc-100 ring-offset-2 ring-offset-zinc-950' : 'border-transparent hover:border-zinc-700'}`}
                  aria-label={f.label}
                  aria-pressed={fabricId === f.id}
                >
                  <span
                    className="h-11 w-11 rounded-xl border border-zinc-600 shadow-inner sm:h-12 sm:w-12"
                    style={{ backgroundColor: f.swatch }}
                  />
                  <span className="max-w-[4.5rem] text-center text-[10px] leading-tight text-zinc-400 sm:text-xs">
                    {f.label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.25em] text-zinc-600">
              Paso 2
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
              Paso 3
            </p>
            <h2 className="mb-4 text-sm font-semibold tracking-wide text-zinc-200">
              Accesorios
            </h2>
            <div className="divide-y divide-zinc-800 rounded-2xl border border-zinc-800">
              {ACCESSORY_GROUPS.map((group) => {
                const open = group.id === 'hat' ? openHat : openCharm
                const setOpen = group.id === 'hat' ? setOpenHat : setOpenCharm
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
                              : charmId === opt.id
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
                                    } else {
                                      setCharmId(opt.id as CharmKind)
                                      setDetailFocus('charm')
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
