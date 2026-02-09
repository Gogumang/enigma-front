import type { ReactNode } from 'react';
import { StyledCard } from './Card.styles';

interface CardProps {
  children: ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Card({ children, padding = 'md', className }: CardProps) {
  return (
    <StyledCard $padding={padding} className={className}>
      {children}
    </StyledCard>
  );
}
