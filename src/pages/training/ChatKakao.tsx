import type { Message, Persona } from '@/entities/persona';
import { ChevronLeftIcon, EmojiIcon, MenuIcon, PlusIcon, SearchIcon } from '@/shared/ui/icons';
import type React from 'react';
import {
  KakaoBubble,
  KakaoBubbleRow,
  KakaoInputArea,
  KakaoMessageContent,
  KakaoMessageRow,
  KakaoProfilePhoto,
  KakaoSenderName,
  KakaoTime,
  MessageImage,
  MessengerMessages,
  PlatformMessengerArea,
  ProfanityWarningText,
  TypingIndicator,
} from './TrainingPage.styles';

interface ChatKakaoProps {
  persona: Persona;
  messages: Message[];
  input: string;
  sending: boolean;
  isTyping: boolean;
  currentHint: string | null;
  profanityWarningInChat: boolean;
  removingMessageId: string | null;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onInputChange: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onExitClick: () => void;
}

export default function ChatKakao({
  persona,
  messages,
  input,
  sending,
  isTyping,
  currentHint,
  profanityWarningInChat,
  removingMessageId,
  messagesEndRef,
  onInputChange,
  onSendMessage,
  onExitClick,
}: ChatKakaoProps) {
  return (
    <PlatformMessengerArea $platform="kakaotalk">
      {/* 카카오톡 채팅 헤더 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          background: '#b2c7d9',
        }}
      >
        <button
          type="button"
          onClick={onExitClick}
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ChevronLeftIcon color="#191f28" />
        </button>

        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ color: '#191f28', fontSize: '16px', fontWeight: '600' }}>
            {persona.name}
          </span>
        </div>

        <button
          type="button"
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <SearchIcon size={22} color="#191f28" />
        </button>

        <button
          type="button"
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <MenuIcon size={22} color="#191f28" />
        </button>
      </div>

      {/* 카카오톡 메시지 영역 */}
      <MessengerMessages style={{ background: '#b2c7d9', padding: '16px 0' }}>
        {currentHint && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '0 16px',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                background: 'rgba(0,0,0,0.15)',
                borderRadius: '20px',
                padding: '8px 16px',
                fontSize: '12px',
                color: '#fff',
                maxWidth: '50%',
                textAlign: 'center',
              }}
            >
              {currentHint}
            </div>
          </div>
        )}
        {messages.map((msg, i) => {
          const msgTime = new Date();
          const hours = msgTime.getHours();
          const minutes = msgTime.getMinutes().toString().padStart(2, '0');
          const period = hours < 12 ? '오전' : '오후';
          const displayHour = hours % 12 || 12;
          const timeString = `${period} ${displayHour}:${minutes}`;

          return (
            <KakaoMessageRow key={msg.id || `msg-${i}`} $mine={msg.role === 'user'}>
              {msg.role !== 'user' && <KakaoProfilePhoto $image={persona.profile_photo} />}
              <KakaoMessageContent $mine={msg.role === 'user'}>
                {msg.role !== 'user' && <KakaoSenderName>{persona.name}</KakaoSenderName>}
                <KakaoBubbleRow $mine={msg.role === 'user'}>
                  {msg.imageUrl ? (
                    <div>
                      <MessageImage
                        src={msg.imageUrl}
                        alt="이미지"
                        style={{ borderRadius: '12px', maxWidth: '200px' }}
                      />
                      {msg.content && (
                        <KakaoBubble $mine={msg.role === 'user'} style={{ marginTop: '4px' }}>
                          {msg.content}
                        </KakaoBubble>
                      )}
                    </div>
                  ) : (
                    <KakaoBubble
                      $mine={msg.role === 'user'}
                      style={
                        msg.id === removingMessageId ? { background: '#ef4444', color: '#fff' } : {}
                      }
                    >
                      {msg.content}
                    </KakaoBubble>
                  )}
                  <KakaoTime>{timeString}</KakaoTime>
                </KakaoBubbleRow>
              </KakaoMessageContent>
            </KakaoMessageRow>
          );
        })}
        {profanityWarningInChat && (
          <ProfanityWarningText>비속어는 사용할 수 없습니다</ProfanityWarningText>
        )}
        {isTyping && (
          <KakaoMessageRow $mine={false}>
            <KakaoProfilePhoto $image={persona.profile_photo} />
            <KakaoMessageContent $mine={false}>
              <KakaoSenderName>{persona.name}</KakaoSenderName>
              <TypingIndicator>
                <span />
                <span />
                <span />
              </TypingIndicator>
            </KakaoMessageContent>
          </KakaoMessageRow>
        )}
        <div ref={messagesEndRef} />
      </MessengerMessages>

      {/* 카카오톡 입력 영역 */}
      <KakaoInputArea onSubmit={onSendMessage}>
        <button
          type="button"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <PlusIcon size={18} color="#9ca3af" />
        </button>

        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            background: '#e5e7eb',
            borderRadius: '18px',
            padding: '0 8px 0 12px',
          }}
        >
          <input
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder=""
            disabled={sending}
            style={{
              flex: 1,
              padding: '10px 0',
              background: 'transparent',
              border: 'none',
              fontSize: '16px',
              color: '#191f28',
              outline: 'none',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (input.trim() && !sending) {
                  onSendMessage(e as unknown as React.FormEvent);
                }
              }
            }}
          />
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              padding: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <EmojiIcon size={22} color="#9ca3af" />
          </button>
        </div>

        <button
          type="submit"
          disabled={!input.trim() || sending}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: 'none',
            background: input.trim() ? '#fee500' : '#e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: input.trim() ? 'pointer' : 'not-allowed',
            flexShrink: 0,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={input.trim() ? '#3c1e1e' : '#9ca3af'}
            strokeWidth="2.5"
            role="img"
            aria-label="보내기"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </KakaoInputArea>
    </PlatformMessengerArea>
  );
}
