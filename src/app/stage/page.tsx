'use client';

import { useState } from 'react';
import styled from '@emotion/styled';
import PageLayout from '@/components/PageLayout';
import { scamPatterns, stageDescriptions } from '@/lib/scamPatterns';

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 16px;
  border: 1px solid #e5e8eb;
  border-radius: 12px;
  background: #fff;
  font-size: 16px;
  font-family: inherit;
  line-height: 1.6;
  resize: none;
  color: #191f28;
  margin-bottom: 16px;

  &:focus {
    outline: none;
    border-color: #7048e8;
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 16px;
  background: #7048e8;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  &:active {
    background: #5f3dc4;
  }

  &:disabled {
    background: #e5e8eb;
    color: #adb5bd;
  }
`;

const Timeline = styled.div`
  margin-top: 24px;
`;

const Stage = styled.div<{ $active: boolean; $done: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: ${props => props.$active ? '#f3f0ff' : '#fff'};
  border-radius: 12px;
  margin-bottom: 8px;
  opacity: ${props => props.$done || props.$active ? 1 : 0.4};
`;

const StageNum = styled.div<{ $active: boolean; $done: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${props =>
    props.$done ? '#20c997' :
    props.$active ? '#7048e8' : '#e5e8eb'};
  color: ${props => props.$done || props.$active ? '#fff' : '#8b95a1'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
`;

const StageName = styled.span<{ $active: boolean }>`
  font-size: 15px;
  font-weight: ${props => props.$active ? 600 : 500};
  color: ${props => props.$active ? '#7048e8' : '#191f28'};
`;

const ResultCard = styled.div`
  margin-top: 20px;
  padding: 24px;
  background: #fff8e6;
  border-radius: 16px;
  text-align: center;
`;

const ResultTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #191f28;
  margin-bottom: 8px;
`;

const ResultDays = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #ff9500;
`;

const ResultLabel = styled.div`
  font-size: 14px;
  color: #8b95a1;
  margin-top: 4px;
`;

interface Result {
  stage: number;
  days: number;
}

export default function StagePage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<Result | null>(null);

  const analyze = () => {
    const scores: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    scamPatterns.forEach(p => {
      if (text.includes(p.keyword)) {
        scores[p.stage] += p.weight;
      }
    });

    let stage = 1;
    for (let s = 5; s >= 1; s--) {
      if (scores[s] > 0) { stage = s; break; }
    }

    setResult({
      stage,
      days: Math.max(7, (5 - stage) * 10),
    });
  };

  return (
    <PageLayout title="단계 예측">
      <TextArea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="대화 내용을 붙여넣으세요"
      />
      <Button onClick={analyze} disabled={!text.trim()}>
        분석하기
      </Button>

      <Timeline>
        {[1, 2, 3, 4, 5].map(s => {
          const active = result?.stage === s;
          const done = result ? s < result.stage : false;
          return (
            <Stage key={s} $active={active} $done={done}>
              <StageNum $active={active} $done={done}>
                {done ? '✓' : s}
              </StageNum>
              <StageName $active={active}>{stageDescriptions[s].name}</StageName>
            </Stage>
          );
        })}
      </Timeline>

      {result && result.stage < 5 && (
        <ResultCard>
          <ResultTitle>현재 {result.stage}단계</ResultTitle>
          <ResultDays>약 {result.days}일</ResultDays>
          <ResultLabel>예상 금전 요구 시점</ResultLabel>
        </ResultCard>
      )}
    </PageLayout>
  );
}
