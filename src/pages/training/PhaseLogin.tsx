import type { Persona } from '@/entities/persona';
import { useCallback, useEffect, useState } from 'react';
import {
  Cursor,
  FullScreenContainer,
  LoginBox,
  LoginButton,
  LoginInput,
  LoginInputWrapper,
  LoginLabel,
  LoginLogo,
  LoginScreen,
  LoginTagline,
  Spinner,
  platformConfig,
} from './TrainingPage.styles';

interface PhaseLoginProps {
  persona: Persona;
  onLoginComplete: () => void;
}

export default function PhaseLogin({ persona, onLoginComplete }: PhaseLoginProps) {
  const [emailText, setEmailText] = useState('');
  const [passwordText, setPasswordText] = useState('');
  const [loginPhase, setLoginPhase] = useState<'idle' | 'email' | 'password' | 'loading'>('idle');

  const currentPlatform = persona.platform;
  const currentPlatformConfig = platformConfig[currentPlatform];
  const targetEmail = 'user@enigma.kr';
  const targetPassword = '••••••••••';

  const typeText = useCallback(
    (text: string, setText: (t: string) => void, onComplete: () => void, delay = 80) => {
      let index = 0;
      const interval = setInterval(
        () => {
          if (index < text.length) {
            setText(text.slice(0, index + 1));
            index++;
          } else {
            clearInterval(interval);
            setTimeout(onComplete, 300);
          }
        },
        delay + Math.random() * 40,
      );
      return () => clearInterval(interval);
    },
    [],
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoginPhase('email'), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loginPhase !== 'email') return;
    return typeText(targetEmail, setEmailText, () => setLoginPhase('password'), 60);
  }, [loginPhase, typeText]);

  useEffect(() => {
    if (loginPhase !== 'password') return;
    return typeText(
      targetPassword,
      setPasswordText,
      () => {
        setTimeout(() => setLoginPhase('loading'), 500);
      },
      100,
    );
  }, [loginPhase, typeText]);

  useEffect(() => {
    if (loginPhase !== 'loading') return;
    const timer = setTimeout(() => {
      onLoginComplete();
    }, 1500);
    return () => clearTimeout(timer);
  }, [loginPhase, onLoginComplete]);

  return (
    <FullScreenContainer>
      <LoginScreen $platform={currentPlatform}>
        <LoginLogo $platform={currentPlatform}>{currentPlatformConfig?.name || 'SNS'}</LoginLogo>
        <LoginTagline $platform={currentPlatform}>
          {persona.name}님의 프로필에 접속 중...
        </LoginTagline>
        <LoginBox>
          <LoginInputWrapper>
            <LoginLabel>이메일 또는 전화번호</LoginLabel>
            <LoginInput $focused={loginPhase === 'email'}>
              {emailText}
              {loginPhase === 'email' && <Cursor />}
            </LoginInput>
          </LoginInputWrapper>
          <LoginInputWrapper>
            <LoginLabel>비밀번호</LoginLabel>
            <LoginInput $focused={loginPhase === 'password'}>
              {passwordText}
              {loginPhase === 'password' && <Cursor />}
            </LoginInput>
          </LoginInputWrapper>
          <LoginButton $loading={loginPhase === 'loading'} $platform={currentPlatform}>
            {loginPhase === 'loading' ? (
              <>
                <Spinner />
                로그인 중...
              </>
            ) : (
              '로그인'
            )}
          </LoginButton>
        </LoginBox>
      </LoginScreen>
    </FullScreenContainer>
  );
}
