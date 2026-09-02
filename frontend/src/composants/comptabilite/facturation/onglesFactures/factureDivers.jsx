import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFileText, FiDownload, FiLoader, FiCalendar, FiChevronDown, FiFilter, FiSave, FiFile, FiCreditCard, FiHash } from 'react-icons/fi';
import PDFFacturesDivers from './listePDFFactures/PDFFacturesDivers';

const bmjTheme = {
  fondCarte: '#181818',
  fondFichier: '#141414',
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  bordureClaire: '#3A3A3A',
  survol: '#222222',
  vert: '#4CAF50',
  orange: '#FF9800',
  erreur: '#FF5252',
};

const BmjConteneurSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const BmjEnTeteSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const BmjTitre = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${bmjTheme.textePrincipal};
`;

const BmjSousTitre = styled.p`
  color: ${bmjTheme.texteSecondaire};
  font-size: 0.8rem;
`;

const BmjSelecteurAnneeConteneur = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background-color: #181818;
  border: 1px solid ${bmjTheme.bordure};
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  color: ${bmjTheme.textePrincipal};
  font-size: 0.85rem;

  select {
    background: transparent;
    border: none;
    color: ${bmjTheme.accentuation};
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    outline: none;

    option {
      background-color: #181818;
      color: ${bmjTheme.textePrincipal};
    }
  }
`;

const BmjBoutonGlobal = styled.button`
  background-color: ${bmjTheme.fondCarte};
  border: 1px solid ${bmjTheme.accentuation};
  color: ${bmjTheme.accentuation};
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${bmjTheme.accentuation};
    color: #000;
  }
`;

const BmjBlocAnnee = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #141414;
  border: 1px solid ${bmjTheme.bordure};
  border-radius: 12px;
  padding: 1.2rem;
`;

const BmjTitreAnnee = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  color: ${bmjTheme.accentuation};
  border-bottom: 1px solid ${bmjTheme.bordure};
  padding-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BmjBlocMois = styled.div`
  background-color: #181818;
  border: 1px solid ${bmjTheme.bordure};
  border-radius: 10px;
  overflow: hidden;
`;

const BmjEnTeteMois = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.9rem 1rem;
  cursor: pointer;
  user-select: none;
  background-color: #181818;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${bmjTheme.survol};
  }
`;

const BmjGroupeInfosMois = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const BmjIconeFleche = styled(motion.div)`
  color: ${bmjTheme.texteSecondaire};
  display: flex;
  align-items: center;
  font-size: 1.1rem;
`;

const BmjNomMois = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${bmjTheme.textePrincipal};
  text-transform: capitalize;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const BmjBadgeCompteur = styled.span`
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  background-color: rgba(174, 234, 0, 0.1);
  color: ${bmjTheme.accentuation};
  border: 1px solid rgba(174, 234, 0, 0.2);
`;

const BmjActionsMois = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const BmjBoutonGenererMois = styled.button`
  background-color: #121212;
  border: 1px solid ${bmjTheme.accentuation};
  color: ${bmjTheme.accentuation};
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.73rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: ${bmjTheme.accentuation};
    color: #000000;
  }

  &:disabled {
    opacity: 0.75;
    cursor: not-allowed;
  }
`;

const BmjContenuDepliable = styled(motion.div)`
  padding: 0 1rem 1rem 1rem;
  border-top: 1px dashed ${bmjTheme.bordure};
  margin-top: -0.2rem;
  padding-top: 1rem;
`;

const BmjGrilleFactures = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.6rem;
  align-items: stretch;
  width: 100%;

  @media (max-width: 1600px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (max-width: 1300px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const BmjCarteFactureFichier = styled(motion.div)`
  background-color: ${bmjTheme.fondFichier};
  border: 1px solid ${bmjTheme.bordure};
  border-radius: 8px;
  padding: 0.65rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.5rem;
  position: relative;
  min-width: 0;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: ${bmjTheme.accentuation};
    background-color: ${bmjTheme.survol};
    transform: translateY(-2px);
  }
`;

const BmjEnTeteFichier = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.3rem;

  .icone-doc {
    color: ${bmjTheme.accentuation};
    font-size: 0.9rem;
    background: rgba(174, 234, 0, 0.08);
    padding: 0.3rem;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .badge-statut {
    font-size: 0.5rem;
    color: ${bmjTheme.vert};
    background: rgba(76, 175, 80, 0.1);
    padding: 0.1rem 0.3rem;
    border-radius: 3px;
    font-weight: 600;
    text-transform: uppercase;
  }
`;

const BmjCorpsFichier = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;

  .nom-locataire {
    font-size: 0.74rem;
    font-weight: 600;
    color: ${bmjTheme.textePrincipal};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .meta-infos {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    font-size: 0.62rem;
    color: ${bmjTheme.texteSecondaire};
    min-width: 0;

    span {
      display: flex;
      align-items: center;
      gap: 0.2rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

const BmjPiedFichier = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid ${bmjTheme.bordure};
  padding-top: 0.4rem;
  margin-top: 0.1rem;
  gap: 0.3rem;

  .montant {
    font-size: 0.72rem;
    font-weight: 700;
    color: ${bmjTheme.accentuation};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const BmjBoutonTelechargerFichier = styled.button`
  background-color: #1C1C1C;
  border: 1px solid ${bmjTheme.bordureClaire};
  color: ${bmjTheme.accentuation};
  padding: 0.25rem 0.4rem;
  border-radius: 5px;
  font-size: 0.6rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background-color: ${bmjTheme.accentuation};
    color: #000000;
    border-color: ${bmjTheme.accentuation};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const BmjMessageVide = styled.div`
  padding: 3rem;
  text-align: center;
  color: ${bmjTheme.texteSecondaire};
  font-size: 0.9rem;
  background-color: #141414;
  border: 1px solid ${bmjTheme.bordure};
  border-radius: 12px;
`;

function FactureDivers({
  listeFactures = [],
  formaterDateFr
}) {
  const bmjPdfRef = useRef(null);
  const [bmjIdEnCours, setBmjIdEnCours] = useState(null);
  const [bmjMoisOuverts, setBmjMoisOuverts] = useState({});
  const [bmjAnneeSelectionnee, setBmjAnneeSelectionnee] = useState('toutes');
  
  const [bmjFactures, setBmjFactures] = useState(listeFactures);
  const [bmjChargementAPI, setBmjChargementAPI] = useState(false);

  useEffect(() => {
    const bmjChargerFacturesAutomatiquement = async () => {
      try {
        setBmjChargementAPI(true);
        const bmjReponse = await fetch('http://localhost:5000/api/factures-divers');
        if (bmjReponse.ok) {
          const bmjDonnees = await bmjReponse.json();
          if (Array.isArray(bmjDonnees) && bmjDonnees.length > 0) {
            setBmjFactures(bmjDonnees);
          }
        }
      } catch (bmjErreur) {
        console.error("Erreur de récupération automatique :", bmjErreur);
      } finally {
        setBmjChargementAPI(false);
      }
    };

    if (!listeFactures || listeFactures.length === 0) {
      bmjChargerFacturesAutomatiquement();
    } else {
      setBmjFactures(listeFactures);
    }
  }, [listeFactures]);

  const bmjToggleMois = (bmjCleMois) => {
    setBmjMoisOuverts(bmjPrev => ({
      ...bmjPrev,
      [bmjCleMois]: !bmjPrev[bmjCleMois]
    }));
  };

  const bmjHandleToutTelecharger = () => {
    if (bmjPdfRef.current && typeof bmjPdfRef.current.telechargerTout === 'function') {
      bmjPdfRef.current.telechargerTout(bmjFacturesFiltrees, formaterDateFr);
    }
  };

  const bmjHandleTelechargerUnitaire = async (bmjCli) => {
    const bmjFactureId = bmjCli.id || bmjCli.numeroFacture;
    if (bmjPdfRef.current && typeof bmjPdfRef.current.genererPDF === 'function') {
      try {
        setBmjIdEnCours(bmjFactureId);
        await bmjPdfRef.current.genererPDF(bmjCli, formaterDateFr);
      } catch (bmjError) {
        console.error("Erreur :", bmjError);
      } finally {
        setBmjIdEnCours(null);
      }
    }
  };

  const bmjObtenirAnnee = (bmjCli) => {
    const bmjAnneeBrute = bmjCli.anneeFacturee || bmjCli.anneeFactureChiffre || bmjCli.annee || bmjCli.anneeFacture;
    if (bmjAnneeBrute) return String(bmjAnneeBrute).trim();
    return 'Non défini';
  };

  const bmjObtenirMois = (bmjCli) => {
    const bmjTextePeriode = bmjCli.moisFacture || bmjCli.periode || '';
    if (typeof bmjTextePeriode === 'string' && bmjTextePeriode.trim() !== '') {
      return bmjTextePeriode.replace(/\b\d{4}\b/g, '').trim() || 'septembre';
    }
    return 'septembre'; 
  };

  const bmjOrdreMois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const bmjObtenirIndexMois = (bmjNomMois) => {
    if (!bmjNomMois) return 99;
    const bmjPropre = bmjNomMois.toLowerCase().trim();
    const bmjIndex = bmjOrdreMois.findIndex(bmjM => bmjPropre === bmjM || bmjPropre.includes(bmjM));
    return bmjIndex !== -1 ? bmjIndex : 99;
  };

  const bmjAnneesDisponibles = Array.from(new Set(bmjFactures.map(bmjObtenirAnnee))).filter(bmjA => bmjA !== 'Non défini').sort((a, b) => b.localeCompare(a));
  const bmjFacturesFiltrees = bmjAnneeSelectionnee === 'toutes' ? bmjFactures : bmjFactures.filter(bmjCli => bmjObtenirAnnee(bmjCli) === bmjAnneeSelectionnee);

  const bmjDonneesGroupees = bmjFacturesFiltrees.reduce((bmjAcc, bmjCli) => {
    const bmjAnnee = bmjObtenirAnnee(bmjCli);
    const bmjMois = bmjObtenirMois(bmjCli);
    if (!bmjAcc[bmjAnnee]) bmjAcc[bmjAnnee] = {};
    if (!bmjAcc[bmjAnnee][bmjMois]) bmjAcc[bmjAnnee][bmjMois] = [];
    bmjAcc[bmjAnnee][bmjMois].push(bmjCli);
    return bmjAcc;
  }, {});

  const bmjAnneesTriees = Object.keys(bmjDonneesGroupees).sort((a, b) => b.localeCompare(a));

  return (
    <BmjConteneurSection as={motion.div} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <PDFFacturesDivers ref={bmjPdfRef} formaterDateFr={formaterDateFr} />

      <BmjEnTeteSection>
        <div>
          <BmjTitre>Gestion des Factures Diverses</BmjTitre>
          <BmjSousTitre>Visualisez et filtrez les factures diverses sous forme de fichiers répertoriés</BmjSousTitre>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {bmjAnneesDisponibles.length > 0 && (
            <BmjSelecteurAnneeConteneur>
              <FiFilter />
              <span>Année :</span>
              <select value={bmjAnneeSelectionnee} onChange={(e) => setBmjAnneeSelectionnee(e.target.value)}>
                <option value="toutes">Toutes les années</option>
                {bmjAnneesDisponibles.map(annee => <option key={annee} value={annee}>{annee}</option>)}
              </select>
            </BmjSelecteurAnneeConteneur>
          )}
          {bmjFactures.length > 0 && (
            <BmjBoutonGlobal onClick={bmjHandleToutTelecharger}>
              <FiSave /> Tout Télécharger (PDF)
            </BmjBoutonGlobal>
          )}
        </div>
      </BmjEnTeteSection>

      {bmjChargementAPI ? (
        <BmjMessageVide><FiLoader size={32} style={{ animation: 'spin 1s linear infinite' }} /><p>Chargement...</p></BmjMessageVide>
      ) : bmjFacturesFiltrees.length === 0 ? (
        <BmjMessageVide><FiFileText size={32} style={{ opacity: 0.5 }} /><p>Aucune facture trouvée.</p></BmjMessageVide>
      ) : (
        bmjAnneesTriees.map((bmjAnnee) => {
          const bmjMoisDuGroupe = Object.keys(bmjDonneesGroupees[bmjAnnee]).sort((a, b) => bmjObtenirIndexMois(a) - bmjObtenirIndexMois(b));

          return (
            <BmjBlocAnnee key={bmjAnnee}>
              <BmjTitreAnnee><FiCalendar /> Année {bmjAnnee}</BmjTitreAnnee>

              {bmjMoisDuGroupe.map((bmjMois) => {
                const bmjFacturesDuMois = bmjDonneesGroupees[bmjAnnee][bmjMois];
                const bmjCleAccordeon = `${bmjAnnee}-${bmjMois}`;
                const bmjEstOuvert = !!bmjMoisOuverts[bmjCleAccordeon];

                return (
                  <BmjBlocMois key={bmjMois}>
                    <BmjEnTeteMois onClick={() => bmjToggleMois(bmjCleAccordeon)}>
                      <BmjGroupeInfosMois>
                        <BmjIconeFleche animate={{ rotate: bmjEstOuvert ? 180 : 0 }}><FiChevronDown /></BmjIconeFleche>
                        <BmjNomMois><FiFile /> {bmjMois}</BmjNomMois>
                        <BmjBadgeCompteur>{bmjFacturesDuMois.length} fichier{bmjFacturesDuMois.length > 1 ? 's' : ''}</BmjBadgeCompteur>
                      </BmjGroupeInfosMois>
                      <BmjActionsMois>
                        <BmjBoutonGenererMois onClick={(e) => { e.stopPropagation(); bmjHandleTelechargerUnitaire(bmjFacturesDuMois[0]); }}>
                          <FiDownload /> Générer le mois
                        </BmjBoutonGenererMois>
                      </BmjActionsMois>
                    </BmjEnTeteMois>

                    <AnimatePresence>
                      {bmjEstOuvert && (
                        <BmjContenuDepliable initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                          <BmjGrilleFactures>
                            {bmjFacturesDuMois.map((bmjCli, bmjIndex) => {
                              const bmjFactureId = bmjCli.id ? `id-${bmjCli.id}-${bmjIndex}` : `idx-${bmjAnnee}-${bmjMois}-${bmjIndex}`;
                              const bmjEnCours = bmjIdEnCours === (bmjCli.id || bmjCli.numeroFacture);
                              const bmjNomComplet = `${bmjCli.nom || ''} ${bmjCli.postNom || ''} ${bmjCli.prenom || bmjCli.client || ''}`.trim() || 'Client Inconnu';
                              const bmjDateAffichee = formaterDateFr && (bmjCli.dateBail || bmjCli.dateFacture) ? formaterDateFr(bmjCli.dateBail || bmjCli.dateFacture) : (bmjCli.dateBail || 'N/A');

                              return (
                                <BmjCarteFactureFichier key={bmjFactureId}>
                                  <div>
                                    <BmjEnTeteFichier>
                                      <div className="icone-doc">
                                        <FiFile />
                                      </div>
                                      <span className="badge-statut">{bmjCli.modePaiement || bmjCli.statut || 'Payé'}</span>
                                    </BmjEnTeteFichier>

                                    <BmjCorpsFichier style={{ marginTop: '0.4rem' }}>
                                      <span className="nom-locataire" title={bmjNomComplet}>{bmjNomComplet}</span>
                                      <div className="meta-infos">
                                        <span><FiCreditCard size={9} /> Bail: {bmjCli.bail || bmjCli.numero || 'N/A'}</span>
                                        <span><FiHash size={9} /> {bmjCli.matricule || bmjCli.clientCode || 'Matricule N/A'}</span>
                                        <span>📅 {bmjDateAffichee}</span>
                                      </div>
                                    </BmjCorpsFichier>
                                  </div>

                                  <BmjPiedFichier>
                                    <span className="montant" title={`${bmjCli.montant !== undefined ? bmjCli.montant : 0} ${bmjCli.devise || 'USD'}`}>
                                      {bmjCli.montant !== undefined ? `${bmjCli.montant} ${bmjCli.devise || 'USD'}` : '0 USD'}
                                    </span>
                                    <BmjBoutonTelechargerFichier 
                                      onClick={() => bmjHandleTelechargerUnitaire(bmjCli)} 
                                      disabled={bmjEnCours}
                                    >
                                      {bmjEnCours ? <FiLoader style={{ animation: 'spin 1s linear infinite' }} size={11} /> : <><FiDownload size={11} /> PDF</>}
                                    </BmjBoutonTelechargerFichier>
                                  </BmjPiedFichier>
                                </BmjCarteFactureFichier>
                              );
                            })}
                          </BmjGrilleFactures>
                        </BmjContenuDepliable>
                      )}
                    </AnimatePresence>
                  </BmjBlocMois>
                );
              })}
            </BmjBlocAnnee>
          );
        })
      )}
    </BmjConteneurSection>
  );
}

export default FactureDivers;
export { FactureDivers };