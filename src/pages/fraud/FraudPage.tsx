import { useState } from 'react';
import { PageLayout } from '@/shared/ui';
import { useFraudCheck } from '@/features/check-fraud';
import type { FraudCheckResult } from '@/entities/analysis';
import {
  TypeTabs,
  TypeTab,
  TabIcon,
  InputGroup,
  Input,
  Select,
  Button,
  Spinner,
  ResultCard,
  ResultIcon,
  ResultTitle,
  ResultDesc,
  Section,
  SectionTitle,
  PatternItem,
  PatternLabel,
  PatternValue,
  WarningList,
  WarningItem,
  RecommendationList,
  RecommendationItem,
} from './FraudPage.styles';

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

        </>
      )}
    </PageLayout>
  );
}
