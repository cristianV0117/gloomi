import { useMemo } from 'react'
import type { CanvasTexture } from 'three'
import type { FabricChoiceId } from '../constants'
import { FABRICS_BY_ID } from '../constants'
import { getPatternThreeTexture } from './textureCache'

export type FabricMatProps = {
  color: string
  map: CanvasTexture | undefined
  roughness: number
  metalness: number
}

export type FabricZoneKind = 'head' | 'body' | 'limbs'

export function useFabricPlushMaterial(
  fabricId: FabricChoiceId,
  zone: FabricZoneKind,
): FabricMatProps {
  return useMemo(() => {
    const def = FABRICS_BY_ID[fabricId]
    const roughSolid = zone === 'head' ? 0.86 : zone === 'limbs' ? 0.9 : 0.9
    const roughTex = zone === 'head' ? 0.82 : 0.82

    if (!('pattern' in def) || !def.pattern) {
      return {
        color: def.swatch,
        map: undefined,
        roughness: roughSolid,
        metalness: 0.04,
      }
    }
    const map = getPatternThreeTexture(def.pattern)
    map.needsUpdate = true
    return {
      color: '#ffffff',
      map,
      roughness: roughTex,
      metalness: 0.04,
    }
  }, [fabricId, zone])
}
