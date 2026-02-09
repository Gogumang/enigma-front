import styled from '@emotion/styled';

export const ResultCard = styled.div<{ $status: 'safe' | 'warning' | 'danger' }>`
  margin-top: 8px;
  padding: 28px 24px;
  text-align: center;
  border-radius: 20px;
  background: ${props =>
    props.$status === 'safe' ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' :
    props.$status === 'warning' ? 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)' :
    'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'};
`;

export const LottieWrapper = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto 8px;
`;

export const ResultTitle = styled.div<{ $status: 'safe' | 'warning' | 'danger' }>`
  font-size: 22px;
  font-weight: 700;
  color: ${props =>
    props.$status === 'safe' ? '#059669' :
    props.$status === 'warning' ? '#d97706' : '#dc2626'};
  margin-bottom: 8px;
`;

export const ResultMessage = styled.div`
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
  color: ${props => props.$bad ? '#ef4444' : props.$good ? '#10b981' : '#191f28'};
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
  background: ${props => props.$isLast ? '#ecfdf5' : '#f8f9fa'};
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

export const RetryButton = styled.button`
  width: 100%;
  padding: 16px;
  margin-top: 24px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;
