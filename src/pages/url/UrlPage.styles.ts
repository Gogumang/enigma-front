import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

export const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const Input = styled.input`
  width: 100%;
  padding: 16px;
  border: 1px solid #e5e8eb;
  border-radius: 12px;
  background: #fff;
  font-size: 16px;
  color: #191f28;
  margin-bottom: 16px;

  &:focus {
    outline: none;
    border-color: #ff9500;
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 16px;
  background: #ff9500;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:active {
    background: #e68600;
  }

  &:disabled {
    background: #e5e8eb;
    color: #adb5bd;
  }
`;

export const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const Result = styled.div`
  margin-top: 24px;
`;

export const ResultCard = styled.div<{ $status: 'safe' | 'warning' | 'danger' }>`
  padding: 28px 24px;
  text-align: center;
  border-radius: 16px;
  background: ${props =>
    props.$status === 'safe' ? '#e8f7f0' :
    props.$status === 'warning' ? '#fff8e6' : '#ffebee'};
`;

export const ResultIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
`;

export const ResultTitle = styled.div<{ $status: 'safe' | 'warning' | 'danger' }>`
  font-size: 20px;
  font-weight: 700;
  color: ${props =>
    props.$status === 'safe' ? '#20c997' :
    props.$status === 'warning' ? '#ff9500' : '#f04452'};
  margin-bottom: 8px;
`;

export const ResultMessage = styled.div`
  font-size: 14px;
  color: #6b7684;
  line-height: 1.5;
`;

export const RiskScoreBar = styled.div`
  margin-top: 20px;
`;

export const RiskScoreLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #6b7684;
  margin-bottom: 8px;
`;

export const RiskScoreTrack = styled.div`
  height: 8px;
  background: #e5e8eb;
  border-radius: 4px;
  overflow: hidden;
`;

export const RiskScoreFill = styled.div<{ $value: number; $status: 'safe' | 'warning' | 'danger' }>`
  height: 100%;
  width: ${props => props.$value}%;
  background: ${props =>
    props.$status === 'safe' ? '#20c997' :
    props.$status === 'warning' ? '#ff9500' : '#f04452'};
  border-radius: 4px;
  transition: width 0.5s ease;
`;

export const Section = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-top: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

export const SectionTitle = styled.h4`
  font-size: 15px;
  font-weight: 600;
  color: #191f28;
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f2f4f6;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-of-type {
    padding-top: 0;
  }
`;

export const DetailLabel = styled.span`
  font-size: 14px;
  color: #8b95a1;
  flex-shrink: 0;
`;

export const DetailValue = styled.span<{ $bad?: boolean; $good?: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.$bad ? '#f04452' : props.$good ? '#20c997' : '#191f28'};
  text-align: right;
  word-break: break-all;
  max-width: 60%;
`;

export const WarningList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const WarningItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  background: #fff5f5;
  border-radius: 10px;
  font-size: 14px;
  color: #333;
  line-height: 1.4;
`;

export const RedirectChain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const RedirectItem = styled.div<{ $isLast?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: ${props => props.$isLast ? '#e8f7f0' : '#f8f9fa'};
  border-radius: 8px;
  font-size: 13px;
  word-break: break-all;
`;

export const RedirectNumber = styled.span`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #6b7684;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
`;
