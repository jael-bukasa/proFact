import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import axios from 'axios';

// --- IMPORTS ---
import BarreLaterale from './composants/barreLaterale';
import TableauDeBord from './composants/gestionLocative/tableauDeBord';
import Clients from './composants/gestionLocative/clients';
import Facturation from './composants/comptabilite/facturation';
import Paiements from './composants/comptabilite/paiements';
import Rapports from './composants/comptabilite/rapports';

// --- IMPORTS GESTION UTILISATEURS ---
import CreationsComptes from './composants/gestionsUtilisateurs/creationsComptes';
import GererComptes from './composants/gestionsUtilisateurs/gererComptes';

// --- IMPORTS AUTHENTIFICATION & PROFIL ---
import Connexion from './composants/profil/connexion/connexion';
import CreerCompte from './composants/profil/connexion/creerCompte';
import Deconnexion from './composants/profil/deconnexion/deconnexion';
import Profil from './composants/profil/profil';

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
    background: linear-gradient(135deg, #070a13 0%, #0d1527 100%);
    color: #FFFFFF;
    font-family: 'Inter', system-ui, sans-serif;
  }
`;

const THEME = {
  fondApplication: 'transparent',
  accentuation: '#AEEA00',
  bordure: 'rgba(255, 255, 255, 0.08)'
};

const ConteneurApp = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: ${THEME.fondApplication};
`;

const ConteneurContenuPrincipal = styled.main`
  flex: 1;
  min-width: 0;
  padding: 2.5rem;
  overflow-y: auto;
  background: radial-gradient(circle at 80% 10%, rgba(174, 234, 0, 0.03) 0%, rgba(13, 21, 39, 0.3) 60%, rgba(7, 10, 19, 0.5) 100%);
  backdrop-filter: blur(8px);
`;

const ZoneAnimee = styled.div`
  animation: ${transitionDouce} 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
`;

const BadgeStatutApi = styled.div`
  position: fixed;
  bottom: 1.2rem;
  right: 1.5rem;
  padding: 0.5rem 1rem;
  border-radius: 30px;
  background-color: rgba(13, 21, 39, 0.6);
  border: 1px solid ${THEME.bordure};
  backdrop-filter: blur(12px);
  color: #FFFFFF;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  z-index: 100;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
`;

const VoyantSignal = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => (props.$connecte ? '#22c55e' : '#ef4444')};
  animation: ${props => (props.$connecte ? pulsionSignal : 'none')} 2s infinite;
`;

export default function App() {
  const [etatAuth, setEtatAuth] = useState('connecte');
  const [ongletActif, setOngletActif] = useState('Tableau de bord');
  const [clientSelectionne, setClientSelectionne] = useState(null);
  const [backendConnecte, setBackendConnecte] = useState(false);

  const utilisateurActuel = {
    prenom: 'Bukasa',
    nom: 'Mulaji',
    role: 'Administrateur',
    email: 'bukasa@profact.com'
  };

  const [clientsEnregistres, setClientsEnregistres] = useState(() => {
    try {
      const sauvegarde = localStorage.getItem('proFact_clientsEnregistres');
      return sauvegarde ? JSON.parse(sauvegarde) : [];
    } catch (e) {
      return [];
    }
  });

  // Gestion des comptes facturiers (avec localStorage)
  const [facturiers, setFacturiers] = useState(() => {
    try {
      const sauvegarde = localStorage.getItem('proFact_facturiers');
      return sauvegarde ? JSON.parse(sauvegarde) : [
        { id: 1, prenom: 'Jean', nom: 'Dupont', email: 'jean.dupont@profact.com', role: 'Facturier principal' }
      ];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('proFact_facturiers', JSON.stringify(facturiers));
    } catch (e) {
      console.error("Erreur sauvegarde localStorage facturiers", e);
    }
  }, [facturiers]);

  const ajouterFacturier = (nouveau) => {
    setFacturiers([nouveau, ...facturiers]);
  };

  const supprimerFacturier = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce compte facturier ?")) {
      setFacturiers(facturiers.filter(f => f.id !== id));
    }
  };

  const formaterDateFr = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return isNaN(date) ? dateString : date.toLocaleDateString('fr-FR');
  };

  useEffect(() => {
    const gererStockageChange = (e) => {
      if (e.key === 'proFact_clientsEnregistres' && e.newValue) {
        try {
          setClientsEnregistres(JSON.parse(e.newValue));
        } catch (err) {
          console.error("Erreur parsing localStorage", err);
        }
      }
    };
    window.addEventListener('storage', gererStockageChange);
    return () => window.removeEventListener('storage', gererStockageChange);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('proFact_clientsEnregistres', JSON.stringify(clientsEnregistres));
    } catch (e) {
      console.error("Erreur de sauvegarde localStorage", e);
    }
  }, [clientsEnregistres]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/health')
      .then(reponse => setBackendConnecte(reponse.data.status === 'ok'))
      .catch(() => setBackendConnecte(false));
  }, []);

  const allerAFacturation = (client) => {
    setClientSelectionne(client);
    setOngletActif('Facturation');
  };

  if (etatAuth === 'connexion') {
    return (
      <>
        <StyleGlobal />
        <Connexion 
          surConnexionReussie={() => setEtatAuth('connecte')} 
          allerVersInscription={() => setEtatAuth('inscription')} 
        />
      </>
    );
  }

  if (etatAuth === 'inscription') {
    return (
      <>
        <StyleGlobal />
        <CreerCompte 
          surInscriptionReussie={() => setEtatAuth('connecte')} 
          allerVersConnexion={() => setEtatAuth('connexion')} 
        />
      </>
    );
  }

  const afficherPageCourante = () => {
    switch (ongletActif) {
      case 'Tableau de bord':
        return (
          <TableauDeBord 
            clientsEnregistres={clientsEnregistres} 
            onSelectClient={allerAFacturation}
            onNouvelleFacture={() => { setClientSelectionne(null); setOngletActif('Facturation'); }} 
          />
        );
      case 'Clients':
        return (
          <Clients 
            onNaviguerVersFacturation={allerAFacturation} 
            clientsEnregistres={clientsEnregistres}
            setClientsEnregistres={setClientsEnregistres}
          />
        );
      case 'Facturation':
        return (
          <Facturation 
            clientSelectionne={clientSelectionne} 
            clientsEnregistres={clientsEnregistres}
            setClientsEnregistres={setClientsEnregistres}
            formaterDateFr={formaterDateFr}
            onRetour={() => setOngletActif('Tableau de bord')} 
          />
        );
      case 'Paiements':
        return (
          <Paiements 
            listeFactures={clientsEnregistres} 
            onMettreAJourPaiement={setClientsEnregistres} 
          />
        );
      case 'Rapports':
        return <Rapports />;
      
      // --- NOUVEAUX ONGLETS AJOUTÉS ICI ---
      case 'Créer un compte':
        return <CreationsComptes surAjoutFacturier={ajouterFacturier} />;
      case 'Gérer les comptes':
        return <GererComptes facturiers={facturiers} surSupprimerFacturier={supprimerFacturier} />;

      case 'Voir Profil':
        return (
          <div>
            <h1>Mon Profil</h1>
            <Profil utilisateur={utilisateurActuel} />
          </div>
        );
      case 'Parametres':
        return <h1>Paramètres de l'application</h1>;
      case 'Deconnexion':
        return (
          <Deconnexion surDeconnexion={() => setEtatAuth('connexion')} />
        );
      default:
        return (
          <TableauDeBord 
            clientsEnregistres={clientsEnregistres} 
            onSelectClient={allerAFacturation}
            onNouvelleFacture={() => { setClientSelectionne(null); setOngletActif('Facturation'); }} 
          />
        );
    }
  };

  return (
    <>
      <StyleGlobal />
      <ConteneurApp>
        <BarreLaterale 
          ongletActif={ongletActif} 
          auChangementOnglet={(element) => {
            if (element !== 'Facturation') setClientSelectionne(null);
            setOngletActif(element);
          }} 
          surDeconnexionEffective={() => setEtatAuth('connexion')}
        />
        <ConteneurContenuPrincipal>
          <ZoneAnimee key={ongletActif}>
            {afficherPageCourante()}
          </ZoneAnimee>
        </ConteneurContenuPrincipal>
        <BadgeStatutApi>
          <VoyantSignal $connecte={backendConnecte} />
          <span>{backendConnecte ? 'Connecté' : 'Hors ligne'}</span>
        </BadgeStatutApi>
      </ConteneurApp>
    </>
  );
}