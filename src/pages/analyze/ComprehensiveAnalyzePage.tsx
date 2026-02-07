import { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { Link } from '@tanstack/react-router';
import Lottie from 'lottie-react';
import { useDeepfakeAnalysis, type DeepfakeResult } from '@/features/detect-deepfake';
import { useProfileSearch, type SearchResult } from '@/features/search-profile';
import { useChatAnalysis, useScreenshotAnalysis } from '@/features/analyze-chat';
import { useFraudCheck } from '@/features/check-fraud';
import { useUrlCheck } from '@/features/check-url';
import { useScamReport } from '@/features/report-scam';
import { ImageDropzone } from '@/shared/ui/ImageDropzone/ImageDropzone';
import type { AnalysisData, FraudCheckResult, UrlCheckResult } from '@/entities/analysis';

import safeAnimation from '@/shared/assets/lottie/safe.json';
import warningAnimation from '@/shared/assets/lottie/warning.json';
import dangerAnimation from '@/shared/assets/lottie/danger.json';
import loadingAnimation from '@/shared/assets/lottie/loading.json';

// ==================== Types ====================

interface StepResults {
  deepfake?: DeepfakeResult;
  profile?: SearchResult;
  chat?: AnalysisData;
  fraud?: { phone?: FraudCheckResult; account?: FraudCheckResult };
  url?: UrlCheckResult;
}

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
`;

// Step Indicator
const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 20px 0;
`;

const StepDot = styled.div<{ $active: boolean; $completed: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
  background: ${p => p.$completed ? '#10b981' : p.$active ? 'var(--accent-primary)' : 'var(--bg-secondary)'};
  color: ${p => (p.$completed || p.$active) ? '#fff' : 'var(--text-tertiary)'};
  border: 2px solid ${p => p.$completed ? '#10b981' : p.$active ? 'var(--accent-primary)' : 'var(--border-color)'};
`;

const StepLine = styled.div<{ $completed: boolean }>`
  width: 40px;
  height: 2px;
  background: ${p => p.$completed ? '#10b981' : 'var(--border-color)'};
  transition: background 0.3s;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-card);
  font-size: 15px;
  color: var(--text-primary);
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  transition: all 0.2s;
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
  &::placeholder { color: var(--text-tertiary); }
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

// ==================== Component ====================

export default function ComprehensiveAnalyzePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepResults, setStepResults] = useState<StepResults>({});

  // Step 1 state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isStep1Loading, setIsStep1Loading] = useState(false);
  const [step1Error, setStep1Error] = useState('');
  const [step1LoadingText, setStep1LoadingText] = useState('');

  // Step 2 state
  const [chatText, setChatText] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [isStep2Loading, setIsStep2Loading] = useState(false);
  const [step2Error, setStep2Error] = useState('');
  const [step2LoadingText, setStep2LoadingText] = useState('');

  // Step 3 state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [isStep3Loading, setIsStep3Loading] = useState(false);
  const [step3Error, setStep3Error] = useState('');
  const [step3LoadingText, setStep3LoadingText] = useState('');

  // Step 4 state
  const [reportSuccess, setReportSuccess] = useState(false);

  // Hooks
  const deepfakeAnalysis = useDeepfakeAnalysis();
  const profileSearch = useProfileSearch();
  const chatAnalysis = useChatAnalysis();
  const screenshotAnalysis = useScreenshotAnalysis();
  const fraudCheck = useFraudCheck();
  const urlCheck = useUrlCheck();
  const scamReport = useScamReport();

  // ==================== Step 1: Image/Video Analysis ====================

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setStep1Error('');
  }, []);

  const handleStep1Analyze = async () => {
    if (!selectedFile) return;
    setIsStep1Loading(true);
    setStep1Error('');
    const results: StepResults = { ...stepResults };

    try {
      // Deepfake analysis
      const isVideo = selectedFile.type.startsWith('video/');
      setStep1LoadingText('딥페이크 분석 중...');
      try {
        const deepfakeResult = await deepfakeAnalysis.mutateAsync({ file: selectedFile, isVideo });
        results.deepfake = deepfakeResult;
      } catch {
        // continue even if deepfake fails
      }

      // Profile search (images only)
      if (!isVideo) {
        setStep1LoadingText('프로필 검색 중...');
        try {
          const profileResult = await profileSearch.mutateAsync({ image: selectedFile });
          results.profile = profileResult;
        } catch {
          // continue even if profile search fails
        }
      }

      setStepResults(results);
      setCurrentStep(2);
    } catch (err) {
      setStep1Error(err instanceof Error ? err.message : '분석 중 오류가 발생했습니다');
    } finally {
      setIsStep1Loading(false);
      setStep1LoadingText('');
    }
  };

  // ==================== Step 2: Chat Analysis ====================

  const handleScreenshotSelect = useCallback((file: File) => {
    setScreenshotFile(file);
    setStep2Error('');
  }, []);

  const handleStep2Analyze = async () => {
    if (!chatText.trim() && !screenshotFile) return;
    setIsStep2Loading(true);
    setStep2Error('');
    const results: StepResults = { ...stepResults };

    try {
      if (screenshotFile) {
        setStep2LoadingText('스크린샷 분석 중...');
        const screenshotResult = await screenshotAnalysis.mutateAsync(screenshotFile);
        if (screenshotResult.analysis) {
          results.chat = screenshotResult.analysis;
        }
      } else if (chatText.trim()) {
        setStep2LoadingText('대화 내용 분석 중...');
        const messages = chatText.split('\n').filter(l => l.trim());
        const chatResult = await chatAnalysis.mutateAsync(messages);
        if (chatResult.analysis) {
          results.chat = chatResult.analysis;
        }
      }

      setStepResults(results);
      setCurrentStep(3);
    } catch (err) {
      setStep2Error(err instanceof Error ? err.message : '분석 중 오류가 발생했습니다');
    } finally {
      setIsStep2Loading(false);
      setStep2LoadingText('');
    }
  };

  // ==================== Step 3: Contact Info Check ====================

  const handleStep3Analyze = async () => {
    if (!phoneNumber.trim() && !accountNumber.trim() && !urlInput.trim()) return;
    setIsStep3Loading(true);
    setStep3Error('');
    const results: StepResults = { ...stepResults };

    try {
      const fraudResults: { phone?: FraudCheckResult; account?: FraudCheckResult } = {};

      if (phoneNumber.trim()) {
        setStep3LoadingText('전화번호 조회 중...');
        try {
          fraudResults.phone = await fraudCheck.mutateAsync({ type: 'PHONE', value: phoneNumber });
        } catch {
          // continue
        }
      }

      if (accountNumber.trim()) {
        setStep3LoadingText('계좌번호 조회 중...');
        try {
          fraudResults.account = await fraudCheck.mutateAsync({ type: 'ACCOUNT', value: accountNumber });
        } catch {
          // continue
        }
      }

      if (Object.keys(fraudResults).length > 0) {
        results.fraud = fraudResults;
      }

      if (urlInput.trim()) {
        setStep3LoadingText('URL 검사 중...');
        try {
          const urlResult = await urlCheck.mutateAsync(urlInput.trim());
          results.url = urlResult;
        } catch {
          // continue
        }
      }

      setStepResults(results);
      setCurrentStep(4);
    } catch (err) {
      setStep3Error(err instanceof Error ? err.message : '조회 중 오류가 발생했습니다');
    } finally {
      setIsStep3Loading(false);
      setStep3LoadingText('');
    }
  };

  // ==================== Step 4: Result Calculation ====================

  const computeScores = () => {
    const entries: ScoreEntry[] = [];

    // Deepfake score
    if (stepResults.deepfake) {
      const confidence = stepResults.deepfake.data.confidence * 100;
      entries.push({
        label: '딥페이크',
        score: stepResults.deepfake.data.isDeepfake ? confidence : Math.max(0, 100 - confidence),
        weight: 0.25,
      });
    }

    // Profile score
    if (stepResults.profile) {
      const profileScore = stepResults.profile.totalFound > 10
        ? Math.min(80, stepResults.profile.totalFound * 3)
        : stepResults.profile.totalFound > 0 ? 20 : 0;
      entries.push({ label: '프로필', score: profileScore, weight: 0.20 });
    }

    // Chat score
    if (stepResults.chat) {
      entries.push({ label: '대화분석', score: stepResults.chat.riskScore, weight: 0.30 });
    }

    // Fraud score
    if (stepResults.fraud) {
      const phoneDanger = stepResults.fraud.phone?.status === 'danger';
      const accountDanger = stepResults.fraud.account?.status === 'danger';
      const fraudScore = (phoneDanger || accountDanger) ? 100 : 0;
      entries.push({ label: '사기이력', score: fraudScore, weight: 0.15 });
    }

    // URL score
    if (stepResults.url) {
      const urlScore = stepResults.url.status === 'danger' ? 100 :
        stepResults.url.status === 'warning' ? 50 : 0;
      entries.push({ label: 'URL', score: urlScore, weight: 0.10 });
    }

    const overallScore = calculateOverallScore(entries);

    return { entries, overallScore };
  };

  const collectReasons = (): string[] => {
    const reasons: string[] = [];

    if (stepResults.deepfake?.data.isDeepfake) {
      reasons.push(`딥페이크 의심 (확신도 ${Math.round(stepResults.deepfake.data.confidence * 100)}%)`);
      if (stepResults.deepfake.data.analysisReasons) {
        reasons.push(...stepResults.deepfake.data.analysisReasons.slice(0, 2));
      }
    }

    if (stepResults.profile && stepResults.profile.totalFound > 10) {
      reasons.push('해당 이미지가 여러 플랫폼에서 사용되고 있습니다');
    }

    if (stepResults.chat) {
      if (stepResults.chat.riskScore >= 60) {
        reasons.push('대화 내용에서 사기 패턴이 강하게 감지되었습니다');
      }
      if (stepResults.chat.reasons?.length > 0) {
        reasons.push(...stepResults.chat.reasons.slice(0, 3));
      }
    }

    if (stepResults.fraud?.phone?.status === 'danger') {
      reasons.push(`전화번호 ${stepResults.fraud.phone.displayValue}가 사기 이력에 등록되어 있습니다`);
    }
    if (stepResults.fraud?.account?.status === 'danger') {
      reasons.push(`계좌번호가 사기 이력에 등록되어 있습니다`);
    }

    if (stepResults.url?.status === 'danger') {
      reasons.push(`URL이 위험한 사이트로 판별되었습니다`);
      if (stepResults.url.suspiciousPatterns?.length > 0) {
        reasons.push(...stepResults.url.suspiciousPatterns.slice(0, 2));
      }
    }

    if (reasons.length === 0) {
      reasons.push('현재까지 특별한 위험 요소가 발견되지 않았습니다');
    }

    return reasons;
  };

  const collectIdentifiers = (): IdentifiedInfo[] => {
    const infos: IdentifiedInfo[] = [];

    if (phoneNumber.trim()) {
      infos.push({ type: 'PHONE', value: phoneNumber.trim(), label: phoneNumber.trim() });
    }
    if (accountNumber.trim()) {
      infos.push({ type: 'ACCOUNT', value: accountNumber.trim(), label: accountNumber.trim() });
    }
    if (urlInput.trim()) {
      infos.push({ type: 'URL', value: urlInput.trim(), label: urlInput.trim() });
    }

    // SNS profiles from profile search
    if (stepResults.profile) {
      const platforms = stepResults.profile.results;
      for (const [platform, profiles] of Object.entries(platforms)) {
        for (const p of profiles) {
          if (p.username) {
            infos.push({ type: 'SNS', value: `${platform}:${p.username}`, label: `@${p.username} (${platform})` });
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

  const isLoading = isStep1Loading || isStep2Loading || isStep3Loading;
  const loadingText = step1LoadingText || step2LoadingText || step3LoadingText;

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
        {/* Step Indicator */}
        <StepIndicator>
          {[1, 2, 3, 4].map((step, i) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
              <StepDot $active={currentStep === step} $completed={currentStep > step}>
                {currentStep > step ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : step}
              </StepDot>
              {i < 3 && <StepLine $completed={currentStep > step} />}
            </div>
          ))}
        </StepIndicator>

        {/* Step 1: Image/Video Analysis */}
        {currentStep === 1 && (
          <Section>
            <SectionTitle>이미지/영상 분석</SectionTitle>
            <SectionDesc>딥페이크 여부를 확인하고 프로필을 검색합니다</SectionDesc>

            <ImageDropzone
              onFileSelect={handleFileSelect}
              accept="image+video"
              title="이미지 또는 영상을 업로드하세요"
              hint="드래그하거나 클릭하여 선택"
            />

            {step1Error && <ErrorText>{step1Error}</ErrorText>}

            <ButtonRow>
              <SkipButton onClick={() => setCurrentStep(2)}>건너뛰기</SkipButton>
              <PrimaryButton
                $disabled={!selectedFile || isStep1Loading}
                disabled={!selectedFile || isStep1Loading}
                onClick={handleStep1Analyze}
              >
                분석하기
              </PrimaryButton>
            </ButtonRow>
          </Section>
        )}

        {/* Step 2: Chat Analysis */}
        {currentStep === 2 && (
          <Section>
            <SectionTitle>대화 내용 분석</SectionTitle>
            <SectionDesc>대화 텍스트를 입력하거나 스크린샷을 업로드하세요</SectionDesc>

            <InputGroup>
              <InputLabel>대화 내용 붙여넣기</InputLabel>
              <TextArea
                value={chatText}
                onChange={e => { setChatText(e.target.value); setStep2Error(''); }}
                placeholder={'대화 내용을 붙여넣어 주세요\n\n예:\n나: 안녕하세요\n상대: 안녕, 요즘 투자에 관심 있어?\n나: 무슨 투자요?'}
              />
            </InputGroup>

            <InputGroup>
              <InputLabel>또는 대화 스크린샷 업로드</InputLabel>
              <ImageDropzone
                onFileSelect={handleScreenshotSelect}
                accept="image"
                title="대화 스크린샷"
                hint="카카오톡, 라인 등의 대화 캡쳐"
              />
            </InputGroup>

            {step2Error && <ErrorText>{step2Error}</ErrorText>}

            <ButtonRow>
              <SkipButton onClick={() => setCurrentStep(3)}>건너뛰기</SkipButton>
              <PrimaryButton
                $disabled={(!chatText.trim() && !screenshotFile) || isStep2Loading}
                disabled={(!chatText.trim() && !screenshotFile) || isStep2Loading}
                onClick={handleStep2Analyze}
              >
                분석하기
              </PrimaryButton>
            </ButtonRow>
          </Section>
        )}

        {/* Step 3: Contact Info */}
        {currentStep === 3 && (
          <Section>
            <SectionTitle>연락처 정보 확인</SectionTitle>
            <SectionDesc>전화번호, 계좌번호, URL을 확인합니다</SectionDesc>

            <InputGroup>
              <InputLabel>전화번호</InputLabel>
              <TextInput
                value={phoneNumber}
                onChange={e => { setPhoneNumber(e.target.value); setStep3Error(''); }}
                placeholder="01012345678"
                type="tel"
              />
            </InputGroup>

            <InputGroup>
              <InputLabel>계좌번호</InputLabel>
              <TextInput
                value={accountNumber}
                onChange={e => { setAccountNumber(e.target.value); setStep3Error(''); }}
                placeholder="123-456-7890123"
              />
            </InputGroup>

            <InputGroup>
              <InputLabel>의심 URL</InputLabel>
              <TextInput
                value={urlInput}
                onChange={e => { setUrlInput(e.target.value); setStep3Error(''); }}
                placeholder="https://example.com"
                type="url"
              />
            </InputGroup>

            {step3Error && <ErrorText>{step3Error}</ErrorText>}

            <ButtonRow>
              <SkipButton onClick={() => setCurrentStep(4)}>건너뛰기</SkipButton>
              <PrimaryButton
                $disabled={(!phoneNumber.trim() && !accountNumber.trim() && !urlInput.trim()) || isStep3Loading}
                disabled={(!phoneNumber.trim() && !accountNumber.trim() && !urlInput.trim()) || isStep3Loading}
                onClick={handleStep3Analyze}
              >
                조회하기
              </PrimaryButton>
            </ButtonRow>
          </Section>
        )}

        {/* Step 4: Results */}
        {currentStep === 4 && (() => {
          const { entries, overallScore } = computeScores();
          const level = getLevel(overallScore);
          const verdict = getVerdict(overallScore);
          const reasons = collectReasons();
          const identifiers = collectIdentifiers();

          return (
            <>
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

              {/* Step 1 details */}
              {stepResults.deepfake && (
                <Section>
                  <DetailTitle>
                    딥페이크 분석 결과
                    <StatusBadge $status={stepResults.deepfake.data.isDeepfake ? 'danger' : 'safe'}>
                      {stepResults.deepfake.data.isDeepfake ? '딥페이크 의심' : '정상'}
                    </StatusBadge>
                  </DetailTitle>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {stepResults.deepfake.data.message}
                  </div>
                </Section>
              )}

              {/* Step 2 details */}
              {stepResults.chat && (
                <Section>
                  <DetailTitle>
                    대화 분석 결과
                    <StatusBadge $status={stepResults.chat.riskLevel}>{stepResults.chat.summary}</StatusBadge>
                  </DetailTitle>
                  {stepResults.chat.analysis && (
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
                      {stepResults.chat.analysis}
                    </div>
                  )}
                  {stepResults.chat.detectedPatterns?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {stepResults.chat.detectedPatterns.map((p, i) => (
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
                  )}
                </Section>
              )}

              {/* Step 3 details */}
              {(stepResults.fraud || stepResults.url) && (
                <Section>
                  <DetailTitle>연락처/URL 조회 결과</DetailTitle>
                  {stepResults.fraud?.phone && (
                    <div style={{ marginBottom: '8px', fontSize: '14px' }}>
                      전화번호 ({stepResults.fraud.phone.displayValue}):
                      <StatusBadge $status={stepResults.fraud.phone.status}>
                        {stepResults.fraud.phone.status === 'danger' ? '사기 이력 있음' : '이력 없음'}
                      </StatusBadge>
                    </div>
                  )}
                  {stepResults.fraud?.account && (
                    <div style={{ marginBottom: '8px', fontSize: '14px' }}>
                      계좌번호:
                      <StatusBadge $status={stepResults.fraud.account.status}>
                        {stepResults.fraud.account.status === 'danger' ? '사기 이력 있음' : '이력 없음'}
                      </StatusBadge>
                    </div>
                  )}
                  {stepResults.url && (
                    <div style={{ marginBottom: '8px', fontSize: '14px' }}>
                      URL ({stepResults.url.domain}):
                      <StatusBadge $status={stepResults.url.status}>
                        {stepResults.url.status === 'danger' ? '위험' : stepResults.url.status === 'warning' ? '주의' : '안전'}
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

                <div style={{ marginTop: '16px' }}>
                  <SkipButton style={{ width: '100%', textAlign: 'center' }} onClick={() => {
                    setCurrentStep(1);
                    setStepResults({});
                    setSelectedFile(null);
                    setChatText('');
                    setScreenshotFile(null);
                    setPhoneNumber('');
                    setAccountNumber('');
                    setUrlInput('');
                    setReportSuccess(false);
                    setStep1Error('');
                    setStep2Error('');
                    setStep3Error('');
                  }}>
                    처음부터 다시 분석
                  </SkipButton>
                </div>
              </Section>
            </>
          );
        })()}
      </Content>

      {/* Loading Overlay */}
      {isLoading && (
        <LoadingOverlay>
          <div style={{ width: 200, height: 150 }}>
            <Lottie animationData={loadingAnimation} loop />
          </div>
          <LoadingText>분석 중...</LoadingText>
          {loadingText && <LoadingSubtext>{loadingText}</LoadingSubtext>}
        </LoadingOverlay>
      )}
    </Container>
  );
}
