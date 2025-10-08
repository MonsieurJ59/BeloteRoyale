import React from 'react';
import { Team, Match } from '../../types/api';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalContent,
  ModalFooter,
  PairsList,
  PairItem,
  TeamName,
  PlayersCell,
  PlayerName,
  CreateMatchesButton,
  CancelButton
} from '../../styles/TournamentSummaryPage.styles';

interface PairsModalProps {
  showModal: boolean;
  modalTitle: string;
  modalPairs: Array<{ teamA: Team; teamB: Team }>;
  registeredTeams: Team[];
  onClose: () => void;
  onValidate: () => void;
  setModalPairs: React.Dispatch<React.SetStateAction<Array<{ teamA: Team; teamB: Team }>>>;
  generateTeamPairsAvoidingPreviousMatchups: () => Array<{ teamA: Team; teamB: Team }>;
}

export const PairsModal: React.FC<PairsModalProps> = ({
  showModal,
  modalTitle,
  modalPairs,
  registeredTeams,
  onClose,
  onValidate,
  setModalPairs,
  generateTeamPairsAvoidingPreviousMatchups
}) => {
  if (!showModal) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>{modalTitle}</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        <ModalContent>
          <PairsList>
            {modalPairs.map((p, idx) => (
              <PairItem key={`modal-${p.teamA.id}-${p.teamB.id}-${idx}`}>
                <select 
                  value={p.teamA.id} 
                  onChange={(e) => {
                    const selectedTeam = registeredTeams.find(t => t.id === parseInt(e.target.value));
                    if (selectedTeam) {
                      const newPairs = [...modalPairs];
                      newPairs[idx] = { ...newPairs[idx], teamA: selectedTeam };
                      setModalPairs(newPairs);
                    }
                  }}
                  style={{ padding: '5px', marginRight: '10px' }}
                >
                  {registeredTeams.map(team => (
                    <option key={`option-a-${team.id}`} value={team.id}>{team.name}</option>
                  ))}
                </select>
                vs
                <select 
                  value={p.teamB.id} 
                  onChange={(e) => {
                    const selectedTeam = registeredTeams.find(t => t.id === parseInt(e.target.value));
                    if (selectedTeam) {
                      const newPairs = [...modalPairs];
                      newPairs[idx] = { ...newPairs[idx], teamB: selectedTeam };
                      setModalPairs(newPairs);
                    }
                  }}
                  style={{ padding: '5px', marginLeft: '10px' }}
                >
                  {registeredTeams.map(team => (
                    <option key={`option-b-${team.id}`} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </PairItem>
            ))}
          </PairsList>
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <button 
              onClick={() => {
                const newPairs = generateTeamPairsAvoidingPreviousMatchups();
                setModalPairs(newPairs);
              }}
            >
              Relancer l'association aléatoire
            </button>
          </div>
        </ModalContent>
        <ModalFooter>
          <CreateMatchesButton onClick={onValidate}>
            Valider et créer ces matchs
          </CreateMatchesButton>
          <CancelButton onClick={onClose}>
            Annuler
          </CancelButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

interface TeamsModalProps {
  showModal: boolean;
  registeredTeams: Team[];
  onClose: () => void;
}

export const TeamsModal: React.FC<TeamsModalProps> = ({
  showModal,
  registeredTeams,
  onClose
}) => {
  if (!showModal) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>Équipes inscrites</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        <ModalContent>
          <PairsList>
            {registeredTeams.map((team) => (
              <PairItem key={team.id}>
                <TeamName>{team.name}</TeamName>
                <PlayersCell>
                  <PlayerName>{team.player1}</PlayerName>
                  <PlayerName>{team.player2}</PlayerName>
                </PlayersCell>
              </PairItem>
            ))}
          </PairsList>
        </ModalContent>
        <ModalFooter>
          <CancelButton onClick={onClose}>
            Fermer
          </CancelButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};