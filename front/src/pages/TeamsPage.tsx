// Importation des modules nécessaires
import { useState, useContext } from 'react'; // Hooks React de base
import styled from 'styled-components'; // Bibliothèque de styling
import { TeamContext } from '../context/TeamContext'; // Contexte pour la gestion des équipes
import type { Team } from '../types/api';
import { theme } from '../styles/theme'; // Thème avec couleurs modernes

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

// Styles avec styled-components
// Conteneur principal de la page
const PageContainer = styled.div`
  width: 100%;
`;

// Style de l'en-tête
const Header = styled.header`
  margin-bottom: ${theme.spacing.xxxl};
  text-align: center;
`;

// Style du titre principal
const Title = styled.h1`
  font-family: ${theme.typography.fontFamily.heading};
  font-size: ${theme.typography.fontSize['4xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.lg};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -${theme.spacing.sm};
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, ${theme.colors.accent.main}, ${theme.colors.accent.light});
    border-radius: ${theme.borderRadius.sm};
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize['3xl']};
  }
`;

// Style du sous-titre
const Subtitle = styled.p`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  max-width: 600px;
  margin: 0 auto;
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize.base};
  }
`;

// Style de la grille d'équipes (responsive)
const TeamsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xxxl};
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

// Style des cartes d'équipe
const TeamCard = styled.div`
  background-color: ${theme.colors.background.card};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  padding: ${theme.spacing.xl};
  transition: all ${theme.transitions.normal};
  border: 1px solid ${theme.colors.border.light};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${theme.colors.secondary.main}, ${theme.colors.accent.main});
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${theme.shadows.lg};
    border-color: ${theme.colors.accent.main};
  }
`;

// Style du nom de l'équipe
const TeamName = styled.h3`
  font-family: ${theme.typography.fontFamily.heading};
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.text.primary};
  text-align: center;
  border-bottom: 1px solid ${theme.colors.border.light};
  padding-bottom: ${theme.spacing.md};
  margin-top: ${theme.spacing.sm};
`;

// Style de la liste des joueurs
const PlayersList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

// Style des éléments de la liste des joueurs
const PlayerItem = styled.li`
  padding: ${theme.spacing.sm} 0;
  display: flex;
  align-items: center;
  transition: all ${theme.transitions.fast};
  
  &:not(:last-child) {
    border-bottom: 1px dashed ${theme.colors.border.light};
  }
  
  &:hover {
    background-color: ${theme.colors.neutral.gray50};
    border-radius: ${theme.borderRadius.sm};
    padding-left: ${theme.spacing.sm};
    margin: 0 -${theme.spacing.sm};
  }
`;

// Style de l'icône du joueur
const PlayerIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.primary.light});
  color: ${theme.colors.text.light};
  border-radius: ${theme.borderRadius.full};
  margin-right: ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  box-shadow: ${theme.shadows.sm};
`;

// Style du nom du joueur
const PlayerName = styled.span`
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.primary};
`;

// Style du conteneur du formulaire
const FormContainer = styled.div`
  background: linear-gradient(135deg, ${theme.colors.background.card}, ${theme.colors.neutral.gray50});
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.md};
  padding: ${theme.spacing.xxl};
  margin-bottom: ${theme.spacing.xxxl};
  border: 1px solid ${theme.colors.border.light};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${theme.colors.accent.main}, ${theme.colors.accent.light});
  }
`;

// Style du titre du formulaire
const FormTitle = styled.h2`
  font-family: ${theme.typography.fontFamily.heading};
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xl};
  margin-top: ${theme.spacing.sm};
  text-align: center;
`;

// Style du formulaire
const Form = styled.form`
  display: grid;
  gap: ${theme.spacing.lg};
  
  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr 1fr;
  }
`;

// Style des groupes de champs du formulaire
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (min-width: ${theme.breakpoints.md}) {
    &:first-child {
      grid-column: 1 / -1;
    }
  }
`;

// Style des labels
const Label = styled.label`
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.sm};
`;

// Style des champs de saisie
const Input = styled.input`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border.medium};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.base};
  transition: all ${theme.transitions.fast};
  background-color: ${theme.colors.background.card};
  
  &:focus {
    border-color: ${theme.colors.primary.main};
    outline: 2px solid ${theme.colors.primary.main}20;
    outline-offset: 0;
    box-shadow: ${theme.shadows.sm};
  }
  
  &::placeholder {
    color: ${theme.colors.text.muted};
  }
`;

// Style du bouton de soumission
const SubmitButton = styled.button`
  grid-column: 1 / -1;
  background: linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.primary.light});
  color: ${theme.colors.text.light};
  border: none;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  box-shadow: ${theme.shadows.sm};
  
  &:hover {
    background: linear-gradient(135deg, ${theme.colors.primary.light}, ${theme.colors.primary.main});
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }
  
  &:disabled {
    background: ${theme.colors.neutral.gray400};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

// Style du message de chargement
const LoadingMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxxl};
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  background-color: ${theme.colors.neutral.gray50};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.light};
`;

// Style des messages d'erreur
const ErrorMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing.lg};
  font-size: ${theme.typography.fontSize.base};
  color: ${theme.colors.status.error};
  background-color: ${theme.colors.status.error}20;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.status.error}40;
  margin-bottom: ${theme.spacing.lg};
`;

// Style des messages de succès
const SuccessMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing.lg};
  font-size: ${theme.typography.fontSize.base};
  color: ${theme.colors.status.success};
  background-color: ${theme.colors.status.success}20;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.status.success}40;
  margin-bottom: ${theme.spacing.lg};
`;

// Style de l'état vide
const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxxl};
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  background-color: ${theme.colors.neutral.gray50};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.light};
`;

export default TeamsPage;