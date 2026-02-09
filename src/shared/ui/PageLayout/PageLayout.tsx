import type { ReactNode } from 'react';
import {
  Container,
  Header,
  HeaderInner,
  BackButton,
  HeaderTitle,
  Main,
} from './PageLayout.styles';

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
