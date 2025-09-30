import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { theme } from './theme';

// Style du conteneur principal du pied de page
export const FooterContainer = styled.footer`
  background-color: ${theme.colors.neutral.gray800};
  color: ${theme.colors.text.light};
  padding: ${theme.spacing.xxxl} ${theme.spacing.xl};
  margin-top: ${theme.spacing.xxxl};
`;

// Style du contenu du pied de page avec disposition en grille
export const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.xxl};
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

// Style des sections du pied de page
export const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

// Style des titres de section
export const FooterTitle = styled.h3`
  font-family: ${theme.typography.fontFamily.heading};
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  margin-bottom: ${theme.spacing.xl};
  color: ${theme.colors.text.light};
`;

// Style des liens de navigation dans le pied de page
export const FooterLink = styled(Link)`
  color: ${theme.colors.text.muted};
  text-decoration: none;
  margin-bottom: ${theme.spacing.sm};
  transition: color ${theme.transitions.fast};
  font-size: ${theme.typography.fontSize.base};
  
  &:hover {
    color: ${theme.colors.primary.light};
  }
`;

// Style du texte descriptif
export const FooterText = styled.p`
  color: ${theme.colors.text.muted};
  margin-bottom: ${theme.spacing.lg};
  line-height: ${theme.typography.lineHeight.relaxed};
  font-size: ${theme.typography.fontSize.base};
`;

// Style de la section copyright
export const Copyright = styled.div`
  text-align: center;
  padding-top: ${theme.spacing.xxl};
  margin-top: ${theme.spacing.xxl};
  border-top: 1px solid ${theme.colors.border.light}40;
  color: ${theme.colors.text.muted};
  font-size: ${theme.typography.fontSize.sm};
`;