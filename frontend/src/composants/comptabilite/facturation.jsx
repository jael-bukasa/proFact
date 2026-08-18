import React, { useState, useEffect } from 'react';
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

  &:hover {
    color: ${THEME.textePrincipal};
  }
`;

export default function Facturation({ formaterDateFr, clientSelectionne }) {
  const [ongletActif, setOngletActif] = useState('liste');

  // État du formulaire
  const [formulaire, setFormulaire] = useState({
    bail: '', dateBail: '', designat: '', nom: '', loc: '', adres: '',
    pays: 'RDC', mode: 'Virement', mont: '', cpt: '', imp: '', derN: '',
    derMt: '', derDt: '', moisF: '', debCt: '', finCt: '', 
    type: 'locataire',
    devise: 'USD',
    nMont: '', dateC: '', client: '', tauxCon: '', montFc: '', reference: ''
  });

  useEffect(() => {
    if (clientSelectionne) {
      const nomComplet = [clientSelectionne.nom, clientSelectionne.postNom, clientSelectionne.prenom]
        .filter(Boolean)
        .join(' ');

      setFormulaire(prev => ({
        ...prev,
        nom: nomComplet || prev.nom,
        client: clientSelectionne.matricule || clientSelectionne.id || prev.client,
        loc: clientSelectionne.lieuNaissance || clientSelectionne.adresse || prev.loc,
        adres: clientSelectionne.adresse || prev.adres,
        dateC: clientSelectionne.dateEnregistrement || new Date().toISOString().split('T')[0]
      }));
    }
  }, [clientSelectionne]);

  // Listes et États de gestion
  const [listeFactures, setListeFactures] = useState([]);
  const [rechercheFacture, setRechercheFacture] = useState('');

  // Gestion des filtres temporels
  const [modePeriode, setModePeriode] = useState('mois');
  const [filtreMoisFacture, setFiltreMoisFacture] = useState('');
  const [filtreTrimestreFacture, setFiltreTrimestreFacture] = useState('');
  const [filtreAnneeFacture, setFiltreAnneeFacture] = useState('');
  const [ongletSousListe, setOngletSousListe] = useState('tous');

  // Action de suppression
  const supprimerFacture = (id) => {
    setListeFactures(prev => prev.filter(f => f.id !== id));
  };

  return (
    <ConteneurFactures>
      <BarreOnglets>
        <BoutonOnglet $actif={ongletActif === 'liste'} onClick={() => setOngletActif('liste')}>
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