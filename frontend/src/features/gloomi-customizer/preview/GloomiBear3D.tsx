import { Canvas } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import { DoubleSide } from 'three'
import { useMemo } from 'react'
import type {
  CharmKind,
  CreatureKind,
  EyeKind,
  FabricZoneColors,
  FabricZoneId,
  HatKind,
  TailAccentKind,
  WingKind,
} from '../types'
import type { FabricChoiceId } from '../constants'
import { useFabricPlushMaterial } from '../fabricPatterns/useFabricPlushMaterial'
import { createBatWingExtrudeGeometry } from './batWingGeometry'

export type {
  CharmKind,
  CreatureKind,
  EyeKind,
  FabricZoneColors,
  FabricZoneId,
  HatKind,
  TailAccentKind,
  WingKind,
} from '../types'

function PlushZoneMaterial({
  fabricId,
  zone,
  roughness: roughnessOverride,
  metalness: metalnessOverride,
}: {
  fabricId: FabricChoiceId
  zone: 'head' | 'body' | 'limbs'
  roughness?: number
  metalness?: number
}) {
  const props = useFabricPlushMaterial(fabricId, zone)
  return (
    <meshStandardMaterial
      {...props}
      roughness={roughnessOverride ?? props.roughness}
      metalness={metalnessOverride ?? props.metalness}
    />
  )
}

type Props = {
  creature: CreatureKind
  fabricZones: FabricZoneColors
  fabricByZone: Record<FabricZoneId, FabricChoiceId>
  eyeKind: EyeKind
  hat: HatKind
  charm: CharmKind
  wings: WingKind
  tailAccent: TailAccentKind
  className?: string
}

type CreatureRig = {
  eyeY: number
  eyeZ: number
  eyeSpread: number
  hatLift: number
  hatScale: number
  charmY: number
  charmZ: number
  nosePos: [number, number, number]
  noseRot: [number, number, number]
  noseRadius: number
  seamPos: [number, number, number]
  seamHeight: number
}

const CREATURE_RIGS: Record<CreatureKind, CreatureRig> = {
  bear: {
    eyeY: 0.48,
    eyeZ: 0.48,
    eyeSpread: 0.13,
    hatLift: 0,
    hatScale: 1,
    charmY: -0.05,
    charmZ: 0.58,
    nosePos: [0, 0.26, 0.62],
    noseRot: [0.25, 0, 0],
    noseRadius: 0.065,
    seamPos: [0, 0.02, 0.66],
    seamHeight: 1.35,
  },
  cat: {
    eyeY: 0.54,
    eyeZ: 0.45,
    eyeSpread: 0.11,
    hatLift: 0.08,
    hatScale: 0.92,
    charmY: -0.02,
    charmZ: 0.54,
    nosePos: [0, 0.32, 0.58],
    noseRot: [0.2, 0, 0],
    noseRadius: 0.048,
    seamPos: [0, 0.06, 0.62],
    seamHeight: 1.2,
  },
  dog: {
    eyeY: 0.46,
    eyeZ: 0.44,
    eyeSpread: 0.14,
    hatLift: 0.02,
    hatScale: 1,
    charmY: -0.06,
    charmZ: 0.55,
    nosePos: [0, 0.24, 0.68],
    noseRot: [0.15, 0, 0],
    noseRadius: 0.072,
    seamPos: [0, -0.02, 0.64],
    seamHeight: 1.28,
  },
  mouse: {
    eyeY: 0.42,
    eyeZ: 0.4,
    eyeSpread: 0.095,
    hatLift: -0.02,
    hatScale: 0.78,
    charmY: 0.02,
    charmZ: 0.46,
    nosePos: [0, 0.22, 0.48],
    noseRot: [0.35, 0, 0],
    noseRadius: 0.038,
    seamPos: [0, 0.08, 0.52],
    seamHeight: 0.95,
  },
  rabbit: {
    eyeY: 0.51,
    eyeZ: 0.46,
    eyeSpread: 0.11,
    hatLift: 0.06,
    hatScale: 0.93,
    charmY: -0.04,
    charmZ: 0.56,
    nosePos: [0, 0.29, 0.59],
    noseRot: [0.22, 0, 0],
    noseRadius: 0.048,
    seamPos: [0, 0.05, 0.63],
    seamHeight: 1.22,
  },
}

const CREATURE_LABEL_ES: Record<CreatureKind, string> = {
  bear: 'oso',
  cat: 'gato',
  dog: 'perro',
  mouse: 'ratón',
  rabbit: 'conejo',
}

/** Peluche en 3D: arrastra para orbitar (360°). Admite varias formas de animal. */
export function GloomiBear3D({
  creature,
  fabricZones,
  fabricByZone,
  eyeKind,
  hat,
  charm,
  wings,
  tailAccent,
  className = '',
}: Props) {
  return (
    <div className={`flex w-full flex-col ${className}`}>
      <div className="relative h-[min(52vh,400px)] w-full min-h-[280px] touch-none sm:h-[min(56vh,460px)] lg:min-h-[340px]">
        <Canvas
          shadows
          camera={{ position: [0, 0.28, 2.65], fov: 42, near: 0.1, far: 80 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          className="size-full touch-none rounded-2xl"
          aria-label={`Vista 3D del peluche (${CREATURE_LABEL_ES[creature]}). Arrastra para girar.`}
          role="img"
        >
          <ambientLight intensity={0.52} />
          <directionalLight
            castShadow
            position={[4, 8, 6]}
            intensity={1.25}
            shadow-mapSize={[2048, 2048]}
          />
          <directionalLight position={[-4, 3, -6]} intensity={0.35} />
          <spotLight
            position={[0, 4, 2]}
            angle={0.55}
            penumbra={0.85}
            intensity={0.25}
            color="#fafafa"
          />

          <group position={[0, -0.05, 0]}>
            <CreatureMesh
              creature={creature}
              fabricZones={fabricZones}
              fabricByZone={fabricByZone}
              eyeKind={eyeKind}
              hat={hat}
              charm={charm}
              wings={wings}
              tailAccent={tailAccent}
            />
          </group>

          <ContactShadows
            position={[0, -1.02, 0]}
            opacity={0.42}
            scale={14}
            blur={2.4}
            far={6}
            resolution={512}
          />
          <OrbitControls
            enablePan={false}
            enableZoom
            minDistance={1.85}
            maxDistance={5.2}
            minPolarAngle={0.38}
            maxPolarAngle={Math.PI / 2 + 0.08}
            target={[0, 0.12, 0]}
            makeDefault
          />
        </Canvas>
      </div>
      <p className="mt-3 text-center text-[11px] text-zinc-500 sm:text-xs">
        Arrastra con el ratón o el dedo para girar el modelo · Rueda para acercar o alejar
      </p>
    </div>
  )
}

function CreatureMesh({
  creature,
  fabricZones,
  fabricByZone,
  eyeKind,
  hat,
  charm,
  wings,
  tailAccent,
}: {
  creature: CreatureKind
  fabricZones: FabricZoneColors
  fabricByZone: Record<FabricZoneId, FabricChoiceId>
  eyeKind: EyeKind
  hat: HatKind
  charm: CharmKind
  wings: WingKind
  tailAccent: TailAccentKind
}) {
  const rig = CREATURE_RIGS[creature]
  const { body: fabricBody } = fabricZones

  return (
    <group
      key={`plush-${creature}-${fabricByZone.head}-${fabricByZone.body}-${fabricByZone.limbs}`}
    >
      {wings === 'bat' && <BatWings3D limbFabricId={fabricByZone.limbs} />}
      {creature === 'bear' && <BearBody fabricByZone={fabricByZone} />}
      {creature === 'cat' && <CatBody fabricByZone={fabricByZone} />}
      {creature === 'dog' && <DogBody fabricByZone={fabricByZone} />}
      {creature === 'mouse' && <MouseBody fabricByZone={fabricByZone} />}
      {creature === 'rabbit' && <RabbitBody fabricByZone={fabricByZone} />}
      {tailAccent === 'devil' && <DevilTail3D />}

      <mesh castShadow position={rig.nosePos} rotation={rig.noseRot}>
        <sphereGeometry args={[rig.noseRadius, 18, 18]} />
        <meshStandardMaterial color="#141417" roughness={0.65} />
      </mesh>

      <Eyes3D
        eyeKind={eyeKind}
        ly={rig.eyeY}
        lz={rig.eyeZ}
        spreadX={rig.eyeSpread}
      />
      <group position={[0, rig.hatLift, 0]} scale={rig.hatScale}>
        <Hat3D hat={hat} />
      </group>
      <Charm3D
        charm={charm}
        fabricAccentHex={fabricBody}
        baseY={rig.charmY}
        baseZ={rig.charmZ}
      />

      <mesh position={rig.seamPos} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.018, rig.seamHeight, 0.012]} />
        <meshStandardMaterial
          color="#fafafa"
          transparent
          opacity={0.2}
          roughness={1}
        />
      </mesh>
    </group>
  )
}

function BearBody({ fabricByZone }: { fabricByZone: Record<FabricZoneId, FabricChoiceId> }) {
  return (
    <group>
      <mesh
        castShadow
        receiveShadow
        position={[0, -0.36, 0]}
        scale={[1.08, 0.96, 0.94]}
      >
        <sphereGeometry args={[0.63, 48, 48]} />
        <PlushZoneMaterial fabricId={fabricByZone.body} zone="body" />
      </mesh>
      <mesh castShadow position={[-0.58, -0.02, 0.04]} rotation={[0, 0, 0.55]}>
        <capsuleGeometry args={[0.11, 0.34, 6, 16]} />
        <PlushZoneMaterial fabricId={fabricByZone.limbs} zone="limbs" />
      </mesh>
      <mesh castShadow position={[0.58, -0.02, 0.04]} rotation={[0, 0, -0.55]}>
        <capsuleGeometry args={[0.11, 0.34, 6, 16]} />
        <PlushZoneMaterial fabricId={fabricByZone.limbs} zone="limbs" />
      </mesh>
      <mesh castShadow position={[-0.22, -0.82, 0.12]} scale={[1, 0.72, 1]}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <PlushZoneMaterial fabricId={fabricByZone.limbs} zone="limbs" />
      </mesh>
      <mesh castShadow position={[0.22, -0.82, 0.12]} scale={[1, 0.72, 1]}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <PlushZoneMaterial fabricId={fabricByZone.limbs} zone="limbs" />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.44, 0.06]}>
        <sphereGeometry args={[0.47, 48, 48]} />
        <PlushZoneMaterial fabricId={fabricByZone.head} zone="head" />
      </mesh>
      <mesh castShadow position={[0, 0.34, 0.44]} scale={[1.05, 0.9, 0.72]}>
        <sphereGeometry args={[0.24, 28, 28]} />
        <PlushZoneMaterial fabricId={fabricByZone.head} zone="head" roughness={0.82} metalness={0.03} />
      </mesh>
      <mesh castShadow position={[-0.4, 0.74, -0.04]} scale={[1.05, 1.15, 0.92]}>
        <sphereGeometry args={[0.19, 20, 20]} />
        <PlushZoneMaterial fabricId={fabricByZone.head} zone="head" roughness={0.88} metalness={0.04} />
      </mesh>
      <mesh castShadow position={[0.4, 0.74, -0.04]} scale={[1.05, 1.15, 0.92]}>
        <sphereGeometry args={[0.19, 20, 20]} />
        <PlushZoneMaterial fabricId={fabricByZone.head} zone="head" roughness={0.88} metalness={0.04} />
      </mesh>
    </group>
  )
}

function CatBody({ fabricByZone }: { fabricByZone: Record<FabricZoneId, FabricChoiceId> }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, -0.34, 0]} scale={[0.92, 1.05, 0.88]}>
        <sphereGeometry args={[0.56, 44, 44]} />
        <PlushZoneMaterial fabricId={fabricByZone.body} zone="body" />
      </mesh>
      <mesh castShadow position={[-0.52, 0.02, 0.02]} rotation={[0, 0, 0.52]}>
        <capsuleGeometry args={[0.09, 0.36, 6, 14]} />
        <PlushZoneMaterial fabricId={fabricByZone.limbs} zone="limbs" />
      </mesh>
      <mesh castShadow position={[0.52, 0.02, 0.02]} rotation={[0, 0, -0.52]}>
        <capsuleGeometry args={[0.09, 0.36, 6, 14]} />
        <PlushZoneMaterial fabricId={fabricByZone.limbs} zone="limbs" />
      </mesh>
      <mesh castShadow position={[-0.2, -0.76, 0.12]} scale={[1, 0.78, 1]}>
        <sphereGeometry args={[0.19, 22, 22]} />
        <PlushZoneMaterial fabricId={fabricByZone.limbs} zone="limbs" />
      </mesh>
      <mesh castShadow position={[0.2, -0.76, 0.12]} scale={[1, 0.78, 1]}>
        <sphereGeometry args={[0.19, 22, 22]} />
        <PlushZoneMaterial fabricId={fabricByZone.limbs} zone="limbs" />
      </mesh>
      <mesh castShadow position={[0, -0.38, -0.48]} rotation={[0.78, 0, 0]}>
        <capsuleGeometry args={[0.055, 0.52, 6, 14]} />
        <PlushZoneMaterial fabricId={fabricByZone.limbs} zone="limbs" />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.46, 0.05]}>
        <sphereGeometry args={[0.42, 44, 44]} />
        <PlushZoneMaterial fabricId={fabricByZone.head} zone="head" />
      </mesh>
      <mesh castShadow position={[0, 0.38, 0.42]} scale={[0.95, 0.82, 0.68]}>
        <sphereGeometry args={[0.2, 26, 26]} />
        <PlushZoneMaterial fabricId={fabricByZone.head} zone="head" roughness={0.82} metalness={0.03} />
      </mesh>
      <mesh castShadow position={[-0.2, 0.86, -0.06]} rotation={[-0.4, 0, 0.5]}>
        <coneGeometry args={[0.11, 0.32, 6]} />
        <PlushZoneMaterial fabricId={fabricByZone.head} zone="head" roughness={0.88} metalness={0.04} />
      </mesh>
      <mesh castShadow position={[0.2, 0.86, -0.06]} rotation={[-0.4, 0, -0.5]}>
        <coneGeometry args={[0.11, 0.32, 6]} />
        <PlushZoneMaterial fabricId={fabricByZone.head} zone="head" roughness={0.88} metalness={0.04} />
      </mesh>
    </group>
  )
}

function DogBody({ fabricByZone }: { fabricByZone: Record<FabricZoneId, FabricChoiceId> }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, -0.34, 0]} scale={[1.05, 0.94, 1.12]}>
        <sphereGeometry args={[0.58, 44, 44]} />
        <PlushZoneMaterial fabricId={fabricByZone.body} zone="body" />
      </mesh>
      <mesh castShadow position={[-0.56, -0.04, 0]} rotation={[0, 0, 0.48]}>
        <capsuleGeometry args={[0.1, 0.34, 6, 16]} />
        <PlushZoneMaterial fabricId={fabricByZone.limbs} zone="limbs" />
      </mesh>
      <mesh castShadow position={[0.56, -0.04, 0]} rotation={[0, 0, -0.48]}>
        <capsuleGeometry args={[0.1, 0.34, 6, 16]} />
        <PlushZoneMaterial fabricId={fabricByZone.limbs} zone="limbs" />
      </mesh>
      <mesh castShadow position={[-0.22, -0.8, 0.14]} scale={[1, 0.74, 1.08]}>
        <sphereGeometry args={[0.21, 22, 22]} />
        <PlushZoneMaterial fabricId={fabricByZone.limbs} zone="limbs" />
      </mesh>
      <mesh castShadow position={[0.22, -0.8, 0.14]} scale={[1, 0.74, 1.08]}>
        <sphereGeometry args={[0.21, 22, 22]} />
        <PlushZoneMaterial fabricId={fabricByZone.limbs} zone="limbs" />
      </mesh>
      <mesh castShadow position={[0, -0.34, -0.46]} rotation={[0.52, 0, 0]}>
        <capsuleGeometry args={[0.075, 0.22, 6, 12]} />
        <PlushZoneMaterial fabricId={fabricByZone.limbs} zone="limbs" />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.42, 0.04]}>
        <sphereGeometry args={[0.44, 44, 44]} />
        <PlushZoneMaterial fabricId={fabricByZone.head} zone="head" />
      </mesh>
      <mesh castShadow position={[0, 0.32, 0.48]} scale={[0.88, 0.72, 1.48]}>
        <sphereGeometry args={[0.22, 28, 28]} />
        <PlushZoneMaterial fabricId={fabricByZone.head} zone="head" roughness={0.8} metalness={0.03} />
      </mesh>
      <mesh castShadow position={[-0.44, 0.52, 0.08]} rotation={[0.62, 0, 0.55]} scale={[1.05, 1.18, 0.42]}>
        <sphereGeometry args={[0.18, 18, 18]} />
        <PlushZoneMaterial fabricId={fabricByZone.head} zone="head" roughness={0.88} metalness={0.04} />
      </mesh>
      <mesh castShadow position={[0.44, 0.52, 0.08]} rotation={[0.62, 0, -0.55]} scale={[1.05, 1.18, 0.42]}>
        <sphereGeometry args={[0.18, 18, 18]} />
        <PlushZoneMaterial fabricId={fabricByZone.head} zone="head" roughness={0.88} metalness={0.04} />
      </mesh>
    </group>
  )
}

function MouseBody({ fabricByZone }: { fabricByZone: Record<FabricZoneId, FabricChoiceId> }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, -0.26, 0]} scale={[0.88, 0.92, 0.95]}>
        <sphereGeometry args={[0.4, 40, 40]} />
        <PlushZoneMaterial fabricId={fabricByZone.body} zone="body" />
      </mesh>
      <mesh castShadow position={[-0.42, 0.08, 0.02]} rotation={[0, 0, 0.42]}>
        <capsuleGeometry args={[0.055, 0.22, 5, 12]} />
        <PlushZoneMaterial fabricId={fabricByZone.limbs} zone="limbs" />
      </mesh>
      <mesh castShadow position={[0.42, 0.08, 0.02]} rotation={[0, 0, -0.42]}>
        <capsuleGeometry args={[0.055, 0.22, 5, 12]} />
        <PlushZoneMaterial fabricId={fabricByZone.limbs} zone="limbs" />
      </mesh>
      <mesh castShadow position={[-0.16, -0.62, 0.1]} scale={[1, 0.72, 1]}>
        <sphereGeometry args={[0.14, 18, 18]} />
        <PlushZoneMaterial fabricId={fabricByZone.limbs} zone="limbs" />
      </mesh>
      <mesh castShadow position={[0.16, -0.62, 0.1]} scale={[1, 0.72, 1]}>
        <sphereGeometry args={[0.14, 18, 18]} />
        <PlushZoneMaterial fabricId={fabricByZone.limbs} zone="limbs" />
      </mesh>
      <mesh castShadow position={[0, -0.22, -0.38]} rotation={[0.18, 0, 0]}>
        <cylinderGeometry args={[0.022, 0.018, 0.78, 8]} />
        <PlushZoneMaterial fabricId={fabricByZone.limbs} zone="limbs" />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.34, 0.02]}>
        <sphereGeometry args={[0.36, 40, 40]} />
        <PlushZoneMaterial fabricId={fabricByZone.head} zone="head" />
      </mesh>
      <mesh castShadow position={[0, 0.26, 0.36]} scale={[0.85, 0.78, 1.05]}>
        <sphereGeometry args={[0.16, 22, 22]} />
        <PlushZoneMaterial fabricId={fabricByZone.head} zone="head" roughness={0.82} metalness={0.03} />
      </mesh>
      <mesh castShadow position={[-0.38, 0.58, 0]} scale={[1.15, 1.22, 0.32]}>
        <sphereGeometry args={[0.16, 18, 18]} />
        <PlushZoneMaterial fabricId={fabricByZone.head} zone="head" roughness={0.88} metalness={0.04} />
      </mesh>
      <mesh castShadow position={[0.38, 0.58, 0]} scale={[1.15, 1.22, 0.32]}>
        <sphereGeometry args={[0.16, 18, 18]} />
        <PlushZoneMaterial fabricId={fabricByZone.head} zone="head" roughness={0.88} metalness={0.04} />
      </mesh>
    </group>
  )
}

function RabbitBody({ fabricByZone }: { fabricByZone: Record<FabricZoneId, FabricChoiceId> }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, -0.34, 0]} scale={[0.96, 1.02, 0.92]}>
        <sphereGeometry args={[0.58, 44, 44]} />
        <PlushZoneMaterial fabricId={fabricByZone.body} zone="body" />
      </mesh>
      <mesh castShadow position={[-0.54, 0, 0.03]} rotation={[0, 0, 0.52]}>
        <capsuleGeometry args={[0.095, 0.34, 6, 14]} />
        <PlushZoneMaterial fabricId={fabricByZone.limbs} zone="limbs" />
      </mesh>
      <mesh castShadow position={[0.54, 0, 0.03]} rotation={[0, 0, -0.52]}>
        <capsuleGeometry args={[0.095, 0.34, 6, 14]} />
        <PlushZoneMaterial fabricId={fabricByZone.limbs} zone="limbs" />
      </mesh>
      <mesh castShadow position={[-0.21, -0.79, 0.13]} scale={[1, 0.76, 1]}>
        <sphereGeometry args={[0.2, 22, 22]} />
        <PlushZoneMaterial fabricId={fabricByZone.limbs} zone="limbs" />
      </mesh>
      <mesh castShadow position={[0.21, -0.79, 0.13]} scale={[1, 0.76, 1]}>
        <sphereGeometry args={[0.2, 22, 22]} />
        <PlushZoneMaterial fabricId={fabricByZone.limbs} zone="limbs" />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.42, 0.05]}>
        <sphereGeometry args={[0.43, 44, 44]} />
        <PlushZoneMaterial fabricId={fabricByZone.head} zone="head" />
      </mesh>
      <mesh castShadow position={[0, 0.34, 0.43]} scale={[1, 0.88, 0.72]}>
        <sphereGeometry args={[0.19, 26, 26]} />
        <PlushZoneMaterial fabricId={fabricByZone.head} zone="head" roughness={0.82} metalness={0.03} />
      </mesh>
      <mesh castShadow position={[-0.14, 0.82, -0.02]} rotation={[0.08, 0, -0.15]}>
        <capsuleGeometry args={[0.065, 0.36, 8, 14]} />
        <PlushZoneMaterial fabricId={fabricByZone.head} zone="head" roughness={0.88} metalness={0.04} />
      </mesh>
      <mesh castShadow position={[0.14, 0.82, -0.02]} rotation={[0.08, 0, 0.15]}>
        <capsuleGeometry args={[0.065, 0.36, 8, 14]} />
        <PlushZoneMaterial fabricId={fabricByZone.head} zone="head" roughness={0.88} metalness={0.04} />
      </mesh>
      <mesh castShadow position={[0.34, -0.56, -0.18]} scale={[1.05, 1.05, 0.92]}>
        <sphereGeometry args={[0.13, 18, 18]} />
        <PlushZoneMaterial fabricId={fabricByZone.limbs} zone="limbs" />
      </mesh>
    </group>
  )
}

function BatWings3D({ limbFabricId }: { limbFabricId: FabricChoiceId }) {
  const geom = useMemo(() => createBatWingExtrudeGeometry(), [])
  const mat = useFabricPlushMaterial(limbFabricId, 'limbs')

  return (
    <group position={[0, -0.02, -0.2]}>
      <mesh
        castShadow
        geometry={geom}
        position={[-0.012, 0.065, -0.02]}
        rotation={[Math.PI / 2, 0.38, 0]}
        scale={[-1, 1, 1]}
      >
        <meshStandardMaterial
          {...mat}
          transparent
          opacity={0.96}
          side={DoubleSide}
        />
      </mesh>
      <mesh
        castShadow
        geometry={geom}
        position={[0.012, 0.065, -0.02]}
        rotation={[Math.PI / 2, -0.38, 0]}
      >
        <meshStandardMaterial
          {...mat}
          transparent
          opacity={0.96}
          side={DoubleSide}
        />
      </mesh>
    </group>
  )
}

function DevilTail3D() {
  return (
    <group position={[0, -0.33, -0.39]} rotation={[0.92, 0, 0]}>
      <mesh castShadow position={[0, -0.24, 0]}>
        <capsuleGeometry args={[0.042, 0.44, 6, 12]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.52} metalness={0.14} />
      </mesh>
      <mesh castShadow position={[0, -0.54, 0.03]} rotation={[0.35, 0, 0]}>
        <coneGeometry args={[0.062, 0.15, 8]} />
        <meshStandardMaterial color="#7f1d1d" roughness={0.42} metalness={0.18} />
      </mesh>
    </group>
  )
}

function Eyes3D({
  eyeKind,
  ly,
  lz,
  spreadX,
}: {
  eyeKind: EyeKind
  ly?: number
  lz?: number
  spreadX?: number
}) {
  const eyeLy = ly ?? 0.48
  const eyeLz = lz ?? 0.48
  const sx = spreadX ?? 0.13
  const pairs: [number, number, number][] = [
    [-sx, eyeLy, eyeLz],
    [sx, eyeLy, eyeLz],
  ]

  if (eyeKind === 'round') {
    return (
      <group>
        {pairs.map((p, i) => (
          <group key={i} position={p}>
            <mesh castShadow>
              <sphereGeometry args={[0.072, 20, 20]} />
              <meshStandardMaterial color="#f4f4f5" roughness={0.35} />
            </mesh>
            <mesh position={[0.012, -0.03, 0.026]}>
              <sphereGeometry args={[0.045, 16, 16]} />
              <meshStandardMaterial color="#0a0a0b" roughness={0.4} />
            </mesh>
            <mesh position={[-0.028, 0.02, 0.038]}>
              <sphereGeometry args={[0.014, 10, 10]} />
              <meshStandardMaterial color="#ffffff" roughness={0.2} />
            </mesh>
          </group>
        ))}
      </group>
    )
  }

  if (eyeKind === 'slit') {
    return (
      <group>
        {pairs.map((p, i) => (
          <mesh key={i} castShadow position={p}>
            <boxGeometry args={[0.045, 0.15, 0.028]} />
            <meshStandardMaterial color="#070708" roughness={0.45} />
          </mesh>
        ))}
      </group>
    )
  }

  if (eyeKind === 'star') {
    return (
      <group>
        {pairs.map((p, i) => (
          <mesh
            key={i}
            castShadow
            position={p}
            rotation={[0.25, i === 0 ? 0.3 : -0.3, 0]}
          >
            <octahedronGeometry args={[0.072]} />
            <meshStandardMaterial
              color="#fde047"
              emissive="#fde047"
              emissiveIntensity={0.45}
              roughness={0.45}
            />
          </mesh>
        ))}
      </group>
    )
  }

  if (eyeKind === 'heart') {
    return (
      <group>
        {pairs.map((p, i) => (
          <mesh key={i} castShadow position={p} scale={[1.2, 1.15, 0.42]}>
            <sphereGeometry args={[0.062, 18, 18]} />
            <meshStandardMaterial color="#e11d48" roughness={0.35} emissive="#9f1239" emissiveIntensity={0.15} />
          </mesh>
        ))}
      </group>
    )
  }

  if (eyeKind === 'button') {
    return (
      <group>
        {pairs.map((p, i) => (
          <group key={i} position={p} rotation={[0.16, i === 0 ? 0.07 : -0.07, 0]}>
            <mesh castShadow rotation={[0.22, 0, 0]} scale={[1, 1, 0.4]}>
              <sphereGeometry args={[0.074, 22, 22]} />
              <meshStandardMaterial color="#161618" roughness={0.28} metalness={0.22} />
            </mesh>
            <mesh castShadow position={[0.022, 0.028, 0.048]} rotation={[0.22, 0, 0]} scale={[1, 1, 0.45]}>
              <sphereGeometry args={[0.015, 10, 10]} />
              <meshStandardMaterial color="#09090b" roughness={0.55} />
            </mesh>
            <mesh castShadow position={[-0.022, 0.028, 0.048]} rotation={[0.22, 0, 0]} scale={[1, 1, 0.45]}>
              <sphereGeometry args={[0.015, 10, 10]} />
              <meshStandardMaterial color="#09090b" roughness={0.55} />
            </mesh>
            <mesh castShadow position={[0.022, -0.028, 0.048]} rotation={[0.22, 0, 0]} scale={[1, 1, 0.45]}>
              <sphereGeometry args={[0.015, 10, 10]} />
              <meshStandardMaterial color="#09090b" roughness={0.55} />
            </mesh>
            <mesh castShadow position={[-0.022, -0.028, 0.048]} rotation={[0.22, 0, 0]} scale={[1, 1, 0.45]}>
              <sphereGeometry args={[0.015, 10, 10]} />
              <meshStandardMaterial color="#09090b" roughness={0.55} />
            </mesh>
            <mesh castShadow position={[0, 0.015, 0.058]} rotation={[0.22, 0, Math.PI / 4]} scale={[0.055, 0.016, 0.016]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#d4d4d8" roughness={0.45} />
            </mesh>
            <mesh castShadow position={[0, 0.015, 0.058]} rotation={[0.22, 0, -Math.PI / 4]} scale={[0.055, 0.016, 0.016]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#d4d4d8" roughness={0.45} />
            </mesh>
          </group>
        ))}
      </group>
    )
  }

  if (eyeKind === 'spiral') {
    return (
      <group>
        {pairs.map((p, i) => (
          <mesh
            key={i}
            castShadow
            position={p}
            rotation={[Math.PI / 2 + 0.15 * i, 0.4 * i, 0]}
          >
            <torusGeometry args={[0.056, 0.016, 14, 36]} />
            <meshStandardMaterial color="#6d28d9" emissive="#5b21b6" emissiveIntensity={0.35} roughness={0.45} />
          </mesh>
        ))}
      </group>
    )
  }

  /* gem */
  return (
    <group>
      {pairs.map((p, i) => (
        <mesh key={i} castShadow position={p} rotation={[0.2, i * 0.35, 0.15]}>
          <octahedronGeometry args={[0.068]} />
          <meshStandardMaterial
            color="#22d3ee"
            metalness={0.65}
            roughness={0.22}
            emissive="#0891b2"
            emissiveIntensity={0.35}
          />
        </mesh>
      ))}
    </group>
  )
}

function Hat3D({ hat }: { hat: HatKind }) {
  if (hat === 'none') return null

  if (hat === 'mini') {
    return (
      <group position={[0, 0.96, 0]}>
        <mesh castShadow rotation={[Math.PI / 2, 0, 0]} position={[0, 0.045, 0]}>
          <cylinderGeometry args={[0.44, 0.44, 0.055, 36]} />
          <meshStandardMaterial color="#171717" roughness={0.55} metalness={0.08} />
        </mesh>
        <mesh castShadow position={[0, 0.11, 0]}>
          <boxGeometry args={[0.34, 0.12, 0.34]} />
          <meshStandardMaterial color="#27272a" roughness={0.65} />
        </mesh>
      </group>
    )
  }

  if (hat === 'tulle') {
    return (
      <mesh
        castShadow
        position={[0, 1.05, -0.08]}
        scale={[1.08, 0.62, 1.08]}
      >
        <sphereGeometry args={[0.52, 36, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#e4e4e7"
          transparent
          opacity={0.42}
          roughness={0.35}
          metalness={0.05}
          side={DoubleSide}
        />
      </mesh>
    )
  }

  if (hat === 'beanie') {
    return (
      <group position={[0, 0.82, 0.02]}>
        <mesh castShadow scale={[1.05, 0.62, 1.08]} position={[0, 0.14, -0.06]}>
          <sphereGeometry args={[0.42, 28, 28, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
          <meshStandardMaterial color="#3f3f46" roughness={0.88} />
        </mesh>
        <mesh castShadow position={[0, 0.96, -0.38]} rotation={[0.15, 0, 0]}>
          <torusGeometry args={[0.38, 0.035, 10, 28]} />
          <meshStandardMaterial color="#27272a" roughness={0.75} />
        </mesh>
      </group>
    )
  }

  if (hat === 'horns') {
    return (
      <group>
        <mesh castShadow position={[-0.26, 1.02, -0.05]} rotation={[0.35, 0, -0.55]}>
          <coneGeometry args={[0.07, 0.26, 10]} />
          <meshStandardMaterial color="#18181b" roughness={0.45} metalness={0.15} />
        </mesh>
        <mesh castShadow position={[0.26, 1.02, -0.05]} rotation={[0.35, 0, 0.55]}>
          <coneGeometry args={[0.07, 0.26, 10]} />
          <meshStandardMaterial color="#18181b" roughness={0.45} metalness={0.15} />
        </mesh>
      </group>
    )
  }

  /* bow */
  return (
    <group position={[0, 0.98, 0.38]} rotation={[0.15, 0, 0]}>
      <mesh castShadow rotation={[0, 0, Math.PI / 5]} position={[-0.11, 0, 0]}>
        <boxGeometry args={[0.15, 0.06, 0.055]} />
        <meshStandardMaterial color="#c9264a" roughness={0.5} />
      </mesh>
      <mesh castShadow rotation={[0, 0, -Math.PI / 5]} position={[0.11, 0, 0]}>
        <boxGeometry args={[0.15, 0.06, 0.055]} />
        <meshStandardMaterial color="#c9264a" roughness={0.5} />
      </mesh>
      <mesh castShadow position={[0, -0.02, 0]}>
        <boxGeometry args={[0.06, 0.07, 0.06]} />
        <meshStandardMaterial color="#be123c" roughness={0.55} />
      </mesh>
    </group>
  )
}

function Charm3D({
  charm,
  fabricAccentHex,
  baseY = -0.05,
  baseZ = 0.58,
}: {
  charm: CharmKind
  fabricAccentHex: string
  baseY?: number
  baseZ?: number
}) {
  const z = baseZ
  const y = baseY

  if (charm === 'moon') {
    return (
      <mesh castShadow position={[0.08, y, z]} rotation={[0.25, 0.4, 0.35]}>
        <torusGeometry args={[0.065, 0.016, 10, 28, Math.PI * 1.35]} />
        <meshStandardMaterial color="#f4f4f5" roughness={0.45} metalness={0.25} />
      </mesh>
    )
  }

  if (charm === 'web') {
    return (
      <group position={[0, y + 0.06, z + 0.05]}>
        {[0, 1, 2, 3].map((k) => (
          <mesh key={k} rotation={[0, 0, (Math.PI / 4) * k]}>
            <boxGeometry args={[0.26, 0.016, 0.016]} />
            <meshStandardMaterial color="#d4d4d8" roughness={0.7} />
          </mesh>
        ))}
      </group>
    )
  }

  if (charm === 'heart') {
    return (
      <mesh castShadow position={[0, y + 0.08, z + 0.06]} rotation={[0.15, 0, 0]}>
        <sphereGeometry args={[0.055, 14, 14]} />
        <meshStandardMaterial
          color="#71717a"
          roughness={0.55}
          metalness={0.12}
          emissive={fabricAccentHex}
          emissiveIntensity={0.12}
        />
      </mesh>
    )
  }

  if (charm === 'sparkle') {
    return (
      <mesh castShadow position={[0, y + 0.07, z + 0.08]} rotation={[0.35, 0.6, 0.2]}>
        <octahedronGeometry args={[0.055]} />
        <meshStandardMaterial
          color="#fde047"
          emissive="#fde047"
          emissiveIntensity={0.5}
          roughness={0.35}
          metalness={0.2}
        />
      </mesh>
    )
  }

  if (charm === 'skull') {
    return (
      <mesh castShadow position={[0.05, y + 0.1, z + 0.07]} rotation={[0.1, -0.35, 0]}>
        <icosahedronGeometry args={[0.05, 1]} />
        <meshStandardMaterial color="#a1a1aa" roughness={0.55} metalness={0.25} />
      </mesh>
    )
  }

  /* rose */
  return (
    <group position={[0, y + 0.08, z + 0.06]}>
      <mesh castShadow position={[0.03, 0.02, 0.02]}>
        <sphereGeometry args={[0.038, 12, 12]} />
        <meshStandardMaterial color="#be123c" roughness={0.45} />
      </mesh>
      <mesh castShadow position={[-0.03, 0.03, -0.01]}>
        <sphereGeometry args={[0.032, 10, 10]} />
        <meshStandardMaterial color="#9f1239" roughness={0.5} />
      </mesh>
      <mesh castShadow position={[0, -0.02, 0.03]}>
        <sphereGeometry args={[0.028, 10, 10]} />
        <meshStandardMaterial color="#fb7185" roughness={0.4} />
      </mesh>
    </group>
  )
}
