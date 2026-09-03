import React, { useState, useEffect, useRef } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import axios from 'axios';

// --- IMPORTS ---
import BarreLaterale from './composants/barreLaterale';
import TableauDeBord from './composants/gestionLocative/tableauDeBord';
import Clients from './composants/gestionLocative/clients';
import Facturation from './composants/comptabilite/facturation';
import Rapports from './composants/comptabilite/rapports';

// --- IMPORT BANQUES (depuis le dossier finances) ---
import Banques from './composants/finances/banques';

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
    background: #000000;
    color: #FFFFFF;
    font-family: 'Inter', system-ui, sans-serif;
  }
`;

const THEME = {
  fondApplication: '#000000',
  accentuation: '#22c55e',
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
  background-color: #000000;

  scrollbar-gutter: stable;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    margin: 8px 0;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.25);
    border-radius: 20px;
    min-height: 40px;
    transition: background 0.2s ease;
  }

  &::-webkit-scrollbar-thumb:hover,
  &::-webkit-scrollbar-thumb:active {
    background: ${THEME.accentuation};
  }
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
  background-color: #1E1E1E;
  border: 1px solid ${THEME.bordure};
  backdrop-filter: blur(12px);
  color: #FFFFFF;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  z-index: 100;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
`;

const VoyantSignal = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => (props.$connecte ? '#22c55e' : '#ef4444')};
  animation: ${props => (props.$connecte ? pulsionSignal : 'none')} 2s infinite;
`;

export default function App() {
  const [etatAuth, setEtatAuth] = useState('connexion');
  const referenceContenu = useRef(null);

  const [utilisateurActuel, setUtilisateurActuel] = useState({
    prenom: 'Jaël',
    nom: 'Mulaji',
    postnom: 'Bukasa',
    role: 'Facturier',
    email: 'jaelbuk08@gmail.com'
  });

  const estAdmin = utilisateurActuel.role.toLowerCase().includes('admin');

  const [ongletActif, setOngletActif] = useState(estAdmin ? 'Tableau de bord' : 'Clients');
  const [clientSelectionne, setClientSelectionne] = useState(null);
  const [backendConnecte, setBackendConnecte] = useState(false);

  // États centralisés
  const [clientsEnregistres, setClientsEnregistres] = useState([]);
  const [facturesEnregistrees, setFacturesEnregistrees] = useState([]);
  const [banquesEnregistrees, setBanquesEnregistrees] = useState([]);

  const [facturiers, setFacturiers] = useState(() => {
    try {
      const sauvegarde = localStorage.getItem('proFact_facturiers');
      return sauvegarde ? JSON.parse(sauvegarde) : [
        { id: 1, prenom: 'Jaël', nom: 'Mulaji', postnom: 'Bukasa', email: 'jaelbuk08@gmail.com', role: 'Admin', motDePasse: 'secret123' }
      ];
    } catch (e) {
      return [];
    }
  });

  // Remet le scroll en haut au changement d'onglet
  useEffect(() => {
    if (referenceContenu.current) {
      referenceContenu.current.scrollTop = 0;
    }
  }, [ongletActif]);

  // Charger les clients depuis l'API backend
  useEffect(() => {
    const chargerClientsGlobal = async () => {
      try {
        const reponse = await axios.get('http://localhost:5000/api/clients');
        if (reponse.data) {
          setClientsEnregistres(Array.isArray(reponse.data) ? reponse.data : []);
        }
      } catch (err) {
        console.error("Impossible de récupérer les clients", err);
      }
    };
    chargerClientsGlobal();
  }, []);

  // Charger les factures depuis l'API backend
  useEffect(() => {
    const chargerFacturesGlobal = async () => {
      try {
        const reponse = await axios.get('http://localhost:5000/api/factures');
        if (reponse.data) {
          setFacturesEnregistrees(reponse.data);
        }
      } catch (err) {
        console.error("Impossible de récupérer les factures", err);
      }
    };
    chargerFacturesGlobal();
  }, []);

  // Charger les banques depuis l'API backend
  useEffect(() => {
    const chargerBanquesGlobal = async () => {
      try {
        const reponse = await axios.get('http://localhost:5000/api/banques');
        if (reponse.data) {
          setBanquesEnregistrees(Array.isArray(reponse.data) ? reponse.data : []);
        }
      } catch (err) {
        console.error("Impossible de récupérer les banques", err);
      }
    };
    chargerBanquesGlobal();
  }, []);

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

  const modifierFacturier = (id, donneesModifiees) => {
    setFacturiers(facturiers.map(f => (f.id === id ? { ...f, ...donneesModifiees } : f)));
  };

  const supprimerFacturier = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce compte ?")) {
      setFacturiers(facturiers.filter(f => f.id !== id));
    }
  };

  const formaterDateFr = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return isNaN(date) ? dateString : date.toLocaleDateString('fr-FR');
  };

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
          surConnexionReussie={(donneesUtilisateur) => {
            if (donneesUtilisateur) {
              setUtilisateurActuel({
                prenom: donneesUtilisateur.prenom || 'Jaël',
                nom: donneesUtilisateur.nom || 'Mulaji',
                postnom: donneesUtilisateur.postnom || 'Bukasa',
                role: donneesUtilisateur.role || 'Facturier',
                email: donneesUtilisateur.email || 'jaelbuk08@gmail.com'
              });
              const isAdminConnexion = donneesUtilisateur.role?.toLowerCase().includes('admin');
              setOngletActif(isAdminConnexion ? 'Tableau de bord' : 'Clients');
            }
            setEtatAuth('connecte');
          }} 
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
          surInscriptionReussie={(donneesUtilisateur) => {
            if (donneesUtilisateur) {
              setUtilisateurActuel({
                prenom: donneesUtilisateur.prenom || 'Jaël',
                nom: donneesUtilisateur.nom || 'Mulaji',
                postnom: donneesUtilisateur.postnom || 'Bukasa',
                role: donneesUtilisateur.role || 'Facturier',
                email: donneesUtilisateur.email || 'jaelbuk08@gmail.com'
              });
              const isAdminInscription = donneesUtilisateur.role?.toLowerCase().includes('admin');
              setOngletActif(isAdminInscription ? 'Tableau de bord' : 'Clients');
            }
            setEtatAuth('connecte');
          }} 
          allerVersConnexion={() => setEtatAuth('connexion')} 
        />
      </>
    );
  }

  const afficherPageCourante = () => {
    switch (ongletActif) {
      case 'Tableau de bord':
        if (!estAdmin) {
          return (
            <Clients 
              onNaviguerVersFacturation={allerAFacturation} 
              clientsEnregistres={clientsEnregistres}
              setClientsEnregistres={setClientsEnregistres}
            />
          );
        }
        return (
          <TableauDeBord 
            clientsEnregistres={clientsEnregistres} 
            onSelectClient={allerAFacturation}
            onNouvelleFacture={() => { setClientSelectionne(null); setOngletActif('Facturation'); }} 
            utilisateurConnecte={utilisateurActuel}
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
            listeFacturesAPI={facturesEnregistrees}
            setListeFacturesAPI={setFacturesEnregistrees}
            formaterDateFr={formaterDateFr}
            onRetour={() => setOngletActif(estAdmin ? 'Tableau de bord' : 'Clients')} 
          />
        );
      case 'Banques':
        return (
          <Banques 
            banquesEnregistrees={banquesEnregistrees}
            setBanquesEnregistrees={setBanquesEnregistrees}
          />
        );
      case 'Rapports':
        return <Rapports />;

      case 'Créer un compte':
        return <CreationsComptes surAjoutFacturier={ajouterFacturier} />;

      case 'Gérer les comptes':
        return (
          <GererComptes 
            facturiers={facturiers} 
            surSupprimerFacturier={supprimerFacturier} 
            surModifierFacturier={modifierFacturier}
          />
        );

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
          <Clients 
            onNaviguerVersFacturation={allerAFacturation} 
            clientsEnregistres={clientsEnregistres}
            setClientsEnregistres={setClientsEnregistres}
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
          utilisateurConnecte={utilisateurActuel}
        />
        <ConteneurContenuPrincipal ref={referenceContenu}>
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