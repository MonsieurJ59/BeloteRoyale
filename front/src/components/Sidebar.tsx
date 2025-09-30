import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  SidebarContainer,
  SidebarHeader,
  LogoContainer,
  LogoText,
  CollapseButton,
  Navigation,
  NavItem,
  NavLink,
  IconContainer,
  NavLabel,
  SidebarFooter,
  FooterText,
  MobileOverlay
} from '../styles/Sidebar.styles';

// Icônes SVG pour la navigation
const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TournamentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const TeamIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
    <path d="M23 21V19C23 18.1645 22.7155 17.3541 22.2094 16.6977C21.7033 16.0414 20.9999 15.5755 20.2 15.3727" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3.13C16.8003 3.33273 17.5037 3.79863 18.0098 4.45496C18.5159 5.11129 18.8004 5.92167 18.8004 6.75739C18.8004 7.59312 18.5159 8.40349 18.0098 9.05982C17.5037 9.71615 16.8003 10.1821 16 10.3848" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MatchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
    <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
    <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2"/>
    <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2"/>
    <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

interface SidebarProps {
  isCollapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed: controlledCollapsed }) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const location = useLocation();
  
  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  
  const toggleSidebar = () => {
    if (controlledCollapsed === undefined) {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/', label: 'Accueil', icon: HomeIcon },
    { path: '/tournaments', label: 'Tournois', icon: TournamentIcon },
    { path: '/teams', label: 'Équipes', icon: TeamIcon },
    { path: '/matches', label: 'Matchs', icon: MatchIcon },
  ];

  return (
    <>
      <SidebarContainer $isCollapsed={isCollapsed}>
        <SidebarHeader>
          <LogoContainer $isCollapsed={isCollapsed}>
            {!isCollapsed && <LogoText to="/">Belote Royale</LogoText>}
            <CollapseButton onClick={toggleSidebar} $isCollapsed={isCollapsed}>
              {isCollapsed ? <MenuIcon /> : <CloseIcon />}
            </CollapseButton>
          </LogoContainer>
        </SidebarHeader>

        <Navigation>
          {navItems.map((item) => (
            <NavItem key={item.path}>
              <NavLink 
                to={item.path} 
                $active={isActive(item.path)}
                $isCollapsed={isCollapsed}
              >
                <IconContainer>
                  <item.icon />
                </IconContainer>
                {!isCollapsed && <NavLabel>{item.label}</NavLabel>}
              </NavLink>
            </NavItem>
          ))}
        </Navigation>

        <SidebarFooter $isCollapsed={isCollapsed}>
          {!isCollapsed && (
            <FooterText>
              © 2025 Belote Royale
            </FooterText>
          )}
        </SidebarFooter>
      </SidebarContainer>
      
      {/* Overlay pour mobile */}
      <MobileOverlay $isVisible={!isCollapsed} onClick={toggleSidebar} />
    </>
  );
};

export default Sidebar;
