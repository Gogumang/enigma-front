import styled from '@emotion/styled';

export const StyledCard = styled.div<{ $padding: string }>`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: ${props => {
    switch (props.$padding) {
      case 'sm':
        return '12px';
      case 'lg':
        return '28px 24px';
      default:
        return '20px';
    }
  }};
`;
