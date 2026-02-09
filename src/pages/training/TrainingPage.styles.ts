import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';

// ========== 플랫폼별 설정 ==========
export const platformConfig: Record<
  string,
  {
    name: string;
    color: string;
    gradient: string;
    buttonColor: string;
  }
> = {
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
    gradient:
      'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
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

// Animations
export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const slideIn = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;

export const typing = keyframes`
  0%, 60%, 100% { opacity: 0.3; }
  30% { opacity: 1; }
`;

export const blink = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`;

export const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const celebrate = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

export const confetti = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
`;

export const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
`;

export const slideOut = keyframes`
  0% { opacity: 1; transform: translateX(0); }
  100% { opacity: 0; transform: translateX(-100%); }
`;

export const warningPulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(244, 67, 54, 0); }
`;

export const letterBounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

// ========== 전체 화면 컨테이너 ==========
export const FullScreenContainer = styled.div`
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
export const TopHeader = styled.header<{ $platform?: string }>`
  position: sticky;
  top: 0;
  background: ${(props) => {
    const config = platformConfig[props.$platform || ''];
    if (props.$platform === 'facebook') return '#1a1a1a';
    if (props.$platform === 'instagram') return '#000';
    if (props.$platform === 'x') return '#000';
    if (
      config &&
      ['kakaotalk', 'telegram', 'line', 'tinder', 'linkedin'].includes(props.$platform || '')
    ) {
      return config.gradient;
    }
    return 'var(--bg-card)';
  }};
  color: ${(props) => {
    if (['kakaotalk'].includes(props.$platform || '')) return '#3c1e1e';
    if (
      ['telegram', 'line', 'tinder', 'linkedin', 'facebook', 'instagram', 'x'].includes(
        props.$platform || '',
      )
    )
      return '#fff';
    return 'var(--text-primary)';
  }};
  z-index: 100;
  border-bottom: ${(props) => {
    if (['facebook', 'instagram', 'x'].includes(props.$platform || ''))
      return '1px solid rgba(255,255,255,0.1)';
    if (['kakaotalk', 'telegram', 'line', 'tinder', 'linkedin'].includes(props.$platform || ''))
      return 'none';
    return '1px solid var(--border-color)';
  }};
  flex-shrink: 0;
`;

export const HeaderInner = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 16px;
`;

export const FakebookLogo = styled.div`
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
export const InstaframLogo = styled.div`
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
export const YLogo = styled.div`
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

export const SearchBar = styled.div`
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

export const HeaderIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const HeaderIcon = styled.button`
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

export const BackButton = styled(Link)<{ $platform?: string }>`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => {
    if (['kakaotalk'].includes(props.$platform || '')) return '#3c1e1e';
    if (
      ['telegram', 'line', 'tinder', 'linkedin', 'facebook', 'instagram', 'x'].includes(
        props.$platform || '',
      )
    )
      return '#fff';
    return 'var(--text-primary)';
  }};
  border-radius: 12px;
  text-decoration: none;

  &:active {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const HeaderTitle = styled.h1<{ $platform?: string }>`
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: ${(props) => {
    if (['kakaotalk'].includes(props.$platform || '')) return '#3c1e1e';
    if (['telegram', 'line', 'tinder', 'linkedin'].includes(props.$platform || '')) return '#fff';
    return 'var(--text-primary)';
  }};
  margin: 0;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TurnCounter = styled.div<{ $platform?: string }>`
  padding: 6px 12px;
  background: ${(props) => {
    if (['facebook', 'instagram', 'x'].includes(props.$platform || ''))
      return 'rgba(74, 222, 128, 0.2)';
    if (['kakaotalk', 'telegram', 'line', 'tinder', 'linkedin'].includes(props.$platform || ''))
      return 'rgba(255,255,255,0.2)';
    return 'var(--bg-secondary)';
  }};
  border-radius: 16px;
  font-size: 13px;
  color: ${(props) => {
    if (['kakaotalk'].includes(props.$platform || '')) return '#3c1e1e';
    if (
      ['telegram', 'line', 'tinder', 'linkedin', 'facebook', 'instagram', 'x'].includes(
        props.$platform || '',
      )
    )
      return '#fff';
    return 'var(--text-primary)';
  }};
  border: ${(props) => (['kakaotalk', 'telegram', 'line', 'tinder', 'linkedin', 'facebook', 'instagram', 'x'].includes(props.$platform || '') ? 'none' : '1px solid var(--border-color)')};

  span {
    color: ${(props) => {
      if (['facebook', 'instagram', 'x'].includes(props.$platform || '')) return '#4ade80';
      if (['kakaotalk', 'telegram', 'line', 'tinder', 'linkedin'].includes(props.$platform || ''))
        return 'inherit';
      return 'var(--accent-primary)';
    }};
    font-weight: 600;
  }
`;

// ========== 메인 컨텐츠 ==========
export const MainContent = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

// ========== 좌측 프로필 영역 (Facebook 스타일) ==========
export const LeftSidebar = styled.div<{ $platform?: string }>`
  width: 260px;
  background: ${(props) => {
    if (['facebook', 'instagram', 'x'].includes(props.$platform || '')) return '#121212';
    return 'var(--bg-card)';
  }};
  overflow-y: auto;
  flex-shrink: 0;
  padding: ${(props) => (['facebook', 'instagram', 'x'].includes(props.$platform || '') ? '24px' : '16px')};

  ${(props) =>
    ['facebook', 'instagram', 'x'].includes(props.$platform || '') &&
    `
    display: flex;
    flex-direction: column;
    align-items: center;
  `}

  // 메신저 앱은 프로필 숨김
  ${(props) =>
    ['kakaotalk', 'telegram', 'line'].includes(props.$platform || '') &&
    `
    display: none;
  `}

  @media (max-width: 1100px) {
    display: none;
  }
`;

export const ProfileCard = styled.div<{ $platform?: string }>`
  background: ${(props) => (['facebook', 'instagram', 'x'].includes(props.$platform || '') ? '#252525' : 'var(--bg-secondary)')};
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  margin-bottom: 16px;
`;

export const ProfileCover = styled.div<{ $image?: string }>`
  height: 80px;
  background: ${(props) => (props.$image ? `url(${props.$image})` : 'var(--accent-gradient)')};
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin-bottom: -40px;
`;

export const ProfileAvatar = styled.div<{ $image?: string; $platform?: string }>`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: ${(props) => (props.$image ? `url(${props.$image})` : 'var(--accent-gradient)')};
  background-size: cover;
  background-position: center;
  border: 4px solid ${(props) => (['facebook', 'instagram', 'x'].includes(props.$platform || '') ? '#252525' : 'var(--bg-card)')};
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
`;

export const ProfileName = styled.div<{ $platform?: string }>`
  font-size: 20px;
  font-weight: 700;
  color: ${(props) => (['facebook', 'instagram', 'x'].includes(props.$platform || '') ? '#fff' : 'var(--text-primary)')};
  margin-bottom: 4px;
`;

export const ProfileFollowers = styled.div<{ $platform?: string }>`
  font-size: 13px;
  color: ${(props) => (['facebook', 'instagram', 'x'].includes(props.$platform || '') ? 'rgba(255,255,255,0.6)' : 'var(--text-secondary)')};
  margin-bottom: 12px;
`;

export const ProfileBio = styled.div`
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
`;

export const ProfileBadges = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
`;

export const ProfileBadge = styled.div<{ $color?: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  font-size: 13px;
  color: ${(props) => props.$color || 'rgba(255,255,255,0.8)'};

  span {
    font-size: 14px;
  }
`;

export const ProfileStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
`;

export const StatItem = styled.div`
  text-align: center;
`;

export const StatValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
`;

export const StatLabel = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
`;

export const ProfileInfo = styled.div`
  padding: 16px;
`;

export const InfoItem = styled.div`
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
export const MiniProfileCard = styled.div<{ $platform?: string }>`
  background: ${(props) => (['facebook', 'instagram', 'x'].includes(props.$platform || '') ? '#252525' : 'var(--bg-secondary)')};
  border-radius: 12px;
  padding: 12px;
  margin-top: 16px;
`;

export const MiniProfileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const MiniProfileAvatar = styled.div<{ $image?: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${(props) => (props.$image ? `url(${props.$image})` : '#666')};
  background-size: cover;
`;

export const MiniProfileName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #fff;
`;

export const MiniProfileClose = styled.button`
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

export const MiniProfileInfo = styled.div`
  font-size: 12px;
  color: rgba(255,255,255,0.6);
  line-height: 1.5;
`;

// ========== 모바일 접이식 프로필 ==========
export const MobileProfileBanner = styled.div<{ $platform?: string }>`
  display: none;
  background: ${(props) => (['facebook', 'instagram', 'x'].includes(props.$platform || '') ? '#1e1e1e' : 'var(--bg-card)')};
  border-radius: 12px;
  margin-bottom: 12px;
  overflow: hidden;
  border: ${(props) => (['facebook', 'instagram', 'x'].includes(props.$platform || '') ? '1px solid rgba(255,255,255,0.08)' : '1px solid var(--border-color)')};
`;

export const MobileProfileHeader = styled.button<{ $platform?: string }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
`;

export const MobileProfileAvatar = styled.div<{ $image?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${(props) => (props.$image ? `url(${props.$image})` : '#666')};
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
`;

export const MobileProfileMeta = styled.div`
  flex: 1;
  min-width: 0;
`;

export const MobileProfileNameText = styled.div<{ $platform?: string }>`
  font-size: 15px;
  font-weight: 600;
  color: ${(props) => (['facebook', 'instagram', 'x'].includes(props.$platform || '') ? '#fff' : 'var(--text-primary)')};
`;

export const MobileProfileSub = styled.div<{ $platform?: string }>`
  font-size: 12px;
  color: ${(props) => (['facebook', 'instagram', 'x'].includes(props.$platform || '') ? 'rgba(255,255,255,0.5)' : 'var(--text-tertiary)')};
  margin-top: 2px;
`;

export const MobileProfileChevron = styled.div<{ $expanded: boolean; $platform?: string }>`
  color: ${(props) => (['facebook', 'instagram', 'x'].includes(props.$platform || '') ? 'rgba(255,255,255,0.4)' : 'var(--text-tertiary)')};
  transition: transform 0.25s ease;
  transform: rotate(${(props) => (props.$expanded ? '180deg' : '0deg')});
  flex-shrink: 0;
`;

export const MobileProfileBody = styled.div<{ $expanded: boolean; $platform?: string }>`
  max-height: ${(props) => (props.$expanded ? '300px' : '0')};
  opacity: ${(props) => (props.$expanded ? 1 : 0)};
  overflow: hidden;
  transition: max-height 0.3s ease, opacity 0.25s ease;
  padding: ${(props) => (props.$expanded ? '0 16px 16px' : '0 16px')};
  border-top: ${(props) =>
    props.$expanded
      ? (
          ['facebook', 'instagram', 'x'].includes(props.$platform || '')
            ? '1px solid rgba(255,255,255,0.08)'
            : '1px solid var(--border-color)'
        )
      : 'none'};
`;

export const MobileProfileRow = styled.div<{ $platform?: string }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  font-size: 14px;
  color: ${(props) => (['facebook', 'instagram', 'x'].includes(props.$platform || '') ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)')};
`;

// ========== 중앙 피드 영역 (Facebook 스타일) ==========
export const FeedArea = styled.div<{ $platform?: string }>`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: ${(props) => {
    if (['facebook', 'instagram', 'x'].includes(props.$platform || '')) return '#121212';
    return 'var(--bg-secondary)';
  }};

  // 메신저/데이팅 앱은 피드 숨김
  ${(props) =>
    ['kakaotalk', 'telegram', 'line', 'tinder', 'linkedin'].includes(props.$platform || '') &&
    `
    display: none;
  `}

  @media (max-width: 600px) {
    padding: 8px;
  }
`;

export const PostCard = styled.div<{ $platform?: string }>`
  background: ${(props) => (['facebook', 'instagram', 'x'].includes(props.$platform || '') ? '#1e1e1e' : 'var(--bg-card)')};
  border-radius: 12px;
  margin-bottom: 16px;
  animation: ${fadeIn} 0.4s ease;
  max-width: 550px;
  margin-left: auto;
  margin-right: auto;
  border: ${(props) => (['facebook', 'instagram', 'x'].includes(props.$platform || '') ? '1px solid rgba(255,255,255,0.08)' : 'none')};
  overflow: hidden;
  box-shadow: ${(props) => (['facebook', 'instagram', 'x'].includes(props.$platform || '') ? '0 2px 8px rgba(0,0,0,0.3)' : 'none')};
`;

export const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
`;

export const PostAvatar = styled.div<{ $image?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${(props) => (props.$image ? `url(${props.$image})` : 'var(--accent-gradient)')};
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

export const PostAuthor = styled.div`
  flex: 1;
`;

export const PostAuthorName = styled.div<{ $platform?: string }>`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => (['facebook', 'instagram', 'x'].includes(props.$platform || '') ? '#fff' : 'var(--text-primary)')};
`;

export const PostTime = styled.div<{ $platform?: string }>`
  font-size: 12px;
  color: ${(props) => (['facebook', 'instagram', 'x'].includes(props.$platform || '') ? 'rgba(255,255,255,0.5)' : 'var(--text-secondary)')};
`;

export const PostContent = styled.div<{ $platform?: string }>`
  padding: 0 16px 12px;
  font-size: 15px;
  color: ${(props) => (['facebook', 'instagram', 'x'].includes(props.$platform || '') ? '#fff' : 'var(--text-primary)')};
  line-height: 1.5;
`;

export const PostImage = styled.div<{ $src: string }>`
  width: 100%;
  height: 400px;
  background: url(${(props) => props.$src}) center/cover;
  background-color: #000;
`;

export const PostActions = styled.div<{ $platform?: string }>`
  display: flex;
  padding: 8px 16px;
  border-top: 1px solid ${(props) => (['facebook', 'instagram', 'x'].includes(props.$platform || '') ? 'rgba(255,255,255,0.1)' : 'var(--border-color)')};
  gap: 4px;
`;

export const PostAction = styled.button<{ $platform?: string }>`
  flex: 1;
  padding: 8px;
  background: none;
  border: none;
  border-radius: 8px;
  color: ${(props) => (['facebook', 'instagram', 'x'].includes(props.$platform || '') ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)')};
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    background: ${(props) => (['facebook', 'instagram', 'x'].includes(props.$platform || '') ? 'rgba(255,255,255,0.1)' : 'var(--bg-secondary)')};
  }
`;

// ========== 우측 사이드바 (채팅) ==========
export const RightSidebar = styled.div<{ $platform?: string; $showOnMobile?: boolean }>`
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

  ${(props) =>
    ['kakaotalk', 'telegram', 'line', 'tinder', 'linkedin'].includes(props.$platform || '') &&
    `
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
    left: 0;
    right: 0;
    bottom: 0;
    top: auto;
    max-height: 80vh;
    z-index: 100;
    background: #1e1e1e;
    padding: 0;
    border-radius: 16px 16px 0 0;
    overflow: hidden;
    box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.4);
    justify-content: stretch;
    display: ${(props) => (props.$showOnMobile ? 'flex' : 'none')};
  }
`;

export const ChatInnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
  border-radius: 12px;
  overflow: hidden;
  height: 75%;
  min-height: 400px;

  @media (max-width: 600px) {
    height: 100%;
    min-height: unset;
    border-radius: 0;
    flex: 1;
  }
`;

export const FloatingChatButton = styled.button<{ $platform?: string }>`
  position: fixed;
  bottom: calc(24px + env(safe-area-inset-bottom, 0px));
  right: 24px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${(props) => {
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

export const SponsoredSection = styled.div`
  background: #252525;
  border-radius: 12px;
  padding: 12px;
`;

export const SponsoredTitle = styled.div`
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  margin-bottom: 12px;
`;

export const SponsoredItem = styled.div`
  display: flex;
  gap: 10px;
  padding: 8px 0;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
`;

export const SponsoredImage = styled.div<{ $src?: string }>`
  width: 80px;
  height: 60px;
  border-radius: 8px;
  background: ${(props) => (props.$src ? `url(${props.$src})` : '#333')};
  background-size: cover;
  flex-shrink: 0;
`;

export const SponsoredText = styled.div`
  flex: 1;
`;

export const SponsoredHeadline = styled.div`
  font-size: 13px;
  color: #fff;
  font-weight: 500;
  line-height: 1.3;
  margin-bottom: 4px;
`;

export const SponsoredDesc = styled.div`
  font-size: 11px;
  color: rgba(255,255,255,0.5);
`;

export const StorySection = styled.div`
  background: #252525;
  border-radius: 12px;
  padding: 12px;
`;

export const StoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const StoryDot = styled.div<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => props.$color};
`;

export const StoryText = styled.div`
  font-size: 13px;
  color: #fff;
`;

export const StorySubtext = styled.div`
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  margin-left: 16px;
`;

// ========== 채팅 팝업 (Facebook 스타일) ==========
export const ChatPopup = styled.div<{ $minimized?: boolean }>`
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
  height: ${(props) => (props.$minimized ? '40px' : '450px')};

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

export const ChatPopupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: #1a1a1a;
  cursor: pointer;
  flex-shrink: 0;
`;

export const ChatPopupAvatar = styled.div<{ $image?: string }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${(props) => (props.$image ? `url(${props.$image})` : '#666')};
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

export const ChatPopupInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ChatPopupName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ChatPopupStatus = styled.div`
  font-size: 11px;
  color: #31a24c;
`;

export const ChatPopupActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const ChatPopupAction = styled.button`
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

export const ChatPopupMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #1a1a1a;
`;

export const ChatPopupInputArea = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
  background: #1a1a1a;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

export const ChatPopupInput = styled.input`
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

export const ChatPopupSendButton = styled.button`
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

export const ChatPopupMessageBubble = styled.div<{ $mine: boolean; $removing?: boolean }>`
  max-width: 80%;
  padding: 10px 14px;
  border-radius: ${(props) => (props.$mine ? '18px 4px 18px 18px' : '4px 18px 18px 18px')};
  background: ${(props) => (props.$mine ? '#3b82f6' : '#2a2a2a')};
  color: #fff;
  font-size: 14px;
  line-height: 1.5;
  align-self: ${(props) => (props.$mine ? 'flex-end' : 'flex-start')};
  transition: all 0.4s ease;
  ${(props) =>
    props.$removing &&
    `
    animation: ${slideOut} 0.4s ease forwards;
    background: #ef4444;
  `}
`;

export const ProfanityWarningText = styled.div`
  text-align: center;
  color: #ef4444;
  font-size: 13px;
  padding: 8px 12px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  margin: 8px 0;
`;

export const ChatPopupImageBubble = styled.div<{ $mine: boolean }>`
  max-width: 80%;
  display: flex;
  flex-direction: column;
  align-self: ${(props) => (props.$mine ? 'flex-end' : 'flex-start')};
`;

export const ChatPopupMessageImage = styled.img`
  max-width: 180px;
  border-radius: 12px;
  margin-bottom: 4px;
`;

// ========== 우측 메신저 영역 ==========
export const MessengerArea = styled.div`
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

export const MessengerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
`;

export const MessengerAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--accent-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`;

export const MessengerInfo = styled.div`
  flex: 1;
`;

export const MessengerName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
`;

export const MessengerStatus = styled.div`
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

export const MessengerMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const MessageRow = styled.div<{ $mine: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.$mine ? 'flex-end' : 'flex-start')};
  animation: ${slideIn} 0.3s ease;
`;

export const MessageBubble = styled.div<{ $mine: boolean }>`
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 18px;
  background: ${(props) => (props.$mine ? 'var(--accent-primary)' : 'var(--bg-secondary)')};
  color: ${(props) => (props.$mine ? '#fff' : 'var(--text-primary)')};
  font-size: 14px;
  line-height: 1.4;
`;

export const MessageImage = styled.img`
  max-width: 200px;
  border-radius: 12px;
  margin-bottom: 8px;
  display: block;
`;

export const ImageBubble = styled.div<{ $mine: boolean }>`
  max-width: 80%;
  display: flex;
  flex-direction: column;
`;

export const TypingIndicator = styled.div<{ $dark?: boolean }>`
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

export const HintBox = styled.div<{ $dark?: boolean }>`
  margin: 8px 0;
  padding: 10px 12px;
  background: #2a2a2a;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const HintText = styled.div<{ $dark?: boolean }>`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
`;

export const MessengerInput = styled.form`
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid var(--border-color);
`;

export const Input = styled.input`
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

export const SendButton = styled.button<{ $platform?: string }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${(props) => {
    const config = platformConfig[props.$platform || ''];
    return config ? config.gradient : 'var(--accent-gradient)';
  }};
  border: none;
  color: ${(props) => (props.$platform === 'kakaotalk' ? '#3c1e1e' : '#fff')};
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
export const ModalOverlay = styled.div`
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

export const ModalBox = styled.div`
  background: var(--bg-card);
  border-radius: 20px;
  padding: 28px 24px;
  max-width: 320px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

export const ModalTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
`;

export const ModalMessage = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 24px;
`;

export const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
`;

export const ModalButton = styled.button<{ $primary?: boolean; $platform?: string }>`
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  ${(props) =>
    props.$primary
      ? `
    background: ${platformConfig[props.$platform || '']?.gradient || 'var(--accent-gradient)'};
    color: ${props.$platform === 'kakaotalk' ? '#3c1e1e' : '#fff'};
    border: none;
  `
      : `
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
  `}

  &:active {
    transform: scale(0.98);
  }
`;

// ========== 성공 축하 모달 ==========
export const SuccessModalOverlay = styled.div`
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

export const SuccessModalBox = styled.div`
  background: var(--bg-card);
  border-radius: 24px;
  padding: 32px 28px;
  max-width: 380px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  animation: ${celebrate} 0.5s ease;
`;

export const SuccessIcon = styled.div`
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

export const SuccessTitle = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: #20c997;
  margin-bottom: 8px;
`;

export const SuccessSubtitle = styled.div`
  font-size: 16px;
  color: var(--text-primary);
  margin-bottom: 24px;
`;

export const SuccessScoreBox = styled.div`
  background: linear-gradient(135deg, rgba(32, 201, 151, 0.15) 0%, rgba(18, 184, 134, 0.1) 100%);
  border: 2px solid rgba(32, 201, 151, 0.3);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
`;

export const SuccessScoreValue = styled.div`
  font-size: 48px;
  font-weight: 800;
  color: #20c997;
  line-height: 1;
`;

export const SuccessScoreLabel = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 4px;
`;

export const SuccessFeedbackSection = styled.div`
  text-align: left;
  margin-bottom: 24px;
`;

export const SuccessFeedbackTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 12px;
`;

export const SuccessFeedbackList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const SuccessFeedbackItem = styled.li`
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

export const SuccessButton = styled.button`
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

export const ConfettiPiece = styled.div<{ $delay: number; $left: number; $color: string }>`
  position: fixed;
  width: 10px;
  height: 10px;
  background: ${(props) => props.$color};
  top: -10px;
  left: ${(props) => props.$left}%;
  animation: ${confetti} 3s linear forwards;
  animation-delay: ${(props) => props.$delay}s;
  border-radius: 2px;
  z-index: 10001;
`;

// ========== 비속어 경고 스타일 ==========
export const ProfanityWarningOverlay = styled.div`
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

export const ProfanityWarningBox = styled.div`
  background: var(--bg-card);
  border-radius: 16px;
  padding: 24px;
  max-width: 320px;
  width: 90%;
  text-align: center;
  animation: ${shake} 0.5s ease;
  border: 2px solid #f44336;
`;

export const ProfanityWarningIcon = styled.div`
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

export const ProfanityWarningTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #f44336;
  margin-bottom: 8px;
`;

export const ProfanityWarningMessage = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 20px;
`;

export const ProfanityWarningButton = styled.button`
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

export const ShakingInput = styled.form<{ $shaking?: boolean }>`
  display: flex;
  gap: 8px;
  padding: 12px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
  border-top: 1px solid var(--border-color);
  animation: ${(props) => (props.$shaking ? shake : 'none')} 0.5s ease;
`;

export const DeletedMessageBubble = styled.div<{ $mine: boolean }>`
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 18px;
  background: ${(props) => (props.$mine ? 'rgba(244, 67, 54, 0.2)' : 'var(--bg-secondary)')};
  color: #f44336;
  font-size: 14px;
  line-height: 1.4;
  animation: ${slideOut} 0.5s ease forwards;
  font-style: italic;
`;

// ========== 플랫폼별 메신저 스타일 ==========
export const PlatformMessengerArea = styled.div<{ $platform?: string }>`
  // 메신저/데이팅 앱은 전체 너비, SNS는 고정 너비
  width: ${(props) => (['kakaotalk', 'telegram', 'line', 'tinder', 'linkedin'].includes(props.$platform || '') ? '100%' : '360px')};
  max-width: ${(props) => (['kakaotalk', 'telegram', 'line', 'tinder', 'linkedin'].includes(props.$platform || '') ? '500px' : 'none')};
  margin: ${(props) => (['kakaotalk', 'telegram', 'line', 'tinder', 'linkedin'].includes(props.$platform || '') ? '0 auto' : '0')};
  background: ${(props) => {
    switch (props.$platform) {
      case 'kakaotalk':
        return '#b2c7d9';
      case 'instagram':
        return '#fff';
      case 'telegram':
        return '#e6ebee';
      case 'line':
        return '#7b9e89';
      case 'tinder':
        return '#fff';
      case 'linkedin':
        return '#f3f2ef';
      default:
        return 'var(--bg-card)';
    }
  }};
  border-left: ${(props) => (['kakaotalk', 'telegram', 'line', 'tinder', 'linkedin'].includes(props.$platform || '') ? 'none' : '1px solid var(--border-color)')};
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

export const PlatformMessengerHeader = styled.div<{ $platform?: string }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: ${(props) => {
    if (props.$platform === 'kakaotalk') return '#fff';
    const config = platformConfig[props.$platform || ''];
    return config ? config.gradient : 'var(--bg-card)';
  }};
  color: ${(props) => (props.$platform === 'kakaotalk' ? '#191f28' : '#fff')};
  ${(props) =>
    props.$platform === 'kakaotalk' &&
    `
    justify-content: center;
    position: relative;
    border-bottom: 1px solid #e5e5e5;
  `}
`;

export const PlatformMessengerAvatar = styled.div<{ $image?: string; $platform?: string }>`
  width: 36px;
  height: 36px;
  border-radius: ${(props) => (props.$platform === 'kakaotalk' ? '12px' : '50%')};
  background: ${(props) => (props.$image ? `url(${props.$image})` : 'rgba(255,255,255,0.2)')};
  background-size: cover;
  background-position: center;
`;

export const PlatformMessengerName = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

export const PlatformMessengerStatus = styled.div<{ $platform?: string }>`
  font-size: 12px;
  opacity: 0.8;
`;

export const PlatformMessageBubble = styled.div<{ $mine: boolean; $platform?: string }>`
  max-width: 80%;
  padding: 10px 14px;
  font-size: 14px;
  line-height: 1.4;

  ${(props) => {
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
    }
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
  }}
`;

export const PlatformInput = styled.input<{ $platform?: string }>`
  flex: 1;
  padding: 10px 14px;
  background: ${(props) => (props.$platform === 'kakaotalk' ? '#fff' : 'var(--bg-secondary)')};
  border: ${(props) => (props.$platform === 'kakaotalk' ? '1px solid #e5e5e5' : `1px solid ${platformConfig[props.$platform || '']?.color || 'var(--border-color)'}40`)};
  border-radius: 20px;
  color: ${(props) => (props.$platform === 'kakaotalk' ? '#191f28' : 'var(--text-primary)')};
  font-size: 16px;
  outline: none;

  &::placeholder {
    color: ${(props) => (props.$platform === 'kakaotalk' ? '#999' : 'var(--text-tertiary)')};
  }

  &:focus {
    border-color: ${(props) => {
      if (props.$platform === 'kakaotalk') return '#fee500';
      const config = platformConfig[props.$platform || ''];
      return config ? config.color : 'var(--accent-primary)';
    }};
  }
`;

// 카카오톡 전용 입력 영역
export const KakaoInputArea = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
  background: #fff;
  border-top: 1px solid #e5e5e5;
`;

// 카카오톡 메시지 행 (프로필 사진 포함)
export const KakaoMessageRow = styled.div<{ $mine: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  justify-content: ${(props) => (props.$mine ? 'flex-end' : 'flex-start')};
  margin-bottom: 8px;
  padding: 0 16px;
`;

export const KakaoProfilePhoto = styled.div<{ $image?: string }>`
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: ${(props) => (props.$image ? `url(${props.$image})` : '#ccc')};
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
`;

export const KakaoMessageContent = styled.div<{ $mine: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.$mine ? 'flex-end' : 'flex-start')};
  max-width: 70%;
`;

export const KakaoSenderName = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
`;

export const KakaoBubbleRow = styled.div<{ $mine: boolean }>`
  display: flex;
  align-items: flex-end;
  gap: 6px;
  flex-direction: ${(props) => (props.$mine ? 'row-reverse' : 'row')};
`;

export const KakaoBubble = styled.div<{ $mine: boolean }>`
  padding: 10px 14px;
  font-size: 14px;
  line-height: 1.4;
  background: ${(props) => (props.$mine ? '#fee500' : '#fff')};
  color: #191f28;
  border-radius: ${(props) => (props.$mine ? '16px 4px 16px 16px' : '4px 16px 16px 16px')};
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
`;

export const KakaoTime = styled.div`
  font-size: 10px;
  color: #666;
  white-space: nowrap;
`;

// ========== 텔레그램 전용 스타일 ==========
export const TelegramHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #5b9c5b;
  gap: 12px;
`;

export const TelegramProfilePhoto = styled.div<{ $image?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${(props) => (props.$image ? `url(${props.$image})` : '#6a9bc9')};
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
`;

export const TelegramHeaderInfo = styled.div`
  flex: 1;
`;

export const TelegramHeaderName = styled.div`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`;

export const TelegramHeaderStatus = styled.div`
  color: rgba(255,255,255,0.7);
  font-size: 13px;
`;

export const TelegramChatArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  background: linear-gradient(135deg, #6b9b7a 0%, #a8c686 25%, #d4e09b 50%, #a8c686 75%, #6b9b7a 100%);
`;

export const TelegramMessageRow = styled.div<{ $mine: boolean }>`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-bottom: 8px;
  justify-content: ${(props) => (props.$mine ? 'flex-end' : 'flex-start')};
  padding: 0 8px;
`;

export const TelegramBubble = styled.div<{ $mine: boolean }>`
  max-width: 75%;
  padding: 8px 12px;
  font-size: 14px;
  line-height: 1.4;
  background: ${(props) => (props.$mine ? '#3d8ed9' : '#fff')};
  color: ${(props) => (props.$mine ? '#fff' : '#000')};
  border-radius: ${(props) => (props.$mine ? '12px 4px 12px 12px' : '4px 12px 12px 12px')};
  position: relative;
`;

export const TelegramSenderName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #3a8ed9;
  margin-bottom: 2px;
`;

export const TelegramTime = styled.span<{ $mine?: boolean }>`
  font-size: 11px;
  color: ${(props) => (props.$mine ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)')};
  margin-left: 8px;
  float: right;
  margin-top: 4px;
`;

export const TelegramInputArea = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
  background: #fff;
  border-top: 1px solid #e5e5e5;
`;

export const TelegramInput = styled.input`
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

// ========== 로그인 화면 ==========
export const LoginScreen = styled.div<{ $platform?: string }>`
  flex: 1;
  background: ${(props) => platformConfig[props.$platform || '']?.gradient || 'var(--accent-gradient)'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

export const LoginLogo = styled.div<{ $platform?: string }>`
  font-size: 48px;
  font-weight: 700;
  color: ${(props) => (props.$platform === 'kakaotalk' ? '#3c1e1e' : '#fff')};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const LoginLogoIcon = styled.div<{ $platform?: string }>`
  width: 56px;
  height: 56px;
  border-radius: ${(props) => (props.$platform === 'facebook' ? '12px' : '50%')};
  background: ${(props) => (props.$platform === 'kakaotalk' ? '#3c1e1e' : 'rgba(255,255,255,0.2)')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: ${(props) => (props.$platform === 'kakaotalk' ? '#fee500' : '#fff')};
`;

export const LoginTagline = styled.div<{ $platform?: string }>`
  font-size: 14px;
  color: ${(props) => (props.$platform === 'kakaotalk' ? 'rgba(60,30,30,0.7)' : 'rgba(255, 255, 255, 0.8)')};
  margin-bottom: 32px;
`;

export const LoginBox = styled.div`
  width: 100%;
  max-width: 320px;
  background: var(--bg-card);
  border-radius: 16px;
  padding: 24px;
  box-shadow: var(--shadow-lg);
`;

export const LoginInputWrapper = styled.div`
  margin-bottom: 12px;
`;

export const LoginLabel = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 6px;
`;

export const LoginInput = styled.div<{ $focused?: boolean }>`
  padding: 12px 14px;
  background: var(--bg-secondary);
  border: 2px solid ${(props) => (props.$focused ? 'var(--accent-primary)' : 'var(--border-color)')};
  border-radius: 8px;
  font-size: 15px;
  color: var(--text-primary);
  min-height: 44px;
  display: flex;
  align-items: center;
`;

export const Cursor = styled.span`
  width: 2px;
  height: 18px;
  background: var(--accent-primary);
  margin-left: 2px;
  animation: ${blink} 1s infinite;
`;

export const LoginButton = styled.button<{ $loading?: boolean; $platform?: string }>`
  width: 100%;
  padding: 14px;
  background: ${(props) => (props.$loading ? 'var(--text-tertiary)' : platformConfig[props.$platform || '']?.buttonColor || 'var(--accent-primary)')};
  border: none;
  border-radius: 8px;
  color: ${(props) => (props.$platform === 'kakaotalk' ? '#3c1e1e' : '#fff')};
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const Spinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

// ========== 결과 화면 ==========
export const ResultScreen = styled.div`
  flex: 1;
  background: var(--bg-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  overflow-y: auto;
`;

export const ResultCard = styled.div`
  width: 100%;
  max-width: 400px;
  background: var(--bg-card);
  border-radius: 20px;
  padding: 32px 24px;
  text-align: center;
  animation: ${fadeIn} 0.5s ease;
  border: 1px solid var(--border-color);
`;

export const ResultTitle = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

export const ScoreCircle = styled.div<{ $score: number }>`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: conic-gradient(
    ${(props) => (props.$score >= 80 ? '#20c997' : props.$score >= 50 ? '#ffc107' : '#f44336')}
    ${(props) => props.$score * 3.6}deg,
    var(--border-color) ${(props) => props.$score * 3.6}deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px auto;
`;

export const ScoreInner = styled.div`
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: var(--bg-card);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ScoreValue = styled.div<{ $score: number }>`
  font-size: 48px;
  font-weight: 800;
  color: ${(props) => (props.$score >= 80 ? '#20c997' : props.$score >= 50 ? '#ffc107' : '#f44336')};
`;

export const ScoreLabel = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
`;

export const ResultGrade = styled.div<{ $score: number }>`
  font-size: 24px;
  font-weight: 700;
  color: ${(props) => (props.$score >= 80 ? '#20c997' : props.$score >= 50 ? '#ffc107' : '#f44336')};
  margin-bottom: 16px;
`;

export const ResultMessage = styled.div`
  font-size: 15px;
  color: var(--text-primary);
  line-height: 1.6;
  margin-bottom: 24px;
`;

export const ResultStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
`;

export const ResultStatBox = styled.div`
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 12px;
`;

export const ResultStatValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: var(--accent-primary);
`;

export const ResultStatLabel = styled.div`
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 4px;
`;

export const TacticsSection = styled.div`
  text-align: left;
  margin-bottom: 24px;
`;

export const TacticsTitle = styled.div`
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
`;

export const TacticsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const TacticTag = styled.span`
  padding: 4px 10px;
  background: rgba(99, 91, 255, 0.1);
  border-radius: 12px;
  font-size: 12px;
  color: var(--accent-primary);
`;

export const RetryButton = styled.button`
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

export const ScammerGaveUpBadge = styled.div`
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
export const PersonaSelectScreen = styled.div`
  flex: 1;
  background: var(--bg-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  overflow-y: auto;
`;

export const PersonaTitle = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 8px;
`;

export const PersonaSubtitle = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 32px;
`;

export const PersonaGrid = styled.div`
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

export const PersonaCard = styled.button<{ $platform?: string }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: var(--bg-card);
  border: 1px solid ${(props) => {
    const config = platformConfig[props.$platform || ''];
    return config ? `${config.color}30` : 'var(--border-color)';
  }};
  border-radius: 16px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;

  &:hover {
    border-color: ${(props) => {
      const config = platformConfig[props.$platform || ''];
      return config ? `${config.color}50` : 'var(--border-color)';
    }};
    box-shadow: ${(props) => {
      const config = platformConfig[props.$platform || ''];
      return config ? `0 4px 12px ${config.color}15` : 'var(--shadow-md)';
    }};
    transform: translateY(-2px);
  }
`;

export const PersonaAvatar = styled.div<{ $color: string; $image?: string; $platform?: string }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${(props) => (props.$image ? `url(${props.$image})` : props.$color)};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
  border: 2px solid ${(props) => {
    const config = platformConfig[props.$platform || ''];
    return config ? `${config.color}35` : 'var(--border-color)';
  }};
`;

export const PersonaInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const PersonaName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
`;

export const PersonaOccupation = styled.div`
  font-size: 13px;
  color: var(--text-secondary);
`;

export const DifficultyBadge = styled.span<{ $level: number }>`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  background: ${(props) =>
    props.$level <= 2
      ? 'rgba(32, 201, 151, 0.2)'
      : props.$level === 3
        ? 'rgba(255, 193, 7, 0.2)'
        : 'rgba(244, 67, 54, 0.2)'};
  color: ${(props) => (props.$level <= 2 ? '#20c997' : props.$level === 3 ? '#ffc107' : '#f44336')};
`;

export const PlatformBadge = styled.span<{ $platform?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 8px;
  margin-left: 6px;

  ${(props) => {
    switch (props.$platform) {
      case 'facebook':
        return 'background: rgba(24, 119, 242, 0.15); color: #1877f2;';
      case 'kakaotalk':
        return 'background: rgba(254, 229, 0, 0.3); color: #3c1e1e;';
      case 'instagram':
        return 'background: linear-gradient(135deg, rgba(240, 148, 51, 0.15), rgba(220, 39, 67, 0.15)); color: #e1306c;';
      case 'x':
        return 'background: rgba(0, 0, 0, 0.1); color: var(--text-primary);';
      case 'telegram':
        return 'background: rgba(0, 136, 204, 0.15); color: #0088cc;';
      case 'line':
        return 'background: rgba(0, 195, 0, 0.15); color: #00c300;';
      case 'linkedin':
        return 'background: rgba(10, 102, 194, 0.15); color: #0a66c2;';
      case 'tinder':
        return 'background: rgba(254, 60, 114, 0.15); color: #fe3c72;';
      default:
        return 'background: rgba(16, 185, 129, 0.1); color: var(--accent-primary);';
    }
  }}
`;

export const PlatformIcon = styled.span`
  font-size: 12px;
`;

export const LoadingScreen = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 16px;
`;
