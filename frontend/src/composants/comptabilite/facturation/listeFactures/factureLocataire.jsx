import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiFileText, FiDownload, FiLoader } from 'react-icons/fi';
import PDFFacturesLocataire from './listePDF/PDFFacturesLocataire';

const THEME = {
  fondCarte: '#1E1E1E',
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  survol: '#262626',
  erreur: '#FF5252',
  vert: '#4CAF50',
};

const ConteneurSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const EnTeteSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Titre = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${THEME.textePrincipal};
`;

const SousTitre = styled.p`
  color: ${THEME.texteSecondaire};
  font-size: 0.8rem;
`;

const GrilleFactures = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const CarteFacture = styled(motion.div)`
  background-color: ${THEME.fondCarte};
  border: 1px solid ${THEME.bordure};
  border-radius: 10px;
  padding: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${THEME.accentuation};
  }
`;

const LigneInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.77rem;
  color: ${THEME.texteSecondaire};

  strong {
    color: ${THEME.textePrincipal};
    font-weight: 600;
  }
`;

const SectionDetaillee = styled.div`
  background-color: #141414;
  border: 1px solid ${THEME.bordure};
  border-radius: 6px;
  padding: 0.5rem;
  font-size: 0.7rem;
  color: ${THEME.texteSecondaire};
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  strong {
    color: ${THEME.textePrincipal};
  }
`;

const BadgeStatut = styled.span`
  font-size: 0.68rem;
  padding: 0.15rem 0.45rem;
  border-radius: 8px;
  font-weight: 600;
  background-color: rgba(76, 175, 80, 0.15);
  color: ${THEME.vert};
`;

const GroupeBoutons = styled.div`
  display: flex;
  gap: 0.4rem;
  margin-top: 0.2rem;
`;

const BoutonPDF = styled.button`
  flex: 1;
  background-color: #121212;
  border: 1px solid ${THEME.bordure};
  color: ${THEME.accentuation};
  padding: 0.4rem;
  border-radius: 6px;
  font-size: 0.73rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: ${THEME.accentuation};
    color: #000000;
    border-color: ${THEME.accentuation};
  }

  &:disabled {
    opacity: 0.75;
    cursor: not-allowed;
    background-color: #181818;
  }
`;

const BoutonSupprimer = styled.button`
  background-color: rgba(255, 82, 82, 0.1);
  border: 1px solid rgba(255, 82, 82, 0.3);
  color: ${THEME.erreur};
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  font-size: 0.73rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${THEME.erreur};
    color: #FFFFFF;
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

function FactureLocataire({
  listeFactures = [],
  supprimerFacture,
  formaterDateFr
}) {
  const pdfRef = useRef(null);
  const [idEnCours, setIdEnCours] = useState(null);

  const handleTelechargerPDF = async (cli) => {
    const factureId = cli.id || cli.numeroFacture;
    if (pdfRef.current) {
      try {
        setIdEnCours(factureId);
        await pdfRef.current.genererPDF(cli);
      } catch (error) {
        console.error("Erreur lors du téléchargement :", error);
      } finally {
        setIdEnCours(null);
      }
    }
  };

  return (
    <ConteneurSection as={motion.div} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <EnTeteSection>
        <div>
          <Titre>Gestion des Factures & Loyers Locataires</Titre>
          <SousTitre>Suivi des baux, quittances et paiements de loyers</SousTitre>
        </div>
      </EnTeteSection>

      {/* Composant PDF déporté */}
      <PDFFacturesLocataire ref={pdfRef} formaterDateFr={formaterDateFr} />

      {listeFactures.length === 0 ? (
        <MessageVide>
          <FiFileText size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
          <p>Aucune facture de locataire trouvée.</p>
        </MessageVide>
      ) : (
        <GrilleFactures>
          {listeFactures.map((cli, index) => {
            const factureId = cli.id || cli.numeroFacture;
            const enCoursDeChargement = idEnCours === factureId;
            const nomComplet = `${cli.nom || ''} ${cli.postNom || ''} ${cli.prenom || cli.client || cli.locataire || ''}`.trim() || 'Locataire Inconnu';
            const dateBailAffichee = formaterDateFr && (cli.dateBail || cli.dateFacture) ? formaterDateFr(cli.dateBail || cli.dateFacture) : (cli.dateBail || cli.dateFacture || 'N/A');
            const dateComptableAffichee = formaterDateFr && cli.dateComptable ? formaterDateFr(cli.dateComptable) : (cli.dateComptable || cli.dateEnregistrement || '-');

            return (
              <CarteFacture 
                key={factureId || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.04 }}
              >
                <LigneInfo>
                  <span>Bail : <strong>{cli.bail || cli.numero || 'N/A'}</strong> <span style={{fontSize: '0.65rem'}}>({dateBailAffichee})</span></span>
                  <BadgeStatut>{cli.modePaiement || cli.statut || 'Payé'}</BadgeStatut>
                </LigneInfo>

                <LigneInfo>
                  <span>Matricule :</span>
                  <strong style={{ color: THEME.accentuation }}>{cli.matricule || cli.numero || 'N/A'}</strong>
                </LigneInfo>

                <LigneInfo>
                  <span>Locataire :</span>
                  <strong style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={nomComplet}>
                    {nomComplet}
                  </strong>
                </LigneInfo>

                <LigneInfo>
                  <span>Logement :</span>
                  <strong style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={`${cli.logement || '-'} / ${cli.adresse || '-'}`}>
                    {cli.logement || '-'} / {cli.adresse || '-'}
                  </strong>
                </LigneInfo>

                <LigneInfo>
                  <span>Montant :</span>
                  <strong style={{ color: THEME.accentuation, fontSize: '0.9rem' }}>
                    {cli.montant !== undefined ? `${cli.montant} ${cli.devise || 'USD'}` : '0 USD'}
                  </strong>
                </LigneInfo>

                <LigneInfo>
                  <span>Période :</span>
                  <span>{cli.moisFacture || 'Mois en cours'}</span>
                </LigneInfo>

                <SectionDetaillee>
                  <div>Type : <strong>{cli.typeFacture || cli.type || 'Loyer'}</strong> {cli.designation ? `- ${cli.designation}` : ''}</div>
                  <div>Contrat : <strong>{cli.debutContrat || '---'}</strong> au <strong>{cli.finContrat || '---'}</strong></div>
                  <div>Comptable : <strong>{dateComptableAffichee}</strong> {cli.reference ? `| Réf: ${cli.reference}` : ''}</div>
                </SectionDetaillee>

                <GroupeBoutons>
                  <BoutonPDF 
                    onClick={() => handleTelechargerPDF(cli)} 
                    disabled={enCoursDeChargement}
                    title="Télécharger PDF"
                  >
                    {enCoursDeChargement ? (
                      <>
                        <motion.div 
                          animate={{ rotate: 360 }} 
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          style={{ display: 'flex', alignItems: 'center' }}
                        >
                          <FiLoader />
                        </motion.div>
                        Génération...
                      </>
                    ) : (
                      <>
                        <FiDownload /> PDF
                      </>
                    )}
                  </BoutonPDF>
                  {supprimerFacture && (
                    <BoutonSupprimer onClick={() => supprimerFacture(cli.id)}>
                      Suppr.
                    </BoutonSupprimer>
                  )}
                </GroupeBoutons>
              </CarteFacture>
            );
          })}
        </GrilleFactures>
      )}
    </ConteneurSection>
  );
}

export default FactureLocataire;