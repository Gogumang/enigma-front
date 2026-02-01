import { useState, useRef, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useNavigate, Link, useSearch } from '@tanstack/react-router';
import { usePersonas, useStartSession, useSendMessage, useEndSession } from '@/features/immune-training';
import type { Persona, Message, Post, SessionData } from '@/entities/persona';

const MAX_TURNS = 10;

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
  background: var(--bg-primary);
  z-index: 9999;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

// ========== 상단 헤더 ==========
const TopHeader = styled.header<{ $platform?: string }>`
  position: sticky;
  top: 0;
  background: ${props => {
    const config = platformConfig[props.$platform || ''];
    if (config && ['kakaotalk', 'telegram', 'line', 'tinder', 'linkedin'].includes(props.$platform || '')) {
      return config.gradient;
    }
    return 'var(--bg-card)';
  }};
  color: ${props => {
    if (['kakaotalk'].includes(props.$platform || '')) return '#3c1e1e';
    if (['telegram', 'line', 'tinder', 'linkedin'].includes(props.$platform || '')) return '#fff';
    return 'var(--text-primary)';
  }};
  z-index: 100;
  border-bottom: ${props => ['kakaotalk', 'telegram', 'line', 'tinder', 'linkedin'].includes(props.$platform || '') ? 'none' : '1px solid var(--border-color)'};
  flex-shrink: 0;
`;

const HeaderInner = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 8px;
`;

const BackButton = styled(Link)<{ $platform?: string }>`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => {
    if (['kakaotalk'].includes(props.$platform || '')) return '#3c1e1e';
    if (['telegram', 'line', 'tinder', 'linkedin'].includes(props.$platform || '')) return '#fff';
    return 'var(--text-primary)';
  }};
  border-radius: 12px;
  text-decoration: none;

  &:active {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const HeaderTitle = styled.h1<{ $platform?: string }>`
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: ${props => {
    if (['kakaotalk'].includes(props.$platform || '')) return '#3c1e1e';
    if (['telegram', 'line', 'tinder', 'linkedin'].includes(props.$platform || '')) return '#fff';
    return 'var(--text-primary)';
  }};
  margin: 0;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TurnCounter = styled.div<{ $platform?: string }>`
  padding: 6px 12px;
  background: ${props => ['kakaotalk', 'telegram', 'line', 'tinder', 'linkedin'].includes(props.$platform || '') ? 'rgba(255,255,255,0.2)' : 'var(--bg-secondary)'};
  border-radius: 16px;
  font-size: 13px;
  color: ${props => {
    if (['kakaotalk'].includes(props.$platform || '')) return '#3c1e1e';
    if (['telegram', 'line', 'tinder', 'linkedin'].includes(props.$platform || '')) return '#fff';
    return 'var(--text-primary)';
  }};
  border: ${props => ['kakaotalk', 'telegram', 'line', 'tinder', 'linkedin'].includes(props.$platform || '') ? 'none' : '1px solid var(--border-color)'};

  span {
    color: ${props => ['kakaotalk', 'telegram', 'line', 'tinder', 'linkedin'].includes(props.$platform || '') ? 'inherit' : 'var(--accent-primary)'};
    font-weight: 600;
  }
`;


// ========== 메인 컨텐츠 ==========
const MainContent = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

// ========== 좌측 프로필 영역 ==========
const LeftSidebar = styled.div<{ $platform?: string }>`
  width: 280px;
  background: var(--bg-card);
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  flex-shrink: 0;

  // 메신저 앱은 프로필 숨김
  ${props => ['kakaotalk', 'telegram', 'line'].includes(props.$platform || '') && `
    display: none;
  `}

  @media (max-width: 900px) {
    display: none;
  }
`;

const ProfileCard = styled.div`
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid var(--border-color);
`;

const ProfileCover = styled.div<{ $image?: string }>`
  height: 80px;
  background: ${props => props.$image ? `url(${props.$image})` : 'var(--accent-gradient)'};
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin-bottom: -40px;
`;

const ProfileAvatar = styled.div<{ $image?: string }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.$image ? `url(${props.$image})` : 'var(--accent-gradient)'};
  background-size: cover;
  background-position: center;
  border: 4px solid var(--bg-card);
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
`;

const ProfileName = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
`;

const ProfileBio = styled.div`
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
`;

const ProfileStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
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
  color: var(--text-secondary);

  span {
    color: var(--text-primary);
  }
`;

// ========== 중앙 피드 영역 ==========
const FeedArea = styled.div<{ $platform?: string }>`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: var(--bg-secondary);

  // 메신저/데이팅 앱은 피드 숨김
  ${props => ['kakaotalk', 'telegram', 'line', 'tinder', 'linkedin'].includes(props.$platform || '') && `
    display: none;
  `}

  @media (max-width: 600px) {
    padding: 8px;
  }
`;

const PostCard = styled.div`
  background: var(--bg-card);
  border-radius: 12px;
  margin-bottom: 16px;
  animation: ${fadeIn} 0.4s ease;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  border: 1px solid var(--border-color);
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
  background: ${props => props.$image ? `url(${props.$image})` : 'var(--accent-gradient)'};
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
  color: var(--text-primary);
`;

const PostTime = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
`;

const PostContent = styled.div`
  padding: 0 16px 12px;
  font-size: 15px;
  color: var(--text-primary);
  line-height: 1.5;
`;

const PostImage = styled.div<{ $src: string }>`
  width: 100%;
  height: 300px;
  background: url(${props => props.$src}) center/cover;
  background-color: var(--bg-secondary);
`;

const PostActions = styled.div`
  display: flex;
  padding: 8px 16px;
  border-top: 1px solid var(--border-color);
  gap: 4px;
`;

const PostAction = styled.button`
  flex: 1;
  padding: 8px;
  background: none;
  border: none;
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    background: var(--bg-secondary);
  }
`;

// ========== 우측 메신저 영역 ==========
const MessengerArea = styled.div`
  width: 360px;
  background: var(--bg-card);
  border-left: 1px solid var(--border-color);
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
  border-bottom: 1px solid var(--border-color);
`;

const MessengerAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--accent-gradient);
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
  color: var(--text-primary);
`;

const MessengerStatus = styled.div`
  font-size: 12px;
  color: #20c997;
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: #20c997;
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
  background: ${props => props.$mine ? 'var(--accent-primary)' : 'var(--bg-secondary)'};
  color: ${props => props.$mine ? '#fff' : 'var(--text-primary)'};
  font-size: 14px;
  line-height: 1.4;
`;

const MessageImage = styled.img`
  max-width: 200px;
  border-radius: 12px;
  margin-bottom: 8px;
  display: block;
`;

const ImageBubble = styled.div<{ $mine: boolean }>`
  max-width: 80%;
  display: flex;
  flex-direction: column;
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 4px;
  padding: 12px 14px;
  background: var(--bg-secondary);
  border-radius: 18px;
  width: fit-content;

  span {
    width: 6px;
    height: 6px;
    background: var(--text-tertiary);
    border-radius: 50%;
    animation: ${typing} 1.4s infinite;

    &:nth-of-type(2) { animation-delay: 0.2s; }
    &:nth-of-type(3) { animation-delay: 0.4s; }
  }
`;

const HintBox = styled.div`
  margin: 8px 0;
  padding: 10px 12px;
  background: rgba(255, 193, 7, 0.1);
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
  border-top: 1px solid var(--border-color);
`;

const Input = styled.input`
  flex: 1;
  padding: 10px 14px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  color: var(--text-primary);
  font-size: 14px;
  outline: none;

  &::placeholder {
    color: var(--text-tertiary);
  }

  &:focus {
    border-color: var(--accent-primary);
  }
`;

const SendButton = styled.button<{ $platform?: string }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => {
    const config = platformConfig[props.$platform || ''];
    return config ? config.gradient : 'var(--accent-gradient)';
  }};
  border: none;
  color: ${props => props.$platform === 'kakaotalk' ? '#3c1e1e' : '#fff'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    background: var(--bg-secondary);
    color: var(--text-tertiary);
    cursor: not-allowed;
  }
`;

// ========== 종료 확인 모달 ==========
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: ${fadeIn} 0.2s ease;
`;

const ModalBox = styled.div`
  background: var(--bg-card);
  border-radius: 20px;
  padding: 28px 24px;
  max-width: 320px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
`;

const ModalMessage = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 24px;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const ModalButton = styled.button<{ $primary?: boolean; $platform?: string }>`
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  ${props => props.$primary ? `
    background: ${platformConfig[props.$platform || '']?.gradient || 'var(--accent-gradient)'};
    color: ${props.$platform === 'kakaotalk' ? '#3c1e1e' : '#fff'};
    border: none;
  ` : `
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
  `}

  &:active {
    transform: scale(0.98);
  }
`;

// ========== 플랫폼별 메신저 스타일 ==========
const PlatformMessengerArea = styled.div<{ $platform?: string }>`
  // 메신저/데이팅 앱은 전체 너비, SNS는 고정 너비
  width: ${props => ['kakaotalk', 'telegram', 'line', 'tinder', 'linkedin'].includes(props.$platform || '') ? '100%' : '360px'};
  max-width: ${props => ['kakaotalk', 'telegram', 'line', 'tinder', 'linkedin'].includes(props.$platform || '') ? '500px' : 'none'};
  margin: ${props => ['kakaotalk', 'telegram', 'line', 'tinder', 'linkedin'].includes(props.$platform || '') ? '0 auto' : '0'};
  background: ${props => {
    switch (props.$platform) {
      case 'kakaotalk': return '#b2c7d9';
      case 'instagram': return '#fff';
      case 'telegram': return '#e6ebee';
      case 'line': return '#7b9e89';
      case 'tinder': return '#fff';
      case 'linkedin': return '#f3f2ef';
      default: return 'var(--bg-card)';
    }
  }};
  border-left: ${props => ['kakaotalk', 'telegram', 'line', 'tinder', 'linkedin'].includes(props.$platform || '') ? 'none' : '1px solid var(--border-color)'};
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
    max-width: none;
    z-index: 100;
  }
`;

const PlatformMessengerHeader = styled.div<{ $platform?: string }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: ${props => {
    const config = platformConfig[props.$platform || ''];
    return config ? config.gradient : 'var(--bg-card)';
  }};
  color: ${props => props.$platform === 'kakaotalk' ? '#3c1e1e' : '#fff'};
`;

const PlatformMessengerAvatar = styled.div<{ $image?: string; $platform?: string }>`
  width: 36px;
  height: 36px;
  border-radius: ${props => props.$platform === 'kakaotalk' ? '12px' : '50%'};
  background: ${props => props.$image ? `url(${props.$image})` : 'rgba(255,255,255,0.2)'};
  background-size: cover;
  background-position: center;
`;

const PlatformMessengerName = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

const PlatformMessengerStatus = styled.div<{ $platform?: string }>`
  font-size: 12px;
  opacity: 0.8;
`;

const PlatformMessageBubble = styled.div<{ $mine: boolean; $platform?: string }>`
  max-width: 80%;
  padding: 10px 14px;
  font-size: 14px;
  line-height: 1.4;

  ${props => {
    const platform = props.$platform;
    if (props.$mine) {
      switch (platform) {
        case 'kakaotalk':
          return `
            background: #fee500;
            color: #3c1e1e;
            border-radius: 16px 4px 16px 16px;
          `;
        case 'instagram':
          return `
            background: linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%);
            color: #fff;
            border-radius: 20px 4px 20px 20px;
          `;
        case 'telegram':
          return `
            background: #64b5ef;
            color: #fff;
            border-radius: 16px 4px 16px 16px;
          `;
        case 'line':
          return `
            background: #00c300;
            color: #fff;
            border-radius: 16px 4px 16px 16px;
          `;
        case 'linkedin':
          return `
            background: #0a66c2;
            color: #fff;
            border-radius: 16px 4px 16px 16px;
          `;
        case 'tinder':
          return `
            background: linear-gradient(135deg, #fe3c72 0%, #ff6b6b 100%);
            color: #fff;
            border-radius: 20px 4px 20px 20px;
          `;
        case 'x':
          return `
            background: #1d9bf0;
            color: #fff;
            border-radius: 16px 4px 16px 16px;
          `;
        default:
          return `
            background: #1877f2;
            color: #fff;
            border-radius: 18px 4px 18px 18px;
          `;
      }
    } else {
      switch (platform) {
        case 'kakaotalk':
          return `
            background: #fff;
            color: #191f28;
            border-radius: 4px 16px 16px 16px;
          `;
        case 'instagram':
          return `
            background: #efefef;
            color: #191f28;
            border-radius: 4px 20px 20px 20px;
          `;
        case 'telegram':
          return `
            background: #fff;
            color: #191f28;
            border-radius: 4px 16px 16px 16px;
          `;
        case 'line':
          return `
            background: #fff;
            color: #191f28;
            border-radius: 4px 16px 16px 16px;
          `;
        case 'tinder':
          return `
            background: #f0f0f0;
            color: #191f28;
            border-radius: 4px 20px 20px 20px;
          `;
        default:
          return `
            background: var(--bg-secondary);
            color: var(--text-primary);
            border-radius: 4px 18px 18px 18px;
          `;
      }
    }
  }}
`;

const PlatformInput = styled.input<{ $platform?: string }>`
  flex: 1;
  padding: 10px 14px;
  background: ${props => props.$platform === 'kakaotalk' ? '#fff' : 'var(--bg-secondary)'};
  border: 1px solid ${props => {
    const config = platformConfig[props.$platform || ''];
    return config ? `${config.color}40` : 'var(--border-color)';
  }};
  border-radius: 20px;
  color: var(--text-primary);
  font-size: 14px;
  outline: none;

  &::placeholder {
    color: var(--text-tertiary);
  }

  &:focus {
    border-color: ${props => {
      const config = platformConfig[props.$platform || ''];
      return config ? config.color : 'var(--accent-primary)';
    }};
  }
`;

// ========== 플랫폼별 설정 ==========
const platformConfig: Record<string, {
  name: string;
  color: string;
  gradient: string;
  buttonColor: string;
}> = {
  facebook: {
    name: 'Fakebook',
    color: '#1877f2',
    gradient: 'linear-gradient(135deg, #1877f2 0%, #0d5bbd 100%)',
    buttonColor: '#1877f2',
  },
  kakaotalk: {
    name: 'CacaoTalk',
    color: '#fee500',
    gradient: 'linear-gradient(135deg, #fee500 0%, #e6c700 100%)',
    buttonColor: '#fee500',
  },
  instagram: {
    name: 'Instafram',
    color: '#e1306c',
    gradient: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
    buttonColor: '#e1306c',
  },
  x: {
    name: 'Y',
    color: '#000000',
    gradient: 'linear-gradient(135deg, #000000 0%, #14171a 100%)',
    buttonColor: '#000000',
  },
  telegram: {
    name: 'Teletram',
    color: '#0088cc',
    gradient: 'linear-gradient(135deg, #0088cc 0%, #005580 100%)',
    buttonColor: '#0088cc',
  },
  line: {
    name: 'LIME',
    color: '#00c300',
    gradient: 'linear-gradient(135deg, #00c300 0%, #00a000 100%)',
    buttonColor: '#00c300',
  },
  linkedin: {
    name: 'LinkedOut',
    color: '#0a66c2',
    gradient: 'linear-gradient(135deg, #0a66c2 0%, #004182 100%)',
    buttonColor: '#0a66c2',
  },
  tinder: {
    name: 'Timber',
    color: '#fe3c72',
    gradient: 'linear-gradient(135deg, #fe3c72 0%, #ff6b6b 100%)',
    buttonColor: '#fe3c72',
  },
};

// ========== 로그인 화면 ==========
const LoginScreen = styled.div<{ $platform?: string }>`
  flex: 1;
  background: ${props => platformConfig[props.$platform || '']?.gradient || 'var(--accent-gradient)'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const LoginLogo = styled.div<{ $platform?: string }>`
  font-size: 48px;
  font-weight: 700;
  color: ${props => props.$platform === 'kakaotalk' ? '#3c1e1e' : '#fff'};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LoginLogoIcon = styled.div<{ $platform?: string }>`
  width: 56px;
  height: 56px;
  border-radius: ${props => props.$platform === 'facebook' ? '12px' : '50%'};
  background: ${props => props.$platform === 'kakaotalk' ? '#3c1e1e' : 'rgba(255,255,255,0.2)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: ${props => props.$platform === 'kakaotalk' ? '#fee500' : '#fff'};
`;

const LoginTagline = styled.div<{ $platform?: string }>`
  font-size: 14px;
  color: ${props => props.$platform === 'kakaotalk' ? 'rgba(60,30,30,0.7)' : 'rgba(255, 255, 255, 0.8)'};
  margin-bottom: 32px;
`;

const LoginBox = styled.div`
  width: 100%;
  max-width: 320px;
  background: var(--bg-card);
  border-radius: 16px;
  padding: 24px;
  box-shadow: var(--shadow-lg);
`;

const LoginInputWrapper = styled.div`
  margin-bottom: 12px;
`;

const LoginLabel = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 6px;
`;

const LoginInput = styled.div<{ $focused?: boolean }>`
  padding: 12px 14px;
  background: var(--bg-secondary);
  border: 2px solid ${props => props.$focused ? 'var(--accent-primary)' : 'var(--border-color)'};
  border-radius: 8px;
  font-size: 15px;
  color: var(--text-primary);
  min-height: 44px;
  display: flex;
  align-items: center;
`;

const Cursor = styled.span`
  width: 2px;
  height: 18px;
  background: var(--accent-primary);
  margin-left: 2px;
  animation: ${blink} 1s infinite;
`;

const LoginButton = styled.button<{ $loading?: boolean; $platform?: string }>`
  width: 100%;
  padding: 14px;
  background: ${props => props.$loading ? 'var(--text-tertiary)' : platformConfig[props.$platform || '']?.buttonColor || 'var(--accent-primary)'};
  border: none;
  border-radius: 8px;
  color: ${props => props.$platform === 'kakaotalk' ? '#3c1e1e' : '#fff'};
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
  background: var(--bg-secondary);
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
  background: var(--bg-card);
  border-radius: 20px;
  padding: 32px 24px;
  text-align: center;
  animation: ${fadeIn} 0.5s ease;
  border: 1px solid var(--border-color);
`;

const ResultTitle = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
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
    var(--border-color) ${props => props.$score * 3.6}deg
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
  background: var(--bg-card);
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
  color: var(--text-secondary);
`;

const ResultGrade = styled.div<{ $score: number }>`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.$score >= 80 ? '#20c997' : props.$score >= 50 ? '#ffc107' : '#f44336'};
  margin-bottom: 16px;
`;

const ResultMessage = styled.div`
  font-size: 15px;
  color: var(--text-primary);
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
  background: var(--bg-secondary);
  border-radius: 12px;
`;

const ResultStatValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: var(--accent-primary);
`;

const ResultStatLabel = styled.div`
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 4px;
`;

const TacticsSection = styled.div`
  text-align: left;
  margin-bottom: 24px;
`;

const TacticsTitle = styled.div`
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
`;

const TacticsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const TacticTag = styled.span`
  padding: 4px 10px;
  background: rgba(99, 91, 255, 0.1);
  border-radius: 12px;
  font-size: 12px;
  color: var(--accent-primary);
`;

const RetryButton = styled.button`
  width: 100%;
  padding: 14px;
  background: var(--accent-gradient);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 91, 255, 0.3);
  }
`;

// ========== 페르소나 선택 ==========
const PersonaSelectScreen = styled.div`
  flex: 1;
  background: var(--bg-secondary);
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
  color: var(--text-primary);
  margin-bottom: 8px;
`;

const PersonaSubtitle = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 32px;
`;

const PersonaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 420px;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--bg-secondary);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;
  }
`;

const PersonaCard = styled.button<{ $platform?: string }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: var(--bg-card);
  border: 1px solid ${props => {
    const config = platformConfig[props.$platform || ''];
    return config ? `${config.color}30` : 'var(--border-color)';
  }};
  border-radius: 16px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => {
      const config = platformConfig[props.$platform || ''];
      return config ? `${config.color}50` : 'var(--border-color)';
    }};
    box-shadow: ${props => {
      const config = platformConfig[props.$platform || ''];
      return config ? `0 4px 12px ${config.color}15` : 'var(--shadow-md)';
    }};
    transform: translateY(-2px);
  }
`;

const PersonaAvatar = styled.div<{ $color: string; $image?: string; $platform?: string }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${props => props.$image ? `url(${props.$image})` : props.$color};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
  border: 2px solid ${props => {
    const config = platformConfig[props.$platform || ''];
    return config ? `${config.color}35` : 'var(--border-color)';
  }};
`;

const PersonaInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const PersonaName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
`;

const PersonaOccupation = styled.div`
  font-size: 13px;
  color: var(--text-secondary);
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

const PlatformBadge = styled.span<{ $platform?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 8px;
  margin-left: 6px;

  ${props => {
    switch (props.$platform) {
      case 'facebook':
        return `background: rgba(24, 119, 242, 0.15); color: #1877f2;`;
      case 'kakaotalk':
        return `background: rgba(254, 229, 0, 0.3); color: #3c1e1e;`;
      case 'instagram':
        return `background: linear-gradient(135deg, rgba(240, 148, 51, 0.15), rgba(220, 39, 67, 0.15)); color: #e1306c;`;
      case 'x':
        return `background: rgba(0, 0, 0, 0.1); color: var(--text-primary);`;
      case 'telegram':
        return `background: rgba(0, 136, 204, 0.15); color: #0088cc;`;
      case 'line':
        return `background: rgba(0, 195, 0, 0.15); color: #00c300;`;
      case 'linkedin':
        return `background: rgba(10, 102, 194, 0.15); color: #0a66c2;`;
      case 'tinder':
        return `background: rgba(254, 60, 114, 0.15); color: #fe3c72;`;
      default:
        return `background: rgba(16, 185, 129, 0.1); color: var(--accent-primary);`;
    }
  }}
`;

const PlatformIcon = styled.span`
  font-size: 12px;
`;

const LoadingScreen = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 16px;
`;

// ========== 컴포넌트 ==========
export default function TrainingPage() {
  const navigate = useNavigate();
  const { personaId: urlPersonaId } = useSearch({ from: '/training' });

  // 상태
  const [phase, setPhase] = useState<'select' | 'login' | 'chat' | 'result'>(() =>
    urlPersonaId ? 'login' : 'select'
  );
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(() =>
    urlPersonaId || null
  );

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

  // 종료 확인 모달
  const [showExitModal, setShowExitModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const targetEmail = 'user@enigma.kr';
  const targetPassword = '••••••••••';

  // TanStack Query hooks
  const personasQuery = usePersonas();
  const startSessionMutation = useStartSession();
  const sendMessageMutation = useSendMessage();
  const endSessionMutation = useEndSession();

  const personas = personasQuery.data || [];

  // 플랫폼별 아이콘 가져오기
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return 'f';
      case 'kakaotalk': return 'K';
      case 'instagram': return 'IG';
      case 'x': return 'X';
      case 'telegram': return 'T';
      case 'line': return 'L';
      case 'linkedin': return 'in';
      case 'tinder': return 'T';
      default: return 'SNS';
    }
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

  // 플랫폼별 더미 게시물 생성 (API fallback)
  const generatePosts = (persona: Persona): Post[] => {
    const platform = persona.platform;

    // 메신저/데이팅 앱은 피드 없음
    if (['kakaotalk', 'telegram', 'line', 'tinder', 'linkedin'].includes(platform)) {
      return [];
    }

    const basePosts: Post[] = [
      {
        id: '1',
        type: 'photo',
        content: '오늘 날씨가 정말 좋네요! 산책하기 딱 좋은 날이에요.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        likes: 127,
        comments: 23,
        time: '2시간 전',
      },
      {
        id: '2',
        type: 'status',
        content: '새로운 시작을 앞두고 설레는 마음입니다. 좋은 인연을 기다리고 있어요.',
        likes: 89,
        comments: 15,
        time: '1일 전',
      },
      {
        id: '3',
        type: 'photo',
        content: '맛있는 커피 한 잔과 함께하는 여유로운 오후',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
        likes: 234,
        comments: 41,
        time: '3일 전',
      },
    ];

    // 인스타그램은 사진 중심
    if (platform === 'instagram') {
      return basePosts.map(post => ({
        ...post,
        type: 'photo' as const,
        image: post.image || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
      }));
    }

    return basePosts;
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

      // API에서 받은 피드 게시물 사용 (없으면 더미 게시물)
      if (data.feedPosts && data.feedPosts.length > 0) {
        setPosts(data.feedPosts);
      } else {
        const persona = personas.find(p => p.id === personaId);
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
        imageUrl: data.imageUrl,
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
    return (
      <FullScreenContainer>
        <TopHeader>
          <HeaderInner>
            <BackButton to="/">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </BackButton>
            <HeaderTitle>면역 훈련</HeaderTitle>
          </HeaderInner>
        </TopHeader>
        <PersonaSelectScreen>
          <PersonaTitle>사기꾼을 선택하세요</PersonaTitle>
          <PersonaSubtitle>10번의 대화를 통해 로맨스 스캠 대응력을 테스트합니다</PersonaSubtitle>
          <PersonaGrid>
            {personas.map((persona: Persona) => {
              const pConfig = platformConfig[persona.platform];
              return (
                <PersonaCard key={persona.id} onClick={() => handleSelectPersona(persona.id)} $platform={persona.platform}>
                  <PersonaAvatar
                    $color={pConfig?.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}
                    $image={persona.profile_photo}
                    $platform={persona.platform}
                  />
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
        <LoginScreen $platform={currentPlatform}>
          <LoginLogo $platform={currentPlatform}>
            {currentPlatformConfig?.name || 'SNS'}
          </LoginLogo>
          <LoginTagline $platform={currentPlatform}>
            {selectedPersona.name}님의 프로필에 접속 중...
          </LoginTagline>
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
            <LoginButton $loading={loginPhase === 'loading'} $platform={currentPlatform}>
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
          <HeaderInner>
            <BackButton to="/">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </BackButton>
            <HeaderTitle>훈련 결과</HeaderTitle>
          </HeaderInner>
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
      <TopHeader $platform={currentPlatform}>
        <HeaderInner>
          <BackButton to="/" $platform={currentPlatform} onClick={(e) => {
            e.preventDefault();
            setShowExitModal(true);
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </BackButton>
          <HeaderTitle $platform={currentPlatform}>{currentPlatformConfig?.name || '면역 훈련'}</HeaderTitle>
          <HeaderRight>
            <TurnCounter $platform={currentPlatform}><span>{turnCount}</span> / {MAX_TURNS}</TurnCounter>
          </HeaderRight>
        </HeaderInner>
      </TopHeader>

      <MainContent>
        {/* 좌측 프로필 - 메신저 앱에서는 숨김 */}
        <LeftSidebar $platform={currentPlatform}>
          {selectedPersona && (
            <>
              <ProfileCard>
                <ProfileCover />
                <ProfileAvatar $image={selectedPersona.profile_photo} />
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
                <InfoItem>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                  <span>{selectedPersona.occupation}</span>
                </InfoItem>
                <InfoItem>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                    <line x1="12" y1="18" x2="12.01" y2="18"/>
                  </svg>
                  <span>{currentPlatformConfig?.name || selectedPersona.platform}</span>
                </InfoItem>
                <InfoItem>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  <span>싱글</span>
                </InfoItem>
              </ProfileInfo>
            </>
          )}
        </LeftSidebar>

        {/* 중앙 피드 - 메신저/데이팅 앱에서는 숨김 */}
        <FeedArea $platform={currentPlatform}>
          {posts.map((post) => (
            <PostCard key={post.id}>
              <PostHeader>
                <PostAvatar $image={selectedPersona?.profile_photo} />
                <PostAuthor>
                  <PostAuthorName>{selectedPersona?.name}</PostAuthorName>
                  <PostTime>{post.time}</PostTime>
                </PostAuthor>
              </PostHeader>
              <PostContent>{post.content}</PostContent>
              {post.image && <PostImage $src={post.image} />}
              <PostActions>
                <PostAction>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                  </svg>
                  {post.likes}
                </PostAction>
                <PostAction>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  {post.comments}
                </PostAction>
                <PostAction>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3"/>
                    <circle cx="6" cy="12" r="3"/>
                    <circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                  공유
                </PostAction>
              </PostActions>
            </PostCard>
          ))}
        </FeedArea>

        {/* 우측 메신저 - 플랫폼별 스타일 */}
        <PlatformMessengerArea $platform={currentPlatform}>
          <PlatformMessengerHeader $platform={currentPlatform}>
            <PlatformMessengerAvatar $image={selectedPersona?.profile_photo} $platform={currentPlatform} />
            <MessengerInfo>
              <PlatformMessengerName>{selectedPersona?.name}</PlatformMessengerName>
              <PlatformMessengerStatus $platform={currentPlatform}>활성 상태</PlatformMessengerStatus>
            </MessengerInfo>
          </PlatformMessengerHeader>

          <MessengerMessages>
            {messages.map((msg, i) => (
              <MessageRow key={i} $mine={msg.role === 'user'}>
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
                  <PlatformMessageBubble $mine={msg.role === 'user'} $platform={currentPlatform}>
                    {msg.content}
                  </PlatformMessageBubble>
                )}
              </MessageRow>
            ))}
            {isTyping && (
              <MessageRow $mine={false}>
                <TypingIndicator><span /><span /><span /></TypingIndicator>
              </MessageRow>
            )}
            {currentHint && (
              <HintBox>
                <HintText>{currentHint}</HintText>
              </HintBox>
            )}
            <div ref={messagesEndRef} />
          </MessengerMessages>

          <MessengerInput onSubmit={sendMessage}>
            <PlatformInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="메시지 입력..."
              disabled={sending}
              $platform={currentPlatform}
            />
            <SendButton type="submit" disabled={!input.trim() || sending} $platform={currentPlatform}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </SendButton>
          </MessengerInput>
        </PlatformMessengerArea>
      </MainContent>

      {/* 종료 확인 모달 */}
      {showExitModal && (
        <ModalOverlay onClick={() => setShowExitModal(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>훈련 종료</ModalTitle>
            <ModalMessage>
              훈련을 종료하시겠습니까?<br />
              진행 상황이 저장되지 않습니다.
            </ModalMessage>
            <ModalButtons>
              <ModalButton onClick={() => setShowExitModal(false)}>
                계속하기
              </ModalButton>
              <ModalButton
                $primary
                $platform={currentPlatform}
                onClick={() => {
                  setShowExitModal(false);
                  endSession();
                  navigate({ to: '/' });
                }}
              >
                종료하기
              </ModalButton>
            </ModalButtons>
          </ModalBox>
        </ModalOverlay>
      )}
    </FullScreenContainer>
  );
}
