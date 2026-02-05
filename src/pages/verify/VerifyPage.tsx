import { useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { PageLayout } from '@/shared/ui';
import { useVerify } from '@/features/verify';
import type { VerifyResult } from '@/entities/analysis';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 18px 20px;
  border: 2px solid #e5e8eb;
  border-radius: 16px;
  background: #fff;
  font-size: 16px;
  color: #191f28;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const InputHint = styled.div`
  margin-top: 8px;
  font-size: 13px;
  color: #8b95a1;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const HintTag = styled.span`
  background: #f2f4f6;
  padding: 4px 10px;
  border-radius: 8px;
`;

const Button = styled.button`
  width: 100%;
  padding: 16px;
  margin-top: 16px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #e5e8eb;
    color: #adb5bd;
    transform: none;
    box-shadow: none;
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

const DetectedType = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 20px;
  padding: 8px 14px;
  background: #f0f9ff;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #0369a1;
`;

const ResultCard = styled.div<{ $status: 'safe' | 'warning' | 'danger' }>`
  margin-top: 20px;
  padding: 28px 24px;
  text-align: center;
  border-radius: 20px;
  background: ${props =>
    props.$status === 'safe' ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' :
    props.$status === 'warning' ? 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)' :
    'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'};
`;

const ResultIcon = styled.div`
  font-size: 52px;
  margin-bottom: 12px;
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
  height: 10px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
`;

const RiskScoreFill = styled.div<{ $value: number; $status: 'safe' | 'warning' | 'danger' }>`
  height: 100%;
  width: ${props => props.$value}%;
  background: ${props =>
    props.$status === 'safe' ? '#10b981' :
    props.$status === 'warning' ? '#f59e0b' : '#ef4444'};
  border-radius: 5px;
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

const getStatusContent = (status: 'safe' | 'warning' | 'danger') => ({
  safe: { icon: '✅', title: '안전해 보여요' },
  warning: { icon: '⚠️', title: '주의가 필요해요' },
  danger: { icon: '🚨', title: '위험해요!' },
}[status]);

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'URL': return '🔗';
    case 'PHONE': return '📞';
    case 'ACCOUNT': return '🏦';
    default: return '🔍';
  }
};

const getLinkIcon = (name: string) => {
  if (name.includes('더치트')) return '🔍';
  if (name.includes('경찰')) return '👮';
  if (name.includes('금융')) return '🏛️';
  return '🔗';
};

export default function VerifyPage() {
  const [value, setValue] = useState('');
  const [result, setResult] = useState<VerifyResult | null>(null);
  const verify = useVerify();

  const check = async () => {
    setResult(null);
    try {
      const data = await verify.mutateAsync(value.trim());
      setResult(data);
    } catch (e) {
      alert(e instanceof Error ? e.message : '검증 실패');
    }
  };

  return (
    <PageLayout title="사기 검증">
      <InputWrapper>
        <Input
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="URL, 전화번호, 계좌번호를 입력하세요"
          onKeyDown={e => e.key === 'Enter' && !verify.isPending && value.trim() && check()}
        />
        <InputHint>
          <HintTag>bit.ly/xxx</HintTag>
          <HintTag>010-1234-5678</HintTag>
          <HintTag>123-456-789012</HintTag>
        </InputHint>
      </InputWrapper>

      <Button onClick={check} disabled={!value.trim() || verify.isPending}>
        {verify.isPending ? <><Spinner /> 검증 중...</> : '검증하기'}
      </Button>

      {result && (
        <>
          <DetectedType>
            {getTypeIcon(result.detectedType)} {result.detectedTypeLabel}로 감지됨
          </DetectedType>

          <ResultCard $status={result.status}>
            <ResultIcon>{getStatusContent(result.status)?.icon}</ResultIcon>
            <ResultTitle $status={result.status}>{getStatusContent(result.status)?.title}</ResultTitle>
            <ResultMessage>{result.message}</ResultMessage>

            {result.riskScore !== undefined && (
              <RiskScoreBar>
                <RiskScoreLabel>
                  <span>위험도</span>
                  <span>{result.riskScore}%</span>
                </RiskScoreLabel>
                <RiskScoreTrack>
                  <RiskScoreFill $value={result.riskScore} $status={result.status} />
                </RiskScoreTrack>
              </RiskScoreBar>
            )}
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

          {/* URL: 감지된 위험 요소 */}
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
        </>
      )}
    </PageLayout>
  );
}
