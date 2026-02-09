import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import Lottie from 'lottie-react';
import { PageLayout } from '@/shared/ui';
import { SearchIcon } from '@/shared/ui/icons';
import { memoryStore } from '@/shared/lib/storage';
import type { DeepfakeResult } from '@/features/detect-deepfake';
import safeAnimation from '@/shared/assets/lottie/safe.json';
import warningAnimation from '@/shared/assets/lottie/warning.json';
import dangerAnimation from '@/shared/assets/lottie/danger.json';
import {
  Container,
  ResultImageContainer,
  ImageToggle,
  ToggleButton,
  ImageWrapper,
  ResultImage,
  MarkerDot,
  MarkerNumber,
  MarkerTooltip,
  TooltipLabel,
  TooltipDescription,
  MarkersLegend,
  LegendTitle,
  LegendItem,
  LegendNumber,
  LegendContent,
  LegendLabel,
  LegendDescription,
  ResultCard,
  LottieContainer,
  ResultTitle,
  ResultDesc,
  ConfidenceBar,
  ConfidenceLabel,
  ConfidenceTrack,
  ConfidenceFill,
  DetailCard,
  DetailItem,
  DetailLabel,
  DetailValue,
  BackButton,
  EmptyState,
  AlgorithmSection,
  AlgorithmTitle,
  AlgorithmGrid,
  AlgorithmItem,
  AlgorithmIcon,
  AlgorithmName,
  EnsembleDetails,
  EnsembleItem,
  EnsembleLabel,
  EnsembleValue,
} from './ImageResultPage.styles';

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
            <SearchIcon size={48} color="#6b7684" />
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
        desc: '이 이미지는 AI 생성 콘텐츠일 가능성이 있습니다',
      };
    }
    return {
      safe: { title: '정상 이미지', desc: 'AI 조작 흔적이 발견되지 않았습니다' },
      warning: { title: '주의 필요', desc: '일부 AI 생성 특징이 감지되었습니다' },
      danger: { title: 'AI 생성/조작 의심', desc: 'AI 생성 콘텐츠일 가능성이 높습니다' },
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
              {result.data.isDeepfake ? 'AI 생성 의심' : '정상'}
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
