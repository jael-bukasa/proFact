import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  FiUsers, 
  FiUserPlus, 
  FiCheckSquare, 
  FiTrash2 
} from 'react-icons/fi';

import ClientsActifs from './clients/clientsActifs';
import ClientsSupprimes from './clients/clientsSupprimes';
import EnregistrementClients from './clients/enregistrementClients';
import ClientsEnregistres from './clients/ClientsEnregistres';

const API_URL = 'http://localhost:5000/api';

const THEME = {
  fondCarte: '#1E1E1E',
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  fondChamp: '#121212'
};

const ConteneurPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const EnTete = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitre = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const TitrePage = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${THEME.textePrincipal};
`;

const SousTitrePage = styled.p`
  color: ${THEME.texteSecondaire};
  font-size: 0.9rem;
`;

const BarreOnglets = styled.div`
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid ${THEME.bordure};
  padding-bottom: 0.5rem;
  overflow-x: auto;
`;

const Onglet = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.$actif ? THEME.accentuation : THEME.texteSecondaire};
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.6rem 1rem;
  cursor: pointer;
  border-bottom: 2px solid ${props => props.$actif ? THEME.accentuation : 'transparent'};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;

  svg {
    font-size: 1rem;
  }

  &:hover {
    color: ${THEME.textePrincipal};
  }
`;

const BadgeCompteur = styled.span`
  background-color: ${props => props.$actif ? 'rgba(174, 234, 0, 0.2)' : '#2A2A2A'};
  color: ${props => props.$actif ? THEME.accentuation : THEME.texteSecondaire};
  padding: 0.15rem 0.55rem;
  border-radius: 12px;
  font-size: 0.75rem;
`;

const MessageNotification = styled(motion.div)`
  padding: 0.85rem 1.2rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  background-color: ${props => props.$type === 'succes' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(174, 234, 0, 0.15)'};
  color: ${props => props.$type === 'succes' ? '#81C784' : THEME.accentuation};
  border: 1px solid ${props => props.$type === 'succes' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(174, 234, 0, 0.3)'};
  margin-top: 1rem;
`;

const extraireHeureAuto = (client) => {
  if (client.heure) return client.heure;
  const dateSource = client.dateEnregistrement || client.creeLe || client.cree_le || client.created_at || new Date();
  const d = new Date(dateSource);
  return !isNaN(d.getTime()) ? d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '--:--';
};

export default function Clients({ clientsEnregistres = [], setClientsEnregistres }) {
  const [listeClients, setListeClients] = useState([]);
  const [listeCorbeille, setListeCorbeille] = useState([]);

  const [ongletActif, setOngletActif] = useState('actifs');
  const [notification, setNotification] = useState(null);
  const [clientSelectionne, setClientSelectionne] = useState(null);
  const [erreursChamps, setErreursChamps] = useState({});

  const [formulaire, setFormulaire] = useState({
    bail: '', 
    dateBail: '', 
    matricule: '', 
    nom: '', 
    postNom: '', 
    prenom: '', 
    logement: '', 
    adresse: '', 
    pays: 'RDC',
    designation: '', 
    typeClient: '', 
    typeFacture: '', 
    devise: 'USD', 
    montant: '', 
    modePaiement: 'Virement',
    reference: '', 
    moisFacture: '', 
    debutContrat: '', 
    finContrat: '', 
    dateComptable: '', 
    compteur: '',
    imputation: '', 
    dernierNumero: '', 
    dernierMontant: '', 
    derniereDate: ''
  });

  useEffect(() => { 
    chargerClients(); 
  }, []);

  const chargerClients = async () => {
    try {
      const resActifs = await axios.get(`${API_URL}/clients`);
      const resEnregistres = await axios.get(`${API_URL}/clients/enregistres`);
      const resCorbeille = await axios.get(`${API_URL}/clients/corbeille`);
      
      const clientsFormates = Array.isArray(resActifs.data) ? resActifs.data.map(c => ({ ...c, heure: extraireHeureAuto(c) })) : [];
      const enregistresFormates = Array.isArray(resEnregistres.data) ? resEnregistres.data.map(c => ({ ...c, heure: extraireHeureAuto(c) })) : [];
      
      setListeClients(clientsFormates);
      if (typeof setClientsEnregistres === 'function') {
        setClientsEnregistres(enregistresFormates);
      }
      setListeCorbeille(Array.isArray(resCorbeille.data) ? resCorbeille.data.map(c => ({ ...c, heure: extraireHeureAuto(c) })) : []);
    } catch (erreur) {
      console.error("Erreur de chargement :", erreur);
    }
  };

  const afficherNotificationProvisoire = (texte, type = 'info', duree = 10000) => {
    setNotification({ texte, type });
    setTimeout(() => setNotification(null), duree);
  };

  const allerAEnregistrementClient = (client) => {
    setClientSelectionne(client);
    setOngletActif('gestion');
    setErreursChamps({});

    if (client) {
      setFormulaire({
        bail: client.bail || '',
        dateBail: client.dateBail ? client.dateBail.split('T')[0] : '',
        matricule: client.matricule || client.client || '',
        nom: client.nom || '',
        postNom: client.postNom || client.postnom || '',
        prenom: client.prenom || '',
        logement: client.logement || client.loc || '',
        adresse: client.adresse || client.adres || '',
        pays: client.pays || 'RDC',
        designation: client.designation || client.designat || '',
        typeClient: client.typeClient || '',
        typeFacture: client.typeFacture || client.type || '',
        devise: client.devise || 'USD',
        montant: client.montant || client.mont || '',
        modePaiement: client.modePaiement || client.mode || 'Virement',
        reference: client.reference || '',
        moisFacture: client.moisFacture || client.moisF || '',
        debutContrat: client.debutContrat ? client.debutContrat.split('T')[0] : '',
        finContrat: client.finContrat ? client.finContrat.split('T')[0] : '',
        dateComptable: client.dateComptable ? client.dateComptable.split('T')[0] : '',
        compteur: client.compteur || client.cpt || '',
        imputation: client.imputation || client.imp || '',
        dernierNumero: client.dernierNumero || client.derN || '',
        dernierMontant: client.dernierMontant || client.derMt || '',
        derniereDate: client.derniereDate ? client.derniereDate.split('T')[0] : ''
      });
    } else {
      reinitialiserFormulaire();
    }
  };

  const handleChangeFormulaire = (e) => {
    const { name, value } = e.target;
    
    setFormulaire(prev => {
      let nouveauForm = { ...prev, [name]: value };
      
      if (name === 'typeClient') {
        let libelleFacture = 'Loyers';
        let prefixeMatricule = 'LOC';

        if (value === 'electricite') {
          libelleFacture = 'Électricité';
          prefixeMatricule = 'ELEC';
        } else if (value === 'eau') {
          libelleFacture = 'Eau';
          prefixeMatricule = 'EAU';
        } else if (value === 'divers') {
          libelleFacture = 'Divers';
          prefixeMatricule = 'DIV';
        } else if (value === 'locataire') {
          libelleFacture = 'Loyers';
          prefixeMatricule = 'LOC';
        }

        nouveauForm.typeFacture = libelleFacture;
        
        const chiffreActuel = prev.matricule ? prev.matricule.replace(/^[A-Z]+-/, '') : '001';
        nouveauForm.matricule = `${prefixeMatricule}-${chiffreActuel || '001'}`;
      }

      return nouveauForm;
    });
    
    if (erreursChamps[name]) {
      setErreursChamps(prev => ({ ...prev, [name]: null }));
    }
  };

  const reinitialiserFormulaire = () => {
    setClientSelectionne(null);
    setErreursChamps({});
    setFormulaire({
      bail: '', dateBail: '', matricule: '', nom: '', postNom: '', prenom: '',
      logement: '', adresse: '', pays: 'RDC', designation: '', typeClient: '', typeFacture: '',
      devise: 'USD', montant: '', modePaiement: 'Virement', reference: '',
      moisFacture: '', debutContrat: '', finContrat: '', dateComptable: '',
      compteur: '', imputation: '', dernierNumero: '', dernierMontant: '', derniereDate: ''
    });
  };

  const soumettreFormulaireClient = async (e) => {
    e.preventDefault();
    
    const nouvellesErreurs = {};
    if (!formulaire.bail) nouvellesErreurs.bail = "Le bail est obligatoire.";
    if (!formulaire.matricule) nouvellesErreurs.matricule = "Le matricule est obligatoire.";
    if (!formulaire.nom) nouvellesErreurs.nom = "Le nom est obligatoire.";
    if (!formulaire.postNom) nouvellesErreurs.postNom = "Le post-nom est obligatoire.";
    if (!formulaire.prenom) nouvellesErreurs.prenom = "Le prénom est obligatoire.";
    if (!formulaire.logement) nouvellesErreurs.logement = "Le logement est obligatoire.";
    if (!formulaire.typeClient) nouvellesErreurs.typeClient = "Le type de client est obligatoire.";
    
    if (!formulaire.montant) {
      nouvellesErreurs.montant = "Le montant est obligatoire.";
    } else if (parseFloat(formulaire.montant) <= 0) {
      nouvellesErreurs.montant = "Le montant doit être supérieur à 0.";
    }

    if (!formulaire.debutContrat) nouvellesErreurs.debutContrat = "Le début du contrat est obligatoire.";
    if (!formulaire.finContrat) nouvellesErreurs.finContrat = "La fin du contrat est obligatoire.";

    if (Object.keys(nouvellesErreurs).length > 0) {
      setErreursChamps(nouvellesErreurs);
      afficherNotificationProvisoire("Veuillez corriger les erreurs signalées dans le formulaire.", 'info', 10000);
      return;
    }

    setErreursChamps({});

    const formaterDateAPI = (valeurDate) => {
      if (!valeurDate) return null;
      if (typeof valeurDate === 'string' && valeurDate.includes('T')) {
        return valeurDate.split('T')[0];
      }
      return valeurDate;
    };

    const payloadPropre = {
      ...formulaire,
      dateBail: formaterDateAPI(formulaire.dateBail),
      debutContrat: formaterDateAPI(formulaire.debutContrat),
      finContrat: formaterDateAPI(formulaire.finContrat),
      dateComptable: formaterDateAPI(formulaire.dateComptable),
      derniereDate: formaterDateAPI(formulaire.derniereDate),
      enregistre: true,
    };

    try {
      await axios.post(`${API_URL}/clients`, payloadPropre);
      
      afficherNotificationProvisoire('Enregistré avec succès dans la base de données !', 'succes', 10000);
      
      await chargerClients();
      
      reinitialiserFormulaire();
      setOngletActif('enregistres');
    } catch (erreur) {
      console.error("Détail complet de l'erreur :", erreur.response?.data || erreur.message);
      const messageServeur = erreur.response?.data?.message || erreur.message;
      afficherNotificationProvisoire(`Échec de l'enregistrement : ${messageServeur}`, 'info', 10000);
    }
  };

  const typesUniques = [...new Set(listeClients.map(c => c.typeFacture || c.type).filter(Boolean))];
  const optionsTypesFinales = typesUniques.length > 0 ? typesUniques : ['Locataire', 'Loyers', 'Eau', 'Electricite', 'Divers'];

  return (
    <ConteneurPage>

      <BarreOnglets>
        <Onglet $actif={ongletActif === 'actifs'} onClick={() => setOngletActif('actifs')}>
          <FiUsers /> Clients Actifs <BadgeCompteur $actif={ongletActif === 'actifs'}>{listeClients.length}</BadgeCompteur>
        </Onglet>
        
        <Onglet $actif={ongletActif === 'gestion'} onClick={() => setOngletActif('gestion')}>
          <FiUserPlus /> Enregistrement Clients
        </Onglet>

        <Onglet $actif={ongletActif === 'enregistres'} onClick={() => setOngletActif('enregistres')}>
          <FiCheckSquare /> Clients Enregistrés <BadgeCompteur $actif={ongletActif === 'enregistres'}>{clientsEnregistres.length}</BadgeCompteur>
        </Onglet>

        <Onglet $actif={ongletActif === 'corbeille'} onClick={() => setOngletActif('corbeille')}>
          <FiTrash2 /> Clients Supprimés <BadgeCompteur $actif={ongletActif === 'corbeille'}>{listeCorbeille.length}</BadgeCompteur>
        </Onglet>
      </BarreOnglets>

      {ongletActif === 'actifs' ? (
        <ClientsActifs 
          listeClients={listeClients} 
          setListeClients={setListeClients}
          chargerClients={chargerClients} 
          allerAFacturation={allerAEnregistrementClient} 
        />
      ) : ongletActif === 'gestion' ? (
        <div>
          <EnregistrementClients 
            formulaire={formulaire} 
            erreurs={erreursChamps}
            optionsTypes={optionsTypesFinales}
            handleChange={handleChangeFormulaire} 
            onReset={reinitialiserFormulaire} 
            onSubmit={soumettreFormulaireClient} 
          />
          <AnimatePresence>
            {notification && (
              <MessageNotification
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                $type={notification.type}
              >
                {notification.texte}
              </MessageNotification>
            )}
          </AnimatePresence>
        </div>
      ) : ongletActif === 'enregistres' ? (
        <ClientsEnregistres 
          clientsEnregistres={clientsEnregistres} 
          onSelectClient={allerAEnregistrementClient} 
        />
      ) : (
        <ClientsSupprimes listeCorbeille={listeCorbeille} chargerClients={chargerClients} />
      )}
    </ConteneurPage>
  );
}