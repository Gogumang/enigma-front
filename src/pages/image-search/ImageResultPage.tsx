import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import Lottie from 'lottie-react';
import { PageLayout } from '@/shared/ui';
import { memoryStore } from '@/shared/lib/storage';
import type { DeepfakeResult } from '@/features/detect-deepfake';
import safeAnimation from '@/shared/assets/lottie/safe.json';
import warningAnimation from '@/shared/assets/lottie/warning.json';
import dangerAnimation from '@/shared/assets/lottie/danger.json';

interface Marker {
  id: number;
  x: number;
  y: number;
  label: string;
  description: string;
  intensity?: number;
  algorithm_flags?: string[];
}

interface AlgorithmCheck {
  name: string;
  passed: boolean;
  score: number;
  description: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ResultImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60px;
  margin-bottom: 60px;
  gap: 16px;
`;

const ImageToggle = styled.div`
  display: flex;
  gap: 8px;
  background: #f2f4f6;
  padding: 4px;
  border-radius: 10px;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.$active ? '#fff' : 'transparent'};
  color: ${props => props.$active ? '#191f28' : '#6b7684'};
  box-shadow: ${props => props.$active ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'};

  &:hover {
    color: #191f28;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  display: inline-block;
  max-width: 100%;
`;

const ResultImage = styled.img`
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
  display: block;
  border-radius: 16px;
`;

const pulseAnimation = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(1);
    box-shadow: 0 0 0 0 rgba(240, 68, 82, 0.7);
  }
  70% {
    transform: translate(-50%, -50%) scale(1.1);
    box-shadow: 0 0 0 10px rgba(240, 68, 82, 0);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    box-shadow: 0 0 0 0 rgba(240, 68, 82, 0);
  }
`;

const MarkerDot = styled.button<{ $x: number; $y: number; $isActive: boolean }>`
  position: absolute;
  left: ${props => props.$x}%;
  top: ${props => props.$y}%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.$isActive ? '#f04452' : 'rgba(240, 68, 82, 0.8)'};
  border: 3px solid white;
  cursor: pointer;
  z-index: 10;
  animation: ${pulseAnimation} 2s infinite;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  &:hover {
    background: #f04452;
    transform: translate(-50%, -50%) scale(1.2);
  }
`;

const MarkerNumber = styled.span`
  color: white;
  font-size: 11px;
  font-weight: 700;
`;

const MarkerTooltip = styled.div<{ $x: number; $y: number }>`
  position: absolute;
  left: ${props => props.$x}%;
  top: ${props => props.$y + 4}%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 13px;
  max-width: 200px;
  z-index: 20;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  &::before {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid rgba(0, 0, 0, 0.9);
  }
`;

const TooltipLabel = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
  color: #f04452;
`;

const TooltipDescription = styled.div`
  color: #e5e8eb;
  line-height: 1.4;
`;

const MarkersLegend = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 16px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const LegendTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #191f28;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 18px;
    height: 18px;
    stroke: #f04452;
  }
`;

const LegendItem = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  background: ${props => props.$isActive ? '#ffebee' : 'transparent'};
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f8f9fa;
  }

  & + & {
    margin-top: 8px;
  }
`;

const LegendNumber = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #f04452;
  color: white;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const LegendContent = styled.div`
  flex: 1;
`;

const LegendLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #191f28;
  margin-bottom: 2px;
`;

const LegendDescription = styled.div`
  font-size: 13px;
  color: #6b7684;
  line-height: 1.4;
`;

const ResultCard = styled.div<{ $status: 'safe' | 'warning' | 'danger' }>`
  padding: 28px 24px;
  text-align: center;
  border-radius: 16px;
  background: ${props =>
    props.$status === 'safe' ? '#e8f7f0' :
    props.$status === 'warning' ? '#fff8e6' : '#ffebee'};
`;

const LottieContainer = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto;
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

const AlgorithmSection = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 16px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const AlgorithmTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #191f28;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 18px;
    height: 18px;
    stroke: #3182f6;
  }
`;

const AlgorithmGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;

  @media (max-width: 360px) {
    grid-template-columns: 1fr;
  }
`;

const AlgorithmItem = styled.div<{ $passed: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  background: ${props => props.$passed ? '#f8f9fa' : '#ffebee'};
  border: 1px solid ${props => props.$passed ? '#e5e8eb' : '#ffcdd2'};
`;

const AlgorithmIcon = styled.div<{ $passed: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.$passed ? '#20c997' : '#f04452'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 12px;
    height: 12px;
    stroke: white;
    stroke-width: 3;
  }
`;

const AlgorithmName = styled.div`
  font-size: 12px;
  color: #333;
  line-height: 1.3;
`;

const EnsembleDetails = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f2f4f6;
  display: flex;
  gap: 16px;
`;

const EnsembleItem = styled.div`
  flex: 1;
  text-align: center;
`;

const EnsembleLabel = styled.div`
  font-size: 11px;
  color: #8b95a1;
  margin-bottom: 4px;
`;

const EnsembleValue = styled.div<{ $type?: 'model' | 'algorithm' | 'ensemble' }>`
  font-size: 16px;
  font-weight: 700;
  color: ${props =>
    props.$type === 'model' ? '#3182f6' :
    props.$type === 'algorithm' ? '#ff9500' : '#191f28'};
`;

export default function ImageResultPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState<DeepfakeResult | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);

  useEffect(() => {
    const stored = memoryStore.get<DeepfakeResult>('deepfakeResult');
    if (stored) {
      setResult(stored);
    }
  }, []);

  const markers: Marker[] = (result?.data?.markers as Marker[]) || [];
  const heatmapImage = result?.data?.heatmapImage;
  const algorithmChecks: AlgorithmCheck[] = (result?.data?.algorithmChecks as AlgorithmCheck[]) || [];
  const ensembleDetails = result?.data?.ensembleDetails || {};

  // 알고리즘 이름 한글화
  const getAlgorithmLabel = (name: string): string => {
    const labels: Record<string, string> = {
      'frequency_analysis': '주파수 분석',
      'skin_texture': '피부 텍스처',
      'color_consistency': '색상 일관성',
      'edge_artifacts': '경계 아티팩트',
      'noise_pattern': '노이즈 패턴',
      'compression_artifacts': '압축 패턴',
    };
    return labels[name] || name;
  };

  if (!result) {
    return (
      <PageLayout title="분석 결과">
        <EmptyState>
          <div style={{ marginBottom: '16px' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6b7684" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
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
        title: 'AI 생성/조작 의심',
        desc: '이 이미지는 딥페이크 또는 AI 생성 콘텐츠일 가능성이 있습니다',
      };
    }
    return {
      safe: { title: '정상 이미지', desc: '딥페이크나 AI 조작 흔적이 발견되지 않았습니다' },
      warning: { title: '주의 필요', desc: '일부 AI 생성 특징이 감지되었습니다' },
      danger: { title: 'AI 생성/조작 의심', desc: '딥페이크 또는 AI 생성 콘텐츠일 가능성이 높습니다' },
    }[status];
  };

  const getStatusIcon = (s: 'safe' | 'warning' | 'danger') => {
    const animationData = s === 'danger' ? dangerAnimation :
                          s === 'warning' ? warningAnimation : safeAnimation;

    return (
      <LottieContainer>
        <Lottie
          animationData={animationData}
          loop={true}
          autoplay={true}
        />
      </LottieContainer>
    );
  };

  const content = getResultContent();

  return (
    <PageLayout title="분석 결과">
      <Container>
        {result.imageData && (
          <ResultImageContainer>
            {result.type === 'image' && heatmapImage && (
              <ImageToggle>
                <ToggleButton $active={!showHeatmap} onClick={() => setShowHeatmap(false)}>
                  원본
                </ToggleButton>
                <ToggleButton $active={showHeatmap} onClick={() => setShowHeatmap(true)}>
                  히트맵
                </ToggleButton>
              </ImageToggle>
            )}
            <ImageWrapper onClick={() => setSelectedMarker(null)}>
              <ResultImage
                src={showHeatmap && heatmapImage ? `data:image/jpeg;base64,${heatmapImage}` : result.imageData}
                alt={result.type === 'video' ? '비디오 썸네일' : '분석된 이미지'}
              />
              {result.type === 'image' && !showHeatmap && markers.map((marker, index) => (
                <MarkerDot
                  key={marker.id}
                  $x={marker.x}
                  $y={marker.y}
                  $isActive={selectedMarker === marker.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMarker(selectedMarker === marker.id ? null : marker.id);
                  }}
                >
                  <MarkerNumber>{index + 1}</MarkerNumber>
                </MarkerDot>
              ))}
              {result.type === 'image' && !showHeatmap && selectedMarker !== null && markers.find(m => m.id === selectedMarker) && (
                <MarkerTooltip
                  $x={markers.find(m => m.id === selectedMarker)!.x}
                  $y={markers.find(m => m.id === selectedMarker)!.y}
                >
                  <TooltipLabel>{markers.find(m => m.id === selectedMarker)!.label}</TooltipLabel>
                  <TooltipDescription>{markers.find(m => m.id === selectedMarker)!.description}</TooltipDescription>
                </MarkerTooltip>
              )}
            </ImageWrapper>
          </ResultImageContainer>
        )}

        <ResultCard $status={status}>
          {getStatusIcon(status)}
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

        {markers.length > 0 && (
          <MarkersLegend>
            <LegendTitle>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              탐지된 의심 영역 ({markers.length}개)
            </LegendTitle>
            {markers.map((marker, index) => (
              <LegendItem
                key={marker.id}
                $isActive={selectedMarker === marker.id}
                onClick={() => setSelectedMarker(selectedMarker === marker.id ? null : marker.id)}
              >
                <LegendNumber>{index + 1}</LegendNumber>
                <LegendContent>
                  <LegendLabel>{marker.label}</LegendLabel>
                  <LegendDescription>{marker.description}</LegendDescription>
                </LegendContent>
              </LegendItem>
            ))}
          </MarkersLegend>
        )}

        {algorithmChecks.length > 0 && (
          <AlgorithmSection>
            <AlgorithmTitle>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              다중 알고리즘 분석
            </AlgorithmTitle>
            <AlgorithmGrid>
              {algorithmChecks.map((check) => (
                <AlgorithmItem key={check.name} $passed={check.passed}>
                  <AlgorithmIcon $passed={check.passed}>
                    {check.passed ? (
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    )}
                  </AlgorithmIcon>
                  <AlgorithmName>{getAlgorithmLabel(check.name)}</AlgorithmName>
                </AlgorithmItem>
              ))}
            </AlgorithmGrid>
            {(ensembleDetails.model_confidence !== undefined || ensembleDetails.algorithm_score !== undefined) && (
              <EnsembleDetails>
                {ensembleDetails.model_confidence !== undefined && (
                  <EnsembleItem>
                    <EnsembleLabel>AI 모델</EnsembleLabel>
                    <EnsembleValue $type="model">
                      {ensembleDetails.model_confidence.toFixed(1)}%
                    </EnsembleValue>
                  </EnsembleItem>
                )}
                {ensembleDetails.algorithm_score !== undefined && (
                  <EnsembleItem>
                    <EnsembleLabel>알고리즘</EnsembleLabel>
                    <EnsembleValue $type="algorithm">
                      {ensembleDetails.algorithm_score.toFixed(1)}%
                    </EnsembleValue>
                  </EnsembleItem>
                )}
                <EnsembleItem>
                  <EnsembleLabel>종합 점수</EnsembleLabel>
                  <EnsembleValue $type="ensemble">
                    {result.data.confidence.toFixed(1)}%
                  </EnsembleValue>
                </EnsembleItem>
              </EnsembleDetails>
            )}
          </AlgorithmSection>
        )}

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
