import { ImageDropzone } from '@/shared/ui/ImageDropzone/ImageDropzone';
import { motion } from 'framer-motion';
import {
  ButtonRow,
  PrimaryButton,
  Section,
  SectionDesc,
  SectionTitle,
  SkipButton,
} from './ComprehensiveAnalyzePage.styles';
import { slideVariants } from './comprehensiveUtils';

interface StepChatScreenshotProps {
  direction: number;
  chatScreenshot: File | null;
  onFileSelect: (file: File) => void;
  onNext: () => void;
}

export default function StepChatScreenshot({
  direction,
  chatScreenshot,
  onFileSelect,
  onNext,
}: StepChatScreenshotProps) {
  return (
    <motion.div
      key="step2"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <Section>
        <SectionTitle>대화 스크린샷</SectionTitle>
        <SectionDesc>상대방과의 대화 스크린샷을 업로드하세요</SectionDesc>

        <ImageDropzone
          onFileSelect={onFileSelect}
          accept="image"
          title="대화 스크린샷을 업로드하세요"
          hint="카카오톡, 문자 등 대화 캡처 이미지"
        />


        <ButtonRow>
          <SkipButton onClick={onNext}>건너뛰기</SkipButton>
          <PrimaryButton $disabled={!chatScreenshot} disabled={!chatScreenshot} onClick={onNext}>
            다음
          </PrimaryButton>
        </ButtonRow>
      </Section>
    </motion.div>
  );
}
