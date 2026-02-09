import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';

// Platform config - needed by PersonaCard styled component
export const platformConfig: Record<string, { name: string; color: string; gradient: string; icon: string }> = {
  facebook: { name: 'Facebook', color: '#1877f2', gradient: 'linear-gradient(135deg, #1877f2 0%, #0d5bbd 100%)', icon: 'f' },
  kakaotalk: { name: 'KakaoTalk', color: '#fee500', gradient: 'linear-gradient(135deg, #fee500 0%, #e6c700 100%)', icon: 'K' },
  instagram: { name: 'Instagram', color: '#e1306c', gradient: 'linear-gradient(135deg, #f09433 0%, #dc2743 100%)', icon: 'IG' },
  x: { name: 'X', color: '#000000', gradient: 'linear-gradient(135deg, #000000 0%, #14171a 100%)', icon: 'X' },
  telegram: { name: 'Telegram', color: '#0088cc', gradient: 'linear-gradient(135deg, #0088cc 0%, #005580 100%)', icon: 'T' },
  line: { name: 'LINE', color: '#00c300', gradient: 'linear-gradient(135deg, #00c300 0%, #00a000 100%)', icon: 'L' },
  linkedin: { name: 'LinkedIn', color: '#0a66c2', gradient: 'linear-gradient(135deg, #0a66c2 0%, #004182 100%)', icon: 'in' },
  tinder: { name: 'Tinder', color: '#fe3c72', gradient: 'linear-gradient(135deg, #fe3c72 0%, #ff6b6b 100%)', icon: 'T' },
};

// Animated Gradient Orbs using CSS
export const GradientOrb = styled.div<{ $index: number }>`
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

export const Container = styled.div`
  min-height: 100vh;
  background: var(--bg-primary);
  transition: background-color 0.3s ease;
`;

// Navigation
export const Nav = styled.nav`
  position: sticky;
  top: 0;
  background: var(--bg-nav);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  z-index: 100;
  transition: background-color 0.3s ease, border-color 0.3s ease;
`;

export const NavInner = styled.div`
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

export const Logo = styled.h1`
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

export const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

export const ThemeToggle = styled.button`
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

export const NavButton = styled.button`
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

export const NavButtonSecondary = styled.button`
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
export const HeroWrapper = styled.div`
  position: relative;
  overflow: hidden;
`;

export const HeroSection = styled.section`
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

export const HeroTitle = styled.h2`
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

export const HeroDesc = styled.p`
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
export const ServiceGrid = styled.div`
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

export const ServiceCard = styled(Link)`
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
export const IconImage = styled.img`
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

export const ServiceTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  transition: color 0.3s ease;
`;

// Contacts Section
export const ContactsSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 100px;

  @media (max-width: 768px) {
    padding: 0 16px 60px;
  }
`;

export const SectionHeader = styled.div`
  text-align: center;
  max-width: 600px;
  margin: 0 auto 40px;
`;

export const SectionLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: var(--accent-primary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
`;

export const SectionTitle = styled.h3`
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const ContactsList = styled.div`
  display: grid;
  gap: 12px;
`;

export const ContactCard = styled(Link)`
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

export const ContactAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;

  svg {
    width: 48px;
    height: 48px;
  }
`;

export const ContactInfo = styled.div`
  flex: 1;
`;

export const ContactName = styled.span`
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  transition: color 0.3s ease;
`;

export const ContactMeta = styled.span`
  font-size: 14px;
  color: var(--text-secondary);
  transition: color 0.3s ease;
`;

// Modal Styles
export const InputLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  transition: color 0.3s ease;
`;

export const Input = styled.input`
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

export const MessengerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 24px;

  @media (max-width: 360px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
`;

export const MessengerBtn = styled.button<{ $active: boolean }>`
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

export const SubmitBtn = styled.button`
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
export const PersonaGrid = styled.div`
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

export const PersonaCard = styled.button<{ $platform?: string }>`
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

export const PersonaAvatar = styled.div<{ $color: string; $image?: string }>`
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

export const PersonaInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const PersonaName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
`;

export const PersonaOccupation = styled.div`
  font-size: 13px;
  color: var(--text-secondary);
`;

export const PersonaPlatform = styled.span`
  display: inline-block;
  font-size: 11px;
  color: var(--accent-primary);
  background: rgba(16, 185, 129, 0.1);
  padding: 2px 8px;
  border-radius: 8px;
  margin-left: 6px;
`;

export const DifficultyBadge = styled.span<{ $level: number }>`
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

export const TrainingServiceCard = styled.button`
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
