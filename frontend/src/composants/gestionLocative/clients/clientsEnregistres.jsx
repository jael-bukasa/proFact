import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import FiltreClients from './filtreClients'; // <-- Import du nouveau composant

const THEME = {
  fondCarte: '#1E1E1E',
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  survol: '#262626',
};

const ConteneurSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const ConteneurTableau = styled.div`
  width: 100%;
  overflow-x: auto;
  background-color: ${THEME.fondCarte};
  border: 1px solid ${THEME.bordure};
  border-radius: 12px;
`;

const TableElement = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.85rem;
  color: ${THEME.textePrincipal};
`;

const EnTeteTableau = styled.thead`
  background-color: #141414;
  border-bottom: 1px solid ${THEME.bordure};
`;

const CelluleHeader = styled.th`
  padding: 0.9rem 1rem;
  color: ${THEME.texteSecondaire};
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
`;

const CelluleData = styled.td`
  padding: 0.85rem 1rem;
  border-bottom: 1px solid ${THEME.bordure};
  vertical-align: middle;
  white-space: nowrap;
`;

const LigneTableau = styled.tr`
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${THEME.survol};
  }

  &:last-child ${CelluleData} {
    border-bottom: none;
  }
`;

const BadgeMatricule = styled.span`
  display: inline-block;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${THEME.accentuation};
  background-color: rgba(174, 234, 0, 0.1);
  border: 1px solid rgba(174, 234, 0, 0.25);
  padding: 0.25rem 0.55rem;
  border-radius: 6px;
`;

const BadgeType = styled.span`
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: capitalize;
  color: ${THEME.textePrincipal};
  background-color: rgba(255, 255, 255, 0.06);
  border: 1px solid ${THEME.bordure};
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
`;

const MessageVide = styled.div`
  padding: 3rem;
  text-align: center;
  color: ${THEME.texteSecondaire};
  font-size: 0.9rem;
  background-color: ${THEME.fondCarte};
  border: 1px solid ${THEME.bordure};
  border-radius: 12px;
`;

export default function ClientsEnregistres({ clientsEnregistres = [] }) {
  const [rechercheTexte, setRechercheTexte] = useState('');
  const [filtreJour, setFiltreJour] = useState('');
  const [filtreMois, setFiltreMois] = useState('');
  const [filtreAnnee, setFiltreAnnee] = useState('');
  const [filtreDateExacte, setFiltreDateExacte] = useState('');

  const reinitialiserFiltres = () => {
    setRechercheTexte('');
    setFiltreJour('');
    setFiltreMois('');
    setFiltreAnnee('');
    setFiltreDateExacte('');
  };

  const clientsFiltres = useMemo(() => {
    return clientsEnregistres.filter(client => {
      if (!client) return false;

      if (rechercheTexte) {
        const terme = rechercheTexte.toLowerCase();
        const nomComplet = `${client.nom || ''} ${client.postNom || ''} ${client.prenom || ''} ${client.client || client.matricule || ''} ${client.bail || ''}`.toLowerCase();
        if (!nomComplet.includes(terme)) return false;
      }

      const rawDate = client.dateEnregistrement || client.created_at || client.createdAt || client.dateC;
      if (rawDate) {
        const dateSeule = String(rawDate).includes('T') 
          ? String(rawDate).split('T')[0] 
          : String(rawDate);

        const parts = dateSeule.split('-');
        if (parts.length === 3) {
          const [annee, mois, jour] = parts;
          if (filtreDateExacte && dateSeule !== filtreDateExacte) return false;
          if (filtreJour && jour !== filtreJour) return false;
          if (filtreMois && mois !== filtreMois) return false;
          if (filtreAnnee && annee !== filtreAnnee) return false;
        }
      }

      return true;
    });
  }, [clientsEnregistres, rechercheTexte, filtreJour, filtreMois, filtreAnnee, filtreDateExacte]);

  return (
    <ConteneurSection as={motion.div} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {/* Appel du composant FiltreClients */}
      <FiltreClients 
        rechercheTexte={rechercheTexte}
        setRechercheTexte={setRechercheTexte}
        filtreDateExacte={filtreDateExacte}
        setFiltreDateExacte={setFiltreDateExacte}
        filtreJour={filtreJour}
        setFiltreJour={setFiltreJour}
        filtreMois={filtreMois}
        setFiltreMois={setFiltreMois}
        filtreAnnee={filtreAnnee}
        setFiltreAnnee={setFiltreAnnee}
        reinitialiserFiltres={reinitialiserFiltres}
      />

      {clientsFiltres.length === 0 ? (
        <MessageVide>Aucun client enregistré ne correspond à vos critères de recherche.</MessageVide>
      ) : (
        <ConteneurTableau>
          <TableElement>
            <EnTeteTableau>
              <tr>
                <CelluleHeader>Code Client</CelluleHeader>
                <CelluleHeader>Nom</CelluleHeader>
                <CelluleHeader>N° Bail</CelluleHeader>
                <CelluleHeader>Type / Catégorie</CelluleHeader>
                <CelluleHeader>Désignation</CelluleHeader>
                <CelluleHeader>Devise</CelluleHeader>
              </tr>
            </EnTeteTableau>
            <tbody>
              {clientsFiltres.map((cli, index) => (
                <LigneTableau key={cli.id || index}>
                  <CelluleData><BadgeMatricule>{cli.client || cli.matricule || 'N/A'}</BadgeMatricule></CelluleData>
                  <CelluleData style={{ fontWeight: 600 }}>{cli.nom || '-'}</CelluleData>
                  <CelluleData>{cli.bail || '-'}</CelluleData>
                  <CelluleData><BadgeType>{cli.type || cli.typeClient || 'locataire'}</BadgeType></CelluleData>
                  <CelluleData>{cli.designat || '-'}</CelluleData>
                  <CelluleData>{cli.devise || 'USD'}</CelluleData>
                </LigneTableau>
              ))}
            </tbody>
          </TableElement>
        </ConteneurTableau>
      )}
    </ConteneurSection>
  );
}