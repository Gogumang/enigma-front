import { useState, useRef } from 'react';
import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import Lottie from 'lottie-react';
import { useChatAnalysis, useScreenshotAnalysis } from '@/features/analyze-chat';
import { useProfileSearch } from '@/features/search-profile';

import safeAnimation from '@/shared/assets/lottie/safe.json';
import warningAnimation from '@/shared/assets/lottie/warning.json';
import dangerAnimation from '@/shared/assets/lottie/danger.json';

interface ChatMessage {
  id: string;
  role: 'me' | 'other';
  content: string;
}

interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
  type: 'chat' | 'profile' | 'other';
}

interface AnalysisResult {
  chat?: {
    score: number;
    level: 'safe' | 'warning' | 'danger';
    summary: string;
    reasons: string[];
  };
  profile?: {
    score: number;
    level: 'safe' | 'warning' | 'danger';
    scammerMatches: number;
    totalFound: number;
  };
  overall: {
    score: number;
    level: 'safe' | 'warning' | 'danger';
    verdict: string;
    details: string[];
  };
}

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

  &:active {
    background: var(--bg-secondary);
  }
`;

const HeaderTitle = styled.h1`
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

const Content = styled.div`
  padding: 20px 16px;
  max-width: 600px;
  margin: 0 auto;
`;

const Section = styled.section`
  background: var(--bg-card);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid var(--border-color);
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const SectionIcon = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${props => props.$color}15;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$color};
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

const SectionStatus = styled.span<{ $completed: boolean }>`
  margin-left: auto;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 12px;
  background: ${props => props.$completed ? '#10b98115' : 'var(--bg-secondary)'};
  color: ${props => props.$completed ? '#10b981' : 'var(--text-tertiary)'};
`;

const UploadArea = styled.div<{ $hasContent: boolean }>`
  border: 2px dashed ${props => props.$hasContent ? 'var(--accent-primary)' : 'var(--border-color)'};
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.$hasContent ? 'rgba(16, 185, 129, 0.05)' : 'transparent'};

  &:hover {
    border-color: var(--accent-primary);
    background: rgba(16, 185, 129, 0.05);
  }
`;

const UploadIcon = styled.div`
  font-size: 32px;
  margin-bottom: 8px;
`;

const UploadText = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
`;

const UploadedPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 12px;
  margin-top: 12px;
`;

const PreviewImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
`;

const PreviewInfo = styled.div`
  flex: 1;
`;

const PreviewName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
`;

const PreviewMeta = styled.div`
  font-size: 12px;
  color: var(--text-tertiary);
`;

const RemoveButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: var(--bg-card);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #fee2e2;
    color: #ef4444;
  }
`;

const ChatPreview = styled.div`
  max-height: 200px;
  overflow-y: auto;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 12px;
  margin-top: 12px;
`;

const ChatBubble = styled.div<{ $isMe: boolean }>`
  max-width: 80%;
  padding: 8px 12px;
  border-radius: ${props => props.$isMe ? '12px 12px 4px 12px' : '12px 12px 12px 4px'};
  background: ${props => props.$isMe ? 'var(--accent-primary)' : 'var(--bg-card)'};
  color: ${props => props.$isMe ? '#fff' : 'var(--text-primary)'};
  font-size: 13px;
  margin-bottom: 6px;
  margin-left: ${props => props.$isMe ? 'auto' : '0'};
  margin-right: ${props => props.$isMe ? '0' : 'auto'};
`;

const HiddenInput = styled.input`
  display: none;
`;

const AnalyzeButton = styled.button<{ $disabled: boolean }>`
  width: 100%;
  padding: 16px;
  background: ${props => props.$disabled ? 'var(--border-color)' : 'var(--accent-gradient)'};
  color: ${props => props.$disabled ? 'var(--text-tertiary)' : '#fff'};
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  margin-top: 8px;
  box-shadow: ${props => props.$disabled ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)'};
  transition: all 0.3s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

const LoadingSubtext = styled.div`
  font-size: 14px;
  color: rgba(255,255,255,0.7);
  margin-top: 8px;
`;

// Result Modal
const ResultOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ResultCard = styled.div`
  width: 100%;
  max-width: 400px;
  background: var(--bg-card);
  border-radius: 24px;
  overflow: hidden;
  max-height: 90vh;
  overflow-y: auto;
`;

const ResultHeader = styled.div<{ $level: string }>`
  padding: 32px 24px;
  background: ${props =>
    props.$level === 'safe' ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' :
    props.$level === 'warning' ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' :
    'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)'};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const LottieWrapper = styled.div`
  width: 120px;
  height: 120px;
  margin-bottom: 12px;
`;

const ResultVerdict = styled.div<{ $level: string }>`
  font-size: 28px;
  font-weight: 700;
  color: ${props =>
    props.$level === 'safe' ? '#059669' :
    props.$level === 'warning' ? '#d97706' : '#dc2626'};
  margin-bottom: 4px;
`;

const ResultScore = styled.div`
  font-size: 16px;
  color: var(--text-secondary);
`;

const ResultBody = styled.div`
  padding: 24px;
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
`;

const ScoreBar = styled.div`
  flex: 1;
  height: 8px;
  background: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
`;

const ScoreFill = styled.div<{ $score: number; $level: string }>`
  height: 100%;
  width: ${props => props.$score}%;
  background: ${props =>
    props.$level === 'safe' ? '#10b981' :
    props.$level === 'warning' ? '#f59e0b' : '#ef4444'};
  border-radius: 4px;
  transition: width 0.5s ease-out;
`;

const ScoreValue = styled.div<{ $level: string }>`
  font-size: 14px;
  font-weight: 600;
  width: 40px;
  text-align: right;
  color: ${props =>
    props.$level === 'safe' ? '#10b981' :
    props.$level === 'warning' ? '#f59e0b' : '#ef4444'};
`;

const DetailSection = styled.div`
  margin-bottom: 20px;
`;

const DetailTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 12px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 0;
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.5;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent-primary);
    margin-top: 6px;
    flex-shrink: 0;
  }
`;

const CloseButton = styled.button`
  width: 100%;
  padding: 16px;
  background: var(--accent-gradient);
  color: #fff;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
`;

const InputGroup = styled.div`
  margin-bottom: 16px;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
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

  &::placeholder {
    color: var(--text-tertiary);
  }
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
  min-height: 100px;
  font-family: inherit;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  &::placeholder {
    color: var(--text-tertiary);
  }
`;

const PlatformSelect = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const PlatformButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border: 1px solid ${props => props.$active ? 'var(--accent-primary)' : 'var(--border-color)'};
  border-radius: 20px;
  background: ${props => props.$active ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-card)'};
  color: ${props => props.$active ? 'var(--accent-primary)' : 'var(--text-secondary)'};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--accent-primary);
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 12px;
`;

const ImageGridItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg-secondary);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ImageRemoveBtn = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(0,0,0,0.6);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(239, 68, 68, 0.9);
  }
`;

const AddImageBtn = styled.button`
  aspect-ratio: 1;
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  background: transparent;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--text-tertiary);
  font-size: 12px;
  transition: all 0.2s;

  &:hover {
    border-color: var(--accent-primary);
    color: var(--accent-primary);
  }
`;

const PLATFORMS = [
  { id: 'kakao', name: '카카오톡' },
  { id: 'instagram', name: '인스타그램' },
  { id: 'facebook', name: '페이스북' },
  { id: 'telegram', name: '텔레그램' },
  { id: 'tinder', name: '틴더' },
  { id: 'line', name: '라인' },
  { id: 'other', name: '기타' },
];

const lottieAnimations = {
  safe: safeAnimation,
  warning: warningAnimation,
  danger: dangerAnimation,
};

export default function ComprehensiveAnalyzePage() {
  // 기본 정보
  const [targetName, setTargetName] = useState('');
  const [platform, setPlatform] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  // 이미지 업로드
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // 분석 상태
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const chatAnalysis = useChatAnalysis();
  const screenshotAnalysis = useScreenshotAnalysis();
  const profileSearch = useProfileSearch();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;

      const newImage: UploadedImage = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        type: 'other',
      };

      setUploadedImages(prev => [...prev, newImage]);

      // 첫 번째 이미지는 대화 스크린샷으로 추출 시도
      if (uploadedImages.length === 0) {
        try {
          const result = await screenshotAnalysis.mutateAsync(file);
          if (result.analysis?.parsedMessages && result.analysis.parsedMessages.length > 0) {
            const newMessages: ChatMessage[] = result.analysis.parsedMessages.map((pm, index) => ({
              id: `${Date.now()}-${index}`,
              role: pm.role === 'receiver' ? 'me' : 'other',
              content: pm.content,
            }));
            setChatMessages(prev => [...prev, ...newMessages]);
            setUploadedImages(prev =>
              prev.map(img => img.id === newImage.id ? { ...img, type: 'chat' as const } : img)
            );
          }
        } catch {
          // 추출 실패 무시
        }
      }
    }

    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const removeImage = (id: string) => {
    setUploadedImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img) {
        URL.revokeObjectURL(img.previewUrl);
      }
      return prev.filter(i => i.id !== id);
    });
  };

  const getLevel = (score: number): 'safe' | 'warning' | 'danger' => {
    if (score < 30) return 'safe';
    if (score < 60) return 'warning';
    return 'danger';
  };

  const handleAnalyze = async () => {
    if (uploadedImages.length === 0 && chatMessages.length === 0 && !additionalInfo.trim()) {
      alert('분석할 자료를 업로드하거나 정보를 입력해주세요');
      return;
    }

    setIsLoading(true);
    const analysisResults: Partial<AnalysisResult> = {};

    try {
      // 1. 대화 분석
      if (chatMessages.length > 0 || additionalInfo.trim()) {
        setLoadingStep('대화 내용 분석 중...');

        const allMessages = [
          ...chatMessages.map(m => `${m.role === 'me' ? '나' : '상대'}: ${m.content}`),
        ];

        // 추가 정보가 있으면 대화에 포함
        if (additionalInfo.trim()) {
          allMessages.push(`[추가 정보] ${additionalInfo}`);
        }

        if (allMessages.length > 0) {
          const chatResult = await chatAnalysis.mutateAsync(allMessages);
          if (chatResult.analysis) {
            analysisResults.chat = {
              score: chatResult.analysis.riskScore,
              level: chatResult.analysis.riskLevel as 'safe' | 'warning' | 'danger',
              summary: chatResult.analysis.analysis || '',
              reasons: chatResult.analysis.reasons || [],
            };
          }
        }
      }

      // 2. 프로필/이미지 검색
      const profileImages = uploadedImages.filter(img => img.type !== 'chat');
      if (profileImages.length > 0) {
        setLoadingStep('이미지 검색 중...');
        try {
          // 첫 번째 이미지로 검색
          const profileResult = await profileSearch.mutateAsync({ image: profileImages[0].file });
          let profileScore = 0;

          if (profileResult.totalFound > 10) {
            profileScore = Math.min(40, profileResult.totalFound * 2);
          }

          analysisResults.profile = {
            score: profileScore,
            level: getLevel(profileScore),
            scammerMatches: 0,
            totalFound: profileResult.totalFound,
          };
        } catch {
          // 프로필 검색 실패시 무시
        }
      }

      // 3. 종합 점수 계산
      setLoadingStep('종합 분석 중...');

      const scores: number[] = [];
      const details: string[] = [];

      // 대상 정보 추가
      if (targetName) {
        details.push(`분석 대상: ${targetName}${platform ? ` (${PLATFORMS.find(p => p.id === platform)?.name})` : ''}`);
      }

      if (analysisResults.chat) {
        scores.push(analysisResults.chat.score);
        if (analysisResults.chat.score >= 60) {
          details.push('대화 내용에서 사기 패턴이 강하게 감지되었습니다');
        } else if (analysisResults.chat.score >= 30) {
          details.push('대화 내용에서 일부 주의가 필요한 패턴이 발견되었습니다');
        } else {
          details.push('대화 내용에서 특이사항이 발견되지 않았습니다');
        }
        if (analysisResults.chat.reasons.length > 0) {
          details.push(...analysisResults.chat.reasons.slice(0, 2));
        }
      }

      if (analysisResults.profile) {
        scores.push(analysisResults.profile.score);
        if (analysisResults.profile.scammerMatches > 0) {
          details.push(`사기꾼 데이터베이스에서 ${analysisResults.profile.scammerMatches}건의 일치 항목이 발견되었습니다`);
        }
        if (analysisResults.profile.totalFound > 10) {
          details.push('해당 이미지가 여러 플랫폼에서 사용되고 있습니다');
        }
      }

      const overallScore = scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

      let verdict = '';
      if (overallScore >= 70) {
        verdict = '사기 위험이 매우 높습니다';
      } else if (overallScore >= 50) {
        verdict = '사기 가능성이 있습니다';
      } else if (overallScore >= 30) {
        verdict = '주의가 필요합니다';
      } else {
        verdict = '현재까지 안전해 보입니다';
      }

      if (details.length === 0) {
        details.push('추가 자료를 업로드하면 더 정확한 분석이 가능합니다');
      }

      setResult({
        ...analysisResults,
        overall: {
          score: overallScore,
          level: getLevel(overallScore),
          verdict,
          details,
        },
      } as AnalysisResult);

    } catch (err) {
      alert('분석 중 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const canAnalyze = uploadedImages.length > 0 || chatMessages.length > 0 || additionalInfo.trim();

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
        {/* 기본 정보 섹션 */}
        <Section>
          <SectionHeader>
            <SectionIcon $color="#6366f1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </SectionIcon>
            <SectionTitle>상대방 정보</SectionTitle>
            <SectionStatus $completed={!!targetName}>
              {targetName ? '입력 완료' : '선택사항'}
            </SectionStatus>
          </SectionHeader>

          <InputGroup>
            <InputLabel>이름 또는 닉네임</InputLabel>
            <TextInput
              value={targetName}
              onChange={e => setTargetName(e.target.value)}
              placeholder="예: John, 제임스"
            />
          </InputGroup>

          <InputGroup>
            <InputLabel>연락한 플랫폼</InputLabel>
            <PlatformSelect>
              {PLATFORMS.map(p => (
                <PlatformButton
                  key={p.id}
                  $active={platform === p.id}
                  onClick={() => setPlatform(platform === p.id ? '' : p.id)}
                >
                  {p.name}
                </PlatformButton>
              ))}
            </PlatformSelect>
          </InputGroup>
        </Section>

        {/* 이미지 업로드 섹션 */}
        <Section>
          <SectionHeader>
            <SectionIcon $color="#3182f6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </SectionIcon>
            <SectionTitle>스크린샷 / 이미지</SectionTitle>
            <SectionStatus $completed={uploadedImages.length > 0}>
              {uploadedImages.length > 0 ? `${uploadedImages.length}장` : '선택사항'}
            </SectionStatus>
          </SectionHeader>

          <HiddenInput
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />

          <ImageGrid>
            {uploadedImages.map(img => (
              <ImageGridItem key={img.id}>
                <img src={img.previewUrl} alt="" />
                <ImageRemoveBtn onClick={() => removeImage(img.id)}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </ImageRemoveBtn>
              </ImageGridItem>
            ))}
            <AddImageBtn onClick={() => imageInputRef.current?.click()}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              추가
            </AddImageBtn>
          </ImageGrid>

          {chatMessages.length > 0 && (
            <ChatPreview>
              {chatMessages.slice(0, 6).map(msg => (
                <ChatBubble key={msg.id} $isMe={msg.role === 'me'}>
                  {msg.content}
                </ChatBubble>
              ))}
              {chatMessages.length > 6 && (
                <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '8px' }}>
                  +{chatMessages.length - 6}개 메시지 추출됨
                </div>
              )}
            </ChatPreview>
          )}
        </Section>

        {/* 추가 정보 섹션 */}
        <Section>
          <SectionHeader>
            <SectionIcon $color="#f59e0b">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </SectionIcon>
            <SectionTitle>추가 정보</SectionTitle>
            <SectionStatus $completed={!!additionalInfo.trim()}>
              {additionalInfo.trim() ? '입력 완료' : '선택사항'}
            </SectionStatus>
          </SectionHeader>

          <TextArea
            value={additionalInfo}
            onChange={e => setAdditionalInfo(e.target.value)}
            placeholder="의심스러운 행동, 요청 내용, 특이사항 등을 자유롭게 적어주세요.&#10;&#10;예:&#10;- 만난지 일주일만에 사랑한다고 함&#10;- 투자를 권유함&#10;- 돈을 빌려달라고 함"
          />
        </Section>

        {/* 분석 버튼 */}
        <AnalyzeButton
          $disabled={!canAnalyze}
          onClick={handleAnalyze}
          disabled={!canAnalyze}
        >
          종합 분석 시작
        </AnalyzeButton>
      </Content>

      {/* 로딩 */}
      {isLoading && (
        <LoadingOverlay>
          <Spinner />
          <LoadingText>분석 중...</LoadingText>
          <LoadingSubtext>{loadingStep}</LoadingSubtext>
        </LoadingOverlay>
      )}

      {/* 결과 모달 */}
      {result && (
        <ResultOverlay onClick={() => setResult(null)}>
          <ResultCard onClick={e => e.stopPropagation()}>
            <ResultHeader $level={result.overall.level}>
              <LottieWrapper>
                <Lottie
                  animationData={lottieAnimations[result.overall.level]}
                  loop={true}
                />
              </LottieWrapper>
              <ResultVerdict $level={result.overall.level}>
                {result.overall.verdict}
              </ResultVerdict>
              <ResultScore>종합 위험도 {result.overall.score}점</ResultScore>
            </ResultHeader>

            <ResultBody>
              <ScoreBreakdown>
                {result.chat && (
                  <ScoreItem>
                    <ScoreLabel>대화 분석</ScoreLabel>
                    <ScoreBar>
                      <ScoreFill $score={result.chat.score} $level={result.chat.level} />
                    </ScoreBar>
                    <ScoreValue $level={result.chat.level}>{result.chat.score}</ScoreValue>
                  </ScoreItem>
                )}
                {result.profile && (
                  <ScoreItem>
                    <ScoreLabel>프로필 검색</ScoreLabel>
                    <ScoreBar>
                      <ScoreFill $score={result.profile.score} $level={result.profile.level} />
                    </ScoreBar>
                    <ScoreValue $level={result.profile.level}>{result.profile.score}</ScoreValue>
                  </ScoreItem>
                )}
              </ScoreBreakdown>

              <DetailSection>
                <DetailTitle>분석 결과</DetailTitle>
                {result.overall.details.map((detail, i) => (
                  <DetailItem key={i}>{detail}</DetailItem>
                ))}
              </DetailSection>

              {result.chat?.summary && (
                <DetailSection>
                  <DetailTitle>AI 대화 분석</DetailTitle>
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                    {result.chat.summary}
                  </div>
                </DetailSection>
              )}
            </ResultBody>

            <CloseButton onClick={() => setResult(null)}>확인</CloseButton>
          </ResultCard>
        </ResultOverlay>
      )}
    </Container>
  );
}
