export function FraudIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fraudGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff334b" />
          <stop offset="100%" stopColor="#e62e42" />
        </linearGradient>
        <linearGradient id="fraudGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#333" />
        </linearGradient>
        <filter id="fraudShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#ff334b" floodOpacity="0.3"/>
        </filter>
      </defs>

      {/* Magnifying glass handle */}
      <rect x="44" y="44" width="16" height="6" rx="3" fill="url(#fraudGrad2)" transform="rotate(45 44 44)" />

      {/* Magnifying glass circle */}
      <circle cx="28" cy="28" r="20" fill="white" stroke="url(#fraudGrad2)" strokeWidth="4" filter="url(#fraudShadow)" />

      {/* Person silhouette */}
      <circle cx="28" cy="22" r="6" fill="url(#fraudGrad1)" />
      <path d="M18 38C18 32.5 22.5 28 28 28C33.5 28 38 32.5 38 38" stroke="url(#fraudGrad1)" strokeWidth="4" strokeLinecap="round" />

      {/* Warning badge */}
      <circle cx="42" cy="18" r="10" fill="url(#fraudGrad1)" />
      <rect x="40.5" y="12" width="3" height="7" rx="1.5" fill="white" />
      <circle cx="42" cy="22" r="1.5" fill="white" />

      {/* Search lines */}
      <rect x="10" y="48" width="20" height="3" rx="1.5" fill="#ddd" />
      <rect x="10" y="54" width="14" height="3" rx="1.5" fill="#eee" />
    </svg>
  );
}
