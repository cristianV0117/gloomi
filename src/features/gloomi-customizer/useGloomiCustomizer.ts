import { useMemo, useState } from 'react'
import type {
  CharmKind,
  CreatureKind,
  CustomizerPreviewMode,
  DetailFocus,
  EyeKind,
  FabricZoneColors,
  FabricZoneId,
  HatKind,
  TailAccentKind,
  WingKind,
} from './types'
import {
  DEFAULT_FABRIC_ID,
  type FabricChoiceId,
  swatchHex,
} from './constants'

export function useGloomiCustomizer() {
  const [previewMode, setPreviewMode] =
    useState<CustomizerPreviewMode>('three_d')
  const [creatureId, setCreatureId] = useState<CreatureKind>('bear')
  const [fabricByZone, setFabricByZone] = useState<
    Record<FabricZoneId, FabricChoiceId>
  >({
    head: DEFAULT_FABRIC_ID,
    body: DEFAULT_FABRIC_ID,
    limbs: DEFAULT_FABRIC_ID,
  })
  const [activeFabricZone, setActiveFabricZone] =
    useState<FabricZoneId>('body')
  const [eyeId, setEyeId] = useState<EyeKind>('round')
  const [hatId, setHatId] = useState<HatKind>('none')
  const [charmId, setCharmId] = useState<CharmKind>('moon')
  const [wingKind, setWingKind] = useState<WingKind>('none')
  const [tailAccentKind, setTailAccentKind] =
    useState<TailAccentKind>('none')
  const [openHat, setOpenHat] = useState(true)
  const [openCharm, setOpenCharm] = useState(true)
  const [openWing, setOpenWing] = useState(true)
  const [openTailAccent, setOpenTailAccent] = useState(true)
  const [detailFocus, setDetailFocus] = useState<DetailFocus>('eyes')

  const fabricZones: FabricZoneColors = useMemo(
    () => ({
      head: swatchHex(fabricByZone.head),
      body: swatchHex(fabricByZone.body),
      limbs: swatchHex(fabricByZone.limbs),
    }),
    [fabricByZone],
  )

  const fabricHexForInset =
    detailFocus === 'charm' ? fabricZones.body : fabricZones.head

  return {
    previewMode,
    setPreviewMode,
    creatureId,
    setCreatureId,
    fabricByZone,
    setFabricByZone,
    activeFabricZone,
    setActiveFabricZone,
    eyeId,
    setEyeId,
    hatId,
    setHatId,
    charmId,
    setCharmId,
    wingKind,
    setWingKind,
    tailAccentKind,
    setTailAccentKind,
    openHat,
    setOpenHat,
    openCharm,
    setOpenCharm,
    openWing,
    setOpenWing,
    openTailAccent,
    setOpenTailAccent,
    detailFocus,
    setDetailFocus,
    fabricZones,
    fabricHexForInset,
  }
}
