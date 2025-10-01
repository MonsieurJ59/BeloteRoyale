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

// Style de la grille d'équipes (responsive)
export const TeamsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xxxl};
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

// Style des cartes d'équipe
export const TeamCard = styled.div`
  background-color: ${theme.colors.background.card};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  padding: ${theme.spacing.xl};
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
    background: linear-gradient(90deg, ${theme.colors.secondary.main}, ${theme.colors.accent.main});
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${theme.shadows.lg};
    border-color: ${theme.colors.accent.main};
  }
`;

// Style du nom de l'équipe
export const TeamName = styled.h3`
  font-family: ${theme.typography.fontFamily.heading};
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.text.primary};
  text-align: center;
  border-bottom: 1px solid ${theme.colors.border.light};
  padding-bottom: ${theme.spacing.md};
  margin-top: ${theme.spacing.sm};
`;

// Style de la liste des joueurs
export const PlayersList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

// Style des éléments de la liste des joueurs
export const PlayerItem = styled.li`
  padding: ${theme.spacing.sm} 0;
  display: flex;
  align-items: center;
  transition: all ${theme.transitions.fast};
  
  &:not(:last-child) {
    border-bottom: 1px dashed ${theme.colors.border.light};
  }
  
  &:hover {
    background-color: ${theme.colors.neutral.gray50};
    border-radius: ${theme.borderRadius.sm};
    padding-left: ${theme.spacing.sm};
    margin: 0 -${theme.spacing.sm};
  }
`;

// Style de l'icône du joueur
export const PlayerIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.primary.light});
  color: ${theme.colors.text.light};
  border-radius: ${theme.borderRadius.full};
  margin-right: ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  box-shadow: ${theme.shadows.sm};
`;

// Style du nom du joueur
export const PlayerName = styled.span`
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.primary};
`;

// Style du conteneur du formulaire
export const FormContainer = styled.div`
  background: linear-gradient(135deg, ${theme.colors.background.card}, ${theme.colors.neutral.gray50});
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.md};
  padding: ${theme.spacing.xxl};
  margin-bottom: ${theme.spacing.xxxl};
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
    background: linear-gradient(90deg, ${theme.colors.accent.main}, ${theme.colors.accent.light});
  }
`;

// Style du titre du formulaire
export const FormTitle = styled.h2`
  font-family: ${theme.typography.fontFamily.heading};
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xl};
  margin-top: ${theme.spacing.sm};
  text-align: center;
`;

// Style du formulaire
export const Form = styled.form`
  display: grid;
  gap: ${theme.spacing.lg};
  
  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr 1fr;
  }
`;

// Style des groupes de champs du formulaire
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (min-width: ${theme.breakpoints.md}) {
    &:first-child {
      grid-column: 1 / -1;
    }
  }
`;

// Style des labels
export const Label = styled.label`
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.sm};
`;

// Style des champs de saisie
export const Input = styled.input`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border.medium};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.base};
  transition: all ${theme.transitions.fast};
  background-color: ${theme.colors.background.card};
  
  &:focus {
    border-color: ${theme.colors.primary.main};
    outline: 2px solid ${theme.colors.primary.main}20;
    outline-offset: 0;
    box-shadow: ${theme.shadows.sm};
  }
  
  &::placeholder {
    color: ${theme.colors.text.muted};
  }
`;

// Style du bouton de soumission
export const SubmitButton = styled.button`
  grid-column: 1 / -1;
  background: linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.primary.light});
  color: ${theme.colors.text.light};
  border: none;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  box-shadow: ${theme.shadows.sm};
  
  &:hover {
    background: linear-gradient(135deg, ${theme.colors.primary.light}, ${theme.colors.primary.main});
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }
  
  &:disabled {
    background: ${theme.colors.neutral.gray400};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
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
  padding: ${theme.spacing.lg};
  font-size: ${theme.typography.fontSize.base};
  color: ${theme.colors.status.error};
  background-color: ${theme.colors.status.error}20;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.status.error}40;
  margin-bottom: ${theme.spacing.lg};
`;

// Style des messages de succès
export const SuccessMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing.lg};
  font-size: ${theme.typography.fontSize.base};
  color: ${theme.colors.status.success};
  background-color: ${theme.colors.status.success}20;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.status.success}40;
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

// Ajouter à la fin du fichier

// Style des boutons d'action
export const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.xs};
  margin-top: ${theme.spacing.md};
`;

export const ActionButton = styled.button<{ $variant?: 'edit' | 'delete' }>`
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
    : props.$variant === 'delete' 
      ? theme.colors.status.error + '20'
      : theme.colors.neutral.gray200};

  color: ${props => props.$variant === 'edit' 
    ? theme.colors.status.info 
    : props.$variant === 'delete' 
      ? theme.colors.status.error
      : theme.colors.text.secondary};

  &:hover:not(:disabled) {
    background-color: ${props => props.$variant === 'edit' 
      ? theme.colors.status.info + '30' 
      : props.$variant === 'delete' 
        ? theme.colors.status.error + '30'
        : theme.colors.neutral.gray300};
    transform: scale(1.1);
  }
`;