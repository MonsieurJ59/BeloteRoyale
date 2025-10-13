import { css } from 'styled-components';
import { theme } from './theme';

// Media queries pour différentes tailles d'écran
export const media = {
  // Mobile first - styles pour les petits écrans
  sm: (styles: TemplateStringsArray, ...args: any[]) => css`
    @media (min-width: ${theme.breakpoints.sm}) {
      ${css(styles, ...args)}
    }
  `,
  md: (styles: TemplateStringsArray, ...args: any[]) => css`
    @media (min-width: ${theme.breakpoints.md}) {
      ${css(styles, ...args)}
    }
  `,
  lg: (styles: TemplateStringsArray, ...args: any[]) => css`
    @media (min-width: ${theme.breakpoints.lg}) {
      ${css(styles, ...args)}
    }
  `,
  xl: (styles: TemplateStringsArray, ...args: any[]) => css`
    @media (min-width: ${theme.breakpoints.xl}) {
      ${css(styles, ...args)}
    }
  `,
  // Pour les écrans très petits (téléphones)
  xs: (styles: TemplateStringsArray, ...args: any[]) => css`
    @media (max-width: ${theme.breakpoints.sm}) {
      ${css(styles, ...args)}
    }
  `,
  // Pour les tablettes en mode portrait
  tablet: (styles: TemplateStringsArray, ...args: any[]) => css`
    @media (min-width: ${theme.breakpoints.sm}) and (max-width: ${theme.breakpoints.lg}) {
      ${css(styles, ...args)}
    }
  `,
  // Pour les appareils mobiles (téléphones et tablettes)
  mobile: (styles: TemplateStringsArray, ...args: any[]) => css`
    @media (max-width: ${theme.breakpoints.lg}) {
      ${css(styles, ...args)}
    }
  `,
  // Pour l'orientation paysage sur mobile
  landscape: (styles: TemplateStringsArray, ...args: any[]) => css`
    @media (max-width: ${theme.breakpoints.lg}) and (orientation: landscape) {
      ${css(styles, ...args)}
    }
  `,
};

// Styles responsives réutilisables
export const responsiveStyles = {
  // Conteneur flexible qui s'adapte à différentes tailles d'écran
  flexContainer: css`
    display: flex;
    flex-direction: column;
    
    ${media.md`
      flex-direction: row;
    `}
  `,
  
  // Grille responsive qui s'adapte automatiquement
  responsiveGrid: css`
    display: grid;
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
    
    ${media.sm`
      grid-template-columns: repeat(2, 1fr);
    `}
    
    ${media.lg`
      grid-template-columns: repeat(3, 1fr);
    `}
    
    ${media.xl`
      grid-template-columns: repeat(4, 1fr);
    `}
  `,
  
  // Texte responsive qui s'adapte à la taille de l'écran
  responsiveText: css`
    font-size: ${theme.typography.fontSize.base};
    
    ${media.xs`
      font-size: ${theme.typography.fontSize.sm};
    `}
    
    ${media.lg`
      font-size: ${theme.typography.fontSize.lg};
    `}
  `,
  
  // Bouton responsive qui s'adapte à la taille de l'écran
  responsiveButton: css`
    width: 100%;
    padding: ${theme.spacing.md};
    
    ${media.md`
      width: auto;
    `}
  `,
  
  // Masquer des éléments sur mobile
  hideOnMobile: css`
    display: none;
    
    ${media.md`
      display: block;
    `}
  `,
  
  // Afficher uniquement sur mobile
  showOnlyOnMobile: css`
    display: block;
    
    ${media.md`
      display: none;
    `}
  `,
};

// Utilitaires pour la navigation mobile
export const mobileNavigation = {
  // Styles pour le menu hamburger
  hamburgerMenu: css`
    display: block;
    position: fixed;
    top: ${theme.spacing.md};
    right: ${theme.spacing.md};
    z-index: ${theme.zIndex.fixed + 1};
    
    ${media.lg`
      display: none;
    `}
  `,
  
  // Styles pour le menu mobile
  mobileMenu: css`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: ${theme.colors.background.sidebar};
    z-index: ${theme.zIndex.fixed};
    transform: translateX(-100%);
    transition: transform ${theme.transitions.normal};
    
    &.open {
      transform: translateX(0);
    }
    
    ${media.lg`
      display: none;
    `}
  `,
};