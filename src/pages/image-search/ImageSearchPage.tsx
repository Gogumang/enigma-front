import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import styled from '@emotion/styled';
import { PageLayout, ImageDropzone } from '@/shared/ui';
import { useDeepfakeAnalysis } from '@/features/detect-deepfake';
import { sessionStore } from '@/shared/lib/storage';

const DropzoneWrapper = styled.div`
  margin-bottom: 20px;
`;

const Button = styled.button`
  width: 100%;
  padding: 16px;
  background: #a855f7;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  &:active {
    background: #9333ea;
  }

  &:disabled {
    background: #e5e8eb;
    color: #adb5bd;
  }
`;

const TipCard = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const TipTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #191f28;
  margin-bottom: 12px;
`;

const TipList = styled.ul`
  margin: 0;
  padding: 0 0 0 20px;
`;

const TipItem = styled.li`
  font-size: 13px;
  color: #6b7684;
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
      <DropzoneWrapper>
        <ImageDropzone
          onFileSelect={handleFileSelect}
          accept="image+video"
          title="이미지 또는 영상을 업로드하세요"
          hint="드래그하거나 클릭하여 선택"
          maxSizeMB={5}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M15 8h.01" />
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 16l5-5c.928-.893 2.072-.893 3 0l5 5" />
              <path d="M14 14l1-1c.928-.893 2.072-.893 3 0l3 3" />
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
    </PageLayout>
  );
}
