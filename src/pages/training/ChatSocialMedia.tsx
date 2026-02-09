import type { Message, Persona } from '@/entities/persona';
import { SendIcon } from '@/shared/ui/icons';
import type React from 'react';
import {
  ChatInnerContainer,
  ChatPopupImageBubble,
  ChatPopupInput,
  ChatPopupInputArea,
  ChatPopupMessageBubble,
  ChatPopupMessageImage,
  ChatPopupMessages,
  ChatPopupSendButton,
  HintBox,
  HintText,
  ProfanityWarningText,
  RightSidebar,
  TypingIndicator,
} from './TrainingPage.styles';

interface ChatSocialMediaProps {
  persona: Persona;
  messages: Message[];
  input: string;
  sending: boolean;
  isTyping: boolean;
  currentHint: string | null;
  profanityWarningInChat: boolean;
  removingMessageId: string | null;
  showMobileChat: boolean;
  currentPlatform: string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onInputChange: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onCloseMobileChat: () => void;
}

export default function ChatSocialMedia({
  persona,
  messages,
  input,
  sending,
  isTyping,
  currentHint,
  profanityWarningInChat,
  removingMessageId,
  showMobileChat,
  currentPlatform,
  messagesEndRef,
  onInputChange,
  onSendMessage,
  onCloseMobileChat,
}: ChatSocialMediaProps) {
  return (
    <RightSidebar
      $platform={currentPlatform}
      $showOnMobile={showMobileChat}
    >
      <ChatInnerContainer>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            background: '#1a1a1a',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '20px',
              cursor: 'pointer',
              marginRight: '12px',
            }}
          >
            &#8249;
          </button>
          <span style={{ color: '#fff', fontSize: '16px', fontWeight: '600', flex: 1 }}>
            {persona.name}
          </span>
          <button
            type="button"
            onClick={onCloseMobileChat}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '18px',
              cursor: 'pointer',
            }}
          >
            &times;
          </button>
        </div>

        <ChatPopupMessages>
          {currentHint && (
            <HintBox>
              <HintText>{currentHint}</HintText>
            </HintBox>
          )}
          {messages.map((msg, i) =>
            msg.imageUrl ? (
              <ChatPopupImageBubble key={msg.id || `msg-${i}`} $mine={msg.role === 'user'}>
                <ChatPopupMessageImage src={msg.imageUrl} alt="이미지" />
                {msg.content && (
                  <ChatPopupMessageBubble
                    $mine={msg.role === 'user'}
                    $removing={msg.id === removingMessageId}
                  >
                    {msg.content}
                  </ChatPopupMessageBubble>
                )}
              </ChatPopupImageBubble>
            ) : (
              <ChatPopupMessageBubble
                key={msg.id || `msg-${i}`}
                $mine={msg.role === 'user'}
                $removing={msg.id === removingMessageId}
              >
                {msg.content}
              </ChatPopupMessageBubble>
            ),
          )}
          {profanityWarningInChat && (
            <ProfanityWarningText>비속어는 사용할 수 없습니다</ProfanityWarningText>
          )}
          {isTyping && (
            <TypingIndicator>
              <span />
              <span />
              <span />
            </TypingIndicator>
          )}
          <div ref={messagesEndRef} />
        </ChatPopupMessages>

        <ChatPopupInputArea onSubmit={onSendMessage}>
          <ChatPopupInput
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="메시지 입력..."
            disabled={sending}
          />
          <ChatPopupSendButton type="submit" disabled={!input.trim() || sending}>
            <SendIcon size={16} />
          </ChatPopupSendButton>
        </ChatPopupInputArea>
      </ChatInnerContainer>
    </RightSidebar>
  );
}
