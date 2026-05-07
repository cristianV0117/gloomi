import { ExtrudeGeometry, Shape } from 'three'

/**
 * Silueta de ala de murciélago (referencia vectorial): borde superior en S + garra,
 * tres festones en el inferior, nervaduras desde la articulación superior.
 * Coordenadas locales SVG-like; se convierten a THREE.Shape con Y invertida (Three Y arriba).
 */
export function buildBatWingThreeShape(): Shape {
  const k = 0.00425
  const sx = (x: number) => x * k
  const sy = (y: number) => -y * k

  const s = new Shape()
  s.moveTo(sx(0), sy(13))
  s.lineTo(sx(0), sy(-26))
  s.quadraticCurveTo(sx(14), sy(-28), sx(30), sy(-30))
  s.quadraticCurveTo(sx(46), sy(-32), sx(58), sy(-35))
  s.quadraticCurveTo(sx(68), sy(-37), sx(73), sy(-41))
  s.quadraticCurveTo(sx(76), sy(-44), sx(77), sy(-47))
  s.lineTo(sx(79), sy(-49))
  s.lineTo(sx(82), sy(-51))
  s.lineTo(sx(84), sy(-48))
  s.quadraticCurveTo(sx(86), sy(-38), sx(87), sy(-26))
  s.quadraticCurveTo(sx(88), sy(-12), sx(87), sy(2))
  s.quadraticCurveTo(sx(85), sy(16), sx(78), sy(28))
  s.quadraticCurveTo(sx(68), sy(38), sx(54), sy(42))
  s.quadraticCurveTo(sx(38), sy(45), sx(24), sy(41))
  s.quadraticCurveTo(sx(12), sy(36), sx(5), sy(26))
  s.quadraticCurveTo(sx(1), sy(20), sx(0), sy(13))
  return s
}

export function createBatWingExtrudeGeometry(): ExtrudeGeometry {
  return new ExtrudeGeometry(buildBatWingThreeShape(), {
    depth: 0.026,
    bevelEnabled: false,
  })
}

/** Path derecho relativo al punto de unión en el centro del personaje (SVG). */
export const BAT_WING_FILL_D =
  'M 0 13 L 0 -26 Q 14 -28 30 -30 Q 46 -32 58 -35 Q 68 -37 73 -41 Q 76 -44 77 -47 L 79 -49 L 82 -51 L 84 -48 Q 86 -38 87 -26 Q 88 -12 87 2 Q 85 16 78 28 Q 68 38 54 42 Q 38 45 24 41 Q 12 36 5 26 Q 1 20 0 13 Z'

export const BAT_WING_TOP_HIGHLIGHT_D =
  'M 1 -25 Q 28 -29 52 -33 Q 66 -36 74 -41 Q 78 -44 80 -48'

export const BAT_WING_RIB_OUTER_D = 'M 77 -47 Q 79 -10 76 34'

export const BAT_WING_RIB_MID_D = 'M 72 -44 Q 74 -8 46 41'
