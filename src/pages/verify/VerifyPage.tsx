import { useState, type ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import Lottie from 'lottie-react';
import { PageLayout } from '@/shared/ui';
import { useVerify } from '@/features/verify';
import { memoryStore } from '@/shared/lib/storage';

import loadingAnimation from '@/shared/assets/lottie/loading.json';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const TypeTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const TypeTab = styled.button<{ $active: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 8px;
  border-radius: 14px;
  border: 2px solid ${p => (p.$active ? '#6366f1' : '#e5e8eb')};
  background: ${p => (p.$active ? '#f5f3ff' : '#fff')};
  color: ${p => (p.$active ? '#6366f1' : '#6b7684')};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #6366f1;
  }
`;

const TabIcon = styled.div<{ $active: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${p => (p.$active ? '#6366f1' : '#f2f4f6')};
  color: ${p => (p.$active ? '#fff' : '#8b95a1')};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  border: 2px solid #e5e8eb;
  border-radius: 14px;
  background: #fff;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus-within {
    border-color: #6366f1;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }
`;

const InputPrefix = styled.div`
  padding: 0 4px 0 16px;
  color: #8b95a1;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const Input = styled.input`
  flex: 1;
  padding: 16px 16px 16px 8px;
  border: none;
  background: transparent;
  font-size: 16px;
  color: #191f28;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const InputHint = styled.div`
  margin-top: 10px;
  font-size: 13px;
  color: #8b95a1;
  line-height: 1.6;
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

const LoadingOverlay = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const LoadingLottie = styled.div`
  width: 160px;
  height: 160px;
`;

const LoadingText = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #6366f1;
`;

const LoadingSubText = styled.div`
  font-size: 13px;
  color: #8b95a1;
`;

const ErrorMessage = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: #fef2f2;
  border-radius: 12px;
  color: #dc2626;
  font-size: 14px;
  text-align: center;
`;

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
