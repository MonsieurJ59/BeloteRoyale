// Importation des modules nécessaires
import { useState, useContext } from 'react'; // Hooks React de base
import { TeamContext } from '../context/TeamContext'; // Contexte pour la gestion des équipes
import type { Team } from '../types/api';
import '../styles/TeamsPage.css';

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
      <div className="teams-page">
        <header className="teams-header">
          <h1 className="teams-title">Équipes</h1>
        </header>
        <div className="loading-message">Chargement des équipes...</div>
      </div>
    );
  }
  
  // Rendu du composant
  return (
    <div className="teams-page">
      <header className="teams-header">
        <h1 className="teams-title">Équipes</h1>
        <p className="teams-subtitle">Gérez les équipes participant aux tournois de Belote Royale</p>
      </header>
      
      {/* Section du formulaire d'ajout d'équipe */}
      <div className="form-container">
        <h2 className="form-title">Ajouter une équipe</h2>
        {formError && <div className="error-message">{formError}</div>}
        {success && <div className="success-message">{success}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <form className="teams-form" onSubmit={handleSubmit}>
          {/* Champ pour le nom de l'équipe */}
          <div className="form-group">
            <label className="form-label" htmlFor="teamName">Nom de l'équipe</label>
            <input 
              className="form-input"
              id="teamName" 
              type="text" 
              value={teamName} 
              onChange={(e) => setTeamName(e.target.value)} 
              placeholder="Les As de Pique"
            />
          </div>
          
          {/* Champ pour le joueur 1 */}
          <div className="form-group">
            <label className="form-label" htmlFor="player1">Joueur 1</label>
            <input 
              className="form-input"
              id="player1" 
              type="text" 
              value={player1} 
              onChange={(e) => setPlayer1(e.target.value)} 
              placeholder="Jean Dupont"
            />
          </div>
          
          {/* Champ pour le joueur 2 */}
          <div className="form-group">
            <label className="form-label" htmlFor="player2">Joueur 2</label>
            <input 
              className="form-input"
              id="player2" 
              type="text" 
              value={player2} 
              onChange={(e) => setPlayer2(e.target.value)} 
              placeholder="Marie Martin"
            />
          </div>
          
          {/* Bouton de soumission du formulaire */}
          <button className="submit-button" type="submit" disabled={loading}>
            {loading ? 'Création en cours...' : 'Créer l\'équipe'}
          </button>
        </form>
      </div>
      
      {/* Section d'affichage des équipes existantes */}
      {teams.length > 0 ? (
        <>
          <h2 className="section-title">Liste des équipes ({teams.length})</h2>
          <div className="teams-grid">
            {/* Création d'une carte pour chaque équipe avec map */}
            {teams.map((team: Team) => (
              <div key={team.id} className="team-card">
                <h3 className="team-name">{team.name}</h3>
                <ul className="players-list">
                  <li className="player-item">
                    <span className="player-icon">1</span>
                    <span className="player-name">{team.player1}</span>
                  </li>
                  <li className="player-item">
                    <span className="player-icon">2</span>
                    <span className="player-name">{team.player2}</span>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          Aucune équipe n'a encore été créée. Utilisez le formulaire ci-dessus pour ajouter votre première équipe.
        </div>
      )}
    </div>
  );
};

export default TeamsPage;