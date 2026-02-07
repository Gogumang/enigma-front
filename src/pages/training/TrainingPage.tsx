import { useState, useRef, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useNavigate, Link, useSearch } from '@tanstack/react-router';
import { usePersonas, useStartSession, useSendMessage, useEndSession } from '@/features/immune-training';
import type { Persona, Message, Post, SessionData } from '@/entities/persona';

const MAX_TURNS = 5;

// 비속어 필터 목록 (한국어)
const PROFANITY_LIST = [
  '시발', '씨발', '시bal', '씨bal', 'ㅅㅂ', 'ㅆㅂ', '씹', '존나', 'ㅈㄴ',
  '개새끼', '새끼', 'ㅅㄲ', '병신', 'ㅂㅅ', '지랄', 'ㅈㄹ', '미친놈', '미친년',
  '꺼져', '닥쳐', '엿먹어', '죽어', '뒤져', '썅', '좆', 'ㅈ같', '니미', '니애미',
  '느금마', '느금', '에미', '애미', '아가리', '주둥이', '쓰레기', '찐따', '한남',
  'fuck', 'shit', 'bitch', 'asshole', 'damn', 'bastard',
];

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

const celebrate = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

const confetti = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
`;

const slideOut = keyframes`
  0% { opacity: 1; transform: translateX(0); }
  100% { opacity: 0; transform: translateX(-100%); }
`;

const warningPulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(244, 67, 54, 0); }
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

// ========== 상단 헤더 (Facebook 스타일) ==========
const TopHeader = styled.header<{ $platform?: string }>`
  position: sticky;
  top: 0;
  background: ${props => {
    const config = platformConfig[props.$platform || ''];
    if (props.$platform === 'facebook') return '#1a1a1a';
    if (props.$platform === 'instagram') return '#000';
    if (props.$platform === 'x') return '#000';
    if (config && ['kakaotalk', 'telegram', 'line', 'tinder', 'linkedin'].includes(props.$platform || '')) {
      return config.gradient;
    }
    return 'var(--bg-card)';
  }};
  color: ${props => {
    if (['kakaotalk'].includes(props.$platform || '')) return '#3c1e1e';
    if (['telegram', 'line', 'tinder', 'linkedin', 'facebook', 'instagram', 'x'].includes(props.$platform || '')) return '#fff';
    return 'var(--text-primary)';
  }};
  z-index: 100;
  border-bottom: ${props => {
    if (['facebook', 'instagram', 'x'].includes(props.$platform || '')) return '1px solid rgba(255,255,255,0.1)';
    if (['kakaotalk', 'telegram', 'line', 'tinder', 'linkedin'].includes(props.$platform || '')) return 'none';
    return '1px solid var(--border-color)';
  }};
  flex-shrink: 0;
`;

const HeaderInner = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 16px;
`;

const letterBounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const FakebookLogo = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #1877f2;
  font-family: 'Segoe UI', sans-serif;
  letter-spacing: -0.5px;
  cursor: pointer;
  display: flex;

  span {
    display: inline-block;
    transition: all 0.2s ease;
  }

  &:hover span {
    animation: ${letterBounce} 0.4s ease;
  }

  &:hover span:nth-child(1) { animation-delay: 0s; }
  &:hover span:nth-child(2) { animation-delay: 0.05s; }
  &:hover span:nth-child(3) { animation-delay: 0.1s; }
  &:hover span:nth-child(4) { animation-delay: 0.15s; }
  &:hover span:nth-child(5) { animation-delay: 0.2s; }
  &:hover span:nth-child(6) { animation-delay: 0.25s; }
  &:hover span:nth-child(7) { animation-delay: 0.3s; }
  &:hover span:nth-child(8) { animation-delay: 0.35s; }
`;

// Instagram 스타일 로고
const InstaframLogo = styled.div`
  font-size: 24px;
  font-weight: 400;
  font-family: 'Billabong', 'Segoe Script', cursive;
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  cursor: pointer;
  display: flex;

  span {
    display: inline-block;
    transition: all 0.2s ease;
  }

  &:hover span {
    animation: ${letterBounce} 0.4s ease;
  }

  &:hover span:nth-child(1) { animation-delay: 0s; }
  &:hover span:nth-child(2) { animation-delay: 0.05s; }
  &:hover span:nth-child(3) { animation-delay: 0.1s; }
  &:hover span:nth-child(4) { animation-delay: 0.15s; }
  &:hover span:nth-child(5) { animation-delay: 0.2s; }
  &:hover span:nth-child(6) { animation-delay: 0.25s; }
  &:hover span:nth-child(7) { animation-delay: 0.3s; }
  &:hover span:nth-child(8) { animation-delay: 0.35s; }
  &:hover span:nth-child(9) { animation-delay: 0.4s; }
`;

// X (Y) 스타일 로고
const YLogo = styled.div`
  font-size: 28px;
  font-weight: 900;
  color: #fff;
  font-family: 'Segoe UI', sans-serif;
  cursor: pointer;
  display: flex;

  span {
    display: inline-block;
    transition: all 0.2s ease;
  }

  &:hover span {
    animation: ${letterBounce} 0.4s ease;
  }
`;

const SearchBar = styled.div`
  flex: 1;
  max-width: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 8px 16px;
  gap: 8px;
  margin: 0 auto;

  input {
    flex: 1;
    background: none;
    border: none;
    color: #fff;
    font-size: 14px;
    outline: none;
    text-align: center;

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }

  svg {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const HeaderIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HeaderIcon = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const BackButton = styled(Link)<{ $platform?: string }>`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => {
    if (['kakaotalk'].includes(props.$platform || '')) return '#3c1e1e';
    if (['telegram', 'line', 'tinder', 'linkedin', 'facebook', 'instagram', 'x'].includes(props.$platform || '')) return '#fff';
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
  background: ${props => {
    if (['facebook', 'instagram', 'x'].includes(props.$platform || '')) return 'rgba(74, 222, 128, 0.2)';
    if (['kakaotalk', 'telegram', 'line', 'tinder', 'linkedin'].includes(props.$platform || '')) return 'rgba(255,255,255,0.2)';
    return 'var(--bg-secondary)';
  }};
  border-radius: 16px;
  font-size: 13px;
  color: ${props => {
    if (['kakaotalk'].includes(props.$platform || '')) return '#3c1e1e';
    if (['telegram', 'line', 'tinder', 'linkedin', 'facebook', 'instagram', 'x'].includes(props.$platform || '')) return '#fff';
    return 'var(--text-primary)';
  }};
  border: ${props => ['kakaotalk', 'telegram', 'line', 'tinder', 'linkedin', 'facebook', 'instagram', 'x'].includes(props.$platform || '') ? 'none' : '1px solid var(--border-color)'};

  span {
    color: ${props => {
      if (['facebook', 'instagram', 'x'].includes(props.$platform || '')) return '#4ade80';
      if (['kakaotalk', 'telegram', 'line', 'tinder', 'linkedin'].includes(props.$platform || '')) return 'inherit';
      return 'var(--accent-primary)';
    }};
    font-weight: 600;
  }
`;


// ========== 메인 컨텐츠 ==========
const MainContent = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

// ========== 좌측 프로필 영역 (Facebook 스타일) ==========
const LeftSidebar = styled.div<{ $platform?: string }>`
  width: 260px;
  background: ${props => {
    if (['facebook', 'instagram', 'x'].includes(props.$platform || '')) return '#121212';
    return 'var(--bg-card)';
  }};
  overflow-y: auto;
  flex-shrink: 0;
  padding: 16px;

  // 메신저 앱은 프로필 숨김
  ${props => ['kakaotalk', 'telegram', 'line'].includes(props.$platform || '') && `
    display: none;
  `}

  @media (max-width: 1100px) {
    display: none;
  }
`;

const ProfileCard = styled.div<{ $platform?: string }>`
  background: ${props => ['facebook', 'instagram', 'x'].includes(props.$platform || '') ? '#252525' : 'var(--bg-secondary)'};
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  margin-bottom: 16px;
`;

const ProfileCover = styled.div<{ $image?: string }>`
  height: 80px;
  background: ${props => props.$image ? `url(${props.$image})` : 'var(--accent-gradient)'};
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin-bottom: -40px;
`;

const ProfileAvatar = styled.div<{ $image?: string; $platform?: string }>`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: ${props => props.$image ? `url(${props.$image})` : 'var(--accent-gradient)'};
  background-size: cover;
  background-position: center;
  border: 4px solid ${props => ['facebook', 'instagram', 'x'].includes(props.$platform || '') ? '#252525' : 'var(--bg-card)'};
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
`;

const ProfileName = styled.div<{ $platform?: string }>`
  font-size: 20px;
  font-weight: 700;
  color: ${props => ['facebook', 'instagram', 'x'].includes(props.$platform || '') ? '#fff' : 'var(--text-primary)'};
  margin-bottom: 4px;
`;

const ProfileFollowers = styled.div<{ $platform?: string }>`
  font-size: 13px;
  color: ${props => ['facebook', 'instagram', 'x'].includes(props.$platform || '') ? 'rgba(255,255,255,0.6)' : 'var(--text-secondary)'};
  margin-bottom: 12px;
`;

const ProfileBio = styled.div`
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
`;

const ProfileBadges = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
`;

const ProfileBadge = styled.div<{ $color?: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  font-size: 13px;
  color: ${props => props.$color || 'rgba(255,255,255,0.8)'};

  span {
    font-size: 14px;
  }
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

// 좌측 하단 미니 프로필 카드
const MiniProfileCard = styled.div<{ $platform?: string }>`
  background: ${props => ['facebook', 'instagram', 'x'].includes(props.$platform || '') ? '#252525' : 'var(--bg-secondary)'};
  border-radius: 12px;
  padding: 12px;
  margin-top: 16px;
`;

const MiniProfileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const MiniProfileAvatar = styled.div<{ $image?: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.$image ? `url(${props.$image})` : '#666'};
  background-size: cover;
`;

const MiniProfileName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #fff;
`;

const MiniProfileClose = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  border: none;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MiniProfileInfo = styled.div`
  font-size: 12px;
  color: rgba(255,255,255,0.6);
  line-height: 1.5;
`;

// ========== 중앙 피드 영역 (Facebook 스타일) ==========
const FeedArea = styled.div<{ $platform?: string }>`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: ${props => {
    if (['facebook', 'instagram', 'x'].includes(props.$platform || '')) return '#121212';
    return 'var(--bg-secondary)';
  }};

  // 메신저/데이팅 앱은 피드 숨김
  ${props => ['kakaotalk', 'telegram', 'line', 'tinder', 'linkedin'].includes(props.$platform || '') && `
    display: none;
  `}

  @media (max-width: 600px) {
    padding: 8px;
  }
`;

const PostCard = styled.div<{ $platform?: string }>`
  background: ${props => ['facebook', 'instagram', 'x'].includes(props.$platform || '') ? '#1e1e1e' : 'var(--bg-card)'};
  border-radius: 12px;
  margin-bottom: 16px;
  animation: ${fadeIn} 0.4s ease;
  max-width: 550px;
  margin-left: auto;
  margin-right: auto;
  border: ${props => ['facebook', 'instagram', 'x'].includes(props.$platform || '') ? '1px solid rgba(255,255,255,0.08)' : 'none'};
  overflow: hidden;
  box-shadow: ${props => ['facebook', 'instagram', 'x'].includes(props.$platform || '') ? '0 2px 8px rgba(0,0,0,0.3)' : 'none'};
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

const PostAuthorName = styled.div<{ $platform?: string }>`
  font-size: 14px;
  font-weight: 600;
  color: ${props => ['facebook', 'instagram', 'x'].includes(props.$platform || '') ? '#fff' : 'var(--text-primary)'};
`;

const PostTime = styled.div<{ $platform?: string }>`
  font-size: 12px;
  color: ${props => ['facebook', 'instagram', 'x'].includes(props.$platform || '') ? 'rgba(255,255,255,0.5)' : 'var(--text-secondary)'};
`;

const PostContent = styled.div<{ $platform?: string }>`
  padding: 0 16px 12px;
  font-size: 15px;
  color: ${props => ['facebook', 'instagram', 'x'].includes(props.$platform || '') ? '#fff' : 'var(--text-primary)'};
  line-height: 1.5;
`;

const PostImage = styled.div<{ $src: string }>`
  width: 100%;
  height: 400px;
  background: url(${props => props.$src}) center/cover;
  background-color: #000;
`;

const PostActions = styled.div<{ $platform?: string }>`
  display: flex;
  padding: 8px 16px;
  border-top: 1px solid ${props => ['facebook', 'instagram', 'x'].includes(props.$platform || '') ? 'rgba(255,255,255,0.1)' : 'var(--border-color)'};
  gap: 4px;
`;

const PostAction = styled.button<{ $platform?: string }>`
  flex: 1;
  padding: 8px;
  background: none;
  border: none;
  border-radius: 8px;
  color: ${props => ['facebook', 'instagram', 'x'].includes(props.$platform || '') ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)'};
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    background: ${props => ['facebook', 'instagram', 'x'].includes(props.$platform || '') ? 'rgba(255,255,255,0.1)' : 'var(--bg-secondary)'};
  }
`;

// ========== 우측 사이드바 (채팅) ==========
const RightSidebar = styled.div<{ $platform?: string; $showOnMobile?: boolean }>`
  width: 350px;
  min-width: 280px;
  background: #121212;
  overflow: visible;
  flex-shrink: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-left: auto;

  ${props => ['kakaotalk', 'telegram', 'line', 'tinder', 'linkedin'].includes(props.$platform || '') && `
    display: none;
  `}

  @media (max-width: 900px) {
    width: 300px;
    min-width: 250px;
  }

  @media (max-width: 600px) {
    width: 100%;
    min-width: unset;
    position: fixed;
    top: 56px;
    right: 0;
    bottom: 0;
    left: auto;
    z-index: 100;
    background: #121212;
    display: ${props => props.$showOnMobile ? 'flex' : 'none'};
  }
`;

const FloatingChatButton = styled.button<{ $platform?: string }>`
  position: fixed;
  bottom: calc(24px + env(safe-area-inset-bottom, 0px));
  right: 24px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => {
    const config = platformConfig[props.$platform || ''];
    return config ? config.gradient : 'var(--accent-gradient)';
  }};
  border: none;
  color: #fff;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.35);
  z-index: 99;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.9);
  }

  @media (max-width: 600px) {
    display: flex;
  }
`;

const SponsoredSection = styled.div`
  background: #252525;
  border-radius: 12px;
  padding: 12px;
`;

const SponsoredTitle = styled.div`
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  margin-bottom: 12px;
`;

const SponsoredItem = styled.div`
  display: flex;
  gap: 10px;
  padding: 8px 0;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
`;

const SponsoredImage = styled.div<{ $src?: string }>`
  width: 80px;
  height: 60px;
  border-radius: 8px;
  background: ${props => props.$src ? `url(${props.$src})` : '#333'};
  background-size: cover;
  flex-shrink: 0;
`;

const SponsoredText = styled.div`
  flex: 1;
`;

const SponsoredHeadline = styled.div`
  font-size: 13px;
  color: #fff;
  font-weight: 500;
  line-height: 1.3;
  margin-bottom: 4px;
`;

const SponsoredDesc = styled.div`
  font-size: 11px;
  color: rgba(255,255,255,0.5);
`;

const StorySection = styled.div`
  background: #252525;
  border-radius: 12px;
  padding: 12px;
`;

const StoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const StoryDot = styled.div<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$color};
`;

const StoryText = styled.div`
  font-size: 13px;
  color: #fff;
`;

const StorySubtext = styled.div`
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  margin-left: 16px;
`;

// ========== 채팅 팝업 (Facebook 스타일) ==========
const ChatPopup = styled.div<{ $minimized?: boolean }>`
  position: fixed;
  bottom: 0;
  right: 80px;
  width: 328px;
  background: #252525;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
  transition: height 0.3s ease;
  height: ${props => props.$minimized ? '40px' : '450px'};

  @media (max-width: 600px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    border-radius: 0;
    height: 100%;
  }
`;

const ChatPopupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: #1a1a1a;
  cursor: pointer;
  flex-shrink: 0;
`;

const ChatPopupAvatar = styled.div<{ $image?: string }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${props => props.$image ? `url(${props.$image})` : '#666'};
  background-size: cover;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 8px;
    height: 8px;
    background: #31a24c;
    border-radius: 50%;
    border: 2px solid #1a1a1a;
  }
`;

const ChatPopupInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ChatPopupName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChatPopupStatus = styled.div`
  font-size: 11px;
  color: #31a24c;
`;

const ChatPopupActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ChatPopupAction = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ChatPopupMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #1a1a1a;
`;

const ChatPopupInputArea = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
  background: #1a1a1a;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const ChatPopupInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  background: #2a2a2a;
  border: none;
  border-radius: 18px;
  color: #fff;
  font-size: 16px;
  outline: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const ChatPopupSendButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #4ade80;
  border: none;
  color: #0f0f1a;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #22c55e;
  }

  &:disabled {
    background: #333;
    color: #666;
    cursor: not-allowed;
  }
`;

const ChatPopupMessageBubble = styled.div<{ $mine: boolean; $removing?: boolean }>`
  max-width: 80%;
  padding: 10px 14px;
  border-radius: ${props => props.$mine ? '18px 4px 18px 18px' : '4px 18px 18px 18px'};
  background: ${props => props.$mine ? '#3b82f6' : '#2a2a2a'};
  color: #fff;
  font-size: 14px;
  line-height: 1.5;
  align-self: ${props => props.$mine ? 'flex-end' : 'flex-start'};
  transition: all 0.4s ease;
  ${props => props.$removing && `
    animation: ${slideOut} 0.4s ease forwards;
    background: #ef4444;
  `}
`;

const ProfanityWarningText = styled.div`
  text-align: center;
  color: #ef4444;
  font-size: 13px;
  padding: 8px 12px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  margin: 8px 0;
`;

const ChatPopupImageBubble = styled.div<{ $mine: boolean }>`
  max-width: 80%;
  display: flex;
  flex-direction: column;
  align-self: ${props => props.$mine ? 'flex-end' : 'flex-start'};
`;

const ChatPopupMessageImage = styled.img`
  max-width: 180px;
  border-radius: 12px;
  margin-bottom: 4px;
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

const TypingIndicator = styled.div<{ $dark?: boolean }>`
  display: flex;
  gap: 4px;
  padding: 12px 14px;
  background: #2a2a2a;
  border-radius: 18px;
  width: fit-content;

  span {
    width: 6px;
    height: 6px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    animation: ${typing} 1.4s infinite;

    &:nth-of-type(2) { animation-delay: 0.2s; }
    &:nth-of-type(3) { animation-delay: 0.4s; }
  }
`;

const HintBox = styled.div<{ $dark?: boolean }>`
  margin: 8px 0;
  padding: 10px 12px;
  background: #2a2a2a;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const HintText = styled.div<{ $dark?: boolean }>`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
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
  font-size: 16px;
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

// ========== 성공 축하 모달 ==========
const SuccessModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: ${fadeIn} 0.3s ease;
`;

const SuccessModalBox = styled.div`
  background: var(--bg-card);
  border-radius: 24px;
  padding: 32px 28px;
  max-width: 380px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  animation: ${celebrate} 0.5s ease;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #20c997 0%, #12b886 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 40px;
  animation: ${celebrate} 1s ease infinite;
`;

const SuccessTitle = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: #20c997;
  margin-bottom: 8px;
`;

const SuccessSubtitle = styled.div`
  font-size: 16px;
  color: var(--text-primary);
  margin-bottom: 24px;
`;

const SuccessScoreBox = styled.div`
  background: linear-gradient(135deg, rgba(32, 201, 151, 0.15) 0%, rgba(18, 184, 134, 0.1) 100%);
  border: 2px solid rgba(32, 201, 151, 0.3);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
`;

const SuccessScoreValue = styled.div`
  font-size: 48px;
  font-weight: 800;
  color: #20c997;
  line-height: 1;
`;

const SuccessScoreLabel = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 4px;
`;

const SuccessFeedbackSection = styled.div`
  text-align: left;
  margin-bottom: 24px;
`;

const SuccessFeedbackTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 12px;
`;

const SuccessFeedbackList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const SuccessFeedbackItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.4;

  &::before {
    content: '\\2713';
    color: #20c997;
    font-weight: bold;
    flex-shrink: 0;
  }
`;

const SuccessButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #20c997 0%, #12b886 100%);
  border: none;
  border-radius: 14px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(32, 201, 151, 0.4);
  }
`;

const ConfettiPiece = styled.div<{ $delay: number; $left: number; $color: string }>`
  position: fixed;
  width: 10px;
  height: 10px;
  background: ${props => props.$color};
  top: -10px;
  left: ${props => props.$left}%;
  animation: ${confetti} 3s linear forwards;
  animation-delay: ${props => props.$delay}s;
  border-radius: 2px;
  z-index: 10001;
`;

// ========== 비속어 경고 스타일 ==========
const ProfanityWarningOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: ${fadeIn} 0.2s ease;
`;

const ProfanityWarningBox = styled.div`
  background: var(--bg-card);
  border-radius: 16px;
  padding: 24px;
  max-width: 320px;
  width: 90%;
  text-align: center;
  animation: ${shake} 0.5s ease;
  border: 2px solid #f44336;
`;

const ProfanityWarningIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  animation: ${warningPulse} 1s ease infinite;
`;

const ProfanityWarningTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #f44336;
  margin-bottom: 8px;
`;

const ProfanityWarningMessage = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 20px;
`;

const ProfanityWarningButton = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.98);
  }
`;

const ShakingInput = styled.form<{ $shaking?: boolean }>`
  display: flex;
  gap: 8px;
  padding: 12px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
  border-top: 1px solid var(--border-color);
  animation: ${props => props.$shaking ? shake : 'none'} 0.5s ease;
`;

const DeletedMessageBubble = styled.div<{ $mine: boolean }>`
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 18px;
  background: ${props => props.$mine ? 'rgba(244, 67, 54, 0.2)' : 'var(--bg-secondary)'};
  color: #f44336;
  font-size: 14px;
  line-height: 1.4;
  animation: ${slideOut} 0.5s ease forwards;
  font-style: italic;
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
    if (props.$platform === 'kakaotalk') return '#fff';
    const config = platformConfig[props.$platform || ''];
    return config ? config.gradient : 'var(--bg-card)';
  }};
  color: ${props => props.$platform === 'kakaotalk' ? '#191f28' : '#fff'};
  ${props => props.$platform === 'kakaotalk' && `
    justify-content: center;
    position: relative;
    border-bottom: 1px solid #e5e5e5;
  `}
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
  border: ${props => props.$platform === 'kakaotalk' ? '1px solid #e5e5e5' : `1px solid ${platformConfig[props.$platform || '']?.color || 'var(--border-color)'}40`};
  border-radius: 20px;
  color: ${props => props.$platform === 'kakaotalk' ? '#191f28' : 'var(--text-primary)'};
  font-size: 16px;
  outline: none;

  &::placeholder {
    color: ${props => props.$platform === 'kakaotalk' ? '#999' : 'var(--text-tertiary)'};
  }

  &:focus {
    border-color: ${props => {
      if (props.$platform === 'kakaotalk') return '#fee500';
      const config = platformConfig[props.$platform || ''];
      return config ? config.color : 'var(--accent-primary)';
    }};
  }
`;

// 카카오톡 전용 입력 영역
const KakaoInputArea = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
  background: #fff;
  border-top: 1px solid #e5e5e5;
`;

// 카카오톡 메시지 행 (프로필 사진 포함)
const KakaoMessageRow = styled.div<{ $mine: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  justify-content: ${props => props.$mine ? 'flex-end' : 'flex-start'};
  margin-bottom: 8px;
  padding: 0 16px;
`;

const KakaoProfilePhoto = styled.div<{ $image?: string }>`
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: ${props => props.$image ? `url(${props.$image})` : '#ccc'};
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
`;

const KakaoMessageContent = styled.div<{ $mine: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$mine ? 'flex-end' : 'flex-start'};
  max-width: 70%;
`;

const KakaoSenderName = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
`;

const KakaoBubbleRow = styled.div<{ $mine: boolean }>`
  display: flex;
  align-items: flex-end;
  gap: 6px;
  flex-direction: ${props => props.$mine ? 'row-reverse' : 'row'};
`;

const KakaoBubble = styled.div<{ $mine: boolean }>`
  padding: 10px 14px;
  font-size: 14px;
  line-height: 1.4;
  background: ${props => props.$mine ? '#fee500' : '#fff'};
  color: #191f28;
  border-radius: ${props => props.$mine ? '16px 4px 16px 16px' : '4px 16px 16px 16px'};
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
`;

const KakaoTime = styled.div`
  font-size: 10px;
  color: #666;
  white-space: nowrap;
`;

// ========== 텔레그램 전용 스타일 ==========
const TelegramHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #5b9c5b;
  gap: 12px;
`;

const TelegramProfilePhoto = styled.div<{ $image?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.$image ? `url(${props.$image})` : '#6a9bc9'};
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
`;

const TelegramHeaderInfo = styled.div`
  flex: 1;
`;

const TelegramHeaderName = styled.div`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`;

const TelegramHeaderStatus = styled.div`
  color: rgba(255,255,255,0.7);
  font-size: 13px;
`;

const TelegramChatArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  background: linear-gradient(135deg, #6b9b7a 0%, #a8c686 25%, #d4e09b 50%, #a8c686 75%, #6b9b7a 100%);
`;

const TelegramMessageRow = styled.div<{ $mine: boolean }>`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-bottom: 8px;
  justify-content: ${props => props.$mine ? 'flex-end' : 'flex-start'};
  padding: 0 8px;
`;

const TelegramBubble = styled.div<{ $mine: boolean }>`
  max-width: 75%;
  padding: 8px 12px;
  font-size: 14px;
  line-height: 1.4;
  background: ${props => props.$mine ? '#3d8ed9' : '#fff'};
  color: ${props => props.$mine ? '#fff' : '#000'};
  border-radius: ${props => props.$mine ? '12px 4px 12px 12px' : '4px 12px 12px 12px'};
  position: relative;
`;

const TelegramSenderName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #3a8ed9;
  margin-bottom: 2px;
`;

const TelegramTime = styled.span<{ $mine?: boolean }>`
  font-size: 11px;
  color: ${props => props.$mine ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)'};
  margin-left: 8px;
  float: right;
  margin-top: 4px;
`;

const TelegramInputArea = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
  background: #fff;
  border-top: 1px solid #e5e5e5;
`;

const TelegramInput = styled.input`
  flex: 1;
  padding: 10px 14px;
  background: #f1f1f1;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  color: #000;
  outline: none;

  &::placeholder {
    color: rgba(0,0,0,0.4);
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

const ScammerGaveUpBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, rgba(32, 201, 151, 0.2) 0%, rgba(18, 184, 134, 0.15) 100%);
  border: 2px solid #20c997;
  border-radius: 20px;
  color: #20c997;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 16px;
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
    completionReason?: string;
  } | null>(null);

  // 종료 확인 모달
  const [showExitModal, setShowExitModal] = useState(false);

  // 성공 축하 모달 (스캐머 포기 시)
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successFeedback, setSuccessFeedback] = useState<string[]>([]);

  // 비속어 경고
  const [profanityWarningInChat, setProfanityWarningInChat] = useState(false);
  const [inputShaking, setInputShaking] = useState(false);
  const [removingMessageId, setRemovingMessageId] = useState<string | null>(null);

  // 모바일 채팅 토글 (SNS 플랫폼)
  const [showMobileChat, setShowMobileChat] = useState(false);

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

  // 비속어 체크 함수
  const checkProfanity = (text: string): boolean => {
    const lowerText = text.toLowerCase().replace(/\s/g, '');
    return PROFANITY_LIST.some(word =>
      lowerText.includes(word.toLowerCase().replace(/\s/g, ''))
    );
  };

  // 성공 피드백 생성
  const generateSuccessFeedback = (userMessage: string): string[] => {
    const feedbacks: string[] = [];

    // 사용자 메시지 분석해서 잘한 점 찾기
    if (userMessage.includes('사기') || userMessage.includes('스캠')) {
      feedbacks.push('사기 패턴을 정확하게 인식했습니다');
    }
    if (userMessage.includes('신고') || userMessage.includes('경찰')) {
      feedbacks.push('적절한 신고 의지를 보여주었습니다');
    }
    if (userMessage.includes('차단') || userMessage.includes('끊')) {
      feedbacks.push('단호하게 대화를 종료하려 했습니다');
    }
    if (userMessage.includes('영상통화') || userMessage.includes('만나')) {
      feedbacks.push('신원 확인을 요청했습니다');
    }
    if (userMessage.includes('의심') || userMessage.includes('수상')) {
      feedbacks.push('의심스러운 점을 놓치지 않았습니다');
    }
    if (userMessage.includes('안 줘') || userMessage.includes('못 줘') || userMessage.includes('거절')) {
      feedbacks.push('금전 요청을 단호하게 거절했습니다');
    }

    // 기본 피드백
    if (feedbacks.length === 0) {
      feedbacks.push('스캐머의 수법에 넘어가지 않았습니다');
    }

    feedbacks.push('냉정하고 논리적으로 대응했습니다');
    feedbacks.push('스캐머가 더 이상 설득이 불가능하다고 판단했습니다');

    return feedbacks.slice(0, 4);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !session || sending) return;

    const userMessage = input.trim();
    const messageId = Date.now().toString();

    // 비속어 경고 표시 중이면 지우기
    if (profanityWarningInChat) {
      setProfanityWarningInChat(false);
    }

    // 비속어 체크
    if (checkProfanity(userMessage)) {
      // 메시지 먼저 추가
      setMessages(prev => [...prev, {
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString(),
        id: messageId,
      }]);
      setInput('');

      // 애니메이션 후 제거
      setRemovingMessageId(messageId);
      setTimeout(() => {
        setMessages(prev => prev.filter(m => m.id !== messageId));
        setRemovingMessageId(null);
        setProfanityWarningInChat(true);
      }, 500);
      return;
    }

    setInput('');
    setSending(true);

    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
      id: messageId,
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

      // 스캐머가 포기한 경우 - 성공 모달 표시
      if (data.isCompleted && data.completionReason === 'scammer_gave_up') {
        const feedback = generateSuccessFeedback(userMessage);
        setSuccessFeedback(feedback);
        setTimeout(() => setShowSuccessModal(true), 500);
        return;
      }

      // 10턴 후 자동 종료
      if (newTurnCount >= MAX_TURNS) {
        setTimeout(() => endSession(), 1000);
      }
    } catch (err: any) {
      console.error('Failed to send message:', err);
      // 에러 시 사용자 메시지 제거하고 조용히 처리
      setMessages(prev => prev.filter(m => m.id !== messageId));
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
          <PersonaSubtitle>5번의 대화를 통해 로맨스 스캠 대응력을 테스트합니다</PersonaSubtitle>
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
    const scammerGaveUp = result.completionReason === 'scammer_gave_up';
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
            {scammerGaveUp && (
              <ScammerGaveUpBadge>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                스캐머 포기
              </ScammerGaveUpBadge>
            )}
            <ScoreCircle $score={score}>
              <ScoreInner>
                <ScoreValue $score={score}>{score}</ScoreValue>
                <ScoreLabel>/ 100점</ScoreLabel>
              </ScoreInner>
            </ScoreCircle>
            <ResultGrade $score={score}>{scammerGaveUp ? '완벽한 승리!' : getGradeText(score)}</ResultGrade>
            <ResultMessage>
              {scammerGaveUp
                ? '당신의 단호한 대응에 스캐머가 포기했습니다! 실제 상황에서도 이렇게 대응하세요.'
                : score >= 80
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
  const isSocialMediaStyle = ['facebook', 'instagram', 'x'].includes(currentPlatform);

  // 플랫폼별 로고 렌더링
  const renderPlatformLogo = () => {
    if (currentPlatform === 'facebook') {
      return (
        <FakebookLogo>
          <span>F</span><span>a</span><span>k</span><span>e</span><span>b</span><span>o</span><span>o</span><span>k</span>
        </FakebookLogo>
      );
    }
    if (currentPlatform === 'instagram') {
      return (
        <InstaframLogo>
          <span>I</span><span>n</span><span>s</span><span>t</span><span>a</span><span>f</span><span>r</span><span>a</span><span>m</span>
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

  return (
    <FullScreenContainer>
      <TopHeader $platform={currentPlatform}>
        <HeaderInner>
          {isSocialMediaStyle ? (
            <>
              <BackButton to="/" $platform={currentPlatform} onClick={(e) => {
                e.preventDefault();
                setShowExitModal(true);
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </BackButton>
              {renderPlatformLogo()}
              <SearchBar>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input readOnly />
              </SearchBar>
              <HeaderIcons>
                <TurnCounter $platform={currentPlatform}><span>{turnCount}</span> / {MAX_TURNS}</TurnCounter>
              </HeaderIcons>
            </>
          ) : (
            <>
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
            </>
          )}
        </HeaderInner>
      </TopHeader>

      <MainContent>
        {/* 좌측: 프로필 영역 (소셜 미디어 스타일) */}
        {isSocialMediaStyle ? (
          <LeftSidebar $platform={currentPlatform} style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {selectedPersona && (
              <>
                {/* 큰 프로필 사진 */}
                <div style={{
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  background: selectedPersona.profile_photo ? `url(${selectedPersona.profile_photo})` : '#333',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  marginBottom: '24px'
                }} />

                {/* 이름 */}
                <div style={{
                  color: '#fff',
                  fontSize: '28px',
                  fontWeight: '700',
                  marginBottom: '8px'
                }}>
                  {selectedPersona.name}
                </div>

                {/* 팔로워 */}
                <div style={{
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '15px',
                  marginBottom: '32px'
                }}>
                  팔로워 {Math.floor(Math.random() * 900 + 100)} 명
                </div>

                {/* 프로필 정보 리스트 */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.8)', fontSize: '15px' }}>
                    <span>💼</span> {selectedPersona.occupation}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.8)', fontSize: '15px' }}>
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
                  <ProfileAvatar $image={selectedPersona.profile_photo} $platform={currentPlatform} />
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
        )}

        {/* 중앙 피드 - 메신저/데이팅 앱에서는 숨김 */}
        <FeedArea $platform={currentPlatform}>
          {posts.map((post) => (
            <PostCard key={post.id} $platform={currentPlatform}>
              <PostHeader>
                <PostAvatar $image={selectedPersona?.profile_photo} />
                <PostAuthor>
                  <PostAuthorName $platform={currentPlatform}>{selectedPersona?.name}</PostAuthorName>
                  <PostTime $platform={currentPlatform}>{post.time}</PostTime>
                </PostAuthor>
              </PostHeader>
              <PostContent $platform={currentPlatform}>{post.content}</PostContent>
              {post.image && <PostImage $src={post.image} />}
              <PostActions $platform={currentPlatform}>
                <PostAction $platform={currentPlatform}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                  </svg>
                  {post.likes}
                </PostAction>
                <PostAction $platform={currentPlatform}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  {post.comments}
                </PostAction>
                <PostAction $platform={currentPlatform}>
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

        {/* 우측 채팅 영역 - 소셜 미디어 스타일 */}
        {isSocialMediaStyle && (
          <RightSidebar $platform={currentPlatform} $showOnMobile={showMobileChat} style={{ width: '350px', maxWidth: '400px' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              background: '#1e1e1e',
              borderRadius: '12px',
              overflow: 'hidden',
              height: '75%',
              minHeight: '500px'
            }}>
              {/* 채팅 헤더 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                background: '#1a1a1a',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}>
                <button style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '20px',
                  cursor: 'pointer',
                  marginRight: '12px'
                }}>‹</button>
                <span style={{ color: '#fff', fontSize: '16px', fontWeight: '600', flex: 1 }}>
                  {selectedPersona?.name}
                </span>
                <button
                  onClick={() => setShowMobileChat(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '18px',
                    cursor: 'pointer'
                  }}
                >×</button>
              </div>

              <ChatPopupMessages>
                {currentHint && (
                  <HintBox>
                    <HintText>{currentHint}</HintText>
                  </HintBox>
                )}
                {messages.map((msg, i) => (
                  msg.imageUrl ? (
                    <ChatPopupImageBubble key={msg.id || i} $mine={msg.role === 'user'}>
                      <ChatPopupMessageImage src={msg.imageUrl} alt="이미지" />
                      {msg.content && (
                        <ChatPopupMessageBubble $mine={msg.role === 'user'} $removing={msg.id === removingMessageId}>
                          {msg.content}
                        </ChatPopupMessageBubble>
                      )}
                    </ChatPopupImageBubble>
                  ) : (
                    <ChatPopupMessageBubble key={msg.id || i} $mine={msg.role === 'user'} $removing={msg.id === removingMessageId}>
                      {msg.content}
                    </ChatPopupMessageBubble>
                  )
                ))}
                {profanityWarningInChat && (
                  <ProfanityWarningText>비속어는 사용할 수 없습니다</ProfanityWarningText>
                )}
                {isTyping && (
                  <TypingIndicator><span /><span /><span /></TypingIndicator>
                )}
                <div ref={messagesEndRef} />
              </ChatPopupMessages>

              <ChatPopupInputArea onSubmit={sendMessage}>
                <ChatPopupInput
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="메시지 입력..."
                  disabled={sending}
                />
                <ChatPopupSendButton type="submit" disabled={!input.trim() || sending}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </ChatPopupSendButton>
              </ChatPopupInputArea>
            </div>
          </RightSidebar>
        )}

        {/* 모바일 채팅 열기 FAB (SNS 플랫폼) */}
        {isSocialMediaStyle && !showMobileChat && (
          <FloatingChatButton $platform={currentPlatform} onClick={() => setShowMobileChat(true)}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </FloatingChatButton>
        )}

        {/* 카카오톡 전용 UI */}
        {currentPlatform === 'kakaotalk' && (
          <PlatformMessengerArea $platform={currentPlatform}>
            {/* 카카오톡 채팅 헤더 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              background: '#b2c7d9'
            }}>
              {/* 뒤로가기 */}
              <button
                onClick={() => setShowExitModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#191f28" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              {/* 이름 */}
              <div style={{ flex: 1, textAlign: 'center' }}>
                <span style={{ color: '#191f28', fontSize: '16px', fontWeight: '600' }}>
                  {selectedPersona?.name}
                </span>
              </div>

              {/* 검색 */}
              <button style={{
                background: 'none',
                border: 'none',
                padding: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#191f28" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </button>

              {/* 메뉴 */}
              <button style={{
                background: 'none',
                border: 'none',
                padding: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#191f28" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>

            {/* 카카오톡 메시지 영역 */}
            <MessengerMessages style={{ background: '#b2c7d9', padding: '16px 0' }}>
              {currentHint && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '0 16px', marginBottom: '12px' }}>
                  <div style={{
                    background: 'rgba(0,0,0,0.15)',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    fontSize: '12px',
                    color: '#fff',
                    maxWidth: '50%',
                    textAlign: 'center'
                  }}>
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
                  <KakaoMessageRow key={msg.id || i} $mine={msg.role === 'user'}>
                    {msg.role !== 'user' && (
                      <KakaoProfilePhoto $image={selectedPersona?.profile_photo} />
                    )}
                    <KakaoMessageContent $mine={msg.role === 'user'}>
                      {msg.role !== 'user' && (
                        <KakaoSenderName>{selectedPersona?.name}</KakaoSenderName>
                      )}
                      <KakaoBubbleRow $mine={msg.role === 'user'}>
                        {msg.imageUrl ? (
                          <div>
                            <MessageImage src={msg.imageUrl} alt="이미지" style={{ borderRadius: '12px', maxWidth: '200px' }} />
                            {msg.content && (
                              <KakaoBubble $mine={msg.role === 'user'} style={{ marginTop: '4px' }}>
                                {msg.content}
                              </KakaoBubble>
                            )}
                          </div>
                        ) : (
                          <KakaoBubble $mine={msg.role === 'user'} style={msg.id === removingMessageId ? { background: '#ef4444', color: '#fff' } : {}}>
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
                  <KakaoProfilePhoto $image={selectedPersona?.profile_photo} />
                  <KakaoMessageContent $mine={false}>
                    <KakaoSenderName>{selectedPersona?.name}</KakaoSenderName>
                    <TypingIndicator><span /><span /><span /></TypingIndicator>
                  </KakaoMessageContent>
                </KakaoMessageRow>
              )}
              <div ref={messagesEndRef} />
            </MessengerMessages>

            {/* 카카오톡 입력 영역 */}
            <KakaoInputArea onSubmit={sendMessage}>
              {/* + 버튼 */}
              <button type="button" style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>

              {/* 입력창 + 이모지 포함 */}
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                background: '#e5e7eb',
                borderRadius: '18px',
                padding: '0 8px 0 12px'
              }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder=""
                  disabled={sending}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '16px',
                    color: '#191f28',
                    outline: 'none'
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (input.trim() && !sending) {
                        sendMessage(e as unknown as React.FormEvent);
                      }
                    }
                  }}
                />
                {/* 이모지 버튼 (입력창 내부) */}
                <button type="button" style={{
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <circle cx="9" cy="9" r="1" fill="#9ca3af" />
                    <circle cx="15" cy="9" r="1" fill="#9ca3af" />
                  </svg>
                </button>
              </div>

              {/* 보내기 버튼 */}
              <button type="submit" disabled={!input.trim() || sending} style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none',
                background: input.trim() ? '#fee500' : '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                flexShrink: 0
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={input.trim() ? '#3c1e1e' : '#9ca3af'} strokeWidth="2.5">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </button>
            </KakaoInputArea>
          </PlatformMessengerArea>
        )}

        {/* 텔레그램 전용 UI */}
        {currentPlatform === 'telegram' && (
          <PlatformMessengerArea $platform={currentPlatform} style={{ background: '#6b9b7a' }}>
            {/* 텔레그램 헤더 */}
            <TelegramHeader>
              <button
                onClick={() => setShowExitModal(true)}
                style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <TelegramProfilePhoto $image={selectedPersona?.profile_photo} />
              <TelegramHeaderInfo>
                <TelegramHeaderName>{selectedPersona?.name}</TelegramHeaderName>
                <TelegramHeaderStatus>최근 접속</TelegramHeaderStatus>
              </TelegramHeaderInfo>
              <button style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </button>
            </TelegramHeader>

            {/* 텔레그램 메시지 영역 */}
            <TelegramChatArea>
              {currentHint && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    padding: '6px 12px',
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.7)'
                  }}>
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
                  <TelegramMessageRow key={msg.id || i} $mine={msg.role === 'user'}>
                    {msg.role !== 'user' && (
                      <TelegramProfilePhoto $image={selectedPersona?.profile_photo} style={{ width: '32px', height: '32px' }} />
                    )}
                    <TelegramBubble $mine={msg.role === 'user'} style={msg.id === removingMessageId ? { background: '#ef4444' } : {}}>
                      {msg.role !== 'user' && (
                        <TelegramSenderName>{selectedPersona?.name}</TelegramSenderName>
                      )}
                      {msg.imageUrl && (
                        <MessageImage src={msg.imageUrl} alt="이미지" style={{ borderRadius: '8px', maxWidth: '200px', marginBottom: '4px' }} />
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
                  <TelegramProfilePhoto $image={selectedPersona?.profile_photo} style={{ width: '32px', height: '32px' }} />
                  <TelegramBubble $mine={false}>
                    <TelegramSenderName>{selectedPersona?.name}</TelegramSenderName>
                    <TypingIndicator><span /><span /><span /></TypingIndicator>
                  </TelegramBubble>
                </TelegramMessageRow>
              )}
              <div ref={messagesEndRef} />
            </TelegramChatArea>

            {/* 텔레그램 입력 영역 */}
            <TelegramInputArea onSubmit={sendMessage}>
              <button type="button" style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7a7a7a" strokeWidth="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </button>
              <TelegramInput
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="메시지"
                disabled={sending}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim() && !sending) {
                      sendMessage(e as unknown as React.FormEvent);
                    }
                  }
                }}
              />
              <button type="button" style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7a7a7a" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <circle cx="9" cy="9" r="1" fill="#7a7a7a" />
                  <circle cx="15" cy="9" r="1" fill="#7a7a7a" />
                </svg>
              </button>
              {input.trim() ? (
                <button type="submit" style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#3d8ed9">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              ) : (
                <button type="button" style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7a7a7a" strokeWidth="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                </button>
              )}
            </TelegramInputArea>
          </PlatformMessengerArea>
        )}

        {/* 우측 메신저 - 기타 플랫폼 (카카오톡, 텔레그램, 소셜미디어 제외) */}
        {!isSocialMediaStyle && currentPlatform !== 'kakaotalk' && currentPlatform !== 'telegram' && (
          <PlatformMessengerArea $platform={currentPlatform}>
            <PlatformMessengerHeader $platform={currentPlatform}>
              <PlatformMessengerAvatar $image={selectedPersona?.profile_photo} $platform={currentPlatform} />
              <MessengerInfo>
                <PlatformMessengerName>{selectedPersona?.name}</PlatformMessengerName>
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
                <MessageRow key={msg.id || i} $mine={msg.role === 'user'} style={msg.id === removingMessageId ? { animation: 'slideOut 0.4s ease forwards' } : {}}>
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
                    <PlatformMessageBubble $mine={msg.role === 'user'} $platform={currentPlatform} style={msg.id === removingMessageId ? { background: '#ef4444' } : {}}>
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
                  <TypingIndicator><span /><span /><span /></TypingIndicator>
                </MessageRow>
              )}
              <div ref={messagesEndRef} />
            </MessengerMessages>

            <ShakingInput onSubmit={sendMessage} $shaking={inputShaking}>
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
            </ShakingInput>
          </PlatformMessengerArea>
        )}
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


      {/* 성공 축하 모달 (스캐머 포기 시) */}
      {showSuccessModal && (
        <>
          {/* 색종이 효과 */}
          {[...Array(20)].map((_, i) => (
            <ConfettiPiece
              key={i}
              $delay={Math.random() * 0.5}
              $left={Math.random() * 100}
              $color={['#20c997', '#ffc107', '#ff6b6b', '#845ef7', '#339af0'][i % 5]}
            />
          ))}
          <SuccessModalOverlay>
            <SuccessModalBox>
              <SuccessIcon>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </SuccessIcon>
              <SuccessTitle>완벽한 대응!</SuccessTitle>
              <SuccessSubtitle>
                스캐머가 포기했습니다
              </SuccessSubtitle>
              <SuccessScoreBox>
                <SuccessScoreValue>100</SuccessScoreValue>
                <SuccessScoreLabel>만점</SuccessScoreLabel>
              </SuccessScoreBox>
              <SuccessFeedbackSection>
                <SuccessFeedbackTitle>잘한 점</SuccessFeedbackTitle>
                <SuccessFeedbackList>
                  {successFeedback.map((feedback, i) => (
                    <SuccessFeedbackItem key={i}>{feedback}</SuccessFeedbackItem>
                  ))}
                </SuccessFeedbackList>
              </SuccessFeedbackSection>
              <SuccessButton onClick={() => {
                setShowSuccessModal(false);
                setResult({
                  finalScore: 100,
                  totalTurns: turnCount,
                  durationSeconds: session ? Math.floor((Date.now() - new Date(session.sessionId).getTime()) / 1000) : 0,
                  tacticsEncountered: [],
                  completionReason: 'scammer_gave_up',
                });
                setPhase('result');
              }}>
                결과 확인하기
              </SuccessButton>
            </SuccessModalBox>
          </SuccessModalOverlay>
        </>
      )}
    </FullScreenContainer>
  );
}
