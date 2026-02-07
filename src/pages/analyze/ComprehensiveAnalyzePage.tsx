import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { Link } from '@tanstack/react-router';
import Lottie from 'lottie-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useComprehensiveAnalysis, type ComprehensiveResult } from '@/features/analyze-comprehensive';
import { useFaceDetect, type DetectedFace } from '@/features/search-profile';
import { useScamReport } from '@/features/report-scam';
import { ImageDropzone } from '@/shared/ui/ImageDropzone/ImageDropzone';

import safeAnimation from '@/shared/assets/lottie/safe.json';
import warningAnimation from '@/shared/assets/lottie/warning.json';
import dangerAnimation from '@/shared/assets/lottie/danger.json';
import loadingAnimation from '@/shared/assets/lottie/loading.json';

// ==================== Types ====================

interface IdentifiedInfo {
  type: string;
  value: string;
  label: string;
}

// ==================== Styled Components ====================

const Container = styled.div`
  min-height: 100vh;
  background: var(--bg-secondary);
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  background: var(--bg-card);
  z-index: 100;
  border-bottom: 1px solid var(--border-color);
`;

const HeaderInner = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 8px;
`;

const BackButton = styled(Link)`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  border-radius: 12px;
  text-decoration: none;
  &:active { background: var(--bg-secondary); }
`;

const HeaderTitle = styled.h1`
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

const Content = styled.div`
  padding: 20px 16px 40px;
  max-width: 600px;
  margin: 0 auto;
  overflow: hidden;
`;

// Section
const Section = styled.section`
  background: var(--bg-card);
  border-radius: 20px;
  padding: 24px 20px;
  margin-bottom: 16px;
  border: 1px solid var(--border-color);
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px;
`;

const SectionDesc = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 20px;
`;

const InputGroup = styled.div`
  margin-bottom: 16px;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 8px;
`;

const TextInput = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-card);
  font-size: 15px;
  color: var(--text-primary);
  transition: all 0.2s;
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
  &::placeholder { color: var(--text-tertiary); }
`;

const TabRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 10px 0;
  border-radius: 10px;
  border: 1.5px solid ${p => p.$active ? 'var(--accent-primary)' : 'var(--border-color)'};
  background: ${p => p.$active ? 'rgba(16, 185, 129, 0.08)' : 'transparent'};
  color: ${p => p.$active ? 'var(--accent-primary)' : 'var(--text-secondary)'};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const PrimaryButton = styled.button<{ $disabled?: boolean }>`
  flex: 1;
  padding: 16px;
  background: ${p => p.$disabled ? 'var(--border-color)' : 'var(--accent-gradient)'};
  color: ${p => p.$disabled ? 'var(--text-tertiary)' : '#fff'};
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${p => p.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s;
  box-shadow: ${p => p.$disabled ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)'};
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }
`;

const SkipButton = styled.button`
  padding: 16px 24px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: var(--border-color); }
`;

const DangerButton = styled.button`
  flex: 1;
  padding: 16px;
  background: #f04452;
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: #dc2626; }
  &:disabled {
    background: var(--border-color);
    color: var(--text-tertiary);
    cursor: not-allowed;
  }
`;

const OutlineButton = styled.a`
  flex: 1;
  padding: 16px;
  background: transparent;
  color: var(--accent-primary);
  border: 2px solid var(--accent-primary);
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s;
  &:hover { background: rgba(16, 185, 129, 0.05); }
`;

// Loading
const LoadingOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #fff;
`;

const LoadingText = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

const LoadingSubtext = styled.div`
  font-size: 14px;
  color: rgba(255,255,255,0.7);
`;

// URL Input
const UrlInputWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-card);
  overflow: hidden;
  transition: all 0.2s;
  &:focus-within {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const UrlPrefix = styled.span`
  padding: 14px 0 14px 14px;
  color: var(--text-tertiary);
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const UrlTextInput = styled.input`
  flex: 1;
  padding: 14px 14px 14px 8px;
  border: none;
  background: transparent;
  font-size: 15px;
  font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
  color: var(--text-primary);
  &:focus { outline: none; }
  &::placeholder { color: var(--text-tertiary); font-family: inherit; }
`;

// Result styles (Step 4)
const ResultHeader = styled.div<{ $level: string }>`
  padding: 32px 24px;
  border-radius: 20px;
  background: ${p =>
    p.$level === 'safe' ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' :
    p.$level === 'warning' ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' :
    'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)'};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 16px;
`;

const LottieWrapper = styled.div`
  width: 120px;
  height: 120px;
  margin-bottom: 12px;
`;

const ResultVerdict = styled.div<{ $level: string }>`
  font-size: 24px;
  font-weight: 700;
  color: ${p =>
    p.$level === 'safe' ? '#059669' :
    p.$level === 'warning' ? '#d97706' : '#dc2626'};
  margin-bottom: 4px;
`;

const ResultScore = styled.div`
  font-size: 16px;
  color: var(--text-secondary);
`;

const ScoreBreakdown = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`;

const ScoreItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ScoreLabel = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
  width: 80px;
  flex-shrink: 0;
`;

const ScoreBar = styled.div`
  flex: 1;
  height: 8px;
  background: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
`;

const fillAnimation = keyframes`
  from { width: 0%; }
`;

const ScoreFill = styled.div<{ $score: number; $level: string }>`
  height: 100%;
  width: ${p => p.$score}%;
  background: ${p =>
    p.$level === 'safe' ? '#10b981' :
    p.$level === 'warning' ? '#f59e0b' : '#ef4444'};
  border-radius: 4px;
  animation: ${fillAnimation} 0.8s ease-out;
`;

const ScoreValue = styled.div<{ $level: string }>`
  font-size: 14px;
  font-weight: 600;
  width: 40px;
  text-align: right;
  color: ${p =>
    p.$level === 'safe' ? '#10b981' :
    p.$level === 'warning' ? '#f59e0b' : '#ef4444'};
`;

const DetailSection = styled.div`
  margin-bottom: 20px;
`;

const DetailTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 6px 0;
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.5;
  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent-primary);
    margin-top: 7px;
    flex-shrink: 0;
  }
`;

const InfoTag = styled.div<{ $type: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  margin: 4px 4px 4px 0;
  background: ${p => {
    switch (p.$type) {
      case 'PHONE': return '#eff6ff';
      case 'ACCOUNT': return '#fef3c7';
      case 'SNS': return '#f3e8ff';
      case 'URL': return '#fee2e2';
      default: return 'var(--bg-secondary)';
    }
  }};
  color: ${p => {
    switch (p.$type) {
      case 'PHONE': return '#2563eb';
      case 'ACCOUNT': return '#d97706';
      case 'SNS': return '#7c3aed';
      case 'URL': return '#dc2626';
      default: return 'var(--text-primary)';
    }
  }};
`;

const SuccessMessage = styled.div`
  padding: 16px;
  background: #d1fae5;
  border-radius: 12px;
  color: #059669;
  font-size: 15px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 16px;
`;

const ErrorText = styled.div`
  font-size: 14px;
  color: #f04452;
  margin-top: 8px;
`;

const StatusBadge = styled.span<{ $status: 'safe' | 'danger' | 'warning' | 'pending' }>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  margin-left: 8px;
  background: ${p => {
    switch (p.$status) {
      case 'safe': return '#d1fae5';
      case 'danger': return '#fee2e2';
      case 'warning': return '#fef3c7';
      default: return 'var(--bg-secondary)';
    }
  }};
  color: ${p => {
    switch (p.$status) {
      case 'safe': return '#059669';
      case 'danger': return '#dc2626';
      case 'warning': return '#d97706';
      default: return 'var(--text-tertiary)';
    }
  }};
`;

// ==================== Face Select Modal ====================

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const ModalContent = styled.div`
  background: var(--bg-card);
  border-radius: 16px;
  max-width: 420px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  padding: 20px 20px 12px;
  border-bottom: 1px solid var(--border-color);
`;

const ModalTitle = styled.h3`
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px;
`;

const ModalDesc = styled.p`
  font-size: 13px;
  color: var(--text-tertiary);
  margin: 0;
`;

const FacePreviewWrapper = styled.div`
  position: relative;
  margin: 16px 20px 0;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
`;

const FacePreviewImage = styled.img`
  width: 100%;
  display: block;
`;

const FaceBoundingBox = styled.div<{ $selected: boolean }>`
  position: absolute;
  border: 2px solid ${p => (p.$selected ? '#6366f1' : 'rgba(255, 255, 255, 0.7)')};
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-shadow: ${p => (p.$selected ? '0 0 0 2px rgba(99,102,241,0.4)' : 'none')};

  &:hover {
    border-color: #6366f1;
  }
`;

const FaceBboxLabel = styled.div<{ $selected: boolean }>`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  background: ${p => (p.$selected ? '#6366f1' : 'rgba(0,0,0,0.6)')};
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
`;

const FaceGridLabel = styled.div`
  padding: 12px 20px 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
`;

const FaceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
  padding: 10px 20px 16px;
`;

const FaceCard = styled.button<{ $selected: boolean }>`
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  border: 3px solid ${p => (p.$selected ? '#6366f1' : 'var(--border-color)')};
  background: var(--bg-secondary);
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  transition: border-color 0.2s, transform 0.15s;

  &:hover {
    transform: scale(1.04);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const FaceCheckMark = styled.div`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #6366f1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalFooter = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 20px 20px;
  border-top: 1px solid var(--border-color);
`;

const ModalCancelBtn = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const ModalConfirmBtn = styled.button<{ $disabled?: boolean }>`
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: ${p => (p.$disabled ? 'var(--bg-secondary)' : '#6366f1')};
  color: ${p => (p.$disabled ? 'var(--text-tertiary)' : '#fff')};
  font-size: 14px;
  font-weight: 600;
  cursor: ${p => (p.$disabled ? 'default' : 'pointer')};
`;

// ==================== Slide Animation ====================

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

// ==================== Helper Functions ====================

const lottieAnimations = {
  safe: safeAnimation,
  warning: warningAnimation,
  danger: dangerAnimation,
};

function getLevel(score: number): 'safe' | 'warning' | 'danger' {
  if (score < 30) return 'safe';
  if (score < 60) return 'warning';
  return 'danger';
}

function getVerdict(score: number): string {
  if (score >= 70) return '사기 위험이 매우 높습니다';
  if (score >= 50) return '사기 가능성이 있습니다';
  if (score >= 30) return '주의가 필요합니다';
  return '현재까지 안전해 보입니다';
}

interface ScoreEntry {
  label: string;
  score: number;
  weight: number;
}

function calculateOverallScore(entries: ScoreEntry[]): number {
  const active = entries.filter(e => e.score >= 0);
  if (active.length === 0) return 0;
  const totalWeight = active.reduce((sum, e) => sum + e.weight, 0);
  const weightedSum = active.reduce((sum, e) => sum + e.score * e.weight, 0);
  return Math.round(weightedSum / totalWeight);
}

// ==================== Map API result → StepResults-like shape ====================

function mapApiResultToStepData(result: ComprehensiveResult) {
  const deepfakeData = result.deepfake as Record<string, unknown> | null;
  const profileData = result.profile as Record<string, unknown> | null;
  const chatData = result.chat as Record<string, unknown> | null;
  const fraudData = result.fraud as { phone?: Record<string, unknown>; account?: Record<string, unknown> } | null;
  const urlData = result.url as Record<string, unknown> | null;

  return { deepfakeData, profileData, chatData, fraudData, urlData };
}

// ==================== Component ====================

export default function ComprehensiveAnalyzePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);

  // Step 1 state — data only
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [detectedFaces, setDetectedFaces] = useState<DetectedFace[]>([]);
  const [selectedFaceIndex, setSelectedFaceIndex] = useState<number | null>(null);
  const [showFaceModal, setShowFaceModal] = useState(false);
  const [imgNaturalSize, setImgNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const previewImgRef = useRef<HTMLImageElement>(null);

  // Step 2 state — data only
  const [contactType, setContactType] = useState<'phone' | 'account' | 'url'>('phone');
  const [contactValue, setContactValue] = useState('');

  // Step 4 state
  const [reportSuccess, setReportSuccess] = useState(false);
  const [apiResult, setApiResult] = useState<ComprehensiveResult | null>(null);

  // Hooks
  const comprehensiveAnalysis = useComprehensiveAnalysis();
  const faceDetect = useFaceDetect();
  const scamReport = useScamReport();

  const isAnalyzing = comprehensiveAnalysis.isPending;
  const previewUrl = useMemo(() => (selectedFile ? URL.createObjectURL(selectedFile) : null), [selectedFile]);

  const handlePreviewLoad = useCallback(() => {
    const img = previewImgRef.current;
    if (img) {
      setImgNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    }
  }, []);

  // Navigate forward
  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentStep(prev => prev + 1);
  }, []);

  // Navigate backward
  const goBack = useCallback(() => {
    setDirection(-1);
    setCurrentStep(prev => prev - 1);
  }, []);

  // ==================== Step 1: Image/Video Data Collection ====================

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setDetectedFaces([]);
    setSelectedFaceIndex(null);

    // 이미지인 경우 얼굴 감지 실행
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
  }, [faceDetect]);

  // ==================== Step 3: Fire comprehensive API ====================

  useEffect(() => {
    if (currentStep === 3 && !apiResult && !isAnalyzing && !comprehensiveAnalysis.isError) {
      const val = contactValue.trim();
      comprehensiveAnalysis.mutate(
        {
          image: selectedFile ?? undefined,
          phone: contactType === 'phone' && val ? val : undefined,
          account: contactType === 'account' && val ? val : undefined,
          url: contactType === 'url' && val ? val : undefined,
        },
        {
          onSuccess: (data) => {
            setApiResult(data);
          },
        },
      );
    }
  }, [currentStep]); // eslint-disable-line react-hooks/exhaustive-deps

  // ==================== Result Calculation ====================

  const computeScores = () => {
    const entries: ScoreEntry[] = [];
    if (!apiResult) return { entries, overallScore: 0 };

    const { deepfakeData, profileData, chatData, fraudData, urlData } = mapApiResultToStepData(apiResult);

    // Deepfake score
    if (deepfakeData) {
      const confidence = (deepfakeData.confidence as number) * 100;
      const isDeepfake = deepfakeData.isDeepfake as boolean;
      entries.push({
        label: '딥페이크',
        score: isDeepfake ? confidence : Math.max(0, 100 - confidence),
        weight: 0.25,
      });
    }

    // Profile score
    if (profileData) {
      const totalFound = (profileData.totalFound as number) ?? 0;
      const profileScore = totalFound > 10
        ? Math.min(80, totalFound * 3)
        : totalFound > 0 ? 20 : 0;
      entries.push({ label: '프로필', score: profileScore, weight: 0.20 });
    }

    // Chat score
    if (chatData) {
      entries.push({ label: '대화분석', score: (chatData.riskScore as number) ?? 0, weight: 0.30 });
    }

    // Fraud score
    if (fraudData) {
      const phoneDanger = (fraudData.phone?.status as string) === 'danger';
      const accountDanger = (fraudData.account?.status as string) === 'danger';
      const fraudScore = (phoneDanger || accountDanger) ? 100 : 0;
      entries.push({ label: '사기이력', score: fraudScore, weight: 0.15 });
    }

    // URL score
    if (urlData) {
      const status = urlData.status as string;
      const urlScore = status === 'danger' ? 100 : status === 'warning' ? 50 : 0;
      entries.push({ label: 'URL', score: urlScore, weight: 0.10 });
    }

    const overallScore = calculateOverallScore(entries);
    return { entries, overallScore };
  };

  const collectReasons = (): string[] => {
    const reasons: string[] = [];
    if (!apiResult) return reasons;

    const { deepfakeData, profileData, chatData, fraudData, urlData } = mapApiResultToStepData(apiResult);

    if (deepfakeData?.isDeepfake) {
      reasons.push(`딥페이크 의심 (확신도 ${Math.round((deepfakeData.confidence as number) * 100)}%)`);
      const analysisReasons = deepfakeData.analysisReasons as string[] | undefined;
      if (analysisReasons) {
        reasons.push(...analysisReasons.slice(0, 2));
      }
    }

    if (profileData && (profileData.totalFound as number) > 10) {
      reasons.push('해당 이미지가 여러 플랫폼에서 사용되고 있습니다');
    }

    if (chatData) {
      if ((chatData.riskScore as number) >= 60) {
        reasons.push('대화 내용에서 사기 패턴이 강하게 감지되었습니다');
      }
      const warningSigns = chatData.warningSigns as string[] | undefined;
      if (warningSigns && warningSigns.length > 0) {
        reasons.push(...warningSigns.slice(0, 3));
      }
    }

    if ((fraudData?.phone?.status as string) === 'danger') {
      const displayValue = (fraudData?.phone?.displayValue as string) || (contactType === 'phone' ? contactValue : '');
      reasons.push(`전화번호 ${displayValue}가 사기 이력에 등록되어 있습니다`);
    }
    if ((fraudData?.account?.status as string) === 'danger') {
      reasons.push('계좌번호가 사기 이력에 등록되어 있습니다');
    }

    if ((urlData?.status as string) === 'danger') {
      reasons.push('URL이 위험한 사이트로 판별되었습니다');
      const patterns = urlData?.suspiciousPatterns as string[] | undefined;
      if (patterns && patterns.length > 0) {
        reasons.push(...patterns.slice(0, 2));
      }
    }

    if (reasons.length === 0) {
      reasons.push('현재까지 특별한 위험 요소가 발견되지 않았습니다');
    }

    return reasons;
  };

  const collectIdentifiers = (): IdentifiedInfo[] => {
    const infos: IdentifiedInfo[] = [];
    const val = contactValue.trim();

    if (val && contactType === 'phone') {
      infos.push({ type: 'PHONE', value: val, label: val });
    }
    if (val && contactType === 'account') {
      infos.push({ type: 'ACCOUNT', value: val, label: val });
    }
    if (val && contactType === 'url') {
      infos.push({ type: 'URL', value: val, label: val });
    }

    // SNS profiles from profile search
    if (apiResult?.profile) {
      const results = (apiResult.profile as Record<string, unknown>).results as Record<string, Array<{ username?: string }>> | undefined;
      if (results) {
        for (const [platform, profiles] of Object.entries(results)) {
          for (const p of profiles) {
            if (p.username) {
              infos.push({ type: 'SNS', value: `${platform}:${p.username}`, label: `@${p.username} (${platform})` });
            }
          }
        }
      }
    }

    return infos;
  };

  const handleReport = async () => {
    const { entries, overallScore } = computeScores();
    const reasons = collectReasons();
    const identifiers = collectIdentifiers();

    const getScoreByLabel = (label: string) => {
      const e = entries.find(x => x.label === label);
      return e ? e.score : 0;
    };

    try {
      await scamReport.mutateAsync({
        overallScore,
        deepfakeScore: getScoreByLabel('딥페이크'),
        chatScore: getScoreByLabel('대화분석'),
        fraudScore: getScoreByLabel('사기이력'),
        urlScore: getScoreByLabel('URL'),
        profileScore: getScoreByLabel('프로필'),
        reasons,
        identifiers: identifiers.map(i => ({ type: i.type, value: i.value })),
        details: '',
      });
      setReportSuccess(true);
    } catch {
      // error is handled by the mutation state
    }
  };

  const resetAll = () => {
    setDirection(-1);
    setCurrentStep(1);
    setSelectedFile(null);
    setContactType('phone');
    setContactValue('');
    setReportSuccess(false);
    setApiResult(null);
    comprehensiveAnalysis.reset();
  };

  // ==================== Render ====================

  return (
    <Container>
      <Header>
        <HeaderInner>
          <BackButton to="/">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </BackButton>
          <HeaderTitle>종합 분석</HeaderTitle>
        </HeaderInner>
      </Header>

      <Content>
        <AnimatePresence mode="wait" custom={direction}>
          {/* Step 1: Image/Video — data collection only */}
          {currentStep === 1 && (
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
                <SectionDesc>딥페이크 여부를 확인하고 프로필을 검색합니다</SectionDesc>

                <ImageDropzone
                  onFileSelect={handleFileSelect}
                  accept="image+video"
                  title="이미지 또는 영상을 업로드하세요"
                  hint="드래그하거나 클릭하여 선택"
                />

                {faceDetect.isPending && (
                  <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>
                    얼굴을 감지하고 있습니다...
                  </div>
                )}

                {selectedFaceIndex !== null && detectedFaces[selectedFaceIndex] && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 12, marginTop: 8,
                  }}>
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
                      onClick={() => setShowFaceModal(true)}
                      style={{
                        padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border-color)',
                        background: 'transparent', color: 'var(--text-secondary)', fontSize: 13,
                        cursor: 'pointer', fontWeight: 500,
                      }}
                    >
                      다시 선택
                    </button>
                  </div>
                )}

                <ButtonRow>
                  <SkipButton onClick={goNext}>건너뛰기</SkipButton>
                  <PrimaryButton
                    $disabled={!selectedFile}
                    disabled={!selectedFile}
                    onClick={goNext}
                  >
                    다음
                  </PrimaryButton>
                </ButtonRow>
              </Section>
            </motion.div>
          )}

          {/* Step 2: Contact Info — data collection only */}
          {currentStep === 2 && (
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
                <SectionTitle>연락처 정보 확인</SectionTitle>
                <SectionDesc>확인할 정보 유형을 선택하고 입력하세요</SectionDesc>

                <TabRow>
                  <Tab $active={contactType === 'phone'} onClick={() => { setContactType('phone'); setContactValue(''); }}>
                    전화번호
                  </Tab>
                  <Tab $active={contactType === 'account'} onClick={() => { setContactType('account'); setContactValue(''); }}>
                    계좌번호
                  </Tab>
                  <Tab $active={contactType === 'url'} onClick={() => { setContactType('url'); setContactValue(''); }}>
                    URL
                  </Tab>
                </TabRow>

                <InputGroup>
                  {contactType === 'url' ? (
                    <UrlInputWrapper>
                      <UrlPrefix>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="2" y1="12" x2="22" y2="12" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                      </UrlPrefix>
                      <UrlTextInput
                        value={contactValue}
                        onChange={e => setContactValue(e.target.value)}
                        placeholder="example.com"
                      />
                    </UrlInputWrapper>
                  ) : (
                    <TextInput
                      value={contactValue}
                      onChange={e => setContactValue(e.target.value)}
                      placeholder={contactType === 'phone' ? '01012345678' : '123-456-7890123'}
                      type={contactType === 'phone' ? 'tel' : 'text'}
                    />
                  )}
                </InputGroup>

                <ButtonRow>
                  <SkipButton onClick={goNext}>건너뛰기</SkipButton>
                  <PrimaryButton
                    $disabled={!contactValue.trim()}
                    disabled={!contactValue.trim()}
                    onClick={goNext}
                  >
                    분석 시작
                  </PrimaryButton>
                </ButtonRow>
              </Section>
            </motion.div>
          )}

          {/* Step 3: Results */}
          {currentStep === 3 && apiResult && (() => {
            const { deepfakeData, chatData, fraudData, urlData } = mapApiResultToStepData(apiResult);
            const { entries, overallScore } = computeScores();
            const level = getLevel(overallScore);
            const verdict = getVerdict(overallScore);
            const reasons = collectReasons();
            const identifiers = collectIdentifiers();

            return (
              <motion.div
                key="step3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <ResultHeader $level={level}>
                  <LottieWrapper>
                    <Lottie animationData={lottieAnimations[level]} loop />
                  </LottieWrapper>
                  <ResultVerdict $level={level}>{verdict}</ResultVerdict>
                  <ResultScore>종합 위험도 {overallScore}%</ResultScore>
                </ResultHeader>

                {/* Score Breakdown */}
                <Section>
                  <DetailTitle>항목별 분석 점수</DetailTitle>
                  <ScoreBreakdown>
                    {entries.map(entry => {
                      const entryLevel = getLevel(entry.score);
                      return (
                        <ScoreItem key={entry.label}>
                          <ScoreLabel>{entry.label}</ScoreLabel>
                          <ScoreBar>
                            <ScoreFill $score={entry.score} $level={entryLevel} />
                          </ScoreBar>
                          <ScoreValue $level={entryLevel}>{entry.score}%</ScoreValue>
                        </ScoreItem>
                      );
                    })}
                  </ScoreBreakdown>

                  {entries.length === 0 && (
                    <div style={{ fontSize: '14px', color: 'var(--text-tertiary)', textAlign: 'center', padding: '12px 0' }}>
                      모든 단계를 건너뛰어 분석 결과가 없습니다
                    </div>
                  )}
                </Section>

                {/* Reasons */}
                <Section>
                  <DetailTitle>분석 근거</DetailTitle>
                  <DetailSection>
                    {reasons.map((reason, i) => (
                      <DetailItem key={i}>{reason}</DetailItem>
                    ))}
                  </DetailSection>
                </Section>

                {/* Deepfake details */}
                {deepfakeData && (
                  <Section>
                    <DetailTitle>
                      딥페이크 분석 결과
                      <StatusBadge $status={(deepfakeData.isDeepfake as boolean) ? 'danger' : 'safe'}>
                        {(deepfakeData.isDeepfake as boolean) ? '딥페이크 의심' : '정상'}
                      </StatusBadge>
                    </DetailTitle>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {deepfakeData.message as string}
                    </div>
                  </Section>
                )}

                {/* Chat details */}
                {chatData && (
                  <Section>
                    <DetailTitle>
                      대화 분석 결과
                      <StatusBadge $status={
                        (chatData.riskScore as number) >= 60 ? 'danger' :
                        (chatData.riskScore as number) >= 30 ? 'warning' : 'safe'
                      }>
                        위험도 {chatData.riskScore as number}점
                      </StatusBadge>
                    </DetailTitle>
                    {typeof chatData.aiAnalysis === 'string' && chatData.aiAnalysis && (
                      <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
                        {chatData.aiAnalysis}
                      </div>
                    )}
                    {(chatData.detectedPatterns as Array<{ pattern: string }> | undefined)?.length ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {(chatData.detectedPatterns as Array<{ pattern: string }>).map((p, i) => (
                          <span key={i} style={{
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            background: '#fef3c7',
                            color: '#92400e',
                          }}>
                            {p.pattern}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </Section>
                )}

                {/* Fraud / URL details */}
                {(fraudData || urlData) && (
                  <Section>
                    <DetailTitle>연락처/URL 조회 결과</DetailTitle>
                    {fraudData?.phone && (
                      <div style={{ marginBottom: '8px', fontSize: '14px' }}>
                        전화번호 ({(fraudData.phone.displayValue as string) || contactValue}):
                        <StatusBadge $status={(fraudData.phone.status as string) === 'danger' ? 'danger' : 'safe'}>
                          {(fraudData.phone.status as string) === 'danger' ? '사기 이력 있음' : '이력 없음'}
                        </StatusBadge>
                      </div>
                    )}
                    {fraudData?.account && (
                      <div style={{ marginBottom: '8px', fontSize: '14px' }}>
                        계좌번호:
                        <StatusBadge $status={(fraudData.account.status as string) === 'danger' ? 'danger' : 'safe'}>
                          {(fraudData.account.status as string) === 'danger' ? '사기 이력 있음' : '이력 없음'}
                        </StatusBadge>
                      </div>
                    )}
                    {urlData && (
                      <div style={{ marginBottom: '8px', fontSize: '14px' }}>
                        URL ({urlData.domain as string}):
                        <StatusBadge $status={
                          (urlData.status as string) === 'danger' ? 'danger' :
                          (urlData.status as string) === 'warning' ? 'warning' : 'safe'
                        }>
                          {(urlData.status as string) === 'danger' ? '위험' : (urlData.status as string) === 'warning' ? '주의' : '안전'}
                        </StatusBadge>
                      </div>
                    )}
                  </Section>
                )}

                {/* Identified Info */}
                {identifiers.length > 0 && (
                  <Section>
                    <DetailTitle>특정된 정보</DetailTitle>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {identifiers.map((info, i) => (
                        <InfoTag key={i} $type={info.type}>
                          {info.type === 'PHONE' && '📞'}
                          {info.type === 'ACCOUNT' && '🏦'}
                          {info.type === 'SNS' && '👤'}
                          {info.type === 'URL' && '🔗'}
                          {' '}{info.label}
                        </InfoTag>
                      ))}
                    </div>
                  </Section>
                )}

                {/* Actions */}
                <Section>
                  {contactValue.trim() && (
                    <>
                      <DetailTitle>신고 및 조치</DetailTitle>

                      {reportSuccess && (
                        <SuccessMessage>
                          신고가 성공적으로 저장되었습니다
                        </SuccessMessage>
                      )}

                      {scamReport.error && (
                        <ErrorText style={{ marginBottom: '12px' }}>
                          신고 저장 실패: {scamReport.error instanceof Error ? scamReport.error.message : '오류 발생'}
                        </ErrorText>
                      )}

                      <ButtonRow>
                        <OutlineButton
                          href="https://ecrm.police.go.kr/minwon/main"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          경찰청 신고
                        </OutlineButton>
                        <DangerButton
                          onClick={handleReport}
                          disabled={reportSuccess || scamReport.isPending}
                        >
                          {scamReport.isPending ? '저장 중...' : reportSuccess ? '신고 완료' : '신고 저장'}
                        </DangerButton>
                      </ButtonRow>
                    </>
                  )}

                  <div style={{ marginTop: contactValue.trim() ? '16px' : '0' }}>
                    <SkipButton style={{ width: '100%', textAlign: 'center' }} onClick={resetAll}>
                      처음부터 다시 분석
                    </SkipButton>
                  </div>
                </Section>
              </motion.div>
            );
          })()}

          {/* Step 3 — API error state */}
          {currentStep === 3 && !isAnalyzing && comprehensiveAnalysis.isError && (
            <motion.div
              key="step3-error"
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
                  <PrimaryButton onClick={() => {
                    comprehensiveAnalysis.reset();
                    setApiResult(null);
                    // re-trigger by re-entering step 3
                    setCurrentStep(2);
                    setTimeout(() => {
                      setDirection(1);
                      setCurrentStep(3);
                    }, 50);
                  }}>
                    다시 시도
                  </PrimaryButton>
                </ButtonRow>
              </Section>
            </motion.div>
          )}
        </AnimatePresence>
      </Content>

      {/* Loading Overlay */}
      {isAnalyzing && (
        <LoadingOverlay>
          <div style={{ width: 200, height: 200 }}>
            <Lottie animationData={loadingAnimation} loop />
          </div>
          <LoadingText>종합 분석 중...</LoadingText>
          <LoadingSubtext>모든 항목을 한번에 분석하고 있습니다</LoadingSubtext>
        </LoadingOverlay>
      )}

      {/* Face Select Modal */}
      {showFaceModal && detectedFaces.length > 0 && (
        <ModalOverlay onClick={() => setShowFaceModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>검색할 얼굴을 선택하세요</ModalTitle>
              <ModalDesc>
                {detectedFaces.length}개의 얼굴이 감지되었습니다
              </ModalDesc>
            </ModalHeader>

            {/* 원본 이미지 + 얼굴 바운딩 박스 */}
            {previewUrl && (
              <FacePreviewWrapper>
                <FacePreviewImage
                  ref={previewImgRef}
                  src={previewUrl}
                  alt="업로드 이미지"
                  onLoad={handlePreviewLoad}
                />
                {imgNaturalSize && detectedFaces.map((face) => {
                  const { x, y, w, h } = face.facialArea;
                  const pctLeft = (x / imgNaturalSize.w) * 100;
                  const pctTop = (y / imgNaturalSize.h) * 100;
                  const pctW = (w / imgNaturalSize.w) * 100;
                  const pctH = (h / imgNaturalSize.h) * 100;
                  const isSelected = selectedFaceIndex === face.index;

                  return (
                    <FaceBoundingBox
                      key={face.index}
                      $selected={isSelected}
                      onClick={() => setSelectedFaceIndex(face.index)}
                      style={{
                        left: `${pctLeft}%`,
                        top: `${pctTop}%`,
                        width: `${pctW}%`,
                        height: `${pctH}%`,
                      }}
                    >
                      <FaceBboxLabel $selected={isSelected}>
                        {face.index + 1}
                      </FaceBboxLabel>
                    </FaceBoundingBox>
                  );
                })}
              </FacePreviewWrapper>
            )}

            {/* 크롭된 얼굴 그리드 */}
            <FaceGridLabel>감지된 얼굴</FaceGridLabel>
            <FaceGrid>
              {detectedFaces.map((face) => (
                <FaceCard
                  key={face.index}
                  $selected={selectedFaceIndex === face.index}
                  onClick={() => setSelectedFaceIndex(face.index)}
                >
                  <img
                    src={`data:image/jpeg;base64,${face.imageBase64}`}
                    alt={`얼굴 ${face.index + 1}`}
                  />
                  {selectedFaceIndex === face.index && (
                    <FaceCheckMark>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </FaceCheckMark>
                  )}
                </FaceCard>
              ))}
            </FaceGrid>

            <ModalFooter>
              <ModalCancelBtn onClick={() => {
                setSelectedFaceIndex(null);
                setShowFaceModal(false);
              }}>
                선택 안 함
              </ModalCancelBtn>
              <ModalConfirmBtn
                $disabled={selectedFaceIndex === null}
                disabled={selectedFaceIndex === null}
                onClick={() => setShowFaceModal(false)}
              >
                선택 완료
              </ModalConfirmBtn>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}
