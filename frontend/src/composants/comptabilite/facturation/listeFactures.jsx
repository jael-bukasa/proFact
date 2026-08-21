import React, { useState, useMemo } from 'react';
import styled from 'styled-components';

// Importation de ton composant de filtre personnalisé
import FiltreClients from "../../gestionLocative/clients/filtreClients";

// Importation des sous-composants de listes
import FactureTous from './listeFactures/factureTous';
import FactureLocataire from './listeFactures/factureLocataire';
import FactureEau from './listeFactures/factureEau';
import FactureElectricite from './listeFactures/factureElectricite';
import { FactureDivers } from './listeFactures/factureDivers';

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
  background-color: ${({ $actif }) => ($actif ? THEME.accentuation : THEME.fondChamp)};
  color: ${({ $actif }) => ($actif ? '#000000' : THEME.textePrincipal)};
  border: 1px solid ${({ $actif }) => ($actif ? THEME.accentuation : THEME.bordure)};
  padding: 0.7rem 1.2rem;
  border-radius: 10px;
  font-weight: ${({ $actif }) => ($actif ? '700' : '500')};
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

export default function ListeFactures({
  listeFactures = [],
  formaterDateFr,
  rechercheFacture,
  setRechercheFacture,
  filtreDateExacte,
  setFiltreDateExacte,
  reinitialiserFiltres,
  ongletActif: propOngletActif,
  setOngletActif: propSetOngletActif
}) {
  const [ongletLocal, setOngletLocal] = useState('tous');
  const ongletActif = propOngletActif !== undefined ? propOngletActif : ongletLocal;
  const setOngletActif = propSetOngletActif || setOngletLocal;

  const onglets = [
    { id: 'tous', label: 'Tous', icone: <svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg> },
    { id: 'locataire', label: 'Locataire', icone: <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> },
    { id: 'eau', label: 'Eau', icone: <svg viewBox="0 0 24 24"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg> },
    { id: 'electricite', label: 'Électricité', icone: <svg viewBox="0 0 24 24"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg> },
    { id: 'divers', label: 'Divers', icone: <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg> }
  ];

  // Filtrage robuste basé sur le matricule réel de la facture
  const facturesFiltreesGlobal = useMemo(() => {
    return listeFactures.filter(facture => {
      const matricule = (facture.matricule || facture.numero || '').toUpperCase();
      const typeBrut = (facture.typeFacture || facture.type || '').toLowerCase();

      // Détermination rigoureuse de la catégorie réelle de la facture
      let categorieReelle = 'locataire'; // par défaut
      if (matricule.startsWith('DIV')) {
        categorieReelle = 'divers';
      } else if (matricule.startsWith('EAU')) {
        categorieReelle = 'eau';
      } else if (matricule.startsWith('ELE') || matricule.startsWith('ELEC')) {
        categorieReelle = 'electricite';
      } else if (matricule.startsWith('LOY') || matricule.startsWith('LY') || typeBrut.includes('loyer') || typeBrut.includes('locataire')) {
        categorieReelle = 'locataire';
      }

      // 1. Filtrage strict par onglet actif
      if (ongletActif !== 'tous' && categorieReelle !== ongletActif) {
        return false;
      }

      // 2. Filtrage par texte de recherche
      if (rechercheFacture) {
        const terme = rechercheFacture.toLowerCase();
        const num = matricule.toLowerCase();
        const client = (facture.locataire || facture.client || facture.nom || '').toLowerCase();
        if (!num.includes(terme) && !client.includes(terme)) return false;
      }

      // 3. Filtrage par date exacte
      if (filtreDateExacte) {
        const dateFacturePropre = facture.dateFacture ? facture.dateFacture.split('T')[0] : '';
        if (dateFacturePropre !== filtreDateExacte) return false;
      }

      return true;
    });
  }, [listeFactures, ongletActif, rechercheFacture, filtreDateExacte]);

  const RenduFactureActif = useMemo(() => {
    switch (ongletActif) {
      case 'locataire': return FactureLocataire;
      case 'eau': return FactureEau;
      case 'electricite': return FactureElectricite;
      case 'divers': return FactureDivers;
      case 'tous':
      default: return FactureTous;
    }
  }, [ongletActif]);

  return (
    <>
      <ConteneurOnglets>
        {onglets.map((onglet) => (
          <BoutonOnglet
            key={onglet.id}
            $actif={ongletActif === onglet.id}
            onClick={() => setOngletActif(onglet.id)}
            type="button"
          >
            {onglet.icone}
            {onglet.label}
          </BoutonOnglet>
        ))}
      </ConteneurOnglets>

      <div style={{ marginBottom: '1.5rem' }}>
        <FiltreClients
          rechercheTexte={rechercheFacture}
          setRechercheTexte={setRechercheFacture}
          filtreDateExacte={filtreDateExacte}
          setFiltreDateExacte={setFiltreDateExacte}
          reinitialiserFiltres={reinitialiserFiltres}
        />
      </div>

      <RenduFactureActif
        listeFactures={facturesFiltreesGlobal}
        formaterDateFr={formaterDateFr}
      />
    </>
  );
}