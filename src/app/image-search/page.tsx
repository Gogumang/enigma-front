'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import PageLayout from '@/components/PageLayout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const UploadArea = styled.label<{ $hasFile: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: ${props => props.$hasFile ? 'auto' : '200px'};
  background: ${props => props.$hasFile ? 'transparent' : '#fff'};
  border: ${props => props.$hasFile ? 'none' : '2px dashed #e5e8eb'};
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 20px;
  overflow: hidden;

  &:active {
    background: ${props => props.$hasFile ? 'transparent' : '#f9fafb'};
  }
`;

const UploadIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
`;

const UploadText = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #191f28;
  margin-bottom: 4px;
`;

const UploadHint = styled.div`
  font-size: 13px;
  color: #8b95a1;
`;

const HiddenInput = styled.input`
  display: none;
`;

const PreviewContainer = styled.div`
  position: relative;
  width: 100%;
`;

const PreviewImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 12px;
  background: #f8f9fa;
`;

const PreviewVideo = styled.video`
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 12px;
  background: #000;
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
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setError(null);

      const isVideoFile = selected.type.startsWith('video/');
      setIsVideo(isVideoFile);

      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const analyzeMedia = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const endpoint = isVideo
        ? `${API_URL}/api/deepfake/analyze/video`
        : `${API_URL}/api/deepfake/analyze/image`;

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '분석 중 오류가 발생했습니다');
      }

      if (data.success) {
        // 결과를 sessionStorage에 저장
        const resultData = {
          type: isVideo ? 'video' : 'image',
          data: data.data,
          analyzedAt: new Date().toISOString(),
          imageData: preview,
        };
        sessionStorage.setItem('deepfakeResult', JSON.stringify(resultData));

        // 결과 페이지로 이동
        router.push('/image-search/result');
      } else {
        throw new Error(data.error || '분석 실패');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '서버 연결에 실패했습니다');
      setLoading(false);
    }
  };

  return (
    <PageLayout title="딥페이크 검사기">
      <UploadArea $hasFile={!!file} htmlFor="file-upload">
        {preview ? (
          <PreviewContainer>
            {isVideo ? (
              <PreviewVideo src={preview} controls />
            ) : (
              <PreviewImage src={preview} alt="Preview" />
            )}
          </PreviewContainer>
        ) : (
          <>
            <UploadIcon>🖼️</UploadIcon>
            <UploadText>이미지 또는 영상을 업로드하세요</UploadText>
            <UploadHint>탭하여 선택하거나 드래그</UploadHint>
          </>
        )}
        <HiddenInput
          id="file-upload"
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
        />
      </UploadArea>

      <Button onClick={analyzeMedia} disabled={!file || loading}>
        {loading ? 'AI 분석 중...' : '딥페이크 분석'}
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
