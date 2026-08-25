import React from 'react';
import styled, { keyframes } from 'styled-components';

const apparition = keyframes`
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
`;

const tourner = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(174, 234, 0, 0.4); }
  70% { transform: scale(1.08); box-shadow: 0 0 0 14px rgba(174, 234, 0, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(174, 234, 0, 0); }
`;

const OverlayTransition = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.88);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${apparition} 0.3s ease-out forwards;
`;

/* Conteneur sans bordure ni fond de carte */
const ConteneurMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  max-width: 380px;
  padding: 2rem;
  position: relative;
`;

const DisqueFlottant = styled.div`
  width: 72px;
  height: 72px;
  background: radial-gradient(circle at 30% 30%, #b8f500, #AEEA00);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px rgba(174, 234, 0, 0.3);
  animation: ${pulse} 2s infinite ease-in-out;
  margin-bottom: 0.5rem;
`;

const Spinner = styled.div`
  width: 28px;
  height: 28px;
  border: 3px solid rgba(0, 0, 0, 0.2);
  border-top: 3px solid #000000;
  border-radius: 50%;
  animation: ${tourner} 0.8s linear infinite;
`;

const Titre = styled.h3`
  color: #FFFFFF;
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: -0.01em;

  span {
    color: #AEEA00;
  }
`;

const Description = styled.p`
  color: #888888;
  font-size: 0.9rem;
  line-height: 1.5;
`;

export default function MessageBienvenue({ nomUtilisateur }) {
  return (
    <OverlayTransition>
      <ConteneurMessage>
        <DisqueFlottant>
          <Spinner />
        </DisqueFlottant>

        <Titre>
          Bon retour, <span>{nomUtilisateur || 'Administrateur'}</span> 👋
        </Titre>

        <Description>
          Connexion établie avec succès. Chargement de votre espace ProFact en cours...
        </Description>
      </ConteneurMessage>
    </OverlayTransition>
  );
}