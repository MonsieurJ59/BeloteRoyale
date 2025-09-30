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
  EmptyState
} from '../styles/TeamsPage.styles.ts';

// Composant principal de la page des équipes
const TeamsPage = () => {
  // Utilisation du contexte pour accéder aux données et fonctions liées aux équipes
  const { teams, loading, error, addTeam } = useContext(TeamContext);
  
  // États locaux pour gérer le formulaire d'ajout d'équipe
  const [teamName, setTeamName] = useState(''); // Nom de l'équipe
  const [player1, setPlayer1] = useState(''); // Nom du joueur 1
  const [player2, setPlayer2] = useState(''); // Nom du joueur 2
  const [formError, setFormError] = useState<string | null>(null); // Message d'erreur du formulaire
  const [success, setSuccess] = useState<string | null>(null); // Message de succès

  // Fonction de gestion de la soumission du formulaire
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
  
  // Affichage pendant le chargement
  if (loading) {
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
              </TeamCard>
            ))}
          </TeamsGrid>
        </>
      ) : (
        <EmptyState>
          Aucune équipe n'a encore été créée. Utilisez le formulaire ci-dessus pour ajouter votre première équipe.
        </EmptyState>
      )}
    </PageContainer>
  );
};

export default TeamsPage;