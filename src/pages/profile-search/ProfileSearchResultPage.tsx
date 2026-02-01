import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import styled from '@emotion/styled';
import { PageLayout } from '@/shared/ui';
import { sessionStore } from '@/shared/lib/storage';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ResultCard = styled.div<{ $status: 'safe' | 'warning' | 'danger' }>`
  padding: 28px 24px;
  text-align: center;
  border-radius: 16px;
  background: ${props =>
    props.$status === 'safe' ? '#e8f7f0' :
    props.$status === 'warning' ? '#fff8e6' : '#ffebee'};
`;

const ResultIcon = styled.div<{ $status?: 'safe' | 'warning' | 'danger' }>`
  margin-bottom: 12px;
  display: flex;
  justify-content: center;

  svg {
    width: 48px;
    height: 48px;
    stroke: ${props =>
      props.$status === 'safe' ? '#20c997' :
      props.$status === 'warning' ? '#ff9500' : '#f04452'};
  }
`;

const ResultTitle = styled.div<{ $status: 'safe' | 'warning' | 'danger' }>`
  font-size: 20px;
  font-weight: 700;
  color: ${props =>
    props.$status === 'safe' ? '#20c997' :
    props.$status === 'warning' ? '#ff9500' : '#f04452'};
  margin-bottom: 8px;
`;

const ResultDesc = styled.div`
  font-size: 14px;
  color: #6b7684;
`;

const ConfidenceBar = styled.div`
  margin-top: 20px;
`;

const ConfidenceLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #6b7684;
  margin-bottom: 10px;
`;

const ConfidenceTrack = styled.div`
  height: 10px;
  background: #e5e8eb;
  border-radius: 5px;
  overflow: hidden;
`;

const ConfidenceFill = styled.div<{ $value: number; $status: 'safe' | 'warning' | 'danger' }>`
  height: 100%;
  width: ${props => props.$value}%;
  background: ${props =>
    props.$status === 'safe' ? '#20c997' :
    props.$status === 'warning' ? '#ff9500' : '#f04452'};
  border-radius: 5px;
  transition: width 0.5s ease;
`;

const DetailCard = styled.div`
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f2f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.div`
  font-size: 14px;
  color: #6b7684;
`;

const DetailValue = styled.div<{ $highlight?: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$highlight ? '#f04452' : '#191f28'};
`;

const SectionTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #191f28;
  margin-bottom: 12px;
  padding: 0 4px;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const ImageCard = styled.a`
  display: block;
  border-radius: 12px;
  overflow: hidden;
  background: #f8f9fa;
  text-decoration: none;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.98);
  }
`;

const ImageThumbnail = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background: linear-gradient(135deg, #e5e8eb, #d1d5db);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const ProfileCard = styled.a`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: #fff;
  border-radius: 14px;
  text-decoration: none;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.2s;

  &:active {
    transform: scale(0.99);
    background: #fafbfc;
  }
`;

const ProfileImage = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  background: #e5e8eb;
`;

const ProfileInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ProfileName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #191f28;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProfileUsername = styled.div`
  font-size: 13px;
  color: #8b95a1;
`;

const MatchBadge = styled.span<{ $score: number }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  background: ${props =>
    props.$score >= 80 ? '#ffebee' :
    props.$score >= 50 ? '#fff8e6' : '#e8f7f0'};
  color: ${props =>
    props.$score >= 80 ? '#f04452' :
    props.$score >= 50 ? '#ff9500' : '#20c997'};
`;

const ReverseSearchSection = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const ReverseSearchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const ReverseSearchLink = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  background: #f8f9fa;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s;

  &:active {
    background: #e5e8eb;
  }
`;

const ReverseSearchIcon = styled.span`
  font-size: 20px;
`;

const ReverseSearchName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #191f28;
`;

const BackButton = styled.button`
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

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7684;
`;

interface ScammerMatch {
  id: string;
  name: string;
  confidence: number;
  reportCount: number;
}

interface WebImageResult {
  title: string;
  sourceUrl: string;
  thumbnailUrl: string | null;
  platform: string;
  matchScore: number;
}

interface ProfileResult {
  platform: string;
  name: string;
  username: string;
  profileUrl: string;
  imageUrl: string;
  matchScore: number;
}

interface ReverseSearchLink {
  platform: string;
  name: string;
  url: string;
  icon: string;
}

interface SearchResult {
  totalFound: number;
  scammerMatches: ScammerMatch[];
  webImageResults: WebImageResult[];
  reverseSearchLinks: ReverseSearchLink[];
  results: {
    instagram: ProfileResult[];
    facebook: ProfileResult[];
    twitter: ProfileResult[];
    linkedin: ProfileResult[];
    google: ProfileResult[];
  };
  searchQuery?: string;
  searchedAt?: string;
}

export default function ProfileSearchResultPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState<SearchResult | null>(null);

  useEffect(() => {
    const stored = sessionStore.get<SearchResult>('profileSearchResult');
    if (stored) {
      setResult(stored);
    }
  }, []);

  if (!result) {
    return (
      <PageLayout title="검색 결과">
        <EmptyState>
          <div style={{ marginBottom: '16px' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6b7684" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>검색 결과가 없습니다</div>
          <div style={{ fontSize: '14px' }}>먼저 프로필을 검색해주세요</div>
          <BackButton onClick={() => navigate({ to: '/profile-search' })} style={{ marginTop: '24px' }}>
            프로필 검색하기
          </BackButton>
        </EmptyState>
      </PageLayout>
    );
  }

  const hasScammerMatch = result.scammerMatches && result.scammerMatches.length > 0;
  const maxConfidence = hasScammerMatch
    ? Math.max(...result.scammerMatches.map(s => s.confidence))
    : 0;

  const getStatus = (): 'safe' | 'warning' | 'danger' => {
    if (maxConfidence >= 70) return 'danger';
    if (maxConfidence >= 40) return 'warning';
    return 'safe';
  };

  const status = getStatus();

  const getResultContent = () => {
    if (hasScammerMatch && maxConfidence >= 70) {
      return {
        title: '사기꾼 의심',
        desc: '신고된 사기꾼과 일치하는 프로필이 발견되었습니다',
      };
    }
    if (hasScammerMatch && maxConfidence >= 40) {
      return {
        title: '주의 필요',
        desc: '유사한 프로필이 사기꾼 DB에서 발견되었습니다',
      };
    }
    return {
      title: '안전',
      desc: '사기꾼 DB에서 일치하는 프로필이 없습니다',
    };
  };

  const getStatusIcon = (s: 'safe' | 'warning' | 'danger') => {
    if (s === 'danger') {
      return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      );
    }
    if (s === 'warning') {
      return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    );
  };

  const content = getResultContent();

  const allProfiles = [
    ...result.results.instagram,
    ...result.results.facebook,
    ...result.results.twitter,
    ...result.results.linkedin,
    ...result.results.google,
  ];

  return (
    <PageLayout title="검색 결과">
      <Container>
        <ResultCard $status={status}>
          <ResultIcon $status={status}>{getStatusIcon(status)}</ResultIcon>
          <ResultTitle $status={status}>{content.title}</ResultTitle>
          <ResultDesc>{content.desc}</ResultDesc>

          {hasScammerMatch && (
            <ConfidenceBar>
              <ConfidenceLabel>
                <span>사기꾼 일치율</span>
                <span>{maxConfidence.toFixed(0)}%</span>
              </ConfidenceLabel>
              <ConfidenceTrack>
                <ConfidenceFill $value={maxConfidence} $status={status} />
              </ConfidenceTrack>
            </ConfidenceBar>
          )}
        </ResultCard>

        <DetailCard>
          <DetailItem>
            <DetailLabel>검색 결과</DetailLabel>
            <DetailValue>{result.totalFound}건 발견</DetailValue>
          </DetailItem>
          {hasScammerMatch && (
            <DetailItem>
              <DetailLabel>사기꾼 DB 매칭</DetailLabel>
              <DetailValue $highlight>{result.scammerMatches.length}건 일치</DetailValue>
            </DetailItem>
          )}
          {result.searchQuery && (
            <DetailItem>
              <DetailLabel>검색어</DetailLabel>
              <DetailValue>{result.searchQuery}</DetailValue>
            </DetailItem>
          )}
          <DetailItem>
            <DetailLabel>검색 시간</DetailLabel>
            <DetailValue>
              {result.searchedAt
                ? new Date(result.searchedAt).toLocaleString('ko-KR')
                : '-'}
            </DetailValue>
          </DetailItem>
        </DetailCard>

        {result.webImageResults && result.webImageResults.length > 0 && (
          <>
            <SectionTitle>웹에서 발견된 이미지</SectionTitle>
            <ImageGrid>
              {result.webImageResults.slice(0, 6).map((img, i) => (
                <ImageCard key={i} href={img.sourceUrl} target="_blank" rel="noopener noreferrer">
                  {img.thumbnailUrl ? (
                    <ImageThumbnail src={img.thumbnailUrl} alt={img.title} />
                  ) : (
                    <ImagePlaceholder>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7684" strokeWidth="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                      </svg>
                    </ImagePlaceholder>
                  )}
                </ImageCard>
              ))}
            </ImageGrid>
          </>
        )}

        {allProfiles.length > 0 && (
          <>
            <SectionTitle>발견된 프로필</SectionTitle>
            {allProfiles.slice(0, 5).map((profile, i) => (
              <ProfileCard key={i} href={profile.profileUrl} target="_blank" rel="noopener noreferrer">
                <ProfileImage src={profile.imageUrl} alt={profile.name} />
                <ProfileInfo>
                  <ProfileName>{profile.name}</ProfileName>
                  <ProfileUsername>@{profile.username}</ProfileUsername>
                </ProfileInfo>
                <MatchBadge $score={profile.matchScore}>
                  {profile.matchScore}%
                </MatchBadge>
              </ProfileCard>
            ))}
          </>
        )}

        {result.reverseSearchLinks && result.reverseSearchLinks.length > 0 && (
          <ReverseSearchSection>
            <SectionTitle style={{ marginBottom: '14px' }}>직접 검색하기</SectionTitle>
            <ReverseSearchGrid>
              {result.reverseSearchLinks.map((link, i) => (
                <ReverseSearchLink key={i} href={link.url} target="_blank" rel="noopener noreferrer">
                  <ReverseSearchIcon>{link.icon}</ReverseSearchIcon>
                  <ReverseSearchName>{link.name}</ReverseSearchName>
                </ReverseSearchLink>
              ))}
            </ReverseSearchGrid>
          </ReverseSearchSection>
        )}

        <BackButton onClick={() => navigate({ to: '/profile-search' })}>
          다른 프로필 검색하기
        </BackButton>
      </Container>
    </PageLayout>
  );
}
