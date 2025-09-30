// Importation des modules nécessaires
import { useState, useContext, useMemo } from 'react'; // Hooks React de base
import { TournamentContext } from '../context/TournamentContext'; // Contexte pour la gestion des tournois
import TournamentModal from '../components/TournamentModal'; // Modal pour créer/modifier un tournoi
import type { Tournament } from '../types/api'; // Type Tournament importé depuis le backend

// Import des styles séparés
import {
  PageContainer,
  HeaderContainer,
  Title,
  CreateButton,
  TabsContainer,
  Tab,
  TournamentsGrid,
  TournamentCard,
  ActionButtons,
  ActionButton,
  TournamentStatus,
  TournamentName,
  TournamentDate,
  ViewDetailsButton,
  LoadingMessage,
  ErrorMessage,
  EmptyMessage
} from '../styles/TournamentsPage.styles';

// Composant principal de la page des tournois
const TournamentsPage: React.FC = () => {
  // Utilisation du contexte pour accéder aux données des tournois
  const { tournaments, loading, error, createTournament, updateTournament, deleteTournament } = useContext(TournamentContext);
  
  // État local pour gérer l'onglet actif (filtre)
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'in_progress' | 'completed'>('all');
  
  // États pour la gestion de la modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

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

  // Fonctions pour gérer la modal
  const handleCreateTournament = () => {
    setModalMode('create');
    setSelectedTournament(null);
    setIsModalOpen(true);
  };

  const handleEditTournament = (tournament: Tournament) => {
    setModalMode('edit');
    setSelectedTournament(tournament);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTournament(null);
  };

  const handleSubmitTournament = async (tournamentData: Omit<Tournament, 'id' | 'created_at'> & { match_configs?: any[]; selected_team_ids?: number[] }) => {
    try {
      if (modalMode === 'create') {
        await createTournament(tournamentData);
      } else if (selectedTournament) {
        await updateTournament(selectedTournament.id, tournamentData);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du tournoi:', error);
    }
  };

  const handleDeleteTournament = async (tournament: Tournament) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le tournoi "${tournament.name}" ?`)) {
      try {
        setIsDeleting(tournament.id);
        await deleteTournament(tournament.id);
      } catch (error) {
        console.error('Erreur lors de la suppression du tournoi:', error);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  // Rendu du composant
  return (
    <PageContainer>
      {/* En-tête avec titre et bouton de création */}
      <HeaderContainer>
        <Title>Tournois</Title>
        <CreateButton onClick={handleCreateTournament}>
          ➕ Nouveau tournoi
        </CreateButton>
      </HeaderContainer>

      {/* Onglets de filtrage */}
      <TabsContainer>
        <Tab 
          $active={activeTab === 'all'} 
          onClick={() => setActiveTab('all')}
        >
          Tous ({tournaments.length})
        </Tab>
        <Tab 
          $active={activeTab === 'upcoming'} 
          onClick={() => setActiveTab('upcoming')}
        >
          À venir ({tournaments.filter(t => t.status === 'upcoming').length})
        </Tab>
        <Tab 
          $active={activeTab === 'in_progress'} 
          onClick={() => setActiveTab('in_progress')}
        >
          En cours ({tournaments.filter(t => t.status === 'in_progress').length})
        </Tab>
        <Tab 
          $active={activeTab === 'completed'} 
          onClick={() => setActiveTab('completed')}
        >
          Terminés ({tournaments.filter(t => t.status === 'completed').length})
        </Tab>
      </TabsContainer>

      {/* Contenu principal */}
      {loading ? (
        <LoadingMessage>Chargement des tournois...</LoadingMessage>
      ) : error ? (
        <ErrorMessage>Erreur lors du chargement des tournois: {error}</ErrorMessage>
      ) : filteredTournaments.length === 0 ? (
        <EmptyMessage>
          {activeTab === 'all' 
            ? 'Aucun tournoi trouvé. Créez votre premier tournoi !' 
            : `Aucun tournoi ${getStatusLabel(activeTab as Tournament['status']).toLowerCase()} trouvé.`
          }
        </EmptyMessage>
      ) : (
        <TournamentsGrid>
          {filteredTournaments.map((tournament) => (
            <TournamentCard key={tournament.id}>
              {/* Boutons d'action */}
              <ActionButtons>
                <ActionButton 
                  $variant="edit"
                  onClick={() => handleEditTournament(tournament)}
                  title="Modifier le tournoi"
                >
                  ✏️
                </ActionButton>
                <ActionButton 
                  $variant="delete"
                  onClick={() => handleDeleteTournament(tournament)}
                  disabled={isDeleting === tournament.id}
                  title="Supprimer le tournoi"
                >
                  {isDeleting === tournament.id ? '⏳' : '🗑️'}
                </ActionButton>
              </ActionButtons>

              {/* Statut du tournoi */}
              <TournamentStatus $status={tournament.status}>
                {getStatusLabel(tournament.status)}
              </TournamentStatus>

              {/* Informations du tournoi */}
              <TournamentName>{tournament.name}</TournamentName>
              <TournamentDate>
                {formatDate(tournament.date)}
              </TournamentDate>

              {/* Bouton pour voir les détails */}
              <ViewDetailsButton to={`/tournaments/${tournament.id}`}>
                Voir les détails
              </ViewDetailsButton>
            </TournamentCard>
          ))}
        </TournamentsGrid>
      )}

      {/* Modal pour créer/modifier un tournoi */}
      <TournamentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTournament}
        mode={modalMode}
        tournament={selectedTournament}
      />
    </PageContainer>
  );
};

export default TournamentsPage;