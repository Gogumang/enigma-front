import type { Message, Persona, Post, SessionData } from '@/entities/persona';
import {
  useEndSession,
  usePersonas,
  useSendMessage,
  useStartSession,
} from '@/features/immune-training';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MAX_TURNS, checkProfanity, generatePosts, generateSuccessFeedback } from './trainingUtils';

import {
  BriefcaseIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  CommentIcon,
  HeartIcon,
  SearchIcon,
  ShareIcon,
  SmartphoneIcon,
  ThumbsUpIcon,
} from '@/shared/ui/icons';

import ChatGeneric from './ChatGeneric';
import ChatKakao from './ChatKakao';
import ChatSocialMedia from './ChatSocialMedia';
import ChatTelegram from './ChatTelegram';
import ExitModal from './ExitModal';
import PhaseLogin from './PhaseLogin';
import PhaseResult from './PhaseResult';
import PhaseSelect from './PhaseSelect';
import SuccessModal from './SuccessModal';

import {
  BackButton,
  FakebookLogo,
  FeedArea,
  FloatingChatButton,
  FullScreenContainer,
  HeaderIcons,
  HeaderInner,
  HeaderRight,
  HeaderTitle,
  InfoItem,
  InstaframLogo,
  LeftSidebar,
  LoadingScreen,
  MainContent,
  MobileProfileAvatar,
  MobileProfileBanner,
  MobileProfileBody,
  MobileProfileChevron,
  MobileProfileHeader,
  MobileProfileMeta,
  MobileProfileNameText,
  MobileProfileRow,
  MobileProfileSub,
  PostAction,
  PostActions,
  PostAuthor,
  PostAuthorName,
  PostAvatar,
  PostCard,
  PostContent,
  PostHeader,
  PostImage,
  PostTime,
  ProfileAvatar,
  ProfileBio,
  ProfileCard,
  ProfileCover,
  ProfileInfo,
  ProfileName,
  ProfileStats,
  SearchBar,
  StatItem,
  StatLabel,
  StatValue,
  TopHeader,
  TurnCounter,
  YLogo,
  platformConfig,
} from './TrainingPage.styles';

export default function TrainingPage() {
  const navigate = useNavigate();
  const { personaId: urlPersonaId } = useSearch({ from: '/training' });

  const [phase, setPhase] = useState<'select' | 'login' | 'chat' | 'result'>(() =>
    urlPersonaId ? 'login' : 'select',
  );
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(
    () => urlPersonaId || null,
  );

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
    completionReason?: string;
  } | null>(null);

  // 모달
  const [showExitModal, setShowExitModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successFeedback, setSuccessFeedback] = useState<string[]>([]);

  // 비속어
  const [profanityWarningInChat, setProfanityWarningInChat] = useState(false);
  const [inputShaking, setInputShaking] = useState(false);
  const [removingMessageId, setRemovingMessageId] = useState<string | null>(null);

  // 모바일
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [profileExpanded, setProfileExpanded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // TanStack Query hooks
  const personasQuery = usePersonas();
  const startSessionMutation = useStartSession();
  const sendMessageMutation = useSendMessage();
  const endSessionMutation = useEndSession();

  const personas = personasQuery.data || [];

  // 메시지 스크롤
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectPersona = (personaId: string) => {
    setSelectedPersonaId(personaId);
    setPhase('login');
  };

  const startSession = async (personaId: string) => {
    try {
      const data = await startSessionMutation.mutateAsync(personaId);
      setSession(data);
      setMessages([
        {
          role: 'scammer',
          content: data.openingMessage,
          timestamp: new Date().toISOString(),
        },
      ]);
      setCurrentHint('상대방이 먼저 말을 걸어왔습니다. 주의 깊게 대화해보세요.');
      setTurnCount(0);

      if (data.feedPosts && data.feedPosts.length > 0) {
        setPosts(data.feedPosts);
      } else {
        const persona = personas.find((p) => p.id === personaId);
        if (persona) {
          setPosts(generatePosts(persona));
        } else {
          setPosts([]);
        }
      }
    } catch (err) {
      console.error('Failed to start session:', err);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: depends on startSession which uses personas
  const handleLoginComplete = useCallback(async () => {
    if (selectedPersonaId) {
      await startSession(selectedPersonaId);
      setPhase('chat');
    }
  }, [selectedPersonaId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !session || sending) return;

    const userMessage = input.trim();
    const messageId = Date.now().toString();

    if (profanityWarningInChat) {
      setProfanityWarningInChat(false);
    }

    if (checkProfanity(userMessage)) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'user',
          content: userMessage,
          timestamp: new Date().toISOString(),
          id: messageId,
        },
      ]);
      setInput('');

      setRemovingMessageId(messageId);
      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
        setRemovingMessageId(null);
        setProfanityWarningInChat(true);
      }, 500);
      return;
    }

    setInput('');
    setSending(true);

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString(),
        id: messageId,
      },
    ]);

    setIsTyping(true);

    try {
      const data = await sendMessageMutation.mutateAsync({
        sessionId: session.sessionId,
        message: userMessage,
      });

      await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200));

      setMessages((prev) => [
        ...prev,
        {
          role: 'scammer',
          content: data.scammerMessage,
          timestamp: new Date().toISOString(),
          imageUrl: data.imageUrl,
        },
      ]);

      const newTurnCount = data.turnCount || turnCount + 1;
      setTurnCount(newTurnCount);

      if (data.hint) {
        setCurrentHint(data.hint);
      }

      if (data.isCompleted && data.completionReason === 'scammer_gave_up') {
        const feedback = generateSuccessFeedback(userMessage);
        setSuccessFeedback(feedback);
        setTimeout(() => setShowSuccessModal(true), 500);
        return;
      }

      if (newTurnCount >= MAX_TURNS) {
        setTimeout(() => endSession(), 1000);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
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
  };

  const selectedPersona = personas.find((p: Persona) => p.id === selectedPersonaId);
  const currentPlatform = selectedPersona?.platform || '';
  const currentPlatformConfig = platformConfig[currentPlatform];

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
    return <PhaseSelect personas={personas} onSelect={handleSelectPersona} />;
  }

  // 로그인 애니메이션
  if (phase === 'login' && selectedPersona) {
    return <PhaseLogin persona={selectedPersona} onLoginComplete={handleLoginComplete} />;
  }

  // 결과 화면
  if (phase === 'result' && result) {
    return <PhaseResult result={result} turnCount={turnCount} onReset={reset} />;
  }

  // 채팅 화면
  const isSocialMediaStyle = ['facebook', 'instagram', 'x'].includes(currentPlatform);

  const renderPlatformLogo = () => {
    if (currentPlatform === 'facebook') {
      return (
        <FakebookLogo>
          <span>F</span>
          <span>a</span>
          <span>k</span>
          <span>e</span>
          <span>b</span>
          <span>o</span>
          <span>o</span>
          <span>k</span>
        </FakebookLogo>
      );
    }
    if (currentPlatform === 'instagram') {
      return (
        <InstaframLogo>
          <span>I</span>
          <span>n</span>
          <span>s</span>
          <span>t</span>
          <span>a</span>
          <span>f</span>
          <span>r</span>
          <span>a</span>
          <span>m</span>
        </InstaframLogo>
      );
    }
    if (currentPlatform === 'x') {
      return (
        <YLogo>
          <span>Y</span>
        </YLogo>
      );
    }
    return null;
  };

  const chatProps = {
    persona: selectedPersona as Persona,
    messages,
    input,
    sending,
    isTyping,
    currentHint,
    profanityWarningInChat,
    removingMessageId,
    messagesEndRef,
    onInputChange: setInput,
    onSendMessage: sendMessage,
  };

  return (
    <FullScreenContainer>
      <TopHeader $platform={currentPlatform}>
        <HeaderInner>
          {isSocialMediaStyle ? (
            <>
              <BackButton
                to="/"
                $platform={currentPlatform}
                onClick={(e) => {
                  e.preventDefault();
                  setShowExitModal(true);
                }}
              >
                <ChevronLeftIcon />
              </BackButton>
              {renderPlatformLogo()}
              <SearchBar>
                <SearchIcon size={16} />
                <input readOnly />
              </SearchBar>
              <HeaderIcons>
                <TurnCounter $platform={currentPlatform}>
                  <span>{turnCount}</span> / {MAX_TURNS}
                </TurnCounter>
              </HeaderIcons>
            </>
          ) : (
            <>
              <BackButton
                to="/"
                $platform={currentPlatform}
                onClick={(e) => {
                  e.preventDefault();
                  setShowExitModal(true);
                }}
              >
                <ChevronLeftIcon />
              </BackButton>
              <HeaderTitle $platform={currentPlatform}>
                {currentPlatformConfig?.name || '면역 훈련'}
              </HeaderTitle>
              <HeaderRight>
                <TurnCounter $platform={currentPlatform}>
                  <span>{turnCount}</span> / {MAX_TURNS}
                </TurnCounter>
              </HeaderRight>
            </>
          )}
        </HeaderInner>
      </TopHeader>

      <MainContent>
        {/* 좌측: 프로필 영역 */}
        {isSocialMediaStyle ? (
          <LeftSidebar
            $platform={currentPlatform}
          >
            {selectedPersona && (
              <>
                <div
                  style={{
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    background: selectedPersona.profile_photo
                      ? `url(${selectedPersona.profile_photo})`
                      : '#333',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    marginBottom: '24px',
                  }}
                />
                <div
                  style={{
                    color: '#fff',
                    fontSize: '28px',
                    fontWeight: '700',
                    marginBottom: '8px',
                  }}
                >
                  {selectedPersona.name}
                </div>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '15px',
                    marginBottom: '32px',
                  }}
                >
                  팔로워 {Math.floor(Math.random() * 900 + 100)} 명
                </div>
                <div
                  style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: '15px',
                    }}
                  >
                    <span>💼</span> {selectedPersona.occupation}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: '15px',
                    }}
                  >
                    <span>💍</span> 싱글
                  </div>
                </div>
              </>
            )}
          </LeftSidebar>
        ) : (
          <LeftSidebar $platform={currentPlatform}>
            {selectedPersona && (
              <>
                <ProfileCard $platform={currentPlatform}>
                  <ProfileCover />
                  <ProfileAvatar
                    $image={selectedPersona.profile_photo}
                    $platform={currentPlatform}
                  />
                  <ProfileName $platform={currentPlatform}>{selectedPersona.name}</ProfileName>
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
                  <InfoItem>
                    <BriefcaseIcon size={16} />
                    <span>{selectedPersona.occupation}</span>
                  </InfoItem>
                  <InfoItem>
                    <SmartphoneIcon size={16} />
                    <span>{currentPlatformConfig?.name || selectedPersona.platform}</span>
                  </InfoItem>
                  <InfoItem>
                    <HeartIcon size={16} />
                    <span>싱글</span>
                  </InfoItem>
                </ProfileInfo>
              </>
            )}
          </LeftSidebar>
        )}

        {/* 중앙 피드 */}
        <FeedArea $platform={currentPlatform}>
          {selectedPersona && (
            <MobileProfileBanner $platform={currentPlatform}>
              <MobileProfileHeader
                $platform={currentPlatform}
                onClick={() => setProfileExpanded((prev) => !prev)}
              >
                <MobileProfileAvatar $image={selectedPersona.profile_photo} />
                <MobileProfileMeta>
                  <MobileProfileNameText $platform={currentPlatform}>
                    {selectedPersona.name}
                  </MobileProfileNameText>
                  <MobileProfileSub $platform={currentPlatform}>
                    {selectedPersona.occupation}
                  </MobileProfileSub>
                </MobileProfileMeta>
                <MobileProfileChevron $expanded={profileExpanded} $platform={currentPlatform}>
                  <ChevronDownIcon size={18} />
                </MobileProfileChevron>
              </MobileProfileHeader>

              <MobileProfileBody $expanded={profileExpanded} $platform={currentPlatform}>
                <MobileProfileRow $platform={currentPlatform}>
                  <BriefcaseIcon size={16} />
                  <span>{selectedPersona.occupation}</span>
                </MobileProfileRow>
                <MobileProfileRow $platform={currentPlatform}>
                  <SmartphoneIcon size={16} />
                  <span>{currentPlatformConfig?.name || selectedPersona.platform}</span>
                </MobileProfileRow>
                <MobileProfileRow $platform={currentPlatform}>
                  <HeartIcon size={16} />
                  <span>싱글</span>
                </MobileProfileRow>
              </MobileProfileBody>
            </MobileProfileBanner>
          )}

          {posts.map((post) => (
            <PostCard key={post.id} $platform={currentPlatform}>
              <PostHeader>
                <PostAvatar $image={selectedPersona?.profile_photo} />
                <PostAuthor>
                  <PostAuthorName $platform={currentPlatform}>
                    {selectedPersona?.name}
                  </PostAuthorName>
                  <PostTime $platform={currentPlatform}>{post.time}</PostTime>
                </PostAuthor>
              </PostHeader>
              <PostContent $platform={currentPlatform}>{post.content}</PostContent>
              {post.image && <PostImage $src={post.image} />}
              <PostActions $platform={currentPlatform}>
                <PostAction $platform={currentPlatform}>
                  <ThumbsUpIcon size={16} />
                  {post.likes}
                </PostAction>
                <PostAction $platform={currentPlatform}>
                  <CommentIcon size={16} />
                  {post.comments}
                </PostAction>
                <PostAction $platform={currentPlatform}>
                  <ShareIcon size={16} />
                  공유
                </PostAction>
              </PostActions>
            </PostCard>
          ))}
        </FeedArea>

        {/* 플랫폼별 채팅 컴포넌트 */}
        {isSocialMediaStyle && (
          <ChatSocialMedia
            {...chatProps}
            showMobileChat={showMobileChat}
            currentPlatform={currentPlatform}
            onCloseMobileChat={() => setShowMobileChat(false)}
          />
        )}

        {isSocialMediaStyle && !showMobileChat && (
          <FloatingChatButton $platform={currentPlatform} onClick={() => setShowMobileChat(true)}>
            {currentPlatform === 'facebook' && (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.434 5.503 3.678 7.2V22l3.378-1.852c.9.25 1.855.385 2.944.385 5.523 0 10-4.145 10-9.243S17.523 2 12 2z" fill="#fff"/>
                <path d="M13.12 14.32L10.6 11.68 5.7 14.32l5.39-5.72 2.52 2.64 4.89-2.64-5.38 5.72z" fill="#1877f2"/>
              </svg>
            )}
            {currentPlatform === 'instagram' && (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            )}
            {currentPlatform === 'x' && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            )}
          </FloatingChatButton>
        )}

        {currentPlatform === 'kakaotalk' && (
          <ChatKakao {...chatProps} onExitClick={() => setShowExitModal(true)} />
        )}

        {currentPlatform === 'telegram' && (
          <ChatTelegram {...chatProps} onExitClick={() => setShowExitModal(true)} />
        )}

        {!isSocialMediaStyle &&
          currentPlatform !== 'kakaotalk' &&
          currentPlatform !== 'telegram' && (
            <ChatGeneric
              {...chatProps}
              inputShaking={inputShaking}
              currentPlatform={currentPlatform}
            />
          )}
      </MainContent>

      {showExitModal && (
        <ExitModal
          currentPlatform={currentPlatform}
          onClose={() => setShowExitModal(false)}
          onExit={() => {
            setShowExitModal(false);
            endSession();
            navigate({ to: '/' });
          }}
        />
      )}

      {showSuccessModal && (
        <SuccessModal
          successFeedback={successFeedback}
          turnCount={turnCount}
          session={session}
          onComplete={() => {
            setShowSuccessModal(false);
            setResult({
              finalScore: 100,
              totalTurns: turnCount,
              durationSeconds: session
                ? Math.floor((Date.now() - new Date(session.sessionId).getTime()) / 1000)
                : 0,
              tacticsEncountered: [],
              completionReason: 'scammer_gave_up',
            });
            setPhase('result');
          }}
        />
      )}
    </FullScreenContainer>
  );
}
