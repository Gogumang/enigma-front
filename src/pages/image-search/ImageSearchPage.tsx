import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import styled from '@emotion/styled';
import { PageLayout, ImageDropzone } from '@/shared/ui';
import { useDeepfakeAnalysis } from '@/features/detect-deepfake';
import { sessionStore } from '@/shared/lib/storage';

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

export default function ImageSearchPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const deepfakeAnalysis = useDeepfakeAnalysis();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setIsVideo(selectedFile.type.startsWith('video/'));
  };

  const analyzeMedia = async () => {
    if (!file) return;
    setError(null);

    try {
      const result = await deepfakeAnalysis.mutateAsync({ file, isVideo });
      sessionStore.set('deepfakeResult', result);
      navigate({ to: '/image-search/result' });
    } catch (err) {
      setError(err instanceof Error ? err.message : '서버 연결에 실패했습니다');
    }
  };

  return (
    <PageLayout title="딥페이크 검사기">
      <ContentWrapper>
        <DropzoneWrapper>
          <ImageDropzone
            onFileSelect={handleFileSelect}
            accept="image+video"
            title=""
            hint=""
            maxSizeMB={5}
            icon={
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            }
          />
        </DropzoneWrapper>

        <Button onClick={analyzeMedia} disabled={!file || deepfakeAnalysis.isPending}>
          {deepfakeAnalysis.isPending ? 'AI 분석 중...' : '딥페이크 분석'}
        </Button>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <TipCard>
          <TipTitle>딥페이크 탐지 팁</TipTitle>
          <TipList>
            <TipItem>상대방의 프로필 사진을 검사해보세요</TipItem>
            <TipItem>영상 통화 화면을 캡처해 분석하면 효과적입니다</TipItem>
            <TipItem>AI 생성 확률 50% 이상이면 주의가 필요합니다</TipItem>
            <TipItem>얼굴 조작 수치가 높으면 딥페이크 가능성이 있습니다</TipItem>
          </TipList>
        </TipCard>
      </ContentWrapper>
    </PageLayout>
  );
}
