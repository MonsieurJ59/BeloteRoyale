import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { theme } from './theme';

// Conteneur principal de la page
export const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.lg};
  }
`;

// Lien de retour
export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: ${theme.colors.primary.main};
  text-decoration: none;
  margin-bottom: ${theme.spacing.xl};
  font-weight: ${theme.typography.fontWeight.medium};
  transition: all ${theme.transitions.fast};
  
  &:hover {
    text-decoration: underline;
    color: ${theme.colors.primary.light};
  }
  
  &:before {
    content: '←';
    margin-right: ${theme.spacing.sm};
    font-size: ${theme.typography.fontSize.lg};
  }
`;

// Style de l'en-tête
export const Header = styled.header`
  margin-bottom: ${theme.spacing.xxxl};
`;

// Style du titre principal
export const Title = styled.h1`
  font-family: ${theme.typography.fontFamily.heading};
  font-size: ${theme.typography.fontSize['4xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.md};
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize['3xl']};
  }
`;

// Informations du tournoi
export const TournamentInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${theme.spacing.md};
  }
`;

// Date du tournoi
export const TournamentDate = styled.p`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  margin-right: ${theme.spacing.xl};
  font-weight: ${theme.typography.fontWeight.medium};
  
  @media (max-width: ${theme.breakpoints.md}) {
    margin-right: 0;
  }
`;

// Statut du tournoi
export const TournamentStatus = styled.span<{ status: string }>`
  display: inline-block;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: ${({ status }) => {
    switch (status) {
      case 'in_progress':
        return theme.colors.status.info + '20';
      case 'upcoming':
        return theme.colors.status.success + '20';
      case 'completed':
        return theme.colors.neutral.gray200;
      default:
        return theme.colors.neutral.gray200;
    }
  }};
  color: ${({ status }) => {
    switch (status) {
      case 'in_progress':
        return theme.colors.status.info;
      case 'upcoming':
        return theme.colors.status.success;
      case 'completed':
        return theme.colors.text.secondary;
      default:
        return theme.colors.text.secondary;
    }
  }};
`;

// Titre de section
export const SectionTitle = styled.h2`
  font-family: ${theme.typography.fontFamily.heading};
  color: ${theme.colors.text.primary};
  margin: ${theme.spacing.xxxl} 0 ${theme.spacing.xl} 0;
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.semibold};
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize.xl};
    margin: ${theme.spacing.xxl} 0 ${theme.spacing.lg} 0;
    flex-direction: column;
    gap: ${theme.spacing.md};
    align-items: stretch;
  }
`;

// Bouton de génération
export const GenerateButton = styled.button`
  background: linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.primary.light});
  color: ${theme.colors.text.light};
  border: none;
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  transition: all ${theme.transitions.normal};
  box-shadow: ${theme.shadows.sm};
  
  &:hover {
    background: linear-gradient(135deg, ${theme.colors.primary.light}, ${theme.colors.primary.main});
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    width: 100%;
  }
`;

// Message d'absence de données
export const NoDataMessage = styled.p`
  text-align: center;
  color: ${theme.colors.text.secondary};
  font-style: italic;
  margin: ${theme.spacing.xl} 0;
  padding: ${theme.spacing.xxl};
  background-color: ${theme.colors.neutral.gray50};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.light};
`;

// Grille des matchs
export const MatchesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xxxl};
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

// Carte de match
export const MatchCard = styled.div`
  background-color: ${theme.colors.background.card};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  padding: ${theme.spacing.xl};
  display: flex;
  flex-direction: column;
  transition: all ${theme.transitions.normal};
  border: 1px solid ${theme.colors.border.light};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${theme.colors.primary.main}, ${theme.colors.secondary.main});
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.lg};
    border-color: ${theme.colors.accent.main};
  }
`;

// En-tête du match
export const MatchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;

// Type de match
export const MatchType = styled.span<{ isPrelim: boolean }>`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: ${({ isPrelim }) => isPrelim ? theme.colors.accent.lighter : theme.colors.status.success + '20'};
  color: ${({ isPrelim }) => isPrelim ? theme.colors.accent.dark : theme.colors.status.success};
`;

// Conteneur des équipes
export const TeamsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;

// Nom d'équipe
export const TeamName = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.primary};
  flex: 1;
  text-align: center;
`;

// Texte "VS"
export const VersusText = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.muted};
  margin: 0 ${theme.spacing.md};
  background-color: ${theme.colors.neutral.gray100};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
`;

// Conteneur des scores
export const ScoreContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, ${theme.colors.neutral.gray50}, ${theme.colors.neutral.gray100});
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
  border: 1px solid ${theme.colors.border.light};
`;

// Score
export const Score = styled.div<{ isWinner?: boolean }>`
  font-family: ${theme.typography.fontFamily.heading};
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${({ isWinner }) => isWinner ? theme.typography.fontWeight.bold : theme.typography.fontWeight.medium};
  color: ${({ isWinner }) => isWinner ? theme.colors.status.success : theme.colors.text.primary};
  flex: 1;
  text-align: center;
  ${({ isWinner }) => isWinner && `
    text-shadow: 0 0 10px ${theme.colors.status.success}40;
  `}
`;

// Champ de saisie de score
export const ScoreInput = styled.input`
  width: 70px;
  padding: ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.lg};
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

// Bouton de mise à jour du score
export const UpdateScoreButton = styled.button`
  background: linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.primary.light});
  color: ${theme.colors.text.light};
  border: none;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  margin-top: ${theme.spacing.md};
  transition: all ${theme.transitions.normal};
  box-shadow: ${theme.shadows.sm};
  
  &:hover {
    background: linear-gradient(135deg, ${theme.colors.primary.light}, ${theme.colors.primary.main});
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.md};
  }
`;

// Tableau des classements
export const RankingsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: ${theme.spacing.xxxl};
  background-color: ${theme.colors.background.card};
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.border.light};
  
  th, td {
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    text-align: left;
    border-bottom: 1px solid ${theme.colors.border.light};
  }
  
  th {
    background: linear-gradient(135deg, ${theme.colors.neutral.gray50}, ${theme.colors.neutral.gray100});
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.primary};
    font-size: ${theme.typography.fontSize.sm};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  tr:hover {
    background-color: ${theme.colors.neutral.gray50};
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
`;

// Message de chargement
export const LoadingMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxxl};
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  background-color: ${theme.colors.neutral.gray50};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.light};
`;

// Message d'erreur
export const ErrorMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxxl};
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.status.error};
  background-color: ${theme.colors.status.error}20;
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.status.error}40;
  margin-bottom: ${theme.spacing.xl};
`;