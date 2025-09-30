// Importation des modules nécessaires
import { useState, useContext, useMemo } from 'react'; // Hooks React de base
import { Link } from 'react-router-dom'; // Composant de navigation
import { TournamentContext } from '../context/TournamentContext'; // Contexte pour la gestion des tournois
import TournamentModal from '../components/TournamentModal'; // Modal pour créer/modifier un tournoi
import type { Tournament } from '../types/api'; // Type Tournament importé depuis le backend
import '../styles/TournamentsPage.css'; // Import du fichier CSS

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
    <div className="page-container">
      <div className="header-container">
        <h1 className="title">Tournois</h1>
        <button className="create-button" onClick={handleCreateTournament}>
          + Créer un tournoi
        </button>
      </div>
      
      {/* Onglets de filtrage pour sélectionner les tournois par statut */}
      <div className="tabs-container">
        <button 
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          Tous
        </button>
        <button 
          className={`tab ${activeTab === 'in_progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('in_progress')}
        >
          En cours
        </button>
        <button 
          className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          À venir
        </button>
        <button 
          className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Terminés
        </button>
      </div>
      
      {/* Affichage conditionnel selon l'état de chargement, les erreurs et les résultats */}
      {loading ? (
        // Affichage pendant le chargement
        <p className="loading-message">Chargement des tournois...</p>
      ) : error ? (
        // Affichage en cas d'erreur
        <p className="error-message">{error}</p>
      ) : filteredTournaments.length === 0 ? (
        // Affichage si aucun tournoi ne correspond au filtre
        <p className="empty-message">
          {activeTab === 'all' 
            ? 'Aucun tournoi n\'a été créé.' 
            : `Aucun tournoi ${activeTab === 'in_progress' ? 'en cours' : activeTab === 'upcoming' ? 'à venir' : 'terminé'}.`}
        </p>
      ) : (
        // Affichage de la grille de tournois si des tournois existent
        <div className="tournaments-grid">
          {/* Création d'une carte pour chaque tournoi avec map */}
          {filteredTournaments.map(tournament => (
            <div className="tournament-card" key={tournament.id}>
              {/* Badge de statut */}
              <div className={`tournament-status ${tournament.status}`}>
                {getStatusLabel(tournament.status)}
              </div>
              
              {/* Boutons d'action */}
              <div className="action-buttons">
                <button 
                  onClick={() => handleEditTournament(tournament)}
                  className="action-button edit"
                  title="Modifier le tournoi"
                >
                  ✏️
                </button>
                <button 
                  onClick={() => handleDeleteTournament(tournament)}
                  className="action-button delete"
                  disabled={isDeleting === tournament.id}
                  title="Supprimer le tournoi"
                >
                  {isDeleting === tournament.id ? '⏳' : '🗑️'}
                </button>
              </div>
              
              {/* Nom du tournoi */}
              <h3 className="tournament-name">{tournament.name}</h3>
              {/* Date du tournoi formatée */}
              <p className="tournament-date">{formatDate(tournament.date)}</p>
              {/* Lien vers la page de résumé du tournoi */}
              <Link className="view-details-button" to={`/tournaments/${tournament.id}`}>
                Voir le résumé
              </Link>
            </div>
          ))}
        </div>
      )}
      
      {/* Modal pour créer/modifier un tournoi */}
      <TournamentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTournament}
        tournament={selectedTournament}
        mode={modalMode}
      />
    </div>
  );
};

export default TournamentsPage;