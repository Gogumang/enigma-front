import type { DetectedFace } from '@/features/search-profile';
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

interface StepImageUploadProps {
  direction: number;
  selectedFile: File | null;
  selectedFaceIndex: number | null;
  detectedFaces: DetectedFace[];
  isFaceDetecting: boolean;
  onFileSelect: (file: File) => void;
  onShowFaceModal: () => void;
  onNext: () => void;
}

export default function StepImageUpload({
  direction,
  selectedFile,
  selectedFaceIndex,
  detectedFaces,
  isFaceDetecting,
  onFileSelect,
  onShowFaceModal,
  onNext,
}: StepImageUploadProps) {
  return (
    <motion.div
      key="step1"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <Section>
        <SectionTitle>이미지/영상 분석</SectionTitle>
        <SectionDesc>AI 생성 여부를 확인하고 이미지를 검색합니다</SectionDesc>

        <ImageDropzone
          onFileSelect={onFileSelect}
          accept="image+video"
          title="이미지 또는 영상을 업로드하세요"
          hint="드래그하거나 클릭하여 선택"
        />

        {isFaceDetecting && (
          <div
            style={{
              padding: '12px',
              textAlign: 'center',
              color: 'var(--text-tertiary)',
              fontSize: 13,
            }}
          >
            얼굴을 감지하고 있습니다...
          </div>
        )}

        {selectedFaceIndex !== null && detectedFaces[selectedFaceIndex] && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              background: 'var(--bg-secondary)',
              borderRadius: 12,
              marginTop: 8,
            }}
          >
            <img
              src={`data:image/jpeg;base64,${detectedFaces[selectedFaceIndex].imageBase64}`}
              alt="선택된 얼굴"
              style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                얼굴 #{selectedFaceIndex + 1} 선택됨
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
                이 얼굴로 프로필을 검색합니다
              </div>
            </div>
            <button
              type="button"
              onClick={onShowFaceModal}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: '1px solid var(--border-color)',
                background: 'transparent',
                color: 'var(--text-secondary)',
                fontSize: 13,
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              다시 선택
            </button>
          </div>
        )}

        <ButtonRow>
          <SkipButton onClick={onNext}>건너뛰기</SkipButton>
          <PrimaryButton $disabled={!selectedFile} disabled={!selectedFile} onClick={onNext}>
            다음
          </PrimaryButton>
        </ButtonRow>
      </Section>
    </motion.div>
  );
}
