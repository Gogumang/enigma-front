interface Props {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function ChevronLeftIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      role="img"
      aria-label="뒤로가기"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
