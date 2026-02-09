import styled from '@emotion/styled';

export const StyledButton = styled.button<{ $variant: string; $fullWidth: boolean }>`
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  background: ${props => {
    switch (props.$variant) {
      case 'secondary':
        return '#f2f4f6';
      case 'danger':
        return '#f04452';
      default:
        return '#3182f6';
    }
  }};

  color: ${props => {
    switch (props.$variant) {
      case 'secondary':
        return '#191f28';
      default:
        return '#fff';
    }
  }};

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    background: #e5e8eb;
    color: #adb5bd;
    cursor: not-allowed;
  }
`;
