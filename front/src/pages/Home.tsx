import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #1e5631 0%, #2d8a43 100%);
  padding: 20px;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: clamp(2.5rem, 8vw, 5rem);
  color: white;
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  font-weight: bold;
`;

const EnterButton = styled.button`
  background-color: #f8f8f8;
  color: #1e5631;
  font-size: clamp(1rem, 4vw, 1.5rem);
  font-weight: bold;
  padding: 0.8em 2em;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background-color: white;
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }
`;

const Logo = styled.div`
  font-size: clamp(1rem, 3vw, 1.8rem);
  color: #f8f8f8;
  margin-bottom: 1rem;
  font-style: italic;
  opacity: 0.9;
`;

const Home = () => {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate('/tournament');
  };

  return (
    <HomeContainer>
      <Logo>Belote Royale</Logo>
      <Title>Tournoi de Belote</Title>
      <EnterButton onClick={handleEnter}>Entrer</EnterButton>
    </HomeContainer>
  );
};

export default Home;