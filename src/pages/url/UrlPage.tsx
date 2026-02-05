import { useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { PageLayout } from '@/shared/ui';
import { useUrlCheck } from '@/features/check-url';
import type { UrlCheckResult } from '@/entities/analysis';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Input = styled.input`
  width: 100%;
  padding: 16px;
  border: 1px solid #e5e8eb;
  border-radius: 12px;
  background: #fff;
  font-size: 16px;
  color: #191f28;
  margin-bottom: 16px;

  &:focus {
    outline: none;
    border-color: #ff9500;
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 16px;
  background: #ff9500;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:active {
    background: #e68600;
  }

  &:disabled {
    background: #e5e8eb;
    color: #adb5bd;
  }
`;

const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const Result = styled.div`
  margin-top: 24px;
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

const ResultMessage = styled.div`
  font-size: 14px;
  color: #6b7684;
  line-height: 1.5;
`;

const RiskScoreBar = styled.div`
  margin-top: 20px;
`;

const RiskScoreLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #6b7684;
  margin-bottom: 8px;
`;

const RiskScoreTrack = styled.div`
  height: 8px;
  background: #e5e8eb;
  border-radius: 4px;
  overflow: hidden;
`;

const RiskScoreFill = styled.div<{ $value: number; $status: 'safe' | 'warning' | 'danger' }>`
  height: 100%;
  width: ${props => props.$value}%;
  background: ${props =>
    props.$status === 'safe' ? '#20c997' :
    props.$status === 'warning' ? '#ff9500' : '#f04452'};
  border-radius: 4px;
  transition: width 0.5s ease;
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
  color: ${props => props.$bad ? '#f04452' : props.$good ? '#20c997' : '#191f28'};
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
  background: ${props => props.$isLast ? '#e8f7f0' : '#f8f9fa'};
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
