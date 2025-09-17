// Importation des modules nécessaires
import { useState } from 'react'; // Hook React pour gérer l'état local
import { Link, useLocation } from 'react-router-dom'; // Composants et hooks de React Router
import styled from 'styled-components'; // Bibliothèque de styling

// Style du conteneur principal de la barre de navigation
const NavbarContainer = styled.nav`
  background-color: #2c3e50; // Couleur de fond bleu foncé
  color: white; // Texte en blanc
  padding: 0 20px; // Espacement horizontal
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); // Ombre légère
  position: sticky; // Reste visible lors du défilement
  top: 0; // Collé en haut de l'écran
  z-index: 1000; // S'assure que la navbar est au-dessus des autres éléments
`;

// Style du contenu de la barre de navigation
const NavbarContent = styled.div`
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

// Style du logo (utilise le composant Link de react-router-dom)
const Logo = styled(Link)`
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

// Style du conteneur des liens de navigation avec animation pour mobile
const NavLinks = styled.div<{ $isOpen: boolean }>`
  display: flex; // Disposition flexible
  align-items: center; // Centrage vertical
  
  // Adaptation pour les écrans mobiles avec menu déroulant
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

// Style des liens de navigation avec indicateur d'état actif
const NavLink = styled(Link)<{ $active: boolean }>`
  color: white; // Couleur du texte
  text-decoration: none; // Supprime le soulignement du lien
  padding: 10px 15px; // Espacement interne
  margin: 0 5px; // Espacement externe horizontal
  font-weight: 500; // Épaisseur de police (semi-gras)
  position: relative; // Pour positionner l'indicateur d'état actif
  transition: color 0.3s ease; // Animation de changement de couleur
  
  // Effet au survol
  &:hover {
    color: #3498db; // Couleur bleu clair au survol
  }
  
  // Style spécifique pour le lien actif (page courante) - version desktop
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
    
    // Style spécifique pour le lien actif (page courante) - version mobile
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

// Style du bouton de menu hamburger pour mobile
const MobileMenuButton = styled.button`
  display: none; // Caché par défaut sur desktop
  background: none; // Pas de fond
  border: none; // Pas de bordure
  color: white; // Couleur du texte
  font-size: 1.5rem; // Taille de police
  cursor: pointer; // Curseur de type pointeur
  padding: 5px; // Espacement interne
  
  // Visible uniquement sur mobile
  @media (max-width: 768px) {
    display: block; // Affichage en bloc
  }
`;

// Composant principal de la barre de navigation
const Navbar = () => {
  // État local pour gérer l'ouverture/fermeture du menu mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Hook useLocation pour accéder à l'URL actuelle
  const location = useLocation();
  
  // Fonction pour déterminer si un lien est actif (correspond à la page courante)
  const isActive = (path: string) => {
    if (path === '/') {
      // Pour la page d'accueil, vérifier que le chemin est exactement '/'
      return location.pathname === '/';
    }
    // Pour les autres pages, vérifier si le chemin commence par le path donné
    return location.pathname.startsWith(path);
  };
  
  // Fonction pour basculer l'état du menu mobile (ouvert/fermé)
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Fonction pour fermer le menu mobile (utilisée après avoir cliqué sur un lien)
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  // Rendu du composant
  return (
    <NavbarContainer>
      <NavbarContent>
        {/* Logo avec lien vers la page d'accueil */}
        <Logo to="/" onClick={closeMenu}>
          Belote Royale
        </Logo>
        
        {/* Bouton de menu hamburger pour mobile */}
        <MobileMenuButton onClick={toggleMenu}>
          {isMenuOpen ? '✕' : '☰'} {/* Icône qui change selon l'état du menu */}
        </MobileMenuButton>
        
        {/* Liste des liens de navigation */}
        <NavLinks $isOpen={isMenuOpen}>
          {/* Lien vers la page d'accueil */}
          <NavLink to="/" $active={isActive('/')} onClick={closeMenu}>
            Accueil
          </NavLink>
          {/* Lien vers la page des tournois */}
          <NavLink to="/tournaments" $active={isActive('/tournaments')} onClick={closeMenu}>
            Tournois
          </NavLink>
          {/* Lien vers la page des équipes */}
          <NavLink to="/teams" $active={isActive('/teams')} onClick={closeMenu}>
            Équipes
          </NavLink>
          {/* Lien vers la page des matchs - supprimé car les matchs sont maintenant dans les tournois */}
        </NavLinks>
      </NavbarContent>
    </NavbarContainer>
  );
};

export default Navbar;