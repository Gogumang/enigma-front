import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { PageLayout, ImageDropzone } from '@/shared/ui';
import { useDeepfakeAnalysis } from '@/features/detect-deepfake';
import { memoryStore } from '@/shared/lib/storage';
import Lottie from 'lottie-react';
import aiScanAnimation from '@/shared/assets/lottie/ai-scan.json';
import {
  ContentWrapper,
  DropzoneWrapper,
  Button,
  LoadingLottieWrapper,
  LoadingOverlay,
  LoadingSubtext,
  LoadingText,
  TipCard,
  TipTitle,
  TipList,
  TipItem,
  ErrorMessage,
} from './ImageSearchPage.styles';

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
      memoryStore.set('deepfakeResult', result);
      navigate({ to: '/image-search/result' });
    } catch (err) {
      setError(err instanceof Error ? err.message : '서버 연결에 실패했습니다');
    }
  };

  return (
    <PageLayout title="AI 검사기">
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
          {deepfakeAnalysis.isPending ? 'AI 분석 중...' : 'AI 분석'}
        </Button>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <TipCard>
          <TipTitle>AI 탐지 팁</TipTitle>
          <TipList>
            <TipItem>상대방의 프로필 사진을 검사해보세요</TipItem>
            <TipItem>영상 통화 화면을 캡처해 분석하면 효과적입니다</TipItem>
            <TipItem>AI 생성 확률 50% 이상이면 주의가 필요합니다</TipItem>
            <TipItem>얼굴 조작 수치가 높으면 AI 생성 가능성이 있습니다</TipItem>
          </TipList>
        </TipCard>
      </ContentWrapper>

      {deepfakeAnalysis.isPending && (
        <LoadingOverlay>
          <LoadingLottieWrapper>
            <Lottie animationData={aiScanAnimation} loop />
          </LoadingLottieWrapper>
          <LoadingText>AI 분석 중...</LoadingText>
          <LoadingSubtext>이미지를 정밀 분석하고 있습니다</LoadingSubtext>
        </LoadingOverlay>
      )}
    </PageLayout>
  );
}
