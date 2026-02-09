import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ResultImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60px;
  margin-bottom: 60px;
  gap: 16px;
`;

export const ImageToggle = styled.div`
  display: flex;
  gap: 8px;
  background: #f2f4f6;
  padding: 4px;
  border-radius: 10px;
`;

export const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.$active ? '#fff' : 'transparent'};
  color: ${props => props.$active ? '#191f28' : '#6b7684'};
  box-shadow: ${props => props.$active ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'};

  &:hover {
    color: #191f28;
  }
`;

export const ImageWrapper = styled.div`
  position: relative;
  display: inline-block;
  max-width: 100%;
`;

export const ResultImage = styled.img`
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
  display: block;
  border-radius: 16px;
`;

export const pulseAnimation = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(1);
    box-shadow: 0 0 0 0 rgba(240, 68, 82, 0.7);
  }
  70% {
    transform: translate(-50%, -50%) scale(1.1);
    box-shadow: 0 0 0 10px rgba(240, 68, 82, 0);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    box-shadow: 0 0 0 0 rgba(240, 68, 82, 0);
  }
`;

export const MarkerDot = styled.button<{ $x: number; $y: number; $isActive: boolean }>`
  position: absolute;
  left: ${props => props.$x}%;
  top: ${props => props.$y}%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.$isActive ? '#f04452' : 'rgba(240, 68, 82, 0.8)'};
  border: 3px solid white;
  cursor: pointer;
  z-index: 10;
  animation: ${pulseAnimation} 2s infinite;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  &:hover {
    background: #f04452;
    transform: translate(-50%, -50%) scale(1.2);
  }
`;

export const MarkerNumber = styled.span`
  color: white;
  font-size: 11px;
  font-weight: 700;
`;

export const MarkerTooltip = styled.div<{ $x: number; $y: number }>`
  position: absolute;
  left: ${props => props.$x}%;
  top: ${props => props.$y + 4}%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 13px;
  max-width: 200px;
  z-index: 20;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  &::before {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid rgba(0, 0, 0, 0.9);
  }
`;

export const TooltipLabel = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
  color: #f04452;
`;

export const TooltipDescription = styled.div`
  color: #e5e8eb;
  line-height: 1.4;
`;

export const MarkersLegend = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 16px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

export const LegendTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #191f28;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 18px;
    height: 18px;
    stroke: #f04452;
  }
`;

export const LegendItem = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  background: ${props => props.$isActive ? '#ffebee' : 'transparent'};
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f8f9fa;
  }

  & + & {
    margin-top: 8px;
  }
`;

export const LegendNumber = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #f04452;
  color: white;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const LegendContent = styled.div`
  flex: 1;
`;

export const LegendLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #191f28;
  margin-bottom: 2px;
`;

export const LegendDescription = styled.div`
  font-size: 13px;
  color: #6b7684;
  line-height: 1.4;
`;

export const ResultCard = styled.div<{ $status: 'safe' | 'warning' | 'danger' }>`
  padding: 28px 24px;
  text-align: center;
  border-radius: 16px;
  background: ${props =>
    props.$status === 'safe' ? '#e8f7f0' :
    props.$status === 'warning' ? '#fff8e6' : '#ffebee'};
`;

export const LottieContainer = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto;
`;

export const ResultTitle = styled.div<{ $status: 'safe' | 'warning' | 'danger' }>`
  font-size: 20px;
  font-weight: 700;
  color: ${props =>
    props.$status === 'safe' ? '#20c997' :
    props.$status === 'warning' ? '#ff9500' : '#f04452'};
  margin-bottom: 8px;
`;

export const ResultDesc = styled.div`
  font-size: 14px;
  color: #6b7684;
`;

export const ConfidenceBar = styled.div`
  margin-top: 20px;
`;

export const ConfidenceLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #6b7684;
  margin-bottom: 10px;
`;

export const ConfidenceTrack = styled.div`
  height: 10px;
  background: #e5e8eb;
  border-radius: 5px;
  overflow: hidden;
`;

export const ConfidenceFill = styled.div<{ $value: number; $status: 'safe' | 'warning' | 'danger' }>`
  height: 100%;
  width: ${props => props.$value}%;
  background: ${props =>
    props.$status === 'safe' ? '#20c997' :
    props.$status === 'warning' ? '#ff9500' : '#f04452'};
  border-radius: 5px;
  transition: width 0.5s ease;
`;

export const DetailCard = styled.div`
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

export const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f2f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

export const DetailLabel = styled.div`
  font-size: 14px;
  color: #6b7684;
`;

export const DetailValue = styled.div<{ $highlight?: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$highlight ? '#f04452' : '#191f28'};
`;

export const BackButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #3182f6;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;

  &:active {
    background: #1b64da;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7684;
`;

export const AlgorithmSection = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 16px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

export const AlgorithmTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #191f28;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 18px;
    height: 18px;
    stroke: #3182f6;
  }
`;

export const AlgorithmGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;

  @media (max-width: 360px) {
    grid-template-columns: 1fr;
  }
`;

export const AlgorithmItem = styled.div<{ $passed: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  background: ${props => props.$passed ? '#f8f9fa' : '#ffebee'};
  border: 1px solid ${props => props.$passed ? '#e5e8eb' : '#ffcdd2'};
`;

export const AlgorithmIcon = styled.div<{ $passed: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.$passed ? '#20c997' : '#f04452'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 12px;
    height: 12px;
    stroke: white;
    stroke-width: 3;
  }
`;

export const AlgorithmName = styled.div`
  font-size: 12px;
  color: #333;
  line-height: 1.3;
`;

export const EnsembleDetails = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f2f4f6;
  display: flex;
  gap: 16px;
`;

export const EnsembleItem = styled.div`
  flex: 1;
  text-align: center;
`;

export const EnsembleLabel = styled.div`
  font-size: 11px;
  color: #8b95a1;
  margin-bottom: 4px;
`;

export const EnsembleValue = styled.div<{ $type?: 'model' | 'algorithm' | 'ensemble' }>`
  font-size: 16px;
  font-weight: 700;
  color: ${props =>
    props.$type === 'model' ? '#3182f6' :
    props.$type === 'algorithm' ? '#ff9500' : '#191f28'};
`;
