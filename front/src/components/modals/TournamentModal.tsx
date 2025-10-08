import { useState, useEffect } from 'react';
import type { Tournament, Team } from '../../types/api.ts';
import { API_URL } from '../../config.ts';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalForm,
  FormGroup,
  Label,
  Input,
  Select,
  ErrorText,
  HelpText,
  ButtonGroup,
  CancelButton,
  SubmitButton,
  TeamList,
  TeamItem
} from '../../styles/TournamentModal.styles.ts';

interface TournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tournament: Omit<Tournament, 'id' | 'created_at'> & { match_configs?: any[], selected_team_ids?: number[] }) => void;
  tournament?: Tournament | null;
  mode: 'create' | 'edit';
}

const TournamentModal: React.FC<TournamentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  tournament,
  mode
}) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    status: 'upcoming' as Tournament['status'],
    maxPrincipalMatches: 5
  });

  // Teams selection state (for create mode)
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [teamsError, setTeamsError] = useState<string | null>(null);
  const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (tournament && mode === 'edit') {
      setFormData({
        name: tournament.name,
        date: new Date(tournament.date).toISOString().split('T')[0],
        status: tournament.status,
        maxPrincipalMatches: 5 // Valeur par défaut pour l'édition
      });
    } else {
      setFormData({
        name: '',
        date: '',
        status: 'upcoming',
        maxPrincipalMatches: 5
      });
    }
    setErrors({});
    // Reset teams selection when modal opens or mode changes
    setSelectedTeamIds([]);
  }, [tournament, mode, isOpen]);

  // Load teams when creating a tournament and modal is open
  useEffect(() => {
    const fetchTeams = async () => {
      if (!isOpen || mode !== 'create') return;
      try {
        setTeamsLoading(true);
        setTeamsError(null);
        const resp = await fetch(`${API_URL}/teams`);
        if (!resp.ok) throw new Error('Erreur lors du chargement des équipes');
        const data = await resp.json();
        setTeams(data);
      } catch (e) {
        setTeamsError(e instanceof Error ? e.message : 'Erreur inconnue');
      } finally {
        setTeamsLoading(false);
      }
    };
    fetchTeams();
  }, [isOpen, mode]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du tournoi est requis';
    }

    if (!formData.date) {
      newErrors.date = 'La date du tournoi est requise';
    }

    if (formData.maxPrincipalMatches < 1 || formData.maxPrincipalMatches > 20) {
      newErrors.maxPrincipalMatches = 'Le nombre de matchs principaux doit être entre 1 et 20';
    }
    
    // Validation pour exiger au moins 4 équipes
    if (mode === 'create' && selectedTeamIds.length < 4) {
      newErrors.teams = 'Au moins 4 équipes sont nécessaires pour créer un tournoi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const matchConfigs = [
      { id: 0, tournament_id: 0, match_type: 'preliminaires' as const, is_enabled: true, max_matches: 10 },
      { id: 0, tournament_id: 0, match_type: 'principal_1' as const, is_enabled: true, max_matches: formData.maxPrincipalMatches }
    ];

    // Déterminer automatiquement le statut en fonction de la date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tournamentDate = new Date(formData.date);
    tournamentDate.setHours(0, 0, 0, 0);
    
    // Si la date est aujourd'hui, le statut est "in_progress", sinon c'est "upcoming"
    const autoStatus = tournamentDate.getTime() === today.getTime() ? 'in_progress' : 'upcoming';

    const tournamentData = {
      name: formData.name.trim(),
      date: new Date(formData.date),
      status: autoStatus, // Toujours utiliser le statut automatique
      match_configs: mode === 'create' ? matchConfigs : undefined,
      selected_team_ids: mode === 'create' ? selectedTeamIds : undefined
    };
    
    onSubmit(tournamentData);
    onClose();
  };

  const toggleTeam = (teamId: number) => {
    setSelectedTeamIds(prev => prev.includes(teamId) ? prev.filter(id => id !== teamId) : [...prev, teamId]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'maxPrincipalMatches' ? parseInt(value) || 0 : value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {mode === 'create' ? 'Créer un tournoi' : 'Modifier le tournoi'}
          </ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <ModalForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Nom du tournoi *</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Entrez le nom du tournoi"
              $hasError={!!errors.name}
            />
            {errors.name && <ErrorText>{errors.name}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="date">Date du tournoi *</Label>
            <Input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              $hasError={!!errors.date}
            />
            {errors.date && <ErrorText>{errors.date}</ErrorText>}
          </FormGroup>

          {mode === 'create' && (
            <FormGroup>
              <Label htmlFor="maxPrincipalMatches">Nombre de matchs principaux</Label>
              <Input
                type="number"
                id="maxPrincipalMatches"
                name="maxPrincipalMatches"
                value={formData.maxPrincipalMatches || ''}
                onChange={handleInputChange}
                min="1"
                max="20"
                placeholder="Nombre de matchs principaux (1-20)"
                $hasError={!!errors.maxPrincipalMatches}
              />
              {errors.maxPrincipalMatches && <ErrorText>{errors.maxPrincipalMatches}</ErrorText>}
              <HelpText>Définit le nombre maximum de matchs dans la phase principale du tournoi</HelpText>
            </FormGroup>
          )}

          {mode === 'create' && (
            <FormGroup>
              <Label>Équipes participantes</Label>
              {teamsLoading ? (
                <HelpText>Chargement des équipes...</HelpText>
              ) : teamsError ? (
                <ErrorText>{teamsError}</ErrorText>
              ) : teams.length === 0 ? (
                <HelpText>Aucune équipe disponible. Créez des équipes avant de créer un tournoi.</HelpText>
              ) : (
                <TeamList>
                  {teams.map(team => (
                    <TeamItem key={team.id}>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedTeamIds.includes(team.id)}
                          onChange={() => toggleTeam(team.id)}
                        />
                        <span>{team.name} — {team.player1} & {team.player2}</span>
                      </label>
                    </TeamItem>
                  ))}
                </TeamList>
              )}
              <HelpText>Sélectionnez les équipes qui participeront à ce tournoi.</HelpText>
              {errors.teams && <ErrorText>{errors.teams}</ErrorText>}
            </FormGroup>
          )}

          <ButtonGroup>
            <CancelButton type="button" onClick={onClose}>
              Annuler
            </CancelButton>
            <SubmitButton type="submit">
              {mode === 'create' ? 'Créer' : 'Modifier'}
            </SubmitButton>
          </ButtonGroup>
        </ModalForm>
      </ModalContent>
    </ModalOverlay>
  );
};

export default TournamentModal;
