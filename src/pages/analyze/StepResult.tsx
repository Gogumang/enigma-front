import type { ComprehensiveResult } from '@/features/analyze-comprehensive';
import type { ReportGuideData } from '@/features/report-scam';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { useState, useCallback } from 'react';

import dangerAnimation from '@/shared/assets/lottie/danger.json';
import safeAnimation from '@/shared/assets/lottie/safe.json';
import warningAnimation from '@/shared/assets/lottie/warning.json';

import {
  collectIdentifiers,
  computeScores,
  getLevel,
  getVerdict,
  mapApiResultToStepData,
  slideVariants,
} from './comprehensiveUtils';

import {
  AgencyCard,
  AgencyLink,
  AgencyLinks,
  AgencyName,
  ButtonRow,
  CopyButton,
  DangerButton,
  DeadlineText,
  DetailItem,
  DetailSection,
  DetailTitle,
  EmergencyAction,
  EmergencyCard,
  EmergencyContact,
  ErrorText,
  EvidenceCard,
  EvidenceCategory,
  EvidenceSummaryText,
  GoldenTimeWarning,
  GuideButton,
  GuideModalBody,
  GuideModalClose,
  GuideModalContent,
  GuideModalHeader,
  GuideModalOverlay,
  GuideModalTitle,
  GuideSectionTitle,
  InfoTag,
  LottieWrapper,
  OutlineButton,
  ProfileMatchBadge,
  ProfileMatchCard,
  ProfileMatchImage,
  ProfileMatchInfo,
  ProfileMatchName,
  ProfileMatchUsername,
  ProfileSection,
  ProfileSectionTitle,
  ReportDraft,
  ResultHeader,
  ReverseSearchCard,
  ReverseSearchGrid,
  ReverseSearchIcon,
  ReverseSearchName,
  ResultScore,
  ResultVerdict,
  RiskBadge,
  ScoreBar,
  ScoreBreakdown,
  ScoreFill,
  ScoreItem,
  ScoreLabel,
  ScoreValue,
  Section,
  SkipButton,
  StatusBadge,
  StepCard,
  StepContent,
  StepDesc,
  StepLink,
  StepNumber,
  StepTip,
  StepTitle,
  SuccessMessage,
  WebImageCard,
  WebImageGrid,
  WebImageThumbnail,
} from './ComprehensiveAnalyzePage.styles';

const lottieAnimations = {
  safe: safeAnimation,
  warning: warningAnimation,
  danger: dangerAnimation,
};

interface StepResultProps {
  direction: number;
  apiResult: ComprehensiveResult;
  contactType: 'phone' | 'account' | 'url';
  contactValue: string;
  reportSuccess: boolean;
  isReporting: boolean;
  reportError: Error | null;
  onReport: () => void;
  onReset: () => void;
  guideData: ReportGuideData | null;
  isGuideLoading: boolean;
  guideError: Error | null;
  onRequestGuide: () => void;
}

function collectReasons(
  apiResult: ComprehensiveResult,
  contactType: string,
  contactValue: string,
): string[] {
  const reasons: string[] = [];
  const { deepfakeData, profileData, chatData, fraudData, urlData } =
    mapApiResultToStepData(apiResult);

  if (deepfakeData?.isDeepfake) {
    const raw = deepfakeData.confidence as number;
    const pct = raw > 1 ? Math.round(raw) : Math.round(raw * 100);
    reasons.push(
      `AI 생성 이미지 의심 (확신도 ${pct}%)`,
    );
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
    const displayValue =
      (fraudData?.phone?.displayValue as string) || (contactType === 'phone' ? contactValue : '');
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
}

export default function StepResult({
  direction,
  apiResult,
  contactType,
  contactValue,
  reportSuccess,
  isReporting,
  reportError,
  onReport,
  onReset,
  guideData,
  isGuideLoading,
  guideError,
  onRequestGuide,
}: StepResultProps) {
  const [copied, setCopied] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const { deepfakeData, profileData, chatData, fraudData, urlData } = mapApiResultToStepData(apiResult);
  const { entries, overallScore } = computeScores(apiResult);
  const level = getLevel(overallScore);
  const verdict = getVerdict(overallScore);
  const reasons = collectReasons(apiResult, contactType, contactValue);
  const identifiers = collectIdentifiers(apiResult, contactType, contactValue);

  const handleCopyDraft = async () => {
    if (!guideData?.aiReportDraft) return;
    try {
      await navigator.clipboard.writeText(guideData.aiReportDraft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: ignore
    }
  };

  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());
  const handleImgError = useCallback((url: string) => {
    setImgErrors((prev) => new Set(prev).add(url));
  }, []);

  const getSearchEngineIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('google')) return '🔍';
    if (lower.includes('yandex')) return '🟡';
    if (lower.includes('tineye')) return '👁️';
    if (lower.includes('bing')) return '🔎';
    return '🌐';
  };

  // Extract profile match list from results
  const profileMatches: Array<{
    platform: string;
    name: string;
    username: string;
    imageUrl?: string;
    profileUrl?: string;
    matchScore: number;
  }> = [];
  if (profileData) {
    const results = profileData.results as Record<
      string,
      Array<Record<string, unknown>>
    > | undefined;
    if (results) {
      for (const [platform, profiles] of Object.entries(results)) {
        for (const p of profiles) {
          profileMatches.push({
            platform,
            name: (p.name as string) || (p.username as string) || platform,
            username: (p.username as string) || '',
            imageUrl: p.imageUrl as string | undefined,
            profileUrl: p.profileUrl as string | undefined,
            matchScore: (p.matchScore as number) ?? 0,
          });
        }
      }
    }
  }

  const riskLevelLabel = (level: string) => {
    switch (level) {
      case 'high': return '높음';
      case 'medium': return '보통';
      default: return '낮음';
    }
  };

  return (
    <motion.div
      key="step4"
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
          {entries.map((entry) => {
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
          <div
            style={{
              fontSize: '14px',
              color: 'var(--text-tertiary)',
              textAlign: 'center',
              padding: '12px 0',
            }}
          >
            모든 단계를 건너뛰어 분석 결과가 없습니다
          </div>
        )}
      </Section>

      {/* Reasons */}
      <Section>
        <DetailTitle>분석 근거</DetailTitle>
        <DetailSection>
          {reasons.map((reason) => (
            <DetailItem key={reason}>{reason}</DetailItem>
          ))}
        </DetailSection>
      </Section>

      {/* Deepfake details */}
      {deepfakeData && (
        <Section>
          <DetailTitle>
            AI 분석 결과
            <StatusBadge $status={(deepfakeData.isDeepfake as boolean) ? 'danger' : 'safe'}>
              {(deepfakeData.isDeepfake as boolean) ? 'AI 생성 의심' : '정상'}
            </StatusBadge>
          </DetailTitle>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {deepfakeData.message as string}
          </div>
        </Section>
      )}

      {/* Image Search Results */}
      {profileData && (profileData.totalFound as number) > 0 && (
        <Section>
          <DetailTitle>
            이미지 검색 결과
            <StatusBadge
              $status={
                (profileData.totalFound as number) > 10
                  ? 'danger'
                  : (profileData.totalFound as number) > 3
                    ? 'warning'
                    : 'safe'
              }
            >
              {profileData.totalFound as number}건 발견
            </StatusBadge>
          </DetailTitle>

          {/* Web Images */}
          {Array.isArray(profileData.webImageResults) &&
            (profileData.webImageResults as Array<Record<string, unknown>>).length > 0 && (
              <ProfileSection>
                <ProfileSectionTitle>웹에서 발견된 이미지</ProfileSectionTitle>
                <WebImageGrid>
                  {(profileData.webImageResults as Array<Record<string, unknown>>)
                    .slice(0, 6)
                    .map((img, i) => {
                      const thumbUrl = (img.thumbnailUrl as string) || (img.imageUrl as string) || '';
                      const sourceUrl = (img.sourceUrl as string) || '#';
                      if (!thumbUrl || imgErrors.has(thumbUrl)) return null;
                      return (
                        <WebImageCard
                          key={i}
                          href={sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <WebImageThumbnail
                            src={thumbUrl}
                            alt={`웹 이미지 ${i + 1}`}
                            onError={() => handleImgError(thumbUrl)}
                          />
                        </WebImageCard>
                      );
                    })}
                </WebImageGrid>
              </ProfileSection>
            )}

          {/* Matched Profiles */}
          {profileMatches.length > 0 && (
            <ProfileSection>
              <ProfileSectionTitle>매칭된 프로필</ProfileSectionTitle>
              {profileMatches.slice(0, 5).map((match, i) => (
                <ProfileMatchCard
                  key={i}
                  href={match.profileUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {match.imageUrl && !imgErrors.has(match.imageUrl) ? (
                    <ProfileMatchImage
                      src={match.imageUrl}
                      alt={match.name}
                      onError={() => handleImgError(match.imageUrl!)}
                    />
                  ) : (
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: 'var(--bg-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                        flexShrink: 0,
                      }}
                    >
                      👤
                    </div>
                  )}
                  <ProfileMatchInfo>
                    <ProfileMatchName>{match.name}</ProfileMatchName>
                    {match.username && (
                      <ProfileMatchUsername>
                        @{match.username} · {match.platform}
                      </ProfileMatchUsername>
                    )}
                  </ProfileMatchInfo>
                  {match.matchScore > 0 && (
                    <ProfileMatchBadge $score={match.matchScore}>
                      {match.matchScore}%
                    </ProfileMatchBadge>
                  )}
                </ProfileMatchCard>
              ))}
            </ProfileSection>
          )}

          {/* Reverse Image Search Links */}
          {Array.isArray(profileData.reverseSearchLinks) &&
            (profileData.reverseSearchLinks as Array<Record<string, unknown>>).length > 0 && (
              <ProfileSection>
                <ProfileSectionTitle>역이미지 검색</ProfileSectionTitle>
                <ReverseSearchGrid>
                  {(profileData.reverseSearchLinks as Array<Record<string, unknown>>).map(
                    (link, i) => (
                      <ReverseSearchCard
                        key={i}
                        href={link.url as string}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ReverseSearchIcon>
                          {getSearchEngineIcon(link.name as string)}
                        </ReverseSearchIcon>
                        <ReverseSearchName>{link.name as string}</ReverseSearchName>
                      </ReverseSearchCard>
                    ),
                  )}
                </ReverseSearchGrid>
              </ProfileSection>
            )}
        </Section>
      )}

      {/* Chat details */}
      {chatData && (
        <Section>
          <DetailTitle>
            대화 분석 결과
            <StatusBadge
              $status={
                (chatData.riskScore as number) >= 60
                  ? 'danger'
                  : (chatData.riskScore as number) >= 30
                    ? 'warning'
                    : 'safe'
              }
            >
              위험도 {chatData.riskScore as number}점
            </StatusBadge>
          </DetailTitle>
          {typeof chatData.aiAnalysis === 'string' && chatData.aiAnalysis && (
            <div
              style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '12px',
              }}
            >
              {chatData.aiAnalysis}
            </div>
          )}
        </Section>
      )}

      {/* Fraud / URL details */}
      {(fraudData || urlData) && (
        <Section>
          <DetailTitle>연락처/URL 조회 결과</DetailTitle>
          {fraudData?.phone && (
            <div style={{ marginBottom: '8px', fontSize: '14px' }}>
              전화번호 ({(fraudData.phone.displayValue as string) || contactValue}):
              <StatusBadge
                $status={(fraudData.phone.status as string) === 'danger' ? 'danger' : 'safe'}
              >
                {(fraudData.phone.status as string) === 'danger' ? '사기 이력 있음' : '이력 없음'}
              </StatusBadge>
            </div>
          )}
          {fraudData?.account && (
            <div style={{ marginBottom: '8px', fontSize: '14px' }}>
              계좌번호:
              <StatusBadge
                $status={(fraudData.account.status as string) === 'danger' ? 'danger' : 'safe'}
              >
                {(fraudData.account.status as string) === 'danger' ? '사기 이력 있음' : '이력 없음'}
              </StatusBadge>
            </div>
          )}
          {urlData && (
            <div style={{ marginBottom: '8px', fontSize: '14px' }}>
              URL ({urlData.domain as string}):
              <StatusBadge
                $status={
                  (urlData.status as string) === 'danger'
                    ? 'danger'
                    : (urlData.status as string) === 'warning'
                      ? 'warning'
                      : 'safe'
                }
              >
                {(urlData.status as string) === 'danger'
                  ? '위험'
                  : (urlData.status as string) === 'warning'
                    ? '주의'
                    : '안전'}
              </StatusBadge>
            </div>
          )}
        </Section>
      )}

      {/* Actions */}
      <Section>
        {contactValue.trim() && (
          <>
            <DetailTitle>신고 및 조치</DetailTitle>

            {reportSuccess && <SuccessMessage>신고가 성공적으로 저장되었습니다</SuccessMessage>}

            {reportError && (
              <ErrorText style={{ marginBottom: '12px' }}>
                신고 저장 실패: {reportError.message}
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
              <DangerButton onClick={onReport} disabled={reportSuccess || isReporting}>
                {isReporting ? '저장 중...' : reportSuccess ? '신고 완료' : '신고 저장'}
              </DangerButton>
            </ButtonRow>

            {overallScore >= 30 && (
              <ButtonRow>
                <GuideButton
                  onClick={() => {
                    if (guideData) {
                      setShowGuideModal(true);
                    } else {
                      onRequestGuide();
                      setShowGuideModal(true);
                    }
                  }}
                  $disabled={isGuideLoading}
                  disabled={isGuideLoading}
                >
                  {isGuideLoading ? '생성 중...' : '신고 도움받기'}
                </GuideButton>
              </ButtonRow>
            )}

          </>
        )}

        <div style={{ marginTop: contactValue.trim() ? '16px' : '0' }}>
          <SkipButton style={{ width: '100%', textAlign: 'center' }} onClick={onReset}>
            처음부터 다시 분석
          </SkipButton>
        </div>
      </Section>

      {/* Report Guide Modal */}
      {showGuideModal && (
        <GuideModalOverlay onClick={() => setShowGuideModal(false)}>
          <GuideModalContent onClick={(e) => e.stopPropagation()}>
            <GuideModalHeader>
              <GuideModalTitle>신고 도움받기</GuideModalTitle>
              <GuideModalClose onClick={() => setShowGuideModal(false)}>&times;</GuideModalClose>
            </GuideModalHeader>
            <GuideModalBody>
              {isGuideLoading && (
                <Section>
                  <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-secondary)', fontSize: '15px' }}>
                    신고 가이드를 생성하고 있습니다...
                  </div>
                </Section>
              )}

              {guideError && (
                <Section>
                  <ErrorText>가이드 생성 실패: {guideError.message}</ErrorText>
                </Section>
              )}

              {guideData && (
                <>
                  {/* Emergency Actions */}
                  {guideData.emergencyActions.length > 0 && (
                    <Section>
                      <GuideSectionTitle>긴급 조치 안내</GuideSectionTitle>
                      {guideData.emergencyActions.map((ea, i) => (
                        <EmergencyCard key={i} $urgent={ea.isUrgent} style={{ marginBottom: i < guideData.emergencyActions.length - 1 ? '10px' : '0' }}>
                          <EmergencyAction>{ea.action}</EmergencyAction>
                          <EmergencyContact href={`tel:${ea.contact.replace(/[^0-9]/g, '')}`}>
                            {ea.contact}
                          </EmergencyContact>
                          {ea.deadlineHours != null && (
                            <DeadlineText>({ea.deadlineHours}시간 이내)</DeadlineText>
                          )}
                          {ea.goldenTimeWarning && (
                            <GoldenTimeWarning>{ea.goldenTimeWarning}</GoldenTimeWarning>
                          )}
                        </EmergencyCard>
                      ))}
                    </Section>
                  )}

                  {/* AI Report Draft */}
                  {guideData.aiReportDraft && (
                    <Section>
                      <GuideSectionTitle>AI 신고서 초안</GuideSectionTitle>
                      <ReportDraft readOnly value={guideData.aiReportDraft} />
                      <CopyButton onClick={handleCopyDraft}>
                        {copied ? '복사 완료' : '복사하기'}
                      </CopyButton>
                    </Section>
                  )}

                  {/* Reporting Steps */}
                  {guideData.reportingSteps.length > 0 && (
                    <Section>
                      <GuideSectionTitle>단계별 신고 절차</GuideSectionTitle>
                      {guideData.reportingSteps.map((rs) => (
                        <StepCard key={rs.step} style={{ marginBottom: '10px' }}>
                          <StepNumber>{rs.step}</StepNumber>
                          <StepContent>
                            <StepTitle>{rs.title}</StepTitle>
                            <StepDesc>{rs.description}</StepDesc>
                            {rs.url && (
                              <StepLink href={rs.url} target="_blank" rel="noopener noreferrer">
                                바로가기
                              </StepLink>
                            )}
                            {rs.tip && <StepTip>{rs.tip}</StepTip>}
                          </StepContent>
                        </StepCard>
                      ))}
                    </Section>
                  )}

                  {/* Evidence Summary */}
                  {guideData.evidenceSummary.length > 0 && (
                    <Section>
                      <GuideSectionTitle>증거 요약</GuideSectionTitle>
                      {guideData.evidenceSummary.map((ev, i) => (
                        <EvidenceCard key={i} style={{ marginBottom: i < guideData.evidenceSummary.length - 1 ? '10px' : '0' }}>
                          <EvidenceCategory>
                            {ev.category}
                            <RiskBadge $level={ev.riskLevel}>{riskLevelLabel(ev.riskLevel)}</RiskBadge>
                          </EvidenceCategory>
                          <EvidenceSummaryText>{ev.summary}</EvidenceSummaryText>
                        </EvidenceCard>
                      ))}
                    </Section>
                  )}

                  {/* Agencies */}
                  {guideData.agencies.length > 0 && (
                    <Section>
                      <GuideSectionTitle>관련 기관</GuideSectionTitle>
                      {guideData.agencies.map((ag, i) => (
                        <AgencyCard key={i} style={{ marginBottom: i < guideData.agencies.length - 1 ? '10px' : '0' }}>
                          <AgencyName>{ag.name}</AgencyName>
                          <AgencyLinks>
                            <AgencyLink href={`tel:${ag.phone.replace(/[^0-9]/g, '')}`}>
                              {ag.phone}
                            </AgencyLink>
                            <AgencyLink href={ag.url} target="_blank" rel="noopener noreferrer">
                              사이트
                            </AgencyLink>
                          </AgencyLinks>
                        </AgencyCard>
                      ))}
                    </Section>
                  )}
                </>
              )}
            </GuideModalBody>
          </GuideModalContent>
        </GuideModalOverlay>
      )}
    </motion.div>
  );
}
