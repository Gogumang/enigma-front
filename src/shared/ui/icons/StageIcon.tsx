export function StageIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="stageGrad1" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
        <linearGradient id="stageGrad2" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#f093fb" />
          <stop offset="100%" stopColor="#f5576c" />
        </linearGradient>
        <linearGradient id="stageGrad3" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#ff9500" />
          <stop offset="100%" stopColor="#ffb800" />
        </linearGradient>
        <filter id="stageShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#764ba2" floodOpacity="0.3"/>
        </filter>
      </defs>

      {/* Timeline line */}
      <rect x="10" y="30" width="44" height="4" rx="2" fill="#e0e0e0" />

      {/* Stage 1 - completed */}
      <circle cx="14" cy="32" r="8" fill="url(#stageGrad1)" filter="url(#stageShadow)" />
      <path d="M11 32L13 34L17 30" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Stage 2 - completed */}
      <circle cx="28" cy="32" r="8" fill="url(#stageGrad1)" filter="url(#stageShadow)" />
      <path d="M25 32L27 34L31 30" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Stage 3 - current */}
      <circle cx="42" cy="32" r="10" fill="url(#stageGrad2)" filter="url(#stageShadow)" />
      <text x="42" y="36" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">3</text>

      {/* Stage 4 - upcoming */}
      <circle cx="54" cy="32" r="6" fill="#ddd" />
      <text x="54" y="35" textAnchor="middle" fill="#999" fontSize="10">4</text>

      {/* Warning indicator */}
      <path d="M42 12L46 20H38L42 12Z" fill="url(#stageGrad3)" />
      <rect x="41" y="14" width="2" height="3" rx="1" fill="white" />
      <circle cx="42" cy="18.5" r="1" fill="white" />

      {/* Countdown */}
      <rect x="32" y="46" width="20" height="12" rx="4" fill="url(#stageGrad2)" opacity="0.9" />
      <text x="42" y="55" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">7일</text>
    </svg>
  );
}
