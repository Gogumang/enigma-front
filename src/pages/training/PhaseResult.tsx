import { CheckIcon, ChevronLeftIcon } from '@/shared/ui/icons';
import {
  BackButton,
  FullScreenContainer,
  HeaderInner,
  HeaderTitle,
  ResultCard,
  ResultGrade,
  ResultMessage,
  ResultScreen,
  ResultStatBox,
  ResultStatLabel,
  ResultStatValue,
  ResultStats,
  ResultTitle,
  RetryButton,
  ScammerGaveUpBadge,
  ScoreCircle,
  ScoreInner,
  ScoreLabel,
  ScoreValue,
  TacticTag,
  TacticsList,
  TacticsSection,
  TacticsTitle,
  TopHeader,
} from './TrainingPage.styles';
import { getGradeText } from './trainingUtils';

interface PhaseResultProps {
  result: {
    finalScore: number;
    totalTurns: number;
    durationSeconds: number;
    tacticsEncountered: string[];
    completionReason?: string;
  };
  turnCount: number;
  onReset: () => void;
}

export default function PhaseResult({ result, turnCount, onReset }: PhaseResultProps) {
  const score = result.finalScore || 0;
  const scammerGaveUp = result.completionReason === 'scammer_gave_up';

  return (
    <FullScreenContainer>
      <TopHeader>
        <HeaderInner>
          <BackButton to="/">
            <ChevronLeftIcon />
          </BackButton>
          <HeaderTitle>훈련 결과</HeaderTitle>
        </HeaderInner>
      </TopHeader>
      <ResultScreen>
        <ResultCard>
          <ResultTitle>훈련 완료</ResultTitle>
          {scammerGaveUp && (
            <ScammerGaveUpBadge>
              <CheckIcon size={16} strokeWidth={2.5} />
              스캐머 포기
            </ScammerGaveUpBadge>
          )}
          <ScoreCircle $score={score}>
            <ScoreInner>
              <ScoreValue $score={score}>{score}</ScoreValue>
              <ScoreLabel>/ 100점</ScoreLabel>
            </ScoreInner>
          </ScoreCircle>
          <ResultGrade $score={score}>
            {scammerGaveUp ? '완벽한 승리!' : getGradeText(score)}
          </ResultGrade>
          <ResultMessage>
            {scammerGaveUp
              ? '당신의 단호한 대응에 스캐머가 포기했습니다! 실제 상황에서도 이렇게 대응하세요.'
              : score >= 80
                ? '스캠 패턴을 잘 인식하고 적절히 대응했습니다!'
                : score >= 50
                  ? '일부 위험 신호를 놓쳤습니다. 더 주의가 필요합니다.'
                  : '스캠 수법에 취약합니다. 교육이 필요합니다.'}
          </ResultMessage>
          <ResultStats>
            <ResultStatBox>
              <ResultStatValue>{result.totalTurns || turnCount}</ResultStatValue>
              <ResultStatLabel>대화 횟수</ResultStatLabel>
            </ResultStatBox>
            <ResultStatBox>
              <ResultStatValue>{Math.floor((result.durationSeconds || 0) / 60)}분</ResultStatValue>
              <ResultStatLabel>소요 시간</ResultStatLabel>
            </ResultStatBox>
            <ResultStatBox>
              <ResultStatValue>{result.tacticsEncountered?.length || 0}</ResultStatValue>
              <ResultStatLabel>감지된 전술</ResultStatLabel>
            </ResultStatBox>
          </ResultStats>
          {result.tacticsEncountered?.length > 0 && (
            <TacticsSection>
              <TacticsTitle>사용된 스캠 전술</TacticsTitle>
              <TacticsList>
                {result.tacticsEncountered.map((t: string) => (
                  <TacticTag key={t}>{t}</TacticTag>
                ))}
              </TacticsList>
            </TacticsSection>
          )}
          <RetryButton onClick={onReset}>다시 도전하기</RetryButton>
        </ResultCard>
      </ResultScreen>
    </FullScreenContainer>
  );
}
