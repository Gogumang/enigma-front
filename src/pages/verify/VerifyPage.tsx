import { useState, type ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import Lottie from 'lottie-react';
import { PageLayout } from '@/shared/ui';
import { useVerify } from '@/features/verify';
import { memoryStore } from '@/shared/lib/storage';
import {
  TypeTabs,
  TypeTab,
  TabIcon,
  InputWrapper,
  InputRow,
  InputPrefix,
  Input,
  InputHint,
  Button,
  Spinner,
  LoadingOverlay,
  LoadingLottie,
  LoadingText,
  LoadingSubText,
  ErrorMessage,
} from './VerifyPage.styles';

import loadingAnimation from '@/shared/assets/lottie/loading.json';

type InputType = 'URL' | 'PHONE' | 'ACCOUNT';

const typeConfig: Record<InputType, {
  label: string;
  placeholder: string;
  hint: string;
  icon: ReactNode;
}> = {
  URL: {
    label: 'URL',
    placeholder: 'https://example.com 또는 bit.ly/xxx',
    hint: '의심되는 링크를 붙여넣으세요. 단축 URL도 자동으로 추적합니다.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    ),
  },
  PHONE: {
    label: '전화번호',
    placeholder: '010-1234-5678',
    hint: '하이픈(-) 없이 숫자만 입력해도 됩니다.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
  },
  ACCOUNT: {
    label: '계좌번호',
    placeholder: '123-456-789012',
    hint: '하이픈(-) 없이 숫자만 입력해도 됩니다.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
};

export default function VerifyPage() {
  const navigate = useNavigate();
  const [inputType, setInputType] = useState<InputType>('URL');
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const verify = useVerify();

  const handleTypeChange = (t: InputType) => {
    setInputType(t);
    setValue('');
    setError(null);
  };

  const check = async () => {
    setError(null);
    try {
      const data = await verify.mutateAsync({ type: inputType, value: value.trim() });
      memoryStore.set('verifyResult', data);
      navigate({ to: '/verify/result' });
    } catch (e) {
      setError(e instanceof Error ? e.message : '검증에 실패했습니다');
    }
  };

  const cfg = typeConfig[inputType];

  return (
    <PageLayout title="사기 검증">
      {verify.isPending ? (
        <LoadingOverlay>
          <LoadingLottie>
            <Lottie animationData={loadingAnimation} loop />
          </LoadingLottie>
          <LoadingText>검증 중...</LoadingText>
          <LoadingSubText>안전성을 분석하고 있어요</LoadingSubText>
        </LoadingOverlay>
      ) : (
        <>
          <TypeTabs>
            {(Object.keys(typeConfig) as InputType[]).map(t => (
              <TypeTab key={t} $active={inputType === t} onClick={() => handleTypeChange(t)}>
                <TabIcon $active={inputType === t}>
                  {typeConfig[t].icon}
                </TabIcon>
                {typeConfig[t].label}
              </TypeTab>
            ))}
          </TypeTabs>

          <InputWrapper>
            <InputRow>
              <InputPrefix>{cfg.icon}</InputPrefix>
              <Input
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder={cfg.placeholder}
                onKeyDown={e => e.key === 'Enter' && !verify.isPending && value.trim() && check()}
                inputMode={inputType === 'URL' ? 'url' : 'numeric'}
              />
            </InputRow>
            <InputHint>{cfg.hint}</InputHint>
          </InputWrapper>

          <Button onClick={check} disabled={!value.trim() || verify.isPending}>
            {verify.isPending ? <><Spinner /> 검증 중...</> : '검증하기'}
          </Button>

          {error && <ErrorMessage>{error}</ErrorMessage>}
        </>
      )}
    </PageLayout>
  );
}
