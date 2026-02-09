import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { StyledButton } from './Button.styles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  fullWidth = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <StyledButton $variant={variant} $fullWidth={fullWidth} {...props}>
      {children}
    </StyledButton>
  );
}
