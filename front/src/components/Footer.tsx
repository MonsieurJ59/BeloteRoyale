// Importation des modules nécessaires
import {
  FooterContainer,
  FooterContent,
  FooterSection,
  FooterTitle,
  FooterLink,
  FooterText,
  Copyright
} from '../styles/Footer.styles.ts';

// Composant principal du pied de page
const Footer = () => {
  // Obtention de l'année courante pour le copyright
  const currentYear = new Date().getFullYear();
  
  // Rendu du composant
  return (
    <FooterContainer>
      <FooterContent>
        {/* Section d'information sur l'application */}
        <FooterSection>
          <FooterTitle>Belote Royale</FooterTitle>
          <FooterText>
            Plateforme de gestion de tournois de belote pour les passionnés.
            Organisez, suivez et profitez de vos tournois en toute simplicité.
          </FooterText>
        </FooterSection>
        
        {/* Section des liens de navigation */}
        <FooterSection>
          <FooterTitle>Navigation</FooterTitle>
          <FooterLink to="/">Accueil</FooterLink>
          <FooterLink to="/tournaments">Tournois</FooterLink>
          <FooterLink to="/teams">Équipes</FooterLink>
          <FooterLink to="/matches">Matchs</FooterLink>
        </FooterSection>
        
        {/* Section des ressources */}
        <FooterSection>
          <FooterTitle>Ressources</FooterTitle>
          <FooterLink to="#">Règles de la belote</FooterLink>
          <FooterLink to="#">Guide d'organisation</FooterLink>
          <FooterLink to="#">FAQ</FooterLink>
        </FooterSection>
      </FooterContent>
      
      {/* Section de copyright */}
      <Copyright>
        © {currentYear} Belote Royale. Tous droits réservés.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;