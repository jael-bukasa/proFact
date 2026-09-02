import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFileText, FiDownload, FiLoader, FiCalendar, FiChevronDown, FiFilter } from 'react-icons/fi';
import PDFFacturesEau from './listePDF/PDFFacturesEau';

const THEME = {
  fondCarte: '#1E1E1E',
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  survol: '#262626',
  orange: '#FF9800',
  vert: '#4CAF50',
  fondChamp: '#121212'
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

const GrilleFactures = styled.div`
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
  background-color: rgba(255, 152, 0, 0.15);
  color: ${THEME.orange};
`;

const BoutonPDF = styled.button`
  width: 100%;
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
  margin-top: 0.2rem;

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

const MessageVide = styled.div`
  padding: 3rem;
  text-align: center;
  color: ${THEME.texteSecondaire};
  font-size: 0.9rem;
  background-color: ${THEME.fondCarte};
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
          <SousTitre>Suivi détaillé des quittances et compteurs d'eau</SousTitre>
        </div>

        <div>
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
        </div>
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
                        <NomMois>{bmjMois}</NomMois>
                        <BadgeCompteur>{bmjFacturesDuMois.length} facture{bmjFacturesDuMois.length > 1 ? 's' : ''}</BadgeCompteur>
                      </GroupeInfosMois>

                      <ActionsMois>
                        <BoutonGenererMois 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (bmjFacturesDuMois.length > 0) {
                              bmjHandleTelechargerUnitaire(bmjFacturesDuMois[0]);
                            }
                          }}
                          title={`Générer la facture du mois de ${bmjMois} ${bmjAnnee}`}
                        >
                          <FiDownload /> Générer le mois
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
                              const bmjDateBailAffichee = formaterDateFr && (bmjCli.dateBail || bmjCli.dateFacture) ? formaterDateFr(bmjCli.dateBail || bmjCli.dateFacture) : (bmjCli.dateBail || bmjCli.dateFacture || 'N/A');
                              const bmjDateComptableAffichee = formaterDateFr && bmjCli.dateComptable ? formaterDateFr(bmjCli.dateComptable) : (bmjCli.dateComptable || bmjCli.dateEnregistrement || '-');

                              return (
                                <CarteFacture 
                                  key={bmjFactureId}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.2, delay: bmjIndex * 0.04 }}
                                >
                                  <LigneInfo>
                                    <span>Bail : <strong>{bmjCli.bail || bmjCli.numero || 'N/A'}</strong> <span style={{fontSize: '0.65rem'}}>({bmjDateBailAffichee})</span></span>
                                    <BadgeStatut>{bmjCli.modePaiement || bmjCli.statut || 'En attente'}</BadgeStatut>
                                  </LigneInfo>

                                  <LigneInfo>
                                    <span>Matricule :</span>
                                    <strong style={{ color: THEME.accentuation }}>{bmjCli.matricule || bmjCli.numero || 'N/A'}</strong>
                                  </LigneInfo>

                                  <LigneInfo>
                                    <span>Locataire :</span>
                                    <strong style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={bmjNomComplet}>
                                      {bmjNomComplet}
                                    </strong>
                                  </LigneInfo>

                                  <LigneInfo>
                                    <span>Logement :</span>
                                    <strong style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={`${bmjCli.logement || '-'} / ${bmjCli.adresse || '-'}`}>
                                      {bmjCli.logement || '-'} / {bmjCli.adresse || '-'} <span style={{color: THEME.texteSecondaire}}>({bmjCli.pays || 'RDC'})</span>
                                    </strong>
                                  </LigneInfo>

                                  <LigneInfo>
                                    <span>Montant :</span>
                                    <strong style={{ color: THEME.accentuation, fontSize: '0.9rem' }}>
                                      {bmjCli.montant !== undefined ? `${bmjCli.montant} ${bmjCli.devise || 'USD'}` : '0 USD'}
                                    </strong>
                                  </LigneInfo>

                                  <LigneInfo>
                                    <span>Période :</span>
                                    <span>{bmjCli.moisFacture || bmjMois}</span>
                                  </LigneInfo>

                                  <SectionDetaillee>
                                    <div>Type : <strong>{bmjCli.typeFacture || bmjCli.type || 'Eau'}</strong> {bmjCli.designation ? `- ${bmjCli.designation}` : ''}</div>
                                    <div>Contrat : <strong>{bmjCli.debutContrat || '---'}</strong> au <strong>{bmjCli.finContrat || '---'}</strong></div>
                                    <div>Comptable : <strong>{bmjDateComptableAffichee}</strong> {bmjCli.reference ? `| Réf: ${bmjCli.reference}` : ''}</div>
                                    {bmjCli.compteur ? (
                                      <div style={{ marginTop: '0.15rem', borderTop: '1px solid #222', paddingTop: '0.15rem' }}>
                                        CPT: <strong>{bmjCli.compteur}</strong> {bmjCli.imputation ? `| Imp: ${bmjCli.imputation}` : ''} <br/>
                                        N°: <strong>{bmjCli.dernierNumero || 0}</strong> | Mt: <strong>{bmjCli.dernierMontant || 0}</strong> | Dt: <strong>{bmjCli.derniereDate || '-'}</strong>
                                      </div>
                                    ) : (
                                      <div>Compteur : <span style={{ color: THEME.texteSecondaire }}>Aucun</span></div>
                                    )}
                                  </SectionDetaillee>

                                  <BoutonPDF 
                                    onClick={() => bmjHandleTelechargerUnitaire(bmjCli)} 
                                    disabled={bmjEnCoursDeChargement}
                                    title="Télécharger PDF"
                                  >
                                    {bmjEnCoursDeChargement ? (
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
                                </CarteFacture>
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