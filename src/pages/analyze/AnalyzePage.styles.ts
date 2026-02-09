import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';

export const Container = styled.div`
  min-height: 100vh;
  background: #f2f4f8;
`;

export const Header = styled.header`
  position: sticky;
  top: 0;
  background: #f2f4f8;
  z-index: 100;
  padding: 0 8px;
`;

export const HeaderInner = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const BackButton = styled(Link)`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #191f28;
  border-radius: 12px;
  text-decoration: none;

  &:active {
    background: rgba(0, 0, 0, 0.05);
  }
`;

export const HeaderTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  color: #191f28;
  margin: 0;
`;

export const ProfileSection = styled.div`
  padding: 20px;
  text-align: center;
`;

export const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: #fff;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;

  svg {
    width: 80px;
    height: 80px;
  }
`;

export const Name = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #191f28;
  margin: 0 0 4px;
`;

export const Meta = styled.span`
  font-size: 14px;
  color: #8b95a1;
`;

export const ScoreCard = styled.div`
  margin: 0 16px 20px;
  padding: 24px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

export const ScoreHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const ScoreLabel = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #191f28;
`;

export const ScoreValue = styled.span<{ $level: string }>`
  font-size: 28px;
  font-weight: 700;
  color: ${(props) =>
    props.$level === 'safe' ? '#20c997' : props.$level === 'warning' ? '#ff9500' : '#f04452'};
`;

export const ScoreBar = styled.div`
  height: 8px;
  background: #f2f4f6;
  border-radius: 4px;
  overflow: hidden;
`;

export const ScoreFill = styled.div<{ $score: number; $level: string }>`
  height: 100%;
  width: ${(props) => props.$score}%;
  background: ${(props) =>
    props.$level === 'safe' ? '#20c997' : props.$level === 'warning' ? '#ff9500' : '#f04452'};
  border-radius: 4px;
  transition: width 0.5s ease-out;
`;

export const Section = styled.section`
  padding: 0 16px 20px;
`;

export const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #191f28;
  margin: 0 0 12px;
  padding: 0 4px;
`;

export const AnalysisGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

export const AnalysisCard = styled.button`
  padding: 20px 16px;
  background: #fff;
  border: none;
  border-radius: 16px;
  text-align: left;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &:active {
    background: #f9fafb;
  }
`;

export const AnalysisIcon = styled.div`
  font-size: 28px;
  margin-bottom: 12px;
`;

export const AnalysisTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #191f28;
  margin-bottom: 2px;
`;

export const AnalysisDesc = styled.div`
  font-size: 12px;
  color: #8b95a1;
`;

export const HistoryCard = styled.div`
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

export const HistoryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border-bottom: 1px solid #f2f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

export const HistoryIcon = styled.div<{ $type: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${(props) =>
    props.$type === 'chat' ? '#e8f4ff' : props.$type === 'image' ? '#f3e8ff' : '#fff8e6'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

export const HistoryInfo = styled.div`
  flex: 1;
`;

export const HistoryTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #191f28;
`;

export const HistoryDate = styled.div`
  font-size: 12px;
  color: #8b95a1;
`;

export const HistoryScore = styled.div<{ $level: string }>`
  font-size: 15px;
  font-weight: 700;
  color: ${(props) =>
    props.$level === 'safe' ? '#20c997' : props.$level === 'warning' ? '#ff9500' : '#f04452'};
`;

export const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #8b95a1;
  font-size: 14px;
`;

export const DeleteButton = styled.button`
  display: block;
  width: calc(100% - 32px);
  margin: 0 16px 40px;
  padding: 14px;
  background: transparent;
  color: #f04452;
  border: none;
  font-size: 14px;
  cursor: pointer;
`;
