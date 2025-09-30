import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const NavbarContainer = styled.nav`
  background-color: #2c3e50; // Couleur de fond bleu foncé
  color: white; // Texte en blanc
  padding: 0 20px; // Espacement horizontal
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); // Ombre légère
  position: sticky; // Reste visible lors du défilement
  top: 0; // Collé en haut de l'écran
  z-index: 1000; // S'assure que la navbar est au-dessus des autres éléments
`;

export const NavbarContent = styled.div`
  display: flex; // Disposition flexible
  justify-content: space-between; // Espace entre le logo et les liens
  align-items: center; // Centrage vertical
  max-width: 1200px; // Largeur maximale
  margin: 0 auto; // Centrage horizontal
  height: 70px; // Hauteur fixe
  
  // Adaptation pour les écrans mobiles
  @media (max-width: 768px) {
    height: 60px; // Hauteur réduite sur mobile
  }
`;

export const Logo = styled(Link)`
  font-size: 1.5rem; // Taille de police
  font-weight: 700; // Épaisseur de police (gras)
  color: white; // Couleur du texte
  text-decoration: none; // Supprime le soulignement du lien
  display: flex; // Disposition flexible
  align-items: center; // Centrage vertical
  
  // Adaptation pour les écrans mobiles
  @media (max-width: 768px) {
    font-size: 1.3rem; // Taille de police réduite sur mobile
  }
`;

export const NavLinks = styled.div<{ $isOpen: boolean }>`
  display: flex; // Disposition flexible
  align-items: center; // Centrage vertical
  
  // Adaptation pour les écrans mobiles
  @media (max-width: 768px) {
    position: absolute; // Positionnement absolu pour le menu déroulant
    top: 60px; // Position sous la barre de navigation
    left: 0; // Aligné à gauche
    right: 0; // Aligné à droite (pleine largeur)
    background-color: #2c3e50; // Même couleur de fond que la navbar
    flex-direction: column; // Liens empilés verticalement
    align-items: flex-start; // Alignement à gauche
    padding: 0; // Pas d'espacement interne
    max-height: ${({ $isOpen }) => ($isOpen ? '300px' : '0')}; // Animation d'ouverture/fermeture
    overflow: hidden; // Cache le contenu qui dépasse
    transition: max-height 0.3s ease-in-out; // Animation fluide
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); // Ombre légère
  }
`;

export const NavLink = styled(Link)<{ $active: boolean }>`
  color: white; // Couleur du texte
  text-decoration: none; // Supprime le soulignement du lien
  padding: 10px 15px; // Espacement interne
  margin: 0 5px; // Espacement externe horizontal
  font-weight: 500; // Épaisseur de police (semi-gras)
  position: relative; // Pour positionner l'indicateur d'état actif
  transition: color 0.3s ease; // Animation de changement de couleur
  
  // Effet de survol
  &:hover {
    color: #3498db; // Couleur bleu clair au survol
  }
  
  // Style pour le lien actif
  ${({ $active }) =>
    $active &&
    `
    &::after {
      content: ''; // Contenu vide pour l'élément pseudo
      position: absolute; // Positionnement absolu
      bottom: 0; // Aligné en bas
      left: 15px; // Marge gauche
      right: 15px; // Marge droite
      height: 3px; // Hauteur de la barre
      background-color: #3498db; // Couleur bleu clair
      border-radius: 3px 3px 0 0; // Coins arrondis en haut
    }
  `}
  
  // Adaptation pour les écrans mobiles
  @media (max-width: 768px) {
    width: 100%; // Pleine largeur
    padding: 15px 20px; // Espacement interne plus grand
    margin: 0; // Pas d'espacement externe
    border-bottom: 1px solid rgba(255, 255, 255, 0.1); // Ligne de séparation
    
    // Style pour le lien actif sur mobile
    ${({ $active }) =>
      $active &&
      `
      background-color: rgba(52, 152, 219, 0.2); // Fond bleu clair semi-transparent
      
      &::after {
        display: none; // Cache la barre d'indicateur
      }
    `}
  }
`;

export const MobileMenuButton = styled.button`
  display: none; // Caché par défaut sur desktop
  background: none; // Pas de fond
  border: none; // Pas de bordure
  color: white; // Couleur du texte
  font-size: 1.5rem; // Taille de police
  cursor: pointer; // Curseur de type pointeur
  padding: 5px; // Espacement interne
  
  // Affichage sur mobile uniquement
  @media (max-width: 768px) {
    display: block; // Affichage en bloc
  }
`;