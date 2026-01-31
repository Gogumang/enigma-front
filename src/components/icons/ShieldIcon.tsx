'use client';

export default function ShieldIcon({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shieldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
        <linearGradient id="shieldGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f093fb" />
          <stop offset="100%" stopColor="#f5576c" />
        </linearGradient>
        <filter id="shieldShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#764ba2" floodOpacity="0.3"/>
        </filter>
      </defs>
      <path
        d="M40 8L12 20V36C12 54.8 23.6 72.2 40 76C56.4 72.2 68 54.8 68 36V20L40 8Z"
        fill="url(#shieldGrad1)"
        filter="url(#shieldShadow)"
      />
      <path
        d="M40 12L16 22.5V36C16 52.5 26.2 67.5 40 71C53.8 67.5 64 52.5 64 36V22.5L40 12Z"
        fill="url(#shieldGrad2)"
        opacity="0.3"
      />
      <path
        d="M36 42L32 38L29 41L36 48L52 32L49 29L36 42Z"
        fill="white"
      />
    </svg>
  );
}
