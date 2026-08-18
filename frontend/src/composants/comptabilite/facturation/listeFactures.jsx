import React, { useState, useMemo } from 'react';
import styled from 'styled-components';

// Importation des 5 composants de liste
import FactureTous from './listeFactures/factureTous';
import FactureLocataire from './listeFactures/factureLocataire';
import FactureEau from './listeFactures/factureEau';
import FactureElectricite from './listeFactures/factureElectricite';
import FactureDivers from './listeFactures/factureDivers';

const THEME = {
  fondCarte: '#1E1E1E',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  fondChamp: '#121212',
  accentuation: '#AEEA00'
};

const ConteneurOnglets = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const BoutonOnglet = styled.button`
  background-color: ${({ actif }) => (actif ? THEME.accentuation : THEME.fondChamp)};
  color: ${({ actif }) => (actif ? '#000000' : THEME.textePrincipal)};
  border: 1px solid ${({ actif }) => (actif ? THEME.accentuation : THEME.bordure)};
  padding: 0.7rem 1.2rem;
  border-radius: 10px;
  font-weight: ${({ actif }) => (actif ? '700' : '500')};
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${THEME.accentuation};
    opacity: 0.9;
  }

  svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
`;

const PanneauFiltres = styled.div`
  background-color: ${THEME.fondCarte};
  border: 1px solid ${THEME.bordure};
  border-radius: 12px;
  padding: 1.2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
  margin-bottom: 1.5rem;
`;

const GroupeFiltre = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
  min-width: 140px;
`;

const Etiquette = styled.label`
  color: ${THEME.texteSecondaire};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const EntreeTexte = styled.input`
  background-color: ${THEME.fondChamp};
  border: 1px solid ${THEME.bordure};
  border-radius: 8px;
  padding: 0.65rem 0.8rem;
  color: ${THEME.textePrincipal};
  font-size: 0.85rem;

  &:focus {
    outline: none;
    border-color: ${THEME.accentuation};
  }
`;

const SelectEntree = styled.select`
  background-color: ${THEME.fondChamp};
  border: 1px solid ${THEME.bordure};
  border-radius: 8px;
  padding: 0.65rem 0.8rem;
  color: ${THEME.textePrincipal};
  font-size: 0.85rem;

  &:focus {
    outline: none;
    border-color: ${THEME.accentuation};
  }
`;

export default function ListeFactures({
  listeFactures = [],
  supprimerFacture,
  formaterDateFr,
  rechercheFacture,
  setRechercheFacture,
  modePeriode,
  setModePeriode,
  filtreMoisFacture,
  setFiltreMoisFacture,
  filtreTrimestreFacture,
  setFiltreTrimestreFacture,
  filtreAnneeFacture,
  setFiltreAnneeFacture,
  ongletActif: propOngletActif,
  setOngletActif: propSetOngletActif
}) {
  // État local de secours si le parent ne transmet pas l'état des onglets
  const [ongletLocal, setOngletLocal] = useState('tous');

  const ongletActif = propOngletActif !== undefined ? propOngletActif : ongletLocal;
  const setOngletActif = propSetOngletActif || setOngletLocal;

  const onglets = [
    {
      id: 'tous',
      label: 'Tous',
      icone: (
        <svg viewBox="0 0 24 24">
          <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/>
        </svg>
      )
    },
    {
      id: 'locataire',
      label: 'Locataire',
      icone: (
        <svg viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      )
    },
    {
      id: 'eau',
      label: 'Eau',
      icone: (
        <svg viewBox="0 0 24 24">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
        </svg>
      )
    },
    {
      id: 'electricite',
      label: 'Électricité',
      icone: (
        <svg viewBox="0 0 24 24">
          <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
        </svg>
      )
    },
    {
      id: 'divers',
      label: 'Divers',
      icone: (
        <svg viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      )
    }
  ];

  // Sélection du composant selon l'onglet actif
  const RenduFactureActif = useMemo(() => {
    switch (ongletActif) {
      case 'locataire':
        return FactureLocataire;
      case 'eau':
        return FactureEau;
      case 'electricite':
        return FactureElectricite;
      case 'divers':
        return FactureDivers;
      case 'tous':
      default:
        return FactureTous;
    }
  }, [ongletActif]);

  return (
    <>
      <ConteneurOnglets>
        {onglets.map((onglet) => (
          <BoutonOnglet
            key={onglet.id}
            actif={ongletActif === onglet.id}
            onClick={() => setOngletActif(onglet.id)}
            type="button"
          >
            {onglet.icone}
            {onglet.label}
          </BoutonOnglet>
        ))}
      </ConteneurOnglets>

      <PanneauFiltres>
        <GroupeFiltre style={{ flex: 2, minWidth: '180px' }}>
          <Etiquette>Rechercher Facture</Etiquette>
          <EntreeTexte 
            type="text" 
            placeholder="N° Facture, Client ou Locataire..." 
            value={rechercheFacture} 
            onChange={(e) => setRechercheFacture(e.target.value)} 
          />
        </GroupeFiltre>

        <GroupeFiltre>
          <Etiquette>Type de Période</Etiquette>
          <SelectEntree 
            value={modePeriode} 
            onChange={(e) => { 
              setModePeriode(e.target.value); 
              setFiltreMoisFacture(''); 
              setFiltreTrimestreFacture(''); 
            }}
          >
            <option value="mois">Par mois</option>
            <option value="trimestre">Par trimestre</option>
            <option value="annee">Par année</option>
          </SelectEntree>
        </GroupeFiltre>

        {modePeriode === 'mois' && (
          <GroupeFiltre>
            <Etiquette>Mois</Etiquette>
            <SelectEntree value={filtreMoisFacture} onChange={(e) => setFiltreMoisFacture(e.target.value)}>
              <option value="">Tous les mois</option>
              <option value="01">Janvier</option>
              <option value="02">Février</option>
              <option value="03">Mars</option>
              <option value="04">Avril</option>
              <option value="05">Mai</option>
              <option value="06">Juin</option>
              <option value="07">Juillet</option>
              <option value="08">Août</option>
              <option value="09">Septembre</option>
              <option value="10">Octobre</option>
              <option value="11">Novembre</option>
              <option value="12">Décembre</option>
            </SelectEntree>
          </GroupeFiltre>
        )}

        {modePeriode === 'trimestre' && (
          <GroupeFiltre>
            <Etiquette>Trimestre</Etiquette>
            <SelectEntree value={filtreTrimestreFacture} onChange={(e) => setFiltreTrimestreFacture(e.target.value)}>
              <option value="">Tous les trimestres</option>
              <option value="T1">T1 (Jan - Mar)</option>
              <option value="T2">T2 (Avr - Juin)</option>
              <option value="T3">T3 (Juil - Sept)</option>
              <option value="T4">T4 (Oct - Déc)</option>
            </SelectEntree>
          </GroupeFiltre>
        )}

        <GroupeFiltre>
          <Etiquette>Année</Etiquette>
          <SelectEntree value={filtreAnneeFacture} onChange={(e) => setFiltreAnneeFacture(e.target.value)}>
            <option value="">Toutes</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </SelectEntree>
        </GroupeFiltre>
      </PanneauFiltres>

      <RenduFactureActif
        listeFactures={listeFactures}
        supprimerFacture={supprimerFacture}
        formaterDateFr={formaterDateFr}
        rechercheFacture={rechercheFacture}
        modePeriode={modePeriode}
        filtreMoisFacture={filtreMoisFacture}
        filtreTrimestreFacture={filtreTrimestreFacture}
        filtreAnneeFacture={filtreAnneeFacture}
      />
    </>
  );
}