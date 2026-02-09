interface Props {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function ChevronDownIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      role="img"
      aria-label="펼치기"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
