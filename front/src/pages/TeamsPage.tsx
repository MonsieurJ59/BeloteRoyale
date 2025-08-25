// Importation des modules nécessaires
import React, { useState, useContext } from 'react'; // Hooks React de base
import styled from 'styled-components'; // Bibliothèque de styling
import { TeamContext } from '../context/TeamContext'; // Contexte pour la gestion des équipes
import type { Team } from '../types/types';

// Composant principal de la page des équipes
const TeamsPage = () => {
  // Utilisation du contexte pour accéder aux données et fonctions liées aux équipes
  const { teams, loading, error, fetchTeams, addTeam } = useContext(TeamContext);
  
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

// Style de l'en-tête
const Header = styled.header`
  margin-bottom: 30px;
  text-align: center;
`;

// Style du titre principal
const Title = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

// Style du sous-titre
const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

// Style de la grille d'équipes (responsive)
const TeamsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Style des cartes d'équipe
const TeamCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  }
`;

// Style du nom de l'équipe
const TeamName = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: #2c3e50;
  text-align: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
`;

// Style de la liste des joueurs
const PlayersList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

// Style des éléments de la liste des joueurs
const PlayerItem = styled.li`
  padding: 8px 0;
  display: flex;
  align-items: center;
  
  &:not(:last-child) {
    border-bottom: 1px dashed #eee;
  }
`;

// Style de l'icône du joueur
const PlayerIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background-color: #3498db;
  color: white;
  border-radius: 50%;
  margin-right: 10px;
  font-size: 0.9rem;
`;

// Style du nom du joueur
const PlayerName = styled.span`
  font-size: 1.1rem;
  color: #2c3e50;
`;

// Style du conteneur du formulaire
const FormContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 25px;
  margin-bottom: 40px;
`;

// Style du titre du formulaire
const FormTitle = styled.h2`
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
`;

// Style du formulaire
const Form = styled.form`
  display: grid;
  gap: 20px;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

// Style des groupes de champs du formulaire
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (min-width: 768px) {
    &:first-child {
      grid-column: 1 / -1;
    }
  }
`;

// Style des labels
const Label = styled.label`
  font-size: 1rem;
  color: #2c3e50;
  margin-bottom: 8px;
`;

// Style des champs de saisie
const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: #3498db;
    outline: none;
  }
`;

// Style du bouton de soumission
const SubmitButton = styled.button`
  grid-column: 1 / -1;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #2980b9;
  }
  
  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

// Style du message de chargement
const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #666;
`;

// Style des messages d'erreur
const ErrorMessage = styled.div`
  text-align: center;
  padding: 15px;
  font-size: 1rem;
  color: #e74c3c;
  background-color: #fdeaea;
  border-radius: 4px;
  margin-bottom: 20px;
`;

// Style des messages de succès
const SuccessMessage = styled.div`
  text-align: center;
  padding: 15px;
  font-size: 1rem;
  color: #27ae60;
  background-color: #e8f5e9;
  border-radius: 4px;
  margin-bottom: 20px;
`;

// Style de l'état vide
const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

export default TeamsPage;