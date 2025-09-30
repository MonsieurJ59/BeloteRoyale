import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { theme } from './theme';
import type { Tournament } from '../types/api';

// Layout Components
export const PageContainer = styled.div`
  width: 100%;
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xxl};

  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${theme.spacing.lg};
    align-items: stretch;
  }
`;

export const Title = styled.h1`
  font-family: ${theme.typography.fontFamily.heading};
  font-size: ${theme.typography.fontSize['4xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  position: relative;
  margin: 0;

  &::after {
    content: '';
    position: absolute;
    bottom: -${theme.spacing.sm};
    left: 0;
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, ${theme.colors.accent.main}, ${theme.colors.accent.light});
    border-radius: ${theme.borderRadius.sm};
  }

  @media (max-width: ${theme.breakpoints.md}) {
    text-align: center;
    
    &::after {
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

export const CreateButton = styled.button`
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  background-color: ${theme.colors.primary.main};
  color: ${theme.colors.text.light};
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.fontWeight.semibold};
  font-size: ${theme.typography.fontSize.base};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

  &:hover {
    background-color: ${theme.colors.primary.light};
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }

  &:focus {
    outline: 2px solid ${theme.colors.accent.main};
    outline-offset: 2px;
  }
`;

// Tabs Components
export const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${theme.spacing.xxl};
  background: ${theme.colors.background.card};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.sm};
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.border.light};

  @media (max-width: ${theme.breakpoints.md}) {
    flex-wrap: wrap;
    gap: ${theme.spacing.xs};
  }
`;

export const Tab = styled.button<{ $active: boolean }>`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background-color: ${props => props.$active ? theme.colors.primary.main : 'transparent'};
  border: none;
  border-radius: ${theme.borderRadius.md};
  color: ${props => props.$active ? theme.colors.text.light : theme.colors.text.secondary};
  font-weight: ${props => props.$active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium};
  font-size: ${theme.typography.fontSize.base};
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  position: relative;

  &:hover {
    background-color: ${props => props.$active ? theme.colors.primary.light : theme.colors.primary.main + '10'};
    color: ${props => props.$active ? theme.colors.text.light : theme.colors.primary.main};
    transform: translateY(-1px);
  }

  &:focus {
    outline: 2px solid ${theme.colors.accent.main};
    outline-offset: 2px;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    flex: 1;
    min-width: 80px;
    font-size: ${theme.typography.fontSize.sm};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
  }
`;

// Tournament Grid and Cards
export const TournamentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

export const TournamentCard = styled.div`
  background-color: ${theme.colors.background.card};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.sm};
  position: relative;
  transition: all ${theme.transitions.normal};
  border: 1px solid ${theme.colors.border.light};
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${theme.colors.primary.main}, ${theme.colors.accent.main});
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${theme.shadows.lg};
    border-color: ${theme.colors.accent.main};
  }
`;

// Action Buttons
export const ActionButtons = styled.div`
  position: absolute;
  top: ${theme.spacing.lg};
  left: ${theme.spacing.lg};
  display: flex;
  gap: ${theme.spacing.xs};
  z-index: 1;
`;

export const ActionButton = styled.button<{ $variant: 'edit' | 'delete' }>`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;

  background-color: ${props => props.$variant === 'edit' 
    ? theme.colors.status.info + '20' 
    : theme.colors.status.error + '20'};

  color: ${props => props.$variant === 'edit' 
    ? theme.colors.status.info 
    : theme.colors.status.error};

  &:hover:not(:disabled) {
    background-color: ${props => props.$variant === 'edit' 
      ? theme.colors.status.info + '30' 
      : theme.colors.status.error + '30'};
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &:focus {
    outline: 2px solid ${props => props.$variant === 'edit' 
      ? theme.colors.status.info 
      : theme.colors.status.error};
    outline-offset: 2px;
  }
`;

// Tournament Content
export const TournamentStatus = styled.div<{ $status: Tournament['status'] }>`
  position: absolute;
  top: ${theme.spacing.lg};
  right: ${theme.spacing.lg};
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: ${props => {
    switch (props.$status) {
      case 'upcoming':
        return theme.colors.status.warning + '20';
      case 'in_progress':
        return theme.colors.status.success + '20';
      case 'completed':
        return theme.colors.neutral.gray200;
      default:
        return theme.colors.neutral.gray200;
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'upcoming':
        return theme.colors.status.warning;
      case 'in_progress':
        return theme.colors.status.success;
      case 'completed':
        return theme.colors.text.secondary;
      default:
        return theme.colors.text.secondary;
    }
  }};
`;

export const TournamentName = styled.h3`
  font-family: ${theme.typography.fontFamily.heading};
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  margin-bottom: ${theme.spacing.sm};
  color: ${theme.colors.text.primary};
  line-height: ${theme.typography.lineHeight.tight};
  margin-top: ${theme.spacing.sm};
`;

export const TournamentDate = styled.p`
  font-size: ${theme.typography.fontSize.base};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.xl};
  display: flex;
  align-items: center;

  &::before {
    content: '📅';
    margin-right: ${theme.spacing.sm};
  }
`;

export const ViewDetailsButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background-color: ${theme.colors.primary.main};
  color: ${theme.colors.text.light};
  text-decoration: none;
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.fontWeight.medium};
  font-size: ${theme.typography.fontSize.sm};
  transition: all ${theme.transitions.fast};
  width: 100%;

  &:hover {
    background-color: ${theme.colors.primary.light};
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.sm};
  }
`;

// State Messages
export const LoadingMessage = styled.p`
  text-align: center;
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  margin: ${theme.spacing.xxl} 0;
  padding: ${theme.spacing.xl};
  background-color: ${theme.colors.neutral.gray50};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.light};
`;

export const ErrorMessage = styled.p`
  text-align: center;
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.status.error};
  margin: ${theme.spacing.xxl} 0;
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.status.error}20;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.status.error}40;
`;

export const EmptyMessage = styled.p`
  text-align: center;
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  margin: ${theme.spacing.xxl} 0;
  padding: ${theme.spacing.xxl};
  background-color: ${theme.colors.neutral.gray50};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.light};
`;