'use client';

import { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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
`;

const WelcomeCard = styled.div`
  text-align: center;
  padding: 40px 20px;
`;

const WelcomeIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WelcomeTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #191f28;
  margin: 0 0 8px;
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

const RagBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background: #e8f4ff;
  border-radius: 6px;
  font-size: 12px;
  color: #3182f6;
  margin-top: 12px;
`;

const InterpretationSection = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f2f4f6;
  background: #fafbfc;
`;

const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StepItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #4e5968;
`;

const StepNumber = styled.span`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3182f6;
  color: white;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ParsedMessageSection = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f2f4f6;
`;

const MessagePreview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
`;

const MessageItem = styled.div<{ $role: string }>`
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  background: ${props =>
    props.$role === 'sender' ? '#ffebee' :
    props.$role === 'receiver' ? '#e8f4ff' : '#f5f5f5'};
`;

const RoleTag = styled.span<{ $role: string }>`
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  flex-shrink: 0;
  background: ${props =>
    props.$role === 'sender' ? '#f04452' :
    props.$role === 'receiver' ? '#3182f6' : '#8b95a1'};
  color: white;
`;

const MessageContent = styled.span`
  font-size: 13px;
  color: #191f28;
  line-height: 1.5;
`;

const RagSection = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f2f4f6;
`;

const RagCard = styled.div`
  padding: 12px;
  background: #fff8e6;
  border-radius: 8px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const RagTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #ff9500;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const RagDetail = styled.div`
  font-size: 12px;
  color: #6b7684;
  line-height: 1.5;
`;

const CaseCard = styled.div`
  padding: 12px;
  background: #ffebee;
  border-radius: 8px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const CaseTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #f04452;
  margin-bottom: 4px;
`;

const CaseDetail = styled.div`
  font-size: 12px;
  color: #6b7684;
  line-height: 1.5;
`;

const DamageAmount = styled.span`
  font-weight: 600;
  color: #f04452;
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

  &:active {
    background: #d1d5db;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f2f4f6;
`;

const ModalTitle = styled.h3`
  font-size: 17px;
  font-weight: 600;
  color: #191f28;
  margin: 0;
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #f2f4f6;
  color: #6b7684;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #e5e8eb;
  }
`;

const ModalImageWrapper = styled.div`
  padding: 20px;
  background: #f9fafb;
`;

const PreviewImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 12px;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  padding: 16px 20px;
`;

const ModalButton = styled.button<{ $primary?: boolean }>`
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  background: ${props => props.$primary ? '#3182f6' : '#f2f4f6'};
  color: ${props => props.$primary ? 'white' : '#6b7684'};

  &:hover {
    background: ${props => props.$primary ? '#1b64da' : '#e5e8eb'};
  }

  &:disabled {
    background: #e5e8eb;
    color: #adb5bd;
    cursor: not-allowed;
  }
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

interface ParsedMessage {
  role: 'sender' | 'receiver' | 'unknown';
  content: string;
}

interface RagContext {
  matched_phrases: Array<{
    id: string;
    text: string;
    category: string;
    severity: number;
    usage_count: number;
  }>;
  similar_cases: Array<{
    id: string;
    title: string;
    description: string;
    damage_amount: number;
    platform: string;
  }>;
  risk_indicators: string[];
  total_reports: number;
}

interface AnalysisData {
  riskLevel: 'safe' | 'warning' | 'danger';
  riskScore: number;
  summary: string;
  analysis: string;
  reasons: string[];
  detectedPatterns: Array<{
    pattern: string;
    category: string;
    severity: string;
  }>;
  recommendations: string[];
  savedToRag: boolean;
  interpretationSteps?: string[];
  parsedMessages?: ParsedMessage[];
  ragContext?: RagContext;
}

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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('파일 크기는 10MB 이하여야 합니다');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        setShowImageModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setShowImageModal(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzingImage(true);

    // 사용자 메시지 표시
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: '📷 스크린샷 분석 요청',
    };
    setMessages(prev => [...prev, userMessage]);
    setShowImageModal(false);
    setIsTyping(true);

    const result = await analyzeScreenshot(selectedImage);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: '',
      analysis: result.analysis,
      error: result.error,
    };

    setIsTyping(false);
    setIsAnalyzingImage(false);
    setMessages(prev => [...prev, assistantMessage]);
    removeImage();
  };

  const analyzeScreenshot = async (file: File): Promise<{ analysis?: AnalysisData; error?: string }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/api/chat/analyze-screenshot`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '스크린샷 분석 중 오류가 발생했습니다');
      }

      if (data.success && data.data) {
        const detectedPatterns = (data.data.detectedPatterns || []).map((p: string | { category: string; keyword: string }) => {
          if (typeof p === 'string') {
            return { pattern: p, category: p, severity: 'medium' };
          }
          return {
            pattern: p.keyword || p.category,
            category: p.category,
            severity: 'medium'
          };
        });

        return {
          analysis: {
            riskLevel: data.data.riskScore < 30 ? 'safe' : data.data.riskScore < 60 ? 'warning' : 'danger',
            riskScore: data.data.riskScore,
            summary: data.data.riskCategory || '스크린샷 분석 완료',
            analysis: data.data.aiAnalysis || '',
            reasons: data.data.warningSigns || [],
            detectedPatterns,
            recommendations: data.data.recommendations || [],
            savedToRag: false,
            interpretationSteps: data.data.interpretationSteps || [],
            parsedMessages: data.data.parsedMessages || [],
            ragContext: data.data.ragContext || null,
          }
        };
      } else {
        throw new Error(data.error || '분석 실패');
      }
    } catch (err) {
      return { error: err instanceof Error ? err.message : '서버 연결에 실패했습니다' };
    }
  };

  const analyzeWithAI = async (text: string): Promise<{ analysis?: AnalysisData; error?: string }> => {
    try {
      const messages = text.split('\n').filter(line => line.trim());
      const response = await fetch(`${API_URL}/api/chat/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '분석 중 오류가 발생했습니다');
      }

      if (data.success && data.data) {
        const detectedPatterns = (data.data.detectedPatterns || []).map((p: string | { category: string; keyword: string }) => {
          if (typeof p === 'string') {
            return { pattern: p, category: p, severity: 'medium' };
          }
          return {
            pattern: p.keyword || p.category,
            category: p.category,
            severity: 'medium'
          };
        });

        return {
          analysis: {
            riskLevel: data.data.riskScore < 30 ? 'safe' : data.data.riskScore < 60 ? 'warning' : 'danger',
            riskScore: data.data.riskScore,
            summary: data.data.riskCategory || '분석 완료',
            analysis: data.data.aiAnalysis || '',
            reasons: data.data.warningSigns || [],
            detectedPatterns,
            recommendations: data.data.recommendations || [],
            savedToRag: false,
            interpretationSteps: data.data.interpretationSteps || [],
            parsedMessages: data.data.parsedMessages || [],
            ragContext: data.data.ragContext || null,
          }
        };
      } else {
        throw new Error(data.error || '분석 실패');
      }
    } catch (err) {
      return { error: err instanceof Error ? err.message : '서버 연결에 실패했습니다' };
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

    // 사용자 메시지 표시
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const result = await analyzeWithAI(messageText);

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

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      love_bombing: '러브바밍',
      financial: '금전 요구',
      financial_request: '금전 요구',
      urgency: '긴급성',
      avoidance: '회피 행동',
      inconsistency: '일관성 없음',
      isolation: '고립 유도',
      sympathy: '동정심 유발',
      romance_scam: '로맨스 스캠',
      sob_story: '동정심 유발',
      future_faking: '미래 약속',
      identity: '신원 사칭',
    };
    return names[category] || category;
  };

  return (
    <Container>
      <Header>
        <HeaderInner>
          <BackButton href="/">
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
            <WelcomeIcon>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" />
                <path d="M8 12H8.01M12 12H12.01M16 12H16.01" strokeLinecap="round" />
              </svg>
            </WelcomeIcon>
            <WelcomeTitle>AI 대화 분석</WelcomeTitle>
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
                    <AssistantName>러브가드 AI</AssistantName>
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

                    {/* 분석 과정 표시 */}
                    {msg.analysis.interpretationSteps && msg.analysis.interpretationSteps.length > 0 && (
                      <InterpretationSection>
                        <SectionTitle>🔍 분석 과정</SectionTitle>
                        <StepList>
                          {msg.analysis.interpretationSteps.map((step, i) => (
                            <StepItem key={i}>
                              <StepNumber>{i + 1}</StepNumber>
                              <span>{step}</span>
                            </StepItem>
                          ))}
                        </StepList>
                      </InterpretationSection>
                    )}

                    {/* 파싱된 메시지 (발신자/수신자 구분) */}
                    {msg.analysis.parsedMessages && msg.analysis.parsedMessages.length > 0 && (
                      <ParsedMessageSection>
                        <SectionTitle>📨 메시지 분석</SectionTitle>
                        <MessagePreview>
                          {msg.analysis.parsedMessages.slice(0, 5).map((pm, i) => (
                            <MessageItem key={i} $role={pm.role}>
                              <RoleTag $role={pm.role}>
                                {pm.role === 'sender' ? '상대방' : pm.role === 'receiver' ? '나' : '불명'}
                              </RoleTag>
                              <MessageContent>{pm.content}</MessageContent>
                            </MessageItem>
                          ))}
                          {msg.analysis.parsedMessages.length > 5 && (
                            <MessageContent style={{ textAlign: 'center', color: '#8b95a1', padding: '8px' }}>
                              +{msg.analysis.parsedMessages.length - 5}개 더...
                            </MessageContent>
                          )}
                        </MessagePreview>
                      </ParsedMessageSection>
                    )}

                    {/* RAG 매칭 패턴 */}
                    {msg.analysis.ragContext && msg.analysis.ragContext.matched_phrases.length > 0 && (
                      <RagSection>
                        <SectionTitle>📊 DB 매칭 패턴</SectionTitle>
                        {msg.analysis.ragContext.matched_phrases.slice(0, 3).map((phrase, i) => (
                          <RagCard key={i}>
                            <RagTitle>
                              <span>⚠️</span>
                              {phrase.text}
                            </RagTitle>
                            <RagDetail>
                              카테고리: {getCategoryName(phrase.category)} |
                              위험도: {phrase.severity}/10 |
                              {phrase.usage_count}건의 스캠에서 사용
                            </RagDetail>
                          </RagCard>
                        ))}
                      </RagSection>
                    )}

                    {/* RAG 유사 사례 */}
                    {msg.analysis.ragContext && msg.analysis.ragContext.similar_cases.length > 0 && (
                      <RagSection>
                        <SectionTitle>📋 유사 스캠 사례</SectionTitle>
                        {msg.analysis.ragContext.similar_cases.slice(0, 2).map((caseItem, i) => (
                          <CaseCard key={i}>
                            <CaseTitle>{caseItem.title}</CaseTitle>
                            <CaseDetail>
                              {caseItem.description.slice(0, 100)}...
                            </CaseDetail>
                            <CaseDetail style={{ marginTop: '4px' }}>
                              피해액: <DamageAmount>{caseItem.damage_amount?.toLocaleString()}원</DamageAmount> |
                              플랫폼: {caseItem.platform}
                            </CaseDetail>
                          </CaseCard>
                        ))}
                      </RagSection>
                    )}

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

                    {msg.analysis.savedToRag && (
                      <RecommendationList>
                        <RagBadge>
                          <span>🔒</span>
                          <span>위험 패턴이 데이터베이스에 저장되었습니다</span>
                        </RagBadge>
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
                  <AssistantName>러브가드 AI</AssistantName>
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
          {/* 이미지 업로드 버튼 */}
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

      {/* 이미지 분석 모달 */}
      {showImageModal && imagePreview && (
        <ModalOverlay onClick={() => setShowImageModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>스크린샷 분석</ModalTitle>
              <CloseButton onClick={() => setShowImageModal(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </CloseButton>
            </ModalHeader>
            <ModalImageWrapper>
              <PreviewImage src={imagePreview} alt="분석할 스크린샷" />
            </ModalImageWrapper>
            <ModalActions>
              <ModalButton onClick={removeImage}>
                취소
              </ModalButton>
              <ModalButton $primary onClick={handleAnalyzeImage} disabled={isAnalyzingImage}>
                {isAnalyzingImage ? '분석 중...' : '분석하기'}
              </ModalButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}
