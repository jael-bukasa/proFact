import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  FiUsers, 
  FiInfo, 
  FiCheckSquare, 
  FiTrash2 
} from 'react-icons/fi'; // <-- Import des icônes depuis react-icons

import ClientsActifs from './clients/clientsActifs';
import ClientsSupprimes from './clients/clientsSupprimes';
import InfosClients from './clients/infosClients';
import ClientsEnregistres from './clients/clientsEnregistres';

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
  background-color: ${props => props.$type === 'succes' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(174, 234, 0, 0.15)'};
  color: ${props => props.$type === 'succes' ? '#81C784' : THEME.accentuation};
  border: 1px solid ${props => props.$type === 'succes' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(174, 234, 0, 0.3)'};
`;

const extraireHeureAuto = (client) => {
  if (client.heure) return client.heure;
  const dateSource = client.dateEnregistrement || client.creeLe || client.cree_le || client.created_at;
  if (!dateSource) return '--:--';
  const d = new Date(dateSource);
  return !isNaN(d.getTime()) ? d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '--:--';
};

export default function Clients() {
  const [listeClients, setListeClients] = useState([]);
  const [listeCorbeille, setListeCorbeille] = useState([]);
  const [clientsEnregistres, setClientsEnregistres] = useState([]);
  const [ongletActif, setOngletActif] = useState('actifs');
  const [notification, setNotification] = useState(null);
  const [clientSelectionne, setClientSelectionne] = useState(null);

  const [formulaire, setFormulaire] = useState({
    bail: '', dateBail: '', client: '', nom: '', loc: '', adres: '', pays: 'RDC',
    designat: '', type: 'locataire', devise: 'USD', mont: '', mode: 'Virement',
    reference: '', moisF: '', debCt: '', finCt: '', dateC: '', cpt: '',
    imp: '', derN: '', derMt: '', derDt: ''
  });

  useEffect(() => { chargerClients(); }, []);

  const chargerClients = async () => {
    try {
      const resActifs = await axios.get(`${API_URL}/clients`);
      const resCorbeille = await axios.get(`${API_URL}/clients/corbeille`);
      setListeClients(Array.isArray(resActifs.data) ? resActifs.data.map(c => ({ ...c, heure: extraireHeureAuto(c) })) : []);
      setListeCorbeille(Array.isArray(resCorbeille.data) ? resCorbeille.data.map(c => ({ ...c, heure: extraireHeureAuto(c) })) : []);
    } catch (erreur) {
      console.error("Erreur de chargement :", erreur);
    }
  };

  const afficherNotificationProvisoire = (texte, type = 'info', duree = 4000) => {
    setNotification({ texte, type });
    setTimeout(() => setNotification(null), duree);
  };

  const allerAInfosClient = (client) => {
    setClientSelectionne(client);
    setOngletActif('gestion');

    if (client) {
      setFormulaire({
        bail: client.bail || '',
        dateBail: client.dateBail || '',
        client: client.client || client.matricule || '',
        nom: client.nom || '',
        loc: client.loc || '',
        adres: client.adres || '',
        pays: client.pays || 'RDC',
        designat: client.designat || '',
        type: client.typeClient || client.type || 'locataire',
        devise: client.devise || 'USD',
        mont: client.mont || '',
        mode: client.mode || 'Virement',
        reference: client.reference || '',
        moisF: client.moisF || '',
        debCt: client.debCt || '',
        finCt: client.finCt || '',
        dateC: client.dateC || '',
        cpt: client.cpt || '',
        imp: client.imp || '',
        derN: client.derN || '',
        derMt: client.derMt || '',
        derDt: client.derDt || ''
      });
    }
  };

  const handleChangeFormulaire = (e) => {
    const { name, value } = e.target;
    setFormulaire(prev => ({ ...prev, [name]: value }));
    
    if (name === 'designat') {
      const valLower = value.toLowerCase();
      let typeAuto = 'divers';
      if (valLower.includes('eau') || valLower.includes('regideso')) typeAuto = 'eau';
      else if (valLower.includes('elect') || valLower.includes('snel') || valLower.includes('courant')) typeAuto = 'electricite';
      else if (valLower.includes('loyer') || valLower.includes('locat') || valLower.includes('bail')) typeAuto = 'locataire';
      setFormulaire(prev => ({ ...prev, type: typeAuto }));
    }
  };

  const reinitialiserFormulaire = () => {
    setClientSelectionne(null);
    setFormulaire({
      bail: '', dateBail: '', client: '', nom: '', loc: '', adres: '', pays: 'RDC',
      designat: '', type: 'locataire', devise: 'USD', mont: '', mode: 'Virement',
      reference: '', moisF: '', debCt: '', finCt: '', dateC: '', cpt: '',
      imp: '', derN: '', derMt: '', derDt: ''
    });
  };

  const soumettreFormulaireClient = async (e) => {
    e.preventDefault();
    if (!formulaire.nom || !formulaire.client) {
      afficherNotificationProvisoire("Veuillez renseigner au moins le nom et le code client.", 'info', 3000);
      return;
    }
    try {
      await axios.post(`${API_URL}/clients`, formulaire);
      setClientsEnregistres(prev => [...prev, formulaire]);
      afficherNotificationProvisoire('Enregistrement effectué avec succès.', 'succes', 3000);
      reinitialiserFormulaire();
      chargerClients();
    } catch (erreur) {
      afficherNotificationProvisoire("Échec de l'enregistrement.", 'info', 3000);
    }
  };

  return (
    <ConteneurPage>
      <EnTete>
        <SectionTitre>
          <TitrePage>Gestion des Clients</TitrePage>
          <SousTitrePage>Registre synchronisé avec la base de données MySQL</SousTitrePage>
        </SectionTitre>
      </EnTete>

      <BarreOnglets>
        <Onglet $actif={ongletActif === 'actifs'} onClick={() => setOngletActif('actifs')}>
          <FiUsers /> Clients Actifs <BadgeCompteur $actif={ongletActif === 'actifs'}>{listeClients.length}</BadgeCompteur>
        </Onglet>
        
        <Onglet $actif={ongletActif === 'gestion'} onClick={() => setOngletActif('gestion')}>
          <FiInfo /> Infos Clients
        </Onglet>

        <Onglet $actif={ongletActif === 'enregistres'} onClick={() => setOngletActif('enregistres')}>
          <FiCheckSquare /> Clients Enregistrés <BadgeCompteur $actif={ongletActif === 'enregistres'}>{clientsEnregistres.length}</BadgeCompteur>
        </Onglet>

        <Onglet $actif={ongletActif === 'corbeille'} onClick={() => setOngletActif('corbeille')}>
          <FiTrash2 /> Clients Supprimés <BadgeCompteur $actif={ongletActif === 'corbeille'}>{listeCorbeille.length}</BadgeCompteur>
        </Onglet>
      </BarreOnglets>

      <AnimatePresence>
        {notification && (
          <MessageNotification $type={notification.type}>{notification.texte}</MessageNotification>
        )}
      </AnimatePresence>

      {ongletActif === 'actifs' ? (
        <ClientsActifs 
          listeClients={listeClients} 
          setListeClients={setListeClients}
          chargerClients={chargerClients} 
          allerAFacturation={allerAInfosClient} 
        />
      ) : ongletActif === 'gestion' ? (
        <InfosClients 
          formulaire={formulaire} 
          handleChange={handleChangeFormulaire} 
          onReset={reinitialiserFormulaire} 
          onSubmit={soumettreFormulaireClient} 
        />
      ) : ongletActif === 'enregistres' ? (
        <ClientsEnregistres clientsEnregistres={clientsEnregistres} />
      ) : (
        <ClientsSupprimes listeCorbeille={listeCorbeille} chargerClients={chargerClients} />
      )}
    </ConteneurPage>
  );
}