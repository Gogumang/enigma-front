interface Props {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function PlusIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      role="img"
      aria-label="추가"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
