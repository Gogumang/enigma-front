import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import styled from '@emotion/styled';
import { PageLayout, ImageDropzone } from '@/shared/ui';
import { useProfileSearch } from '@/features/search-profile';
import { memoryStore } from '@/shared/lib/storage';

const ContentWrapper = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px 0;
`;

const DropzoneWrapper = styled.div`
  margin-bottom: 20px;
`;


const Button = styled.button`
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


const TipCard = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: var(--bg-card);
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
`;

const TipTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
`;

const TipList = styled.ul`
  margin: 0;
  padding: 0 0 0 20px;
`;

const TipItem = styled.li`
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.8;
`;

const ErrorMessage = styled.div`
  padding: 16px;
  background: #ffebee;
  border-radius: 12px;
  color: #f04452;
  font-size: 14px;
  margin-top: 16px;
  text-align: center;
`;


export default function ProfileSearchPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const profileSearch = useProfileSearch();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
  };

  const canSearch = !!file;

  const search = async () => {
    if (!canSearch) return;
    setError(null);

    try {
      // 업로드한 이미지를 먼저 base64로 변환하여 세션에 저장
      if (file) {
        await new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            memoryStore.set('profileSearchImage', reader.result as string);
            resolve();
          };
          reader.readAsDataURL(file);
        });
      }

      const data = await profileSearch.mutateAsync({
        image: file || undefined,
      });

      // 결과를 세션에 저장하고 결과 페이지로 이동
      memoryStore.set('profileSearchResult', {
        ...data,
        searchedAt: new Date().toISOString(),
      });
      navigate({ to: '/profile-search/result' });
    } catch (err) {
      setError(err instanceof Error ? err.message : '서버에 연결할 수 없습니다');
    }
  };


  return (
    <PageLayout title="프로필 검색">
      <ContentWrapper>
        <DropzoneWrapper>
          <ImageDropzone
            onFileSelect={handleFileSelect}
            accept="image"
            title=""
            hint=""
            maxSizeMB={2}
            icon={
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            }
          />
        </DropzoneWrapper>

        <Button onClick={search} disabled={!canSearch || profileSearch.isPending}>
          {profileSearch.isPending ? '검색 중...' : '프로필 검색'}
        </Button>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <TipCard>
          <TipTitle>이렇게 사용하세요</TipTitle>
          <TipList>
            <TipItem>상대방의 프로필 사진을 캡처해서 업로드하세요</TipItem>
            <TipItem>AI가 사기꾼 DB와 비교하고 역이미지 검색을 수행합니다</TipItem>
            <TipItem>의심되는 프로필은 신고하여 다른 피해를 예방하세요</TipItem>
          </TipList>
        </TipCard>
      </ContentWrapper>
    </PageLayout>
  );
}
