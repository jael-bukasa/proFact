import React, { useState, useEffect, useRef } from 'react';
import styled, { ThemeProvider, createGlobalStyle, keyframes } from 'styled-components';
import axios from 'axios';

// --- IMPORT DU THÈME UNIQUE ---
import { themeSombre } from './styles/themes';

// --- IMPORTS ---
import BarreLaterale from './composants/barreLaterale';
import TableauDeBord from './composants/gestionLocative/tableauDeBord';
import Clients from './composants/gestionLocative/clients';
import Facturation from './composants/comptabilite/facturation';
import Rapports from './composants/comptabilite/rapports';

// --- IMPORT BANQUES ---
import Banques from './composants/finances/banques';

// --- IMPORTS GESTION UTILISATEURS ---
import CreationsComptes from './composants/gestionsUtilisateurs/creationsComptes';
import GererComptes from './composants/gestionsUtilisateurs/gererComptes';

// --- IMPORTS AUTHENTIFICATION & PROFIL ---
import Connexion from './composants/profil/connexion/connexion';
import CreerCompte from './composants/profil/connexion/creerCompte';
import Deconnexion from './composants/profil/deconnexion';
import Parametres from './composants/profil/parametres';
import Profil from './composants/profil';

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
    background: ${props => props.theme.fondApplication};
    color: ${props => props.theme.textePrincipal};
    font-family: 'Inter', system-ui, sans-serif;
  }
`;

const ConteneurApp = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: ${props => props.theme.fondApplication};
`;

const ConteneurContenuPrincipal = styled.main`
  flex: 1;
  min-width: 0;
  padding: 2.5rem;
  overflow-y: auto;
  background-color: ${props => props.theme.fondApplication};

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
    background: ${props => props.theme.primaire};
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
  background-color: ${props => props.theme.fondBloc};
  border: 1px solid ${props => props.theme.bordure};
  backdrop-filter: blur(12px);
  color: ${props => props.theme.textePrincipal};
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
    id: null,
    prenom: 'Jaël',
    nom: 'Mulaji',
    postnom: 'Bukasa',
    role: 'Facturier',
    email: 'jaelbuk08@gmail.com'
  });

  const estAdmin = (utilisateurActuel.role || '').toLowerCase().includes('admin');

  const [ongletActif, setOngletActif] = useState(estAdmin ? 'Tableau de bord' : 'Clients');
  const [clientSelectionne, setClientSelectionne] = useState(null);
  const [backendConnecte, setBackendConnecte] = useState(false);

  // États centralisés reliés à l'API
  const [clientsEnregistres, setClientsEnregistres] = useState([]);
  const [facturesEnregistrees, setFacturesEnregistrees] = useState([]);
  const [banquesEnregistrees, setBanquesEnregistrees] = useState([]);
  const [utilisateursSysteme, setUtilisateursSysteme] = useState([]);

  // Remet le scroll en haut au changement d'onglet
  useEffect(() => {
    if (referenceContenu.current) {
      referenceContenu.current.scrollTop = 0;
    }
  }, [ongletActif]);

  // --- CHARGEMENT DES DONNÉES DEPUIS LE BACKEND (API) ---
  useEffect(() => {
    axios.get('http://localhost:5000/api/health')
      .then(reponse => setBackendConnecte(reponse.data.status === 'ok'))
      .catch(() => setBackendConnecte(false));

    axios.get('http://localhost:5000/api/clients')
      .then(reponse => {
        if (reponse.data) setClientsEnregistres(Array.isArray(reponse.data) ? reponse.data : []);
      })
      .catch(err => console.error("Impossible de récupérer les clients", err));

    axios.get('http://localhost:5000/api/factures')
      .then(reponse => {
        if (reponse.data) setFacturesEnregistrees(reponse.data);
      })
      .catch(err => console.error("Impossible de récupérer les factures", err));

    axios.get('http://localhost:5000/api/banques')
      .then(reponse => {
        if (reponse.data) setBanquesEnregistrees(Array.isArray(reponse.data) ? reponse.data : []);
      })
      .catch(err => console.error("Impossible de récupérer les banques", err));

    chargerUtilisateursBackend();
  }, []);

  const chargerUtilisateursBackend = async () => {
    try {
      const [adminsRes, facturiersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin').catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/facturiers').catch(() => ({ data: [] }))
      ]);

      const adminsFormates = (adminsRes.data || []).map(a => ({ ...a, role: 'Admin' }));
      const facturiersFormates = (facturiersRes.data || []).map(f => ({ ...f, role: 'Facturier' }));

      setUtilisateursSysteme([...adminsFormates, ...facturiersFormates]);
    } catch (err) {
      console.error("Erreur lors de la récupération des utilisateurs de la base de données", err);
    }
  };

  const ajouterFacturier = async (nouveau) => {
    try {
      const route = nouveau.role?.toLowerCase().includes('admin') 
        ? 'http://localhost:5000/api/admin' 
        : 'http://localhost:5000/api/facturiers';

      await axios.post(route, nouveau);
      chargerUtilisateursBackend();
    } catch (err) {
      console.error("Erreur lors de l'ajout de l'utilisateur", err);
    }
  };

  const modifierFacturier = async (id, donneesModifiees) => {
    try {
      const route = `http://localhost:5000/api/utilisateurs/${id}`;
      await axios.put(route, donneesModifiees);
      chargerUtilisateursBackend();
    } catch (err) {
      console.error("Erreur lors de la modification de l'utilisateur", err);
    }
  };

  const supprimerFacturier = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce compte de la base de données ?")) {
      try {
        const route = `http://localhost:5000/api/utilisateurs/${id}`;
        await axios.delete(route);
        chargerUtilisateursBackend();
      } catch (err) {
        console.error("Erreur lors de la suppression de l'utilisateur", err);
      }
    }
  };

  const formaterDateFr = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return isNaN(date) ? dateString : date.toLocaleDateString('fr-FR');
  };

  const allerAFacturation = (client) => {
    setClientSelectionne(client);
    setOngletActif('Facturation');
  };

  if (etatAuth === 'connexion') {
    return (
      <ThemeProvider theme={themeSombre}>
        <StyleGlobal />
        <Connexion 
          surConnexionReussie={(donneesUtilisateur) => {
            if (donneesUtilisateur) {
              setUtilisateurActuel({
                id: donneesUtilisateur.id || donneesUtilisateur._id,
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
      </ThemeProvider>
    );
  }

  if (etatAuth === 'inscription') {
    return (
      <ThemeProvider theme={themeSombre}>
        <StyleGlobal />
        <CreerCompte 
          surInscriptionReussie={(donneesUtilisateur) => {
            if (donneesUtilisateur) {
              setUtilisateurActuel({
                id: donneesUtilisateur.id || donneesUtilisateur._id,
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
      </ThemeProvider>
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
            facturiers={utilisateursSysteme}
            surSupprimerFacturier={supprimerFacturier} 
            surModifierFacturier={modifierFacturier}
          />
        );

      case 'Parametres':
        return (
          <Parametres 
            utilisateurConnecte={utilisateurActuel} 
            surModificationUtilisateur={(donneesModifiees) => {
              setUtilisateurActuel(prev => ({ ...prev, ...donneesModifiees }));
            }}
          />
        );

      case 'Profil':
      case 'Voir Profil':
        return (
          <Profil 
            utilisateurConnecte={utilisateurActuel} 
            surModificationUtilisateur={(donneesModifiees) => {
              setUtilisateurActuel(prev => ({ ...prev, ...donneesModifiees }));
            }}
          />
        );

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
    <ThemeProvider theme={themeSombre}>
      <StyleGlobal />
      <ConteneurApp>
        <BarreLaterale 
          ongletActif={ongletActif} 
          auChangementOnglet={(element) => {
            if (element !== 'Facturation') setClientSelectionne(null);
            setOngletActif(element);
          }} 
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
    </ThemeProvider>
  );
}