/**
 * Mascota vectorial tipo cartoon para el modal de bienvenida.
 * Brazo con animación SMIL (saludo); resto estático.
 */
export function WelcomeGloomiWave({
  className = '',
  'aria-hidden': ariaHidden = true,
}: {
  className?: string
  'aria-hidden'?: boolean
}) {
  return (
    <div
      className={`mx-auto flex justify-center ${className}`}
      aria-hidden={ariaHidden}
    >
      <svg
        viewBox="0 0 220 240"
        className="h-36 w-auto max-w-[11rem] shrink-0 text-zinc-900 sm:h-44 sm:max-w-[13rem]"
        role="presentation"
      >
        <defs>
          <pattern
            id="welcome-plaid"
            patternUnits="userSpaceOnUse"
            width="14"
            height="14"
          >
            <rect width="14" height="14" fill="#2f4a38" />
            <path
              d="M0 7h14M7 0v14"
              stroke="#e8e8e8"
              strokeOpacity={0.55}
              strokeWidth="1.25"
            />
            <path
              d="M0 3.5h14M0 10.5h14M3.5 0v14M10.5 0v14"
              stroke="#121212"
              strokeOpacity={0.35}
              strokeWidth="0.85"
            />
          </pattern>
          <filter id="welcome-soft-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Sombra suelo */}
        <ellipse cx="110" cy="224" rx="56" ry="10" fill="#000" opacity="0.35" />

        <g filter="url(#welcome-soft-glow)">
          {/* Orejas */}
          <path
            d="M62 78c-14-28-10-52 8-58 16-5 28 12 32 38"
            fill="url(#welcome-plaid)"
            stroke="#141414"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M158 78c14-28 10-52-8-58-16-5-28 12-32 38"
            fill="url(#welcome-plaid)"
            stroke="#141414"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Lazos orejas */}
          <path
            d="M72 96c4 2 6 8 2 10m-6-10c-4 2-6 8-2 10"
            fill="none"
            stroke="#101010"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M148 96c4 2 6 8 2 10m-6-10c-4 2-6 8-2 10"
            fill="none"
            stroke="#101010"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Cabeza */}
          <ellipse
            cx="110"
            cy="108"
            rx="54"
            ry="50"
            fill="url(#welcome-plaid)"
            stroke="#141414"
            strokeWidth="2.4"
          />

          {/* Collar encaje */}
          <path
            d="M72 138c10-6 20-8 38-8s28 2 38 8v6c-12-8-26-10-38-10s-26 2-38 10z"
            fill="#181818"
            opacity="0.92"
          />
          <path
            d="M76 141c8-4 18-6 34-6s26 2 34 6"
            fill="none"
            stroke="#3f3f46"
            strokeWidth="1"
            strokeDasharray="3 4"
            opacity="0.8"
          />

          {/* Cuerpo */}
          <path
            d="M78 152c0-8 10-14 32-14s32 6 32 14c0 26-8 56-32 56s-32-30-32-56"
            fill="url(#welcome-plaid)"
            stroke="#141414"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />

          {/* Piernas */}
          <ellipse cx="92" cy="208" rx="16" ry="14" fill="url(#welcome-plaid)" stroke="#141414" strokeWidth="2" />
          <ellipse cx="128" cy="208" rx="16" ry="14" fill="url(#welcome-plaid)" stroke="#141414" strokeWidth="2" />

          {/* Brazo quieto (izquierda del muñeco) */}
          <ellipse
            cx="72"
            cy="178"
            rx="14"
            ry="22"
            fill="url(#welcome-plaid)"
            stroke="#141414"
            strokeWidth="2"
            transform="rotate(-12 72 178)"
          />

          {/* Ojos: botón oscuro + corazón (icono 24×24 escalado) */}
          <circle cx="88" cy="102" r="14" fill="#0f0f10" stroke="#2a2a2e" strokeWidth="1.5" />
          <circle cx="132" cy="102" r="14" fill="#0f0f10" stroke="#2a2a2e" strokeWidth="1.5" />
          <g transform="translate(79.2 91.5) scale(0.36)">
            <path
              fill="#f4f4f5"
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </g>
          <g transform="translate(123.2 91.5) scale(0.36)">
            <path
              fill="#f4f4f5"
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </g>
          <circle cx="86" cy="99" r="1.15" fill="#18181b" />
          <circle cx="90" cy="99" r="1.15" fill="#18181b" />
          <circle cx="130" cy="99" r="1.15" fill="#18181b" />
          <circle cx="134" cy="99" r="1.15" fill="#18181b" />

          {/* Boca X */}
          <path
            d="M104 118l12 12m0-12l-12 12"
            stroke="#141414"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Costuras decorativas cabeza */}
          <ellipse
            cx="110"
            cy="108"
            rx="54"
            ry="50"
            fill="none"
            stroke="#141414"
            strokeWidth="1"
            strokeDasharray="4 6"
            opacity="0.45"
          />
        </g>

        {/* Brazo que saluda — pivote en hombro derecho del personaje */}
        <g transform="translate(148 164)">
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="-8; 26; -8"
              dur="1.15s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
              keyTimes="0;0.5;1"
            />
            <ellipse
              cx="8"
              cy="-28"
              rx="15"
              ry="36"
              fill="url(#welcome-plaid)"
              stroke="#141414"
              strokeWidth="2.2"
              transform="rotate(-18 8 -28)"
            />
            {/* “mano” redondeada */}
            <circle cx="22" cy="-54" r="12" fill="url(#welcome-plaid)" stroke="#141414" strokeWidth="2" />
          </g>
        </g>
      </svg>
    </div>
  )
}
