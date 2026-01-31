'use client';

export default function ChatAnalysisIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="chatGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06c755" />
          <stop offset="100%" stopColor="#00a650" />
        </linearGradient>
        <linearGradient id="chatGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6b6b" />
          <stop offset="100%" stopColor="#ee5a5a" />
        </linearGradient>
        <filter id="chatShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#06c755" floodOpacity="0.25"/>
        </filter>
      </defs>

      {/* Main chat bubble */}
      <rect x="6" y="8" width="36" height="28" rx="6" fill="url(#chatGrad1)" filter="url(#chatShadow)" />
      <path d="M12 36L6 44V36H12Z" fill="url(#chatGrad1)" />

      {/* Chat lines */}
      <rect x="12" y="16" width="24" height="3" rx="1.5" fill="white" opacity="0.9" />
      <rect x="12" y="23" width="18" height="3" rx="1.5" fill="white" opacity="0.6" />

      {/* Analysis bubble */}
      <rect x="26" y="32" width="32" height="24" rx="5" fill="url(#chatGrad2)" filter="url(#chatShadow)" />
      <path d="M52 56L58 62V56H52Z" fill="url(#chatGrad2)" />

      {/* Warning icon */}
      <circle cx="42" cy="44" r="8" fill="white" opacity="0.2" />
      <path d="M42 39V45M42 48V49" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
