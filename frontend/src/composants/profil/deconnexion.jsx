import React, { useState, useEffect } from 'react';
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
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 77, 77, 0.4); }
  70% { transform: scale(1.08); box-shadow: 0 0 0 14px rgba(255, 77, 77, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 77, 77, 0); }
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
  background: radial-gradient(circle at 30% 30%, #ff6b6b, #ff4d4d);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px rgba(255, 77, 77, 0.3);
  animation: ${pulse} 2s infinite ease-in-out;
  margin-bottom: 0.5rem;
`;

const Spinner = styled.div`
  width: 28px;
  height: 28px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top: 3px solid #ffffff;
  border-radius: 50%;
  animation: ${tourner} 0.8s linear infinite;
`;

const TitreOverlay = styled.h3`
  color: #FFFFFF;
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: -0.01em;

  span {
    color: #ff4d4d;
  }
`;

const DescriptionOverlay = styled.p`
  color: #888888;
  font-size: 0.9rem;
  line-height: 1.5;
`;

export default function Deconnexion({ surDeconnexion }) {
  useEffect(() => {
    // Lance le compte à rebours dès l'affichage du composant de déconnexion
    const minuterie = setTimeout(() => {
      if (surDeconnexion) {
        surDeconnexion();
      }
    }, 1500); // Durée de l'animation de chargement (1.5 seconde)

    return () => clearTimeout(minuterie);
  }, [surDeconnexion]);

  return (
    <OverlayTransition>
      <ConteneurMessage>
        <DisqueFlottant>
          <Spinner />
        </DisqueFlottant>
        <TitreOverlay>
          Fermeture de la <span>session</span>...
        </TitreOverlay>
        <DescriptionOverlay>
          Sécurisation et nettoyage de vos données ProFact en cours. À bientôt !
        </DescriptionOverlay>
      </ConteneurMessage>
    </OverlayTransition>
  );
}