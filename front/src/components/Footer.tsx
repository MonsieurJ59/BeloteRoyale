// Importation des modules nécessaires
import styled from 'styled-components'; // Bibliothèque de styling
import { Link } from 'react-router-dom'; // Composant de navigation

// Style du conteneur principal du pied de page
const FooterContainer = styled.footer`
  background-color: #2c3e50; // Couleur de fond bleu foncé (même que la navbar)
  color: white; // Texte en blanc
  padding: 40px 20px; // Espacement interne
  margin-top: 60px; // Marge au-dessus du footer
`;

// Style du contenu du pied de page avec disposition en grille
const FooterContent = styled.div`
  max-width: 1200px; // Largeur maximale
  margin: 0 auto; // Centrage horizontal
  display: grid; // Disposition en grille
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); // Colonnes responsives
  gap: 30px; // Espacement entre les colonnes
  
  // Adaptation pour les écrans mobiles
  @media (max-width: 768px) {
    grid-template-columns: 1fr; // Une seule colonne sur mobile
    text-align: center; // Centrage du texte
  }
`;

// Style des sections du pied de page
const FooterSection = styled.div`
  display: flex; // Disposition flexible
  flex-direction: column; // Empilage vertical des éléments
`;

// Style des titres de section
const FooterTitle = styled.h3`
  font-size: 1.2rem; // Taille de police
  margin-bottom: 20px; // Marge en dessous
  color: #ecf0f1; // Couleur blanc cassé
`;

// Style des liens de navigation dans le pied de page
const FooterLink = styled(Link)`
  color: #bdc3c7; // Couleur gris clair
  text-decoration: none; // Supprime le soulignement
  margin-bottom: 10px; // Marge en dessous
  transition: color 0.3s ease; // Animation de changement de couleur
  
  // Effet au survol
  &:hover {
    color: #3498db; // Couleur bleu clair au survol
  }
`;

// Style du texte descriptif
const FooterText = styled.p`
  color: #bdc3c7; // Couleur gris clair
  margin-bottom: 15px; // Marge en dessous
  line-height: 1.6; // Hauteur de ligne
`;

// Style de la section copyright
const Copyright = styled.div`
  text-align: center; // Centrage du texte
  padding-top: 30px; // Espacement au-dessus
  margin-top: 30px; // Marge au-dessus
  border-top: 1px solid rgba(236, 240, 241, 0.1); // Ligne de séparation
  color: #bdc3c7; // Couleur gris clair
  font-size: 0.9rem; // Taille de police réduite
`;

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