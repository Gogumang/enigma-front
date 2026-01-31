import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import styled from '@emotion/styled';
import { PageLayout } from '@/shared/ui';
import { sessionStore } from '@/shared/lib/storage';
import type { DeepfakeResult } from '@/features/detect-deepfake';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ResultImageContainer = styled.div`
  position: relative;
  width: 100%;
  border-radius: 16px;
  background: #f8f9fa;
  margin-top: 60px;
  margin-bottom: 60px;
`;

const ResultImage = styled.img`
  width: 100%;
  display: block;
  border-radius: 16px;
`;

const ResultCard = styled.div<{ $status: 'safe' | 'warning' | 'danger' }>`
  padding: 28px 24px;
  text-align: center;
  border-radius: 16px;
  background: ${props =>
    props.$status === 'safe' ? '#e8f7f0' :
    props.$status === 'warning' ? '#fff8e6' : '#ffebee'};
`;

const ResultIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
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

export default function ImageResultPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState<DeepfakeResult | null>(null);

  useEffect(() => {
    const stored = sessionStore.get<DeepfakeResult>('deepfakeResult');
    if (stored) {
      setResult(stored);
    }
  }, []);

  if (!result) {
    return (
      <PageLayout title="분석 결과">
        <EmptyState>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>분석 결과가 없습니다</div>
          <div style={{ fontSize: '14px' }}>먼저 이미지를 분석해주세요</div>
          <BackButton onClick={() => navigate({ to: '/image-search' })} style={{ marginTop: '24px' }}>
            이미지 분석하기
          </BackButton>
        </EmptyState>
      </PageLayout>
    );
  }

  const getStatus = (): 'safe' | 'warning' | 'danger' => {
    const confidence = result.data.confidence;
    if (confidence >= 70) return 'danger';
    if (confidence >= 40) return 'warning';
    return 'safe';
  };

  const status = getStatus();

  const getResultContent = () => {
    if (result.data.isDeepfake) {
      return {
        icon: '🚨',
        title: 'AI 생성/조작 의심',
        desc: '이 이미지는 딥페이크 또는 AI 생성 콘텐츠일 가능성이 있습니다',
      };
    }
    return {
      safe: { icon: '✅', title: '정상 이미지', desc: '딥페이크나 AI 조작 흔적이 발견되지 않았습니다' },
      warning: { icon: '⚠️', title: '주의 필요', desc: '일부 AI 생성 특징이 감지되었습니다' },
      danger: { icon: '🚨', title: 'AI 생성/조작 의심', desc: '딥페이크 또는 AI 생성 콘텐츠일 가능성이 높습니다' },
    }[status];
  };

  const content = getResultContent();

  return (
    <PageLayout title="분석 결과">
      <Container>
        {result.imageData && (
          <ResultImageContainer>
            <ResultImage src={result.imageData} alt="분석된 이미지" />
          </ResultImageContainer>
        )}

        <ResultCard $status={status}>
          <ResultIcon>{content?.icon}</ResultIcon>
          <ResultTitle $status={status}>{content?.title}</ResultTitle>
          <ResultDesc>{content?.desc}</ResultDesc>

          <ConfidenceBar>
            <ConfidenceLabel>
              <span>AI 생성 확률</span>
              <span>{result.data.confidence.toFixed(1)}%</span>
            </ConfidenceLabel>
            <ConfidenceTrack>
              <ConfidenceFill $value={result.data.confidence} $status={status} />
            </ConfidenceTrack>
          </ConfidenceBar>
        </ResultCard>

        <DetailCard>
          <DetailItem>
            <DetailLabel>판정 결과</DetailLabel>
            <DetailValue $highlight={result.data.isDeepfake}>
              {result.data.isDeepfake ? '딥페이크 의심' : '정상'}
            </DetailValue>
          </DetailItem>
          {result.data.isDeepfake && (
            <DetailItem>
              <DetailLabel>위험 수준</DetailLabel>
              <DetailValue $highlight={result.data.riskLevel === 'high' || result.data.riskLevel === 'critical'}>
                {result.data.riskLevel === 'critical' ? '매우 높음' :
                 result.data.riskLevel === 'high' ? '높음' :
                 result.data.riskLevel === 'medium' ? '중간' : '낮음'}
              </DetailValue>
            </DetailItem>
          )}
          <DetailItem>
            <DetailLabel>분석 시간</DetailLabel>
            <DetailValue>
              {new Date(result.analyzedAt).toLocaleString('ko-KR')}
            </DetailValue>
          </DetailItem>
        </DetailCard>

        <BackButton onClick={() => navigate({ to: '/image-search' })}>
          다른 이미지 분석하기
        </BackButton>
      </Container>
    </PageLayout>
  );
}
