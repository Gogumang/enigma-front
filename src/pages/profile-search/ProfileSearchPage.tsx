import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import styled from '@emotion/styled';
import { PageLayout, ImageDropzone } from '@/shared/ui';
import { useProfileSearch, useScammerReport } from '@/features/search-profile';
import { sessionStore } from '@/shared/lib/storage';

const ContentWrapper = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px 0;
`;

const DropzoneWrapper = styled.div`
  margin-bottom: 20px;
`;

const InputGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 8px;
`;

const OptionalBadge = styled.span`
  font-size: 10px;
  padding: 2px 6px;
  background: var(--bg-secondary);
  border-radius: 4px;
  color: var(--text-tertiary);
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 1.5px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-secondary);
  font-size: 15px;
  color: var(--text-primary);
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    background: var(--bg-card);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  &::placeholder {
    color: var(--text-tertiary);
  }
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

const ReportButton = styled.button`
  width: 100%;
  padding: 14px;
  background: transparent;
  color: #f04452;
  border: 1.5px solid #f04452;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 12px;
  transition: all 0.2s;

  &:active {
    background: #fff5f5;
  }

  &:disabled {
    border-color: var(--border-color);
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

const SuccessMessage = styled.div`
  padding: 16px;
  background: #e8f7f0;
  border-radius: 12px;
  color: #20c997;
  font-size: 14px;
  margin-top: 16px;
  text-align: center;
`;

export default function ProfileSearchPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [reportSuccess, setReportSuccess] = useState<string | null>(null);

  const profileSearch = useProfileSearch();
  const scammerReport = useScammerReport();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setReportSuccess(null);
  };

  const canSearch = file || name.trim();

  const search = async () => {
    if (!canSearch) return;
    setError(null);
    setReportSuccess(null);

    try {
      const data = await profileSearch.mutateAsync({
        image: file || undefined,
        query: name.trim() || undefined
      });

      // 결과를 세션에 저장하고 결과 페이지로 이동
      sessionStore.set('profileSearchResult', {
        ...data,
        searchQuery: name.trim(),
        searchedAt: new Date().toISOString(),
      });
      navigate({ to: '/profile-search/result' });
    } catch (err) {
      setError(err instanceof Error ? err.message : '서버에 연결할 수 없습니다');
    }
  };

  const reportScammer = async () => {
    if (!file || !name.trim()) {
      setError('사기꾼 신고를 위해 사진과 이름이 필요합니다');
      return;
    }

    setError(null);
    setReportSuccess(null);

    try {
      const data = await scammerReport.mutateAsync({ image: file, name: name.trim() });
      setReportSuccess(data.message);
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

        <InputGroup>
          <Label>
            이름 또는 사용자명
            <OptionalBadge>선택</OptionalBadge>
          </Label>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="예: John Smith, @johnsmith"
          />
        </InputGroup>

        <Button onClick={search} disabled={!canSearch || profileSearch.isPending}>
          {profileSearch.isPending ? '검색 중...' : '프로필 검색'}
        </Button>

        {file && name.trim() && (
          <ReportButton onClick={reportScammer} disabled={scammerReport.isPending}>
            {scammerReport.isPending ? '신고 중...' : '이 사람을 사기꾼으로 신고'}
          </ReportButton>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {reportSuccess && <SuccessMessage>{reportSuccess}</SuccessMessage>}

        <TipCard>
          <TipTitle>프로필 검색 팁</TipTitle>
          <TipList>
            <TipItem>프로필 사진으로 검색하면 사기꾼 DB와 비교합니다</TipItem>
            <TipItem>역이미지 검색으로 다른 곳에서 사용된 사진을 찾습니다</TipItem>
            <TipItem>사기꾼으로 의심되면 신고해서 다른 사람들을 보호하세요</TipItem>
          </TipList>
        </TipCard>
      </ContentWrapper>
    </PageLayout>
  );
}
