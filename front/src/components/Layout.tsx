import { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import Sidebar from './Sidebar';
import { MobileOverlay, MobileMenuButton } from '../styles/Sidebar.styles';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768);
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  return (
    <LayoutContainer>
      <Sidebar isCollapsed={sidebarCollapsed} />
      <MobileOverlay $isVisible={!sidebarCollapsed} onClick={() => setSidebarCollapsed(true)} />
      <MobileMenuButton onClick={toggleSidebar} aria-label="Menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2"/>
          <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2"/>
          <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </MobileMenuButton>
      <MainContent $sidebarCollapsed={sidebarCollapsed}>
        <ContentWrapper>
          {children}
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${theme.colors.background.primary};
`;

const MainContent = styled.main<{ $sidebarCollapsed: boolean }>`
  flex: 1;
  margin-left: ${({ $sidebarCollapsed }) => $sidebarCollapsed ? '0' : theme.sidebar.width};
  transition: margin-left ${theme.transitions.normal};
  min-height: 100vh;
  
  @media (max-width: ${theme.breakpoints.md}) {
    margin-left: 0;
  }
`;

const ContentWrapper = styled.div`
  padding: ${theme.spacing.xl};
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.lg} ${theme.spacing.md};
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md} ${theme.spacing.sm};
  }
`;

export default Layout;
