import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import axios from 'axios';

// --- IMPORTS ---
import BarreLaterale from './composants/barreLaterale';
import TableauDeBord from './composants/gestionLocative/tableauDeBord';
import Clients from './composants/gestionLocative/clients';
import Logements from './composants/gestionLocative/logements';
import Facturation from './composants/comptabilite/facturation';
import Paiements from './composants/comptabilite/paiements';
import Rapports from './composants/comptabilite/rapports';

// --- ANIMATIONS ---
const transitionDouce = keyframes`
  0% { opacity: 0; transform: translateY(12px) scale(0.995); filter: blur(4px); }
  100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
`;

const pulsionSignal = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(174, 234, 0, 0.4); }
  70% { box-shadow: 0 0 0 8px rgba(174, 234, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(174, 234, 0, 0); }
`;

// --- STYLES GLOBAUX ---
const StyleGlobal = createGlobalStyle`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body, #root {
    width: 100%; height: 100%; overflow: hidden;
    background-color: #000000; color: #FFFFFF;
    font-family: 'Inter', system-ui, sans-serif;
  }
`;

const THEME = {
  fondApplication: '#000000',
  accentuation: '#AEEA00',
  bordure: '#2A2A2A'
};

const ConteneurApp = styled.div` display: flex; height: 100vh; width: 100%; background-color: ${THEME.fondApplication}; `;

const ConteneurContenuPrincipal = styled.main`
  flex: 1; min-width: 0; padding: 2.5rem; overflow-y: auto;
  background: radial-gradient(circle at 80% 10%, rgba(30, 30, 30, 0.4) 0%, rgba(0, 0, 0, 1) 70%);
`;

const ZoneAnimee = styled.div` animation: ${transitionDouce} 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards; `;

const BadgeStatutApi = styled.div`
  position: fixed; bottom: 1.2rem; right: 1.5rem; padding: 0.5rem 1rem;
  border-radius: 30px; background-color: rgba(30, 30, 30, 0.85); border: 1px solid ${THEME.bordure};
  backdrop-filter: blur(10px); color: #FFFFFF; font-size: 0.75rem; display: flex; align-items: center; gap: 0.6rem; z-index: 100;
`;

const VoyantSignal = styled.span`
  width: 8px; height: 8px; border-radius: 50%;
  background-color: ${props => (props.$connecte ? '#22c55e' : '#ef4444')};
  animation: ${props => (props.$connecte ? pulsionSignal : 'none')} 2s infinite;
`;

export default function App() {
  const [ongletActif, setOngletActif] = useState('Tableau de bord');
  const [clientSelectionne, setClientSelectionne] = useState(null); // Stocke le client pour la facture
  const [backendConnecte, setBackendConnecte] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/health')
      .then(reponse => setBackendConnecte(reponse.data.status === 'ok'))
      .catch(() => setBackendConnecte(false));
  }, []);

  // Fonction appelée par le composant <Clients /> lors du clic "Facturer"
  const allerAFacturation = (client) => {
    setClientSelectionne(client);
    setOngletActif('Facturation');
  };

  const afficherPageCourante = () => {
    switch (ongletActif) {
      case 'Tableau de bord':
        return <TableauDeBord onNouvelleFacture={() => { setClientSelectionne(null); setOngletActif('Facturation'); }} />;
      case 'Clients':
        return <Clients onNaviguerVersFacturation={allerAFacturation} />;
      case 'Logements':
        return <Logements />;
      case 'Facturation':
        return <Facturation clientSelectionne={clientSelectionne} onRetour={() => setOngletActif('Tableau de bord')} />;
      case 'Paiements':
        return <Paiements />;
      case 'Rapports':
        return <Rapports />;
      default:
        return <TableauDeBord />;
    }
  };

  return (
    <>
      <StyleGlobal />
      <ConteneurApp>
        <BarreLaterale 
          ongletActif={ongletActif} 
          auChangementOnglet={(element) => {
            if (element !== 'Facturation') setClientSelectionne(null); // Nettoie si on change de page
            setOngletActif(element);
          }} 
        />
        <ConteneurContenuPrincipal>
          <ZoneAnimee key={ongletActif}>
            {afficherPageCourante()}
          </ZoneAnimee>
        </ConteneurContenuPrincipal>
        <BadgeStatutApi>
          <VoyantSignal $connecte={backendConnecte} />
          <span>{backendConnecte ? 'Connectée' : 'Hors ligne'}</span>
        </BadgeStatutApi>
      </ConteneurApp>
    </>
  );
}