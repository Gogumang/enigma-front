'use client';

import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';

const Container = styled.div`
  min-height: 100vh;
  background: #f2f4f8;
`;

const Header = styled.header`
  padding: 32px 24px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #191f28;
  margin: 0;
`;

const AddButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: #3182f6;
  border: none;
  color: #fff;
  font-size: 24px;
  font-weight: 300;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(49, 130, 246, 0.3);

  &:active {
    transform: scale(0.95);
  }
`;

const Section = styled.section`
  padding: 0 16px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 16px 24px;
  background: #fff;
  border-radius: 16px;
  text-decoration: none;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: transform 0.15s, box-shadow 0.15s;

  &:active {
    transform: scale(0.98);
  }
`;

const IconBox = styled.div`
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardTitle = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #191f28;
  text-align: center;
`;

const CardDesc = styled.span`
  font-size: 13px;
  color: #8b95a1;
  margin-top: 4px;
  text-align: center;
`;

// Modal styles
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Modal = styled.div`
  width: 100%;
  max-width: 360px;
  background: #fff;
  border-radius: 20px;
  padding: 24px 20px;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #191f28;
  margin: 0;
`;

const CloseBtn = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: #f2f4f6;
  border-radius: 8px;
  font-size: 18px;
  color: #6b7684;
  cursor: pointer;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #6b7684;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px;
  border: 1px solid #e5e8eb;
  border-radius: 12px;
  background: #fff;
  font-size: 16px;
  color: #191f28;
  margin-bottom: 20px;

  &:focus {
    outline: none;
    border-color: #3182f6;
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const MessengerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 24px;
`;

const MessengerBtn = styled.button<{ $active: boolean }>`
  padding: 14px;
  background: ${props => props.$active ? '#f0f0f0' : '#f9fafb'};
  border: 2px solid ${props => props.$active ? '#191f28' : 'transparent'};
  border-radius: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 36px;
    height: 36px;
  }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 16px;
  background: #3182f6;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    background: #e5e8eb;
    color: #adb5bd;
  }

  &:active:not(:disabled) {
    background: #1b64da;
  }
`;

// Saved contacts section
const ContactsSection = styled.div`
  margin-top: 24px;
  padding: 0 16px;
`;

const SectionLabel = styled.h2`
  font-size: 15px;
  font-weight: 600;
  color: #191f28;
  padding: 0 8px;
  margin: 0 0 12px;
`;

const ContactCard = styled(Link)`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: #fff;
  border-radius: 14px;
  text-decoration: none;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const ContactAvatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 44px;
    height: 44px;
  }
`;

const ContactInfo = styled.div`
  flex: 1;
`;

const ContactName = styled.span`
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #191f28;
`;

const ContactMeta = styled.span`
  font-size: 13px;
  color: #8b95a1;
`;

// 3D Style Icons
const ChatIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <ellipse cx="32" cy="54" rx="20" ry="4" fill="#e8ebf0"/>
    <rect x="10" y="12" width="44" height="36" rx="8" fill="#4da3ff"/>
    <rect x="10" y="12" width="44" height="36" rx="8" fill="url(#chatGrad)"/>
    <rect x="18" y="22" width="20" height="4" rx="2" fill="#fff" opacity="0.9"/>
    <rect x="18" y="30" width="28" height="4" rx="2" fill="#fff" opacity="0.6"/>
    <rect x="18" y="38" width="16" height="4" rx="2" fill="#fff" opacity="0.4"/>
    <defs>
      <linearGradient id="chatGrad" x1="10" y1="12" x2="54" y2="48">
        <stop stopColor="#5eb3ff"/>
        <stop offset="1" stopColor="#3b82f6"/>
      </linearGradient>
    </defs>
  </svg>
);

const TrainingIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <ellipse cx="32" cy="54" rx="20" ry="4" fill="#e8ebf0"/>
    <path d="M32 8L10 20V36C10 46 20 54 32 58C44 54 54 46 54 36V20L32 8Z" fill="#20c997"/>
    <path d="M32 8L10 20V36C10 46 20 54 32 58C44 54 54 46 54 36V20L32 8Z" fill="url(#shieldGrad)"/>
    <path d="M26 32L30 36L40 26" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="shieldGrad" x1="10" y1="8" x2="54" y2="58">
        <stop stopColor="#34d399"/>
        <stop offset="1" stopColor="#10b981"/>
      </linearGradient>
    </defs>
  </svg>
);

const ImageIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <ellipse cx="32" cy="54" rx="20" ry="4" fill="#e8ebf0"/>
    <rect x="8" y="10" width="48" height="38" rx="8" fill="#a855f7"/>
    <rect x="8" y="10" width="48" height="38" rx="8" fill="url(#imgGrad)"/>
    <circle cx="22" cy="24" r="6" fill="#fff" opacity="0.9"/>
    <path d="M8 40L20 28L32 40L44 26L56 38V40C56 44.4 52.4 48 48 48H16C11.6 48 8 44.4 8 40Z" fill="#fff" opacity="0.4"/>
    <defs>
      <linearGradient id="imgGrad" x1="8" y1="10" x2="56" y2="48">
        <stop stopColor="#c084fc"/>
        <stop offset="1" stopColor="#a855f7"/>
      </linearGradient>
    </defs>
  </svg>
);

const ProfileIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <ellipse cx="32" cy="54" rx="20" ry="4" fill="#e8ebf0"/>
    <circle cx="32" cy="28" r="22" fill="#ff9500"/>
    <circle cx="32" cy="28" r="22" fill="url(#profGrad)"/>
    <circle cx="32" cy="22" r="8" fill="#fff" opacity="0.9"/>
    <path d="M18 42C18 34 24 28 32 28C40 28 46 34 46 42" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.7"/>
    <defs>
      <linearGradient id="profGrad" x1="10" y1="6" x2="54" y2="50">
        <stop stopColor="#ffb347"/>
        <stop offset="1" stopColor="#ff9500"/>
      </linearGradient>
    </defs>
  </svg>
);

// Messenger Icons
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

const messengers = [
  { id: 'kakao', name: '카카오톡', Icon: KakaoIcon },
  { id: 'instagram', name: '인스타그램', Icon: InstagramIcon },
  { id: 'telegram', name: '텔레그램', Icon: TelegramIcon },
  { id: 'facebook', name: '페이스북', Icon: FacebookIcon },
];

interface Contact {
  id: string;
  name: string;
  messenger: string;
  createdAt: number;
}

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [messenger, setMessenger] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('loveguard_contacts');
    if (saved) setContacts(JSON.parse(saved));
  }, []);

  const handleSubmit = () => {
    if (!name.trim() || !messenger) return;

    const newContact: Contact = {
      id: Date.now().toString(),
      name: name.trim(),
      messenger,
      createdAt: Date.now(),
    };

    const updated = [newContact, ...contacts];
    setContacts(updated);
    localStorage.setItem('loveguard_contacts', JSON.stringify(updated));

    setShowModal(false);
    setName('');
    setMessenger('');

    // Navigate to analysis page
    window.location.href = `/analyze/${newContact.id}`;
  };

  const getMessenger = (id: string) => messengers.find(m => m.id === id);

  return (
    <Container>
      <Header>
        <Title>러브가드</Title>
        <AddButton onClick={() => setShowModal(true)}>+</AddButton>
      </Header>

      <Section>
        <CardGrid>
          <Card href="/chat">
            <IconBox><ChatIcon /></IconBox>
            <CardTitle>대화 분석</CardTitle>
            <CardDesc>위험도 체크</CardDesc>
          </Card>

          <Card href="/training">
            <IconBox><TrainingIcon /></IconBox>
            <CardTitle>면역 훈련</CardTitle>
            <CardDesc>대응 연습</CardDesc>
          </Card>

          <Card href="/image-search">
            <IconBox><ImageIcon /></IconBox>
            <CardTitle>사진/영상 검색</CardTitle>
            <CardDesc>AI 역추적</CardDesc>
          </Card>

          <Card href="/profile-search">
            <IconBox><ProfileIcon /></IconBox>
            <CardTitle>프로필 검색</CardTitle>
            <CardDesc>신원 확인</CardDesc>
          </Card>
        </CardGrid>
      </Section>

      {contacts.length > 0 && (
        <ContactsSection>
          <SectionLabel>분석 중인 대상</SectionLabel>
          {contacts.map(contact => {
            const m = getMessenger(contact.messenger);
            return (
              <ContactCard key={contact.id} href={`/analyze/${contact.id}`}>
                <ContactAvatar>
                  {m && <m.Icon />}
                </ContactAvatar>
                <ContactInfo>
                  <ContactName>{contact.name}</ContactName>
                  <ContactMeta>{m?.name}</ContactMeta>
                </ContactInfo>
              </ContactCard>
            );
          })}
        </ContactsSection>
      )}

      {showModal && (
        <Overlay onClick={() => setShowModal(false)}>
          <Modal onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>새 분석 대상 추가</ModalTitle>
              <CloseBtn onClick={() => setShowModal(false)}>×</CloseBtn>
            </ModalHeader>

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
        </Overlay>
      )}
    </Container>
  );
}
