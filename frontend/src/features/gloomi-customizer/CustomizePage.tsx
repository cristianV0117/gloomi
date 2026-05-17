import { Box, ChevronDown, PenLine } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
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
import { buildSavedGloomiConfig } from './savedConfig'
import { useGloomiCustomizer } from './useGloomiCustomizer'
import { submitGloomiCustomization } from '../../lib/inquiriesApi'

const GloomiBear3D = lazy(async () => {
  const m = await import('./preview/GloomiBear3D')
  return { default: m.GloomiBear3D }
})

function undefinedIfEmpty(s: string): string | undefined {
  const trimmed = s.trim()
  return trimmed ? trimmed : undefined
}

const ALL_ACCESSORY_GROUPS = [...ACCESSORY_GROUPS, ...BACK_ACCESSORY_GROUPS]

export function CustomizePage() {
  const { t } = useTranslation()
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

  const [saveEmail, setSaveEmail] = useState('')
  const [saveName, setSaveName] = useState('')
  const [saveNote, setSaveNote] = useState('')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>(
    'idle',
  )
  const [saveError, setSaveError] = useState<string | null>(null)

  async function handleSaveDesign() {
    setSaveStatus('loading')
    setSaveError(null)
    try {
      const config = buildSavedGloomiConfig({
        creatureId,
        fabricByZone,
        eyeId,
        hatId,
        charmId,
        wingKind,
        tailAccentKind,
        previewMode,
      })
      await submitGloomiCustomization({
        email: undefinedIfEmpty(saveEmail),
        name: undefinedIfEmpty(saveName),
        note: undefinedIfEmpty(saveNote),
        config,
      })
      setSaveStatus('ok')
    } catch (e) {
      setSaveStatus('error')
      setSaveError(e instanceof Error ? e.message : t('customizer.saveError'))
    }
  }

  return (
    <div className="w-full pt-6 lg:pt-10">
      <h1 className="font-display mb-2 text-center text-2xl tracking-wide text-zinc-900 dark:text-zinc-100 sm:text-3xl">
        {t('customizer.title')}
      </h1>
      <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-zinc-600 dark:text-zinc-500 sm:text-base">
        {t('customizer.subtitle')}
      </p>

      <div className="lg:grid lg:grid-cols-[minmax(280px,1fr)_minmax(320px,520px)] lg:items-start lg:gap-12 xl:gap-16">
        <section className="relative mb-10 flex min-h-[18rem] flex-col items-center justify-center rounded-3xl border border-zinc-200 bg-gradient-to-b from-zinc-50/90 to-white/90 p-4 dark:border-zinc-800 dark:from-zinc-900/80 dark:to-zinc-950/90 sm:p-6 lg:sticky lg:top-28 lg:mb-0 lg:min-h-[min(70vh,34rem)] lg:p-8">
          <div
            className="mb-4 flex w-full max-w-[28rem] justify-center gap-1 rounded-2xl border border-zinc-200 bg-white/90 p-1 dark:border-zinc-800 dark:bg-zinc-950/60"
            role="tablist"
            aria-label={t('customizer.previewAria')}
          >
            {PREVIEW_MODE_OPTIONS.map((opt) => {
              const active = previewMode === opt.id
              const Icon = opt.id === 'three_d' ? Box : PenLine
              const hint =
                opt.id === 'three_d'
                  ? t('customizer.preview3d')
                  : t('customizer.previewVector')
              const label =
                opt.id === 'three_d' ? t('customizer.mode3d') : t('customizer.modeVector')
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  title={hint}
                  onClick={() => setPreviewMode(opt.id)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition sm:text-sm ${active ? 'bg-zinc-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-950' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-zinc-300'}`}
                >
                  <Icon className="size-4 shrink-0 opacity-80" aria-hidden />
                  {label}
                </button>
              )
            })}
          </div>

          {previewMode === 'three_d' ? (
            <Suspense
              fallback={
                <div className="flex h-[min(52vh,400px)] w-full max-w-[28rem] min-h-[280px] items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50/90 text-sm text-zinc-600 dark:border-zinc-800/80 dark:bg-zinc-950/50 dark:text-zinc-500">
                  {t('customizer.loading3d')}
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
            <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.25em] text-zinc-600 dark:text-zinc-600">
              {t('customizer.step1')}
            </p>
            <h2 className="mb-4 text-sm font-semibold tracking-wide text-zinc-800 dark:text-zinc-200">
              {t('customizer.model')}
            </h2>
            <div className="flex flex-wrap gap-2">
              {CREATURES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`rounded-xl border px-3 py-2 text-xs transition sm:px-4 sm:py-2.5 sm:text-sm ${c.id === creatureId ? 'border-zinc-900 bg-zinc-900 text-white shadow-[inset_0_0_0_1px_rgb(244_244_245)] dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950' : 'border-zinc-300 text-zinc-700 hover:border-zinc-500 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600'}`}
                  onClick={() => setCreatureId(c.id)}
                  aria-pressed={c.id === creatureId}
                >
                  {t(`customizer.creature.${c.id}`)}
                </button>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.25em] text-zinc-600 dark:text-zinc-600">
              {t('customizer.step2')}
            </p>
            <p className="mb-3 max-w-md text-xs leading-relaxed text-zinc-600 dark:text-zinc-500">
              <Trans
                i18nKey="customizer.fabricIntro"
                components={{
                  brand: (
                    <span className="text-[color:var(--color-gloom-violet)]" />
                  ),
                }}
              />
            </p>
            <div
              className="mb-4 flex flex-wrap gap-2"
              role="tablist"
              aria-label={t('customizer.fabricZoneAria')}
            >
              {FABRIC_ZONES.map(({ id }) => {
                const active = activeFabricZone === id
                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveFabricZone(id)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition sm:text-sm ${active ? 'border-zinc-900 bg-zinc-900 text-white shadow-[inset_0_0_0_1px_rgb(244_244_245)] dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950' : 'border-zinc-300 text-zinc-700 hover:border-zinc-500 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600'}`}
                  >
                    <span
                      className="size-5 shrink-0 rounded-md border border-zinc-500 shadow-inner dark:border-zinc-600 sm:size-6"
                      style={{ backgroundColor: swatchHex(fabricByZone[id]) }}
                      aria-hidden
                    />
                    {t(`customizer.zone.${id}`)}
                  </button>
                )
              })}
            </div>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {FABRICS.map((f) => {
                const selectedForActiveZone = fabricByZone[activeFabricZone] === f.id
                const zoneLabel = t(`customizer.zone.${activeFabricZone}`)
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
                    className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-2 transition ${selectedForActiveZone ? 'border-zinc-900 ring-2 ring-zinc-900 ring-offset-2 ring-offset-white dark:border-zinc-100 dark:ring-zinc-100 dark:ring-offset-zinc-950' : 'border-transparent hover:border-zinc-400 dark:hover:border-zinc-700'}`}
                    aria-label={t('customizer.fabricForZone', {
                      fabric: t(`fabric.${f.id}`),
                      zone: zoneLabel,
                    })}
                    aria-pressed={selectedForActiveZone}
                  >
                    <span
                      className="h-11 w-11 rounded-xl border border-zinc-500 shadow-inner dark:border-zinc-600 sm:h-12 sm:w-12"
                      style={{ backgroundColor: f.swatch }}
                    />
                    <span className="max-w-[4.5rem] text-center text-[10px] leading-tight text-zinc-600 dark:text-zinc-400 sm:text-xs">
                      {t(`fabric.${f.id}`)}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="mb-8">
            <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.25em] text-zinc-600 dark:text-zinc-600">
              {t('customizer.step3')}
            </p>
            <h2 className="mb-4 text-sm font-semibold tracking-wide text-zinc-800 dark:text-zinc-200">
              {t('customizer.eyesTitle')}
            </h2>
            <div className="flex flex-wrap gap-2">
              {EYES.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  className={`rounded-xl border px-3 py-2 text-xs transition sm:px-4 sm:py-2.5 sm:text-sm ${e.id === eyeId ? 'border-zinc-900 bg-zinc-900 text-white shadow-[inset_0_0_0_1px_rgb(244_244_245)] dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950' : 'border-zinc-300 text-zinc-700 hover:border-zinc-500 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600'}`}
                  onClick={() => {
                    setEyeId(e.id)
                    setDetailFocus('eyes')
                  }}
                  aria-pressed={e.id === eyeId}
                >
                  {t(`customizer.eye.${e.id}`)}
                </button>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.25em] text-zinc-600 dark:text-zinc-600">
              {t('customizer.step4')}
            </p>
            <h2 className="mb-4 text-sm font-semibold tracking-wide text-zinc-800 dark:text-zinc-200">
              {t('customizer.accessories')}
            </h2>
            <div className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
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
                const groupTitle = t(`customizer.group.${group.id}`)
                const optNs =
                  group.id === 'hat'
                    ? 'hat'
                    : group.id === 'charm'
                      ? 'charm'
                      : group.id === 'wing'
                        ? 'wing'
                        : 'tail'
                return (
                  <div key={group.id}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-zinc-800 dark:text-zinc-200 sm:px-5"
                      onClick={() => setOpen(!open)}
                      aria-expanded={open}
                    >
                      {groupTitle}
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-zinc-500 transition ${open ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {open && (
                      <ul className="space-y-2 px-4 pb-4 pt-0 text-sm text-zinc-600 dark:text-zinc-400 sm:px-5">
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
                              <label className="flex cursor-pointer items-center gap-3 rounded-lg py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900/50">
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
                                  className="size-4 shrink-0 border-zinc-400 bg-white text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
                                />
                                <span
                                  className={
                                    checked
                                      ? 'font-medium text-zinc-900 dark:text-zinc-100'
                                      : ''
                                  }
                                >
                                  {t(`customizer.${optNs}.${opt.id}`)}
                                </span>
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

          <div className="mx-auto max-w-md space-y-4 pb-12 lg:mx-0 lg:max-w-sm">
            <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-zinc-600 dark:text-zinc-600">
              {t('customizer.saveDesign')}
            </p>
            <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-500">
              {t('customizer.saveHint')}
            </p>
            <div>
              <label
                htmlFor="save-name"
                className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
              >
                {t('customizer.saveNameLabel')}{' '}
                <span className="text-zinc-500">{t('customizer.optionalShort')}</span>
              </label>
              <input
                id="save-name"
                type="text"
                value={saveName}
                onChange={(ev) => setSaveName(ev.target.value)}
                autoComplete="name"
                maxLength={120}
                className="w-full rounded-2xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950/80 dark:text-zinc-100 dark:placeholder:text-zinc-600"
                placeholder={t('customizer.namePh')}
              />
            </div>
            <div>
              <label
                htmlFor="save-email"
                className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
              >
                {t('customizer.saveEmailLabel')}{' '}
                <span className="text-zinc-500">{t('customizer.optionalShort')}</span>
              </label>
              <input
                id="save-email"
                type="email"
                value={saveEmail}
                onChange={(ev) => setSaveEmail(ev.target.value)}
                autoComplete="email"
                className="w-full rounded-2xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950/80 dark:text-zinc-100 dark:placeholder:text-zinc-600"
                placeholder={t('customizer.saveEmailPh')}
              />
            </div>
            <div>
              <label
                htmlFor="save-note"
                className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
              >
                {t('customizer.saveNoteLabel')}{' '}
                <span className="text-zinc-500">{t('customizer.optionalShort')}</span>
              </label>
              <textarea
                id="save-note"
                rows={3}
                value={saveNote}
                onChange={(ev) => setSaveNote(ev.target.value)}
                maxLength={1000}
                className="w-full resize-y rounded-2xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950/80 dark:text-zinc-100 dark:placeholder:text-zinc-600"
                placeholder={t('customizer.saveNotePh')}
              />
            </div>
            {saveStatus === 'ok' ? (
              <p className="text-sm text-emerald-600 dark:text-emerald-400" role="status">
                {t('customizer.saveSuccess')}
              </p>
            ) : null}
            {saveStatus === 'error' && saveError ? (
              <p className="text-sm text-rose-600 dark:text-rose-400" role="alert">
                {saveError}
              </p>
            ) : null}
            <Button
              type="button"
              disabled={saveStatus === 'loading'}
              onClick={() => void handleSaveDesign()}
            >
              {saveStatus === 'loading'
                ? t('customizer.saveLoading')
                : t('customizer.saveSubmit')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
