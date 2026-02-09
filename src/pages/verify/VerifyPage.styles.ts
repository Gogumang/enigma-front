import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

export const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const TypeTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

export const TypeTab = styled.button<{ $active: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 8px;
  border-radius: 14px;
  border: 2px solid ${p => (p.$active ? '#6366f1' : '#e5e8eb')};
  background: ${p => (p.$active ? '#f5f3ff' : '#fff')};
  color: ${p => (p.$active ? '#6366f1' : '#6b7684')};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #6366f1;
  }
`;

export const TabIcon = styled.div<{ $active: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${p => (p.$active ? '#6366f1' : '#f2f4f6')};
  color: ${p => (p.$active ? '#fff' : '#8b95a1')};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
`;

export const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

export const InputRow = styled.div`
  display: flex;
  align-items: center;
  border: 2px solid #e5e8eb;
  border-radius: 14px;
  background: #fff;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus-within {
    border-color: #6366f1;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }
`;

export const InputPrefix = styled.div`
  padding: 0 4px 0 16px;
  color: #8b95a1;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

export const Input = styled.input`
  flex: 1;
  padding: 16px 16px 16px 8px;
  border: none;
  background: transparent;
  font-size: 16px;
  color: #191f28;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

export const InputHint = styled.div`
  margin-top: 10px;
  font-size: 13px;
  color: #8b95a1;
  line-height: 1.6;
`;

export const Button = styled.button`
  width: 100%;
  padding: 16px;
  margin-top: 16px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #e5e8eb;
    color: #adb5bd;
    transform: none;
    box-shadow: none;
  }
`;

export const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const LoadingOverlay = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export const LoadingLottie = styled.div`
  width: 160px;
  height: 160px;
`;

export const LoadingText = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #6366f1;
`;

export const LoadingSubText = styled.div`
  font-size: 13px;
  color: #8b95a1;
`;

export const ErrorMessage = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: #fef2f2;
  border-radius: 12px;
  color: #dc2626;
  font-size: 14px;
  text-align: center;
`;
