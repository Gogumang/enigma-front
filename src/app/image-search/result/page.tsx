'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import PageLayout from '@/components/PageLayout';

interface Marker {
  id: number;
  x: number;
  y: number;
  label: string;
  description: string;
}

interface AnalysisData {
  isDeepfake: boolean;
  confidence: number;
  riskLevel: string;
  mediaType: string;
  message: string;
  details: {
    simulation?: boolean;
    [key: string]: unknown;
  };
  analysisReasons?: string[];
  markers?: Marker[];
  technicalIndicators?: string[];
  overallAssessment?: string;
}

interface StoredResult {
  type: 'image' | 'video';
  data: AnalysisData;
  analyzedAt: string;
  imageData: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: visible;
`;

const ResultImageContainer = styled.div`
  position: relative;
  width: 100%;
  border-radius: 16px;
  background: #f8f9fa;
  overflow: visible;
  margin-top: 60px;
  margin-bottom: 60px;
`;

const ResultImage = styled.img`
  width: 100%;
  display: block;
  border-radius: 16px;
`;

const MarkerOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
`;

const MarkerDot = styled.div<{ $x: number; $y: number; $isDeepfake: boolean }>`
  position: absolute;
  left: ${props => props.$x}%;
  top: ${props => props.$y}%;
  transform: translate(-50%, -50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 3px solid ${props => props.$isDeepfake ? '#f04452' : '#20c997'};
  background: ${props => props.$isDeepfake ? 'rgba(240, 68, 82, 0.25)' : 'rgba(32, 201, 151, 0.25)'};
  cursor: pointer;
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: ${props => props.$isDeepfake ? '#f04452' : '#20c997'};
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translate(-50%, -50%) scale(1.3);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  }
`;

const MarkerTooltip = styled.div<{ $isDeepfake: boolean; $showAbove?: boolean }>`
  position: absolute;
  ${props => props.$showAbove ? `
    bottom: calc(100% + 12px);
  ` : `
    top: calc(100% + 12px);
  `}
  left: 50%;
  transform: translateX(-50%);
  background: ${props => props.$isDeepfake ? '#f04452' : '#20c997'};
  color: white;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 13px;
  min-width: 200px;
  max-width: 280px;
  text-align: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s;
  z-index: 100;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  white-space: normal;
  word-break: keep-all;

  &::after {
    content: '';
    position: absolute;
    ${props => props.$showAbove ? `
      top: 100%;
      border: 8px solid transparent;
      border-top-color: ${props.$isDeepfake ? '#f04452' : '#20c997'};
    ` : `
      bottom: 100%;
      border: 8px solid transparent;
      border-bottom-color: ${props.$isDeepfake ? '#f04452' : '#20c997'};
    `}
    left: 50%;
    transform: translateX(-50%);
  }

  ${MarkerDot}:hover & {
    opacity: 1;
    visibility: visible;
  }
`;

const TooltipLabel = styled.div`
  font-weight: 700;
  margin-bottom: 6px;
  font-size: 14px;
`;

const TooltipDesc = styled.div`
  font-weight: 400;
  line-height: 1.5;
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

const AnalysisSection = styled.div`
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const AnalysisSectionTitle = styled.div`
  padding: 16px 20px;
  font-size: 15px;
  font-weight: 600;
  color: #191f28;
  background: #f8f9fa;
  border-bottom: 1px solid #f2f4f6;
`;

const AnalysisContent = styled.div`
  padding: 16px 20px;
`;

const ReasonItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid #f2f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const ReasonIcon = styled.span`
  font-size: 18px;
  flex-shrink: 0;
`;

const ReasonText = styled.div`
  font-size: 14px;
  color: #333;
  line-height: 1.6;
`;

const MarkerCard = styled.div<{ $isDeepfake: boolean }>`
  padding: 16px;
  background: ${props => props.$isDeepfake ? '#fff5f5' : '#f8fffe'};
  border-left: 4px solid ${props => props.$isDeepfake ? '#f04452' : '#20c997'};
  border-radius: 0 12px 12px 0;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const MarkerTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
  color: #191f28;
  margin-bottom: 6px;
`;

const MarkerNumber = styled.span<{ $isDeepfake: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.$isDeepfake ? '#f04452' : '#20c997'};
  color: #fff;
  font-size: 13px;
  font-weight: 700;
`;

const MarkerDescription = styled.div`
  font-size: 14px;
  color: #6b7684;
  line-height: 1.5;
`;

const OverallAssessment = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  font-size: 15px;
  color: #333;
  line-height: 1.7;
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

export default function DeepfakeResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<StoredResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('deepfakeResult');
    if (stored) {
      const parsed = JSON.parse(stored);
      setResult(parsed);
    }
  }, []);

  if (!result) {
    return (
      <PageLayout title="분석 결과">
        <EmptyState>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>분석 결과가 없습니다</div>
          <div style={{ fontSize: '14px' }}>먼저 이미지를 분석해주세요</div>
          <BackButton onClick={() => router.push('/image-search')} style={{ marginTop: '24px' }}>
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
            {result.data.markers && result.data.markers.length > 0 && (
              <MarkerOverlay>
                {result.data.markers.map((marker) => (
                  <MarkerDot
                    key={marker.id}
                    $x={marker.x}
                    $y={marker.y}
                    $isDeepfake={result.data.isDeepfake}
                  >
                    {marker.id}
                    <MarkerTooltip
                      $isDeepfake={result.data.isDeepfake}
                      $showAbove={marker.y > 60}
                    >
                      <TooltipLabel>{marker.label}</TooltipLabel>
                      <TooltipDesc>{marker.description}</TooltipDesc>
                    </MarkerTooltip>
                  </MarkerDot>
                ))}
              </MarkerOverlay>
            )}
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


        {result.data.markers && result.data.markers.length > 0 && (
          <AnalysisSection>
            <AnalysisSectionTitle>
              {result.data.isDeepfake ? '의심 영역 상세' : '분석 영역 상세'}
            </AnalysisSectionTitle>
            <AnalysisContent>
              {result.data.markers.map((marker) => (
                <MarkerCard key={marker.id} $isDeepfake={result.data.isDeepfake}>
                  <MarkerTitle>
                    <MarkerNumber $isDeepfake={result.data.isDeepfake}>{marker.id}</MarkerNumber>
                    {marker.label}
                  </MarkerTitle>
                  <MarkerDescription>{marker.description}</MarkerDescription>
                </MarkerCard>
              ))}
            </AnalysisContent>
          </AnalysisSection>
        )}


        {result.data.overallAssessment && (
          <OverallAssessment>
            <strong>종합 평가:</strong> {result.data.overallAssessment}
          </OverallAssessment>
        )}

        <BackButton onClick={() => router.push('/image-search')}>
          다른 이미지 분석하기
        </BackButton>
      </Container>
    </PageLayout>
  );
}
