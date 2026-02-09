import { useState, useRef, useEffect } from 'react';
import Lottie from 'lottie-react';
import { useChatAnalysis, useScreenshotAnalysis } from '@/features/analyze-chat';
import { ChevronLeftIcon } from '@/shared/ui/icons';
import type { AnalysisData } from '@/entities/analysis';

import safeAnimation from '@/shared/assets/lottie/safe.json';
import warningAnimation from '@/shared/assets/lottie/warning.json';
import dangerAnimation from '@/shared/assets/lottie/danger.json';
import chatAnalyzeAnimation from '@/shared/assets/lottie/chat-analyze.json';
import screenshotScanAnimation from '@/shared/assets/lottie/screenshot-scan.json';

import {
  Container,
  Header,
  HeaderInner,
  BackButton,
  HeaderTitle,
  AnalyzeButton,
  ChatArea,
  EmptyState,
  EmptyTitle,
  EmptyDesc,
  MessageWrapper,
  MessageBubble,
  MessageActions,
  ActionButton,
  RoleLabel,
  InputArea,
  RoleToggle,
  RoleButton,
  InputWrapper,
  TextArea,
  IconButton,
  SendButton,
  HiddenInput,
  ResultOverlay,
  ResultCard,
  ResultHeader,
  LottieWrapper,
  ResultStatus,
  ResultScore,
  ResultBody,
  ResultSummary,
  ResultSection,
  ResultSectionTitle,
  ResultItem,
  CloseButton,
  EditOverlay,
  EditSheet,
  EditTitle,
  EditTextArea,
  EditActions,
  EditButton,
  LoadingOverlay,
  LoadingText,
} from './ChatPage.styles';

// Types
interface ChatMessage {
  id: string;
  role: 'me' | 'other';
  content: string;
}

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
  const [loadingType, setLoadingType] = useState<'chat' | 'screenshot'>('chat');

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

    setLoadingType('screenshot');
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

    setLoadingType('chat');
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
            <ChevronLeftIcon />
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
          <div style={{ width: 200, height: loadingType === 'screenshot' ? 200 : 150 }}>
            <Lottie animationData={loadingType === 'screenshot' ? screenshotScanAnimation : chatAnalyzeAnimation} loop />
          </div>
          <LoadingText>{loadingType === 'screenshot' ? '스크린샷 텍스트 추출 중...' : '분석 중...'}</LoadingText>
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
