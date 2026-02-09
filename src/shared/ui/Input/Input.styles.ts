import styled from '@emotion/styled';

export const Container = styled.div`
  margin-bottom: 16px;
`;

export const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #6b7684;
  margin-bottom: 8px;
`;

export const StyledInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 16px;
  border: 1px solid ${props => props.$hasError ? '#f04452' : '#e5e8eb'};
  border-radius: 12px;
  background: #fff;
  font-size: 16px;
  color: #191f28;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#f04452' : '#3182f6'};
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

export const ErrorText = styled.span`
  display: block;
  font-size: 13px;
  color: #f04452;
  margin-top: 6px;
`;
