import styled from 'styled-components';
import { theme } from './theme';
import type { Tournament } from '../types/api';

export const PageContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
`;

export const LoadingMessage = styled.div`
  text-align: center;
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  margin: ${theme.spacing.xxl} 0;
  padding: ${theme.spacing.xl};
  background-color: ${theme.colors.neutral.gray50};
  border-radius: ${theme.borderRadius.lg};
`;

export const ErrorMessage = styled.div`
  text-align: center;
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.status.error};
  margin: ${theme.spacing.xxl} 0;
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.status.error}20;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.status.error}40;
`;

export const TournamentHeader = styled.div`
  background: linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.accent.main});
  color: ${theme.colors.text.light};
  padding: ${theme.spacing.xxl};
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing.xxl};
  box-shadow: ${theme.shadows.lg};
`;

export const TournamentTitle = styled.h1`
  font-family: ${theme.typography.fontFamily.heading};
  font-size: ${theme.typography.fontSize['4xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
`;

export const TournamentInfo = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing.xl};
  flex-wrap: wrap;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

export const InfoLabel = styled.span`
  font-weight: ${theme.typography.fontWeight.medium};
  opacity: 0.9;
`;

export const InfoValue = styled.span`
  font-weight: ${theme.typography.fontWeight.semibold};
`;

export const StatusBadge = styled.span<{ $status: Tournament['status'] }>`
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: ${props => {
    switch (props.$status) {
      case 'draft': return theme.colors.neutral.gray500;
      case 'active': return theme.colors.status.success;
      case 'completed': return theme.colors.primary.main;
      default: return theme.colors.neutral.gray500;
    }
  }};
  color: ${theme.colors.text.light};
`;

export const StatsSection = styled.section`
  margin-bottom: ${theme.spacing.xxl};
`;

export const ActionsSection = styled.section`
  margin-bottom: ${theme.spacing.xxl};
  background: ${theme.colors.background.card};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.light};
  box-shadow: ${theme.shadows.sm};
  padding: ${theme.spacing.xl};
`;

export const ActionMessage = styled.p`
  text-align: center;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.md};
`;

export const SuggestedList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 ${theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${theme.spacing.sm};

  li {
    background: ${theme.colors.neutral.gray50};
    border: 1px solid ${theme.colors.border.light};
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing.md};
    text-align: center;
  }
`;

export const CreateMatchesButton = styled.button`
  display: block; 
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background-color: ${theme.colors.primary.main};
  color: ${theme.colors.text.light};
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.fontWeight.medium};
  transition: all ${theme.transitions.fast};
  cursor: pointer;
  margin: 0 auto; 
  width: fit-content; 

  &:hover {
    background-color: ${theme.colors.primary.light};
    transform: translateY(-1px);
  }
`;

export const SectionTitle = styled.h2`
  font-family: ${theme.typography.fontFamily.heading};
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xl};
  text-align: center;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
`;

export const StatCard = styled.div`
  background: ${theme.colors.background.card};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  text-align: center;
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.border.light};
  transition: all ${theme.transitions.normal};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.md};
  }
`;

export const StatNumber = styled.div`
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary.main};
  margin-bottom: ${theme.spacing.sm};
`;

export const StatLabel = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.fontWeight.medium};
`;

export const RankingSection = styled.section`
  margin-bottom: ${theme.spacing.xxl};
`;

export const EmptyMessage = styled.div`
  text-align: center;
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  padding: ${theme.spacing.xxl};
  background-color: ${theme.colors.neutral.gray50};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.light};
`;

export const RankingTable = styled.div`
  background: ${theme.colors.background.card};
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.border.light};
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 200px 100px 100px 150px;
  background: ${theme.colors.primary.main};
  color: ${theme.colors.text.light};
  font-weight: ${theme.typography.fontWeight.semibold};
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 60px 1fr 80px 80px 100px;
    font-size: ${theme.typography.fontSize.sm};
  }
`;

export const HeaderCell = styled.div`
  padding: ${theme.spacing.lg};
  text-align: center;
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.md} ${theme.spacing.sm};

    &:nth-child(3) {
      display: none; // Masquer la colonne joueurs sur mobile
    }
  }
`;

export const TableBody = styled.div``;

export const TableRow = styled.div<{ $rank: number }>`
  display: grid;
  grid-template-columns: 80px 1fr 200px 100px 100px 150px;
  border-bottom: 1px solid ${theme.colors.border.light};
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background-color: ${theme.colors.neutral.gray50};
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  ${props => props.$rank <= 3 && `
    background: linear-gradient(90deg, ${theme.colors.accent.main}10, transparent);
    border-left: 4px solid ${theme.colors.accent.main};
  `}
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 60px 1fr 80px 80px 100px;
  }
`;

export const RankCell = styled.div<{ $rank: number }>`
  padding: ${theme.spacing.lg};
  text-align: center;
  font-weight: ${theme.typography.fontWeight.bold};
  font-size: ${theme.typography.fontSize.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${props => props.$rank <= 3 && `
    color: ${theme.colors.accent.main};
  `}
`;

export const TeamCell = styled.div`
  padding: ${theme.spacing.lg};
  display: flex;
  align-items: center;
`;

export const TeamName = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
`;

export const PlayersCell = styled.div`
  padding: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${theme.spacing.xs};
  
  @media (max-width: ${theme.breakpoints.md}) {
    display: none; // Masquer sur mobile
  }
`;

export const PlayerName = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
`;

export const StatCell = styled.div<{ $highlight?: boolean }>`
  padding: ${theme.spacing.lg};
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${props => props.$highlight ? theme.typography.fontWeight.bold : theme.typography.fontWeight.medium};
  color: ${props => props.$highlight ? theme.colors.primary.main : theme.colors.text.primary};
`;

export const MatchesSection = styled.section`
  margin-bottom: ${theme.spacing.xxl};
`;

export const MatchesByType = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
`;

export const MatchTypeSection = styled.div`
  background: ${theme.colors.background.card};
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.border.light};
`;

export const MatchTypeTitle = styled.h3`
  font-family: ${theme.typography.fontFamily.heading};
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.light};
  background: ${theme.colors.primary.main};
  padding: ${theme.spacing.lg};
  margin: 0;
  text-align: center;
`;

export const MatchesTable = styled.div`
  overflow-x: auto;
`;

export const MatchesTableHeader = styled.div`
  background: ${theme.colors.neutral.gray100};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize.sm};
  }
`;

export const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px 1fr 100px;
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr 100px 1fr 80px;
  }
`;

export const MatchesTableBody = styled.div``;

// Modifier MatchRow pour être un div au lieu d'un tr
export const MatchRow = styled.div<{ $status?: 'completed' | 'in_progress' }>`
  display: grid;
  grid-template-columns: 1fr 120px 1fr 100px;
  align-items: center;
  padding: ${theme.spacing.sm} 0;
  transition: all ${theme.transitions.fast};
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr 100px 1fr 80px;
  }
  
  &:hover {
    background-color: ${theme.colors.neutral.gray100};
  }
  
  /* Code couleur selon le statut du match */
  background-color: ${props => 
    props.$status === 'completed' 
      ? `${theme.colors.status.success}10` 
      : props.$status === 'in_progress'
        ? `${theme.colors.primary.main}10`
        : 'transparent'
  };
  
  /* Bordure gauche colorée selon le statut */
  border-left: 4px solid ${props => 
    props.$status === 'completed' 
      ? theme.colors.status.success
      : props.$status === 'in_progress'
        ? theme.colors.primary.main
        : 'transparent'
  };
`;

export const MatchCell = styled.div`
  padding: ${theme.spacing.md};
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.secondary};
  border-right: 1px solid ${theme.colors.border.light};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.sm};
    font-size: ${theme.typography.fontSize.sm};
  }
`;

// SUPPRIMER cette définition en double de TeamMatchCell
// export const TeamMatchCell = styled.div`
//   padding: ${theme.spacing.md};
//   text-align: center;
// `;

export const TeamMatchCell = styled.div`
  padding: ${theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid ${theme.colors.border.light};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.sm};
  }
`;

export const TeamMatchName = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  text-align: center;
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize.sm};
  }
`;

// SUPPRIMER cette définition en double de ScoreCell
// export const ScoreCell = styled.div`
//   padding: ${theme.spacing.md};
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: ${theme.spacing.sm};
// `;

export const ScoreCell = styled.div`
  padding: ${theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  border-right: 1px solid ${theme.colors.border.light};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.sm};
  }
`;

export const Score = styled.span<{ $isWinner?: boolean }>`
  font-weight: ${props => props.$isWinner ? theme.typography.fontWeight.bold : theme.typography.fontWeight.medium};
  color: ${props => props.$isWinner ? theme.colors.status.success : theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.lg};
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize.base};
  }
`;

export const ScoreSeparator = styled.span`
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.fontWeight.medium};
`;

// SUPPRIMER cette définition en double de ActionCell
// export const ActionCell = styled.div`
//   padding: ${theme.spacing.md};
//   text-align: center;
//   display: flex;
//   justify-content: center;
// `;

// Remplacer la définition de StatusCell par ActionCell
export const ActionCell = styled.div`
  padding: ${theme.spacing.md};
  text-align: center;
  display: flex;
  justify-content: center;
`;

// Si StatusCell est encore utilisé ailleurs, conserver cette définition
export const StatusCell = styled.div`
  padding: ${theme.spacing.md};
  text-align: center;
  display: flex;
  justify-content: center;
`;

export const StatusBadgeMatch = styled.span<{ $status: 'completed' | 'pending' }>`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: ${props => {
    switch (props.$status) {
      case 'completed': return theme.colors.status.success;
      case 'pending': return theme.colors.status.warning;
      default: return theme.colors.neutral.gray500;
    }
  }};
  color: ${theme.colors.text.light};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.xs};
    font-size: ${theme.typography.fontSize.xs};
  }
`;

export const ScoreInput = styled.input`
  width: 60px;
  padding: ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.md};
  font-weight: ${theme.typography.fontWeight.semibold};
  text-align: center;
  border: 1px solid ${theme.colors.border.medium};
  border-radius: ${theme.borderRadius.md};
  background-color: ${theme.colors.background.card};
  transition: all ${theme.transitions.fast};
  
  &:focus {
    border-color: ${theme.colors.primary.main};
    outline: 2px solid ${theme.colors.primary.main}20;
    outline-offset: 0;
    box-shadow: ${theme.shadows.sm};
  }
`;

export const UpdateScoreButton = styled.button`
  background: linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.primary.light});
  color: ${theme.colors.text.light};
  border: none;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  box-shadow: ${theme.shadows.sm};
  
  &:hover {
    background: linear-gradient(135deg, ${theme.colors.primary.dark}, ${theme.colors.primary.main});
    box-shadow: ${theme.shadows.md};
  }
`;

export const EditScoreButton = styled.button`
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  background-color: ${theme.colors.accent.main};
  color: ${theme.colors.text.light};
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.fontWeight.medium};
  font-size: ${theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background-color: ${theme.colors.accent.light};
    transform: translateY(-1px);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.md};
`;

export const EditPairsButton = styled.button`
  background: transparent;
  color: ${theme.colors.primary.main};
  border: 1px solid ${theme.colors.primary.main};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background-color: ${theme.colors.primary.main}10;
  }
`;

export const CancelButton = styled.button`
  background: transparent;
  color: ${theme.colors.status.error};
  border: 1px solid ${theme.colors.status.error};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background-color: ${theme.colors.status.error}10;
  }
`;

export const StartTournamentButton = styled.button`
  background: linear-gradient(135deg, ${theme.colors.status.success}, ${theme.colors.status.success}80);
  color: ${theme.colors.text.light};
  border: none;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  font-size: ${theme.typography.fontSize.md};
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: pointer;
  margin-top: ${theme.spacing.md};
  transition: all ${theme.transitions.normal};
  box-shadow: ${theme.shadows.sm};

  &:hover {
    box-shadow: ${theme.shadows.md};
    transform: translateY(-2px);
  }
`;

export const CompleteTournamentButton = styled(StartTournamentButton)`
  background: linear-gradient(135deg, ${theme.colors.status.warning}, ${theme.colors.status.warning}80);
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContainer = styled.div`
  background-color: white;
  border-radius: ${theme.borderRadius.lg};
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  border-bottom: 1px solid ${theme.colors.neutral.gray200};
`;

export const ModalTitle = styled.h3`
  margin: 0;
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.primary.main};
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${theme.colors.text.secondary};
  &:hover {
    color: ${theme.colors.text.primary};
  }
`;

export const ModalContent = styled.div`
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  overflow-y: auto;
  max-height: 60vh;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  border-top: 1px solid ${theme.colors.neutral.gray200};
  gap: ${theme.spacing.md};
`;

export const PairsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const PairItem = styled.li`
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.neutral.gray100};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.md};

  &:last-child {
    border-bottom: none;
  }
`;