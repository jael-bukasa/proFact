import React from 'react';
import styled from 'styled-components';
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

  &:first-child {
    width: 1%;
  }
`;

const CelluleData = styled.td`
  padding: 0.85rem 1rem;
  border-bottom: 1px solid ${THEME.bordure};
  vertical-align: middle;
  white-space: nowrap;

  &:first-child {
    width: 1%;
  }
`;

const LigneTableau = styled.tr`
  transition: background-color 0.15s ease;
  cursor: ${props => (props.$cliquable ? 'pointer' : 'default')};

  &:hover {
    background-color: ${THEME.survol};
  }

  &:last-child ${CelluleData} {
    border-bottom: none;
  }
`;

const BadgeMatricule = styled.span`
  display: inline-block;
  white-space: nowrap;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${THEME.accentuation};
  background-color: rgba(174, 234, 0, 0.1);
  border: 1px solid rgba(174, 234, 0, 0.25);
  padding: 0.25rem 0.55rem;
  border-radius: 6px;
  letter-spacing: 0.5px;
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

const BadgeDevise = styled.span`
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  color: ${props => (props.$cdf ? '#64B5F6' : '#81C784')};
  background-color: ${props => (props.$cdf ? 'rgba(100, 181, 246, 0.1)' : 'rgba(129, 199, 132, 0.1)')};
  border: 1px solid ${props => (props.$cdf ? 'rgba(100, 181, 246, 0.25)' : 'rgba(129, 199, 132, 0.25)')};
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
`;

const BadgeHeure = styled.span`
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 0.8rem;
  color: ${THEME.texteSecondaire};
  background-color: rgba(255, 255, 255, 0.04);
  padding: 0.2rem 0.45rem;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

const GroupeBoutons = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const BoutonOption = styled.button`
  background: transparent;
  border: 1px solid ${props => 
    props.$succes ? THEME.succes : props.$danger ? THEME.danger : props.$accent ? THEME.accentuation : THEME.bordure};
  color: ${props => 
    props.$succes ? THEME.succes : props.$danger ? THEME.danger : props.$accent ? THEME.accentuation : THEME.textePrincipal};
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props =>
      props.$succes
        ? 'rgba(76, 175, 80, 0.15)'
        : props.$danger
        ? 'rgba(255, 82, 82, 0.15)'
        : props.$accent
        ? 'rgba(174, 234, 0, 0.15)'
        : 'rgba(255, 255, 255, 0.08)'};
    border-color: ${props => 
      props.$succes ? THEME.succes : props.$danger ? THEME.danger : props.$accent ? THEME.accentuation : THEME.texteSecondaire};
  }
`;

const MessageVide = styled.div`
  padding: 2.5rem;
  text-align: center;
  color: ${THEME.texteSecondaire};
  font-size: 0.9rem;
`;

const extraireHeure = (heureExacte, horodatage) => {
  if (heureExacte) return heureExacte;
  if (!horodatage) return '--:--';

  if (typeof horodatage === 'string' && horodatage.includes(' ')) {
    const parts = horodatage.split(' ');
    if (parts[1]) return parts[1].substring(0, 5);
  }

  const d = new Date(horodatage);
  if (isNaN(d.getTime())) return '--:--';

  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

export default function TableauClients({
  clients = [],
  editerClient,
  supprimerClient,
  supprimerDefinitivement,
  restaurerClient,
  formaterDateFr,
  estCorbeille = false,
  allerAFacturation,
}) {
  const redirigerFacturation = (client) => {
    if (estCorbeille || !client) return;
    if (typeof allerAFacturation === 'function') {
      allerAFacturation(client);
    }
  };

  if (!clients || clients.length === 0) {
    return (
      <ConteneurTableau>
        <MessageVide>
          {estCorbeille
            ? "Aucun client supprimé dans la corbeille."
            : "Aucun client ne correspond aux critères."}
        </MessageVide>
      </ConteneurTableau>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <ConteneurTableau>
        <TableElement>
          <EnTete>
            <tr>
              <CelluleHeader>Matricule</CelluleHeader>
              <CelluleHeader>Nom</CelluleHeader>
              <CelluleHeader>Post-nom</CelluleHeader>
              <CelluleHeader>Prénom</CelluleHeader>
              <CelluleHeader>Type</CelluleHeader>
              <CelluleHeader>Devise</CelluleHeader>
              <CelluleHeader>Date</CelluleHeader>
              <CelluleHeader>Heure</CelluleHeader>
              <CelluleHeader style={{ textAlign: 'right' }}>Actions</CelluleHeader>
            </tr>
          </EnTete>
          <tbody>
            {clients.map((cli, index) => {
              if (!cli) return null;
              const idClient = cli.id || cli._id;

              return (
                <LigneTableau 
                  key={idClient || cli.matricule || index}
                  $cliquable={!estCorbeille}
                  onClick={() => redirigerFacturation(cli)}
                >
                  <CelluleData><BadgeMatricule>{cli.matricule || 'Non attribué'}</BadgeMatricule></CelluleData>
                  <CelluleData style={{ fontWeight: 600 }}>{cli.nom || '-'}</CelluleData>
                  <CelluleData>{cli.postNom || '-'}</CelluleData>
                  <CelluleData>{cli.prenom || '-'}</CelluleData>
                  <CelluleData><BadgeType>{cli.typeClient || 'locataire'}</BadgeType></CelluleData>
                  <CelluleData>
                    <BadgeDevise $cdf={cli.devise === 'CDF'}>{cli.devise || 'USD'}</BadgeDevise>
                  </CelluleData>
                  <CelluleData>
                    {formaterDateFr 
                      ? formaterDateFr(cli.dateEnregistrement || cli.creeLe) 
                      : (cli.dateEnregistrement || '-')}
                  </CelluleData>
                  <CelluleData>
                    <BadgeHeure>{extraireHeure(cli.heure, cli.creeLe)}</BadgeHeure>
                  </CelluleData>
                  <CelluleData style={{ textAlign: 'right' }}>
                    <GroupeBoutons style={{ justifyContent: 'flex-end' }}>
                      {estCorbeille ? (
                        <>
                          <BoutonOption $succes onClick={(e) => { e.stopPropagation(); restaurerClient && restaurerClient(idClient); }}>
                            Restaurer
                          </BoutonOption>
                          <BoutonOption $danger onClick={(e) => { e.stopPropagation(); supprimerDefinitivement && supprimerDefinitivement(idClient); }}>
                            Supprimer définitivement
                          </BoutonOption>
                        </>
                      ) : (
                        <>
                          <BoutonOption onClick={(e) => { e.stopPropagation(); editerClient && editerClient(cli); }}>
                            Éditer
                          </BoutonOption>
                          <BoutonOption $danger onClick={(e) => { e.stopPropagation(); supprimerClient && supprimerClient(idClient); }}>
                            Supprimer
                          </BoutonOption>
                        </>
                      )}
                    </GroupeBoutons>
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