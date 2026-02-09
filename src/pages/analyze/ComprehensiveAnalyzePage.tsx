import {
  type ComprehensiveResult,
  useComprehensiveAnalysis,
} from '@/features/analyze-comprehensive';
import { useScamReport, useReportGuide } from '@/features/report-scam';
import { type DetectedFace, useFaceDetect } from '@/features/search-profile';
import { AnimatePresence, motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import comprehensiveScanAnimation from '@/shared/assets/lottie/comprehensive-scan.json';

import { ChevronLeftIcon } from '@/shared/ui/icons';

import FaceSelectModal from './FaceSelectModal';
import StepChatScreenshot from './StepChatScreenshot';
import StepContactInfo from './StepContactInfo';
import StepImageUpload from './StepImageUpload';
import StepResult from './StepResult';
import { collectIdentifiers, computeScores, mapApiResultToStepData, slideVariants } from './comprehensiveUtils';

import {
  BackButton,
  ButtonRow,
  Container,
  Content,
  ErrorText,
  Header,
  HeaderInner,
  HeaderTitle,
  LoadingOverlay,
  LoadingSubtext,
  LoadingText,
  PrimaryButton,
  Section,
  SectionTitle,
  SkipButton,
} from './ComprehensiveAnalyzePage.styles';

export default function ComprehensiveAnalyzePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);

  // Step 1 state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [detectedFaces, setDetectedFaces] = useState<DetectedFace[]>([]);
  const [selectedFaceIndex, setSelectedFaceIndex] = useState<number | null>(null);
  const [showFaceModal, setShowFaceModal] = useState(false);

  // Step 2 state
  const [chatScreenshot, setChatScreenshot] = useState<File | null>(null);

  // Step 3 state
  const [contactType, setContactType] = useState<'phone' | 'account' | 'url'>('phone');
  const [contactValue, setContactValue] = useState('');

  // Step 4 state
  const [reportSuccess, setReportSuccess] = useState(false);
  const [apiResult, setApiResult] = useState<ComprehensiveResult | null>(null);

  // Hooks
  const comprehensiveAnalysis = useComprehensiveAnalysis();
  const faceDetect = useFaceDetect();
  const scamReport = useScamReport();
  const reportGuide = useReportGuide();

  const isAnalyzing = comprehensiveAnalysis.isPending;
  const previewUrl = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : null),
    [selectedFile],
  );

  // Navigation
  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentStep((prev) => prev + 1);
  }, []);

  // Step 1: file select + face detect
  const handleFileSelect = useCallback(
    (file: File) => {
      setSelectedFile(file);
      setDetectedFaces([]);
      setSelectedFaceIndex(null);

      if (file.type.startsWith('image/')) {
        faceDetect.mutate(file, {
          onSuccess: (faces) => {
            if (faces.length > 0) {
              setDetectedFaces(faces);
              setShowFaceModal(true);
            }
          },
        });
      }
    },
    [faceDetect],
  );

  // Step 4: fire comprehensive API
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally only trigger on step change
  useEffect(() => {
    if (currentStep === 4 && !apiResult && !isAnalyzing && !comprehensiveAnalysis.isError) {
      const val = contactValue.trim();
      comprehensiveAnalysis.mutate(
        {
          image: selectedFile ?? undefined,
          chatScreenshot: chatScreenshot ?? undefined,
          phone: contactType === 'phone' && val ? val : undefined,
          account: contactType === 'account' && val ? val : undefined,
          url: contactType === 'url' && val ? val : undefined,
        },
        { onSuccess: (data) => setApiResult(data) },
      );
    }
  }, [currentStep]); // eslint-disable-line react-hooks/exhaustive-deps

  // Report
  const handleReport = async () => {
    if (!apiResult) return;
    const { entries, overallScore } = computeScores(apiResult);
    const identifiers = collectIdentifiers(apiResult, contactType, contactValue);

    const getScoreByLabel = (label: string) => {
      const e = entries.find((x) => x.label === label);
      return e ? e.score : 0;
    };

    try {
      await scamReport.mutateAsync({
        overallScore,
        deepfakeScore: getScoreByLabel('AI'),
        chatScore: getScoreByLabel('대화분석'),
        fraudScore: getScoreByLabel('사기이력'),
        urlScore: getScoreByLabel('URL'),
        profileScore: getScoreByLabel('프로필'),
        reasons: [],
        identifiers: identifiers.map((i) => ({ type: i.type, value: i.value })),
        details: '',
      });
      setReportSuccess(true);
    } catch {
      // handled by mutation state
    }
  };

  const handleRequestGuide = () => {
    if (!apiResult) return;
    const { deepfakeData, chatData, fraudData, urlData } = mapApiResultToStepData(apiResult);
    reportGuide.mutate({
      analysisResults: {
        deepfake: deepfakeData ? { confidence: deepfakeData.confidence, isDeepfake: deepfakeData.isDeepfake } : undefined,
        chat: chatData ? { riskScore: chatData.riskScore } : undefined,
        fraud: fraudData ? {
          phoneStatus: fraudData.phone?.status,
          accountStatus: fraudData.account?.status,
        } : undefined,
        url: urlData ? { riskScore: urlData.riskScore, status: urlData.status } : undefined,
      },
    });
  };

  const resetAll = () => {
    setDirection(-1);
    setCurrentStep(1);
    setSelectedFile(null);
    setDetectedFaces([]);
    setSelectedFaceIndex(null);
    setShowFaceModal(false);
    setChatScreenshot(null);
    setContactType('phone');
    setContactValue('');
    setReportSuccess(false);
    setApiResult(null);
    comprehensiveAnalysis.reset();
    faceDetect.reset();
    scamReport.reset();
    reportGuide.reset();
  };

  return (
    <Container>
      <Header>
        <HeaderInner>
          <BackButton to="/">
            <ChevronLeftIcon />
          </BackButton>
          <HeaderTitle>종합 분석</HeaderTitle>
        </HeaderInner>
      </Header>

      <Content>
        <AnimatePresence mode="wait" custom={direction}>
          {currentStep === 1 && (
            <StepImageUpload
              direction={direction}
              selectedFile={selectedFile}
              selectedFaceIndex={selectedFaceIndex}
              detectedFaces={detectedFaces}
              isFaceDetecting={faceDetect.isPending}
              onFileSelect={handleFileSelect}
              onShowFaceModal={() => setShowFaceModal(true)}
              onNext={goNext}
            />
          )}

          {currentStep === 2 && (
            <StepChatScreenshot
              direction={direction}
              chatScreenshot={chatScreenshot}
              onFileSelect={(file) => setChatScreenshot(file)}
              onNext={goNext}
            />
          )}

          {currentStep === 3 && (
            <StepContactInfo
              direction={direction}
              contactType={contactType}
              contactValue={contactValue}
              onContactTypeChange={setContactType}
              onContactValueChange={setContactValue}
              onNext={goNext}
            />
          )}

          {currentStep === 4 && apiResult && (
            <StepResult
              direction={direction}
              apiResult={apiResult}
              contactType={contactType}
              contactValue={contactValue}
              reportSuccess={reportSuccess}
              isReporting={scamReport.isPending}
              reportError={scamReport.error instanceof Error ? scamReport.error : null}
              onReport={handleReport}
              onReset={resetAll}
              guideData={reportGuide.data ?? null}
              isGuideLoading={reportGuide.isPending}
              guideError={reportGuide.error instanceof Error ? reportGuide.error : null}
              onRequestGuide={handleRequestGuide}
            />
          )}

          {currentStep === 4 && !isAnalyzing && comprehensiveAnalysis.isError && (
            <motion.div
              key="step4-error"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Section>
                <SectionTitle>분석 실패</SectionTitle>
                <ErrorText>
                  {comprehensiveAnalysis.error instanceof Error
                    ? comprehensiveAnalysis.error.message
                    : '분석 중 오류가 발생했습니다'}
                </ErrorText>
                <ButtonRow>
                  <SkipButton onClick={resetAll}>처음으로</SkipButton>
                  <PrimaryButton
                    onClick={() => {
                      comprehensiveAnalysis.reset();
                      setApiResult(null);
                      setCurrentStep(3);
                      setTimeout(() => {
                        setDirection(1);
                        setCurrentStep(4);
                      }, 50);
                    }}
                  >
                    다시 시도
                  </PrimaryButton>
                </ButtonRow>
              </Section>
            </motion.div>
          )}
        </AnimatePresence>
      </Content>

      {isAnalyzing && (
        <LoadingOverlay>
          <div style={{ width: 200, height: 200 }}>
            <Lottie animationData={comprehensiveScanAnimation} loop />
          </div>
          <LoadingText>종합 분석 중...</LoadingText>
          <LoadingSubtext>모든 항목을 한번에 분석하고 있습니다</LoadingSubtext>
        </LoadingOverlay>
      )}

      {showFaceModal && detectedFaces.length > 0 && (
        <FaceSelectModal
          faces={detectedFaces}
          selectedIndex={selectedFaceIndex}
          previewUrl={previewUrl}
          onSelect={setSelectedFaceIndex}
          onConfirm={() => setShowFaceModal(false)}
          onCancel={() => {
            setSelectedFaceIndex(null);
            setShowFaceModal(false);
          }}
        />
      )}
    </Container>
  );
}
