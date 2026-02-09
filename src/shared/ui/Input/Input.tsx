import { forwardRef, type InputHTMLAttributes } from 'react';
import { Container, Label, StyledInput, ErrorText } from './Input.styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <Container>
        {label && <Label>{label}</Label>}
        <StyledInput ref={ref} $hasError={!!error} {...props} />
        {error && <ErrorText>{error}</ErrorText>}
      </Container>
    );
  }
);

Input.displayName = 'Input';
