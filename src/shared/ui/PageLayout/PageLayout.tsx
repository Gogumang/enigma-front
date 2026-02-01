import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';

const Container = styled.div`
  min-height: 100vh;
  background: var(--bg-secondary);
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  background: var(--bg-card);
  z-index: 100;
  border-bottom: 1px solid var(--border-color);
`;

const HeaderInner = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 8px;
`;

const BackButton = styled(Link)`
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

const HeaderTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

const Main = styled.main`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px 20px 40px;
`;

interface PageLayoutProps {
  title: string;
  children: ReactNode;
}

export function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <Container>
      <Header>
        <HeaderInner>
          <BackButton to="/">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </BackButton>
          <HeaderTitle>{title}</HeaderTitle>
        </HeaderInner>
      </Header>
      <Main>{children}</Main>
    </Container>
  );
}
