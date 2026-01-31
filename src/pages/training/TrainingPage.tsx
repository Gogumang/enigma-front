import { useState, useRef, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useNavigate } from '@tanstack/react-router';
import { usePersonas, useStartSession, useSendMessage, useEndSession } from '@/features/immune-training';

const MAX_TURNS = 10;

interface Persona {
  id: string;
  name: string;
  occupation: string;
  difficulty: number;
  description: string;
  goal: string;
}

interface Message {
  role: 'user' | 'scammer';
  content: string;
  timestamp: string;
}

interface Post {
  id: string;
  type: 'photo' | 'status' | 'life_event';
  content: string;
  image?: string;
  likes: number;
  comments: number;
  time: string;
}

interface SessionData {
  sessionId: string;
  persona: {
    id: string;
    name: string;
    difficulty: string;
  };
  openingMessage: string;
  hint: string;
}

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const typing = keyframes`
  0%, 60%, 100% { opacity: 0.3; }
  30% { opacity: 1; }
`;

const blink = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// ========== 전체 화면 컨테이너 ==========
const FullScreenContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #18191a;
  z-index: 9999;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

// ========== 상단 헤더 ==========
const TopHeader = styled.div`
  background: #242526;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #3a3b3c;
  flex-shrink: 0;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: #1877f2;
`;

const SearchBar = styled.div`
  flex: 1;
  max-width: 300px;
  padding: 8px 12px;
  background: #3a3b3c;
  border-radius: 20px;
  color: #b0b3b8;
  font-size: 14px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
`;

const TurnCounter = styled.div`
  padding: 6px 12px;
  background: #3a3b3c;
  border-radius: 16px;
  font-size: 13px;
  color: #e4e6eb;

  span {
    color: #1877f2;
    font-weight: 600;
  }
`;

const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #3a3b3c;
  border: none;
  color: #e4e6eb;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #4a4b4c;
  }
`;

// ========== 메인 컨텐츠 ==========
const MainContent = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

// ========== 좌측 프로필 영역 ==========
const LeftSidebar = styled.div`
  width: 280px;
  background: #242526;
  border-right: 1px solid #3a3b3c;
  overflow-y: auto;
  flex-shrink: 0;

  @media (max-width: 900px) {
    display: none;
  }
`;

const ProfileCard = styled.div`
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #3a3b3c;
`;

const ProfileCover = styled.div<{ $image?: string }>`
  height: 80px;
  background: ${props => props.$image ? `url(${props.$image})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin-bottom: -40px;
`;

const ProfileAvatar = styled.div<{ $image?: string }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.$image ? `url(${props.$image})` : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'};
  background-size: cover;
  background-position: center;
  border: 4px solid #242526;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
`;

const ProfileName = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #e4e6eb;
  margin-bottom: 4px;
`;

const ProfileBio = styled.div`
  font-size: 13px;
  color: #b0b3b8;
  line-height: 1.4;
`;

const ProfileStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 16px;
  border-bottom: 1px solid #3a3b3c;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #e4e6eb;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #b0b3b8;
`;

const ProfileInfo = styled.div`
  padding: 16px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  font-size: 14px;
  color: #b0b3b8;

  span {
    color: #e4e6eb;
  }
`;

// ========== 중앙 피드 영역 ==========
const FeedArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #18191a;

  @media (max-width: 600px) {
    padding: 8px;
  }
`;

const PostCard = styled.div`
  background: #242526;
  border-radius: 12px;
  margin-bottom: 16px;
  animation: ${fadeIn} 0.4s ease;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
`;

const PostAvatar = styled.div<{ $image?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.$image ? `url(${props.$image})` : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'};
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

const PostAuthor = styled.div`
  flex: 1;
`;

const PostAuthorName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #e4e6eb;
`;

const PostTime = styled.div`
  font-size: 12px;
  color: #b0b3b8;
`;

const PostContent = styled.div`
  padding: 0 16px 12px;
  font-size: 15px;
  color: #e4e6eb;
  line-height: 1.5;
`;

const PostImage = styled.div<{ $src: string }>`
  width: 100%;
  height: 300px;
  background: url(${props => props.$src}) center/cover;
  background-color: #3a3b3c;
`;

const PostActions = styled.div`
  display: flex;
  padding: 8px 16px;
  border-top: 1px solid #3a3b3c;
  gap: 4px;
`;

const PostAction = styled.button`
  flex: 1;
  padding: 8px;
  background: none;
  border: none;
  border-radius: 8px;
  color: #b0b3b8;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    background: #3a3b3c;
  }
`;

// ========== 우측 메신저 영역 ==========
const MessengerArea = styled.div`
  width: 360px;
  background: #242526;
  border-left: 1px solid #3a3b3c;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  @media (max-width: 600px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    z-index: 100;
  }
`;

const MessengerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid #3a3b3c;
`;

const MessengerAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`;

const MessengerInfo = styled.div`
  flex: 1;
`;

const MessengerName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #e4e6eb;
`;

const MessengerStatus = styled.div`
  font-size: 12px;
  color: #31a24c;
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: #31a24c;
    border-radius: 50%;
  }
`;

const MessengerMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MessageRow = styled.div<{ $mine: boolean }>`
  display: flex;
  justify-content: ${props => props.$mine ? 'flex-end' : 'flex-start'};
  animation: ${slideIn} 0.3s ease;
`;

const MessageBubble = styled.div<{ $mine: boolean }>`
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 18px;
  background: ${props => props.$mine ? '#1877f2' : '#3a3b3c'};
  color: #e4e6eb;
  font-size: 14px;
  line-height: 1.4;
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 4px;
  padding: 12px 14px;
  background: #3a3b3c;
  border-radius: 18px;
  width: fit-content;

  span {
    width: 6px;
    height: 6px;
    background: #b0b3b8;
    border-radius: 50%;
    animation: ${typing} 1.4s infinite;

    &:nth-of-type(2) { animation-delay: 0.2s; }
    &:nth-of-type(3) { animation-delay: 0.4s; }
  }
`;

const HintBox = styled.div`
  margin: 8px 0;
  padding: 10px 12px;
  background: rgba(255, 193, 7, 0.15);
  border-radius: 12px;
  border-left: 3px solid #ffc107;
`;

const HintText = styled.div`
  font-size: 12px;
  color: #ffc107;
  line-height: 1.4;
`;

const MessengerInput = styled.form`
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid #3a3b3c;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px 14px;
  background: #3a3b3c;
  border: none;
  border-radius: 20px;
  color: #e4e6eb;
  font-size: 14px;
  outline: none;

  &::placeholder {
    color: #b0b3b8;
  }
`;

const SendButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #1877f2;
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    background: #3a3b3c;
    cursor: not-allowed;
  }
`;

// ========== 로그인 화면 ==========
const LoginScreen = styled.div`
  flex: 1;
  background: linear-gradient(180deg, #1877f2 0%, #0d47a1 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const LoginLogo = styled.div`
  font-size: 48px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 8px;
`;

const LoginTagline = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 32px;
`;

const LoginBox = styled.div`
  width: 100%;
  max-width: 320px;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
`;

const LoginInputWrapper = styled.div`
  margin-bottom: 12px;
`;

const LoginLabel = styled.div`
  font-size: 12px;
  color: #65676b;
  margin-bottom: 6px;
`;

const LoginInput = styled.div<{ $focused?: boolean }>`
  padding: 12px 14px;
  background: #f0f2f5;
  border: 2px solid ${props => props.$focused ? '#1877f2' : 'transparent'};
  border-radius: 8px;
  font-size: 15px;
  color: #1c1e21;
  min-height: 44px;
  display: flex;
  align-items: center;
`;

const Cursor = styled.span`
  width: 2px;
  height: 18px;
  background: #1877f2;
  margin-left: 2px;
  animation: ${blink} 1s infinite;
`;

const LoginButton = styled.button<{ $loading?: boolean }>`
  width: 100%;
  padding: 14px;
  background: ${props => props.$loading ? '#65676b' : '#1877f2'};
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const Spinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

// ========== 결과 화면 ==========
const ResultScreen = styled.div`
  flex: 1;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  overflow-y: auto;
`;

const ResultCard = styled.div`
  width: 100%;
  max-width: 400px;
  background: #242526;
  border-radius: 20px;
  padding: 32px 24px;
  text-align: center;
  animation: ${fadeIn} 0.5s ease;
`;

const ResultTitle = styled.div`
  font-size: 14px;
  color: #b0b3b8;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const ScoreCircle = styled.div<{ $score: number }>`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: conic-gradient(
    ${props => props.$score >= 80 ? '#20c997' : props.$score >= 50 ? '#ffc107' : '#f44336'}
    ${props => props.$score * 3.6}deg,
    #3a3b3c ${props => props.$score * 3.6}deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px auto;
`;

const ScoreInner = styled.div`
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: #242526;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ScoreValue = styled.div<{ $score: number }>`
  font-size: 48px;
  font-weight: 800;
  color: ${props => props.$score >= 80 ? '#20c997' : props.$score >= 50 ? '#ffc107' : '#f44336'};
`;

const ScoreLabel = styled.div`
  font-size: 14px;
  color: #b0b3b8;
`;

const ResultGrade = styled.div<{ $score: number }>`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.$score >= 80 ? '#20c997' : props.$score >= 50 ? '#ffc107' : '#f44336'};
  margin-bottom: 16px;
`;

const ResultMessage = styled.div`
  font-size: 15px;
  color: #e4e6eb;
  line-height: 1.6;
  margin-bottom: 24px;
`;

const ResultStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
`;

const ResultStatBox = styled.div`
  padding: 12px;
  background: #3a3b3c;
  border-radius: 12px;
`;

const ResultStatValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #1877f2;
`;

const ResultStatLabel = styled.div`
  font-size: 11px;
  color: #b0b3b8;
  margin-top: 4px;
`;

const TacticsSection = styled.div`
  text-align: left;
  margin-bottom: 24px;
`;

const TacticsTitle = styled.div`
  font-size: 13px;
  color: #b0b3b8;
  margin-bottom: 8px;
`;

const TacticsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const TacticTag = styled.span`
  padding: 4px 10px;
  background: rgba(24, 119, 242, 0.2);
  border-radius: 12px;
  font-size: 12px;
  color: #1877f2;
`;

const RetryButton = styled.button`
  width: 100%;
  padding: 14px;
  background: #1877f2;
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #166fe5;
  }
`;

// ========== 페르소나 선택 ==========
const PersonaSelectScreen = styled.div`
  flex: 1;
  background: #18191a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  overflow-y: auto;
`;

const PersonaTitle = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: #e4e6eb;
  margin-bottom: 8px;
`;

const PersonaSubtitle = styled.div`
  font-size: 14px;
  color: #b0b3b8;
  margin-bottom: 32px;
`;

const PersonaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  width: 100%;
  max-width: 600px;
`;

const PersonaCard = styled.button`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: #242526;
  border: 2px solid #3a3b3c;
  border-radius: 16px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;

  &:hover {
    border-color: #1877f2;
    background: #2d2e2f;
  }
`;

const PersonaAvatar = styled.div<{ $color: string }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
`;

const PersonaInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const PersonaName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #e4e6eb;
  margin-bottom: 4px;
`;

const PersonaOccupation = styled.div`
  font-size: 13px;
  color: #b0b3b8;
`;

const DifficultyBadge = styled.span<{ $level: number }>`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  background: ${props =>
    props.$level <= 2 ? 'rgba(32, 201, 151, 0.2)' :
    props.$level === 3 ? 'rgba(255, 193, 7, 0.2)' :
    'rgba(244, 67, 54, 0.2)'};
  color: ${props =>
    props.$level <= 2 ? '#20c997' :
    props.$level === 3 ? '#ffc107' :
    '#f44336'};
`;

const LoadingScreen = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b0b3b8;
  font-size: 16px;
`;

// ========== 컴포넌트 ==========
export default function TrainingPage() {
  const navigate = useNavigate();

  // 상태
  const [phase, setPhase] = useState<'select' | 'login' | 'chat' | 'result'>('select');
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);

  // 로그인 애니메이션
  const [emailText, setEmailText] = useState('');
  const [passwordText, setPasswordText] = useState('');
  const [loginPhase, setLoginPhase] = useState<'idle' | 'email' | 'password' | 'loading'>('idle');

  // 채팅
  const [session, setSession] = useState<SessionData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [turnCount, setTurnCount] = useState(0);

  // 결과
  const [result, setResult] = useState<{
    finalScore: number;
    totalTurns: number;
    durationSeconds: number;
    tacticsEncountered: string[];
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const targetEmail = 'user@enigma.kr';
  const targetPassword = '••••••••••';

  // TanStack Query hooks
  const personasQuery = usePersonas();
  const startSessionMutation = useStartSession();
  const sendMessageMutation = useSendMessage();
  const endSessionMutation = useEndSession();

  const personas = personasQuery.data || [];

  // 페르소나 데이터
  const personaProfiles: Record<string, { emoji: string; color: string; avatar: string; cover: string; posts: Post[] }> = {
    military_james: {
      emoji: '🎖️',
      color: 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      cover: 'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=600&h=200&fit=crop',
      posts: [
        { id: '1', type: 'photo', content: '오늘도 평화로운 하루. 고향이 그립다... 🇺🇸', image: 'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=500&h=300&fit=crop', likes: 234, comments: 45, time: '2시간 전' },
        { id: '2', type: 'status', content: '딸아이 생각이 많이 나는 밤이다. 곧 만나자 Emma 💕', likes: 189, comments: 32, time: '어제' },
        { id: '3', type: 'life_event', content: '🎖️ 미 육군 대령으로 25년 복무 중', likes: 567, comments: 89, time: '1주일 전' },
      ]
    },
    crypto_sophia: {
      emoji: '💎',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
      cover: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=200&fit=crop',
      posts: [
        { id: '1', type: 'photo', content: '오늘 수익 +$15,000 💰 비트코인 최고!', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&h=300&fit=crop', likes: 892, comments: 156, time: '3시간 전' },
        { id: '2', type: 'status', content: '투자는 타이밍이 전부예요. 지금이 기회! 📈', likes: 445, comments: 78, time: '어제' },
        { id: '3', type: 'photo', content: '싱가포르 마리나베이 뷰 🌃', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=500&h=300&fit=crop', likes: 1203, comments: 234, time: '3일 전' },
      ]
    },
    sick_minsu: {
      emoji: '🏥',
      color: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
      cover: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=200&fit=crop',
      posts: [
        { id: '1', type: 'status', content: '엄마 수술 잘 끝났어요. 기도해주신 분들 감사합니다 🙏', likes: 156, comments: 67, time: '5시간 전' },
        { id: '2', type: 'photo', content: '병원 옥상에서 본 석양...', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&h=300&fit=crop', likes: 89, comments: 23, time: '1일 전' },
        { id: '3', type: 'status', content: '힘든 시간이지만 버텨야지... 긍정적으로 생각하자', likes: 234, comments: 45, time: '3일 전' },
      ]
    },
    engineer_david: {
      emoji: '🛢️',
      color: 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
      cover: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=600&h=200&fit=crop',
      posts: [
        { id: '1', type: 'photo', content: '북해 플랫폼에서 보내는 일상 🌊', image: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=500&h=300&fit=crop', likes: 345, comments: 67, time: '4시간 전' },
        { id: '2', type: 'status', content: '한국 음식이 너무 먹고 싶다... 김치찌개 🍲', likes: 178, comments: 34, time: '어제' },
        { id: '3', type: 'life_event', content: '🛢️ 해양 플랫폼 엔지니어 5년차', likes: 289, comments: 56, time: '1주일 전' },
      ]
    },
  };

  // 타이핑 애니메이션
  const typeText = useCallback((
    text: string,
    setText: (t: string) => void,
    onComplete: () => void,
    delay: number = 80
  ) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 300);
      }
    }, delay + Math.random() * 40);
    return () => clearInterval(interval);
  }, []);

  // 로그인 애니메이션
  useEffect(() => {
    if (phase !== 'login') return;
    const timer = setTimeout(() => setLoginPhase('email'), 800);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (loginPhase !== 'email') return;
    return typeText(targetEmail, setEmailText, () => setLoginPhase('password'), 60);
  }, [loginPhase, typeText]);

  useEffect(() => {
    if (loginPhase !== 'password') return;
    return typeText(targetPassword, setPasswordText, () => {
      setTimeout(() => setLoginPhase('loading'), 500);
    }, 100);
  }, [loginPhase, typeText]);

  useEffect(() => {
    if (loginPhase !== 'loading' || !selectedPersonaId) return;
    const timer = setTimeout(async () => {
      await startSession(selectedPersonaId);
      setPhase('chat');
    }, 1500);
    return () => clearTimeout(timer);
  }, [loginPhase, selectedPersonaId]);

  // 메시지 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSelectPersona = (personaId: string) => {
    setSelectedPersonaId(personaId);
    setEmailText('');
    setPasswordText('');
    setLoginPhase('idle');
    setPhase('login');
  };

  const startSession = async (personaId: string) => {
    try {
      const data = await startSessionMutation.mutateAsync(personaId);
      setSession(data);
      setMessages([{
        role: 'scammer',
        content: data.openingMessage,
        timestamp: new Date().toISOString(),
      }]);
      setCurrentHint('상대방이 먼저 말을 걸어왔습니다. 주의 깊게 대화해보세요.');
      setTurnCount(0);

      // 해당 페르소나의 게시물 설정
      const profile = personaProfiles[personaId];
      if (profile) {
        setPosts(profile.posts);
      }
    } catch (err) {
      console.error('Failed to start session:', err);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !session || sending) return;

    const userMessage = input.trim();
    setInput('');
    setSending(true);

    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    }]);

    setIsTyping(true);

    try {
      const data = await sendMessageMutation.mutateAsync({
        sessionId: session.sessionId,
        message: userMessage,
      });

      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

      setMessages(prev => [...prev, {
        role: 'scammer',
        content: data.scammerMessage,
        timestamp: new Date().toISOString(),
      }]);

      const newTurnCount = data.turnCount || turnCount + 1;
      setTurnCount(newTurnCount);

      if (data.hint) {
        setCurrentHint(data.hint);
      }

      // 10턴 후 자동 종료
      if (newTurnCount >= MAX_TURNS) {
        setTimeout(() => endSession(), 1000);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsTyping(false);
      setSending(false);
    }
  };

  const endSession = async () => {
    if (!session) return;

    try {
      const data = await endSessionMutation.mutateAsync({
        sessionId: session.sessionId,
        reason: turnCount >= MAX_TURNS ? 'completed' : 'user_ended',
      });
      setResult(data);
      setPhase('result');
    } catch (err) {
      console.error('Failed to end session:', err);
    }
  };

  const reset = () => {
    setPhase('select');
    setSelectedPersonaId(null);
    setSession(null);
    setMessages([]);
    setPosts([]);
    setInput('');
    setCurrentHint(null);
    setTurnCount(0);
    setResult(null);
    setEmailText('');
    setPasswordText('');
    setLoginPhase('idle');
  };

  const handleClose = () => navigate({ to: '/' });

  const getGradeText = (score: number) => {
    if (score >= 90) return '완벽한 대응!';
    if (score >= 80) return '훌륭해요!';
    if (score >= 70) return '잘했어요';
    if (score >= 50) return '조금 더 주의하세요';
    return '위험해요!';
  };

  const selectedPersona = personas.find((p: Persona) => p.id === selectedPersonaId);
  const profile = selectedPersonaId ? personaProfiles[selectedPersonaId] : null;

  // 로딩
  if (personasQuery.isLoading && phase === 'select') {
    return (
      <FullScreenContainer>
        <LoadingScreen>로딩 중...</LoadingScreen>
      </FullScreenContainer>
    );
  }

  // 페르소나 선택
  if (phase === 'select') {
    return (
      <FullScreenContainer>
        <TopHeader>
          <Logo>fakebok</Logo>
          <HeaderRight>
            <CloseButton onClick={handleClose}>✕</CloseButton>
          </HeaderRight>
        </TopHeader>
        <PersonaSelectScreen>
          <PersonaTitle>스캐머를 선택하세요</PersonaTitle>
          <PersonaSubtitle>10번의 대화를 통해 로맨스 스캠 대응력을 테스트합니다</PersonaSubtitle>
          <PersonaGrid>
            {personas.map((persona: Persona) => {
              const p = personaProfiles[persona.id];
              return (
                <PersonaCard key={persona.id} onClick={() => handleSelectPersona(persona.id)}>
                  <PersonaAvatar $color={p?.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}>
                    {p?.emoji || '👤'}
                  </PersonaAvatar>
                  <PersonaInfo>
                    <PersonaName>{persona.name}</PersonaName>
                    <PersonaOccupation>{persona.occupation}</PersonaOccupation>
                  </PersonaInfo>
                  <DifficultyBadge $level={persona.difficulty}>
                    {persona.difficulty <= 2 ? '쉬움' : persona.difficulty === 3 ? '보통' : '어려움'}
                  </DifficultyBadge>
                </PersonaCard>
              );
            })}
          </PersonaGrid>
        </PersonaSelectScreen>
      </FullScreenContainer>
    );
  }

  // 로그인 애니메이션
  if (phase === 'login' && selectedPersona) {
    return (
      <FullScreenContainer>
        <LoginScreen>
          <LoginLogo>fakebok</LoginLogo>
          <LoginTagline>{selectedPersona.name}님의 프로필에 접속 중...</LoginTagline>
          <LoginBox>
            <LoginInputWrapper>
              <LoginLabel>이메일 또는 전화번호</LoginLabel>
              <LoginInput $focused={loginPhase === 'email'}>
                {emailText}
                {loginPhase === 'email' && <Cursor />}
              </LoginInput>
            </LoginInputWrapper>
            <LoginInputWrapper>
              <LoginLabel>비밀번호</LoginLabel>
              <LoginInput $focused={loginPhase === 'password'}>
                {passwordText}
                {loginPhase === 'password' && <Cursor />}
              </LoginInput>
            </LoginInputWrapper>
            <LoginButton $loading={loginPhase === 'loading'}>
              {loginPhase === 'loading' ? <><Spinner />로그인 중...</> : '로그인'}
            </LoginButton>
          </LoginBox>
        </LoginScreen>
      </FullScreenContainer>
    );
  }

  // 결과 화면
  if (phase === 'result' && result) {
    const score = result.finalScore || 0;
    return (
      <FullScreenContainer>
        <TopHeader>
          <Logo>fakebok</Logo>
          <HeaderRight>
            <CloseButton onClick={handleClose}>✕</CloseButton>
          </HeaderRight>
        </TopHeader>
        <ResultScreen>
          <ResultCard>
            <ResultTitle>훈련 완료</ResultTitle>
            <ScoreCircle $score={score}>
              <ScoreInner>
                <ScoreValue $score={score}>{score}</ScoreValue>
                <ScoreLabel>/ 100점</ScoreLabel>
              </ScoreInner>
            </ScoreCircle>
            <ResultGrade $score={score}>{getGradeText(score)}</ResultGrade>
            <ResultMessage>
              {score >= 80
                ? '스캠 패턴을 잘 인식하고 적절히 대응했습니다!'
                : score >= 50
                ? '일부 위험 신호를 놓쳤습니다. 더 주의가 필요합니다.'
                : '스캠 수법에 취약합니다. 교육이 필요합니다.'}
            </ResultMessage>
            <ResultStats>
              <ResultStatBox>
                <ResultStatValue>{result.totalTurns || turnCount}</ResultStatValue>
                <ResultStatLabel>대화 횟수</ResultStatLabel>
              </ResultStatBox>
              <ResultStatBox>
                <ResultStatValue>{Math.floor((result.durationSeconds || 0) / 60)}분</ResultStatValue>
                <ResultStatLabel>소요 시간</ResultStatLabel>
              </ResultStatBox>
              <ResultStatBox>
                <ResultStatValue>{result.tacticsEncountered?.length || 0}</ResultStatValue>
                <ResultStatLabel>감지된 전술</ResultStatLabel>
              </ResultStatBox>
            </ResultStats>
            {result.tacticsEncountered?.length > 0 && (
              <TacticsSection>
                <TacticsTitle>사용된 스캠 전술</TacticsTitle>
                <TacticsList>
                  {result.tacticsEncountered.map((t: string, i: number) => (
                    <TacticTag key={i}>{t}</TacticTag>
                  ))}
                </TacticsList>
              </TacticsSection>
            )}
            <RetryButton onClick={reset}>다시 도전하기</RetryButton>
          </ResultCard>
        </ResultScreen>
      </FullScreenContainer>
    );
  }

  // 채팅 화면
  return (
    <FullScreenContainer>
      <TopHeader>
        <Logo>fakebok</Logo>
        <SearchBar>검색</SearchBar>
        <HeaderRight>
          <TurnCounter><span>{turnCount}</span> / {MAX_TURNS} 대화</TurnCounter>
          <CloseButton onClick={() => {
            if (confirm('훈련을 종료하시겠습니까?')) endSession();
          }}>✕</CloseButton>
        </HeaderRight>
      </TopHeader>

      <MainContent>
        {/* 좌측 프로필 */}
        <LeftSidebar>
          {selectedPersona && profile && (
            <>
              <ProfileCard>
                <ProfileCover $image={profile.cover} />
                <ProfileAvatar $image={profile.avatar} />
                <ProfileName>{selectedPersona.name}</ProfileName>
                <ProfileBio>{selectedPersona.occupation}</ProfileBio>
              </ProfileCard>
              <ProfileStats>
                <StatItem>
                  <StatValue>2.4K</StatValue>
                  <StatLabel>친구</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>892</StatValue>
                  <StatLabel>사진</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>156</StatValue>
                  <StatLabel>게시물</StatLabel>
                </StatItem>
              </ProfileStats>
              <ProfileInfo>
                <InfoItem>📍 <span>{selectedPersonaId === 'military_james' ? '시리아 주둔' : selectedPersonaId === 'crypto_sophia' ? '싱가포르' : selectedPersonaId === 'sick_minsu' ? '미국 LA' : '북해 플랫폼'}</span></InfoItem>
                <InfoItem>💼 <span>{selectedPersona.occupation}</span></InfoItem>
                <InfoItem>❤️ <span>싱글</span></InfoItem>
              </ProfileInfo>
            </>
          )}
        </LeftSidebar>

        {/* 중앙 피드 */}
        <FeedArea>
          {posts.map((post) => (
            <PostCard key={post.id}>
              <PostHeader>
                <PostAvatar $image={profile?.avatar} />
                <PostAuthor>
                  <PostAuthorName>{selectedPersona?.name}</PostAuthorName>
                  <PostTime>{post.time}</PostTime>
                </PostAuthor>
              </PostHeader>
              <PostContent>{post.content}</PostContent>
              {post.image && <PostImage $src={post.image} />}
              <PostActions>
                <PostAction>👍 {post.likes}</PostAction>
                <PostAction>💬 {post.comments}</PostAction>
                <PostAction>↗️ 공유</PostAction>
              </PostActions>
            </PostCard>
          ))}
        </FeedArea>

        {/* 우측 메신저 */}
        <MessengerArea>
          <MessengerHeader>
            <MessengerAvatar>{profile?.emoji}</MessengerAvatar>
            <MessengerInfo>
              <MessengerName>{selectedPersona?.name}</MessengerName>
              <MessengerStatus>활성 상태</MessengerStatus>
            </MessengerInfo>
          </MessengerHeader>

          <MessengerMessages>
            {messages.map((msg, i) => (
              <MessageRow key={i} $mine={msg.role === 'user'}>
                <MessageBubble $mine={msg.role === 'user'}>
                  {msg.content}
                </MessageBubble>
              </MessageRow>
            ))}
            {isTyping && (
              <MessageRow $mine={false}>
                <TypingIndicator><span /><span /><span /></TypingIndicator>
              </MessageRow>
            )}
            {currentHint && (
              <HintBox>
                <HintText>💡 {currentHint}</HintText>
              </HintBox>
            )}
            <div ref={messagesEndRef} />
          </MessengerMessages>

          <MessengerInput onSubmit={sendMessage}>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="메시지 입력..."
              disabled={sending}
            />
            <SendButton type="submit" disabled={!input.trim() || sending}>
              ➤
            </SendButton>
          </MessengerInput>
        </MessengerArea>
      </MainContent>
    </FullScreenContainer>
  );
}
