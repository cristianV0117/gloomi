export type ProductColor = 'Negro' | 'Gris' | 'Hueso' | 'Morado'
export type ProductStyle = 'Nocturno' | 'Vintage' | 'Glitter' | 'Minimal'
export type ProductSize = 'S' | 'M' | 'L'

export type Product = {
  slug: string
  name: string
  editionNumber: number
  priceUsd: number
  priceCop: number
  /** Rutas relativas `/uploads/...` o URLs absolutas */
  images: string[]
  story: string
  materials: string
  sourceGarment: string
  care: string
  color: ProductColor
  style: ProductStyle
  size: ProductSize
}
