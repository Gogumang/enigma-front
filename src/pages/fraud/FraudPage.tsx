import { useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { PageLayout } from '@/shared/ui';
import { useFraudCheck } from '@/features/check-fraud';
import type { FraudCheckResult } from '@/entities/analysis';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

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
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const TabIcon = styled.span`
  font-size: 24px;
`;

const InputGroup = styled.div`
  margin-bottom: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px;
  border: 1px solid #e5e8eb;
  border-radius: 12px;
  background: #fff;
  font-size: 16px;
  color: #191f28;

  &:focus {
    outline: none;
    border-color: #f04452;
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 16px;
  border: 1px solid #e5e8eb;
  border-radius: 12px;
  background: #fff;
  font-size: 16px;
  color: #191f28;
  margin-top: 12px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #f04452;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:active {
    background: #d63341;
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

const ResultCard = styled.div<{ $status: 'safe' | 'danger' }>`
  margin-top: 24px;
  padding: 28px 24px;
  text-align: center;
  border-radius: 16px;
  background: ${props => props.$status === 'safe' ? '#e8f7f0' : '#ffebee'};
`;

const ResultIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
`;

const ResultTitle = styled.div<{ $status: 'safe' | 'danger' }>`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.$status === 'safe' ? '#20c997' : '#f04452'};
  margin-bottom: 8px;
`;

const ResultDesc = styled.div`
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

const PatternItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f2f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const PatternLabel = styled.span`
  font-size: 14px;
  color: #8b95a1;
`;

const PatternValue = styled.span<{ $warning?: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$warning ? '#ff9500' : '#191f28'};
`;

const WarningList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
`;

const WarningItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  background: #fff8e6;
  border-radius: 10px;
  font-size: 14px;
  color: #333;
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

type CheckType = 'PHONE' | 'ACCOUNT';

const config: Record<CheckType, { icon: string; label: string; placeholder: string }> = {
  PHONE: { icon: '📞', label: '전화번호', placeholder: '010-1234-5678' },
  ACCOUNT: { icon: '🏦', label: '계좌번호', placeholder: '123-456-789012' },
};

const BANKS = [
  { code: '', name: '은행 선택 (선택사항)' },
  { code: 'KB', name: '국민은행' },
  { code: 'SHINHAN', name: '신한은행' },
  { code: 'WOORI', name: '우리은행' },
  { code: 'HANA', name: '하나은행' },
  { code: 'NH', name: '농협은행' },
  { code: 'IBK', name: '기업은행' },
  { code: 'KAKAO', name: '카카오뱅크' },
  { code: 'TOSS', name: '토스뱅크' },
  { code: 'KBANK', name: '케이뱅크' },
  { code: 'SC', name: 'SC제일은행' },
  { code: 'POST', name: '우체국' },
];

export default function FraudPage() {
  const [type, setType] = useState<CheckType>('PHONE');
  const [value, setValue] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [result, setResult] = useState<FraudCheckResult | null>(null);
  const fraudCheck = useFraudCheck();

  const check = async () => {
    setResult(null);
    try {
      const data = await fraudCheck.mutateAsync({
        type,
        value,
        bankCode: type === 'ACCOUNT' ? bankCode : undefined,
      });
      setResult(data);
    } catch {
      alert('조회 실패');
    }
  };

  const getLinkIcon = (name: string) => {
    if (name.includes('더치트')) return '🔍';
    if (name.includes('경찰')) return '👮';
    if (name.includes('금융')) return '🏛️';
    if (name.includes('국가정보원')) return '🛡️';
    return '🔗';
  };

  return (
    <PageLayout title="사기 이력 조회">
      <TypeTabs>
        {(Object.keys(config) as CheckType[]).map(t => (
          <TypeTab
            key={t}
            $active={type === t}
            onClick={() => { setType(t); setValue(''); setResult(null); setBankCode(''); }}
          >
            <TabIcon>{config[t].icon}</TabIcon>
            {config[t].label}
          </TypeTab>
        ))}
      </TypeTabs>

      <InputGroup>
        <Input
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder={config[type].placeholder}
          onKeyDown={e => e.key === 'Enter' && !fraudCheck.isPending && check()}
        />
        {type === 'ACCOUNT' && (
          <Select value={bankCode} onChange={e => setBankCode(e.target.value)}>
            {BANKS.map(bank => (
              <option key={bank.code} value={bank.code}>{bank.name}</option>
            ))}
          </Select>
        )}
      </InputGroup>

      <Button onClick={check} disabled={fraudCheck.isPending || !value.trim()}>
        {fraudCheck.isPending ? <><Spinner /> 조회 중...</> : '조회하기'}
      </Button>

      {result && (
        <>
          <ResultCard $status={result.status}>
            <ResultIcon>{result.status === 'safe' ? '✅' : '🚨'}</ResultIcon>
            <ResultTitle $status={result.status}>
              {result.status === 'safe' ? '사기 이력 없음' : '사기 이력 발견!'}
            </ResultTitle>
            <ResultDesc>{result.message}</ResultDesc>
          </ResultCard>

          {/* 번호/계좌 분석 */}
          {result.patternAnalysis && (
            <Section>
              <SectionTitle>📊 {type === 'PHONE' ? '번호' : '계좌'} 분석</SectionTitle>
              <PatternItem>
                <PatternLabel>입력값</PatternLabel>
                <PatternValue>{result.displayValue}</PatternValue>
              </PatternItem>
              {result.patternAnalysis.type && (
                <PatternItem>
                  <PatternLabel>유형</PatternLabel>
                  <PatternValue>{result.patternAnalysis.type}</PatternValue>
                </PatternItem>
              )}
              {result.bank && (
                <PatternItem>
                  <PatternLabel>은행</PatternLabel>
                  <PatternValue>{result.bank}</PatternValue>
                </PatternItem>
              )}
              <PatternItem>
                <PatternLabel>유효성</PatternLabel>
                <PatternValue $warning={!result.patternAnalysis.isValid}>
                  {result.patternAnalysis.isValid ? '✓ 유효함' : '⚠️ 유효하지 않음'}
                </PatternValue>
              </PatternItem>

              {result.patternAnalysis.warnings && result.patternAnalysis.warnings.length > 0 && (
                <WarningList>
                  {result.patternAnalysis.warnings.map((warning, i) => (
                    <WarningItem key={i}>
                      <span>⚠️</span>
                      {warning}
                    </WarningItem>
                  ))}
                </WarningList>
              )}
            </Section>
          )}

          {/* 권장 사항 */}
          {result.recommendations.length > 0 && (
            <Section>
              <SectionTitle>💡 권장 사항</SectionTitle>
              <RecommendationList>
                {result.recommendations.map((rec, i) => (
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
                {result.additionalLinks.map((link, i) => (
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
