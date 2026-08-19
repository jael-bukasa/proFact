import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const THEME = {
  fondCarte: '#1E1E1E',
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  survol: '#262626',
  danger: '#FF5252',
  succes: '#4CAF50',
};

const clignotementLigne = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
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

const EnTete = styled.thead`
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
  cursor: ${props => (props.$cliquable ? 'pointer' : 'default')};
  &:hover {
    background-color: ${THEME.survol};
    animation: ${clignotementLigne} 1s infinite ease-in-out;
  }
`;

const BadgeMatricule = styled.span`
  font-family: 'Consolas', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${THEME.accentuation};
  background-color: rgba(174, 234, 0, 0.1);
  padding: 0.25rem 0.55rem;
  border-radius: 6px;
`;

const BadgeType = styled.span`
  font-size: 0.72rem;
  font-weight: 600;
  color: ${THEME.textePrincipal};
  background-color: rgba(255, 255, 255, 0.06);
  border: 1px solid ${THEME.bordure};
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
`;

const BadgeDevise = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  color: ${props => (props.$cdf ? '#64B5F6' : '#81C784')};
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
`;

const BoutonOption = styled.button`
  background: transparent;
  border: 1px solid ${props => props.$danger ? THEME.danger : THEME.bordure};
  color: ${props => props.$danger ? THEME.danger : THEME.textePrincipal};
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
`;

export default function TableauClients({
  clients = [],
  editerClient,
  supprimerClient,
  formaterDateFr,
  estCorbeille = false,
  allerAFacturation,
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <ConteneurTableau>
        <TableElement>
          <EnTete>
            <tr>
              <CelluleHeader>Matricule</CelluleHeader>
              <CelluleHeader>Nom</CelluleHeader>
              <CelluleHeader>Type Facture</CelluleHeader>
              <CelluleHeader>Devise</CelluleHeader>
              <CelluleHeader>Date</CelluleHeader>
              <CelluleHeader style={{ textAlign: 'right' }}>Actions</CelluleHeader>
            </tr>
          </EnTete>
          <tbody>
            {clients.map((cli, index) => {
              if (!cli) return null;
              const idClient = cli.id || cli._id || index;

              return (
                <LigneTableau key={idClient} onClick={() => !estCorbeille && allerAFacturation?.(cli)}>
                  <CelluleData><BadgeMatricule>{cli.matricule || '---'}</BadgeMatricule></CelluleData>
                  <CelluleData style={{ fontWeight: 600 }}>{cli.nom || '-'}</CelluleData>
                  {/* ICI : On récupère bien 'typeFacture' au lieu de 'typeClient' */}
                  <CelluleData><BadgeType>{cli.typeFacture || 'Loyers'}</BadgeType></CelluleData>
                  <CelluleData>
                    <BadgeDevise $cdf={cli.devise === 'CDF'}>{cli.devise || 'USD'}</BadgeDevise>
                  </CelluleData>
                  <CelluleData>
                    {formaterDateFr ? formaterDateFr(cli.dateEnregistrement) : (cli.dateEnregistrement || '-')}
                  </CelluleData>
                  <CelluleData style={{ textAlign: 'right' }}>
                    <BoutonOption onClick={(e) => { e.stopPropagation(); editerClient?.(cli); }}>Éditer</BoutonOption>
                    <BoutonOption $danger style={{ marginLeft: '5px' }} onClick={(e) => { e.stopPropagation(); supprimerClient?.(idClient); }}>Supprimer</BoutonOption>
                  </CelluleData>
                </LigneTableau>
              );
            })}
          </tbody>
        </TableElement>
      </ConteneurTableau>
    </motion.div>
  );
}