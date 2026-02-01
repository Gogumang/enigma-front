import { useState } from 'react';
import styled from '@emotion/styled';
import { PageLayout } from '@/shared/ui';
import { useFraudCheck } from '@/features/check-fraud';
import type { FraudCheckResult } from '@/entities/analysis';

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

const config: Record<CheckType, { icon: string; label: string; placeholder: string }> = {
  PHONE: { icon: '📞', label: '전화번호', placeholder: '01012345678' },
  ACCOUNT: { icon: '🏦', label: '계좌번호', placeholder: '1234567890123' },
  EMAIL: { icon: '📧', label: '이메일', placeholder: 'email@example.com' },
};

export default function FraudPage() {
  const [type, setType] = useState<CheckType>('PHONE');
  const [value, setValue] = useState('');
  const [result, setResult] = useState<FraudCheckResult | null>(null);
  const fraudCheck = useFraudCheck();

  const check = async () => {
    setResult(null);
    try {
      const data = await fraudCheck.mutateAsync({ type, value });
      setResult(data);
    } catch {
      alert('조회 실패');
    }
  };

  return (
    <PageLayout title="사기 이력 조회">
      <TypeTabs>
        {(Object.keys(config) as CheckType[]).map(t => (
          <TypeTab
            key={t}
            $active={type === t}
            onClick={() => {
              setType(t);
              setValue('');
              setResult(null);
            }}
          >
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

      <Button onClick={check} disabled={fraudCheck.isPending || !value.trim()}>
        {fraudCheck.isPending ? '조회 중...' : '조회하기'}
      </Button>

      {result && (
        <>
          <ResultCard $safe={result.safe}>
            <ResultIcon>
              {result.safe ? (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#20c997" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              ) : (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f04452" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              )}
            </ResultIcon>
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
