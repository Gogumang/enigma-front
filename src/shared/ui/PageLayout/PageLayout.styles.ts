import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';

export const Container = styled.div`
  min-height: 100vh;
  background: var(--bg-secondary);
`;

export const Header = styled.header`
  position: sticky;
  top: 0;
  background: var(--bg-card);
  z-index: 100;
  border-bottom: 1px solid var(--border-color);
`;

export const HeaderInner = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 8px;
`;

export const BackButton = styled(Link)`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  border-radius: 12px;
  text-decoration: none;

  &:active {
    background: var(--bg-secondary);
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

export const HeaderTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

export const Main = styled.main`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px 20px 40px;
`;
