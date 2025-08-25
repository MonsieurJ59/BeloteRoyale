// Importation des modules nécessaires
import React, { useState, useContext, useMemo } from 'react'; // Hooks React de base
import { Link } from 'react-router-dom'; // Composant de navigation
import styled from 'styled-components'; // Bibliothèque de styling
import { TournamentContext } from '../context/TournamentContext'; // Contexte pour la gestion des tournois
import { Tournament } from '../types/types'; // Type Tournament défini dans notre application

// Composant principal de la page des tournois
const TournamentsPage: React.FC = () => {
  // Utilisation du contexte pour accéder aux données des tournois
  const { tournaments, loading, error } = useContext(TournamentContext);
  
  // État local pour gérer l'onglet actif (filtre)
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'in_progress' | 'completed'>('all');

  // Filtrer les tournois en fonction de l'onglet actif
  // useMemo permet de mémoriser le résultat et de ne recalculer que si les dépendances changent
  const filteredTournaments = useMemo(() => {
    if (activeTab === 'all') return tournaments; // Tous les tournois
    return tournaments.filter(tournament => tournament.status === activeTab); // Tournois filtrés par statut
  }, [tournaments, activeTab]); // Recalcule si tournaments ou activeTab change

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

  // Rendu du composant
  return (
    <PageContainer>
      <Title>Tournois</Title>
      
      {/* Onglets de filtrage pour sélectionner les tournois par statut */}
      <TabsContainer>
        <Tab 
          active={activeTab === 'all'} 
          onClick={() => setActiveTab('all')}
        >
          Tous
        </Tab>
        <Tab 
          active={activeTab === 'in_progress'} 
          onClick={() => setActiveTab('in_progress')}
        >
          En cours
        </Tab>
        <Tab 
          active={activeTab === 'upcoming'} 
          onClick={() => setActiveTab('upcoming')}
        >
          À venir
        </Tab>
        <Tab 
          active={activeTab === 'completed'} 
          onClick={() => setActiveTab('completed')}
        >
          Terminés
        </Tab>
      </TabsContainer>
      
      {/* Affichage conditionnel selon l'état de chargement, les erreurs et les résultats */}
      {loading ? (
        // Affichage pendant le chargement
        <LoadingMessage>Chargement des tournois...</LoadingMessage>
      ) : error ? (
        // Affichage en cas d'erreur
        <ErrorMessage>{error}</ErrorMessage>
      ) : filteredTournaments.length === 0 ? (
        // Affichage si aucun tournoi ne correspond au filtre
        <EmptyMessage>
          {activeTab === 'all' 
            ? 'Aucun tournoi n\'a été créé.' 
            : `Aucun tournoi ${activeTab === 'in_progress' ? 'en cours' : activeTab === 'upcoming' ? 'à venir' : 'terminé'}.`}
        </EmptyMessage>
      ) : (
        // Affichage de la grille de tournois si des tournois existent
        <TournamentsGrid>
          {/* Création d'une carte pour chaque tournoi avec map */}
          {filteredTournaments.map(tournament => (
            <TournamentCard key={tournament.id}>
              {/* Badge de statut */}
              <TournamentStatus status={tournament.status}>
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
        </TournamentsGrid>
      )}
    </PageContainer>
  );
};

// Styles avec styled-components
// Conteneur principal de la page
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

// Style du titre principal
const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #333;
  text-align: center;
`;

// Style du conteneur des onglets
const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #ddd;
`;

// Style des onglets avec props pour l'état actif
const Tab = styled.button<{ active: boolean }>`
  padding: 0.8rem 1.5rem;
  background-color: transparent;
  border: none;
  border-bottom: 3px solid ${props => props.active ? '#007bff' : 'transparent'};
  color: ${props => props.active ? '#007bff' : '#555'};
  font-weight: ${props => props.active ? '600' : '400'};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: #007bff;
  }
  
  &:focus {
    outline: none;
  }
`;

// Style de la grille de tournois (responsive)
const TournamentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
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
const TournamentStatus = styled.div<{ status: Tournament['status'] }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background-color: ${props => {
    // Couleur de fond selon le statut
    switch (props.status) {
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
    switch (props.status) {
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

export default TournamentsPage;