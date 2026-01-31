export function TrainingIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="trainGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9333ea" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="trainGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06c755" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <filter id="trainShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#9333ea" floodOpacity="0.3"/>
        </filter>
      </defs>

      {/* Phone frame */}
      <rect x="14" y="4" width="36" height="56" rx="6" fill="#1a1a1a" filter="url(#trainShadow)" />
      <rect x="17" y="10" width="30" height="40" rx="2" fill="#2d2d2d" />

      {/* Scammer message */}
      <rect x="20" y="14" width="18" height="8" rx="4" fill="url(#trainGrad1)" />
      <rect x="22" y="17" width="10" height="2" rx="1" fill="white" opacity="0.7" />

      {/* User response options */}
      <rect x="20" y="26" width="24" height="6" rx="3" fill="url(#trainGrad2)" />
      <rect x="20" y="34" width="24" height="6" rx="3" fill="#ff6b6b" />
      <rect x="20" y="42" width="24" height="6" rx="3" fill="#ff9500" />

      {/* Checkmark indicator */}
      <circle cx="48" cy="29" r="5" fill="url(#trainGrad2)" />
      <path d="M45.5 29L47 30.5L50.5 27" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Shield badge */}
      <circle cx="50" cy="12" r="8" fill="url(#trainGrad2)" />
      <path d="M50 7L46 10V14C46 16.5 47.5 18.5 50 19.5C52.5 18.5 54 16.5 54 14V10L50 7Z" fill="white" opacity="0.3" />
      <path d="M48 13L49.5 14.5L52.5 11.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
