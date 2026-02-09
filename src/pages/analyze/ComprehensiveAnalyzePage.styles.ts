import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';

export const Container = styled.div`
  min-height: 100vh;
  background: var(--bg-secondary);
`;

export const Header = styled.header`
  position: sticky;
  top: 0;
  background: var(--bg-card);
  z-index: 100;
  border-bottom: 1px solid var(--border-color);
`;

export const HeaderInner = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 8px;
`;

export const BackButton = styled(Link)`
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

export const HeaderTitle = styled.h1`
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

export const Content = styled.div`
  padding: 20px 16px 40px;
  max-width: 600px;
  margin: 0 auto;
  overflow: hidden;
`;

// Section
export const Section = styled.section`
  background: var(--bg-card);
  border-radius: 20px;
  padding: 24px 20px;
  margin-bottom: 16px;
  border: 1px solid var(--border-color);
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px;
`;

export const SectionDesc = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 20px;
`;

export const InputGroup = styled.div`
  margin-bottom: 16px;
`;

export const InputLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 8px;
`;

export const TextInput = styled.input`
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

export const TabRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

export const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 10px 0;
  border-radius: 10px;
  border: 1.5px solid ${(p) => (p.$active ? 'var(--accent-primary)' : 'var(--border-color)')};
  background: ${(p) => (p.$active ? 'rgba(16, 185, 129, 0.08)' : 'transparent')};
  color: ${(p) => (p.$active ? 'var(--accent-primary)' : 'var(--text-secondary)')};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

export const PrimaryButton = styled.button<{ $disabled?: boolean }>`
  flex: 1;
  padding: 16px;
  background: ${(p) => (p.$disabled ? 'var(--border-color)' : 'var(--accent-gradient)')};
  color: ${(p) => (p.$disabled ? 'var(--text-tertiary)' : '#fff')};
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.3s;
  box-shadow: ${(p) => (p.$disabled ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)')};
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }
`;

export const SkipButton = styled.button`
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

export const DangerButton = styled.button`
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

export const OutlineButton = styled.a`
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
export const LoadingOverlay = styled.div`
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

export const LoadingText = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

export const LoadingSubtext = styled.div`
  font-size: 14px;
  color: rgba(255,255,255,0.7);
`;

// URL Input
export const UrlInputWrapper = styled.div`
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

export const UrlPrefix = styled.span`
  padding: 14px 0 14px 14px;
  color: var(--text-tertiary);
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

export const UrlTextInput = styled.input`
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
export const ResultHeader = styled.div<{ $level: string }>`
  padding: 32px 24px;
  border-radius: 20px;
  background: ${(p) =>
    p.$level === 'safe'
      ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
      : p.$level === 'warning'
        ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
        : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)'};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 16px;
`;

export const LottieWrapper = styled.div`
  width: 120px;
  height: 120px;
  margin-bottom: 12px;
`;

export const ResultVerdict = styled.div<{ $level: string }>`
  font-size: 24px;
  font-weight: 700;
  color: ${(p) =>
    p.$level === 'safe' ? '#059669' : p.$level === 'warning' ? '#d97706' : '#dc2626'};
  margin-bottom: 4px;
`;

export const ResultScore = styled.div`
  font-size: 16px;
  color: var(--text-secondary);
`;

export const ScoreBreakdown = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`;

export const ScoreItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ScoreLabel = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
  width: 80px;
  flex-shrink: 0;
`;

export const ScoreBar = styled.div`
  flex: 1;
  height: 8px;
  background: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
`;

export const fillAnimation = keyframes`
  from { width: 0%; }
`;

export const ScoreFill = styled.div<{ $score: number; $level: string }>`
  height: 100%;
  width: ${(p) => p.$score}%;
  background: ${(p) =>
    p.$level === 'safe' ? '#10b981' : p.$level === 'warning' ? '#f59e0b' : '#ef4444'};
  border-radius: 4px;
  animation: ${fillAnimation} 0.8s ease-out;
`;

export const ScoreValue = styled.div<{ $level: string }>`
  font-size: 14px;
  font-weight: 600;
  width: 40px;
  text-align: right;
  color: ${(p) =>
    p.$level === 'safe' ? '#10b981' : p.$level === 'warning' ? '#f59e0b' : '#ef4444'};
`;

export const DetailSection = styled.div`
  margin-bottom: 20px;
`;

export const DetailTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
`;

export const DetailItem = styled.div`
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

export const InfoTag = styled.div<{ $type: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  margin: 4px 4px 4px 0;
  background: ${(p) => {
    switch (p.$type) {
      case 'PHONE':
        return '#eff6ff';
      case 'ACCOUNT':
        return '#fef3c7';
      case 'SNS':
        return '#f3e8ff';
      case 'URL':
        return '#fee2e2';
      default:
        return 'var(--bg-secondary)';
    }
  }};
  color: ${(p) => {
    switch (p.$type) {
      case 'PHONE':
        return '#2563eb';
      case 'ACCOUNT':
        return '#d97706';
      case 'SNS':
        return '#7c3aed';
      case 'URL':
        return '#dc2626';
      default:
        return 'var(--text-primary)';
    }
  }};
`;

export const SuccessMessage = styled.div`
  padding: 16px;
  background: #d1fae5;
  border-radius: 12px;
  color: #059669;
  font-size: 15px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 16px;
`;

export const ErrorText = styled.div`
  font-size: 14px;
  color: #f04452;
  margin-top: 8px;
`;

export const StatusBadge = styled.span<{ $status: 'safe' | 'danger' | 'warning' | 'pending' }>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  margin-left: 8px;
  background: ${(p) => {
    switch (p.$status) {
      case 'safe':
        return '#d1fae5';
      case 'danger':
        return '#fee2e2';
      case 'warning':
        return '#fef3c7';
      default:
        return 'var(--bg-secondary)';
    }
  }};
  color: ${(p) => {
    switch (p.$status) {
      case 'safe':
        return '#059669';
      case 'danger':
        return '#dc2626';
      case 'warning':
        return '#d97706';
      default:
        return 'var(--text-tertiary)';
    }
  }};
`;

// ==================== Screenshot Preview ====================

export const ScreenshotPreview = styled.div`
  margin-top: 16px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
`;

export const ScreenshotPreviewImage = styled.img`
  width: 100%;
  max-height: 360px;
  object-fit: contain;
  display: block;
`;

// ==================== Face Select Modal ====================

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

export const ModalContent = styled.div`
  background: var(--bg-card);
  border-radius: 16px;
  max-width: 420px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

export const ModalHeader = styled.div`
  padding: 20px 20px 12px;
  border-bottom: 1px solid var(--border-color);
`;

export const ModalTitle = styled.h3`
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px;
`;

export const ModalDesc = styled.p`
  font-size: 13px;
  color: var(--text-tertiary);
  margin: 0;
`;

export const FacePreviewWrapper = styled.div`
  position: relative;
  margin: 16px 20px 0;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
`;

export const FacePreviewImage = styled.img`
  width: 100%;
  display: block;
`;

export const FaceBoundingBox = styled.div<{ $selected: boolean }>`
  position: absolute;
  border: 2px solid ${(p) => (p.$selected ? '#6366f1' : 'rgba(255, 255, 255, 0.7)')};
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-shadow: ${(p) => (p.$selected ? '0 0 0 2px rgba(99,102,241,0.4)' : 'none')};

  &:hover {
    border-color: #6366f1;
  }
`;

export const FaceBboxLabel = styled.div<{ $selected: boolean }>`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  background: ${(p) => (p.$selected ? '#6366f1' : 'rgba(0,0,0,0.6)')};
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
`;

export const FaceGridLabel = styled.div`
  padding: 12px 20px 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
`;

export const FaceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
  padding: 10px 20px 16px;
`;

export const FaceCard = styled.button<{ $selected: boolean }>`
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  border: 3px solid ${(p) => (p.$selected ? '#6366f1' : 'var(--border-color)')};
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

export const FaceCheckMark = styled.div`
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

export const ModalFooter = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 20px 20px;
  border-top: 1px solid var(--border-color);
`;

export const ModalCancelBtn = styled.button`
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

export const ModalConfirmBtn = styled.button<{ $disabled?: boolean }>`
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: ${(p) => (p.$disabled ? 'var(--bg-secondary)' : '#6366f1')};
  color: ${(p) => (p.$disabled ? 'var(--text-tertiary)' : '#fff')};
  font-size: 14px;
  font-weight: 600;
  cursor: ${(p) => (p.$disabled ? 'default' : 'pointer')};
`;

// ==================== Report Guide ====================

export const GuideButton = styled.button<{ $disabled?: boolean }>`
  flex: 1;
  padding: 16px;
  background: ${(p) => (p.$disabled ? 'var(--border-color)' : 'var(--accent-gradient)')};
  color: ${(p) => (p.$disabled ? 'var(--text-tertiary)' : '#fff')};
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.3s;
  box-shadow: ${(p) => (p.$disabled ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)')};
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }
`;

export const GuideModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;

  @media (min-width: 601px) {
    align-items: center;
    padding: 24px;
  }
`;

export const GuideModalContent = styled.div`
  background: var(--bg-secondary);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 20px 20px 0 0;
  position: relative;

  @media (min-width: 601px) {
    border-radius: 20px;
    max-height: 85vh;
  }
`;

export const GuideModalHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 16px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
`;

export const GuideModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
`;

export const GuideModalClose = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: var(--bg-card);
  color: var(--text-secondary);
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  &:hover {
    background: var(--border-color);
  }
`;

export const GuideModalBody = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const GuideSection = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const GuideSectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const EmergencyCard = styled.div<{ $urgent?: boolean }>`
  padding: 16px;
  border-radius: 14px;
  border: 1.5px solid ${(p) => (p.$urgent ? '#ef4444' : 'var(--border-color)')};
  background: ${(p) => (p.$urgent ? '#fef2f2' : 'var(--bg-card)')};
`;

export const EmergencyAction = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
`;

export const EmergencyContact = styled.a`
  font-size: 14px;
  color: var(--accent-primary);
  text-decoration: none;
  font-weight: 500;
  &:hover { text-decoration: underline; }
`;

export const GoldenTimeWarning = styled.div`
  margin-top: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  background: #fef3c7;
  color: #92400e;
  font-size: 13px;
  font-weight: 600;
`;

export const DeadlineText = styled.span`
  font-size: 13px;
  color: var(--text-tertiary);
  margin-left: 8px;
`;

export const StepCard = styled.div`
  padding: 16px;
  border-radius: 14px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  display: flex;
  gap: 14px;
  align-items: flex-start;
`;

export const StepNumber = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--accent-gradient);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
`;

export const StepContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const StepTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
`;

export const StepDesc = styled.div`
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
`;

export const StepLink = styled.a`
  display: inline-block;
  margin-top: 6px;
  font-size: 13px;
  color: var(--accent-primary);
  text-decoration: none;
  font-weight: 500;
  &:hover { text-decoration: underline; }
`;

export const StepTip = styled.div`
  margin-top: 6px;
  font-size: 12px;
  color: var(--text-tertiary);
  font-style: italic;
`;

export const ReportDraft = styled.textarea`
  width: 100%;
  min-height: 180px;
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-secondary);
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-primary);
  resize: vertical;
  font-family: inherit;
  &:focus { outline: none; border-color: var(--accent-primary); }
`;

export const CopyButton = styled.button`
  margin-top: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  border: 1.5px solid var(--accent-primary);
  background: transparent;
  color: var(--accent-primary);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: rgba(16, 185, 129, 0.05); }
`;

export const AgencyCard = styled.div`
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

export const AgencyName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
`;

export const AgencyLinks = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-shrink: 0;
`;

export const AgencyLink = styled.a`
  font-size: 13px;
  color: var(--accent-primary);
  text-decoration: none;
  font-weight: 500;
  &:hover { text-decoration: underline; }
`;

export const EvidenceCard = styled.div`
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
`;

export const EvidenceCategory = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

export const RiskBadge = styled.span<{ $level: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  background: ${(p) => {
    switch (p.$level) {
      case 'high': return '#fee2e2';
      case 'medium': return '#fef3c7';
      default: return '#d1fae5';
    }
  }};
  color: ${(p) => {
    switch (p.$level) {
      case 'high': return '#dc2626';
      case 'medium': return '#d97706';
      default: return '#059669';
    }
  }};
`;

export const EvidenceSummaryText = styled.div`
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
`;

// ==================== Image Search Result ====================

export const ProfileSection = styled.div`
  margin-bottom: 0;
`;

export const ProfileSectionTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 10px;
`;

export const WebImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
`;

export const WebImageCard = styled.a`
  display: block;
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg-secondary);
  text-decoration: none;
  transition: transform 0.2s;
  &:active {
    transform: scale(0.98);
  }
`;

export const WebImageThumbnail = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  display: block;
`;

export const WebImagePlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: var(--text-tertiary);
`;

export const ProfileMatchCard = styled.a`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: var(--bg-card);
  border-radius: 14px;
  text-decoration: none;
  margin-bottom: 10px;
  border: 1px solid var(--border-color);
  transition: all 0.2s;
  &:active {
    background: var(--bg-secondary);
  }
`;

export const ProfileMatchImage = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  background: var(--bg-secondary);
  flex-shrink: 0;
`;

export const ProfileMatchInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ProfileMatchName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ProfileMatchUsername = styled.div`
  font-size: 13px;
  color: var(--text-tertiary);
`;

export const ProfileMatchBadge = styled.span<{ $score: number }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  background: ${(p) =>
    p.$score >= 80 ? '#fee2e2' : p.$score >= 50 ? '#fef3c7' : '#d1fae5'};
  color: ${(p) =>
    p.$score >= 80 ? '#dc2626' : p.$score >= 50 ? '#d97706' : '#059669'};
`;

export const ReverseSearchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

export const ReverseSearchCard = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  background: var(--bg-secondary);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s;
  &:active {
    background: var(--border-color);
  }
`;

export const ReverseSearchIcon = styled.span`
  font-size: 20px;
`;

export const ReverseSearchName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
`;
