import { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import { useChatAnalysis, useScreenshotAnalysis } from '@/features/analyze-chat';
import { getCategoryName } from '@/shared/lib/utils';
import type { AnalysisData } from '@/entities/analysis';

const Container = styled.div`
  min-height: 100vh;
  background: #f2f4f8;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 100;
  border-bottom: 1px solid #f2f4f6;
`;

const HeaderInner = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
`;

const BackButton = styled(Link)`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #191f28;
  border-radius: 12px;
  text-decoration: none;

  &:active {
    background: #f2f4f6;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  color: #191f28;
  margin: 0;
`;

const ChatArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
`;

const WelcomeCard = styled.div`
  text-align: center;
  padding: 40px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const WelcomeDesc = styled.p`
  font-size: 14px;
  color: #6b7684;
  margin: 0 0 24px;
  line-height: 1.6;
`;

const SuggestionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  max-width: 400px;
  margin: 0 auto;
`;

const SuggestionBtn = styled.button`
  padding: 14px 12px;
  background: #fff;
  border: 1px solid #e5e8eb;
  border-radius: 12px;
  font-size: 13px;
  color: #191f28;
  text-align: left;
  cursor: pointer;
  line-height: 1.4;

  &:active {
    background: #f9fafb;
  }
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
`;

const MessageGroup = styled.div<{ $isUser: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  gap: 8px;
`;

const MessageBubble = styled.div<{ $isUser: boolean }>`
  max-width: 85%;
  padding: 14px 16px;
  border-radius: ${props => props.$isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px'};
  background: ${props => props.$isUser ? '#3182f6' : '#fff'};
  color: ${props => props.$isUser ? '#fff' : '#191f28'};
  font-size: 15px;
  line-height: 1.6;
  white-space: pre-wrap;
  box-shadow: ${props => props.$isUser ? 'none' : '0 1px 3px rgba(0,0,0,0.06)'};
`;

const AssistantHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

const AssistantIcon = styled.div`
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AssistantName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #6b7684;
`;

const AnalysisCard = styled.div`
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  max-width: 85%;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
`;

const ScoreHeader = styled.div<{ $level: string }>`
  padding: 20px;
  background: ${props =>
    props.$level === 'safe' ? '#e8f7f0' :
    props.$level === 'warning' ? '#fff8e6' : '#ffebee'};
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ScoreCircle = styled.div<{ $level: string }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${props =>
    props.$level === 'safe' ? '#20c997' :
    props.$level === 'warning' ? '#ff9500' : '#f04452'};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
`;

const ScoreInfo = styled.div`
  flex: 1;
`;

const ScoreLabel = styled.div<{ $level: string }>`
  font-size: 18px;
  font-weight: 700;
  color: ${props =>
    props.$level === 'safe' ? '#20c997' :
    props.$level === 'warning' ? '#ff9500' : '#f04452'};
`;

const ScoreDesc = styled.div`
  font-size: 13px;
  color: #6b7684;
  margin-top: 2px;
`;

const AnalysisSection = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f2f4f6;
`;

const SectionTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #6b7684;
  margin-bottom: 8px;
`;

const AnalysisText = styled.div`
  font-size: 14px;
  color: #191f28;
  line-height: 1.6;
`;

const ReasonList = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f2f4f6;
`;

const ReasonItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  background: #ffebee;
  border-radius: 8px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ReasonIcon = styled.div`
  font-size: 16px;
  flex-shrink: 0;
`;

const ReasonText = styled.span`
  font-size: 14px;
  color: #191f28;
  line-height: 1.5;
`;

const PatternList = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f2f4f6;
`;

const PatternItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const PatternText = styled.span`
  font-size: 14px;
  color: #191f28;
`;

const PatternBadge = styled.span<{ $severity: string }>`
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  background: ${props => {
    switch (props.$severity) {
      case 'high': return '#ffebee';
      case 'medium': return '#fff8e6';
      default: return '#e8f4ff';
    }
  }};
  color: ${props => {
    switch (props.$severity) {
      case 'high': return '#f04452';
      case 'medium': return '#ff9500';
      default: return '#3182f6';
    }
  }};
`;

const RecommendationList = styled.div`
  padding: 16px;
`;

const RecommendationItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  color: #191f28;
  line-height: 1.5;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 14px 16px;
  background: #fff;
  border-radius: 18px 18px 18px 4px;
  max-width: 80px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);

  span {
    width: 8px;
    height: 8px;
    background: #adb5bd;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out;

    &:nth-of-type(1) { animation-delay: -0.32s; }
    &:nth-of-type(2) { animation-delay: -0.16s; }
  }

  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
    40% { transform: scale(1); opacity: 1; }
  }
`;

const InputArea = styled.div`
  padding: 12px 16px 24px;
  background: #fff;
  border-top: 1px solid #f2f4f6;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  background: #f2f4f6;
  border-radius: 24px;
  padding: 8px 8px 8px 16px;
`;

const TextArea = styled.textarea`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 15px;
  font-family: inherit;
  line-height: 1.5;
  resize: none;
  color: #191f28;
  max-height: 120px;
  padding: 8px 0;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const SendButton = styled.button<{ $active: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: ${props => props.$active ? '#3182f6' : '#e5e8eb'};
  color: #fff;
  cursor: ${props => props.$active ? 'pointer' : 'default'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s;

  &:active {
    background: ${props => props.$active ? '#1b64da' : '#e5e8eb'};
  }
`;

const ImageButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #f2f4f6;
  color: #6b7684;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s;

  &:hover {
    background: #e5e8eb;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const ErrorMessage = styled.div`
  padding: 16px;
  background: #ffebee;
  border-radius: 12px;
  color: #f04452;
  font-size: 14px;
  margin: 8px 0;
  text-align: center;
`;

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  analysis?: AnalysisData;
  error?: string;
}

const suggestions = [
  '"사랑해, 빨리 만나고 싶어"',
  '"투자 기회가 있어, 같이 하자"',
  '"급하게 돈이 필요해"',
  '"영상통화는 좀 힘들어"',
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chatAnalysis = useChatAnalysis();
  const screenshotAnalysis = useScreenshotAnalysis();

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB 이하여야 합니다');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: '스크린샷 분석 요청',
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    const result = await screenshotAnalysis.mutateAsync(file);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: '',
      analysis: result.analysis,
      error: result.error,
    };

    setIsTyping(false);
    setMessages(prev => [...prev, assistantMessage]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'safe': return '안전';
      case 'warning': return '주의 필요';
      case 'danger': return '위험';
      default: return '분석 중';
    }
  };

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const msgs = messageText.split('\n').filter(line => line.trim());
    const result = await chatAnalysis.mutateAsync(msgs);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: '',
      analysis: result.analysis,
      error: result.error,
    };

    setIsTyping(false);
    setMessages(prev => [...prev, assistantMessage]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
        </HeaderInner>
      </Header>

      <ChatArea ref={chatRef}>
        {messages.length === 0 ? (
          <WelcomeCard>
            <WelcomeDesc>
              상대방과 나눈 대화를 붙여넣으면<br/>
              AI가 로맨스 스캠 위험도를 분석해드려요
            </WelcomeDesc>
            <SuggestionGrid>
              {suggestions.map((s, i) => (
                <SuggestionBtn key={i} onClick={() => handleSend(s)}>
                  {s}
                </SuggestionBtn>
              ))}
            </SuggestionGrid>
          </WelcomeCard>
        ) : (
          <MessageList>
            {messages.map(msg => (
              <MessageGroup key={msg.id} $isUser={msg.type === 'user'}>
                {msg.type === 'assistant' && (
                  <AssistantHeader>
                    <AssistantIcon>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" />
                      </svg>
                    </AssistantIcon>
                    <AssistantName>Enigma AI</AssistantName>
                  </AssistantHeader>
                )}
                {msg.type === 'user' ? (
                  <MessageBubble $isUser={true}>{msg.content}</MessageBubble>
                ) : msg.error ? (
                  <ErrorMessage>{msg.error}</ErrorMessage>
                ) : msg.analysis ? (
                  <AnalysisCard>
                    <ScoreHeader $level={msg.analysis.riskLevel}>
                      <ScoreCircle $level={msg.analysis.riskLevel}>
                        {msg.analysis.riskScore}
                      </ScoreCircle>
                      <ScoreInfo>
                        <ScoreLabel $level={msg.analysis.riskLevel}>
                          {getLevelText(msg.analysis.riskLevel)}
                        </ScoreLabel>
                        <ScoreDesc>{msg.analysis.summary}</ScoreDesc>
                      </ScoreInfo>
                    </ScoreHeader>

                    <AnalysisSection>
                      <SectionTitle>AI 분석</SectionTitle>
                      <AnalysisText>{msg.analysis.analysis}</AnalysisText>
                    </AnalysisSection>

                    {msg.analysis.reasons.length > 0 && (
                      <ReasonList>
                        <SectionTitle>위험 판단 이유</SectionTitle>
                        {msg.analysis.reasons.map((reason, i) => (
                          <ReasonItem key={i}>
                            <ReasonIcon>⚠️</ReasonIcon>
                            <ReasonText>{reason}</ReasonText>
                          </ReasonItem>
                        ))}
                      </ReasonList>
                    )}

                    {msg.analysis.detectedPatterns.length > 0 && (
                      <PatternList>
                        <SectionTitle>감지된 패턴</SectionTitle>
                        {msg.analysis.detectedPatterns.map((pattern, i) => (
                          <PatternItem key={i}>
                            <PatternText>{pattern.pattern}</PatternText>
                            <PatternBadge $severity={pattern.severity}>
                              {getCategoryName(pattern.category)}
                            </PatternBadge>
                          </PatternItem>
                        ))}
                      </PatternList>
                    )}

                    {msg.analysis.recommendations.length > 0 && (
                      <RecommendationList>
                        <SectionTitle>권장 행동</SectionTitle>
                        {msg.analysis.recommendations.map((rec, i) => (
                          <RecommendationItem key={i}>
                            <span>💡</span>
                            <span>{rec}</span>
                          </RecommendationItem>
                        ))}
                      </RecommendationList>
                    )}
                  </AnalysisCard>
                ) : (
                  <MessageBubble $isUser={false}>{msg.content}</MessageBubble>
                )}
              </MessageGroup>
            ))}
            {isTyping && (
              <MessageGroup $isUser={false}>
                <AssistantHeader>
                  <AssistantIcon>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" />
                    </svg>
                  </AssistantIcon>
                  <AssistantName>Enigma AI</AssistantName>
                </AssistantHeader>
                <TypingIndicator>
                  <span /><span /><span />
                </TypingIndicator>
              </MessageGroup>
            )}
          </MessageList>
        )}
      </ChatArea>

      <InputArea>
        <InputWrapper>
          <ImageButton onClick={() => fileInputRef.current?.click()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21,15 16,10 5,21" />
            </svg>
          </ImageButton>
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
            placeholder="대화 내용을 붙여넣거나 스크린샷을 업로드하세요"
            rows={1}
          />
          <SendButton $active={!!input.trim()} onClick={() => handleSend()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </SendButton>
        </InputWrapper>
      </InputArea>
    </Container>
  );
}
