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

const TypeTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const TypeTab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 12px;
  background: ${props => props.$active ? '#111111' : '#f7f8f9'};
  color: ${props => props.$active ? '#ffffff' : '#666666'};
  border: 1px solid ${props => props.$active ? '#111111' : '#e5e5e5'};
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    background: ${props => props.$active ? '#111111' : '#f0f1f2'};
  }
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

const ResultCard = styled.div<{ $status: 'safe' | 'danger' | 'loading' }>`
  margin-top: 24px;
  padding: 24px;
  border-radius: 16px;
  background: ${props => {
    switch (props.$status) {
      case 'safe': return '#e6f7ee';
      case 'danger': return '#ffebee';
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
      default: return '#666666';
    }
  }};
`;

const ResultText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #555555;
`;

const RecordList = styled.div`
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  overflow: hidden;
`;

const RecordItem = styled.div`
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  &:last-child {
    border-bottom: none;
  }
`;

const RecordHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const RecordBadge = styled.span`
  background: #ff334b;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
`;

const RecordDate = styled.span`
  font-size: 13px;
  color: #888888;
`;

const RecordDesc = styled.p`
  margin: 0;
  font-size: 14px;
  color: #333333;
`;

const InfoSection = styled.div`
  margin-top: 24px;
  background: #f7f8f9;
  border-radius: 12px;
  padding: 20px;
`;

const InfoTitle = styled.h4`
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: #333333;
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
`;

const InfoLabel = styled.span`
  color: #666666;
`;

const InfoValue = styled.a`
  color: #06c755;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const ReportButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 12px 20px;
  background: #111111;
  color: white;
  text-decoration: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.15s;

  &:hover {
    background: #333333;
  }
`;

type CheckType = 'PHONE' | 'ACCOUNT' | 'EMAIL';

interface FraudResult {
  status: 'safe' | 'danger';
  type: CheckType;
  value: string;
  records: Array<{
    type: string;
    date: string;
    description: string;
  }>;
}

export default function FraudCheck() {
  const [checkType, setCheckType] = useState<CheckType>('PHONE');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FraudResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const typeConfig: Record<CheckType, { label: string; placeholder: string; icon: string }> = {
    PHONE: { label: '전화번호', placeholder: '01012345678', icon: '📞' },
    ACCOUNT: { label: '계좌번호', placeholder: '1234567890123', icon: '🏦' },
    EMAIL: { label: '이메일', placeholder: 'example@email.com', icon: '📧' },
  };

  const validateInput = () => {
    const trimmed = value.trim();
    if (!trimmed) return false;

    switch (checkType) {
      case 'PHONE':
        return /^01[0-9]{8,9}$/.test(trimmed.replace(/-/g, ''));
      case 'ACCOUNT':
        return /^[0-9]{10,16}$/.test(trimmed.replace(/-/g, ''));
      case 'EMAIL':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
      default:
        return false;
    }
  };

  const checkFraud = async () => {
    if (!validateInput()) {
      setError(`올바른 ${typeConfig[checkType].label} 형식이 아닙니다.`);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const normalizedValue = value.replace(/-/g, '').trim();

      const response = await fetch(`${API_URL}/api/fraud/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: checkType,
          value: normalizedValue,
        }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        setResult({
          status: data.data.status,
          type: checkType,
          value: normalizedValue,
          records: data.data.records || [],
        });
      } else {
        throw new Error(data.error || '조회 실패');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <Title>사기 이력 조회</Title>
        <Description>전화번호, 계좌번호, 이메일의 사기 이력을 조회합니다.</Description>
      </CardHeader>

      <CardBody>
        <TypeTabs>
          {(Object.keys(typeConfig) as CheckType[]).map(type => (
            <TypeTab
              key={type}
              $active={checkType === type}
              onClick={() => {
                setCheckType(type);
                setValue('');
                setResult(null);
                setError(null);
              }}
            >
              <span>{typeConfig[type].icon}</span>
              {typeConfig[type].label}
            </TypeTab>
          ))}
        </TypeTabs>

        <InputGroup>
          <Input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={typeConfig[checkType].placeholder}
            onKeyDown={(e) => e.key === 'Enter' && checkFraud()}
          />
          <Button onClick={checkFraud} disabled={loading || !value.trim()}>
            {loading ? '조회 중...' : '조회하기'}
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
                <ResultTitle $status="loading">조회 중...</ResultTitle>
                <ResultText>사기 피해 데이터베이스를 검색하고 있습니다.</ResultText>
              </ResultContent>
            </ResultHeader>
          </ResultCard>
        )}

        {result && (
          <ResultCard $status={result.status}>
            <ResultHeader>
              <ResultIcon>{result.status === 'safe' ? '✅' : '🚨'}</ResultIcon>
              <ResultContent>
                <ResultTitle $status={result.status}>
                  {result.status === 'safe' ? '사기 이력 없음' : '사기 이력 발견!'}
                </ResultTitle>
                <ResultText>
                  {result.status === 'safe'
                    ? '최근 3개월 내 신고된 사기 피해 이력이 없습니다.'
                    : `이 ${typeConfig[result.type].label}은(는) 사기에 사용된 이력이 있습니다.`
                  }
                </ResultText>
              </ResultContent>
            </ResultHeader>

            {result.records.length > 0 && (
              <RecordList>
                {result.records.map((record, index) => (
                  <RecordItem key={index}>
                    <RecordHeader>
                      <RecordBadge>{record.type}</RecordBadge>
                      <RecordDate>{record.date}</RecordDate>
                    </RecordHeader>
                    <RecordDesc>{record.description}</RecordDesc>
                  </RecordItem>
                ))}
              </RecordList>
            )}
          </ResultCard>
        )}

        <InfoSection>
          <InfoTitle>피해 신고 연락처</InfoTitle>
          <InfoList>
            <InfoItem>
              <InfoLabel>경찰청 사이버범죄 신고</InfoLabel>
              <InfoValue href="https://ecrm.police.go.kr" target="_blank">ecrm.police.go.kr</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>금융감독원</InfoLabel>
              <InfoValue href="tel:1332">1332</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>한국인터넷진흥원</InfoLabel>
              <InfoValue href="tel:118">118</InfoValue>
            </InfoItem>
          </InfoList>
          <ReportButton href="https://ecrm.police.go.kr" target="_blank">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            사이버범죄 신고하기
          </ReportButton>
        </InfoSection>
      </CardBody>
    </Card>
  );
}
