import { useState } from 'react';
import styled from '@emotion/styled';
import { Link, useNavigate } from '@tanstack/react-router';
import { v4 as uuidv4 } from 'uuid';
import { useContactsStore } from '@/features/manage-contacts';
import { useThemeStore } from '@/shared/stores/themeStore';
import { usePersonas } from '@/features/immune-training';
import { Modal } from '@/shared/ui';

// Animated Gradient Orbs using CSS
const GradientOrb = styled.div<{ $index: number }>`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: float${props => props.$index} ${props => 15 + props.$index * 5}s ease-in-out infinite;

  ${props => props.$index === 0 && `
    width: 500px;
    height: 500px;
    background: rgba(16, 185, 129, 0.4);
    top: -100px;
    left: -100px;
  `}

  ${props => props.$index === 1 && `
    width: 400px;
    height: 400px;
    background: rgba(5, 150, 105, 0.35);
    top: 50%;
    right: -150px;
  `}

  ${props => props.$index === 2 && `
    width: 350px;
    height: 350px;
    background: rgba(52, 211, 153, 0.3);
    bottom: -100px;
    left: 30%;
  `}

  @keyframes float0 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(80px, 50px) scale(1.1); }
    66% { transform: translate(-40px, 80px) scale(0.95); }
  }

  @keyframes float1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(-60px, -40px) scale(1.05); }
    66% { transform: translate(40px, -60px) scale(0.9); }
  }

  @keyframes float2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(50px, -30px) scale(0.95); }
    66% { transform: translate(-70px, 40px) scale(1.1); }
  }
`;

function GradientBackground() {
  return (
    <>
      <GradientOrb $index={0} />
      <GradientOrb $index={1} />
      <GradientOrb $index={2} />
    </>
  );
}

const Container = styled.div`
  min-height: 100vh;
  background: var(--bg-primary);
  transition: background-color 0.3s ease;
`;

// Navigation
const Nav = styled.nav`
  position: sticky;
  top: 0;
  background: var(--bg-nav);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  z-index: 100;
  transition: background-color 0.3s ease, border-color 0.3s ease;
`;

const NavInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 480px) {
    padding: 12px 16px;
  }
`;

const Logo = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 24px;
  font-weight: 700;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.5px;
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const ThemeToggle = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--border-color-hover);
    transform: scale(1.05);
  }

  svg {
    width: 20px;
    height: 20px;
    color: var(--text-secondary);
    transition: color 0.3s ease;
  }
`;

const NavButton = styled.button`
  padding: 10px 20px;
  background: var(--accent-gradient);
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }

  @media (max-width: 480px) {
    padding: 8px 14px;
    font-size: 13px;
  }
`;

const NavButtonSecondary = styled.button`
  padding: 10px 20px;
  background: linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%);
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
  }

  @media (max-width: 480px) {
    padding: 8px 14px;
    font-size: 13px;
  }
`;

// Hero Section with animated gradient background
const HeroWrapper = styled.div`
  position: relative;
  overflow: hidden;
`;

const HeroSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px 24px 80px;
  text-align: left;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 60px 20px 40px;
  }

  @media (max-width: 480px) {
    padding: 40px 16px 32px;
  }
`;

const HeroTitle = styled.h2`
  font-size: 52px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 24px;
  line-height: 1.2;
  letter-spacing: -1.5px;
  transition: color 0.3s ease;

  span {
    background: var(--accent-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 768px) {
    font-size: 32px;
    letter-spacing: -0.5px;
  }
`;

const HeroDesc = styled.p`
  font-size: 18px;
  color: var(--text-secondary);
  margin: 0 0 40px;
  line-height: 1.7;
  max-width: 520px;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;


// Service Cards Grid - 2x2 Layout
const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px 100px;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 0 16px 60px;
  }
`;

const ServiceCard = styled(Link)`
  background: var(--bg-card);
  border-radius: 24px;
  padding: 40px 32px 32px;
  border: 1px solid var(--border-color);
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 200px;

  &:hover {
    transform: translateY(-12px);
    box-shadow: var(--shadow-card-hover);
    border-color: transparent;
  }

  @media (max-width: 768px) {
    padding: 24px 20px 20px;
    min-height: auto;
    flex-direction: row;
    gap: 16px;
    border-radius: 16px;
  }
`;

// 3D Icon Image - using local 3D icons with transparent background
const IconImage = styled.img`
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
  object-fit: contain;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15));

  ${ServiceCard}:hover & {
    transform: scale(1.15) translateY(-8px);
    filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.2));
  }

  @media (max-width: 768px) {
    width: 56px;
    height: 56px;
    margin-bottom: 0;
    flex-shrink: 0;
  }
`;

const ServiceTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  transition: color 0.3s ease;
`;

// Contacts Section
const ContactsSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 100px;

  @media (max-width: 768px) {
    padding: 0 16px 60px;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 600px;
  margin: 0 auto 40px;
`;

const SectionLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: var(--accent-primary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
`;

const SectionTitle = styled.h3`
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const ContactsList = styled.div`
  display: grid;
  gap: 12px;
`;

const ContactCard = styled(Link)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: var(--bg-card);
  border-radius: 16px;
  text-decoration: none;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--accent-primary);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
    transform: translateX(4px);
  }
`;

const ContactAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;

  svg {
    width: 48px;
    height: 48px;
  }
`;

const ContactInfo = styled.div`
  flex: 1;
`;

const ContactName = styled.span`
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  transition: color 0.3s ease;
`;

const ContactMeta = styled.span`
  font-size: 14px;
  color: var(--text-secondary);
  transition: color 0.3s ease;
`;

const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2">
    <path d="M9 18l6-6-6-6"/>
  </svg>
);

// Modal Styles
const InputLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  transition: color 0.3s ease;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-card);
  font-size: 16px;
  color: var(--text-primary);
  margin-bottom: 20px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  &::placeholder {
    color: var(--text-tertiary);
  }
`;

const MessengerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 24px;

  @media (max-width: 360px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
`;

const MessengerBtn = styled.button<{ $active: boolean }>`
  padding: 14px;
  background: ${props => props.$active ? 'var(--bg-secondary)' : 'var(--bg-card)'};
  border: 2px solid ${props => props.$active ? 'var(--accent-primary)' : 'var(--border-color)'};
  border-radius: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  svg {
    width: 36px;
    height: 36px;
  }

  &:hover {
    border-color: ${props => props.$active ? 'var(--accent-primary)' : 'var(--border-color-hover)'};
  }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 16px;
  background: var(--accent-gradient);
  color: #fff;
  border: none;
  border-radius: 28px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);

  &:disabled {
    background: var(--border-color);
    color: var(--text-tertiary);
    box-shadow: none;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }
`;

// Training Modal Styles
const PersonaGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
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
  gap: 16px;
  padding: 16px;
  background: var(--bg-secondary);
  border: 2px solid ${props => {
    const config = platformConfig[props.$platform || ''];
    return config ? config.color : 'var(--border-color)';
  }};
  border-radius: 16px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;

  &:hover {
    background: var(--bg-card);
    box-shadow: ${props => {
      const config = platformConfig[props.$platform || ''];
      return config ? `0 4px 16px ${config.color}40` : 'var(--shadow-md)';
    }};
  }
`;

const PersonaAvatar = styled.div<{ $color: string; $image?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.$image ? `url(${props.$image})` : props.$color};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
`;

const PersonaInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const PersonaName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
`;

const PersonaOccupation = styled.div`
  font-size: 13px;
  color: var(--text-secondary);
`;

const PersonaPlatform = styled.span`
  display: inline-block;
  font-size: 11px;
  color: var(--accent-primary);
  background: rgba(16, 185, 129, 0.1);
  padding: 2px 8px;
  border-radius: 8px;
  margin-left: 6px;
`;

const DifficultyBadge = styled.span<{ $level: number }>`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${props =>
    props.$level <= 2 ? 'rgba(16, 185, 129, 0.15)' :
    props.$level === 3 ? 'rgba(251, 191, 36, 0.15)' :
    'rgba(239, 68, 68, 0.15)'};
  color: ${props =>
    props.$level <= 2 ? '#10b981' :
    props.$level === 3 ? '#f59e0b' :
    '#ef4444'};
`;

const TrainingServiceCard = styled.button`
  background: var(--bg-card);
  border-radius: 24px;
  padding: 40px 32px 32px;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 200px;

  &:hover {
    transform: translateY(-12px);
    box-shadow: var(--shadow-card-hover);
    border-color: transparent;
  }

  @media (max-width: 768px) {
    padding: 24px 20px 20px;
    min-height: auto;
    flex-direction: row;
    gap: 16px;
    border-radius: 16px;
  }
`;

// 플랫폼별 설정
const platformConfig: Record<string, { name: string; color: string; gradient: string; icon: string }> = {
  facebook: { name: 'Facebook', color: '#1877f2', gradient: 'linear-gradient(135deg, #1877f2 0%, #0d5bbd 100%)', icon: 'f' },
  kakaotalk: { name: 'KakaoTalk', color: '#fee500', gradient: 'linear-gradient(135deg, #fee500 0%, #e6c700 100%)', icon: 'K' },
  instagram: { name: 'Instagram', color: '#e1306c', gradient: 'linear-gradient(135deg, #f09433 0%, #dc2743 100%)', icon: 'IG' },
  x: { name: 'X', color: '#000000', gradient: 'linear-gradient(135deg, #000000 0%, #14171a 100%)', icon: 'X' },
  telegram: { name: 'Telegram', color: '#0088cc', gradient: 'linear-gradient(135deg, #0088cc 0%, #005580 100%)', icon: 'T' },
  line: { name: 'LINE', color: '#00c300', gradient: 'linear-gradient(135deg, #00c300 0%, #00a000 100%)', icon: 'L' },
  linkedin: { name: 'LinkedIn', color: '#0a66c2', gradient: 'linear-gradient(135deg, #0a66c2 0%, #004182 100%)', icon: 'in' },
  tinder: { name: 'Tinder', color: '#fe3c72', gradient: 'linear-gradient(135deg, #fe3c72 0%, #ff6b6b 100%)', icon: 'T' },
};

// Icons
const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5"/>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const KakaoIcon = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#FEE500"/>
    <path d="M24 12C16.268 12 10 17.037 10 23.304c0 4.022 2.671 7.548 6.69 9.537-.294 1.095-.95 3.529-1.088 4.077-.173.683.25.675.527.49.218-.145 3.472-2.355 4.879-3.314.988.145 2.007.222 3.046.222 7.732 0 14-5.037 14-11.258C38 17.037 31.732 12 24 12z" fill="#3C1E1E"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="instaGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFDC80"/>
        <stop offset="25%" stopColor="#FCAF45"/>
        <stop offset="50%" stopColor="#F77737"/>
        <stop offset="75%" stopColor="#F56040"/>
        <stop offset="90%" stopColor="#C13584"/>
        <stop offset="100%" stopColor="#833AB4"/>
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="12" fill="url(#instaGrad)"/>
    <rect x="12" y="12" width="24" height="24" rx="6" stroke="#fff" strokeWidth="2.5" fill="none"/>
    <circle cx="24" cy="24" r="5.5" stroke="#fff" strokeWidth="2.5" fill="none"/>
    <circle cx="31" cy="17" r="2" fill="#fff"/>
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#26A5E4"/>
    <path d="M12.5 23.5l21-9c1-.4 2 .2 1.8 1.3l-3.5 18c-.2 1-1 1.3-1.7.8l-5-3.7-2.4 2.3c-.3.3-.8.2-.9-.2l-1-5.2-5.4-1.8c-1-.3-1-1.5.1-1.9v.4z" fill="#fff"/>
    <path d="M19.5 31l.5-5 10-9" stroke="#26A5E4" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#1877F2"/>
    <path d="M26 38V26h4l.5-4.5H26v-3c0-1.3.4-2.2 2.2-2.2H31v-4c-.5-.1-2-.2-3.8-.2-3.8 0-6.4 2.3-6.4 6.6v3.3h-4V26h4v12h5z" fill="#fff"/>
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#000"/>
    <path d="M27.5 22.1L35.4 13h-1.9l-6.9 7.9L20.8 13H14l8.3 12-8.3 9.5h1.9l7.2-8.3 5.8 8.3H35l-7.5-10.4zm-2.5 2.9l-.8-1.2-6.6-9.4h2.8l5.4 7.7.8 1.2 7 10h-2.8l-5.8-8.3z" fill="#fff"/>
  </svg>
);

const LineIcon = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#06C755"/>
    <path d="M38 21.5c0-6.4-6.4-11.5-14.5-11.5S9 15.1 9 21.5c0 5.7 5.1 10.5 11.9 11.4.5.1.8.3.9.6.1.3.1.7 0 1l-.4 2.4c-.1.5.2.8.6.6 3.1-1.8 8.2-4.8 11.1-8.2 2-2.3 4.9-5.4 4.9-7.8z" fill="#fff"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#0A66C2"/>
    <path d="M15.5 13c1.4 0 2.5 1.1 2.5 2.5S16.9 18 15.5 18 13 16.9 13 15.5 14.1 13 15.5 13zM13 20h5v15h-5V20zm9 0h4.8v2h.1c.7-1.3 2.3-2.5 4.8-2.5 5.1 0 6.1 3.4 6.1 7.8V35h-5v-6.8c0-1.6 0-3.7-2.3-3.7-2.3 0-2.6 1.8-2.6 3.6V35h-5V20z" fill="#fff"/>
  </svg>
);

const TinderIcon = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="tinderGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FF6B6B"/>
        <stop offset="100%" stopColor="#FE3C72"/>
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="12" fill="url(#tinderGrad)"/>
    <path d="M30.2 18.3c-.2-.3-.6-.2-.8.1-.7.9-1.6 1.5-2.6 1.8-.2.1-.4-.1-.4-.3 0-3.5-2.4-6.4-5.5-7.1-.3-.1-.6.2-.5.5.5 1.8.1 3.7-1.1 5.1-.2.2-.5.1-.6-.1-1-1.3-1.5-2.9-1.5-4.6 0-.3-.4-.5-.6-.2C14.2 16.4 13 20 13 24c0 6.1 4.9 11 11 11s11-4.9 11-11c0-2-.5-3.9-1.5-5.6-.2-.3-.6-.1-.7.2-.4 1.2-1.2 2.2-2.3 2.9-.2.1-.5 0-.6-.2-.4-.8-.6-1.7-.6-2.7-.1-.1-.1-.2-.1-.3z" fill="#fff"/>
  </svg>
);

// Service icons for URL check and Fraud check
const UrlLinkIcon = () => (
  <svg viewBox="0 0 120 120" fill="none" style={{ width: 120, height: 120 }}>
    <defs>
      <linearGradient id="urlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff9500"/>
        <stop offset="100%" stopColor="#ff6b00"/>
      </linearGradient>
    </defs>
    <circle cx="60" cy="60" r="50" fill="url(#urlGrad)" />
    <path d="M52 68c-4.4 0-8-3.6-8-8s3.6-8 8-8h8v-4h-8c-6.6 0-12 5.4-12 12s5.4 12 12 12h8v-4h-8zm4-6h8v-4h-8v4zm12-14h-8v4h8c4.4 0 8 3.6 8 8s-3.6 8-8 8h-8v4h8c6.6 0 12-5.4 12-12s-5.4-12-12-12z" fill="#fff"/>
  </svg>
);

const FraudShieldIcon = () => (
  <svg viewBox="0 0 120 120" fill="none" style={{ width: 120, height: 120 }}>
    <defs>
      <linearGradient id="fraudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f04452"/>
        <stop offset="100%" stopColor="#c91f3a"/>
      </linearGradient>
    </defs>
    <circle cx="60" cy="60" r="50" fill="url(#fraudGrad)" />
    <path d="M60 30L36 42v18c0 14.5 10.2 28 24 32 13.8-4 24-17.5 24-32V42L60 30zm0 8l16 8v14c0 10.4-7 20-16 23-9-3-16-12.6-16-23V46l16-8zm-4 20v8h8v-8h-8zm0 12v8h8v-8h-8z" fill="#fff"/>
  </svg>
);

const messengers = [
  { id: 'kakao', name: '카카오톡', Icon: KakaoIcon },
  { id: 'instagram', name: '인스타그램', Icon: InstagramIcon },
  { id: 'telegram', name: '텔레그램', Icon: TelegramIcon },
  { id: 'facebook', name: '페이스북', Icon: FacebookIcon },
  { id: 'x', name: 'X (트위터)', Icon: XIcon },
  { id: 'line', name: '라인', Icon: LineIcon },
  { id: 'linkedin', name: '링크드인', Icon: LinkedInIcon },
  { id: 'tinder', name: '틴더', Icon: TinderIcon },
] as const;

// Service data - 4 services in 2x2 grid with 3dicons.co Clay 3D icons (CC0 License)
type ServiceItem = {
  to: string;
  title: string;
  iconUrl?: string;
  Icon?: React.FC;
};

const services: ServiceItem[] = [
  {
    to: '/chat',
    title: '대화 분석',
    iconUrl: '/icons/chat-bubble.png',
  },
  {
    to: '/image-search',
    title: '딥페이크 검사',
    iconUrl: '/icons/camera.png',
  },
  {
    to: '/profile-search',
    title: '프로필 검색',
    iconUrl: '/icons/megaphone.png',
  },
  {
    to: '/verify',
    title: '사기 검증',
    iconUrl: '/icons/mobile.png',
  },
];

function ServiceCardComponent({ service }: { service: ServiceItem }) {
  return (
    <ServiceCard to={service.to}>
      {service.iconUrl ? (
        <IconImage src={service.iconUrl} alt={service.title} />
      ) : service.Icon ? (
        <service.Icon />
      ) : null}
      <ServiceTitle>{service.title}</ServiceTitle>
    </ServiceCard>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { contacts, addContact } = useContactsStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [showModal, setShowModal] = useState(false);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [name, setName] = useState('');
  const [messenger, setMessenger] = useState<string>('');

  const { data: personas = [] } = usePersonas();

  const handleSubmit = () => {
    if (!name.trim() || !messenger) return;

    const newContact = {
      id: uuidv4(),
      name: name.trim(),
      messenger: messenger as 'kakao' | 'instagram' | 'telegram' | 'facebook' | 'x' | 'line' | 'linkedin' | 'tinder',
      createdAt: Date.now(),
    };

    addContact(newContact);
    setShowModal(false);
    setName('');
    setMessenger('');
    navigate({ to: '/analyze/$id', params: { id: newContact.id } });
  };

  const handleSelectPersona = (personaId: string) => {
    setShowTrainingModal(false);
    navigate({ to: '/training', search: { personaId } });
  };

  const getMessenger = (id: string) => messengers.find(m => m.id === id);

  return (
    <Container>
      <Nav>
        <NavInner>
          <Logo>Enigma</Logo>
          <NavActions>
            <ThemeToggle onClick={toggleTheme} aria-label="Toggle theme">
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </ThemeToggle>
            <NavButtonSecondary onClick={() => setShowTrainingModal(true)}>
              면역 훈련
            </NavButtonSecondary>
            <NavButton onClick={() => navigate({ to: '/analyze' })}>
              분석 시작
            </NavButton>
          </NavActions>
        </NavInner>
      </Nav>

      <HeroWrapper>
        <GradientBackground />
        <HeroSection>
          <HeroTitle>
            로맨스 스캠으로부터<br />
            <span>당신을 보호</span>합니다
          </HeroTitle>
          <HeroDesc>
            AI 기술로 대화, 프로필, 미디어를 분석하고
            로맨스 스캠의 위험 신호를 사전에 탐지합니다.
          </HeroDesc>
        </HeroSection>
        <ServiceGrid>
          {services.map((service) => (
            <ServiceCardComponent key={service.to} service={service} />
          ))}
        </ServiceGrid>
      </HeroWrapper>

      {contacts.length > 0 && (
        <ContactsSection>
          <SectionHeader>
            <SectionLabel>진행 중</SectionLabel>
            <SectionTitle>분석 중인 대상</SectionTitle>
          </SectionHeader>
          <ContactsList>
            {contacts.map(contact => {
              const m = getMessenger(contact.messenger);
              return (
                <ContactCard key={contact.id} to={`/analyze/${contact.id}`}>
                  <ContactAvatar>
                    {m && <m.Icon />}
                  </ContactAvatar>
                  <ContactInfo>
                    <ContactName>{contact.name}</ContactName>
                    <ContactMeta>{m?.name}</ContactMeta>
                  </ContactInfo>
                  <ArrowIcon />
                </ContactCard>
              );
            })}
          </ContactsList>
        </ContactsSection>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="새 분석 대상 추가"
      >
        <InputLabel>상대방 이름 (닉네임)</InputLabel>
        <Input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="예: John, 제임스"
        />

        <InputLabel>사용 중인 메신저</InputLabel>
        <MessengerGrid>
          {messengers.map(m => (
            <MessengerBtn
              key={m.id}
              $active={messenger === m.id}
              onClick={() => setMessenger(m.id)}
            >
              <m.Icon />
            </MessengerBtn>
          ))}
        </MessengerGrid>

        <SubmitBtn
          onClick={handleSubmit}
          disabled={!name.trim() || !messenger}
        >
          분석 시작하기
        </SubmitBtn>
      </Modal>

      <Modal
        isOpen={showTrainingModal}
        onClose={() => setShowTrainingModal(false)}
        title="사기꾼을 선택하세요"
      >
        <PersonaGrid>
          {personas.map((persona) => {
            const pConfig = platformConfig[persona.platform] || { name: '', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', icon: 'SNS' };
            return (
              <PersonaCard key={persona.id} onClick={() => handleSelectPersona(persona.id)} $platform={persona.platform}>
                <PersonaAvatar $color={pConfig.gradient} $image={persona.profile_photo} />
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
      </Modal>

    </Container>
  );
}
