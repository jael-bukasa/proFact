import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFileText, FiDownload, FiLoader, FiCalendar, FiChevronDown, FiFilter, FiHash, FiCreditCard, FiFolder, FiFile } from 'react-icons/fi';
import PDFFacturesEau from './listePDF/PDFFacturesEau';

const THEME = {
  fondCarte: '#181818',
  fondFichier: '#141414',
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  bordureClaire: '#3A3A3A',
  survol: '#222222',
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

const SelecteurAnneeConteneur = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background-color: #181818;
  border: 1px solid ${THEME.bordure};
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  color: ${THEME.textePrincipal};
  font-size: 0.85rem;

  select {
    background: transparent;
    border: none;
    color: ${THEME.accentuation};
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    outline: none;

    option {
      background-color: #181818;
      color: ${THEME.textePrincipal};
    }
  }
`;

const BlocAnnee = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #141414;
  border: 1px solid ${THEME.bordure};
  border-radius: 12px;
  padding: 1.2rem;
`;

const TitreAnnee = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  color: ${THEME.accentuation};
  border-bottom: 1px solid ${THEME.bordure};
  padding-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BlocMois = styled.div`
  background-color: #181818;
  border: 1px solid ${THEME.bordure};
  border-radius: 10px;
  overflow: hidden;
`;

const EnTeteMois = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.9rem 1rem;
  cursor: pointer;
  user-select: none;
  background-color: #181818;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${THEME.survol};
  }
`;

const GroupeInfosMois = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const IconeFleche = styled(motion.div)`
  color: ${THEME.texteSecondaire};
  display: flex;
  align-items: center;
  font-size: 1.1rem;
`;

const NomMois = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${THEME.textePrincipal};
  text-transform: capitalize;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const BadgeCompteur = styled.span`
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  background-color: rgba(174, 234, 0, 0.1);
  color: ${THEME.accentuation};
  border: 1px solid rgba(174, 234, 0, 0.2);
`;

const ActionsMois = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const BoutonGenererMois = styled.button`
  background-color: #121212;
  border: 1px solid ${THEME.accentuation};
  color: ${THEME.accentuation};
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
    background-color: ${THEME.accentuation};
    color: #000000;
  }

  &:disabled {
    opacity: 0.75;
    cursor: not-allowed;
  }
`;

const ContenuDepliable = styled(motion.div)`
  padding: 0 1rem 1rem 1rem;
  border-top: 1px dashed ${THEME.bordure};
  margin-top: -0.2rem;
  padding-top: 1rem;
`;

/* --- FORCÉ STRICTEMENT À 5 PAR LIGNE --- */
const GrilleFactures = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.6rem;
  align-items: stretch;
  width: 100%;
`;

const CarteFactureFichier = styled(motion.div)`
  background-color: ${THEME.fondFichier};
  border: 1px solid ${THEME.bordure};
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
    border-color: ${THEME.accentuation};
    background-color: ${THEME.survol};
    transform: translateY(-2px);
  }
`;

const EnTeteFichier = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.3rem;

  .icone-doc {
    color: ${THEME.accentuation};
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
    color: ${THEME.vert};
    background: rgba(76, 175, 80, 0.1);
    padding: 0.1rem 0.3rem;
    border-radius: 3px;
    font-weight: 600;
    text-transform: uppercase;
  }
`;

const CorpsFichier = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;

  .nom-locataire {
    font-size: 0.74rem;
    font-weight: 600;
    color: ${THEME.textePrincipal};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .meta-infos {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    font-size: 0.62rem;
    color: ${THEME.texteSecondaire};
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

const PiedFichier = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid ${THEME.bordure};
  padding-top: 0.4rem;
  margin-top: 0.1rem;
  gap: 0.3rem;

  .montant {
    font-size: 0.72rem;
    font-weight: 700;
    color: ${THEME.accentuation};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const BoutonTelechargerFichier = styled.button`
  background-color: #1C1C1C;
  border: 1px solid ${THEME.bordureClaire};
  color: ${THEME.accentuation};
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
    background-color: ${THEME.accentuation};
    color: #000000;
    border-color: ${THEME.accentuation};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const MessageVide = styled.div`
  padding: 3rem;
  text-align: center;
  color: ${THEME.texteSecondaire};
  font-size: 0.9rem;
  background-color: #141414;
  border: 1px solid ${THEME.bordure};
  border-radius: 12px;
`;

function FactureEau({ formaterDateFr }) {
  const bmjPdfRef = useRef(null);
  const [bmjIdEnCours, setBmjIdEnCours] = useState(null);
  const [bmjMoisOuverts, setBmjMoisOuverts] = useState({});
  const [bmjAnneeSelectionnee, setBmjAnneeSelectionnee] = useState('toutes');
  
  const [bmjFactures, setBmjFactures] = useState([]);
  const [bmjChargementAPI, setBmjChargementAPI] = useState(true);

  useEffect(() => {
    const bmjChargerFacturesAutomatiquement = async () => {
      try {
        setBmjChargementAPI(true);
        let bmjReponse = await fetch('http://localhost:5000/api/factures-eau');
        
        if (!bmjReponse.ok) {
          bmjReponse = await fetch('http://localhost:5000/api/factures');
        }

        if (bmjReponse.ok) {
          const bmjDonnees = await bmjReponse.json();
          const bmjListe = Array.isArray(bmjDonnees) ? bmjDonnees : (bmjDonnees.data || bmjDonnees.factures || []);
          
          const bmjFacturesEauFiltrees = bmjListe.filter(bmjItem => {
            const bmjType = (bmjItem.typeFacture || bmjItem.type || '').toLowerCase();
            return bmjType.includes('eau') || bmjType.includes('water');
          });

          setBmjFactures(bmjFacturesEauFiltrees.length > 0 ? bmjFacturesEauFiltrees : bmjListe);
        }
      } catch (bmjErreur) {
        console.error("Erreur de récupération automatique des factures d'eau depuis l'API :", bmjErreur);
      } finally {
        setBmjChargementAPI(false);
      }
    };

    bmjChargerFacturesAutomatiquement();
  }, []);

  const bmjToggleMois = (bmjCleMois) => {
    setBmjMoisOuverts(bmjPrev => ({
      ...bmjPrev,
      [bmjCleMois]: !bmjPrev[bmjCleMois]
    }));
  };

  const bmjHandleTelechargerUnitaire = async (bmjCli) => {
    const bmjFactureId = bmjCli.id || bmjCli.numeroFacture;
    if (bmjPdfRef.current && typeof bmjPdfRef.current.genererPDF === 'function') {
      try {
        setBmjIdEnCours(bmjFactureId);
        await bmjPdfRef.current.genererPDF(bmjCli, formaterDateFr);
      } catch (bmjError) {
        console.error("Erreur lors du téléchargement :", bmjError);
      } finally {
        setBmjIdEnCours(null);
      }
    }
  };

  const bmjObtenirAnnee = (bmjCli) => {
    const bmjAnneeBrute = 
      bmjCli.anneeFacturee || 
      bmjCli.anneeFactureChiffre || 
      bmjCli.annee || 
      bmjCli.anneeFacture || 
      bmjCli.annee_facture || 
      bmjCli.anneeFactureChiffres;

    if (bmjAnneeBrute !== undefined && bmjAnneeBrute !== null && bmjAnneeBrute !== '') {
      return String(bmjAnneeBrute).trim();
    }

    const bmjTextePeriode = bmjCli.moisFacture || bmjCli.periode || bmjCli.mois_facture || '';
    if (typeof bmjTextePeriode === 'string' && bmjTextePeriode.trim() !== '') {
      const bmjMatchAnnee = bmjTextePeriode.match(/\b(20\d{2})\b/);
      if (bmjMatchAnnee) {
        return bmjMatchAnnee[0];
      }
    }

    const bmjDateAUtiliser = 
      bmjCli.dateComptable || 
      bmjCli.dateBail || 
      bmjCli.dateFacture || 
      bmjCli.creeLe || 
      bmjCli.date_creation || 
      bmjCli.created_at;

    if (bmjDateAUtiliser) {
      const bmjDateObj = new Date(bmjDateAUtiliser);
      const bmjAnneeExtractive = bmjDateObj.getFullYear();
      if (!isNaN(bmjAnneeExtractive)) {
        return String(bmjAnneeExtractive);
      }
    }
    
    return 'Non défini';
  };

  const bmjObtenirMois = (bmjCli) => {
    const bmjTextePeriode = bmjCli.moisFacture || bmjCli.periode || bmjCli.mois_facture || '';
    if (typeof bmjTextePeriode === 'string' && bmjTextePeriode.trim() !== '') {
      return bmjTextePeriode.replace(/\b\d{4}\b/g, '').trim() || 'septembre';
    }
    return 'septembre'; 
  };

  const bmjOrdreMois = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
  ];

  const bmjObtenirIndexMois = (bmjNomMois) => {
    if (!bmjNomMois) return 99;
    const bmjPropre = bmjNomMois.toLowerCase().trim();
    const bmjIndex = bmjOrdreMois.findIndex(m => bmjPropre === m || bmjPropre.includes(m));
    return bmjIndex !== -1 ? bmjIndex : 99;
  };

  const bmjAnneesDisponibles = Array.from(
    new Set(bmjFactures.map(bmjObtenirAnnee))
  ).filter(a => a !== 'Non défini').sort((a, b) => b.localeCompare(a));

  const bmjFacturesFiltrees = bmjAnneeSelectionnee === 'toutes' 
    ? bmjFactures 
    : bmjFactures.filter(bmjCli => bmjObtenirAnnee(bmjCli) === bmjAnneeSelectionnee);

  const bmjDonneesGroupees = bmjFacturesFiltrees.reduce((bmjAcc, bmjCli) => {
    const bmjAnnee = bmjObtenirAnnee(bmjCli);
    const bmjMois = bmjObtenirMois(bmjCli);

    if (!bmjAcc[bmjAnnee]) bmjAcc[bmjAnnee] = {};
    if (!bmjAcc[bmjAnnee][bmjMois]) bmjAcc[bmjAnnee][bmjMois] = [];

    bmjAcc[bmjAnnee][bmjMois].push(bmjCli);
    return bmjAcc;
  }, {});

  const bmjAnneesTriees = Object.keys(bmjDonneesGroupees).sort((a, b) => {
    if (a === 'Non défini') return 1;
    if (b === 'Non défini') return -1;
    return b.localeCompare(a);
  });

  return (
    <ConteneurSection as={motion.div} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <PDFFacturesEau ref={bmjPdfRef} />

      <EnTeteSection>
        <div>
          <Titre>Gestion des Factures d'Eau</Titre>
          <SousTitre>Visualisez et filtrez les factures d'eau sous forme de fichiers répertoriés</SousTitre>
        </div>

        {bmjAnneesDisponibles.length > 0 && (
          <SelecteurAnneeConteneur>
            <FiFilter />
            <span>Année :</span>
            <select 
              value={bmjAnneeSelectionnee} 
              onChange={(e) => setBmjAnneeSelectionnee(e.target.value)}
            >
              <option value="toutes">Toutes les années</option>
              {bmjAnneesDisponibles.map(bmjAnnee => (
                <option key={bmjAnnee} value={bmjAnnee}>{bmjAnnee}</option>
              ))}
            </select>
          </SelecteurAnneeConteneur>
        )}
      </EnTeteSection>

      {bmjChargementAPI ? (
        <MessageVide>
          <FiLoader size={32} style={{ marginBottom: '0.5rem', animation: 'spin 1s linear infinite' }} />
          <p>Chargement automatique des factures d'eau depuis la base de données...</p>
        </MessageVide>
      ) : bmjFacturesFiltrees.length === 0 ? (
        <MessageVide>
          <FiFileText size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
          <p>Aucune facture d'eau trouvée pour la sélection.</p>
        </MessageVide>
      ) : (
        bmjAnneesTriees.map((bmjAnnee) => {
          const bmjMoisDuGroupe = Object.keys(bmjDonneesGroupees[bmjAnnee]).sort((a, b) => bmjObtenirIndexMois(a) - bmjObtenirIndexMois(b));

          return (
            <BlocAnnee key={bmjAnnee}>
              <TitreAnnee>
                <FiCalendar /> Année {bmjAnnee}
              </TitreAnnee>

              {bmjMoisDuGroupe.map((bmjMois) => {
                const bmjFacturesDuMois = bmjDonneesGroupees[bmjAnnee][bmjMois];
                const bmjCleAccordeon = `${bmjAnnee}-${bmjMois}`;
                const bmjEstOuvert = !!bmjMoisOuverts[bmjCleAccordeon];

                return (
                  <BlocMois key={bmjMois}>
                    <EnTeteMois onClick={() => bmjToggleMois(bmjCleAccordeon)}>
                      <GroupeInfosMois>
                        <IconeFleche animate={{ rotate: bmjEstOuvert ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <FiChevronDown />
                        </IconeFleche>
                        <NomMois><FiFolder /> {bmjMois}</NomMois>
                        <BadgeCompteur>{bmjFacturesDuMois.length} fichier{bmjFacturesDuMois.length > 1 ? 's' : ''}</BadgeCompteur>
                      </GroupeInfosMois>

                      <ActionsMois>
                        <BoutonGenererMois 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (bmjFacturesDuMois.length > 0) {
                              bmjHandleTelechargerUnitaire(bmjFacturesDuMois[0]);
                            }
                          }}
                        >
                          <FiDownload /> Tout générer (Mois)
                        </BoutonGenererMois>
                      </ActionsMois>
                    </EnTeteMois>

                    <AnimatePresence>
                      {bmjEstOuvert && (
                        <ContenuDepliable
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <GrilleFactures>
                            {bmjFacturesDuMois.map((bmjCli, bmjIndex) => {
                              const bmjFactureId = bmjCli.id ? `id-${bmjCli.id}-${bmjIndex}` : `idx-${bmjAnnee}-${bmjMois}-${bmjIndex}`;
                              const bmjEnCoursDeChargement = bmjIdEnCours === (bmjCli.id || bmjCli.numeroFacture);
                              const bmjNomComplet = `${bmjCli.nom || ''} ${bmjCli.postNom || ''} ${bmjCli.prenom || bmjCli.client || bmjCli.locataire || ''}`.trim() || 'Client Inconnu';
                              const bmjDateComptableAffichee = formaterDateFr && bmjCli.dateComptable ? formaterDateFr(bmjCli.dateComptable) : (bmjCli.dateComptable || '-');

                              return (
                                <CarteFactureFichier key={bmjFactureId}>
                                  <div>
                                    <EnTeteFichier>
                                      <div className="icone-doc">
                                        <FiFile />
                                      </div>
                                      <span className="badge-statut">{bmjCli.modePaiement || bmjCli.statut || 'Payé'}</span>
                                    </EnTeteFichier>

                                    <CorpsFichier style={{ marginTop: '0.4rem' }}>
                                      <span className="nom-locataire" title={bmjNomComplet}>{bmjNomComplet}</span>
                                      <div className="meta-infos">
                                        <span><FiCreditCard size={9} /> Bail: {bmjCli.bail || bmjCli.numero || 'N/A'}</span>
                                        <span><FiHash size={9} /> {bmjCli.matricule || bmjCli.clientCode || 'Matricule N/A'}</span>
                                        <span>📅 {bmjDateComptableAffichee}</span>
                                      </div>
                                    </CorpsFichier>
                                  </div>

                                  <PiedFichier>
                                    <span className="montant" title={`${bmjCli.montant !== undefined ? bmjCli.montant : 0} ${bmjCli.devise || 'USD'}`}>
                                      {bmjCli.montant !== undefined ? `${bmjCli.montant} ${bmjCli.devise || 'USD'}` : '0 USD'}
                                    </span>
                                    <BoutonTelechargerFichier 
                                      onClick={() => bmjHandleTelechargerUnitaire(bmjCli)} 
                                      disabled={bmjEnCoursDeChargement}
                                    >
                                      {bmjEnCoursDeChargement ? <FiLoader className="fa-spin" size={11} /> : <><FiDownload size={11} /> PDF</>}
                                    </BoutonTelechargerFichier>
                                  </PiedFichier>
                                </CarteFactureFichier>
                              );
                            })}
                          </GrilleFactures>
                        </ContenuDepliable>
                      )}
                    </AnimatePresence>
                  </BlocMois>
                );
              })}
            </BlocAnnee>
          );
        })
      )}
    </ConteneurSection>
  );
}

export default FactureEau;
export { FactureEau };