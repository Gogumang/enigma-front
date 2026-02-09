import type { Message, Persona } from '@/entities/persona';
import { SendIcon } from '@/shared/ui/icons';
import type React from 'react';
import {
  HintBox,
  HintText,
  ImageBubble,
  MessageImage,
  MessageRow,
  MessengerInfo,
  MessengerMessages,
  PlatformInput,
  PlatformMessageBubble,
  PlatformMessengerArea,
  PlatformMessengerAvatar,
  PlatformMessengerHeader,
  PlatformMessengerName,
  PlatformMessengerStatus,
  ProfanityWarningText,
  SendButton,
  ShakingInput,
  TypingIndicator,
} from './TrainingPage.styles';

interface ChatGenericProps {
  persona: Persona;
  messages: Message[];
  input: string;
  sending: boolean;
  isTyping: boolean;
  currentHint: string | null;
  profanityWarningInChat: boolean;
  removingMessageId: string | null;
  inputShaking: boolean;
  currentPlatform: string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onInputChange: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
}

export default function ChatGeneric({
  persona,
  messages,
  input,
  sending,
  isTyping,
  currentHint,
  profanityWarningInChat,
  removingMessageId,
  inputShaking,
  currentPlatform,
  messagesEndRef,
  onInputChange,
  onSendMessage,
}: ChatGenericProps) {
  return (
    <PlatformMessengerArea $platform={currentPlatform}>
      <PlatformMessengerHeader $platform={currentPlatform}>
        <PlatformMessengerAvatar $image={persona.profile_photo} $platform={currentPlatform} />
        <MessengerInfo>
          <PlatformMessengerName>{persona.name}</PlatformMessengerName>
          <PlatformMessengerStatus $platform={currentPlatform}>활성 상태</PlatformMessengerStatus>
        </MessengerInfo>
      </PlatformMessengerHeader>

      <MessengerMessages>
        {currentHint && (
          <HintBox>
            <HintText>{currentHint}</HintText>
          </HintBox>
        )}
        {messages.map((msg, i) => (
          <MessageRow
            key={msg.id || `msg-${i}`}
            $mine={msg.role === 'user'}
            style={msg.id === removingMessageId ? { animation: 'slideOut 0.4s ease forwards' } : {}}
          >
            {msg.imageUrl ? (
              <ImageBubble $mine={msg.role === 'user'}>
                <MessageImage src={msg.imageUrl} alt="이미지" />
                {msg.content && (
                  <PlatformMessageBubble $mine={msg.role === 'user'} $platform={currentPlatform}>
                    {msg.content}
                  </PlatformMessageBubble>
                )}
              </ImageBubble>
            ) : (
              <PlatformMessageBubble
                $mine={msg.role === 'user'}
                $platform={currentPlatform}
                style={msg.id === removingMessageId ? { background: '#ef4444' } : {}}
              >
                {msg.content}
              </PlatformMessageBubble>
            )}
          </MessageRow>
        ))}
        {profanityWarningInChat && (
          <ProfanityWarningText>비속어는 사용할 수 없습니다</ProfanityWarningText>
        )}
        {isTyping && (
          <MessageRow $mine={false}>
            <TypingIndicator>
              <span />
              <span />
              <span />
            </TypingIndicator>
          </MessageRow>
        )}
        <div ref={messagesEndRef} />
      </MessengerMessages>

      <ShakingInput onSubmit={onSendMessage} $shaking={inputShaking}>
        <PlatformInput
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="메시지 입력..."
          disabled={sending}
          $platform={currentPlatform}
        />
        <SendButton type="submit" disabled={!input.trim() || sending} $platform={currentPlatform}>
          <SendIcon size={18} />
        </SendButton>
      </ShakingInput>
    </PlatformMessengerArea>
  );
}
