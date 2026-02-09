import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { PageLayout } from '@/shared/ui';
import { SearchIcon } from '@/shared/ui/icons';
import { memoryStore } from '@/shared/lib/storage';
import {
  Container,
  UploadedImageWrapper,
  UploadedImage,
  DetailCard,
  DetailItem,
  DetailLabel,
  DetailValue,
  SectionTitle,
  ImageGrid,
  ImageCard,
  ImageThumbnail,
  ImagePlaceholder,
  ProfileCard,
  ProfileImage,
  ProfileInfo,
  ProfileName,
  ProfileUsername,
  MatchBadge,
  ReverseSearchSection,
  ReverseSearchGrid,
  ReverseSearchLink,
  ReverseSearchIcon,
  ReverseSearchName,
  BackButton,
  EmptyState,
} from './ProfileSearchResultPage.styles';

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
  webImageResults: WebImageResult[];
  reverseSearchLinks: ReverseSearchLink[];
  results: {
    instagram: ProfileResult[];
    facebook: ProfileResult[];
    twitter: ProfileResult[];
    linkedin: ProfileResult[];
    google: ProfileResult[];
  };
  searchedAt?: string;
}

export default function ProfileSearchResultPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState<SearchResult | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  useEffect(() => {
    const stored = memoryStore.get<SearchResult>('profileSearchResult');
    if (stored) {
      setResult(stored);
    }
    const storedImage = memoryStore.get<string>('profileSearchImage');
    if (storedImage) {
      setUploadedImage(storedImage);
    }
  }, []);

  if (!result) {
    return (
      <PageLayout title="검색 결과">
        <EmptyState>
          <div style={{ marginBottom: '16px' }}>
            <SearchIcon size={48} color="#6b7684" />
          </div>
          <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>검색 결과가 없습니다</div>
          <div style={{ fontSize: '14px' }}>먼저 이미지를 검색해주세요</div>
          <BackButton onClick={() => navigate({ to: '/profile-search' })} style={{ marginTop: '24px' }}>
            이미지 검색하기
          </BackButton>
        </EmptyState>
      </PageLayout>
    );
  }

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
        {uploadedImage && (
          <UploadedImageWrapper>
            <UploadedImage src={uploadedImage} alt="검색한 프로필" />
          </UploadedImageWrapper>
        )}

        <DetailCard>
          <DetailItem>
            <DetailLabel>검색 결과</DetailLabel>
            <DetailValue>{result.totalFound}건 발견</DetailValue>
          </DetailItem>
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
                    <ImageThumbnail
                      src={img.thumbnailUrl}
                      alt={img.title}
                      onError={e => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                        (e.currentTarget.nextElementSibling as HTMLElement)?.style.setProperty('display', 'flex');
                      }}
                    />
                  ) : null}
                  <ImagePlaceholder style={img.thumbnailUrl ? { display: 'none' } : undefined}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7684" strokeWidth="2">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                    </svg>
                  </ImagePlaceholder>
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
                <ProfileImage
                  src={profile.imageUrl}
                  alt={profile.name}
                  onError={e => { (e.currentTarget as HTMLImageElement).src = ''; }}
                />
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
          다른 이미지 검색하기
        </BackButton>
      </Container>
    </PageLayout>
  );
}
