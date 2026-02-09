interface Props {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function EmojiIcon({ size = 24, color = 'currentColor', strokeWidth = 1.5 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      role="img"
      aria-label="이모지"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <circle cx="9" cy="9" r="1" fill={color} />
      <circle cx="15" cy="9" r="1" fill={color} />
    </svg>
  );
}
