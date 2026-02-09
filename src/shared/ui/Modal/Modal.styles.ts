import styled from '@emotion/styled';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const ModalContainer = styled.div`
  width: 100%;
  max-width: 360px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 24px 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.2s ease-out;
  transition: background-color 0.3s ease, border-color 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  transition: color 0.3s ease;
`;

export const CloseBtn = styled.button`
  width: 32px;
  height: 32px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  border-radius: 8px;
  font-size: 18px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--border-color);
    color: var(--text-primary);
  }
`;
