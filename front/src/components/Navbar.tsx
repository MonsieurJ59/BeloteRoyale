// Importation des modules nécessaires
import { useState } from 'react'; // Hook React pour gérer l'état local
import { useLocation } from 'react-router-dom'; // Hook de React Router
import {
  NavbarContainer,
  NavbarContent,
  Logo,
  NavLinks,
  NavLink,
  MobileMenuButton
} from '../styles/Navbar.styles.ts';

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