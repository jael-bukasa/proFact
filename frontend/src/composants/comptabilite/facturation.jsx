import React, { useState, useMemo } from 'react';
import styled from 'styled-components';

import ListeFactures from './facturation/listeFactures';

const THEME = {
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A'
};

const ConteneurFactures = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const BarreOnglets = styled.div`
  display: flex;
  gap: 1rem;
  border-bottom: 2px solid ${THEME.bordure};
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
`;

const BoutonOnglet = styled.button`
  background: transparent;
  border: none;
  padding: 0.8rem 1.5rem;
  font-weight: 700;
  font-size: 0.95rem;
  color: ${props => (props.$actif ? THEME.accentuation : THEME.texteSecondaire)};
  border-bottom: 3px solid ${props => (props.$actif ? THEME.accentuation : 'transparent')};
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: -2px;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: ${THEME.textePrincipal};
  }

  svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
`;

export default function Facturation({ formaterDateFr, clientsEnregistres = [] }) {
  const [ongletActif, setOngletActif] = useState('liste');
  const [rechercheFacture, setRechercheFacture] = useState('');
  
  // Nouveau filtre par date exacte pour correspondre à FiltreClients
  const [filtreDateExacte, setFiltreDateExacte] = useState('');
  
  const [ongletSousListe, setOngletSousListe] = useState('tous');

  // Fonction pour réinitialiser les filtres de recherche et de date
  const reinitialiserFiltres = () => {
    setRechercheFacture('');
    setFiltreDateExacte('');
  };

  // Récupération et transformation automatique des clients enregistrés en factures
  const listeFactures = useMemo(() => {
    if (!clientsEnregistres || clientsEnregistres.length === 0) return [];

    return clientsEnregistres.map((cli, index) => {
      const nomComplet = `${cli.nom || ''} ${cli.postNom || ''} ${cli.prenom || ''}`.trim();
      
      return {
        id: cli.id || index,
        numero: cli.bail || `FACT-${index + 1}`,
        client: nomComplet || 'Client Inconnu',
        typeFacture: cli.typeFacture || 'Loyers', // Assure-toi que c'est bien typeFacture
        dateFacture: cli.dateBail || cli.dateEnregistrement || new Date().toISOString().split('T')[0],
        montant: cli.montant !== undefined ? cli.montant : 0,
        statut: cli.statut || (cli.montant ? 'Émise' : 'En attente'),
        ...cli
      };
    });
  }, [clientsEnregistres]);

  const supprimerFacture = (id) => {
    console.log("Suppression de la facture ID:", id);
  };

  return (
    <ConteneurFactures>
      <BarreOnglets>
        <BoutonOnglet $actif={ongletActif === 'liste'} onClick={() => setOngletActif('liste')}>
          <svg viewBox="0 0 24 24">
            <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/>
          </svg>
          Liste des Factures ({listeFactures.length})
        </BoutonOnglet>
      </BarreOnglets>

      {ongletActif === 'liste' && (
        <ListeFactures 
          listeFactures={listeFactures} 
          supprimerFacture={supprimerFacture}
          formaterDateFr={formaterDateFr} 
          rechercheFacture={rechercheFacture}
          setRechercheFacture={setRechercheFacture}
          filtreDateExacte={filtreDateExacte}
          setFiltreDateExacte={setFiltreDateExacte}
          reinitialiserFiltres={reinitialiserFiltres}
          ongletActif={ongletSousListe}
          setOngletActif={setOngletSousListe}
        />
      )}
    </ConteneurFactures>
  );
}