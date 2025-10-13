import styled from 'styled-components';
import { theme } from './theme';
import type { Tournament } from '../types/api';
import { media } from './responsive';

export const PageContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
  
  ${media.xs`
    padding: ${theme.spacing.md};
  `}
`;

export const LoadingMessage = styled.div`
  text-align: center;
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  margin: ${theme.spacing.xxl} 0;
  padding: ${theme.spacing.xl};
  background-color: ${theme.colors.neutral.gray50};
  border-radius: ${theme.borderRadius.lg};
  
  ${media.xs`
    margin: ${theme.spacing.xl} 0;
    padding: ${theme.spacing.lg};
    font-size: ${theme.typography.fontSize.md};
  `}
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
  
  ${media.xs`
    margin: ${theme.spacing.xl} 0;
    padding: ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.md};
  `}
`;

export const TournamentHeader = styled.div`
  background: linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.accent.main});
  color: ${theme.colors.text.light};
  padding: ${theme.spacing.xxl};
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing.xxl};
  box-shadow: ${theme.shadows.lg};
  
  ${media.xs`
    padding: ${theme.spacing.lg};
    margin-bottom: ${theme.spacing.xl};
    border-radius: ${theme.borderRadius.md};
  `}
`;

export const TournamentTitle = styled.h1`
  font-family: ${theme.typography.fontFamily.heading};
  font-size: ${theme.typography.fontSize['4xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
  
  ${media.xs`
    font-size: ${theme.typography.fontSize['2xl']};
    margin-bottom: ${theme.spacing.md};
  `}
`;

export const TournamentInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${theme.spacing.lg};
  
  ${media.xs`
    gap: ${theme.spacing.md};
    flex-direction: column;
    align-items: center;
  `}
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  
  ${media.xs`
    margin-bottom: ${theme.spacing.sm};
  `}
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
  
  ${media.xs`
    margin-bottom: ${theme.spacing.xl};
  `}
`;

export const ActionsSection = styled.section`
  margin-bottom: ${theme.spacing.xxl};
  background: ${theme.colors.background.card};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.light};
  box-shadow: ${theme.shadows.sm};
  padding: ${theme.spacing.xl};
  
  ${media.xs`
    margin-bottom: ${theme.spacing.xl};
    padding: ${theme.spacing.lg};
    border-radius: ${theme.borderRadius.md};
  `}
`;

export const ActionMessage = styled.p`
  text-align: center;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.md};
  
  ${media.xs`
    font-size: ${theme.typography.fontSize.sm};
  `}
`;

export const SuggestedList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 ${theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${theme.spacing.sm};
  
  ${media.xs`
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  `}

  li {
    background: ${theme.colors.neutral.gray50};
    border: 1px solid ${theme.colors.border.light};
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing.md};
    text-align: center;
    
    ${media.xs`
      padding: ${theme.spacing.sm};
      font-size: ${theme.typography.fontSize.sm};
    `}
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
  
  ${media.xs`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.sm};
  `}
`;

export const SectionTitle = styled.h2`
  font-family: ${theme.typography.fontFamily.heading};
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xl};
  text-align: center;
  
  ${media.xs`
    font-size: ${theme.typography.fontSize.xl};
    margin-bottom: ${theme.spacing.lg};
  `}
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
  
  ${media.xs`
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: ${theme.spacing.md};
  `}
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
  
  ${media.xs`
    padding: ${theme.spacing.md};
    border-radius: ${theme.borderRadius.md};
  `}
`;

export const StatNumber = styled.div`
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary.main};
  margin-bottom: ${theme.spacing.sm};
  
  ${media.xs`
    font-size: ${theme.typography.fontSize['2xl']};
  `}
`;

export const StatLabel = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.fontWeight.medium};
  
  ${media.xs`
    font-size: ${theme.typography.fontSize.xs};
  `}
`;

export const RankingSection = styled.section`
  margin-bottom: ${theme.spacing.xxl};
  
  ${media.xs`
    margin-bottom: ${theme.spacing.xl};
  `}
`;

export const EmptyMessage = styled.div`
  text-align: center;
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  padding: ${theme.spacing.xxl};
  background-color: ${theme.colors.neutral.gray50};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.light};
  
  ${media.xs`
    font-size: ${theme.typography.fontSize.md};
    padding: ${theme.spacing.xl};
  `}
`;

export const RankingTable = styled.div`
  background: ${theme.colors.background.card};
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.border.light};
  
  ${media.xs`
    border-radius: ${theme.borderRadius.md};
    overflow-x: auto;
  `}
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 200px 100px 100px 150px;
  background: ${theme.colors.primary.main};
  color: ${theme.colors.text.light};
  font-weight: ${theme.typography.fontWeight.semibold};
  
  ${media.mobile`
    grid-template-columns: 60px 1fr 80px 80px 100px;
    font-size: ${theme.typography.fontSize.sm};
  `}
`;

export const HeaderCell = styled.div`
  padding: ${theme.spacing.lg};
  text-align: center;
  
  ${media.mobile`
    padding: ${theme.spacing.md} ${theme.spacing.sm};

    &:nth-child(3) {
      display: none; // Masquer la colonne joueurs sur mobile
    }
  `}
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
  
  ${media.mobile`
    grid-template-columns: 60px 1fr 80px 80px 100px;
  `}
`;

export const MatchesSection = styled.section`
  margin-bottom: ${theme.spacing.xxl};
  
  ${media.xs`
    margin-bottom: ${theme.spacing.xl};
  `}
`;

export const MatchesByType = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
  
  ${media.xs`
    gap: ${theme.spacing.lg};
  `}
`;

export const MatchTypeSection = styled.div`
  background: ${theme.colors.background.card};
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.border.light};
  
  ${media.xs`
    border-radius: ${theme.borderRadius.md};
  `}
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
  
  ${media.xs`
    font-size: ${theme.typography.fontSize.lg};
    padding: ${theme.spacing.md};
  `}
`;

export const MatchesTable = styled.div`
  overflow-x: auto;
`;

export const MatchesTableHeader = styled.div`
  background: ${theme.colors.neutral.gray100};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  
  ${media.mobile`
    font-size: ${theme.typography.fontSize.sm};
  `}
`;

export const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px 1fr 100px;
  
  ${media.mobile`
    grid-template-columns: 1fr 80px 1fr 60px;
  `}
`;

export const MatchesTableBody = styled.div``;

export const MatchRow = styled.div<{ $status?: 'completed' | 'in_progress' }>`
  display: grid;
  grid-template-columns: 1fr 120px 1fr 100px;
  align-items: center;
  padding: ${theme.spacing.sm} 0;
  transition: all ${theme.transitions.fast};
  
  ${media.mobile`
    grid-template-columns: 1fr 80px 1fr 60px;
  `}
  
  &:hover {
    background-color: ${theme.colors.neutral.gray100};
  }
  
  background-color: ${props => 
    props.$status === 'completed' 
      ? `${theme.colors.status.success}10` 
      : props.$status === 'in_progress'
        ? `${theme.colors.primary.main}10`
        : 'transparent'
  };
  
  border-left: 4px solid ${props => 
    props.$status === 'completed' 
      ? theme.colors.status.success
      : props.$status === 'in_progress'
        ? theme.colors.primary.main
        : 'transparent'
  };
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
  padding: ${theme.spacing.md};
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
  
  ${media.xs`
    width: 95%;
    max-height: 95vh;
    border-radius: ${theme.borderRadius.md};
  `}
`;

export const ModalContent = styled.div`
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  overflow-y: auto;
  max-height: 60vh;
  
  ${media.xs`
    padding: ${theme.spacing.md};
    max-height: 70vh;
  `}
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  border-bottom: 1px solid ${theme.colors.neutral.gray200};
  
  ${media.xs`
    padding: ${theme.spacing.md};
  `}
`;

export const ModalTitle = styled.h3`
  margin: 0;
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.primary.main};
  
  ${media.xs`
    font-size: ${theme.typography.fontSize.md};
  `}
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  border-top: 1px solid ${theme.colors.neutral.gray200};
  gap: ${theme.spacing.md};
  
  ${media.xs`
    padding: ${theme.spacing.md};
    flex-wrap: wrap;
    gap: ${theme.spacing.sm};
  `}
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
  
  ${media.xs`
    padding: ${theme.spacing.sm};
    font-size: ${theme.typography.fontSize.sm};
    flex-direction: column;
  `}
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${theme.typography.fontSize['2xl']};
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  padding: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.sm};
  transition: all ${theme.transitions.fast};

  &:hover {
    background-color: ${theme.colors.neutral.gray100};
  }
`;

export const TeamName = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.md};
  
  ${media.xs`
    font-size: ${theme.typography.fontSize.sm};
  `}
`;

export const PlayersCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

export const PlayerName = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  
  ${media.xs`
    font-size: ${theme.typography.fontSize.xs};
  `}
`;

export const RankCell = styled.td`
  padding: ${theme.spacing.md};
  text-align: center;
  font-weight: ${theme.typography.fontWeight.semibold};
  
  ${media.xs`
    padding: ${theme.spacing.sm};
  `}
`;

export const TeamCell = styled.td`
  padding: ${theme.spacing.md};
  
  ${media.xs`
    padding: ${theme.spacing.sm};
  `}
`;

export const StatCell = styled.td`
  padding: ${theme.spacing.md};
  text-align: center;
  
  ${media.xs`
    padding: ${theme.spacing.sm};
    font-size: ${theme.typography.fontSize.sm};
  `}
`;

export const MatchCell = styled.td`
  padding: ${theme.spacing.md};
  text-align: center;
  
  ${media.xs`
    padding: ${theme.spacing.sm};
  `}
`;

export const TeamMatchCell = styled.td`
  padding: ${theme.spacing.md};
  
  ${media.xs`
    padding: ${theme.spacing.sm};
  `}
`;

export const TeamMatchName = styled.div`
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.primary};
  
  ${media.xs`
    font-size: ${theme.typography.fontSize.sm};
  `}
`;

export const ScoreCell = styled.td`
  padding: ${theme.spacing.md};
  text-align: center;
  
  ${media.xs`
    padding: ${theme.spacing.sm};
  `}
`;

export const Score = styled.div<{ isWinner?: boolean }>`
  font-weight: ${props => props.isWinner ? theme.typography.fontWeight.bold : theme.typography.fontWeight.normal};
  color: ${props => props.isWinner ? theme.colors.primary.main : theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.lg};
  
  ${media.xs`
    font-size: ${theme.typography.fontSize.md};
  `}
`;

export const ScoreSeparator = styled.span`
  margin: 0 ${theme.spacing.xs};
  color: ${theme.colors.text.secondary};
`;

export const StatusCell = styled.td`
  padding: ${theme.spacing.md};
  text-align: center;
  
  ${media.xs`
    padding: ${theme.spacing.sm};
  `}
`;

export const StatusBadgeMatch = styled.span<{ status: string }>`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  background-color: ${props => {
    switch (props.status) {
      case 'completed': return theme.colors.status.success;
      case 'in_progress': return theme.colors.status.warning;
      default: return theme.colors.neutral.gray200;
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'completed': return theme.colors.neutral.white;
      case 'in_progress': return theme.colors.neutral.white;
      default: return theme.colors.text.secondary;
    }
  }};
  
  ${media.xs`
    font-size: ${theme.typography.fontSize.xs};
    padding: ${theme.spacing.xs};
  `}
`;

export const ScoreInput = styled.input`
  width: 60px;
  padding: ${theme.spacing.xs};
  border: 1px solid ${theme.colors.neutral.gray300};
  border-radius: ${theme.borderRadius.sm};
  text-align: center;
  font-size: ${theme.typography.fontSize.sm};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.main};
  }
  
  ${media.xs`
    width: 50px;
    font-size: ${theme.typography.fontSize.xs};
  `}
`;

export const UpdateScoreButton = styled.button`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background-color: ${theme.colors.primary.main};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background-color: ${theme.colors.primary.dark};
  }
  
  ${media.xs`
    padding: ${theme.spacing.xs};
    font-size: ${theme.typography.fontSize.xs};
  `}
`;

export const EditScoreButton = styled.button`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background-color: ${theme.colors.status.warning};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background-color: ${theme.colors.accent.dark};
  }
  
  ${media.xs`
    padding: ${theme.spacing.xs};
    font-size: ${theme.typography.fontSize.xs};
  `}
`;

export const EditPairsButton = styled.button`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background-color: ${theme.colors.status.warning};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background-color: ${theme.colors.accent.dark};
  }
  
  ${media.xs`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.sm};
  `}
`;

export const StartTournamentButton = styled.button`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background-color: ${theme.colors.status.success};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background-color: ${theme.colors.primary.dark};
  }
  
  ${media.xs`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.sm};
  `}
`;

export const CompleteTournamentButton = styled.button`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background-color: ${theme.colors.primary.main};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background-color: ${theme.colors.primary.dark};
  }
  
  ${media.xs`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.sm};
  `}
`;

export const CancelPhaseButton = styled.button`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background-color: ${theme.colors.status.error};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background-color: ${theme.colors.secondary.dark};
  }

  ${media.xs`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.sm};
  `}
`;

export const ActionCell = styled.td`
  padding: ${theme.spacing.md};
  text-align: center;

  ${media.xs`
    padding: ${theme.spacing.sm};
  `}
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: center;
  align-items: center;

  ${media.xs`
    flex-direction: column;
    gap: ${theme.spacing.sm};
  `}
`;

export const CancelButton = styled.button`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.fontWeight.medium};
  font-size: ${theme.typography.fontSize.base};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  border: none;
  background-color: ${theme.colors.neutral.gray200};
  color: ${theme.colors.text.secondary};

  &:hover {
    background-color: ${theme.colors.neutral.gray300};
  }

  ${media.xs`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.sm};
  `}
`;