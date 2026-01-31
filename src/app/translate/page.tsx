'use client';

import { useState } from 'react';
import styled from '@emotion/styled';
import PageLayout from '@/components/PageLayout';
import { scamTranslations } from '@/lib/scamPatterns';

const Card = styled.div`
  background: #f9fafb;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 20px;
`;

const InputArea = styled.div`
  padding: 20px;
  background: #fff;
`;

const Label = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #8b95a1;
  margin-bottom: 12px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 17px;
  font-family: inherit;
  line-height: 1.6;
  resize: none;
  color: #191f28;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const OutputArea = styled.div`
  padding: 20px;
  min-height: 80px;
`;

const OutputText = styled.div`
  font-size: 16px;
  line-height: 1.7;
  color: #f04452;
  font-weight: 500;
`;

const QuickButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const QuickBtn = styled.button`
  padding: 10px 16px;
  background: #f9fafb;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  color: #191f28;
  cursor: pointer;

  &:active {
    background: #f2f4f6;
  }
`;

const quickPhrases = ['사랑해', '보고 싶어', '투자 기회', '급하게 돈이 필요해', '영상통화는 좀...'];

export default function TranslatePage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const translate = (text: string) => {
    if (!text.trim()) {
      setOutput('');
      return;
    }

    for (const [key, value] of Object.entries(scamTranslations)) {
      if (text.includes(key)) {
        setOutput(value);
        return;
      }
    }

    if (text.includes('사랑') || text.includes('좋아')) setOutput('감정적 유대 형성 시도');
    else if (text.includes('돈') || text.includes('원')) setOutput('금전적 목적 탐지');
    else if (text.includes('급') || text.includes('빨리')) setOutput('판단력 약화 시도');
    else setOutput('분석 중...');
  };

  const handleQuick = (phrase: string) => {
    setInput(phrase);
    translate(phrase);
  };

  return (
    <PageLayout title="사기 번역기">
      <Card>
        <InputArea>
          <Label>스캐머가 한 말</Label>
          <TextArea
            value={input}
            onChange={e => { setInput(e.target.value); translate(e.target.value); }}
            placeholder="입력하세요"
          />
        </InputArea>
        <OutputArea>
          <Label>실제 의도</Label>
          <OutputText>{output || '번역 결과가 여기에 표시돼요'}</OutputText>
        </OutputArea>
      </Card>

      <QuickButtons>
        {quickPhrases.map((phrase, i) => (
          <QuickBtn key={i} onClick={() => handleQuick(phrase)}>
            {phrase}
          </QuickBtn>
        ))}
      </QuickButtons>
    </PageLayout>
  );
}
