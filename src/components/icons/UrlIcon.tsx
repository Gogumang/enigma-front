'use client';

export default function UrlIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="urlGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff9500" />
          <stop offset="100%" stopColor="#ff6b00" />
        </linearGradient>
        <linearGradient id="urlGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06c755" />
          <stop offset="100%" stopColor="#00a650" />
        </linearGradient>
        <filter id="urlShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#ff9500" floodOpacity="0.3"/>
        </filter>
      </defs>

      {/* Globe */}
      <circle cx="26" cy="32" r="18" fill="url(#urlGrad1)" filter="url(#urlShadow)" />
      <ellipse cx="26" cy="32" rx="8" ry="18" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4" />
      <line x1="8" y1="32" x2="44" y2="32" stroke="white" strokeWidth="1.5" opacity="0.4" />
      <line x1="26" y1="14" x2="26" y2="50" stroke="white" strokeWidth="1.5" opacity="0.4" />
      <ellipse cx="26" cy="24" rx="15" ry="4" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3" />
      <ellipse cx="26" cy="40" rx="15" ry="4" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3" />

      {/* Link chain */}
      <rect x="38" y="20" width="20" height="10" rx="5" fill="none" stroke="url(#urlGrad2)" strokeWidth="3" />
      <rect x="44" y="28" width="20" height="10" rx="5" fill="none" stroke="url(#urlGrad2)" strokeWidth="3" />
      <line x1="48" y1="25" x2="52" y2="33" stroke="url(#urlGrad2)" strokeWidth="3" strokeLinecap="round" />

      {/* Shield check */}
      <circle cx="52" cy="50" r="10" fill="url(#urlGrad2)" />
      <path d="M48 50L50.5 52.5L56 47" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
