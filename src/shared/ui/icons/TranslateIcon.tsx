export function TranslateIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="transGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f093fb" />
          <stop offset="100%" stopColor="#f5576c" />
        </linearGradient>
        <linearGradient id="transGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4facfe" />
          <stop offset="100%" stopColor="#00f2fe" />
        </linearGradient>
        <filter id="transShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#f5576c" floodOpacity="0.3"/>
        </filter>
      </defs>

      {/* Left document */}
      <rect x="4" y="10" width="24" height="32" rx="4" fill="url(#transGrad1)" filter="url(#transShadow)" />
      <rect x="8" y="16" width="16" height="2" rx="1" fill="white" opacity="0.8" />
      <rect x="8" y="22" width="12" height="2" rx="1" fill="white" opacity="0.6" />
      <rect x="8" y="28" width="14" height="2" rx="1" fill="white" opacity="0.6" />
      <rect x="8" y="34" width="10" height="2" rx="1" fill="white" opacity="0.4" />

      {/* Arrow */}
      <path d="M30 32H34L32 28M30 32H34L32 36M30 32H42" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Right document */}
      <rect x="36" y="22" width="24" height="32" rx="4" fill="url(#transGrad2)" filter="url(#transShadow)" />
      <rect x="40" y="28" width="16" height="2" rx="1" fill="white" opacity="0.8" />
      <rect x="40" y="34" width="12" height="2" rx="1" fill="white" opacity="0.6" />
      <rect x="40" y="40" width="14" height="2" rx="1" fill="white" opacity="0.6" />
      <rect x="40" y="46" width="10" height="2" rx="1" fill="white" opacity="0.4" />

      {/* Sparkle */}
      <circle cx="52" cy="16" r="4" fill="#ffd700" />
      <path d="M52 10V12M52 20V22M46 16H48M56 16H58" stroke="#ffd700" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
