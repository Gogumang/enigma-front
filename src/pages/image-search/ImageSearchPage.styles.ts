import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

export const ContentWrapper = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px 0;
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const LoadingOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  animation: ${fadeIn} 0.2s ease;
`;

export const LoadingLottieWrapper = styled.div`
  width: 180px;
  height: 180px;
`;

export const LoadingText = styled.div`
  font-size: 17px;
  font-weight: 600;
  color: #fff;
`;

export const LoadingSubtext = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  line-height: 1.5;
`;

export const DropzoneWrapper = styled.div`
  margin-bottom: 20px;
`;

export const Button = styled.button`
  width: 100%;
  padding: 16px;
  background: var(--accent-gradient);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  &:active {
    opacity: 0.9;
  }

  &:disabled {
    background: var(--border-color);
    color: var(--text-tertiary);
  }
`;

export const TipCard = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: var(--bg-card);
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
`;

export const TipTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
`;

export const TipList = styled.ul`
  margin: 0;
  padding: 0 0 0 20px;
`;

export const TipItem = styled.li`
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.8;
`;

export const ErrorMessage = styled.div`
  padding: 16px;
  background: #ffebee;
  border-radius: 12px;
  color: #f04452;
  font-size: 14px;
  margin-top: 16px;
  text-align: center;
`;
