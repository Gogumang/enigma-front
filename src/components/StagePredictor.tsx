'use client';

import { useState } from 'react';
import styled from '@emotion/styled';
import { scamPatterns, stageDescriptions, categoryNames } from '@/lib/scamPatterns';

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

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 16px;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  resize: vertical;
  background: #f7f8f9;
  transition: all 0.15s;

  &:focus {
    outline: none;
    border-color: #06c755;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(6, 199, 85, 0.1);
  }

  &::placeholder {
    color: #aaaaaa;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 16px;
  margin-top: 16px;
  background: #06c755;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #05b54d;
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const Timeline = styled.div`
  margin-top: 24px;
`;

const Stage = styled.div<{ $active: boolean; $completed: boolean }>`
  display: flex;
  gap: 16px;
  padding: 16px;
  background: ${props =>
    props.$active ? '#e6f7ee' :
    props.$completed ? '#f7f8f9' : '#ffffff'};
  border: 1px solid ${props =>
    props.$active ? '#06c755' :
    props.$completed ? '#e5e5e5' : '#e5e5e5'};
  border-radius: 12px;
  margin-bottom: 8px;
  opacity: ${props => props.$completed || props.$active ? 1 : 0.5};
  transition: all 0.2s;
`;

const StageNumber = styled.div<{ $active: boolean; $completed: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props =>
    props.$active ? '#06c755' :
    props.$completed ? '#06c755' : '#e5e5e5'};
  color: ${props =>
    props.$active || props.$completed ? '#ffffff' : '#888888'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
`;

const StageContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const StageName = styled.h4`
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 600;
  color: #111111;
`;

const StageDesc = styled.p`
  margin: 0 0 6px;
  font-size: 13px;
  color: #666666;
`;

const StageTime = styled.span`
  font-size: 12px;
  color: #888888;
  background: #f7f8f9;
  padding: 2px 8px;
  border-radius: 4px;
`;

const PredictionCard = styled.div`
  background: #111111;
  border-radius: 16px;
  padding: 24px;
  margin-top: 24px;
  color: #ffffff;
`;

const PredictionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const PredictionIcon = styled.div`
  font-size: 32px;
`;

const PredictionTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
`;

const PredictionText = styled.p`
  margin: 0 0 20px;
  font-size: 14px;
  color: #aaaaaa;
  line-height: 1.6;
`;

const CountdownBox = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
`;

const CountdownLabel = styled.div`
  font-size: 12px;
  color: #888888;
  margin-bottom: 4px;
`;

const CountdownValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #ff334b;
`;

const PatternTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 16px;
`;

const PatternTag = styled.span`
  background: rgba(6, 199, 85, 0.2);
  color: #06c755;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
`;

interface AnalysisResult {
  currentStage: number;
  detectedPatterns: Array<{
    keyword: string;
    category: string;
    stage: number;
  }>;
  prediction: {
    daysToNextStage: number;
    daysToMoneyRequest: number;
  };
}

export default function StagePredictor() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeStage = () => {
    if (!text.trim()) return;

    const detected: AnalysisResult['detectedPatterns'] = [];
    const stageScores: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    scamPatterns.forEach(pattern => {
      if (text.includes(pattern.keyword)) {
        detected.push({
          keyword: pattern.keyword,
          category: pattern.category,
          stage: pattern.stage,
        });
        stageScores[pattern.stage] += pattern.weight;
      }
    });

    let currentStage = 1;
    for (let stage = 5; stage >= 1; stage--) {
      if (stageScores[stage] > 0) {
        currentStage = stage;
        break;
      }
    }

    const daysToNextStage = currentStage < 5 ? Math.max(7, (5 - currentStage) * 7) : 0;
    const daysToMoneyRequest = currentStage < 5 ? Math.max(7, (5 - currentStage) * 10) : 0;

    setResult({
      currentStage,
      detectedPatterns: detected,
      prediction: { daysToNextStage, daysToMoneyRequest },
    });
  };

  return (
    <Card>
      <CardHeader>
        <Title>단계 예측</Title>
        <Description>대화를 분석하여 스캠 진행 단계와 금전 요구 시점을 예측합니다.</Description>
      </CardHeader>

      <CardBody>
        <TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="대화 내용을 붙여넣으세요..."
        />

        <Button onClick={analyzeStage} disabled={!text.trim()}>
          단계 분석
        </Button>

        <Timeline>
          {[1, 2, 3, 4, 5].map(stage => {
            const info = stageDescriptions[stage];
            const isActive = result?.currentStage === stage;
            const isCompleted = result ? stage < result.currentStage : false;

            return (
              <Stage key={stage} $active={isActive} $completed={isCompleted}>
                <StageNumber $active={isActive} $completed={isCompleted}>
                  {isCompleted ? '✓' : stage}
                </StageNumber>
                <StageContent>
                  <StageName>{isActive && '📍 '}{info.name}</StageName>
                  <StageDesc>{info.description}</StageDesc>
                  <StageTime>{info.daysEstimate}</StageTime>
                </StageContent>
              </Stage>
            );
          })}
        </Timeline>

        {result && result.detectedPatterns.length > 0 && (
          <PredictionCard>
            <PredictionHeader>
              <PredictionIcon>
                {result.currentStage >= 4 ? '🚨' : result.currentStage >= 3 ? '⚠️' : '👀'}
              </PredictionIcon>
              <PredictionTitle>
                현재 {result.currentStage}단계: {stageDescriptions[result.currentStage].name}
              </PredictionTitle>
            </PredictionHeader>

            <PredictionText>
              {result.currentStage >= 4
                ? '금전 요구가 임박했거나 진행 중입니다. 극도로 주의하세요!'
                : result.currentStage >= 3
                ? '신뢰 구축 완료. 곧 금전 요구 단계로 진입할 수 있습니다.'
                : '아직 초기 단계입니다. 앞으로의 대화를 주의 깊게 관찰하세요.'}
            </PredictionText>

            {result.currentStage < 5 && (
              <CountdownBox>
                <CountdownLabel>예상 금전 요구 시점</CountdownLabel>
                <CountdownValue>약 {result.prediction.daysToMoneyRequest}일 이내</CountdownValue>
              </CountdownBox>
            )}

            <PatternTags>
              {result.detectedPatterns.map((p, i) => (
                <PatternTag key={i}>
                  {categoryNames[p.category]}: {p.keyword}
                </PatternTag>
              ))}
            </PatternTags>
          </PredictionCard>
        )}
      </CardBody>
    </Card>
  );
}
