import { useContactsStore } from '@/features/manage-contacts';
import { localStore } from '@/shared/lib/storage';
import { ChevronLeftIcon } from '@/shared/ui/icons';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import {
  AnalysisCard,
  AnalysisDesc,
  AnalysisGrid,
  AnalysisIcon,
  AnalysisTitle,
  Avatar,
  BackButton,
  Container,
  DeleteButton,
  EmptyState,
  Header,
  HeaderInner,
  HeaderTitle,
  HistoryCard,
  HistoryDate,
  HistoryIcon,
  HistoryInfo,
  HistoryItem,
  HistoryScore,
  HistoryTitle,
  Meta,
  Name,
  ProfileSection,
  ScoreBar,
  ScoreCard,
  ScoreFill,
  ScoreHeader,
  ScoreLabel,
  ScoreValue,
  Section,
  SectionTitle,
} from './AnalyzePage.styles';

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
    <rect width="48" height="48" rx="12" fill="#FEE500" />
    <path
      d="M24 12C16.268 12 10 17.037 10 23.304c0 4.022 2.671 7.548 6.69 9.537-.294 1.095-.95 3.529-1.088 4.077-.173.683.25.675.527.49.218-.145 3.472-2.355 4.879-3.314.988.145 2.007.222 3.046.222 7.732 0 14-5.037 14-11.258C38 17.037 31.732 12 24 12z"
      fill="#3C1E1E"
    />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="instaGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFDC80" />
        <stop offset="25%" stopColor="#FCAF45" />
        <stop offset="50%" stopColor="#F77737" />
        <stop offset="75%" stopColor="#F56040" />
        <stop offset="90%" stopColor="#C13584" />
        <stop offset="100%" stopColor="#833AB4" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="12" fill="url(#instaGrad2)" />
    <rect x="12" y="12" width="24" height="24" rx="6" stroke="#fff" strokeWidth="2.5" fill="none" />
    <circle cx="24" cy="24" r="5.5" stroke="#fff" strokeWidth="2.5" fill="none" />
    <circle cx="31" cy="17" r="2" fill="#fff" />
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#26A5E4" />
    <path
      d="M12.5 23.5l21-9c1-.4 2 .2 1.8 1.3l-3.5 18c-.2 1-1 1.3-1.7.8l-5-3.7-2.4 2.3c-.3.3-.8.2-.9-.2l-1-5.2-5.4-1.8c-1-.3-1-1.5.1-1.9v.4z"
      fill="#fff"
    />
    <path d="M19.5 31l.5-5 10-9" stroke="#26A5E4" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#1877F2" />
    <path
      d="M26 38V26h4l.5-4.5H26v-3c0-1.3.4-2.2 2.2-2.2H31v-4c-.5-.1-2-.2-3.8-.2-3.8 0-6.4 2.3-6.4 6.6v3.3h-4V26h4v12h5z"
      fill="#fff"
    />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#000" />
    <path
      d="M27.5 22.1L35.4 13h-1.9l-6.9 7.9L20.8 13H14l8.3 12-8.3 9.5h1.9l7.2-8.3 5.8 8.3H35l-7.5-10.4zm-2.5 2.9l-.8-1.2-6.6-9.4h2.8l5.4 7.7.8 1.2 7 10h-2.8l-5.8-8.3z"
      fill="#fff"
    />
  </svg>
);

const LineIcon = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#06C755" />
    <path
      d="M38 21.5c0-6.4-6.4-11.5-14.5-11.5S9 15.1 9 21.5c0 5.7 5.1 10.5 11.9 11.4.5.1.8.3.9.6.1.3.1.7 0 1l-.4 2.4c-.1.5.2.8.6.6 3.1-1.8 8.2-4.8 11.1-8.2 2-2.3 4.9-5.4 4.9-7.8z"
      fill="#fff"
    />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#0A66C2" />
    <path
      d="M15.5 13c1.4 0 2.5 1.1 2.5 2.5S16.9 18 15.5 18 13 16.9 13 15.5 14.1 13 15.5 13zM13 20h5v15h-5V20zm9 0h4.8v2h.1c.7-1.3 2.3-2.5 4.8-2.5 5.1 0 6.1 3.4 6.1 7.8V35h-5v-6.8c0-1.6 0-3.7-2.3-3.7-2.3 0-2.6 1.8-2.6 3.6V35h-5V20z"
      fill="#fff"
    />
  </svg>
);

const TinderIcon = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="tinderGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FF6B6B" />
        <stop offset="100%" stopColor="#FE3C72" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="12" fill="url(#tinderGrad2)" />
    <path
      d="M30.2 18.3c-.2-.3-.6-.2-.8.1-.7.9-1.6 1.5-2.6 1.8-.2.1-.4-.1-.4-.3 0-3.5-2.4-6.4-5.5-7.1-.3-.1-.6.2-.5.5.5 1.8.1 3.7-1.1 5.1-.2.2-.5.1-.6-.1-1-1.3-1.5-2.9-1.5-4.6 0-.3-.4-.5-.6-.2C14.2 16.4 13 20 13 24c0 6.1 4.9 11 11 11s11-4.9 11-11c0-2-.5-3.9-1.5-5.6-.2-.3-.6-.1-.7.2-.4 1.2-1.2 2.2-2.3 2.9-.2.1-.5 0-.6-.2-.4-.8-.6-1.7-.6-2.7-.1-.1-.1-.2-.1-.3z"
      fill="#fff"
    />
  </svg>
);

const messengerIcons: Record<string, { Icon: React.FC; name: string }> = {
  kakao: { Icon: KakaoIcon, name: '카카오톡' },
  instagram: { Icon: InstagramIcon, name: '인스타그램' },
  telegram: { Icon: TelegramIcon, name: '텔레그램' },
  facebook: { Icon: FacebookIcon, name: '페이스북' },
  x: { Icon: XIcon, name: 'X (트위터)' },
  line: { Icon: LineIcon, name: '라인' },
  linkedin: { Icon: LinkedInIcon, name: '링크드인' },
  tinder: { Icon: TinderIcon, name: '틴더' },
};

export default function AnalyzePage() {
  const { id } = useParams({ from: '/analyze/$id' });
  const navigate = useNavigate();
  const { contacts, removeContact, getContact } = useContactsStore();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);

  const contact = getContact(id);

  useEffect(() => {
    const savedAnalyses = localStore.get<Analysis[]>(`enigma_analyses_${id}`);
    if (savedAnalyses) {
      setAnalyses(savedAnalyses);
    }
  }, [id]);

  const getLevel = (score: number) => {
    if (score < 30) return 'safe';
    if (score < 60) return 'warning';
    return 'danger';
  };

  const averageScore =
    analyses.length > 0
      ? Math.round(analyses.reduce((sum, a) => sum + a.score, 0) / analyses.length)
      : 0;

  const handleDelete = () => {
    if (!confirm('이 분석 대상을 삭제할까요?')) return;

    removeContact(id);
    localStore.remove(`enigma_analyses_${id}`);
    navigate({ to: '/' });
  };

  const handleAnalysis = (type: string) => {
    if (type === 'chat') {
      navigate({ to: '/chat', search: { contactId: id } });
    } else if (type === 'image') {
      navigate({ to: '/image-search', search: { contactId: id } });
    } else if (type === 'profile') {
      navigate({ to: '/profile-search', search: { contactId: id } });
    }
  };

  if (!contact) {
    return (
      <Container>
        <Header>
          <HeaderInner>
            <BackButton to="/">
              <ChevronLeftIcon />
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
          <BackButton to="/">
            <ChevronLeftIcon />
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
            <AnalysisIcon>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3182f6"
                strokeWidth="2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </AnalysisIcon>
            <AnalysisTitle>대화 분석</AnalysisTitle>
            <AnalysisDesc>텍스트 위험도 체크</AnalysisDesc>
          </AnalysisCard>
          <AnalysisCard onClick={() => handleAnalysis('image')}>
            <AnalysisIcon>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#a855f7"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </AnalysisIcon>
            <AnalysisTitle>사진/영상 검색</AnalysisTitle>
            <AnalysisDesc>AI 역추적</AnalysisDesc>
          </AnalysisCard>
          <AnalysisCard onClick={() => handleAnalysis('profile')}>
            <AnalysisIcon>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </AnalysisIcon>
            <AnalysisTitle>이미지 검색</AnalysisTitle>
            <AnalysisDesc>신원 확인</AnalysisDesc>
          </AnalysisCard>
          <AnalysisCard onClick={() => navigate({ to: '/training' })}>
            <AnalysisIcon>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#20c997"
                strokeWidth="2"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </AnalysisIcon>
            <AnalysisTitle>면역 훈련</AnalysisTitle>
            <AnalysisDesc>대응 연습</AnalysisDesc>
          </AnalysisCard>
        </AnalysisGrid>
      </Section>

      <Section>
        <SectionTitle>분석 기록</SectionTitle>
        {analyses.length > 0 ? (
          <HistoryCard>
            {analyses.map((analysis) => (
              <HistoryItem key={analysis.id}>
                <HistoryIcon $type={analysis.type}>
                  {analysis.type === 'chat' ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#3182f6"
                      strokeWidth="2"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  ) : analysis.type === 'image' ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="2"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  )}
                </HistoryIcon>
                <HistoryInfo>
                  <HistoryTitle>{analysis.summary}</HistoryTitle>
                  <HistoryDate>{new Date(analysis.date).toLocaleDateString('ko-KR')}</HistoryDate>
                </HistoryInfo>
                <HistoryScore $level={getLevel(analysis.score)}>{analysis.score}점</HistoryScore>
              </HistoryItem>
            ))}
          </HistoryCard>
        ) : (
          <HistoryCard>
            <EmptyState>아직 분석 기록이 없어요</EmptyState>
          </HistoryCard>
        )}
      </Section>

      <DeleteButton onClick={handleDelete}>분석 대상 삭제</DeleteButton>
    </Container>
  );
}
