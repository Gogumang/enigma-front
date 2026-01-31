'use client';

import { useState } from 'react';
import styled from '@emotion/styled';
import PageLayout from '@/components/PageLayout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const TypeTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`;

const TypeTab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 16px 12px;
  background: ${props => props.$active ? '#f04452' : '#fff'};
  color: ${props => props.$active ? '#fff' : '#191f28'};
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const TabIcon = styled.span`
  font-size: 20px;
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
    border-color: #f04452;
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 16px;
  background: #f04452;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  &:active {
    background: #d63341;
  }

  &:disabled {
    background: #e5e8eb;
    color: #adb5bd;
  }
`;

const ResultCard = styled.div<{ $safe: boolean }>`
  margin-top: 24px;
  padding: 28px 24px;
  text-align: center;
  border-radius: 16px;
  background: ${props => props.$safe ? '#e8f7f0' : '#ffebee'};
`;

const ResultIcon = styled.div`
  font-size: 40px;
  margin-bottom: 12px;
`;

const ResultTitle = styled.div<{ $safe: boolean }>`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.$safe ? '#20c997' : '#f04452'};
  margin-bottom: 4px;
`;

const ResultDesc = styled.div`
  font-size: 14px;
  color: #6b7684;
`;

const RecordList = styled.div`
  margin-top: 16px;
`;

const RecordItem = styled.div`
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const RecordHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
`;

const RecordBadge = styled.span`
  background: #ffebee;
  color: #f04452;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
`;

const RecordDate = styled.span`
  font-size: 13px;
  color: #8b95a1;
`;

const RecordDesc = styled.p`
  margin: 0;
  font-size: 14px;
  color: #191f28;
  line-height: 1.5;
`;

const InfoCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const InfoTitle = styled.h4`
  font-size: 15px;
  font-weight: 600;
  color: #191f28;
  margin: 0 0 16px;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f2f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-size: 14px;
  color: #8b95a1;
`;

const InfoValue = styled.a`
  font-size: 14px;
  color: #3182f6;
  font-weight: 600;
  text-decoration: none;
`;

type CheckType = 'PHONE' | 'ACCOUNT' | 'EMAIL';

interface Result {
  safe: boolean;
  type: CheckType;
  records: Array<{ type: string; date: string; desc: string }>;
}

export default function FraudPage() {
  const [type, setType] = useState<CheckType>('PHONE');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const config: Record<CheckType, { icon: string; label: string; placeholder: string }> = {
    PHONE: { icon: '📞', label: '전화번호', placeholder: '01012345678' },
    ACCOUNT: { icon: '🏦', label: '계좌번호', placeholder: '1234567890123' },
    EMAIL: { icon: '📧', label: '이메일', placeholder: 'email@example.com' },
  };

  const check = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/fraud/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          value: value.replace(/-/g, '').trim(),
        }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        setResult({
          safe: data.data.status === 'safe',
          type,
          records: (data.data.records || []).map((r: { type: string; date: string; description: string }) => ({
            type: r.type,
            date: r.date,
            desc: r.description,
          })),
        });
      } else {
        alert(data.error || '조회 실패');
      }
    } catch {
      alert('서버 연결에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="사기 이력 조회">
      <TypeTabs>
        {(Object.keys(config) as CheckType[]).map(t => (
          <TypeTab key={t} $active={type === t} onClick={() => { setType(t); setValue(''); setResult(null); }}>
            <TabIcon>{config[t].icon}</TabIcon>
            {config[t].label}
          </TypeTab>
        ))}
      </TypeTabs>

      <Input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={config[type].placeholder}
        onKeyDown={e => e.key === 'Enter' && check()}
      />

      <Button onClick={check} disabled={loading || !value.trim()}>
        {loading ? '조회 중...' : '조회하기'}
      </Button>

      {result && (
        <>
          <ResultCard $safe={result.safe}>
            <ResultIcon>{result.safe ? '✅' : '🚨'}</ResultIcon>
            <ResultTitle $safe={result.safe}>
              {result.safe ? '사기 이력 없음' : '사기 이력 발견'}
            </ResultTitle>
            <ResultDesc>
              {result.safe
                ? '최근 3개월 내 신고된 이력이 없어요'
                : '이 정보로 사기 피해가 신고됐어요'}
            </ResultDesc>
          </ResultCard>

          {result.records.length > 0 && (
            <RecordList>
              {result.records.map((r, i) => (
                <RecordItem key={i}>
                  <RecordHeader>
                    <RecordBadge>{r.type}</RecordBadge>
                    <RecordDate>{r.date}</RecordDate>
                  </RecordHeader>
                  <RecordDesc>{r.desc}</RecordDesc>
                </RecordItem>
              ))}
            </RecordList>
          )}
        </>
      )}

      <InfoCard>
        <InfoTitle>피해 신고 연락처</InfoTitle>
        <InfoItem>
          <InfoLabel>경찰청 사이버범죄</InfoLabel>
          <InfoValue href="https://ecrm.police.go.kr" target="_blank">ecrm.police.go.kr</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>금융감독원</InfoLabel>
          <InfoValue href="tel:1332">1332</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>인터넷진흥원</InfoLabel>
          <InfoValue href="tel:118">118</InfoValue>
        </InfoItem>
      </InfoCard>
    </PageLayout>
  );
}
