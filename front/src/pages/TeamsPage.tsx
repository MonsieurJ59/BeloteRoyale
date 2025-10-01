// Importation des modules nécessaires
import { useState, useContext } from 'react'; // Hooks React de base
import { TeamContext } from '../context/TeamContext'; // Contexte pour la gestion des équipes
import type { Team } from '../types/api';
import {
  PageContainer,
  Header,
  Title,
  Subtitle,
  TeamsGrid,
  TeamCard,
  TeamName,
  PlayersList,
  PlayerItem,
  PlayerIcon,
  PlayerName,
  FormContainer,
  FormTitle,
  Form,
  FormGroup,
  Label,
  Input,
  SubmitButton,
  LoadingMessage,
  ErrorMessage,
  SuccessMessage,
  EmptyState,
  ActionButtons,
  ActionButton
} from '../styles/TeamsPage.styles.ts';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalForm,
  ButtonGroup,
  CancelButton
} from '../styles/TeamModal.styles.ts';

// Composant principal de la page des équipes
const TeamsPage = () => {
  // Utilisation du contexte pour accéder aux données et fonctions liées aux équipes
  const { teams, loading, error, addTeam, updateTeam, deleteTeam } = useContext(TeamContext);
  
  // États locaux pour gérer le formulaire d'ajout d'équipe
  const [teamName, setTeamName] = useState(''); // Nom de l'équipe
  const [player1, setPlayer1] = useState(''); // Nom du joueur 1
  const [player2, setPlayer2] = useState(''); // Nom du joueur 2
  const [formError, setFormError] = useState<string | null>(null); // Message d'erreur du formulaire
  const [success, setSuccess] = useState<string | null>(null); // Message de succès
  
  // États pour la modification d'équipe
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editTeamName, setEditTeamName] = useState('');
  const [editPlayer1, setEditPlayer1] = useState('');
  const [editPlayer2, setEditPlayer2] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fonction de gestion de la soumission du formulaire d'ajout
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setFormError(null); // Réinitialise les messages d'erreur
    setSuccess(null); // Réinitialise les messages de succès

    // Validation des champs du formulaire
    if (!teamName.trim()) {
      setFormError('Le nom de l\'équipe est requis');
      return;
    }
    
    if (!player1.trim()) {
      setFormError('Le nom du joueur 1 est requis');
      return;
    }
    
    if (!player2.trim()) {
      setFormError('Le nom du joueur 2 est requis');
      return;
    }

    try {
      // Appel à la fonction du contexte pour ajouter une équipe
      await addTeam(teamName, player1, player2);
      // Affichage du message de succès
      setSuccess('Équipe créée avec succès !');
      // Réinitialisation du formulaire après succès
      setTeamName('');
      setPlayer1('');
      setPlayer2('');
    } catch (err) {
      // Gestion des erreurs lors de la création
      setFormError('Erreur lors de la création de l\'équipe');
    }
  };
  
  // Fonction pour commencer l'édition d'une équipe
  const handleEditStart = (team: Team) => {
    setEditingTeam(team);
    setEditTeamName(team.name);
    setEditPlayer1(team.player1);
    setEditPlayer2(team.player2);
    setFormError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };
  
  // Fonction pour annuler l'édition
  const handleEditCancel = () => {
    setEditingTeam(null);
    setIsModalOpen(false);
  };
  
  // Fonction pour soumettre les modifications
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingTeam) return;
    
    // Validation des champs du formulaire
    if (!editTeamName.trim()) {
      setFormError('Le nom de l\'équipe est requis');
      return;
    }
    
    if (!editPlayer1.trim()) {
      setFormError('Le nom du joueur 1 est requis');
      return;
    }
    
    if (!editPlayer2.trim()) {
      setFormError('Le nom du joueur 2 est requis');
      return;
    }
    
    try {
      await updateTeam(editingTeam.id, editTeamName, editPlayer1, editPlayer2);
      setSuccess('Équipe modifiée avec succès !');
      setEditingTeam(null);
      setIsModalOpen(false);
    } catch (err) {
      setFormError('Erreur lors de la modification de l\'équipe');
    }
  };
  
  // Fonction pour supprimer une équipe
  const handleDelete = async (teamId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette équipe ?')) {
      return;
    }
    
    try {
      await deleteTeam(teamId);
      setSuccess('Équipe supprimée avec succès !');
    } catch (err: any) {
      setFormError(err.message || 'Erreur lors de la suppression de l\'équipe');
    }
  };
  
  // Affichage pendant le chargement
  if (loading && teams.length === 0) {
    return (
      <PageContainer>
        <Header>
          <Title>Équipes</Title>
        </Header>
        <LoadingMessage>Chargement des équipes...</LoadingMessage>
      </PageContainer>
    );
  }
  
  // Rendu du composant
  return (
    <PageContainer>
      <Header>
        <Title>Équipes</Title>
        <Subtitle>Gérez les équipes participant aux tournois de Belote Royale</Subtitle>
      </Header>
      
      {/* Section du formulaire d'ajout d'équipe */}
      <FormContainer>
        <FormTitle>Ajouter une équipe</FormTitle>
        {formError && <ErrorMessage>{formError}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          {/* Champ pour le nom de l'équipe */}
          <FormGroup>
            <Label htmlFor="teamName">Nom de l'équipe</Label>
            <Input 
              id="teamName" 
              type="text" 
              value={teamName} 
              onChange={(e) => setTeamName(e.target.value)} 
              placeholder="Les As de Pique"
            />
          </FormGroup>
          
          {/* Champ pour le joueur 1 */}
          <FormGroup>
            <Label htmlFor="player1">Joueur 1</Label>
            <Input 
              id="player1" 
              type="text" 
              value={player1} 
              onChange={(e) => setPlayer1(e.target.value)} 
              placeholder="Jean Dupont"
            />
          </FormGroup>
          
          {/* Champ pour le joueur 2 */}
          <FormGroup>
            <Label htmlFor="player2">Joueur 2</Label>
            <Input 
              id="player2" 
              type="text" 
              value={player2} 
              onChange={(e) => setPlayer2(e.target.value)} 
              placeholder="Marie Martin"
            />
          </FormGroup>
          
          {/* Bouton de soumission du formulaire */}
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Création en cours...' : 'Créer l\'équipe'}
          </SubmitButton>
        </Form>
      </FormContainer>
      
      {/* Section d'affichage des équipes existantes */}
      {teams.length > 0 ? (
        <>
          <h2>Liste des équipes ({teams.length})</h2>
          <TeamsGrid>
            {/* Création d'une carte pour chaque équipe avec map */}
            {teams.map((team: Team) => (
              <TeamCard key={team.id}>
                <TeamName>{team.name}</TeamName>
                <PlayersList>
                  <PlayerItem>
                    <PlayerIcon>1</PlayerIcon>
                    <PlayerName>{team.player1}</PlayerName>
                  </PlayerItem>
                  <PlayerItem>
                    <PlayerIcon>2</PlayerIcon>
                    <PlayerName>{team.player2}</PlayerName>
                  </PlayerItem>
                </PlayersList>
                <ActionButtons>
                  <ActionButton $variant="edit" onClick={() => handleEditStart(team)} title="Modifier">
                    ✏️
                  </ActionButton>
                  <ActionButton $variant="delete" onClick={() => handleDelete(team.id)} title="Supprimer">
                    🗑️
                  </ActionButton>
                </ActionButtons>
              </TeamCard>
            ))}
          </TeamsGrid>
        </>
      ) : (
        <EmptyState>
          Aucune équipe n'a encore été créée. Utilisez le formulaire ci-dessus pour ajouter votre première équipe.
        </EmptyState>
      )}

      {/* Modale pour l'édition d'équipe */}
      {isModalOpen && editingTeam && (
        <ModalOverlay onClick={handleEditCancel}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Modifier l'équipe</ModalTitle>
              <CloseButton onClick={handleEditCancel}>&times;</CloseButton>
            </ModalHeader>
            <ModalForm onSubmit={handleEditSubmit}>
              {formError && <ErrorMessage>{formError}</ErrorMessage>}
              
              <FormGroup>
                <Label htmlFor={`edit-team-name-${editingTeam.id}`}>Nom de l'équipe</Label>
                <Input 
                  id={`edit-team-name-${editingTeam.id}`} 
                  type="text" 
                  value={editTeamName} 
                  onChange={(e) => setEditTeamName(e.target.value)} 
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor={`edit-player1-${editingTeam.id}`}>Joueur 1</Label>
                <Input 
                  id={`edit-player1-${editingTeam.id}`} 
                  type="text" 
                  value={editPlayer1} 
                  onChange={(e) => setEditPlayer1(e.target.value)} 
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor={`edit-player2-${editingTeam.id}`}>Joueur 2</Label>
                <Input 
                  id={`edit-player2-${editingTeam.id}`} 
                  type="text" 
                  value={editPlayer2} 
                  onChange={(e) => setEditPlayer2(e.target.value)} 
                />
              </FormGroup>
              
              <ButtonGroup>
                <CancelButton type="button" onClick={handleEditCancel}>
                  Annuler
                </CancelButton>
                <SubmitButton type="submit" disabled={loading}>
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </SubmitButton>
              </ButtonGroup>
            </ModalForm>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default TeamsPage;