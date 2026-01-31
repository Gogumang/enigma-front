'use client';

import { useState } from 'react';
import styled from '@emotion/styled';
import { trainingScenarios } from '@/lib/scamPatterns';

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e5e5e5;
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 24px 24px 0;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #111111;
  margin: 0 0 8px;
`;

const Description = styled.p`
  color: #888888;
  font-size: 14px;
  margin: 0;
`;

const CardBody = styled.div`
  padding: 24px;
`;

const ProgressSection = styled.div`
  margin-bottom: 24px;
`;

const ProgressBar = styled.div`
  height: 6px;
  background: #f2f2f2;
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${props => props.$progress}%;
  background: #06c755;
  transition: width 0.3s;
`;

const ProgressText = styled.div`
  text-align: center;
  font-size: 13px;
  color: #888888;
  margin-top: 8px;
`;

const ScenarioList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ScenarioCard = styled.button<{ $completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: ${props => props.$completed ? '#e6f7ee' : '#f7f8f9'};
  border: 1px solid ${props => props.$completed ? '#06c755' : '#e5e5e5'};
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;

  &:hover {
    background: ${props => props.$completed ? '#e6f7ee' : '#f0f1f2'};
  }
`;

const ScenarioIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #111111;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
`;

const ScenarioContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ScenarioTitle = styled.h3`
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 600;
  color: #111111;
`;

const ScenarioDesc = styled.p`
  margin: 0;
  font-size: 13px;
  color: #666666;
`;

const ChatWindow = styled.div`
  background: #111111;
  border-radius: 16px;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #1a1a1a;
  border-bottom: 1px solid #2a2a2a;
`;

const ChatAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff334b, #ff6b81);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
`;

const ChatInfo = styled.div`
  flex: 1;
`;

const ChatName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
`;

const ChatStatus = styled.div`
  font-size: 12px;
  color: #ff334b;
`;

const BackButton = styled.button`
  padding: 8px 12px;
  background: transparent;
  border: 1px solid #444444;
  border-radius: 8px;
  color: #888888;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: #666666;
    color: #ffffff;
  }
`;

const ChatBody = styled.div`
  padding: 16px;
  min-height: 280px;
  max-height: 320px;
  overflow-y: auto;
`;

const Message = styled.div<{ $isScammer: boolean }>`
  display: flex;
  justify-content: ${props => props.$isScammer ? 'flex-start' : 'flex-end'};
  margin-bottom: 12px;
`;

const MessageBubble = styled.div<{ $isScammer: boolean }>`
  max-width: 75%;
  padding: 12px 16px;
  border-radius: 16px;
  background: ${props => props.$isScammer ? '#2a2a2a' : '#06c755'};
  color: #ffffff;
  font-size: 14px;
  line-height: 1.5;
`;

const ResponseSection = styled.div`
  padding: 16px;
  background: #1a1a1a;
  border-top: 1px solid #2a2a2a;
`;

const ResponseLabel = styled.div`
  font-size: 12px;
  color: #666666;
  margin-bottom: 12px;
`;

const ResponseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ResponseButton = styled.button<{ $type: 'good' | 'bad' | 'neutral' }>`
  padding: 14px 16px;
  background: ${props =>
    props.$type === 'good' ? '#06c755' :
    props.$type === 'bad' ? '#ff334b' : '#ff9500'};
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    opacity: 0.9;
    transform: translateX(4px);
  }
`;

const FeedbackCard = styled.div<{ $isCorrect: boolean }>`
  background: ${props => props.$isCorrect ? '#e6f7ee' : '#ffebee'};
  border-radius: 12px;
  padding: 20px;
  margin-top: 16px;
`;

const FeedbackHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const FeedbackIcon = styled.span`
  font-size: 20px;
`;

const FeedbackTitle = styled.h4<{ $isCorrect: boolean }>`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: ${props => props.$isCorrect ? '#06c755' : '#ff334b'};
`;

const FeedbackText = styled.p`
  margin: 0 0 16px;
  font-size: 14px;
  color: #555555;
  line-height: 1.6;
`;

const RedFlagList = styled.div`
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  padding: 12px;
`;

const RedFlagTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 8px;
`;

const RedFlagItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #ff334b;
  padding: 4px 0;
`;

const RetryButton = styled.button`
  margin-top: 16px;
  padding: 12px 20px;
  background: #111111;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #333333;
  }
`;

const responseOptions = {
  scenario_1: [
    { text: '"네, 당연히 도와드릴게요! 얼마가 필요하세요?"', type: 'bad' as const },
    { text: '"영상통화로 먼저 얼굴 확인하고 싶어요"', type: 'good' as const },
    { text: '"조금 더 생각해볼게요..."', type: 'neutral' as const },
  ],
  scenario_2: [
    { text: '"좋아! 어떻게 하면 돼?"', type: 'bad' as const },
    { text: '"투자는 스스로 결정할게. 강요하지 마"', type: 'good' as const },
    { text: '"나중에 얘기하자"', type: 'neutral' as const },
  ],
  scenario_3: [
    { text: '"알겠어, 얼마야? 바로 보낼게"', type: 'bad' as const },
    { text: '"세관에서 직접 연락 온 건가요? 서류 보여주세요"', type: 'good' as const },
    { text: '"선물은 필요 없어..."', type: 'neutral' as const },
  ],
};

const feedbackMessages = {
  good: {
    title: '정답입니다!',
    text: '스캐머의 요청을 적절히 거절하거나 검증을 요구했습니다. 영상통화 요청, 서류 확인 등은 효과적인 방어입니다.',
  },
  bad: {
    title: '위험한 선택입니다!',
    text: '이렇게 응답하면 돈을 잃을 수 있습니다. 온라인에서 만난 사람에게 절대 돈을 보내지 마세요.',
  },
  neutral: {
    title: '애매한 선택입니다',
    text: '스캐머가 계속 압박할 수 있습니다. 명확하게 거절하거나 검증을 요구하세요.',
  },
};

export default function ImmuneTraining() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'good' | 'bad' | 'neutral'; shown: boolean } | null>(null);
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);

  const scenario = trainingScenarios.find(s => s.id === selectedScenario);
  const options = selectedScenario ? responseOptions[selectedScenario as keyof typeof responseOptions] : [];

  const startScenario = (id: string) => {
    setSelectedScenario(id);
    setMessageIndex(0);
    setShowOptions(false);
    setFeedback(null);

    const scen = trainingScenarios.find(s => s.id === id);
    if (scen) {
      scen.messages.forEach((_, index) => {
        setTimeout(() => {
          setMessageIndex(index + 1);
          if (index === scen.messages.length - 1) {
            setTimeout(() => setShowOptions(true), 500);
          }
        }, (index + 1) * 800);
      });
    }
  };

  const handleResponse = (type: 'good' | 'bad' | 'neutral') => {
    setFeedback({ type, shown: true });
    setShowOptions(false);

    if (!completedScenarios.includes(selectedScenario!)) {
      setCompletedScenarios([...completedScenarios, selectedScenario!]);
    }
  };

  const resetTraining = () => {
    setSelectedScenario(null);
    setMessageIndex(0);
    setShowOptions(false);
    setFeedback(null);
  };

  const progress = (completedScenarios.length / trainingScenarios.length) * 100;

  return (
    <Card>
      <CardHeader>
        <Title>면역 훈련</Title>
        <Description>가상의 스캐머와 대화하며 대응력을 키워보세요.</Description>
      </CardHeader>

      <CardBody>
        <ProgressSection>
          <ProgressBar>
            <ProgressFill $progress={progress} />
          </ProgressBar>
          <ProgressText>완료 {completedScenarios.length} / {trainingScenarios.length}</ProgressText>
        </ProgressSection>

        {!selectedScenario ? (
          <ScenarioList>
            {trainingScenarios.map(s => (
              <ScenarioCard
                key={s.id}
                $completed={completedScenarios.includes(s.id)}
                onClick={() => startScenario(s.id)}
              >
                <ScenarioIcon>
                  {completedScenarios.includes(s.id) ? '✓' : '▶'}
                </ScenarioIcon>
                <ScenarioContent>
                  <ScenarioTitle>{s.title}</ScenarioTitle>
                  <ScenarioDesc>{s.description}</ScenarioDesc>
                </ScenarioContent>
              </ScenarioCard>
            ))}
          </ScenarioList>
        ) : (
          <>
            <ChatWindow>
              <ChatHeader>
                <ChatAvatar>?</ChatAvatar>
                <ChatInfo>
                  <ChatName>Unknown User</ChatName>
                  <ChatStatus>의심스러운 계정</ChatStatus>
                </ChatInfo>
                <BackButton onClick={resetTraining}>나가기</BackButton>
              </ChatHeader>

              <ChatBody>
                {scenario?.messages.slice(0, messageIndex).map((msg, index) => (
                  <Message key={index} $isScammer={msg.role === 'scammer'}>
                    <MessageBubble $isScammer={msg.role === 'scammer'}>
                      {msg.text}
                    </MessageBubble>
                  </Message>
                ))}
              </ChatBody>

              {showOptions && !feedback && (
                <ResponseSection>
                  <ResponseLabel>어떻게 응답하시겠습니까?</ResponseLabel>
                  <ResponseList>
                    {options.map((opt, index) => (
                      <ResponseButton
                        key={index}
                        $type={opt.type}
                        onClick={() => handleResponse(opt.type)}
                      >
                        {opt.text}
                      </ResponseButton>
                    ))}
                  </ResponseList>
                </ResponseSection>
              )}
            </ChatWindow>

            {feedback && (
              <FeedbackCard $isCorrect={feedback.type === 'good'}>
                <FeedbackHeader>
                  <FeedbackIcon>
                    {feedback.type === 'good' ? '✅' : feedback.type === 'bad' ? '❌' : '⚠️'}
                  </FeedbackIcon>
                  <FeedbackTitle $isCorrect={feedback.type === 'good'}>
                    {feedbackMessages[feedback.type].title}
                  </FeedbackTitle>
                </FeedbackHeader>
                <FeedbackText>{feedbackMessages[feedback.type].text}</FeedbackText>

                <RedFlagList>
                  <RedFlagTitle>이 대화의 위험 신호</RedFlagTitle>
                  {scenario?.redFlags.map((flag, index) => (
                    <RedFlagItem key={index}>
                      <span>🚩</span> {flag}
                    </RedFlagItem>
                  ))}
                </RedFlagList>

                <RetryButton onClick={resetTraining}>
                  다른 시나리오 선택
                </RetryButton>
              </FeedbackCard>
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
}
