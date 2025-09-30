import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { theme } from './theme';

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
  transition: width ${theme.transitions.normal};
  z-index: ${theme.zIndex.fixed};
  box-shadow: ${theme.shadows.lg};
  border-right: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: ${theme.breakpoints.md}) {
    width: ${theme.sidebar.width};
    transform: translateX(${({ $isCollapsed }) => $isCollapsed ? '-100%' : '0'});
    transition: transform ${theme.transitions.normal};
  }
`;

export const SidebarHeader = styled.div`
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const LogoContainer = styled.div<{ $isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $isCollapsed }) => $isCollapsed ? 'center' : 'space-between'};
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
    display: ${({ $isCollapsed }) => $isCollapsed ? 'none' : 'flex'};
  }
`;

export const Navigation = styled.nav`
  flex: 1;
  padding: ${theme.spacing.lg} 0;
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
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 60%;
      background: ${theme.colors.accent.main};
      border-radius: 0 2px 2px 0;
    }
  `}
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
`;

export const NavLabel = styled.span`
  margin-left: ${theme.spacing.md};
  font-weight: ${theme.typography.fontWeight.medium};
  font-size: ${theme.typography.fontSize.base};
`;

export const SidebarFooter = styled.div<{ $isCollapsed: boolean }>`
  padding: ${theme.spacing.lg};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: ${({ $isCollapsed }) => $isCollapsed ? 'center' : 'left'};
`;

export const FooterText = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.muted};
  margin: 0;
`;

export const MobileOverlay = styled.div<{ $isVisible: boolean }>`
  display: none;
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

  @media (max-width: ${theme.breakpoints.md}) {
    display: block;
  }
`;