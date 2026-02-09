import { useState } from 'react';
import { PageLayout } from '@/shared/ui';
import { useUrlCheck } from '@/features/check-url';
import type { UrlCheckResult } from '@/entities/analysis';
import {
  Input,
  Button,
  Spinner,
  Result,
  ResultCard,
  ResultIcon,
  ResultTitle,
  ResultMessage,
  RiskScoreBar,
  RiskScoreLabel,
  RiskScoreTrack,
  RiskScoreFill,
  Section,
  SectionTitle,
  DetailItem,
  DetailLabel,
  DetailValue,
  WarningList,
  WarningItem,
  RedirectChain,
  RedirectItem,
  RedirectNumber,
} from './UrlPage.styles';

export default function UrlPage() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<UrlCheckResult | null>(null);
  const urlCheck = useUrlCheck();

  const check = async () => {
    setResult(null);
    try {
      const data = await urlCheck.mutateAsync(url.trim());
      setResult(data);
    } catch {
      alert('올바른 URL을 입력하세요');
    }
  };

  const getContent = () => {
    if (!result) return null;
    return {
      safe: { icon: '✅', title: '안전해 보여요' },
      warning: { icon: '⚠️', title: '주의가 필요해요' },
      danger: { icon: '🚨', title: '위험해요!' },
    }[result.status];
  };

  return (
    <PageLayout title="URL 안전 검사">
      <Input
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="검사할 URL을 입력하세요 (예: bit.ly/xxx)"
        onKeyDown={e => e.key === 'Enter' && !urlCheck.isPending && check()}
      />
      <Button onClick={check} disabled={!url.trim() || urlCheck.isPending}>
        {urlCheck.isPending ? <><Spinner /> 검사 중...</> : '검사하기'}
      </Button>

      {result && (
        <Result>
          <ResultCard $status={result.status}>
            <ResultIcon>{getContent()?.icon}</ResultIcon>
            <ResultTitle $status={result.status}>{getContent()?.title}</ResultTitle>
            <ResultMessage>{result.message}</ResultMessage>

            <RiskScoreBar>
              <RiskScoreLabel>
                <span>위험도</span>
                <span>{result.riskScore}%</span>
              </RiskScoreLabel>
              <RiskScoreTrack>
                <RiskScoreFill $value={result.riskScore} $status={result.status} />
              </RiskScoreTrack>
            </RiskScoreBar>
          </ResultCard>

          {/* 단축 URL 확장 정보 */}
          {result.isShortUrl && result.expansion && (
            <Section>
              <SectionTitle>🔗 단축 URL 추적 결과</SectionTitle>
              <RedirectChain>
                {result.expansion.redirectChain.map((chainUrl, i) => (
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

          {/* 상세 정보 */}
          <Section>
            <SectionTitle>📋 상세 정보</SectionTitle>
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

          {/* 경고 사항 */}
          {result.suspiciousPatterns.length > 0 && (
            <Section>
              <SectionTitle>⚠️ 감지된 위험 요소</SectionTitle>
              <WarningList>
                {result.suspiciousPatterns.map((warning, i) => (
                  <WarningItem key={i}>
                    <span>•</span>
                    {warning}
                  </WarningItem>
                ))}
              </WarningList>
            </Section>
          )}
        </Result>
      )}
    </PageLayout>
  );
}
