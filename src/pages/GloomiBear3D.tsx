import { Canvas } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import { DoubleSide } from 'three'
import type { CharmKind, EyeKind, HatKind } from './gloomiBearTypes'

export type { CharmKind, EyeKind, HatKind } from './gloomiBearTypes'

type Props = {
  fabricHex: string
  eyeKind: EyeKind
  hat: HatKind
  charm: CharmKind
  className?: string
}

/** Oso tipo peluche en 3D: arrastra para orbitar (360°). */
export function GloomiBear3D({
  fabricHex,
  eyeKind,
  hat,
  charm,
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
          aria-label="Vista 3D del Gloomi. Arrastra para girar."
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
            <BearMesh
              fabricHex={fabricHex}
              eyeKind={eyeKind}
              hat={hat}
              charm={charm}
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

function BearMesh({
  fabricHex,
  eyeKind,
  hat,
  charm,
}: {
  fabricHex: string
  eyeKind: EyeKind
  hat: HatKind
  charm: CharmKind
}) {
  return (
    <group>
      {/* Cuerpo */}
      <mesh
        castShadow
        receiveShadow
        position={[0, -0.36, 0]}
        scale={[1.08, 0.96, 0.94]}
      >
        <sphereGeometry args={[0.63, 48, 48]} />
        <meshStandardMaterial
          color={fabricHex}
          roughness={0.9}
          metalness={0.04}
        />
      </mesh>

      {/* Brazos */}
      <mesh
        castShadow
        position={[-0.58, -0.02, 0.04]}
        rotation={[0, 0, 0.55]}
      >
        <capsuleGeometry args={[0.11, 0.34, 6, 16]} />
        <meshStandardMaterial
          color={fabricHex}
          roughness={0.9}
          metalness={0.04}
        />
      </mesh>
      <mesh
        castShadow
        position={[0.58, -0.02, 0.04]}
        rotation={[0, 0, -0.55]}
      >
        <capsuleGeometry args={[0.11, 0.34, 6, 16]} />
        <meshStandardMaterial
          color={fabricHex}
          roughness={0.9}
          metalness={0.04}
        />
      </mesh>

      {/* Patas */}
      <mesh castShadow position={[-0.22, -0.82, 0.12]} scale={[1, 0.72, 1]}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial
          color={fabricHex}
          roughness={0.9}
          metalness={0.04}
        />
      </mesh>
      <mesh castShadow position={[0.22, -0.82, 0.12]} scale={[1, 0.72, 1]}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial
          color={fabricHex}
          roughness={0.9}
          metalness={0.04}
        />
      </mesh>

      {/* Cabeza */}
      <mesh castShadow receiveShadow position={[0, 0.44, 0.06]}>
        <sphereGeometry args={[0.47, 48, 48]} />
        <meshStandardMaterial
          color={fabricHex}
          roughness={0.86}
          metalness={0.04}
        />
      </mesh>

      {/* Hocico */}
      <mesh castShadow position={[0, 0.34, 0.44]} scale={[1.05, 0.9, 0.72]}>
        <sphereGeometry args={[0.24, 28, 28]} />
        <meshStandardMaterial
          color={fabricHex}
          roughness={0.82}
          metalness={0.03}
        />
      </mesh>

      {/* Orejas */}
      <mesh castShadow position={[-0.4, 0.74, -0.04]} scale={[1.05, 1.15, 0.92]}>
        <sphereGeometry args={[0.19, 20, 20]} />
        <meshStandardMaterial
          color={fabricHex}
          roughness={0.88}
          metalness={0.04}
        />
      </mesh>
      <mesh castShadow position={[0.4, 0.74, -0.04]} scale={[1.05, 1.15, 0.92]}>
        <sphereGeometry args={[0.19, 20, 20]} />
        <meshStandardMaterial
          color={fabricHex}
          roughness={0.88}
          metalness={0.04}
        />
      </mesh>

      {/* Nariz */}
      <mesh castShadow position={[0, 0.26, 0.62]} rotation={[0.25, 0, 0]}>
        <sphereGeometry args={[0.065, 18, 18]} />
        <meshStandardMaterial color="#141417" roughness={0.65} />
      </mesh>

      <Eyes3D eyeKind={eyeKind} />
      <Hat3D hat={hat} />
      <Charm3D charm={charm} fabricHex={fabricHex} />

      {/* Costura tipo mockup — línea sutil en el frente */}
      <mesh position={[0, 0.02, 0.66]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.018, 1.35, 0.012]} />
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

function Eyes3D({ eyeKind }: { eyeKind: EyeKind }) {
  const lz = 0.48
  const ly = 0.48
  const pairs: [number, number, number][] = [
    [-0.13, ly, lz],
    [0.13, ly, lz],
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
  fabricHex,
}: {
  charm: CharmKind
  fabricHex: string
}) {
  const z = 0.58
  const y = -0.05

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
          emissive={fabricHex}
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
