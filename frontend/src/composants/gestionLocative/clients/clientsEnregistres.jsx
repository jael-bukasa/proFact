import React, { useState, useMemo, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import FiltreClients from './filtreClients';

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

const ScrollbarHautWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  height: 14px;
  margin-bottom: -5px;

  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #555;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const ScrollbarHautContenu = styled.div`
  height: 1px;
`;

const ConteneurTableau = styled.div`
  width: 100%;
  overflow-x: auto;
  background-color: ${THEME.fondCarte};
  border: 1px solid ${THEME.bordure};
  border-radius: 12px;
  padding-bottom: 8px;

  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #555;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
    margin: 0 10px;
  }
`;

const TableElement = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.8rem;
  color: ${THEME.textePrincipal};
  white-space: nowrap;
`;

const EnTeteTableau = styled.thead`
  background-color: #141414;
  border-bottom: 1px solid ${THEME.bordure};
`;

const CelluleHeader = styled.th`
  padding: 0.9rem 1rem;
  color: ${THEME.texteSecondaire};
  font-weight: 600;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CelluleData = styled.td`
  padding: 0.85rem 1rem;
  border-bottom: 1px solid ${THEME.bordure};
  vertical-align: middle;
`;

const BoutonSupprimer = styled.button`
  background: rgba(255, 82, 82, 0.1);
  color: #FF5252;
  border: 1px solid rgba(255, 82, 82, 0.25);
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 82, 82, 0.2);
  }
`;

const ConteneurConfirmationInline = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background-color: rgba(255, 82, 82, 0.12);
  border: 1px solid rgba(255, 82, 82, 0.3);
  padding: 0.25rem 0.6rem;
  border-radius: 6px;

  span {
    font-size: 0.75rem;
    color: #FF5252;
    font-weight: 600;
  }
`;

const BoutonConfirmation = styled.button`
  background: ${props => props.$oui ? 'rgba(255, 82, 82, 0.25)' : 'transparent'};
  color: ${props => props.$oui ? '#FF5252' : THEME.texteSecondaire};
  border: 1px solid ${props => props.$oui ? 'rgba(255, 82, 82, 0.4)' : THEME.bordure};
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$oui ? 'rgba(255, 82, 82, 0.4)' : 'rgba(255, 255, 255, 0.08)'};
    color: ${props => props.$oui ? '#FFFFFF' : THEME.textePrincipal};
  }
`;

const InfobulleCurseur = styled.div`
  position: fixed;
  left: ${props => props.$x}px;
  top: ${props => props.$y}px;
  transform: translate(12px, 12px);
  background-color: #111111;
  color: ${THEME.accentuation};
  border: 1px solid ${THEME.accentuation};
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
  pointer-events: none;
  z-index: 99999;
  white-space: nowrap;
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translate(12px, 20px); }
    to { opacity: 1; transform: translate(12px, 12px); }
  }
`;

const AlerteInterface = styled(motion.div)`
  padding: 0.75rem 1rem;
  background-color: rgba(255, 82, 82, 0.15);
  border: 1px solid rgba(255, 82, 82, 0.3);
  color: #FF5252;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LigneTableau = styled.tr`
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${THEME.survol};
  }

  &:hover ${BoutonSupprimer} {
    opacity: 1;
    visibility: visible;
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
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
`;

const BadgeType = styled.span`
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  color: ${THEME.textePrincipal};
  background-color: rgba(255, 255, 255, 0.06);
  border: 1px solid ${THEME.bordure};
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
`;

const MessageEtat = styled.div`
  padding: 3rem;
  text-align: center;
  color: ${THEME.texteSecondaire};
  font-size: 0.9rem;
  background-color: ${THEME.fondCarte};
  border: 1px solid ${THEME.bordure};
  border-radius: 12px;
`;

export default function ClientsEnregistres({ clientsEnregistres = [], onSelectClient, chargerClients: chargerClientsParent }) {
  const [listeClients, setListeClients] = useState(clientsEnregistres);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [messageInterface, setMessageInterface] = useState(null);

  const [idEnCoursDeSuppression, setIdEnCoursDeSuppression] = useState(null);

  const [ligneSurvoleeId, setLigneSurvoleeId] = useState(null);
  const [afficherMessage, setAfficherMessage] = useState(false);
  const [positionSouris, setPositionSouris] = useState({ x: 0, y: 0 });
  const timerRef = useRef(null);

  const [rechercheTexte, setRechercheTexte] = useState('');
  const [filtreJour, setFiltreJour] = useState('');
  const [filtreMois, setFiltreMois] = useState('');
  const [filtreAnnee, setFiltreAnnee] = useState('');
  const [filtreDateExacte, setFiltreDateExacte] = useState('');

  const scrollbarHautRef = useRef(null);
  const conteneurTableauRef = useRef(null);
  const tableRef = useRef(null);
  const [largeurTableau, setLargeurTableau] = useState(0);

  const chargerClientsInterne = async () => {
    setLoading(true);
    setErreur(null);
    try {
      const response = await fetch('http://localhost:5000/api/clients/enregistres');
      if (!response.ok) {
        throw new Error("Impossible de récupérer la liste des clients enregistrés");
      }
      const data = await response.json();
      setListeClients(data);
    } catch (err) {
      console.error("Erreur lors du chargement des clients :", err);
      setErreur(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clientsEnregistres && clientsEnregistres.length > 0) {
      setListeClients(clientsEnregistres);
    } else {
      chargerClientsInterne();
    }
  }, [clientsEnregistres]);

  const gererMouseEnter = (id, e) => {
    setLigneSurvoleeId(id);
    setAfficherMessage(false);
    setPositionSouris({ x: e.clientX, y: e.clientY });

    timerRef.current = setTimeout(() => {
      setAfficherMessage(true);
    }, 4000);
  };

  const gererMouseMove = (e) => {
    setPositionSouris({ x: e.clientX, y: e.clientY });
  };

  const gererMouseLeave = () => {
    clearTimeout(timerRef.current);
    setLigneSurvoleeId(null);
    setAfficherMessage(false);
  };

  const supprimerClient = async (e, id) => {
    e.stopPropagation(); 
    setMessageInterface(null);

    try {
      const response = await fetch(`http://localhost:5000/api/clients/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à la corbeille du client.");
      }

      setListeClients(prev => prev.filter(client => client.id !== id));
      setIdEnCoursDeSuppression(null);

      if (chargerClientsParent) {
        chargerClientsParent();
      }
    } catch (err) {
      console.error("Erreur :", err);
      setMessageInterface("Impossible de placer le client dans la corbeille. Veuillez réessayer.");
      setIdEnCoursDeSuppression(null);
    }
  };

  const modifierClient = (client) => {
    if (onSelectClient) {
      onSelectClient(client);
    }
  };

  useEffect(() => {
    if (tableRef.current) {
      setLargeurTableau(tableRef.current.scrollWidth);
    }
  }, [listeClients]);

  const gererScrollHaut = () => {
    if (conteneurTableauRef.current && scrollbarHautRef.current) {
      conteneurTableauRef.current.scrollLeft = scrollbarHautRef.current.scrollLeft;
    }
  };

  const gererScrollBas = () => {
    if (conteneurTableauRef.current && scrollbarHautRef.current) {
      scrollbarHautRef.current.scrollLeft = conteneurTableauRef.current.scrollLeft;
    }
  };

  const reinitialiserFiltres = () => {
    setRechercheTexte('');
    setFiltreJour('');
    setFiltreMois('');
    setFiltreAnnee('');
    setFiltreDateExacte('');
  };

  const clientsFiltres = useMemo(() => {
    return listeClients.filter(client => {
      if (!client) return false;

      if (rechercheTexte) {
        const terme = rechercheTexte.toLowerCase();
        const nomComplet = `${client.nom || ''} ${client.postNom || ''} ${client.prenom || ''} ${client.matricule || ''} ${client.bail || ''} ${client.telephone || ''}`.toLowerCase();
        if (!nomComplet.includes(terme)) return false;
      }

      const rawDate = client.dateEnregistrement || client.created_at || client.createdAt || client.dateBail;
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
  }, [listeClients, rechercheTexte, filtreJour, filtreMois, filtreAnnee, filtreDateExacte]);

  return (
    <ConteneurSection as={motion.div} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
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

      <AnimatePresence>
        {messageInterface && (
          <AlerteInterface
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            ⚠️ {messageInterface}
          </AlerteInterface>
        )}
      </AnimatePresence>

      {loading ? (
        <MessageEtat>Chargement des clients depuis la base de données...</MessageEtat>
      ) : erreur ? (
        <MessageEtat style={{ color: '#FF5252' }}>{erreur}</MessageEtat>
      ) : clientsFiltres.length === 0 ? (
        <MessageEtat>Aucun client enregistré ne correspond à vos critères de recherche.</MessageEtat>
      ) : (
        <>
          <ScrollbarHautWrapper ref={scrollbarHautRef} onScroll={gererScrollHaut}>
            <ScrollbarHautContenu style={{ width: `${largeurTableau}px` }} />
          </ScrollbarHautWrapper>

          <ConteneurTableau ref={conteneurTableauRef} onScroll={gererScrollBas}>
            <TableElement ref={tableRef}>
              <EnTeteTableau>
                <tr>
                  <CelluleHeader>Matricule</CelluleHeader>
                  <CelluleHeader>Nom complet & Contact</CelluleHeader>
                  <CelluleHeader>N° Bail & Date</CelluleHeader>
                  <CelluleHeader>Logement / Adresse / Pays</CelluleHeader>
                  <CelluleHeader>Type & Désignation</CelluleHeader>
                  <CelluleHeader>Montant</CelluleHeader>
                  <CelluleHeader>Paiement & Réf.</CelluleHeader>
                  <CelluleHeader>Mois Facturé</CelluleHeader>
                  <CelluleHeader>Contrat (Début / Fin)</CelluleHeader>
                  <CelluleHeader>Date Comptable</CelluleHeader>
                  <CelluleHeader>Compteurs & Suivi Index</CelluleHeader>
                  <CelluleHeader>Actions</CelluleHeader>
                </tr>
              </EnTeteTableau>
              <tbody>
                {clientsFiltres.map((cli, index) => {
                  const possedeCompteur = Boolean(cli.compteur || cli.imputation || cli.dernierNumero);
                  const clientId = cli.id || index;
                  const enAttenteSuppression = idEnCoursDeSuppression === clientId;

                  return (
                    <LigneTableau 
                      key={clientId} 
                      onClick={() => modifierClient(cli)}
                      onMouseEnter={(e) => gererMouseEnter(clientId, e)}
                      onMouseMove={gererMouseMove}
                      onMouseLeave={gererMouseLeave}
                    >
                      <CelluleData>
                        <BadgeMatricule>{cli.matricule || 'N/A'}</BadgeMatricule>
                      </CelluleData>
                      
                      <CelluleData style={{ fontWeight: 600 }}>
                        {cli.nom || ''} {cli.postNom || ''} {cli.prenom || ''}
                        {cli.telephone && (
                          <div style={{ fontSize: '0.7rem', color: THEME.texteSecondaire, marginTop: '2px' }}>
                            Tél: {cli.telephone}
                          </div>
                        )}
                      </CelluleData>
                      
                      <CelluleData>
                        {cli.bail || '-'} <span style={{ color: THEME.texteSecondaire }}>({cli.dateBail || 'N/A'})</span>
                      </CelluleData>
                      
                      <CelluleData>
                        {cli.logement || '-'} / {cli.adresse || '-'} <span style={{ color: THEME.texteSecondaire }}>({cli.pays || 'RDC'})</span>
                      </CelluleData>
                      
                      <CelluleData>
                        <BadgeType>{cli.typeFacture || 'Loyers'}</BadgeType> 
                        <br/><span style={{ fontSize: '0.7rem', color: THEME.texteSecondaire }}>{cli.designation || '-'}</span>
                      </CelluleData>
                      
                      <CelluleData style={{ fontWeight: 700, color: THEME.accentuation }}>
                        {cli.montant ? `${cli.montant} ${cli.devise || 'USD'}` : '-'}
                      </CelluleData>
                      
                      <CelluleData>
                        {cli.modePaiement || '-'} 
                        {cli.reference && <><br/><span style={{ fontSize: '0.7rem', color: THEME.texteSecondaire }}>Réf: {cli.reference}</span></>}
                      </CelluleData>
                      
                      <CelluleData>{cli.moisFacture || 'N/A'}</CelluleData>
                      
                      <CelluleData style={{ fontSize: '0.75rem' }}>
                        {cli.debutContrat || '-'} <br/>au {cli.finContrat || '-'}
                      </CelluleData>
                      
                      <CelluleData>{cli.dateComptable || '-'}</CelluleData>
                      
                      <CelluleData style={{ fontSize: '0.75rem' }}>
                        {possedeCompteur ? (
                          <>
                            {cli.compteur ? `CPT: ${cli.compteur}` : ''} {cli.imputation ? `| Imp: ${cli.imputation}` : ''}<br/>
                            Der N°: {cli.dernierNumero || 0} | Mt: {cli.dernierMontant || 0}<br/>
                            <span style={{ color: THEME.texteSecondaire }}>Dt: {cli.derniereDate || '-'}</span>
                          </>
                        ) : (
                          <span style={{ color: THEME.texteSecondaire }}>Aucun</span>
                        )}
                      </CelluleData>

                      <CelluleData onClick={(e) => e.stopPropagation()}>
                        <AnimatePresence mode="popLayout">
                          {enAttenteSuppression ? (
                            <ConteneurConfirmationInline
                              key="confirmation"
                              initial={{ opacity: 0, scale: 0.9, x: 10 }}
                              animate={{ opacity: 1, scale: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0.9, x: -10 }}
                              transition={{ duration: 0.2, ease: 'easeOut' }}
                            >
                              <span>Confirmer ?</span>
                              <BoutonConfirmation 
                                $oui 
                                onClick={(e) => supprimerClient(e, cli.id)}
                              >
                                Oui
                              </BoutonConfirmation>
                              <BoutonConfirmation 
                                onClick={() => setIdEnCoursDeSuppression(null)}
                              >
                                Non
                              </BoutonConfirmation>
                            </ConteneurConfirmationInline>
                          ) : (
                            <BoutonSupprimer 
                              key="bouton"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              as={motion.button}
                              title="Mettre à la corbeille" 
                              onClick={() => setIdEnCoursDeSuppression(clientId)}
                            >
                              🗑️ Supprimer
                            </BoutonSupprimer>
                          )}
                        </AnimatePresence>
                      </CelluleData>
                    </LigneTableau>
                  );
                })}
              </tbody>
            </TableElement>
          </ConteneurTableau>

          {ligneSurvoleeId !== null && afficherMessage && (
            <InfobulleCurseur $x={positionSouris.x} $y={positionSouris.y}>
              💡 Cliquez pour modifier
            </InfobulleCurseur>
          )}
        </>
      )}
    </ConteneurSection>
  );
}