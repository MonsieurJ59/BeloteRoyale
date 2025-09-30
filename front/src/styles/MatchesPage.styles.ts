import styled from 'styled-components';
import { theme } from './theme';

// Conteneur principal de la page
export const PageContainer = styled.div`
  width: 100%;
`;

// Style de l'en-tête
export const Header = styled.header`
  margin-bottom: ${theme.spacing.xxxl};
  text-align: center;
`;

// Style du titre principal
export const Title = styled.h1`
  font-family: ${theme.typography.fontFamily.heading};
  font-size: ${theme.typography.fontSize['4xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.lg};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -${theme.spacing.sm};
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, ${theme.colors.accent.main}, ${theme.colors.accent.light});
    border-radius: ${theme.borderRadius.sm};
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize['3xl']};
  }
`;

// Style du sous-titre
export const Subtitle = styled.p`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  max-width: 600px;
  margin: 0 auto;
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize.base};
  }
`;

// Style du conteneur des filtres
export const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xxl};
  background: linear-gradient(135deg, ${theme.colors.background.card}, ${theme.colors.neutral.gray50});
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.border.light};
  
  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

// Style des groupes de filtres
export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 220px;
`;

// Style des labels de filtres
export const FilterLabel = styled.label`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs};
  font-weight: ${theme.typography.fontWeight.medium};
`;

// Style des sélecteurs de filtres
export const FilterSelect = styled.select`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border.medium};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.base};
  background-color: ${theme.colors.background.card};
  transition: all ${theme.transitions.fast};
  
  &:focus {
    border-color: ${theme.colors.primary.main};
    outline: 2px solid ${theme.colors.primary.main}20;
    outline-offset: 0;
    box-shadow: ${theme.shadows.sm};
  }
`;

// Style de la grille des matchs
export const MatchesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

// Style des cartes de match
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

// Style de l'en-tête du match
export const MatchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
  margin-top: ${theme.spacing.sm};
`;

// Style du nom du tournoi
export const TournamentName = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.fontWeight.medium};
`;

// Style du type de match
export const MatchType = styled.span<{ isPrelim: boolean }>`
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: ${({ isPrelim }) => isPrelim ? theme.colors.accent.lighter : theme.colors.status.success + '20'};
  color: ${({ isPrelim }) => isPrelim ? theme.colors.accent.dark : theme.colors.status.success};
`;

// Style du conteneur des équipes
export const TeamsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;

// Style du nom d'équipe
export const TeamName = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.primary};
  flex: 1;
  text-align: center;
`;

// Style du texte "VS"
export const VersusText = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.muted};
  margin: 0 ${theme.spacing.md};
  background-color: ${theme.colors.neutral.gray100};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
`;

// Style du conteneur des scores
export const ScoreContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, ${theme.colors.neutral.gray50}, ${theme.colors.neutral.gray100});
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
  border: 1px solid ${theme.colors.border.light};
`;

// Style des scores
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

// Style des champs de saisie de score
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

// Style du bouton de mise à jour du score
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

// Style du message de chargement
export const LoadingMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxxl};
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  background-color: ${theme.colors.neutral.gray50};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.light};
`;

// Style des messages d'erreur
export const ErrorMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.status.error};
  background-color: ${theme.colors.status.error}20;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.status.error}40;
  margin-bottom: ${theme.spacing.lg};
`;

// Style de l'état vide
export const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxxl};
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  background-color: ${theme.colors.neutral.gray50};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.light};
`;