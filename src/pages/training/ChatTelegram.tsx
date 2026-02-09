import type { Message, Persona } from '@/entities/persona';
import {
  ChevronLeftIcon,
  EmojiIcon,
  MicrophoneIcon,
  MoreVerticalIcon,
  PaperclipIcon,
  SendIcon,
} from '@/shared/ui/icons';
import type React from 'react';
import {
  MessageImage,
  PlatformMessengerArea,
  ProfanityWarningText,
  TelegramBubble,
  TelegramChatArea,
  TelegramHeader,
  TelegramHeaderInfo,
  TelegramHeaderName,
  TelegramHeaderStatus,
  TelegramInput,
  TelegramInputArea,
  TelegramMessageRow,
  TelegramProfilePhoto,
  TelegramSenderName,
  TelegramTime,
  TypingIndicator,
} from './TrainingPage.styles';

interface ChatTelegramProps {
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

export default function ChatTelegram({
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
}: ChatTelegramProps) {
  return (
    <PlatformMessengerArea $platform="telegram" style={{ background: '#6b9b7a' }}>
      <TelegramHeader>
        <button
          type="button"
          onClick={onExitClick}
          style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer' }}
        >
          <ChevronLeftIcon color="#fff" />
        </button>
        <TelegramProfilePhoto $image={persona.profile_photo} />
        <TelegramHeaderInfo>
          <TelegramHeaderName>{persona.name}</TelegramHeaderName>
          <TelegramHeaderStatus>최근 접속</TelegramHeaderStatus>
        </TelegramHeaderInfo>
        <button
          type="button"
          style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer' }}
        >
          <MoreVerticalIcon size={20} color="#fff" />
        </button>
      </TelegramHeader>

      <TelegramChatArea>
        {currentHint && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <div
              style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '6px 12px',
                fontSize: '13px',
                color: 'rgba(255,255,255,0.7)',
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
          const timeString = `${hours}:${minutes}`;

          return (
            <TelegramMessageRow key={msg.id || `msg-${i}`} $mine={msg.role === 'user'}>
              {msg.role !== 'user' && (
                <TelegramProfilePhoto
                  $image={persona.profile_photo}
                  style={{ width: '32px', height: '32px' }}
                />
              )}
              <TelegramBubble
                $mine={msg.role === 'user'}
                style={msg.id === removingMessageId ? { background: '#ef4444' } : {}}
              >
                {msg.role !== 'user' && <TelegramSenderName>{persona.name}</TelegramSenderName>}
                {msg.imageUrl && (
                  <MessageImage
                    src={msg.imageUrl}
                    alt="이미지"
                    style={{ borderRadius: '8px', maxWidth: '200px', marginBottom: '4px' }}
                  />
                )}
                {msg.content}
                <TelegramTime $mine={msg.role === 'user'}>{timeString}</TelegramTime>
              </TelegramBubble>
            </TelegramMessageRow>
          );
        })}
        {profanityWarningInChat && (
          <ProfanityWarningText>비속어는 사용할 수 없습니다</ProfanityWarningText>
        )}
        {isTyping && (
          <TelegramMessageRow $mine={false}>
            <TelegramProfilePhoto
              $image={persona.profile_photo}
              style={{ width: '32px', height: '32px' }}
            />
            <TelegramBubble $mine={false}>
              <TelegramSenderName>{persona.name}</TelegramSenderName>
              <TypingIndicator>
                <span />
                <span />
                <span />
              </TypingIndicator>
            </TelegramBubble>
          </TelegramMessageRow>
        )}
        <div ref={messagesEndRef} />
      </TelegramChatArea>

      <TelegramInputArea onSubmit={onSendMessage}>
        <button
          type="button"
          style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer' }}
        >
          <PaperclipIcon size={22} color="#7a7a7a" />
        </button>
        <TelegramInput
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="메시지"
          disabled={sending}
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
          style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer' }}
        >
          <EmojiIcon size={22} color="#7a7a7a" />
        </button>
        {input.trim() ? (
          <button
            type="submit"
            style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer' }}
          >
            <SendIcon size={22} color="#3d8ed9" />
          </button>
        ) : (
          <button
            type="button"
            style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer' }}
          >
            <MicrophoneIcon size={22} color="#7a7a7a" />
          </button>
        )}
      </TelegramInputArea>
    </PlatformMessengerArea>
  );
}
