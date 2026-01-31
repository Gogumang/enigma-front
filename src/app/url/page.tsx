'use client';

import { useState } from 'react';
import styled from '@emotion/styled';
import PageLayout from '@/components/PageLayout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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

  &:active {
    background: #e68600;
  }

  &:disabled {
    background: #e5e8eb;
    color: #adb5bd;
  }
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
  font-size: 40px;
  margin-bottom: 12px;
`;

const ResultTitle = styled.div<{ $status: 'safe' | 'warning' | 'danger' }>`
  font-size: 18px;
  font-weight: 700;
  color: ${props =>
    props.$status === 'safe' ? '#20c997' :
    props.$status === 'warning' ? '#ff9500' : '#f04452'};
`;

const DetailList = styled.div`
  margin-top: 16px;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 14px 16px;
  background: #f9fafb;
  border-radius: 10px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  font-size: 14px;
  color: #8b95a1;
`;

const DetailValue = styled.span<{ $bad?: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$bad ? '#f04452' : '#191f28'};
`;

interface CheckResult {
  status: 'safe' | 'warning' | 'danger';
  domain: string;
  https: boolean;
  warnings: string[];
}

export default function UrlPage() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<CheckResult | null>(null);

  const [loading, setLoading] = useState(false);

  const check = async () => {
    setLoading(true);
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
          domain: data.data.domain,
          https: data.data.isHttps,
          warnings: data.data.suspiciousPatterns || [],
        });
      } else {
        alert(data.error || '올바른 URL을 입력하세요');
      }
    } catch {
      alert('서버 연결에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const getContent = () => {
    if (!result) return null;
    return {
      safe: { icon: '✅', title: '안전해 보여요' },
      warning: { icon: '⚠️', title: '주의가 필요해요' },
      danger: { icon: '🚨', title: '위험해요' },
    }[result.status];
  };

  return (
    <PageLayout title="URL 검사">
      <Input
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="https://example.com"
        onKeyDown={e => e.key === 'Enter' && check()}
      />
      <Button onClick={check} disabled={!url.trim() || loading}>
        {loading ? '검사 중...' : '검사하기'}
      </Button>

      {result && (
        <Result>
          <ResultCard $status={result.status}>
            <ResultIcon>{getContent()?.icon}</ResultIcon>
            <ResultTitle $status={result.status}>{getContent()?.title}</ResultTitle>
          </ResultCard>

          <DetailList>
            <DetailItem>
              <DetailLabel>도메인</DetailLabel>
              <DetailValue>{result.domain}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>HTTPS</DetailLabel>
              <DetailValue $bad={!result.https}>
                {result.https ? '사용 중' : '미사용'}
              </DetailValue>
            </DetailItem>
            {result.warnings.map((w, i) => (
              <DetailItem key={i}>
                <DetailLabel>경고</DetailLabel>
                <DetailValue $bad>{w}</DetailValue>
              </DetailItem>
            ))}
          </DetailList>
        </Result>
      )}
    </PageLayout>
  );
}
