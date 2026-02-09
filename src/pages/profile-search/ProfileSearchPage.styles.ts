import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const LoadingOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  animation: ${fadeIn} 0.2s ease;
`;

export const LoadingLottieWrapper = styled.div`
  width: 180px;
  height: 180px;
`;

export const LoadingText = styled.div`
  font-size: 17px;
  font-weight: 600;
  color: #fff;
`;

export const LoadingSubtext = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  line-height: 1.5;
`;

export const ContentWrapper = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px 0;
`;

export const DropzoneWrapper = styled.div`
  margin-bottom: 20px;
`;

export const Button = styled.button`
  width: 100%;
  padding: 16px;
  background: var(--accent-gradient);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  &:active {
    opacity: 0.9;
  }

  &:disabled {
    background: var(--border-color);
    color: var(--text-tertiary);
  }
`;

export const TipCard = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: var(--bg-card);
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
`;

export const TipTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
`;

export const TipList = styled.ul`
  margin: 0;
  padding: 0 0 0 20px;
`;

export const TipItem = styled.li`
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.8;
`;

export const ErrorMessage = styled.div`
  padding: 16px;
  background: #ffebee;
  border-radius: 12px;
  color: #f04452;
  font-size: 14px;
  margin-top: 16px;
  text-align: center;
`;

// ========== Face Select Modal ==========

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

export const ModalContent = styled.div`
  background: var(--bg-card);
  border-radius: 16px;
  max-width: 420px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

export const ModalHeader = styled.div`
  padding: 20px 20px 12px;
  border-bottom: 1px solid var(--border-color);
`;

export const ModalTitle = styled.h3`
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px;
`;

export const ModalDesc = styled.p`
  font-size: 13px;
  color: var(--text-tertiary);
  margin: 0;
`;

export const FacePreviewWrapper = styled.div`
  position: relative;
  margin: 16px 20px 0;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
`;

export const FacePreviewImage = styled.img`
  width: 100%;
  display: block;
`;

export const FaceBoundingBox = styled.div<{ $selected: boolean }>`
  position: absolute;
  border: 2px solid ${p => (p.$selected ? '#6366f1' : 'rgba(255, 255, 255, 0.7)')};
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-shadow: ${p => (p.$selected ? '0 0 0 2px rgba(99,102,241,0.4)' : 'none')};

  &:hover {
    border-color: #6366f1;
  }
`;

export const FaceBboxLabel = styled.div<{ $selected: boolean }>`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  background: ${p => (p.$selected ? '#6366f1' : 'rgba(0,0,0,0.6)')};
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
`;

export const FaceGridLabel = styled.div`
  padding: 12px 20px 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
`;

export const FaceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
  padding: 10px 20px 16px;
`;

export const FaceCard = styled.button<{ $selected: boolean }>`
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  border: 3px solid ${p => (p.$selected ? '#6366f1' : 'var(--border-color)')};
  background: var(--bg-secondary);
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  transition: border-color 0.2s, transform 0.15s;

  &:hover { transform: scale(1.04); }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const FaceCheckMark = styled.div`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #6366f1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalFooter = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 20px 20px;
  border-top: 1px solid var(--border-color);
`;

export const ModalCancelBtn = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

export const ModalConfirmBtn = styled.button<{ $disabled?: boolean }>`
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: ${p => (p.$disabled ? 'var(--bg-secondary)' : '#6366f1')};
  color: ${p => (p.$disabled ? 'var(--text-tertiary)' : '#fff')};
  font-size: 14px;
  font-weight: 600;
  cursor: ${p => (p.$disabled ? 'default' : 'pointer')};
`;

export const DetectingText = styled.div`
  padding: 12px;
  text-align: center;
  color: var(--text-tertiary);
  font-size: 13px;
  margin-bottom: 12px;
`;
