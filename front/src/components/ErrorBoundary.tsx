import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>Oops! Something went wrong</ErrorTitle>
          <ErrorMessage>
            {this.state.error?.message || 'An unexpected error occurred'}
          </ErrorMessage>
          <RetryButton onClick={() => this.setState({ hasError: false, error: undefined })}>
            Try Again
          </RetryButton>
          <ReloadButton onClick={() => window.location.reload()}>
            Reload Page
          </ReloadButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

// Styled components for the error UI
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${theme.spacing.xl};
  background-color: ${theme.colors.background.primary};
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${theme.spacing.lg};
`;

const ErrorTitle = styled.h1`
  font-family: ${theme.typography.fontFamily.heading};
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.md};
`;

const ErrorMessage = styled.p`
  font-size: ${theme.typography.fontSize.base};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.xl};
  max-width: 500px;
  line-height: 1.6;
`;

const RetryButton = styled.button`
  background-color: ${theme.colors.primary.main};
  color: ${theme.colors.text.light};
  border: none;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  margin-bottom: ${theme.spacing.md};

  &:hover {
    background-color: ${theme.colors.primary.light};
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.sm};
  }
`;

const ReloadButton = styled.button`
  background-color: transparent;
  color: ${theme.colors.text.secondary};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  font-size: ${theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background-color: ${theme.colors.neutral.gray100};
    border-color: ${theme.colors.border.medium};
  }
`;

export default ErrorBoundary;