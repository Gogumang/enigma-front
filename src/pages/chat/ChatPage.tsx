import { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import Lottie from 'lottie-react';
import { useChatAnalysis, useScreenshotAnalysis } from '@/features/analyze-chat';
import type { AnalysisData } from '@/entities/analysis';

import safeAnimation from '@/shared/assets/lottie/safe.json';
import warningAnimation from '@/shared/assets/lottie/warning.json';
import dangerAnimation from '@/shared/assets/lottie/danger.json';

// Types
interface ChatMessage {
  id: string;
  role: 'me' | 'other';
  content: string;
}

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: var(--bg-secondary);
  display: flex;
  flex-direction: column;
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

const AnalyzeButton = styled.button<{ $disabled?: boolean }>`
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

const ChatArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
`;

const EmptyTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px;
`;

const EmptyDesc = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
`;

const MessageWrapper = styled.div<{ $isMe: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$isMe ? 'flex-end' : 'flex-start'};
`;

const MessageBubble = styled.div<{ $isMe: boolean }>`
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

const MessageActions = styled.div`
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

const ActionButton = styled.button`
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

const RoleLabel = styled.div`
  font-size: 11px;
  color: var(--text-tertiary);
  margin-bottom: 4px;
`;

const InputArea = styled.div`
  padding: 12px 16px 24px;
  background: var(--bg-card);
  border-top: 1px solid var(--border-color);
`;

const RoleToggle = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

const RoleButton = styled.button<{ $active: boolean }>`
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

const InputWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
`;

const TextArea = styled.textarea`
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

  &:focus {
    outline: none;
    border-color: var(--accent-primary);
  }

  &::placeholder {
    color: var(--text-tertiary);
  }
`;

const IconButton = styled.button`
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

const SendButton = styled.button<{ $active: boolean }>`
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

const HiddenInput = styled.input`
  display: none;
`;

// 분석 결과 모달
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
  max-width: 360px;
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
  width: 100px;
  height: 100px;
  margin-bottom: 12px;
`;

const ResultStatus = styled.div<{ $level: string }>`
  font-size: 24px;
  font-weight: 700;
  color: ${props =>
    props.$level === 'safe' ? '#059669' :
    props.$level === 'warning' ? '#d97706' : '#dc2626'};
  margin-bottom: 4px;
`;

const ResultScore = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
`;

const ResultBody = styled.div`
  padding: 20px 24px;
`;

const ResultSummary = styled.p`
  font-size: 15px;
  color: var(--text-primary);
  line-height: 1.6;
  margin: 0 0 16px;
`;

const ResultSection = styled.div`
  margin-bottom: 16px;
`;

const ResultSectionTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 8px;
`;

const ResultItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 0;
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.5;
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

// 수정 모달
const EditOverlay = styled.div`
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

const EditSheet = styled.div`
  width: 100%;
  max-width: 500px;
  background: var(--bg-card);
  border-radius: 24px 24px 0 0;
  padding: 24px;
`;

const EditTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
`;

const EditTextArea = styled.textarea`
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

const EditActions = styled.div`
  display: flex;
  gap: 12px;
`;

const EditButton = styled.button<{ $primary?: boolean }>`
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

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
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

const lottieAnimations = {
  safe: safeAnimation,
  warning: warningAnimation,
  danger: dangerAnimation,
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [role, setRole] = useState<'me' | 'other'>('other');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [editText, setEditText] = useState('');
  const [result, setResult] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chatAnalysis = useChatAnalysis();
  const screenshotAnalysis = useScreenshotAnalysis();

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const addMessage = () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role,
      content: input.trim(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addMessage();
    }
  };

  const handleEdit = (msg: ChatMessage) => {
    setEditingMessage(msg);
    setEditText(msg.content);
    setSelectedId(null);
  };

  const saveEdit = () => {
    if (!editingMessage) return;

    setMessages(prev =>
      prev.map(m =>
        m.id === editingMessage.id ? { ...m, content: editText } : m
      )
    );
    setEditingMessage(null);
    setEditText('');
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    setSelectedId(null);
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다');
      return;
    }

    setIsLoading(true);

    try {
      const result = await screenshotAnalysis.mutateAsync(file);

      if (result.analysis?.parsedMessages && result.analysis.parsedMessages.length > 0) {
        const newMessages: ChatMessage[] = result.analysis.parsedMessages.map((pm, index) => ({
          id: `${Date.now()}-${index}`,
          role: pm.role === 'receiver' ? 'me' : 'other',
          content: pm.content,
        }));
        setMessages(prev => [...prev, ...newMessages]);
      } else {
        alert('대화를 추출하지 못했습니다. 직접 입력해주세요.');
      }
    } catch {
      alert('이미지 분석에 실패했습니다.');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAnalyze = async () => {
    if (messages.length === 0) return;

    setIsLoading(true);

    try {
      // 메시지를 형식에 맞게 변환
      const formattedMessages = messages.map(m =>
        `${m.role === 'me' ? '나' : '상대'}: ${m.content}`
      );

      const analysisResult = await chatAnalysis.mutateAsync(formattedMessages);

      if (analysisResult.analysis) {
        setResult(analysisResult.analysis);
      } else if (analysisResult.error) {
        alert(analysisResult.error);
      }
    } catch {
      alert('분석에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'safe': return '안전해요';
      case 'warning': return '주의하세요';
      case 'danger': return '위험해요';
      default: return '분석 완료';
    }
  };

  return (
    <Container>
      <Header>
        <HeaderInner>
          <BackButton to="/">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </BackButton>
          <HeaderTitle>대화 분석</HeaderTitle>
          <AnalyzeButton
            $disabled={messages.length === 0}
            onClick={handleAnalyze}
            disabled={messages.length === 0}
          >
            분석하기
          </AnalyzeButton>
        </HeaderInner>
      </Header>

      <ChatArea ref={chatRef} onClick={() => setSelectedId(null)}>
        {messages.length === 0 ? (
          <EmptyState>
            <EmptyTitle>대화를 입력해주세요</EmptyTitle>
            <EmptyDesc>
              상대방과의 대화를 입력하거나<br />
              스크린샷을 업로드하세요
            </EmptyDesc>
          </EmptyState>
        ) : (
          messages.map((msg, index) => {
            const showLabel = index === 0 || messages[index - 1].role !== msg.role;
            return (
              <MessageWrapper key={msg.id} $isMe={msg.role === 'me'}>
                {showLabel && (
                  <RoleLabel>
                    {msg.role === 'me' ? '나' : '상대방'}
                  </RoleLabel>
                )}
                <MessageBubble
                  $isMe={msg.role === 'me'}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(selectedId === msg.id ? null : msg.id);
                  }}
                >
                  {msg.content}
                  {selectedId === msg.id && (
                    <MessageActions onClick={e => e.stopPropagation()}>
                      <ActionButton onClick={() => handleEdit(msg)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </ActionButton>
                      <ActionButton onClick={() => deleteMessage(msg.id)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </ActionButton>
                    </MessageActions>
                  )}
                </MessageBubble>
              </MessageWrapper>
            );
          })
        )}
      </ChatArea>

      <InputArea>
        <RoleToggle>
          <RoleButton $active={role === 'other'} onClick={() => setRole('other')}>
            상대방
          </RoleButton>
          <RoleButton $active={role === 'me'} onClick={() => setRole('me')}>
            나
          </RoleButton>
        </RoleToggle>
        <InputWrapper>
          <IconButton onClick={() => fileInputRef.current?.click()}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21,15 16,10 5,21" />
            </svg>
          </IconButton>
          <HiddenInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
          />
          <TextArea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={role === 'other' ? '상대방의 메시지를 입력하세요' : '내 메시지를 입력하세요'}
            rows={1}
          />
          <SendButton $active={!!input.trim()} onClick={addMessage}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7-7 7 7" />
            </svg>
          </SendButton>
        </InputWrapper>
      </InputArea>

      {/* 수정 모달 */}
      {editingMessage && (
        <EditOverlay onClick={() => setEditingMessage(null)}>
          <EditSheet onClick={e => e.stopPropagation()}>
            <EditTitle>메시지 수정</EditTitle>
            <EditTextArea
              value={editText}
              onChange={e => setEditText(e.target.value)}
              autoFocus
            />
            <EditActions>
              <EditButton onClick={() => setEditingMessage(null)}>취소</EditButton>
              <EditButton $primary onClick={saveEdit}>저장</EditButton>
            </EditActions>
          </EditSheet>
        </EditOverlay>
      )}

      {/* 로딩 */}
      {isLoading && (
        <LoadingOverlay>
          <Spinner />
          <div>분석 중...</div>
        </LoadingOverlay>
      )}

      {/* 분석 결과 */}
      {result && (
        <ResultOverlay onClick={() => setResult(null)}>
          <ResultCard onClick={e => e.stopPropagation()}>
            <ResultHeader $level={result.riskLevel}>
              <LottieWrapper>
                <Lottie
                  animationData={lottieAnimations[result.riskLevel as keyof typeof lottieAnimations] || lottieAnimations.warning}
                  loop={true}
                />
              </LottieWrapper>
              <ResultStatus $level={result.riskLevel}>
                {getLevelText(result.riskLevel)}
              </ResultStatus>
              <ResultScore>위험도 {result.riskScore}점</ResultScore>
            </ResultHeader>

            <ResultBody>
              {result.analysis && (
                <ResultSection>
                  <ResultSectionTitle>분석 결과</ResultSectionTitle>
                  <ResultSummary>{result.analysis}</ResultSummary>
                </ResultSection>
              )}

              {result.reasons && result.reasons.length > 0 && (
                <ResultSection>
                  <ResultSectionTitle>주의해야 할 점</ResultSectionTitle>
                  {result.reasons.map((reason, i) => (
                    <ResultItem key={i}>
                      <span>{reason}</span>
                    </ResultItem>
                  ))}
                </ResultSection>
              )}
            </ResultBody>

            <CloseButton onClick={() => setResult(null)}>확인</CloseButton>
          </ResultCard>
        </ResultOverlay>
      )}
    </Container>
  );
}
