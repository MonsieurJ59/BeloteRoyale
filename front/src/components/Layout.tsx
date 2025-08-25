import styled from 'styled-components';
import { theme } from '../styles/theme';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Sidebar />
      <MainContent>
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

const MainContent = styled.main`
  flex: 1;
  margin-left: ${theme.sidebar.width};
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
`;

export default Layout;
