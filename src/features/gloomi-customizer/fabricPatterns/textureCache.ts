import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three'
import { drawFabricPattern } from './drawPattern'
import type { FabricPatternKey } from './types'

const SIZE = 256

const canvasElCache = new Map<FabricPatternKey, HTMLCanvasElement>()
const texCache = new Map<FabricPatternKey, CanvasTexture>()

export function getPatternCanvas(key: FabricPatternKey): HTMLCanvasElement {
  if (typeof document === 'undefined') {
    throw new Error('Los estampados requieren document (canvas)')
  }
  let el = canvasElCache.get(key)
  if (!el) {
    el = document.createElement('canvas')
    el.width = SIZE
    el.height = SIZE
    const ctx = el.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D no disponible')
    drawFabricPattern(key, ctx, SIZE)
    canvasElCache.set(key, el)
  }
  return el
}

export function getPatternThreeTexture(key: FabricPatternKey): CanvasTexture {
  let t = texCache.get(key)
  if (!t) {
    const canvas = getPatternCanvas(key)
    t = new CanvasTexture(canvas)
    t.wrapS = t.wrapT = RepeatWrapping
    t.repeat.set(5, 5)
    t.colorSpace = SRGBColorSpace
    t.needsUpdate = true
    texCache.set(key, t)
  }
  return t
}

export function getPatternDataUrl(key: FabricPatternKey): string {
  return getPatternCanvas(key).toDataURL('image/png')
}
