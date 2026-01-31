'use client';

import { useState } from 'react';
import styled from '@emotion/styled';
import { scamTranslations } from '@/lib/scamPatterns';

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

const TranslatorGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const TranslatorBox = styled.div<{ $type: 'input' | 'output' }>`
  background: ${props => props.$type === 'input' ? '#f7f8f9' : '#111111'};
  border-radius: 12px;
  padding: 16px;
  min-height: 200px;
`;

const BoxLabel = styled.div<{ $type: 'input' | 'output' }>`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.$type === 'input' ? '#888888' : '#888888'};
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 140px;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 15px;
  font-family: inherit;
  resize: none;
  color: #111111;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #aaaaaa;
  }
`;

const OutputText = styled.div`
  font-size: 15px;
  line-height: 1.8;
  color: #06c755;
  font-family: 'SF Mono', 'Monaco', monospace;
  min-height: 140px;
`;

const QuickSection = styled.div`
  margin-top: 20px;
`;

const QuickLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #555555;
  margin-bottom: 10px;
`;

const QuickButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const QuickButton = styled.button`
  padding: 8px 14px;
  background: #f7f8f9;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 13px;
  color: #555555;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: #ffffff;
    border-color: #06c755;
    color: #06c755;
  }
`;

const HistorySection = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e5e5;
`;

const HistoryTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 12px;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const HistoryItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #f7f8f9;
  border-radius: 8px;
  gap: 12px;
`;

const HistoryOriginal = styled.span`
  font-size: 14px;
  color: #ff334b;
`;

const HistoryArrow = styled.span`
  color: #cccccc;
  font-size: 12px;
`;

const HistoryTranslated = styled.span`
  font-size: 14px;
  color: #06c755;
  margin-left: auto;
  font-family: monospace;
`;

export default function ScamTranslator() {
  const [input, setInput] = useState('');
  const [translations, setTranslations] = useState<Array<{ original: string; translated: string }>>([]);

  const translateText = (text: string) => {
    const lines = text.split('\n');
    const results: Array<{ original: string; translated: string }> = [];

    lines.forEach(line => {
      if (!line.trim()) return;

      let translated = '';
      let matched = false;

      for (const [key, value] of Object.entries(scamTranslations)) {
        if (line.includes(key)) {
          translated = value;
          matched = true;
          results.push({ original: line.trim(), translated });
          break;
        }
      }

      if (!matched && line.trim()) {
        if (line.includes('사랑') || line.includes('좋아')) {
          translated = '감정적 유대 형성 시도';
        } else if (line.includes('돈') || line.includes('원') || line.includes('만원')) {
          translated = '금전적 목적 탐지됨';
        } else if (line.includes('급') || line.includes('빨리') || line.includes('지금')) {
          translated = '판단력 약화 시도';
        } else if (line.includes('비밀') || line.includes('우리만')) {
          translated = '고립화 전략';
        } else if (line.includes('못') || line.includes('안돼') || line.includes('어려')) {
          translated = '회피 행동 패턴';
        } else {
          translated = '분석 중...';
        }
        results.push({ original: line.trim(), translated });
      }
    });

    setTranslations(results);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    if (value.trim()) {
      translateText(value);
    } else {
      setTranslations([]);
    }
  };

  const quickPhrases = ['사랑해', '보고 싶어', '투자 기회가 있어', '급하게 돈이 필요해', '영상통화는 좀...', '곧 갚을게'];

  const handleQuickClick = (phrase: string) => {
    setInput(prev => prev ? `${prev}\n${phrase}` : phrase);
    translateText(input ? `${input}\n${phrase}` : phrase);
  };

  const getOutput = () => {
    if (translations.length === 0) {
      return '번역 결과가 여기에 표시됩니다...';
    }
    return translations.map(t => `→ ${t.translated}`).join('\n\n');
  };

  return (
    <Card>
      <CardHeader>
        <Title>사기 번역기</Title>
        <Description>스캐머가 하는 말의 숨은 의도를 번역해드립니다.</Description>
      </CardHeader>

      <CardBody>
        <TranslatorGrid>
          <TranslatorBox $type="input">
            <BoxLabel $type="input">스캐머가 한 말</BoxLabel>
            <TextArea
              value={input}
              onChange={handleInputChange}
              placeholder='"사랑해", "투자 기회가 있어" 등을 입력하세요'
            />
          </TranslatorBox>

          <TranslatorBox $type="output">
            <BoxLabel $type="output">실제 의도</BoxLabel>
            <OutputText>{getOutput()}</OutputText>
          </TranslatorBox>
        </TranslatorGrid>

        <QuickSection>
          <QuickLabel>빠른 번역</QuickLabel>
          <QuickButtons>
            {quickPhrases.map((phrase, index) => (
              <QuickButton key={index} onClick={() => handleQuickClick(phrase)}>
                {phrase}
              </QuickButton>
            ))}
          </QuickButtons>
        </QuickSection>

        {translations.length > 0 && (
          <HistorySection>
            <HistoryTitle>번역 기록</HistoryTitle>
            <HistoryList>
              {translations.map((t, index) => (
                <HistoryItem key={index}>
                  <HistoryOriginal>"{t.original}"</HistoryOriginal>
                  <HistoryArrow>→</HistoryArrow>
                  <HistoryTranslated>{t.translated}</HistoryTranslated>
                </HistoryItem>
              ))}
            </HistoryList>
          </HistorySection>
        )}
      </CardBody>
    </Card>
  );
}
