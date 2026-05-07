import type { FabricPatternKey } from './types'

function frac01(x: number) {
  return x - Math.floor(x)
}

/** Pseudoaleatorio determinista [0, 1) para texturas estables */
function hash2(i: number, j: number) {
  return frac01(Math.sin(i * 127.1 + j * 311.7) * 43758.5453123)
}

/** Relleno base + manchas orgánicas tipo vaca */
function cowPatches(
  ctx: CanvasRenderingContext2D,
  s: number,
  patch: string,
  bg: string,
  count: number,
) {
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, s, s)
  ctx.fillStyle = patch
  for (let i = 0; i < count; i++) {
    const cx = hash2(i, 0) * s
    const cy = hash2(i, 1) * s
    const rx = 18 + hash2(i, 2) * 35
    const ry = 15 + hash2(i, 3) * 28
    const rot = hash2(i, 4) * Math.PI
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(rot)
    ctx.beginPath()
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

/** Rayas verticales onduladas tipo tigre/cebra */
function verticalWavyStripes(
  ctx: CanvasRenderingContext2D,
  s: number,
  bg: string,
  stripe: string,
  count: number,
  thickMin: number,
  thickMax: number,
) {
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, s, s)
  ctx.strokeStyle = stripe
  ctx.lineCap = 'round'
  for (let i = 0; i < count; i++) {
    const jitter = hash2(i, 5)
    const x0 = (i * s) / count + jitter * ((s / count) * 0.5)
    ctx.lineWidth = thickMin + hash2(i, 6) * (thickMax - thickMin)
    ctx.beginPath()
    let x = x0
    ctx.moveTo(x, 0)
    for (let y = 0; y <= s; y += 14) {
      x = x0 + Math.sin(y * 0.09 + i) * 10 + Math.cos(y * 0.05) * 4
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
}

/** Leopardo: base + rosetas */
function leopardLike(
  ctx: CanvasRenderingContext2D,
  s: number,
  base: string,
  spot: string,
  ring: string,
  density: number,
) {
  ctx.fillStyle = base
  ctx.fillRect(0, 0, s, s)
  for (let i = 0; i < density; i++) {
    const cx = hash2(i, 7) * s
    const cy = hash2(i, 8) * s
    const r = 4 + hash2(i, 9) * 9
    ctx.fillStyle = spot
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = ring
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.arc(cx, cy, r + 2.5, 0, Math.PI * 2)
    ctx.stroke()
  }
}

/** Jirafa: red irregular */
function giraffeNet(ctx: CanvasRenderingContext2D, s: number, line: string, cellA: string, cellB: string) {
  ctx.fillStyle = cellA
  ctx.fillRect(0, 0, s, s)
  const gx = 9
  const gy = 11
  for (let row = 0; row < gy; row++) {
    for (let col = 0; col < gx; col++) {
      const x = (col * s) / gx + (row % 2) * (s / gx / 2)
      const y = (row * s) / gy
      const w = s / gx * 0.92
      const h = s / gy * 0.95
      ctx.fillStyle = (row + col) % 2 === 0 ? cellB : cellA
      ctx.save()
      ctx.translate(x + w / 2, y + h / 2)
      ctx.rotate(((row + col) % 3) * 0.08)
      ctx.beginPath()
      ctx.moveTo(-w / 2, -h / 4)
      ctx.lineTo(w / 4, -h / 2)
      ctx.lineTo(w / 2, h / 5)
      ctx.lineTo(-w / 6, h / 2)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = line
      ctx.lineWidth = 3
      ctx.stroke()
      ctx.restore()
    }
  }
}

/** Tartán: rejilla */
function tartanGrid(
  ctx: CanvasRenderingContext2D,
  s: number,
  bg: string,
  stripes: { w: number; color: string }[],
) {
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, s, s)
  for (const st of stripes) {
    ctx.strokeStyle = st.color
    ctx.lineWidth = st.w
    const step = 32
    for (let x = 0; x <= s; x += step) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, s)
      ctx.stroke()
    }
    for (let y = 0; y <= s; y += step) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(s, y)
      ctx.stroke()
    }
  }
}

/** Buffalo check */
function buffaloCheck(ctx: CanvasRenderingContext2D, s: number, a: string, b: string, cells: number) {
  const cs = s / cells
  for (let row = 0; row < cells; row++) {
    for (let col = 0; col < cells; col++) {
      ctx.fillStyle = (row + col) % 2 === 0 ? a : b
      ctx.fillRect(col * cs, row * cs, cs + 1, cs + 1)
    }
  }
}

export function drawFabricPattern(
  key: FabricPatternKey,
  ctx: CanvasRenderingContext2D,
  s: number,
): void {
  switch (key) {
    case 'animal_leopard_classic':
      leopardLike(ctx, s, '#d4b896', '#3f2e22', '#1f1410', 140)
      return
    case 'animal_leopard_yellow':
      leopardLike(ctx, s, '#e8d4a8', '#5c4033', '#2d211c', 130)
      return
    case 'animal_leopard_dense':
      leopardLike(ctx, s, '#92400e', '#3f2212', '#1a0f08', 180)
      return
    case 'animal_tiger_orange':
      verticalWavyStripes(ctx, s, '#ea580c', '#171717', 22, 5, 11)
      return
    case 'animal_tiger_tan':
      verticalWavyStripes(ctx, s, '#c08457', '#1c1917', 26, 3.5, 7)
      return
    case 'animal_cheetah_spots':
      ctx.fillStyle = '#ca8a04'
      ctx.fillRect(0, 0, s, s)
      ctx.fillStyle = '#451a03'
      for (let i = 0; i < 110; i++) {
        const cx = hash2(i, 10) * s
        const cy = hash2(i, 11) * s
        const r = 3 + hash2(i, 12) * 8
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.fill()
      }
      return
    case 'animal_cow_brown':
      cowPatches(ctx, s, '#5c3d1e', '#fafafa', 28)
      return
    case 'animal_cow_black':
      cowPatches(ctx, s, '#171717', '#f5f5f5', 26)
      return
    case 'animal_giraffe_light':
      giraffeNet(ctx, s, '#fde68a', '#d97706', '#fef3c7')
      return
    case 'animal_giraffe_dark':
      giraffeNet(ctx, s, '#fcd34d', '#78350f', '#fde68a')
      return
    case 'animal_zebra_fine':
      verticalWavyStripes(ctx, s, '#fafafa', '#171717', 36, 2, 4.5)
      return
    case 'animal_zebra_bold':
      verticalWavyStripes(ctx, s, '#f5f5f5', '#0a0a0a', 14, 8, 18)
      return
    case 'tartan_green_white':
      tartanGrid(ctx, s, '#15803d', [
        { w: 2, color: '#ffffff' },
        { w: 1, color: '#b91c1c' },
      ])
      return
    case 'tartan_red_classic':
      tartanGrid(ctx, s, '#b91c1c', [
        { w: 5, color: '#450a0a' },
        { w: 1.5, color: '#fafafa' },
      ])
      return
    case 'tartan_red_gold':
      tartanGrid(ctx, s, '#991b1b', [
        { w: 1.5, color: '#fef9c3' },
        { w: 1, color: '#eab308' },
      ])
      return
    case 'tartan_forest':
      tartanGrid(ctx, s, '#14532d', [
        { w: 4, color: '#fafafa' },
        { w: 1.5, color: '#b91c1c' },
      ])
      return
    case 'tartan_soft_green':
      tartanGrid(ctx, s, '#22c55e', [
        { w: 1.2, color: '#fefce8' },
        { w: 1, color: '#991b1b' },
      ])
      return
    case 'tartan_buffalo':
      buffaloCheck(ctx, s, '#dc2626', '#1c1917', 8)
      return
    case 'tartan_windowpane':
      ctx.fillStyle = '#b91c1c'
      ctx.fillRect(0, 0, s, s)
      ctx.strokeStyle = '#fafafa'
      ctx.lineWidth = 2
      for (let x = 0; x <= s; x += 40) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, s)
        ctx.stroke()
      }
      for (let y = 0; y <= s; y += 40) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(s, y)
        ctx.stroke()
      }
      ctx.strokeStyle = '#14532d'
      ctx.lineWidth = 5
      for (let x = 20; x <= s; x += 80) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, s)
        ctx.stroke()
      }
      for (let y = 20; y <= s; y += 80) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(s, y)
        ctx.stroke()
      }
      return
    case 'tartan_red_green_block':
      tartanGrid(ctx, s, '#7f1d1d', [
        { w: 10, color: '#14532d' },
        { w: 2, color: '#fde047' },
        { w: 1.5, color: '#fafafa' },
      ])
      return
    case 'tartan_green_dense':
      tartanGrid(ctx, s, '#166534', [
        { w: 1.2, color: '#fafafa' },
        { w: 2.5, color: '#b91c1c' },
      ])
      return
    case 'tartan_green_mono':
      tartanGrid(ctx, s, '#86efac', [{ w: 3, color: '#15803d' }])
      return
  }
}
