'use client';

import { useState } from 'react';
import styled from '@emotion/styled';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e5e5e5;
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 24px 24px 0;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #111111;
  margin: 0 0 8px;
`;

const Description = styled.p`
  color: #888888;
  font-size: 14px;
  margin: 0;
`;

const CardBody = styled.div`
  padding: 24px;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 14px 16px;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  font-size: 15px;
  background: #f7f8f9;
  transition: all 0.15s;

  &:focus {
    outline: none;
    border-color: #06c755;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(6, 199, 85, 0.1);
  }

  &::placeholder {
    color: #aaaaaa;
  }
`;

const Button = styled.button`
  padding: 14px 24px;
  background: #06c755;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;

  &:hover {
    background: #05b54d;
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const ResultCard = styled.div<{ $status: 'safe' | 'danger' | 'warning' | 'loading' }>`
  margin-top: 24px;
  padding: 24px;
  border-radius: 16px;
  background: ${props => {
    switch (props.$status) {
      case 'safe': return '#e6f7ee';
      case 'danger': return '#ffebee';
      case 'warning': return '#fff8e6';
      case 'loading': return '#f7f8f9';
      default: return '#f7f8f9';
    }
  }};
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

const ResultIcon = styled.div`
  font-size: 40px;
`;

const ResultContent = styled.div`
  flex: 1;
`;

const ResultTitle = styled.h3<{ $status: string }>`
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 700;
  color: ${props => {
    switch (props.$status) {
      case 'safe': return '#06c755';
      case 'danger': return '#ff334b';
      case 'warning': return '#ff9500';
      default: return '#666666';
    }
  }};
`;

const ResultText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #555555;
`;

const DetailSection = styled.div`
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  padding: 16px;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  font-size: 14px;

  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  color: #666666;
`;

const DetailValue = styled.span<{ $danger?: boolean }>`
  font-weight: 500;
  color: ${props => props.$danger ? '#ff334b' : '#111111'};
`;

const WarningList = styled.div`
  margin-top: 12px;
`;

const WarningItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  font-size: 13px;
  color: #ff334b;
`;

const TipsCard = styled.div`
  margin-top: 24px;
  background: #f7f8f9;
  border-radius: 12px;
  padding: 20px;
`;

const TipsTitle = styled.h4`
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const TipsList = styled.ul`
  margin: 0;
  padding-left: 20px;
  font-size: 14px;
  color: #555555;
  line-height: 1.8;
`;

interface CheckResult {
  status: 'safe' | 'danger' | 'warning';
  url: string;
  details: {
    domain: string;
    isHttps: boolean;
    suspiciousPatterns: string[];
  };
}

export default function UrlChecker() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkUrl = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/url/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        setResult({
          status: data.data.status,
          url: data.data.url,
          details: {
            domain: data.data.domain,
            isHttps: data.data.isHttps,
            suspiciousPatterns: data.data.suspiciousPatterns || [],
          },
        });
      } else {
        throw new Error(data.error || 'URL 검사 실패');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '올바른 URL 형식이 아닙니다.');
    } finally {
      setLoading(false);
    }
  };

  const getResultContent = () => {
    if (!result) return null;

    const contents = {
      safe: { icon: '✅', title: '안전해 보입니다', text: '기본 보안 검사를 통과했습니다. 하지만 항상 주의하세요.' },
      warning: { icon: '⚠️', title: '주의가 필요합니다', text: '의심스러운 패턴이 감지되었습니다. 신중하게 접근하세요.' },
      danger: { icon: '🚨', title: '위험합니다!', text: '피싱이나 악성 사이트일 가능성이 높습니다. 접속을 권장하지 않습니다.' },
    };

    return contents[result.status];
  };

  return (
    <Card>
      <CardHeader>
        <Title>URL 안전성 검사</Title>
        <Description>상대방이 보낸 링크가 안전한지 확인해보세요.</Description>
      </CardHeader>

      <CardBody>
        <InputGroup>
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="검사할 URL을 입력하세요"
            onKeyDown={(e) => e.key === 'Enter' && checkUrl()}
          />
          <Button onClick={checkUrl} disabled={loading || !url.trim()}>
            {loading ? '검사 중...' : '검사하기'}
          </Button>
        </InputGroup>

        {error && (
          <ResultCard $status="danger">
            <ResultHeader>
              <ResultIcon>❌</ResultIcon>
              <ResultContent>
                <ResultTitle $status="danger">오류</ResultTitle>
                <ResultText>{error}</ResultText>
              </ResultContent>
            </ResultHeader>
          </ResultCard>
        )}

        {loading && (
          <ResultCard $status="loading">
            <ResultHeader>
              <ResultIcon>🔍</ResultIcon>
              <ResultContent>
                <ResultTitle $status="loading">검사 중...</ResultTitle>
                <ResultText>URL을 분석하고 있습니다.</ResultText>
              </ResultContent>
            </ResultHeader>
          </ResultCard>
        )}

        {result && (
          <ResultCard $status={result.status}>
            <ResultHeader>
              <ResultIcon>{getResultContent()?.icon}</ResultIcon>
              <ResultContent>
                <ResultTitle $status={result.status}>{getResultContent()?.title}</ResultTitle>
                <ResultText>{getResultContent()?.text}</ResultText>
              </ResultContent>
            </ResultHeader>

            <DetailSection>
              <DetailItem>
                <DetailLabel>도메인</DetailLabel>
                <DetailValue>{result.details.domain}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>HTTPS</DetailLabel>
                <DetailValue $danger={!result.details.isHttps}>
                  {result.details.isHttps ? '사용 중 ✓' : '미사용 ✗'}
                </DetailValue>
              </DetailItem>
              {result.details.suspiciousPatterns.length > 0 && (
                <WarningList>
                  {result.details.suspiciousPatterns.map((pattern, index) => (
                    <WarningItem key={index}>
                      <span>⚠️</span> {pattern}
                    </WarningItem>
                  ))}
                </WarningList>
              )}
            </DetailSection>
          </ResultCard>
        )}

        <TipsCard>
          <TipsTitle>
            <span>💡</span> URL 안전 확인 팁
          </TipsTitle>
          <TipsList>
            <li>항상 https://로 시작하는지 확인</li>
            <li>단축 URL(bit.ly 등)은 실제 주소를 숨길 수 있음</li>
            <li>철자가 다른 유사 도메인 주의 (예: paypa1.com)</li>
            <li>투자, 암호화폐 관련 링크는 특히 주의</li>
          </TipsList>
        </TipsCard>
      </CardBody>
    </Card>
  );
}
