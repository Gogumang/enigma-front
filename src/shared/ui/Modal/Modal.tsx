import styled from '@emotion/styled';
import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

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

const ModalContainer = styled.div`
  width: 100%;
  max-width: 360px;
  background: #fff;
  border-radius: 20px;
  padding: 24px 20px;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
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

  &:hover {
    background: #e5e8eb;
  }
`;

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        {title && (
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            <CloseBtn onClick={onClose}>×</CloseBtn>
          </ModalHeader>
        )}
        {children}
      </ModalContainer>
    </Overlay>
  );
}
