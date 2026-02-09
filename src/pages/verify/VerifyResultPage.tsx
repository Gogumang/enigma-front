import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import Lottie from 'lottie-react';
import { PageLayout } from '@/shared/ui';
import { memoryStore } from '@/shared/lib/storage';
import type { VerifyResult } from '@/entities/analysis';

import safeAnimation from '@/shared/assets/lottie/safe.json';
import warningAnimation from '@/shared/assets/lottie/warning.json';
import dangerAnimation from '@/shared/assets/lottie/danger.json';

import {
  ResultCard,
  LottieWrapper,
  ResultTitle,
  ResultMessage,
  Section,
  SectionTitle,
  DetailItem,
  DetailLabel,
  DetailValue,
  WarningList,
  WarningItem,
  RecommendationList,
  RecommendationItem,
  RedirectChain,
  RedirectItem,
  RedirectNumber,
  RetryButton,
} from './VerifyResultPage.styles';

const lottieAnimations = {
  safe: safeAnimation,
  warning: warningAnimation,
  danger: dangerAnimation,
};

const statusTitles = {
  safe: '안전해 보여요',
  warning: '주의가 필요해요',
  danger: '위험해요!',
};

export default function VerifyResultPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState<VerifyResult | null>(null);

  useEffect(() => {
    const stored = memoryStore.get<VerifyResult>('verifyResult');
    if (!stored) {
      navigate({ to: '/verify' });
      return;
    }
    setResult(stored);
  }, [navigate]);

  if (!result) return null;

  return (
    <PageLayout title="검증 결과">
      <ResultCard $status={result.status}>
        <LottieWrapper>
          <Lottie animationData={lottieAnimations[result.status]} loop={false} />
        </LottieWrapper>
        <ResultTitle $status={result.status}>{statusTitles[result.status]}</ResultTitle>
        <ResultMessage>{result.message}</ResultMessage>
      </ResultCard>

      {/* URL: 단축 URL 확장 정보 */}
      {result.detectedType === 'URL' && result.isShortUrl && result.expansion && (
        <Section>
          <SectionTitle>🔗 단축 URL 추적 결과</SectionTitle>
          <RedirectChain>
            {result.expansion.redirectChain.map((chainUrl: string, i: number) => (
              <RedirectItem
                key={i}
                $isLast={i === result.expansion!.redirectChain.length - 1}
              >
                <RedirectNumber>{i + 1}</RedirectNumber>
                {chainUrl}
                {i === result.expansion!.redirectChain.length - 1 && ' ← 최종'}
              </RedirectItem>
            ))}
          </RedirectChain>
        </Section>
      )}

      {/* URL: 상세 정보 */}
      {result.detectedType === 'URL' && (
        <Section>
          <SectionTitle>📋 URL 상세 정보</SectionTitle>
          <DetailItem>
            <DetailLabel>원본 URL</DetailLabel>
            <DetailValue>{result.originalUrl}</DetailValue>
          </DetailItem>
          {result.originalUrl !== result.finalUrl && (
            <DetailItem>
              <DetailLabel>최종 URL</DetailLabel>
              <DetailValue>{result.finalUrl}</DetailValue>
            </DetailItem>
          )}
          <DetailItem>
            <DetailLabel>도메인</DetailLabel>
            <DetailValue>{result.domain}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>HTTPS</DetailLabel>
            <DetailValue $good={result.isHttps} $bad={!result.isHttps}>
              {result.isHttps ? '✓ 사용 중 (암호화됨)' : '✗ 미사용'}
            </DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>단축 URL</DetailLabel>
            <DetailValue $bad={result.isShortUrl}>
              {result.isShortUrl ? '예 (추적됨)' : '아니오'}
            </DetailValue>
          </DetailItem>
        </Section>
      )}

      {/* Phone/Account: 상세 정보 */}
      {(result.detectedType === 'PHONE' || result.detectedType === 'ACCOUNT') && (
        <Section>
          <SectionTitle>📋 {result.detectedTypeLabel} 분석</SectionTitle>
          <DetailItem>
            <DetailLabel>입력값</DetailLabel>
            <DetailValue>{result.displayValue}</DetailValue>
          </DetailItem>
          {result.patternAnalysis?.type && (
            <DetailItem>
              <DetailLabel>유형</DetailLabel>
              <DetailValue>{result.patternAnalysis.type}</DetailValue>
            </DetailItem>
          )}
          <DetailItem>
            <DetailLabel>유효성</DetailLabel>
            <DetailValue $good={result.patternAnalysis?.isValid} $bad={!result.patternAnalysis?.isValid}>
              {result.patternAnalysis?.isValid ? '✓ 유효함' : '⚠️ 유효하지 않음'}
            </DetailValue>
          </DetailItem>
          {result.totalRecords !== undefined && result.totalRecords > 0 && (
            <DetailItem>
              <DetailLabel>신고 건수</DetailLabel>
              <DetailValue $bad>{result.totalRecords}건</DetailValue>
            </DetailItem>
          )}
        </Section>
      )}

      {/* 감지된 위험 요소 */}
      {result.suspiciousPatterns && result.suspiciousPatterns.length > 0 && (
        <Section>
          <SectionTitle>⚠️ 감지된 위험 요소</SectionTitle>
          <WarningList>
            {result.suspiciousPatterns.map((pattern: string, i: number) => (
              <WarningItem key={i}>
                <span>•</span>
                {pattern}
              </WarningItem>
            ))}
          </WarningList>
        </Section>
      )}

      {/* 권장 사항 */}
      {result.recommendations && result.recommendations.length > 0 && (
        <Section>
          <SectionTitle>💡 권장 사항</SectionTitle>
          <RecommendationList>
            {result.recommendations.map((rec: string, i: number) => (
              <RecommendationItem key={i}>
                <span>•</span>
                {rec}
              </RecommendationItem>
            ))}
          </RecommendationList>
        </Section>
      )}

      <RetryButton onClick={() => navigate({ to: '/verify' })}>
        다시 검증하기
      </RetryButton>
    </PageLayout>
  );
}
