import type { ReactNode } from 'react';
import {
  Overlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseBtn,
} from './Modal.styles';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

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
