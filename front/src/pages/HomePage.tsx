// Importation des modules nécessaires
import { useContext, useMemo } from 'react'; // Hooks React de base
import { Link } from 'react-router-dom'; // Composant de navigation
import styled from 'styled-components'; // Bibliothèque de styling
import { TournamentContext } from '../context/TournamentContext'; // Contexte pour la gestion des tournois
import { TeamContext } from '../context/TeamContext'; // Contexte pour la gestion des équipes
import { MatchContext } from '../context/MatchContext'; // Contexte pour la gestion des matchs
import type { Tournament } from '../types/api'; // Type Tournament importé depuis le backend
import { theme } from '../styles/theme'; // Thème avec couleurs modernes

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
  width: 100%;
`;

// Style de la section hero (bannière principale)
const HeroSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.light} 100%);
  border-radius: ${theme.borderRadius.xl};
  margin-bottom: ${theme.spacing.xxxl};
  padding: ${theme.spacing.xxxl};
  box-shadow: ${theme.shadows.lg};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="2" fill="%23ffffff" opacity="0.05"/><circle cx="75" cy="75" r="1.5" fill="%23ffffff" opacity="0.03"/><circle cx="50" cy="10" r="1" fill="%23ffffff" opacity="0.04"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
    opacity: 0.3;
  }
`;

// Style du contenu de la section hero
const HeroContent = styled.div`
  text-align: center;
  max-width: 800px;
`;

// Style du titre principal de la section hero
const HeroTitle = styled.h1`
  font-family: ${theme.typography.fontFamily.heading};
  font-size: ${theme.typography.fontSize['5xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.text.light};
  text-align: center;
  position: relative;
  z-index: 1;
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize['3xl']};
  }
`;

// Style du sous-titre de la section hero
const HeroSubtitle = styled.p`
  font-size: ${theme.typography.fontSize.xl};
  margin-bottom: ${theme.spacing.xxl};
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  position: relative;
  z-index: 1;
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize.lg};
  }
`;

// Style du conteneur des boutons de la section hero
const HeroButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing.lg};
  position: relative;
  z-index: 1;
  
  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    align-items: center;
    gap: ${theme.spacing.md};
  }
`;

// Style de base pour les boutons (utilise le composant Link de react-router-dom)
const Button = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.fontWeight.semibold};
  font-size: ${theme.typography.fontSize.base};
  text-decoration: none;
  transition: all ${theme.transitions.normal};
  min-width: 160px;
  box-shadow: ${theme.shadows.sm};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }
`;

// Style du bouton principal
const PrimaryButton = styled(Button)`
  background-color: ${theme.colors.accent.main};
  color: ${theme.colors.text.light};
  
  &:hover {
    background-color: ${theme.colors.accent.dark};
  }
`;

// Style du bouton secondaire
const SecondaryButton = styled(Button)`
  background-color: rgba(255, 255, 255, 0.1);
  color: ${theme.colors.text.light};
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

// Style des sections de contenu
const SectionContainer = styled.section`
  margin: ${theme.spacing.xxxl} 0;
`;

// Style des titres de section
const SectionTitle = styled.h2`
  font-family: ${theme.typography.fontFamily.heading};
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: ${theme.spacing.xl};
  color: ${theme.colors.text.primary};
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -${theme.spacing.sm};
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, ${theme.colors.accent.main}, ${theme.colors.accent.light});
    border-radius: ${theme.borderRadius.sm};
  }
`;

// Style de la grille de tournois (responsive)
const TournamentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${theme.spacing.xl};
  position: relative;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

// Style des cartes de tournoi
const TournamentCard = styled.div`
  background-color: ${theme.colors.background.card};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.sm};
  position: relative;
  transition: all ${theme.transitions.normal};
  border: 1px solid ${theme.colors.border.light};
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${theme.shadows.lg};
    border-color: ${theme.colors.accent.main};
  }
`;

// Style du badge de statut avec couleurs conditionnelles
const TournamentStatus = styled.div<{ $status: Tournament['status'] }>`
  position: absolute;
  top: ${theme.spacing.lg};
  right: ${theme.spacing.lg};
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: ${props => {
    switch (props.$status) {
      case 'upcoming':
        return theme.colors.status.info + '20';
      case 'in_progress':
        return theme.colors.status.success + '20';
      case 'completed':
        return theme.colors.neutral.gray300;
      default:
        return theme.colors.neutral.gray300;
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'upcoming':
        return theme.colors.status.info;
      case 'in_progress':
        return theme.colors.status.success;
      case 'completed':
        return theme.colors.neutral.gray600;
      default:
        return theme.colors.neutral.gray600;
    }
  }};
`;

// Style du nom du tournoi
const TournamentName = styled.h3`
  font-family: ${theme.typography.fontFamily.heading};
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  margin-bottom: ${theme.spacing.sm};
  color: ${theme.colors.text.primary};
  line-height: ${theme.typography.lineHeight.tight};
`;

// Style de la date du tournoi
const TournamentDate = styled.p`
  font-size: ${theme.typography.fontSize.base};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.xl};
  display: flex;
  align-items: center;
  
  &::before {
    content: '📅';
    margin-right: ${theme.spacing.sm};
  }
`;

// Style du bouton de détails (utilise le composant Link de react-router-dom)
const ViewDetailsButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background-color: ${theme.colors.primary.main};
  color: ${theme.colors.text.light};
  text-decoration: none;
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.fontWeight.medium};
  font-size: ${theme.typography.fontSize.sm};
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background-color: ${theme.colors.primary.light};
    transform: translateY(-1px);
  }
`;

// Style du bouton "Voir tous les tournois" (s'étend sur toute la largeur)
const ViewAllButton = styled(Link)`
  grid-column: 1 / -1;
  text-align: center;
  padding: ${theme.spacing.lg};
  background: linear-gradient(135deg, ${theme.colors.accent.lighter}, ${theme.colors.accent.light});
  color: ${theme.colors.accent.dark};
  text-decoration: none;
  border-radius: ${theme.borderRadius.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  font-size: ${theme.typography.fontSize.lg};
  transition: all ${theme.transitions.normal};
  border: 2px solid transparent;
  
  &:hover {
    background: ${theme.colors.accent.main};
    color: ${theme.colors.text.light};
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }
`;

// Style de la section des statistiques
const StatsSection = styled.section`
  margin: ${theme.spacing.xxxl} 0;
  padding: ${theme.spacing.xxl};
  background: linear-gradient(135deg, ${theme.colors.background.secondary}, ${theme.colors.neutral.gray50});
  border-radius: ${theme.borderRadius.xl};
  border: 1px solid ${theme.colors.border.light};
  box-shadow: ${theme.shadows.sm};
`;

// Style de la grille des statistiques (responsive)
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${theme.spacing.xl};
  margin-top: ${theme.spacing.xl};
`;

// Style des cartes de statistiques
const StatCard = styled.div`
  background-color: ${theme.colors.background.card};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xxl};
  text-align: center;
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.border.light};
  transition: all ${theme.transitions.normal};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.md};
    border-color: ${theme.colors.primary.light};
  }
`;

// Style du nombre dans les statistiques
const StatNumber = styled.div`
  font-family: ${theme.typography.fontFamily.heading};
  font-size: ${theme.typography.fontSize['4xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  background: linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.primary.light});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${theme.spacing.sm};
`;

// Style du libellé dans les statistiques
const StatLabel = styled.div`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// Style du message de chargement
const LoadingMessage = styled.p`
  text-align: center;
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  margin: ${theme.spacing.xxl} 0;
  padding: ${theme.spacing.xl};
  background-color: ${theme.colors.neutral.gray50};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.light};
`;

// Style du message d'erreur
const ErrorMessage = styled.p`
  text-align: center;
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.status.error};
  margin: ${theme.spacing.xxl} 0;
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.status.error}20;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.status.error}40;
`;

// Style du message quand aucun tournoi n'est trouvé
const EmptyMessage = styled.p`
  text-align: center;
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  margin: ${theme.spacing.xxl} 0;
  padding: ${theme.spacing.xxl};
  background-color: ${theme.colors.neutral.gray50};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.light};
`;

export default HomePage;