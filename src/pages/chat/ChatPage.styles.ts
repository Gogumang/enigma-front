import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';

export const Container = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--bg-secondary);
  display: flex;
  flex-direction: column;
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

  &:active {
    background: var(--bg-secondary);
  }
`;

export const HeaderTitle = styled.h1`
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

export const AnalyzeButton = styled.button<{ $disabled?: boolean }>`
  padding: 8px 16px;
  background: ${props => props.$disabled ? 'var(--border-color)' : 'var(--accent-gradient)'};
  color: ${props => props.$disabled ? 'var(--text-tertiary)' : '#fff'};
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  margin-right: 8px;
`;

export const ChatArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
`;

export const EmptyTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px;
`;

export const EmptyDesc = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
`;

export const MessageWrapper = styled.div<{ $isMe: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$isMe ? 'flex-end' : 'flex-start'};
`;

export const MessageBubble = styled.div<{ $isMe: boolean }>`
  max-width: 65%;
  padding: 10px 14px;
  border-radius: ${props => props.$isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px'};
  background: ${props => props.$isMe ? 'var(--accent-primary)' : 'var(--bg-card)'};
  color: ${props => props.$isMe ? '#fff' : 'var(--text-primary)'};
  font-size: 14px;
  line-height: 1.5;
  position: relative;
  cursor: pointer;
  transition: transform 0.1s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);

  &:active {
    transform: scale(0.98);
  }
`;

export const MessageActions = styled.div`
  position: absolute;
  top: -32px;
  right: 0;
  display: flex;
  gap: 4px;
  background: var(--bg-card);
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
`;

export const ActionButton = styled.button`
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);

  &:hover {
    background: var(--bg-secondary);
  }
`;

export const RoleLabel = styled.div`
  font-size: 11px;
  color: var(--text-tertiary);
  margin-bottom: 4px;
`;

export const InputArea = styled.div`
  padding: 12px 16px max(24px, env(safe-area-inset-bottom));
  background: var(--bg-card);
  border-top: 1px solid var(--border-color);
`;

export const RoleToggle = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

export const RoleButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 10px;
  border: 2px solid ${props => props.$active ? 'var(--accent-primary)' : 'var(--border-color)'};
  background: ${props => props.$active ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-secondary)'};
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$active ? 'var(--accent-primary)' : 'var(--text-secondary)'};
  cursor: pointer;
  transition: all 0.2s;
`;

export const InputWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
`;

export const TextArea = styled.textarea`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  border-radius: 20px;
  font-size: 15px;
  font-family: inherit;
  line-height: 1.5;
  resize: none;
  color: var(--text-primary);
  max-height: 120px;
  overflow: hidden;

  &:focus {
    outline: none;
    border-color: var(--accent-primary);
  }

  &::placeholder {
    color: var(--text-tertiary);
  }
`;

export const IconButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    background: var(--border-color);
    color: var(--text-primary);
  }
`;

export const SendButton = styled.button<{ $active: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: ${props => props.$active ? 'var(--accent-gradient)' : 'var(--border-color)'};
  color: #fff;
  cursor: ${props => props.$active ? 'pointer' : 'default'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const HiddenInput = styled.input`
  display: none;
`;

// 분석 결과 모달
export const ResultOverlay = styled.div`
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

export const ResultCard = styled.div`
  width: 100%;
  max-width: 360px;
  background: var(--bg-card);
  border-radius: 24px;
  overflow: hidden;
  max-height: 90vh;
  overflow-y: auto;
`;

export const ResultHeader = styled.div<{ $level: string }>`
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

export const LottieWrapper = styled.div`
  width: 100px;
  height: 100px;
  margin-bottom: 12px;
`;

export const ResultStatus = styled.div<{ $level: string }>`
  font-size: 24px;
  font-weight: 700;
  color: ${props =>
    props.$level === 'safe' ? '#059669' :
    props.$level === 'warning' ? '#d97706' : '#dc2626'};
  margin-bottom: 4px;
`;

export const ResultScore = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
`;

export const ResultBody = styled.div`
  padding: 20px 24px;
`;

export const ResultSummary = styled.p`
  font-size: 15px;
  color: var(--text-primary);
  line-height: 1.6;
  margin: 0 0 16px;
`;

export const ResultSection = styled.div`
  margin-bottom: 16px;
`;

export const ResultSectionTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 8px;
`;

export const ResultItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 0;
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.5;
`;

export const CloseButton = styled.button`
  width: 100%;
  padding: 16px;
  background: var(--accent-gradient);
  color: #fff;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
`;

// 수정 모달
export const EditOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

export const EditSheet = styled.div`
  width: 100%;
  max-width: 500px;
  background: var(--bg-card);
  border-radius: 24px 24px 0 0;
  padding: 24px;
`;

export const EditTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
`;

export const EditTextArea = styled.textarea`
  width: 100%;
  padding: 16px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  line-height: 1.5;
  resize: none;
  color: var(--text-primary);
  min-height: 100px;
  margin-bottom: 16px;

  &:focus {
    outline: none;
    border-color: var(--accent-primary);
  }
`;

export const EditActions = styled.div`
  display: flex;
  gap: 12px;
`;

export const EditButton = styled.button<{ $primary?: boolean }>`
  flex: 1;
  padding: 14px;
  border: ${props => props.$primary ? 'none' : '1px solid var(--border-color)'};
  background: ${props => props.$primary ? 'var(--accent-gradient)' : 'var(--bg-card)'};
  color: ${props => props.$primary ? '#fff' : 'var(--text-primary)'};
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
`;

export const LoadingOverlay = styled.div`
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
  gap: 16px;
  color: #fff;
`;

export const LoadingText = styled.div`
  font-size: 16px;
  font-weight: 500;
`;
