interface Props {
  size?: number;
  color?: string;
}

export function SendIcon({ size = 24, color = 'currentColor' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      role="img"
      aria-label="보내기"
    >
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}
