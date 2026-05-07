export type ProductColor = 'Negro' | 'Gris' | 'Hueso' | 'Morado'
export type ProductStyle = 'Nocturno' | 'Vintage' | 'Glitter' | 'Minimal'
export type ProductSize = 'S' | 'M' | 'L'

export type Product = {
  slug: string
  /** Nombre corto del peluche */
  name: string
  /** Número editorial tipo «Gloomi No. 07» */
  editionNumber: number
  price: number
  image: string
  story: string
  materials: string
  /** Prenda o material de origen (upcycling / historia del textil) */
  sourceGarment: string
  care: string
  color: ProductColor
  style: ProductStyle
  size: ProductSize
}

export const products: Product[] = [
  {
    slug: 'grimm',
    name: 'Grimm',
    editionNumber: 7,
    price: 15,
    image: 'https://picsum.photos/seed/gloomi-grimm/800/800?grayscale',
    story:
      'Grimm fue cosido bajo una luna menguante. Su mirada fija no es enojo: es la calma de quien ya vio demasiados sustos y decidió quedarse de todos modos.',
    materials: 'Terciopelo reciclado, relleno hipoalergénico, ojos de resina.',
    sourceGarment:
      'Upcycle desde gabardina negra desestructurada — cortes donados en taller.',
    care: 'Lavado en frío en bolsa de red. No usar secadora.',
    color: 'Negro',
    style: 'Nocturno',
    size: 'M',
  },
  {
    slug: 'luna',
    name: 'Luna',
    editionNumber: 3,
    price: 15,
    image: 'https://picsum.photos/seed/gloomi-luna/800/800?grayscale',
    story:
      'Luna colecciona silencios y sombras suaves. Ideal para quienes prefieren compañía sin ruido.',
    materials: 'Felpa de algodón orgánico, costuras reforzadas.',
    sourceGarment:
      'Base textil: jersey gris perla recuperado de stock muerto de confección local.',
    care: 'Superficie con paño húmedo o lavado suave a mano.',
    color: 'Gris',
    style: 'Minimal',
    size: 'S',
  },
  {
    slug: 'nyx',
    name: 'Nyx',
    editionNumber: 11,
    price: 15,
    image: 'https://picsum.photos/seed/gloomi-nyx/800/800?grayscale',
    story:
      'Nyx es nocturna de nacimiento. Brilla con poca luz y recuerda que la oscuridad también abraza.',
    materials: 'Mezcla de lanas, detalles bordados a mano.',
    sourceGarment:
      'Mezcla morada tejida a partir de bufandas y restos de punto donados.',
    care: 'Planchar con paño protector a baja temperatura.',
    color: 'Morado',
    style: 'Nocturno',
    size: 'M',
  },
  {
    slug: 'moth',
    name: 'Moth',
    editionNumber: 14,
    price: 18,
    image: 'https://picsum.photos/seed/gloomi-moth/800/800?grayscale',
    story:
      'Moth atrae la curiosidad como una llama suave. No quema: calienta el rincón más olvidado de la habitación.',
    materials: 'Telas upcycled, relleno de fibra reciclada.',
    sourceGarment:
      'Patchwork desde camisa vintage beige y panel de cortina natural.',
    care: 'Evitar remojar los bordados; limpiar con cuidado local.',
    color: 'Hueso',
    style: 'Glitter',
    size: 'L',
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}
