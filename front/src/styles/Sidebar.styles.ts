import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { theme } from './theme';
import { media, mobileNavigation } from './responsive';

export const SidebarContainer = styled.aside<{ $isCollapsed: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${({ $isCollapsed }) => $isCollapsed ? theme.sidebar.collapsedWidth : theme.sidebar.width};
  background: linear-gradient(180deg, ${theme.colors.background.sidebar} 0%, ${theme.colors.primary.dark} 100%);
  color: ${theme.colors.text.light};
  display: flex;
  flex-direction: column;
  transition: width ${theme.transitions.normal}, transform ${theme.transitions.normal};
  z-index: ${theme.zIndex.fixed};
  box-shadow: ${theme.shadows.lg};
  border-right: 1px solid rgba(255, 255, 255, 0.1);

  // Sur mobile, la sidebar prend toute la largeur et se transforme en menu off-canvas
  @media (max-width: ${theme.breakpoints.md}) {
    width: 100%;
    max-width: 320px;
    transform: translateX(${({ $isCollapsed }) => $isCollapsed ? '-100%' : '0'});
  }
`;

export const SidebarHeader = styled.div`
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.lg} ${theme.spacing.md};
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

export const LogoContainer = styled.div<{ $isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $isCollapsed }) => $isCollapsed ? 'center' : 'space-between'};
  
  @media (max-width: ${theme.breakpoints.md}) {
    justify-content: space-between;
  }
`;

export const LogoText = styled(Link)`
  font-family: ${theme.typography.fontFamily.heading};
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.light};
  text-decoration: none;
  background: linear-gradient(135deg, ${theme.colors.accent.main}, ${theme.colors.accent.light});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize.xl};
  }
`;

export const CollapseButton = styled.button<{ $isCollapsed: boolean }>`
  background: none;
  border: none;
  color: ${theme.colors.text.light};
  cursor: pointer;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  transition: background-color ${theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    display: flex;
  }
`;

export const Navigation = styled.nav`
  flex: 1;
  padding: ${theme.spacing.lg} 0;
  overflow-y: auto;
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.md} 0;
  }
`;

export const NavItem = styled.div`
  margin-bottom: ${theme.spacing.sm};
`;

export const NavLink = styled(Link)<{ $active: boolean; $isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  color: ${({ $active }) => $active ? theme.colors.accent.main : theme.colors.text.light};
  text-decoration: none;
  transition: all ${theme.transitions.fast};
  position: relative;
  margin: 0 ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  background-color: ${({ $active }) => $active ? 'rgba(255, 152, 0, 0.1)' : 'transparent'};

  &:hover {
    background-color: ${({ $active }) => 
      $active ? 'rgba(255, 152, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
    color: ${({ $active }) => $active ? theme.colors.accent.light : theme.colors.accent.main};
  }

  ${({ $active }) => $active && `
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: linear-gradient(to bottom, ${theme.colors.accent.main}, ${theme.colors.accent.light});
      border-radius: 0 ${theme.borderRadius.sm} ${theme.borderRadius.sm} 0;
    }
  `}
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.lg} ${theme.spacing.lg};
    margin: 0 ${theme.spacing.sm};
  }
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing.md};
  color: inherit;
`;

export const NavLabel = styled.span<{ $isCollapsed: boolean }>`
  display: ${({ $isCollapsed }) => $isCollapsed ? 'none' : 'block'};
  white-space: nowrap;
  
  @media (max-width: ${theme.breakpoints.md}) {
    display: block;
  }
`;

export const SidebarFooter = styled.div`
  padding: ${theme.spacing.lg};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.md};
  }
`;

export const FooterText = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.muted};
`;

// Overlay pour mobile qui apparaît derrière la sidebar
export const MobileOverlay = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${theme.zIndex.fixed - 1};
  opacity: ${({ $isVisible }) => $isVisible ? 1 : 0};
  visibility: ${({ $isVisible }) => $isVisible ? 'visible' : 'hidden'};
  transition: opacity ${theme.transitions.normal}, visibility ${theme.transitions.normal};
  
  @media (min-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`;

// Bouton hamburger pour mobile
export const MobileMenuButton = styled.button`
  ${mobileNavigation.hamburgerMenu}
  background: ${theme.colors.primary.main};
  color: ${theme.colors.text.light};
  border: none;
  border-radius: ${theme.borderRadius.full};
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${theme.shadows.md};
  
  &:focus {
    outline: none;
  }
`;