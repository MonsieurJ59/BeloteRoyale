// Importation des modules nécessaires
import React, { useContext, useMemo } from 'react'; // Hooks React de base
import { Link } from 'react-router-dom'; // Composant de navigation
import styled from 'styled-components'; // Bibliothèque de styling
import { TournamentContext } from '../context/TournamentContext'; // Contexte pour la gestion des tournois
import { TeamContext } from '../context/TeamContext'; // Contexte pour la gestion des équipes
import { MatchContext } from '../context/MatchContext'; // Contexte pour la gestion des matchs
import type { Tournament } from '../types/types'; // Type Tournament défini dans notre application

// Composant principal de la page d'accueil
const HomePage: React.FC = () => {
  // Utilisation des contextes pour accéder aux données et états de chargement
  const { tournaments, loading: tournamentsLoading, error: tournamentsError } = useContext(TournamentContext);
  const { teams, loading: teamsLoading } = useContext(TeamContext);
  const { matches, loading: matchesLoading } = useContext(MatchContext);

  // Récupérer les tournois en cours (limité à 3) pour affichage sur la page d'accueil
  // useMemo permet de mémoriser le résultat et de ne recalculer que si les tournois changent
  const inProgressTournaments = useMemo(() => {
    return tournaments
      .filter(tournament => tournament.status === 'in_progress') // Filtrer uniquement les tournois en cours
      .slice(0, 3); // Limiter à 3 tournois pour l'affichage
  }, [tournaments]); // Recalcule si tournaments change

  // Fonction utilitaire pour formater la date pour l'affichage
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Fonction utilitaire pour obtenir le libellé du statut en français
  const getStatusLabel = (status: Tournament['status']) => {
    switch (status) {
      case 'upcoming':
        return 'À venir';
      case 'in_progress':
        return 'En cours';
      case 'completed':
        return 'Terminé';
      default:
        return status;
    }
  };

  // Variable pour déterminer si les données sont en cours de chargement
  const isLoading = tournamentsLoading || teamsLoading || matchesLoading;

  // Rendu du composant
  return (
    <PageContainer>
      {/* Section Hero - Bannière principale de la page d'accueil */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>Bienvenue sur Belote Royale</HeroTitle>
          <HeroSubtitle>La plateforme de gestion de tournois de belote</HeroSubtitle>
          <HeroButtons>
            {/* Boutons de navigation vers les pages principales */}
            <PrimaryButton to="/tournaments">Voir les tournois</PrimaryButton>
            <SecondaryButton to="/teams">Gérer les équipes</SecondaryButton>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      {/* Section des tournois en cours - Affiche jusqu'à 3 tournois actifs */}
      <SectionContainer>
        <SectionTitle>Tournois en cours</SectionTitle>
        
        {/* Affichage conditionnel selon l'état de chargement, les erreurs et les résultats */}
        {isLoading ? (
          // Affichage pendant le chargement
          <LoadingMessage>Chargement des données...</LoadingMessage>
        ) : tournamentsError ? (
          // Affichage en cas d'erreur
          <ErrorMessage>{tournamentsError}</ErrorMessage>
        ) : inProgressTournaments.length === 0 ? (
          // Affichage si aucun tournoi en cours
          <EmptyMessage>Aucun tournoi en cours actuellement.</EmptyMessage>
        ) : (
          // Affichage de la grille de tournois si des tournois en cours existent
          <TournamentsGrid>
            {/* Création d'une carte pour chaque tournoi en cours avec map */}
            {inProgressTournaments.map(tournament => (
              <TournamentCard key={tournament.id}>
                {/* Badge de statut */}
                <TournamentStatus $status={tournament.status}>
                  {getStatusLabel(tournament.status)}
                </TournamentStatus>
                {/* Nom du tournoi */}
                <TournamentName>{tournament.name}</TournamentName>
                {/* Date du tournoi formatée */}
                <TournamentDate>{formatDate(tournament.date)}</TournamentDate>
                {/* Lien vers la page de détails du tournoi */}
                <ViewDetailsButton to={`/tournaments/${tournament.id}`}>
                  Voir les détails
                </ViewDetailsButton>
              </TournamentCard>
            ))}
            {/* Bouton pour voir tous les tournois */}
            <ViewAllButton to="/tournaments">Voir tous les tournois</ViewAllButton>
          </TournamentsGrid>
        )}
      </SectionContainer>

      {/* Section des statistiques - Affiche le nombre total de tournois, équipes et matchs */}
      <StatsSection>
        <SectionTitle>Statistiques</SectionTitle>
        <StatsGrid>
          {/* Carte statistique pour les tournois */}
          <StatCard>
            <StatNumber>{tournaments.length}</StatNumber>
            <StatLabel>Tournois</StatLabel>
          </StatCard>
          {/* Carte statistique pour les équipes */}
          <StatCard>
            <StatNumber>{teams.length}</StatNumber>
            <StatLabel>Équipes</StatLabel>
          </StatCard>
          {/* Carte statistique pour les matchs */}
          <StatCard>
            <StatNumber>{matches.length}</StatNumber>
            <StatLabel>Matchs</StatLabel>
          </StatCard>
        </StatsGrid>
      </StatsSection>
    </PageContainer>
  );
};

// Styles avec styled-components
// Conteneur principal de la page
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

// Style de la section hero (bannière principale)
const HeroSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  background-color: #f8f9fa;
  border-radius: 12px;
  margin: 2rem 0;
  padding: 2rem;
  background-image: linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url('/hero-bg.jpg');
  background-size: cover;
  background-position: center;
`;

// Style du contenu de la section hero
const HeroContent = styled.div`
  text-align: center;
  max-width: 800px;
`;

// Style du titre principal de la section hero
const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #333;
`;

// Style du sous-titre de la section hero
const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #666;
`;

// Style du conteneur des boutons de la section hero
const HeroButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  
  /* Adaptation pour les écrans mobiles */
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

// Style de base pour les boutons (utilise le composant Link de react-router-dom)
const Button = styled(Link)`
  display: inline-block;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
`;

// Style du bouton principal (bleu)
const PrimaryButton = styled(Button)`
  background-color: #007bff;
  color: white;
  
  &:hover {
    background-color: #0069d9;
  }
`;

// Style du bouton secondaire (contour bleu)
const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: #007bff;
  border: 2px solid #007bff;
  
  &:hover {
    background-color: rgba(0, 123, 255, 0.1);
  }
`;

// Style des sections de contenu
const SectionContainer = styled.section`
  margin: 3rem 0;
`;

// Style des titres de section
const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
`;

// Style de la grille de tournois (responsive)
const TournamentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  position: relative;
`;

// Style des cartes de tournoi
const TournamentCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

// Style du badge de statut avec couleurs conditionnelles
const TournamentStatus = styled.div<{ $status: Tournament['status'] }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background-color: ${props => {
    // Couleur de fond selon le statut
    switch (props.$status) {
      case 'upcoming':
        return '#e3f2fd'; // Bleu clair
      case 'in_progress':
        return '#e8f5e9'; // Vert clair
      case 'completed':
        return '#f5f5f5'; // Gris clair
      default:
        return '#f5f5f5';
    }
  }};
  color: ${props => {
    // Couleur du texte selon le statut
    switch (props.$status) {
      case 'upcoming':
        return '#0d47a1'; // Bleu foncé
      case 'in_progress':
        return '#1b5e20'; // Vert foncé
      case 'completed':
        return '#616161'; // Gris foncé
      default:
        return '#616161';
    }
  }};
`;

// Style du nom du tournoi
const TournamentName = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

// Style de la date du tournoi
const TournamentDate = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 1.5rem;
`;

// Style du bouton de détails (utilise le composant Link de react-router-dom)
const ViewDetailsButton = styled(Link)`
  display: inline-block;
  padding: 0.6rem 1.2rem;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 600;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #0069d9;
  }
`;

// Style du bouton "Voir tous les tournois" (s'étend sur toute la largeur)
const ViewAllButton = styled(Link)`
  grid-column: 1 / -1; // Prend toute la largeur de la grille
  text-align: center;
  padding: 1rem;
  background-color: #f8f9fa;
  color: #007bff;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #e9ecef;
  }
`;

// Style de la section des statistiques
const StatsSection = styled.section`
  margin: 3rem 0;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 12px;
`;

// Style de la grille des statistiques (responsive)
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

// Style des cartes de statistiques
const StatCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

// Style du nombre dans les statistiques
const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: #007bff;
  margin-bottom: 0.5rem;
`;

// Style du libellé dans les statistiques
const StatLabel = styled.div`
  font-size: 1.2rem;
  color: #666;
`;

// Style du message de chargement
const LoadingMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin: 2rem 0;
`;

// Style du message d'erreur
const ErrorMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #dc3545;
  margin: 2rem 0;
  padding: 1rem;
  background-color: #f8d7da;
  border-radius: 4px;
`;

// Style du message quand aucun tournoi n'est trouvé
const EmptyMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin: 2rem 0;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

export default HomePage;