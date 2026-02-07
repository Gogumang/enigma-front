import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import styled from '@emotion/styled';
import Lottie from 'lottie-react';
import { PageLayout } from '@/shared/ui';
import { memoryStore } from '@/shared/lib/storage';
import type { VerifyResult } from '@/entities/analysis';

import safeAnimation from '@/shared/assets/lottie/safe.json';
import warningAnimation from '@/shared/assets/lottie/warning.json';
import dangerAnimation from '@/shared/assets/lottie/danger.json';

const ResultCard = styled.div<{ $status: 'safe' | 'warning' | 'danger' }>`
  margin-top: 8px;
  padding: 28px 24px;
  text-align: center;
  border-radius: 20px;
  background: ${props =>
    props.$status === 'safe' ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' :
    props.$status === 'warning' ? 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)' :
    'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'};
`;

const LottieWrapper = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto 8px;
`;

const ResultTitle = styled.div<{ $status: 'safe' | 'warning' | 'danger' }>`
  font-size: 22px;
  font-weight: 700;
  color: ${props =>
    props.$status === 'safe' ? '#059669' :
    props.$status === 'warning' ? '#d97706' : '#dc2626'};
  margin-bottom: 8px;
`;

const ResultMessage = styled.div`
  font-size: 14px;
  color: #6b7684;
  line-height: 1.5;
`;

const Section = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-top: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const SectionTitle = styled.h4`
  font-size: 15px;
  font-weight: 600;
  color: #191f28;
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f2f4f6;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-of-type {
    padding-top: 0;
  }
`;

const DetailLabel = styled.span`
  font-size: 14px;
  color: #8b95a1;
  flex-shrink: 0;
`;

const DetailValue = styled.span<{ $bad?: boolean; $good?: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.$bad ? '#ef4444' : props.$good ? '#10b981' : '#191f28'};
  text-align: right;
  word-break: break-all;
  max-width: 60%;
`;

const WarningList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const WarningItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  background: #fff5f5;
  border-radius: 10px;
  font-size: 14px;
  color: #333;
  line-height: 1.4;
`;

const RecommendationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RecommendationItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 10px;
  font-size: 14px;
  color: #333;
  line-height: 1.4;
`;

const RedirectChain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RedirectItem = styled.div<{ $isLast?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: ${props => props.$isLast ? '#ecfdf5' : '#f8f9fa'};
  border-radius: 8px;
  font-size: 13px;
  word-break: break-all;
`;

const RedirectNumber = styled.span`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #6b7684;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
`;

const LinkList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const LinkItem = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: #f8f9fa;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    background: #eef0f2;
    transform: translateX(4px);
  }
`;

const LinkIcon = styled.span`
  font-size: 20px;
`;

const LinkInfo = styled.div`
  flex: 1;
`;

const LinkName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #191f28;
  margin-bottom: 2px;
`;

const LinkDesc = styled.div`
  font-size: 12px;
  color: #8b95a1;
`;

const LinkArrow = styled.span`
  color: #adb5bd;
`;

const RetryButton = styled.button`
  width: 100%;
  padding: 16px;
  margin-top: 24px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

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

const getLinkIcon = (name: string) => {
  if (name.includes('더치트')) return '🔍';
  if (name.includes('경찰')) return '👮';
  if (name.includes('금융')) return '🏛️';
  return '🔗';
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

      {/* 추가 확인 링크 */}
      {result.additionalLinks && result.additionalLinks.length > 0 && (
        <Section>
          <SectionTitle>🔗 직접 확인하기</SectionTitle>
          <LinkList>
            {result.additionalLinks.map((link: { name: string; url: string; description: string }, i: number) => (
              <LinkItem key={i} href={link.url} target="_blank" rel="noopener noreferrer">
                <LinkIcon>{getLinkIcon(link.name)}</LinkIcon>
                <LinkInfo>
                  <LinkName>{link.name}</LinkName>
                  <LinkDesc>{link.description}</LinkDesc>
                </LinkInfo>
                <LinkArrow>→</LinkArrow>
              </LinkItem>
            ))}
          </LinkList>
        </Section>
      )}

      <RetryButton onClick={() => navigate({ to: '/verify' })}>
        다시 검증하기
      </RetryButton>
    </PageLayout>
  );
}
