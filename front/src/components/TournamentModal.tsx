import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import type { Tournament, Team } from '../types/api';

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
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/teams`);
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

    const tournamentData = {
      name: formData.name.trim(),
      date: new Date(formData.date),
      status: formData.status,
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

          <FormGroup>
            <Label htmlFor="status">Statut</Label>
            <Select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="upcoming">À venir</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminé</option>
            </Select>
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

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${theme.spacing.lg};
`;

const ModalContent = styled.div`
  background-color: ${theme.colors.background.card};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.xl};
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.xl};
  border-bottom: 1px solid ${theme.colors.border.light};
`;

const ModalTitle = styled.h2`
  font-family: ${theme.typography.fontFamily.heading};
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${theme.typography.fontSize['2xl']};
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  padding: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.sm};
  transition: all ${theme.transitions.fast};

  &:hover {
    background-color: ${theme.colors.neutral.gray100};
    color: ${theme.colors.text.primary};
  }
`;

const ModalForm = styled.form`
  padding: ${theme.spacing.xl};
`;

const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.sm};
`;

const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: ${theme.spacing.md};
  border: 1px solid ${props => props.$hasError ? theme.colors.status.error : theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.base};
  transition: all ${theme.transitions.fast};
  background-color: ${theme.colors.background.primary};

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? theme.colors.status.error : theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? theme.colors.status.error + '20' : theme.colors.primary.main + '20'};
  }

  &::placeholder {
    color: ${theme.colors.text.secondary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.base};
  background-color: ${theme.colors.background.primary};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${theme.colors.primary.main}20;
  }
`;

const ErrorText = styled.span`
  display: block;
  color: ${theme.colors.status.error};
  font-size: ${theme.typography.fontSize.sm};
  margin-top: ${theme.spacing.xs};
`;

const HelpText = styled.span`
  display: block;
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.xs};
  margin-top: ${theme.spacing.xs};
  font-style: italic;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${theme.spacing.xl};
`;

const Button = styled.button`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.fontWeight.medium};
  font-size: ${theme.typography.fontSize.base};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  border: none;
`;

const CancelButton = styled(Button)`
  background-color: ${theme.colors.neutral.gray200};
  color: ${theme.colors.text.secondary};

  &:hover {
    background-color: ${theme.colors.neutral.gray300};
    color: ${theme.colors.text.primary};
  }
`;

const SubmitButton = styled(Button)`
  background-color: ${theme.colors.primary.main};
  color: ${theme.colors.text.light};

  &:hover {
    background-color: ${theme.colors.primary.light};
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.sm};
  }

  &:disabled {
    background-color: ${theme.colors.neutral.gray300};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

// Teams list styles
const TeamList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 240px;
  overflow-y: auto;
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  background-color: ${theme.colors.background.primary};
`;

const TeamItem = styled.li`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border.light};

  &:last-child {
    border-bottom: none;
  }

  label {
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    cursor: pointer;
    color: ${theme.colors.text.primary};
  }

  input[type="checkbox"] {
    accent-color: ${theme.colors.primary.main};
    width: 16px;
    height: 16px;
  }
`;

export default TournamentModal;
