'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import styled from '@emotion/styled';
import Link from 'next/link';

const Container = styled.div`
  min-height: 100vh;
  background: #f2f4f8;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  background: #f2f4f8;
  z-index: 100;
  padding: 0 8px;
`;

const HeaderInner = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const BackButton = styled(Link)`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #191f28;
  border-radius: 12px;

  &:active {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const HeaderTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  color: #191f28;
  margin: 0;
`;

const ProfileSection = styled.div`
  padding: 20px;
  text-align: center;
`;

const Avatar = styled.div`
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

const Name = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #191f28;
  margin: 0 0 4px;
`;

const Meta = styled.span`
  font-size: 14px;
  color: #8b95a1;
`;

const ScoreCard = styled.div`
  margin: 0 16px 20px;
  padding: 24px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const ScoreHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ScoreLabel = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #191f28;
`;

const ScoreValue = styled.span<{ $level: string }>`
  font-size: 28px;
  font-weight: 700;
  color: ${props =>
    props.$level === 'safe' ? '#20c997' :
    props.$level === 'warning' ? '#ff9500' : '#f04452'};
`;

const ScoreBar = styled.div`
  height: 8px;
  background: #f2f4f6;
  border-radius: 4px;
  overflow: hidden;
`;

const ScoreFill = styled.div<{ $score: number; $level: string }>`
  height: 100%;
  width: ${props => props.$score}%;
  background: ${props =>
    props.$level === 'safe' ? '#20c997' :
    props.$level === 'warning' ? '#ff9500' : '#f04452'};
  border-radius: 4px;
  transition: width 0.5s ease-out;
`;

const Section = styled.section`
  padding: 0 16px 20px;
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #191f28;
  margin: 0 0 12px;
  padding: 0 4px;
`;

const AnalysisGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const AnalysisCard = styled.button`
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

const AnalysisIcon = styled.div`
  font-size: 28px;
  margin-bottom: 12px;
`;

const AnalysisTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #191f28;
  margin-bottom: 2px;
`;

const AnalysisDesc = styled.div`
  font-size: 12px;
  color: #8b95a1;
`;

const HistoryCard = styled.div`
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const HistoryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border-bottom: 1px solid #f2f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const HistoryIcon = styled.div<{ $type: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props =>
    props.$type === 'chat' ? '#e8f4ff' :
    props.$type === 'image' ? '#f3e8ff' : '#fff8e6'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

const HistoryInfo = styled.div`
  flex: 1;
`;

const HistoryTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #191f28;
`;

const HistoryDate = styled.div`
  font-size: 12px;
  color: #8b95a1;
`;

const HistoryScore = styled.div<{ $level: string }>`
  font-size: 15px;
  font-weight: 700;
  color: ${props =>
    props.$level === 'safe' ? '#20c997' :
    props.$level === 'warning' ? '#ff9500' : '#f04452'};
`;

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #8b95a1;
  font-size: 14px;
`;

const ActionButton = styled.button`
  display: block;
  width: calc(100% - 32px);
  margin: 0 16px 16px;
  padding: 16px;
  background: #3182f6;
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  &:active {
    background: #1b64da;
  }
`;

const DeleteButton = styled.button`
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

interface Contact {
  id: string;
  name: string;
  messenger: string;
  createdAt: number;
}

interface Analysis {
  id: string;
  type: 'chat' | 'image' | 'profile';
  score: number;
  date: number;
  summary: string;
}

// Messenger Icons
const KakaoIcon = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#FEE500"/>
    <path d="M24 12C16.268 12 10 17.037 10 23.304c0 4.022 2.671 7.548 6.69 9.537-.294 1.095-.95 3.529-1.088 4.077-.173.683.25.675.527.49.218-.145 3.472-2.355 4.879-3.314.988.145 2.007.222 3.046.222 7.732 0 14-5.037 14-11.258C38 17.037 31.732 12 24 12z" fill="#3C1E1E"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="instaGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFDC80"/>
        <stop offset="25%" stopColor="#FCAF45"/>
        <stop offset="50%" stopColor="#F77737"/>
        <stop offset="75%" stopColor="#F56040"/>
        <stop offset="90%" stopColor="#C13584"/>
        <stop offset="100%" stopColor="#833AB4"/>
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="12" fill="url(#instaGrad2)"/>
    <rect x="12" y="12" width="24" height="24" rx="6" stroke="#fff" strokeWidth="2.5" fill="none"/>
    <circle cx="24" cy="24" r="5.5" stroke="#fff" strokeWidth="2.5" fill="none"/>
    <circle cx="31" cy="17" r="2" fill="#fff"/>
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#26A5E4"/>
    <path d="M12.5 23.5l21-9c1-.4 2 .2 1.8 1.3l-3.5 18c-.2 1-1 1.3-1.7.8l-5-3.7-2.4 2.3c-.3.3-.8.2-.9-.2l-1-5.2-5.4-1.8c-1-.3-1-1.5.1-1.9v.4z" fill="#fff"/>
    <path d="M19.5 31l.5-5 10-9" stroke="#26A5E4" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#1877F2"/>
    <path d="M26 38V26h4l.5-4.5H26v-3c0-1.3.4-2.2 2.2-2.2H31v-4c-.5-.1-2-.2-3.8-.2-3.8 0-6.4 2.3-6.4 6.6v3.3h-4V26h4v12h5z" fill="#fff"/>
  </svg>
);

const messengerIcons: Record<string, { Icon: React.FC; name: string }> = {
  kakao: { Icon: KakaoIcon, name: '카카오톡' },
  instagram: { Icon: InstagramIcon, name: '인스타그램' },
  telegram: { Icon: TelegramIcon, name: '텔레그램' },
  facebook: { Icon: FacebookIcon, name: '페이스북' },
};

export default function AnalyzePage() {
  const params = useParams();
  const [contact, setContact] = useState<Contact | null>(null);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('loveguard_contacts');
    if (saved) {
      const contacts: Contact[] = JSON.parse(saved);
      const found = contacts.find(c => c.id === params.id);
      if (found) setContact(found);
    }

    const savedAnalyses = localStorage.getItem(`loveguard_analyses_${params.id}`);
    if (savedAnalyses) {
      setAnalyses(JSON.parse(savedAnalyses));
    }
  }, [params.id]);

  const getLevel = (score: number) => {
    if (score < 30) return 'safe';
    if (score < 60) return 'warning';
    return 'danger';
  };

  const averageScore = analyses.length > 0
    ? Math.round(analyses.reduce((sum, a) => sum + a.score, 0) / analyses.length)
    : 0;

  const handleDelete = () => {
    if (!confirm('이 분석 대상을 삭제할까요?')) return;

    const saved = localStorage.getItem('loveguard_contacts');
    if (saved) {
      const contacts: Contact[] = JSON.parse(saved);
      const updated = contacts.filter(c => c.id !== params.id);
      localStorage.setItem('loveguard_contacts', JSON.stringify(updated));
    }
    localStorage.removeItem(`loveguard_analyses_${params.id}`);
    window.location.href = '/';
  };

  const handleAnalysis = (type: string) => {
    if (type === 'chat') {
      window.location.href = `/chat?contactId=${params.id}`;
    } else if (type === 'image') {
      window.location.href = `/image-search?contactId=${params.id}`;
    } else if (type === 'profile') {
      window.location.href = `/profile-search?contactId=${params.id}`;
    }
  };

  if (!contact) {
    return (
      <Container>
        <Header>
          <HeaderInner>
            <BackButton href="/">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </BackButton>
          </HeaderInner>
        </Header>
        <EmptyState>분석 대상을 찾을 수 없어요</EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderInner>
          <BackButton href="/">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </BackButton>
          <HeaderTitle>분석 현황</HeaderTitle>
        </HeaderInner>
      </Header>

      <ProfileSection>
        <Avatar>
          {(() => {
            const m = messengerIcons[contact.messenger];
            return m ? <m.Icon /> : null;
          })()}
        </Avatar>
        <Name>{contact.name}</Name>
        <Meta>{messengerIcons[contact.messenger]?.name}</Meta>
      </ProfileSection>

      <ScoreCard>
        <ScoreHeader>
          <ScoreLabel>종합 위험도</ScoreLabel>
          <ScoreValue $level={getLevel(averageScore)}>
            {analyses.length > 0 ? `${averageScore}점` : '-'}
          </ScoreValue>
        </ScoreHeader>
        <ScoreBar>
          <ScoreFill $score={averageScore} $level={getLevel(averageScore)} />
        </ScoreBar>
      </ScoreCard>

      <Section>
        <SectionTitle>분석하기</SectionTitle>
        <AnalysisGrid>
          <AnalysisCard onClick={() => handleAnalysis('chat')}>
            <AnalysisIcon>💬</AnalysisIcon>
            <AnalysisTitle>대화 분석</AnalysisTitle>
            <AnalysisDesc>텍스트 위험도 체크</AnalysisDesc>
          </AnalysisCard>
          <AnalysisCard onClick={() => handleAnalysis('image')}>
            <AnalysisIcon>🖼️</AnalysisIcon>
            <AnalysisTitle>사진/영상 검색</AnalysisTitle>
            <AnalysisDesc>AI 역추적</AnalysisDesc>
          </AnalysisCard>
          <AnalysisCard onClick={() => handleAnalysis('profile')}>
            <AnalysisIcon>👤</AnalysisIcon>
            <AnalysisTitle>프로필 검색</AnalysisTitle>
            <AnalysisDesc>신원 확인</AnalysisDesc>
          </AnalysisCard>
          <AnalysisCard onClick={() => window.location.href = '/training'}>
            <AnalysisIcon>🛡️</AnalysisIcon>
            <AnalysisTitle>면역 훈련</AnalysisTitle>
            <AnalysisDesc>대응 연습</AnalysisDesc>
          </AnalysisCard>
        </AnalysisGrid>
      </Section>

      <Section>
        <SectionTitle>분석 기록</SectionTitle>
        {analyses.length > 0 ? (
          <HistoryCard>
            {analyses.map(analysis => (
              <HistoryItem key={analysis.id}>
                <HistoryIcon $type={analysis.type}>
                  {analysis.type === 'chat' ? '💬' : analysis.type === 'image' ? '🖼️' : '👤'}
                </HistoryIcon>
                <HistoryInfo>
                  <HistoryTitle>{analysis.summary}</HistoryTitle>
                  <HistoryDate>
                    {new Date(analysis.date).toLocaleDateString('ko-KR')}
                  </HistoryDate>
                </HistoryInfo>
                <HistoryScore $level={getLevel(analysis.score)}>
                  {analysis.score}점
                </HistoryScore>
              </HistoryItem>
            ))}
          </HistoryCard>
        ) : (
          <HistoryCard>
            <EmptyState>아직 분석 기록이 없어요</EmptyState>
          </HistoryCard>
        )}
      </Section>

      <DeleteButton onClick={handleDelete}>
        분석 대상 삭제
      </DeleteButton>
    </Container>
  );
}
