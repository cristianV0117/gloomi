/** Estilos de ojos disponibles en el personalizador */
export type EyeKind =
  | 'round'
  | 'slit'
  | 'star'
  | 'heart'
  | 'spiral'
  | 'gem'
  /** Botón cosido estilo Coraline */
  | 'button'

export type HatKind =
  | 'none'
  | 'mini'
  | 'tulle'
  | 'beanie'
  | 'horns'
  | 'bow'

export type CharmKind =
  | 'moon'
  | 'web'
  | 'heart'
  | 'sparkle'
  | 'skull'
  | 'rose'

/** Qué muestra el zoom de detalle (solo vista 3D) */
export type DetailFocus = 'eyes' | 'hat' | 'charm'

/** Forma base del peluche */
export type CreatureKind = 'bear' | 'cat' | 'dog' | 'mouse' | 'rabbit'

/** Alas de espalda (opcional) */
export type WingKind = 'none' | 'bat'

/** Cola adicional tipo fantasía */
export type TailAccentKind = 'none' | 'devil'

/** Zonas de tela */
export type FabricZoneId = 'head' | 'body' | 'limbs'

export type FabricZoneColors = Record<FabricZoneId, string>

/** Vista previa del personalizador */
export type CustomizerPreviewMode = 'three_d' | 'vector'
