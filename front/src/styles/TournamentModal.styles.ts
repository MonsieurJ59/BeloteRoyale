import styled from 'styled-components';
import { theme } from './theme';

export const ModalOverlay = styled.div`
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

export const ModalContent = styled.div`
  background-color: ${theme.colors.background.card};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.xl};
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.xl};
  border-bottom: 1px solid ${theme.colors.border.light};
`;

export const ModalTitle = styled.h2`
  font-family: ${theme.typography.fontFamily.heading};
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

export const CloseButton = styled.button`
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

export const ModalForm = styled.form`
  padding: ${theme.spacing.xl};
`;

export const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

export const Label = styled.label`
  display: block;
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.sm};
`;

export const Input = styled.input<{ $hasError?: boolean }>`
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

export const Select = styled.select`
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

export const ErrorText = styled.span`
  display: block;
  color: ${theme.colors.status.error};
  font-size: ${theme.typography.fontSize.sm};
  margin-top: ${theme.spacing.xs};
`;

export const HelpText = styled.span`
  display: block;
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.xs};
  margin-top: ${theme.spacing.xs};
  font-style: italic;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${theme.spacing.xl};
`;

export const Button = styled.button`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.fontWeight.medium};
  font-size: ${theme.typography.fontSize.base};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  border: none;
`;

export const CancelButton = styled(Button)`
  background-color: ${theme.colors.neutral.gray200};
  color: ${theme.colors.text.secondary};

  &:hover {
    background-color: ${theme.colors.neutral.gray300};
    color: ${theme.colors.text.primary};
  }
`;

export const SubmitButton = styled(Button)`
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

export const TeamList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 240px;
  overflow-y: auto;
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  background-color: ${theme.colors.background.primary};
`;

export const TeamItem = styled.li`
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