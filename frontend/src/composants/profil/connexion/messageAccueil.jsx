import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const apparition = keyframes`
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(174, 234, 0, 0.4); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(174, 234, 0, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(174, 234, 0, 0); }
`;

const rotation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const OverlayTransition = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${apparition} 0.3s ease-out forwards;
  padding: 1rem;
`;

const CarteAccueil = styled.div`
  background-color: #121212;
  border: 1px solid #2A2A2A;
  border-radius: 16px;
  padding: 2.5rem;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  position: relative;
  overflow: visible;
`;

const DisqueFlottant = styled.div`
  position: absolute;
  right: -32px;
  top: 45px;
  width: 68px;
  height: 68px;
  background: radial-gradient(circle at 30% 30%, #b8f500, #AEEA00);
  border-radius: 50%;
  border: 4px solid #121212;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
  box-shadow: 0 10px 25px rgba(174, 234, 0, 0.3);
  animation: ${pulse} 2s infinite ease-in-out;
  z-index: 10;

  svg {
    width: 28px;
    height: 28px;
    fill: #000000;
  }
`;

const SpinnerChargement = styled.div`
  width: 28px;
  height: 28px;
  border: 3px solid rgba(0, 0, 0, 0.2);
  border-top: 3px solid #000000;
  border-radius: 50%;
  animation: ${rotation} 0.8s linear infinite;
`;

const ConteneurCercles = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const CercleEtape = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  background-color: ${(props) => (props.$actif || props.$complete ? '#AEEA00' : '#1A1A1A')};
  color: ${(props) => (props.$actif || props.$complete ? '#000000' : '#666666')};
  border: 2px solid ${(props) => (props.$actif || props.$complete ? '#AEEA00' : '#2A2A2A')};
  transition: all 0.3s ease;
`;

const EnTeteEtape = styled.div`
  span {
    color: #AEEA00;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  h3 {
    color: #FFFFFF;
    font-size: 1.4rem;
    font-weight: 700;
    margin-top: 0.4rem;
  }
`;

const DescriptionEtape = styled.p`
  color: #AAAAAA;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const ConteneurActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 1rem;
  gap: 1rem;
`;

const BoutonSecondaire = styled.button`
  padding: 0.7rem 1.2rem;
  background-color: transparent;
  color: #888888;
  border: 1px solid #2A2A2A;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  visibility: ${(props) => (props.$visible ? 'visible' : 'hidden')};

  &:hover {
    color: #FFFFFF;
    border-color: #444444;
  }
`;

const BoutonPrimaire = styled.button`
  padding: 0.7rem 1.5rem;
  background-color: #AEEA00;
  color: #000000;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;

  &:hover {
    background-color: #b8f500;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(174, 234, 0, 0.2);
  }

  &:disabled {
    opacity: 0.8;
    cursor: not-allowed;
  }
`;

export default function MessageAccueil({ nomUtilisateur, surTerminer }) {
  const [etapeActuelle, setEtapeActuelle] = useState(0);
  const [enChargement, setEnChargement] = useState(false);

  const etapes = [
    {
      surveiller: "Étape 1 sur 3",
      titre: `Bienvenue sur ProFact, ${nomUtilisateur || 'cher administrateur'} ! 🎉`,
      description: "Votre compte administrateur a été configuré avec succès. ProFact est prêt à simplifier la gestion de l'ensemble de vos biens immobiliers.",
      icone: (
        <svg viewBox="0 0 24 24">
          <path d="M12 2.5s4 3.5 4 9c0 3-1.5 5.5-2 6.5h-4c-.5-1-2-3.5-2-6.5 0-5.5 4-9 4-9zm0 18c-1.1 0-2 .9-2 2h4c0-1.1-.9-2-2-2zM4 11c0 1.7.7 3.2 1.8 4.3L4.4 16.7c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0l1.4-1.4C8.2 17.3 10 18 12 18s3.8-.7 4.8-1.3l1.4 1.4c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4l-1.4-1.4C19.3 14.2 20 12.7 20 11c0-4-3-8-8-8s-8 4-8 8z"/>
        </svg>
      )
    },
    {
      surveiller: "Étape 2 sur 3",
      titre: "Centralisez vos locations",
      description: "Suivez en temps réel l'état d'occupation de vos biens, l'historique de vos locataires et sécurisez vos revenus locatifs en un seul endroit.",
      icone: (
        <svg viewBox="0 0 24 24">
          <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 3.7c1.3 0 2.3 1 2.3 2.3s-1 2.3-2.3 2.3-2.3-1-2.3-2.3 1-2.3 2.3-2.3zM6 18v-4.5c0-.8.7-1.5 1.5-1.5h9c.8 0 1.5.7 1.5 1.5V18H6z"/>
        </svg>
      )
    },
    {
      surveiller: "Étape 3 sur 3",
      titre: "Facturation & Rapports",
      description: "Générez des factures professionnelles instantanément et visualisez vos performances financières grâce à des tableaux de bord clairs.",
      icone: (
        <svg viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0-2-.9-2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
        </svg>
      )
    }
  ];

  const handleSuivant = () => {
    if (etapeActuelle < etapes.length - 1) {
      setEtapeActuelle(etapeActuelle + 1);
    } else {
      // Dernière étape : on active le chargement avant de déclencher la fin
      setEnChargement(true);
      setTimeout(() => {
        if (surTerminer) surTerminer();
      }, 1000); // Petit délai de 1 seconde pour apprécier l'animation de chargement
    }
  };

  const handlePrecedent = () => {
    if (etapeActuelle > 0 && !enChargement) {
      setEtapeActuelle(etapeActuelle - 1);
    }
  };

  return (
    <OverlayTransition>
      <CarteAccueil>
        <DisqueFlottant>
          {enChargement ? <SpinnerChargement /> : etapes[etapeActuelle].icone}
        </DisqueFlottant>

        <ConteneurCercles>
          {etapes.map((_, index) => (
            <CercleEtape 
              key={index} 
              $actif={index === etapeActuelle}
              $complete={index < etapeActuelle}
            >
              {index + 1}
            </CercleEtape>
          ))}
        </ConteneurCercles>

        <EnTeteEtape>
          <span>{enChargement ? "Finalisation" : etapes[etapeActuelle].surveiller}</span>
          <h3>{enChargement ? "Préparation de votre espace..." : etapes[etapeActuelle].titre}</h3>
        </EnTeteEtape>

        <DescriptionEtape>
          {enChargement 
            ? "Chargement de vos paramètres et configuration de votre tableau de bord ProFact en cours..." 
            : etapes[etapeActuelle].description}
        </DescriptionEtape>

        <ConteneurActions>
          <BoutonSecondaire 
            onClick={handlePrecedent} 
            $visible={etapeActuelle > 0 && !enChargement}
          >
            Précédent
          </BoutonSecondaire>

          <BoutonPrimaire onClick={handleSuivant} disabled={enChargement}>
            {enChargement ? (
              <SpinnerChargement />
            ) : (
              etapeActuelle === etapes.length - 1 ? "Terminer" : "Suivant"
            )}
          </BoutonPrimaire>
        </ConteneurActions>
      </CarteAccueil>
    </OverlayTransition>
  );
}