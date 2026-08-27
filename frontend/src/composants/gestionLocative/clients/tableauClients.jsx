import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

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
  border: 1px solid ${props => props.$danger ? THEME.danger : (props.$succes ? THEME.succes : THEME.bordure)};
  color: ${props => props.$danger ? THEME.danger : (props.$succes ? THEME.succes : THEME.textePrincipal)};
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;

  &:hover {
    background: ${props => props.$danger ? 'rgba(255, 82, 82, 0.1)' : (props.$succes ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 255, 255, 0.05)')};
  }

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
`;

const ConteneurConfirmationInline = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background-color: rgba(255, 82, 82, 0.12);
  border: 1px solid rgba(255, 82, 82, 0.3);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;

  span {
    font-size: 0.75rem;
    color: ${THEME.danger};
    font-weight: 600;
  }
`;

export default function TableauClients({
  clients = [],
  clientsEnregistres = [],
  editerClient,
  supprimerClient,
  restaurerClient,
  supprimerDefinitif,
  formaterDateFr,
  estCorbeille = false,
  allerAFacturation,
}) {
  const listeEffective = clients.length > 0 ? clients : clientsEnregistres;

  // États locaux pour gérer les actions individuelles par ligne
  const [idEnRestauration, setIdEnRestauration] = useState(null);
  const [idEnCoursDeSuppression, setIdEnCoursDeSuppression] = useState(null); // Pour le mode normal
  const [idEnCoursDeSuppressionDefinitif, setIdEnCoursDeSuppressionDefinitif] = useState(null); // Pour la corbeille

  const gererRestauration = async (idClient) => {
    try {
      setIdEnRestauration(idClient);
      if (restaurerClient) {
        await restaurerClient(idClient);
      }
    } catch (erreur) {
      console.error("Erreur lors de la restauration :", erreur);
    } finally {
      setIdEnRestauration(null);
    }
  };

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
            {listeEffective.length === 0 ? (
              <tr>
                <CelluleData colSpan="6" style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>
                  {estCorbeille ? "La corbeille est vide." : "Aucun client enregistré ne correspond à vos critères de recherche."}
                </CelluleData>
              </tr>
            ) : (
              listeEffective.map((cli, index) => {
                if (!cli) return null;
                const idClient = cli.id || cli._id || index;
                const enRestauration = idEnRestauration === idClient;
                const enAttenteSuppressionNormal = idEnCoursDeSuppression === idClient;
                const enAttenteSuppressionDef = idEnCoursDeSuppressionDefinitif === idClient;

                return (
                  <LigneTableau key={idClient} onClick={() => !estCorbeille && allerAFacturation?.(cli)}>
                    <CelluleData><BadgeMatricule>{cli.matricule || '---'}</BadgeMatricule></CelluleData>
                    <CelluleData style={{ fontWeight: 600 }}>{cli.nom || '-'}</CelluleData>
                    <CelluleData><BadgeType>{cli.typeFacture || 'Loyers'}</BadgeType></CelluleData>
                    <CelluleData>
                      <BadgeDevise $cdf={cli.devise === 'CDF'}>{cli.devise || 'USD'}</BadgeDevise>
                    </CelluleData>
                    <CelluleData>
                      {formaterDateFr ? formaterDateFr(cli.dateEnregistrement) : (cli.dateEnregistrement || '-')}
                    </CelluleData>
                    
                    <CelluleData style={{ textAlign: 'right' }}>
                      {estCorbeille ? (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                          {/* Bouton Restaurer avec chargement */}
                          <BoutonOption 
                            $succes 
                            disabled={enRestauration}
                            onClick={(e) => { e.stopPropagation(); gererRestauration(idClient); }}
                          >
                            {enRestauration ? '⏳ Restauration...' : 'Restaurer ♻️'}
                          </BoutonOption>

                          {/* Confirmation inline pour la suppression définitive */}
                          <AnimatePresence mode="wait">
                            {enAttenteSuppressionDef ? (
                              <ConteneurConfirmationInline
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span>Confirmer ?</span>
                                <BoutonOption 
                                  $danger 
                                  style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}
                                  onClick={() => {
                                    supprimerDefinitif?.(idClient);
                                    setIdEnCoursDeSuppressionDefinitif(null);
                                  }}
                                >
                                  Oui
                                </BoutonOption>
                                <BoutonOption 
                                  style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}
                                  onClick={() => setIdEnCoursDeSuppressionDefinitif(null)}
                                >
                                  Non
                                </BoutonOption>
                              </ConteneurConfirmationInline>
                            ) : (
                              <BoutonOption 
                                key="btn-suppr-def"
                                $danger 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  setIdEnCoursDeSuppressionDefinitif(idClient); 
                                }}
                              >
                                Supprimer ❌
                              </BoutonOption>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                          <BoutonOption onClick={(e) => { e.stopPropagation(); editerClient?.(cli); }}>
                            Éditer
                          </BoutonOption>

                          {/* Confirmation inline pour la suppression normale */}
                          <AnimatePresence mode="wait">
                            {enAttenteSuppressionNormal ? (
                              <ConteneurConfirmationInline
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span>Confirmer ?</span>
                                <BoutonOption 
                                  $danger 
                                  style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}
                                  onClick={() => {
                                    supprimerClient?.(idClient);
                                    setIdEnCoursDeSuppression(null);
                                  }}
                                >
                                  Oui
                                </BoutonOption>
                                <BoutonOption 
                                  style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}
                                  onClick={() => setIdEnCoursDeSuppression(null)}
                                >
                                  Non
                                </BoutonOption>
                              </ConteneurConfirmationInline>
                            ) : (
                              <BoutonOption 
                                key="btn-suppr-norm"
                                $danger 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  setIdEnCoursDeSuppression(idClient); 
                                }}
                              >
                                Supprimer
                              </BoutonOption>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </CelluleData>
                  </LigneTableau>
                );
              })
            )}
          </tbody>
        </TableElement>
      </ConteneurTableau>
    </motion.div>
  );
}