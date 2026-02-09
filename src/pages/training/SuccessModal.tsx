import type { SessionData } from '@/entities/persona';
import { CheckIcon } from '@/shared/ui/icons';
import {
  ConfettiPiece,
  SuccessButton,
  SuccessFeedbackItem,
  SuccessFeedbackList,
  SuccessFeedbackSection,
  SuccessFeedbackTitle,
  SuccessIcon,
  SuccessModalBox,
  SuccessModalOverlay,
  SuccessScoreBox,
  SuccessScoreLabel,
  SuccessScoreValue,
  SuccessSubtitle,
  SuccessTitle,
} from './TrainingPage.styles';

const CONFETTI_COLORS = ['#20c997', '#ffc107', '#ff6b6b', '#845ef7', '#339af0'];

interface SuccessModalProps {
  successFeedback: string[];
  turnCount: number;
  session: SessionData | null;
  onComplete: () => void;
}

export default function SuccessModal({
  successFeedback,
  turnCount,
  session,
  onComplete,
}: SuccessModalProps) {
  return (
    <>
      {[...Array(20)].map((_, i) => (
        <ConfettiPiece
          key={`confetti-${CONFETTI_COLORS[i % 5]}-${i}`}
          $delay={Math.random() * 0.5}
          $left={Math.random() * 100}
          $color={CONFETTI_COLORS[i % 5]}
        />
      ))}
      <SuccessModalOverlay>
        <SuccessModalBox>
          <SuccessIcon>
            <CheckIcon size={40} color="white" strokeWidth={3} />
          </SuccessIcon>
          <SuccessTitle>완벽한 대응!</SuccessTitle>
          <SuccessSubtitle>스캐머가 포기했습니다</SuccessSubtitle>
          <SuccessScoreBox>
            <SuccessScoreValue>100</SuccessScoreValue>
            <SuccessScoreLabel>만점</SuccessScoreLabel>
          </SuccessScoreBox>
          <SuccessFeedbackSection>
            <SuccessFeedbackTitle>잘한 점</SuccessFeedbackTitle>
            <SuccessFeedbackList>
              {successFeedback.map((feedback) => (
                <SuccessFeedbackItem key={feedback}>{feedback}</SuccessFeedbackItem>
              ))}
            </SuccessFeedbackList>
          </SuccessFeedbackSection>
          <SuccessButton
            onClick={() => {
              onComplete();
            }}
          >
            결과 확인하기
          </SuccessButton>
        </SuccessModalBox>
      </SuccessModalOverlay>
    </>
  );
}
