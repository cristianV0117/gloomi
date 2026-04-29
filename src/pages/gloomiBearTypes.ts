/** Estilos de ojos disponibles en el personalizador */
export type EyeKind =
  | 'round'
  | 'slit'
  | 'star'
  | 'heart'
  | 'spiral'
  | 'gem'

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

/** Qué muestra el zoom de detalle */
export type DetailFocus = 'eyes' | 'hat' | 'charm'
