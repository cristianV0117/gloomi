import type { FabricChoiceId } from './constants'
import type {
  CharmKind,
  CreatureKind,
  CustomizerPreviewMode,
  EyeKind,
  FabricZoneId,
  HatKind,
  TailAccentKind,
  WingKind,
} from './types'

/**
 * Configuración serializable del personalizador (API + localStorage futuro).
 * Debe coincidir con lo que valida el backend en `CustomizationConfigDto`.
 */
export type SavedGloomiConfig = {
  creatureId: CreatureKind
  fabricByZone: Record<FabricZoneId, FabricChoiceId>
  eyeId: EyeKind
  hatId: HatKind
  charmId: CharmKind
  wingKind: WingKind
  tailAccentKind: TailAccentKind
  previewMode: CustomizerPreviewMode
}

export function buildSavedGloomiConfig(params: {
  creatureId: CreatureKind
  fabricByZone: Record<FabricZoneId, FabricChoiceId>
  eyeId: EyeKind
  hatId: HatKind
  charmId: CharmKind
  wingKind: WingKind
  tailAccentKind: TailAccentKind
  previewMode: CustomizerPreviewMode
}): SavedGloomiConfig {
  return {
    creatureId: params.creatureId,
    fabricByZone: { ...params.fabricByZone },
    eyeId: params.eyeId,
    hatId: params.hatId,
    charmId: params.charmId,
    wingKind: params.wingKind,
    tailAccentKind: params.tailAccentKind,
    previewMode: params.previewMode,
  }
}

/** Normaliza JSON del API a un objeto utilizable en el preview (admin). */
export function parseSavedGloomiConfig(raw: unknown): SavedGloomiConfig | null {
  if (!raw || typeof raw !== 'object') return null
  const c = raw as Record<string, unknown>
  const fabric = c.fabricByZone
  if (!fabric || typeof fabric !== 'object') return null
  const fz = fabric as Record<string, unknown>
  const head = fz.head
  const body = fz.body
  const limbs = fz.limbs
  if (typeof head !== 'string' || typeof body !== 'string' || typeof limbs !== 'string') {
    return null
  }
  const creatureId = c.creatureId
  const eyeId = c.eyeId
  const hatId = c.hatId
  const charmId = c.charmId
  const wingKind = c.wingKind
  const tailAccentKind = c.tailAccentKind
  if (
    typeof creatureId !== 'string' ||
    typeof eyeId !== 'string' ||
    typeof hatId !== 'string' ||
    typeof charmId !== 'string' ||
    typeof wingKind !== 'string' ||
    typeof tailAccentKind !== 'string'
  ) {
    return null
  }
  const previewRaw = c.previewMode
  const previewMode: CustomizerPreviewMode =
    previewRaw === 'vector' ? 'vector' : 'three_d'
  return {
    creatureId: creatureId as CreatureKind,
    fabricByZone: {
      head: head as FabricChoiceId,
      body: body as FabricChoiceId,
      limbs: limbs as FabricChoiceId,
    },
    eyeId: eyeId as EyeKind,
    hatId: hatId as HatKind,
    charmId: charmId as CharmKind,
    wingKind: wingKind as WingKind,
    tailAccentKind: tailAccentKind as TailAccentKind,
    previewMode,
  }
}
