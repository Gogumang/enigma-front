import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

export const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const TypeTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`;

export const TypeTab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 16px 12px;
  background: ${props => props.$active ? '#f04452' : '#fff'};
  color: ${props => props.$active ? '#fff' : '#191f28'};
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const TabIcon = styled.span`
  font-size: 24px;
`;

export const InputGroup = styled.div`
  margin-bottom: 16px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 16px;
  border: 1px solid #e5e8eb;
  border-radius: 12px;
  background: #fff;
  font-size: 16px;
  color: #191f28;

  &:focus {
    outline: none;
    border-color: #f04452;
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 16px;
  border: 1px solid #e5e8eb;
  border-radius: 12px;
  background: #fff;
  font-size: 16px;
  color: #191f28;
  margin-top: 12px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #f04452;
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 16px;
  background: #f04452;
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
    background: #d63341;
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

export const ResultCard = styled.div<{ $status: 'safe' | 'danger' }>`
  margin-top: 24px;
  padding: 28px 24px;
  text-align: center;
  border-radius: 16px;
  background: ${props => props.$status === 'safe' ? '#e8f7f0' : '#ffebee'};
`;

export const ResultIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
`;

export const ResultTitle = styled.div<{ $status: 'safe' | 'danger' }>`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.$status === 'safe' ? '#20c997' : '#f04452'};
  margin-bottom: 8px;
`;

export const ResultDesc = styled.div`
  font-size: 14px;
  color: #6b7684;
  line-height: 1.5;
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

export const PatternItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f2f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

export const PatternLabel = styled.span`
  font-size: 14px;
  color: #8b95a1;
`;

export const PatternValue = styled.span<{ $warning?: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$warning ? '#ff9500' : '#191f28'};
`;

export const WarningList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
`;

export const WarningItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  background: #fff8e6;
  border-radius: 10px;
  font-size: 14px;
  color: #333;
`;

export const RecommendationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const RecommendationItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 10px;
  font-size: 14px;
  color: #333;
  line-height: 1.4;
`;

export const LinkList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const LinkItem = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: #f8f9fa;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    background: #eef0f2;
    transform: translateX(4px);
  }
`;

export const LinkIcon = styled.span`
  font-size: 20px;
`;

export const LinkInfo = styled.div`
  flex: 1;
`;

export const LinkName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #191f28;
  margin-bottom: 2px;
`;

export const LinkDesc = styled.div`
  font-size: 12px;
  color: #8b95a1;
`;

export const LinkArrow = styled.span`
  color: #adb5bd;
`;
