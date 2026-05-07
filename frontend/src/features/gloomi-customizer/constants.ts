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
import type { FabricPatternKey } from './fabricPatterns/types'

export type FabricDefinition = {
  id: string
  label: string
  swatch: string
  pattern?: FabricPatternKey
}

export const FABRICS = [
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
  {
    id: 'animal_leopard_classic',
    label: 'Animal · Leopardo clásico',
    swatch: '#d4b896',
    pattern: 'animal_leopard_classic',
  },
  {
    id: 'animal_leopard_yellow',
    label: 'Animal · Leopardo arena',
    swatch: '#e8d4a8',
    pattern: 'animal_leopard_yellow',
  },
  {
    id: 'animal_leopard_dense',
    label: 'Animal · Leopardo denso',
    swatch: '#92400e',
    pattern: 'animal_leopard_dense',
  },
  {
    id: 'animal_tiger_orange',
    label: 'Animal · Tigre naranja',
    swatch: '#ea580c',
    pattern: 'animal_tiger_orange',
  },
  {
    id: 'animal_tiger_tan',
    label: 'Animal · Tigre arena',
    swatch: '#c08457',
    pattern: 'animal_tiger_tan',
  },
  {
    id: 'animal_cheetah_spots',
    label: 'Animal · Guepardo / manchas',
    swatch: '#ca8a04',
    pattern: 'animal_cheetah_spots',
  },
  {
    id: 'animal_cow_brown',
    label: 'Animal · Vaca marrón',
    swatch: '#fafafa',
    pattern: 'animal_cow_brown',
  },
  {
    id: 'animal_cow_black',
    label: 'Animal · Vaca negra',
    swatch: '#f5f5f5',
    pattern: 'animal_cow_black',
  },
  {
    id: 'animal_giraffe_light',
    label: 'Animal · Jirafa clara',
    swatch: '#fef3c7',
    pattern: 'animal_giraffe_light',
  },
  {
    id: 'animal_giraffe_dark',
    label: 'Animal · Jirafa oscura',
    swatch: '#fde68a',
    pattern: 'animal_giraffe_dark',
  },
  {
    id: 'animal_zebra_fine',
    label: 'Animal · Cebra fina',
    swatch: '#fafafa',
    pattern: 'animal_zebra_fine',
  },
  {
    id: 'animal_zebra_bold',
    label: 'Animal · Cebra gruesa',
    swatch: '#f5f5f5',
    pattern: 'animal_zebra_bold',
  },
  {
    id: 'tartan_green_white',
    label: 'Tartán · Verde y rejilla',
    swatch: '#15803d',
    pattern: 'tartan_green_white',
  },
  {
    id: 'tartan_red_classic',
    label: 'Tartán · Rojo clásico',
    swatch: '#b91c1c',
    pattern: 'tartan_red_classic',
  },
  {
    id: 'tartan_red_gold',
    label: 'Tartán · Rojo y oro',
    swatch: '#991b1b',
    pattern: 'tartan_red_gold',
  },
  {
    id: 'tartan_forest',
    label: 'Tartán · Bosque',
    swatch: '#14532d',
    pattern: 'tartan_forest',
  },
  {
    id: 'tartan_soft_green',
    label: 'Tartán · Verde suave',
    swatch: '#22c55e',
    pattern: 'tartan_soft_green',
  },
  {
    id: 'tartan_buffalo',
    label: 'Tartán · Buffalo check',
    swatch: '#dc2626',
    pattern: 'tartan_buffalo',
  },
  {
    id: 'tartan_windowpane',
    label: 'Tartán · Ventana rojo/verde',
    swatch: '#b91c1c',
    pattern: 'tartan_windowpane',
  },
  {
    id: 'tartan_red_green_block',
    label: 'Tartán · Bloques rojo/verde',
    swatch: '#7f1d1d',
    pattern: 'tartan_red_green_block',
  },
  {
    id: 'tartan_green_dense',
    label: 'Tartán · Verde denso',
    swatch: '#166534',
    pattern: 'tartan_green_dense',
  },
  {
    id: 'tartan_green_mono',
    label: 'Tartán · Verde monocromo',
    swatch: '#86efac',
    pattern: 'tartan_green_mono',
  },
] as const satisfies ReadonlyArray<FabricDefinition>

export type FabricChoiceId = (typeof FABRICS)[number]['id']

export const FABRICS_BY_ID = Object.fromEntries(FABRICS.map((f) => [f.id, f])) as Record<
  FabricChoiceId,
  (typeof FABRICS)[number]
>

/** Relleno SVG: hex liso o url(#...) al patrón procedural */
export function svgFabricFill(uid: string, fabricId: FabricChoiceId): string {
  const def = FABRICS_BY_ID[fabricId]
  if (!('pattern' in def) || !def.pattern) return def.swatch
  return `url(#${uid}-fp-${def.id})`
}

export const DEFAULT_FABRIC_ID: FabricChoiceId = 'noir'

export function swatchHex(id: FabricChoiceId): string {
  return FABRICS_BY_ID[id]?.swatch ?? '#d4d4d8'
}


export const FABRIC_ZONES: { id: FabricZoneId; label: string }[] = [
  { id: 'head', label: 'Cabeza' },
  { id: 'body', label: 'Cuerpo' },
  { id: 'limbs', label: 'Extremidades' },
]

export const CREATURES: ReadonlyArray<{ id: CreatureKind; label: string }> = [
  { id: 'bear', label: 'Oso' },
  { id: 'cat', label: 'Gato' },
  { id: 'dog', label: 'Perro' },
  { id: 'mouse', label: 'Ratón' },
  { id: 'rabbit', label: 'Conejo' },
]

export const EYES: ReadonlyArray<{ id: EyeKind; label: string }> = [
  { id: 'round', label: 'Redondo' },
  { id: 'slit', label: 'Hendidura' },
  { id: 'star', label: 'Estrella' },
  { id: 'heart', label: 'Corazón' },
  { id: 'spiral', label: 'Espiral' },
  { id: 'gem', label: 'Gema' },
  { id: 'button', label: 'Botón (Coraline)' },
]

export const ACCESSORY_GROUPS = [
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

/** Espalda: alas y cola extra */
export const BACK_ACCESSORY_GROUPS = [
  {
    id: 'wing' as const,
    title: 'Alas',
    options: [
      { id: 'none' satisfies WingKind, label: 'Nada' },
      { id: 'bat' satisfies WingKind, label: 'Alas de murciélago' },
    ],
  },
  {
    id: 'tailAccent' as const,
    title: 'Cola extra',
    options: [
      { id: 'none' satisfies TailAccentKind, label: 'Nada' },
      { id: 'devil' satisfies TailAccentKind, label: 'Cola de diablo' },
    ],
  },
] as const

export const PREVIEW_MODE_OPTIONS: ReadonlyArray<{
  id: CustomizerPreviewMode
  label: string
  hint: string
}> = [
  { id: 'three_d', label: '3D', hint: 'Modelo orbitable' },
  { id: 'vector', label: 'Vector', hint: 'SVG 2D · escalable' },
]
