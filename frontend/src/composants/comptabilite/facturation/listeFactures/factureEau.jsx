import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const THEME = {
  fondCarte: '#1E1E1E',
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  survol: '#262626',
  erreur: '#FF5252',
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

const BoutonActionPetit = styled.button`
  background: transparent;
  border: 1px solid ${props => props.$couleur || THEME.bordure};
  color: ${props => props.$couleur || THEME.textePrincipal};
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.$couleur || THEME.textePrincipal};
    color: #000000;
  }
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

export default function FactureEau({
  listeFactures = [],
  supprimerFacture,
  formaterDateFr
}) {
  const scrollbarHautRef = useRef(null);
  const conteneurTableauRef = useRef(null);
  const tableRef = useRef(null);
  const [largeurTableau, setLargeurTableau] = useState(0);

  useEffect(() => {
    if (tableRef.current) {
      setLargeurTableau(tableRef.current.scrollWidth);
    }
  }, [listeFactures]);

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

  return (
    <ConteneurSection as={motion.div} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {listeFactures.length === 0 ? (
        <MessageVide>Aucune facture d'eau trouvée.</MessageVide>
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
                  <CelluleHeader>Nom complet</CelluleHeader>
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
                {listeFactures.map((cli, index) => {
                  const nomComplet = `${cli.nom || ''} ${cli.postNom || ''} ${cli.prenom || cli.client || cli.locataire || ''}`.trim();

                  return (
                    <LigneTableau key={cli.id || index}>
                      <CelluleData><BadgeMatricule>{cli.matricule || cli.numero || 'N/A'}</BadgeMatricule></CelluleData>
                      
                      <CelluleData style={{ fontWeight: 600 }}>
                        {nomComplet || 'Client Inconnu'}
                      </CelluleData>
                      
                      <CelluleData>
                        {cli.bail || cli.numero || '-'} <span style={{ color: THEME.texteSecondaire }}>({formaterDateFr && (cli.dateBail || cli.dateFacture) ? formaterDateFr(cli.dateBail || cli.dateFacture) : (cli.dateBail || cli.dateFacture || 'N/A')})</span>
                      </CelluleData>
                      
                      <CelluleData>
                        {cli.logement || '-'} / {cli.adresse || '-'} <span style={{ color: THEME.texteSecondaire }}>({cli.pays || 'RDC'})</span>
                      </CelluleData>
                      
                      <CelluleData>
                        <BadgeType>{cli.typeFacture || cli.type || 'Eau'}</BadgeType> 
                        <br/><span style={{ fontSize: '0.7rem', color: THEME.texteSecondaire }}>{cli.designation || '-'}</span>
                      </CelluleData>
                      
                      <CelluleData style={{ fontWeight: 700, color: THEME.accentuation }}>
                        {cli.montant !== undefined ? `${cli.montant} ${cli.devise || 'USD'}` : '-'}
                      </CelluleData>
                      
                      <CelluleData>
                        {cli.modePaiement || cli.statut || '-'} 
                        {cli.reference && <><br/><span style={{ fontSize: '0.7rem', color: THEME.texteSecondaire }}>Réf: {cli.reference}</span></>}
                      </CelluleData>
                      
                      <CelluleData>{cli.moisFacture || 'N/A'}</CelluleData>
                      
                      <CelluleData style={{ fontSize: '0.75rem' }}>
                        {cli.debutContrat || '-'} <br/>au {cli.finContrat || '-'}
                      </CelluleData>
                      
                      <CelluleData>{formaterDateFr && cli.dateComptable ? formaterDateFr(cli.dateComptable) : (cli.dateComptable || cli.dateEnregistrement || '-')}</CelluleData>
                      
                      <CelluleData style={{ fontSize: '0.75rem' }}>
                        {cli.compteur ? (
                          <>
                            CPT: {cli.compteur} {cli.imputation ? `| Imp: ${cli.imputation}` : ''}<br/>
                            Der N°: {cli.dernierNumero || 0} | Mt: {cli.dernierMontant || 0}<br/>
                            <span style={{ color: THEME.texteSecondaire }}>Dt: {cli.derniereDate || '-'}</span>
                          </>
                        ) : (
                          <span style={{ color: THEME.texteSecondaire }}>Aucun</span>
                        )}
                      </CelluleData>

                      <CelluleData>
                        <BoutonActionPetit $couleur={THEME.erreur} onClick={() => supprimerFacture && supprimerFacture(cli.id)}>
                          Supprimer
                        </BoutonActionPetit>
                      </CelluleData>
                    </LigneTableau>
                  );
                })}
              </tbody>
            </TableElement>
          </ConteneurTableau>
        </>
      )}
    </ConteneurSection>
  );
}