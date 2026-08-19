import React, { useState, useEffect, useMemo } from 'react';
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

  // Gestion des filtres temporels
  const [modePeriode, setModePeriode] = useState('mois');
  const [filtreMoisFacture, setFiltreMoisFacture] = useState('');
  const [filtreTrimestreFacture, setFiltreTrimestreFacture] = useState('');
  const [filtreAnneeFacture, setFiltreAnneeFacture] = useState('');
  const [ongletSousListe, setOngletSousListe] = useState('tous');

  // Récupération et transformation automatique des clients enregistrés en factures
  const listeFactures = useMemo(() => {
    if (!clientsEnregistres || clientsEnregistres.length === 0) return [];

    return clientsEnregistres.map((cli, index) => {
      const nomComplet = `${cli.nom || ''} ${cli.postNom || ''} ${cli.prenom || ''}`.trim();
      
      return {
        id: cli.id || index,
        numero: cli.bail || `FACT-${index + 1}`,
        client: nomComplet || 'Client Inconnu',
        type: cli.typeFacture || 'Loyers',
        dateFacture: cli.dateBail || cli.dateEnregistrement || new Date().toISOString().split('T')[0],
        montant: cli.montant ? `${cli.montant} ${cli.devise || 'USD'}` : '0 USD',
        statut: cli.montant ? 'Émise' : 'En attente',
        // On conserve toutes les données d'origine au cas où d'autres sous-onglets en ont besoin
        ...cli
      };
    });
  }, [clientsEnregistres]);

  // Option de suppression locale si nécessaire (ou propagation)
  const supprimerFacture = (id) => {
    // Note: Si la suppression doit impacter les clients, il faudra l'ajuster dans le composant parent global, 
    // mais ici on filtre l'affichage si besoin.
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
          modePeriode={modePeriode}
          setModePeriode={setModePeriode}
          filtreMoisFacture={filtreMoisFacture}
          setFiltreMoisFacture={setFiltreMoisFacture}
          filtreTrimestreFacture={filtreTrimestreFacture}
          setFiltreTrimestreFacture={setFiltreTrimestreFacture}
          filtreAnneeFacture={filtreAnneeFacture}
          setFiltreAnneeFacture={setFiltreAnneeFacture}
          ongletActif={ongletSousListe}
          setOngletActif={setOngletSousListe}
        />
      )}
    </ConteneurFactures>
  );
}