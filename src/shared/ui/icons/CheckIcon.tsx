interface Props {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function CheckIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      role="img"
      aria-label="성공"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
