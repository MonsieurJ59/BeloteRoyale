// Importation des modules nécessaires
import React, { useState, useContext, useMemo } from 'react'; // Hooks React de base
import { Link } from 'react-router-dom'; // Composant de navigation
import styled from 'styled-components'; // Bibliothèque de styling
import { TournamentContext } from '../context/TournamentContext'; // Contexte pour la gestion des tournois
import TournamentModal from '../components/TournamentModal'; // Modal pour créer/modifier un tournoi
import type { Tournament } from '../types/types'; // Type Tournament défini dans notre application
import { theme } from '../styles/theme'; // Thème avec couleurs modernes

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

  const handleSubmitTournament = async (tournamentData: Omit<Tournament, 'id' | 'created_at'>) => {
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
      <HeaderContainer>
        <Title>Tournois</Title>
        <CreateButton onClick={handleCreateTournament}>
          + Créer un tournoi
        </CreateButton>
      </HeaderContainer>
      
      {/* Onglets de filtrage pour sélectionner les tournois par statut */}
      <TabsContainer>
        <Tab 
          $active={activeTab === 'all'} 
          onClick={() => setActiveTab('all')}
        >
          Tous
        </Tab>
        <Tab 
          $active={activeTab === 'in_progress'} 
          onClick={() => setActiveTab('in_progress')}
        >
          En cours
        </Tab>
        <Tab 
          $active={activeTab === 'upcoming'} 
          onClick={() => setActiveTab('upcoming')}
        >
          À venir
        </Tab>
        <Tab 
          $active={activeTab === 'completed'} 
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
              <TournamentStatus $status={tournament.status}>
                {getStatusLabel(tournament.status)}
              </TournamentStatus>
              
              {/* Boutons d'action */}
              <ActionButtons>
                <ActionButton 
                  onClick={() => handleEditTournament(tournament)}
                  $variant="edit"
                  title="Modifier le tournoi"
                >
                  ✏️
                </ActionButton>
                <ActionButton 
                  onClick={() => handleDeleteTournament(tournament)}
                  $variant="delete"
                  disabled={isDeleting === tournament.id}
                  title="Supprimer le tournoi"
                >
                  {isDeleting === tournament.id ? '⏳' : '🗑️'}
                </ActionButton>
              </ActionButtons>
              
              {/* Nom du tournoi */}
              <TournamentName>{tournament.name}</TournamentName>
              {/* Date du tournoi formatée */}
              <TournamentDate>{formatDate(tournament.date)}</TournamentDate>
              {/* Lien vers la page de résumé du tournoi */}
              <ViewDetailsButton to={`/tournaments/${tournament.id}`}>
                Voir le résumé
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
        tournament={selectedTournament}
        mode={modalMode}
      />
    </PageContainer>
  );
};

// Styles avec styled-components
// Conteneur principal de la page
const PageContainer = styled.div`
  width: 100%;
`;

// Style du conteneur d'en-tête
const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xxl};
  
  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${theme.spacing.lg};
    align-items: stretch;
  }
`;

// Style du titre principal
const Title = styled.h1`
  font-family: ${theme.typography.fontFamily.heading};
  font-size: ${theme.typography.fontSize['4xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  position: relative;
  margin: 0;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -${theme.spacing.sm};
    left: 0;
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, ${theme.colors.accent.main}, ${theme.colors.accent.light});
    border-radius: ${theme.borderRadius.sm};
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    text-align: center;
    
    &::after {
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

// Style du bouton de création
const CreateButton = styled.button`
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  background-color: ${theme.colors.primary.main};
  color: ${theme.colors.text.light};
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.fontWeight.semibold};
  font-size: ${theme.typography.fontSize.base};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  
  &:hover {
    background-color: ${theme.colors.primary.light};
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }
  
  &:focus {
    outline: 2px solid ${theme.colors.accent.main};
    outline-offset: 2px;
  }
`;

// Style du conteneur des onglets
const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${theme.spacing.xxl};
  background: ${theme.colors.background.card};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.sm};
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.border.light};
  
  @media (max-width: ${theme.breakpoints.md}) {
    flex-wrap: wrap;
    gap: ${theme.spacing.xs};
  }
`;

// Style des onglets avec props pour l'état actif
const Tab = styled.button<{ $active: boolean }>`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background-color: ${props => props.$active ? theme.colors.primary.main : 'transparent'};
  border: none;
  border-radius: ${theme.borderRadius.md};
  color: ${props => props.$active ? theme.colors.text.light : theme.colors.text.secondary};
  font-weight: ${props => props.$active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium};
  font-size: ${theme.typography.fontSize.base};
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  position: relative;
  
  &:hover {
    background-color: ${props => props.$active ? theme.colors.primary.light : theme.colors.primary.main + '10'};
    color: ${props => props.$active ? theme.colors.text.light : theme.colors.primary.main};
    transform: translateY(-1px);
  }
  
  &:focus {
    outline: 2px solid ${theme.colors.accent.main};
    outline-offset: 2px;
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    flex: 1;
    min-width: 80px;
    font-size: ${theme.typography.fontSize.sm};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
  }
`;

// Style de la grille de tournois (responsive)
const TournamentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${theme.spacing.xl};
  
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
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${theme.colors.primary.main}, ${theme.colors.accent.main});
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${theme.shadows.lg};
    border-color: ${theme.colors.accent.main};
  }
`;

// Style du conteneur des boutons d'action
const ActionButtons = styled.div`
  position: absolute;
  top: ${theme.spacing.lg};
  left: ${theme.spacing.lg};
  display: flex;
  gap: ${theme.spacing.xs};
  z-index: 1;
`;

// Style des boutons d'action
const ActionButton = styled.button<{ $variant: 'edit' | 'delete' }>`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  
  background-color: ${props => props.$variant === 'edit' 
    ? theme.colors.status.info + '20' 
    : theme.colors.status.error + '20'};
  
  color: ${props => props.$variant === 'edit' 
    ? theme.colors.status.info 
    : theme.colors.status.error};
  
  &:hover:not(:disabled) {
    background-color: ${props => props.$variant === 'edit' 
      ? theme.colors.status.info + '30' 
      : theme.colors.status.error + '30'};
    transform: scale(1.1);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  &:focus {
    outline: 2px solid ${props => props.$variant === 'edit' 
      ? theme.colors.status.info 
      : theme.colors.status.error};
    outline-offset: 2px;
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
  margin-top: ${theme.spacing.sm};
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
  width: 100%;
  
  &:hover {
    background-color: ${theme.colors.primary.light};
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.sm};
  }
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

export default TournamentsPage;