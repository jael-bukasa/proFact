import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFileText, FiDownload, FiLoader, FiCalendar, FiChevronDown, FiFilter, FiSave } from 'react-icons/fi';
import PDFFacturesDivers from './listePDF/PDFFacturesDivers';

const bmjTheme = {
  fondCarte: '#1E1E1E',
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  survol: '#262626',
  erreur: '#FF5252',
  orange: '#FF9800',
  vert: '#4CAF50',
  fondChamp: '#121212'
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

const BmjCarteFacture = styled(motion.div)`
  background-color: ${bmjTheme.fondCarte};
  border: 1px solid ${bmjTheme.bordure};
  border-radius: 10px;
  padding: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${bmjTheme.accentuation};
  }
`;

const BmjLigneInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.77rem;
  color: ${bmjTheme.texteSecondaire};

  strong {
    color: ${bmjTheme.textePrincipal};
    font-weight: 600;
  }
`;

const BmjSectionDetaillee = styled.div`
  background-color: #141414;
  border: 1px solid ${bmjTheme.bordure};
  border-radius: 6px;
  padding: 0.5rem;
  font-size: 0.7rem;
  color: ${bmjTheme.texteSecondaire};
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  strong {
    color: ${bmjTheme.textePrincipal};
  }
`;

const BmjBadgeStatut = styled.span`
  font-size: 0.68rem;
  padding: 0.15rem 0.45rem;
  border-radius: 8px;
  font-weight: 600;
  background-color: rgba(255, 152, 0, 0.15);
  color: ${bmjTheme.orange};
`;

const BmjGroupeBoutons = styled.div`
  display: flex;
  gap: 0.4rem;
  margin-top: 0.2rem;
`;

const BmjBoutonPDF = styled.button`
  flex: 1;
  background-color: #121212;
  border: 1px solid ${bmjTheme.bordure};
  color: ${bmjTheme.accentuation};
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
    background-color: ${bmjTheme.accentuation};
    color: #000000;
    border-color: ${bmjTheme.accentuation};
  }

  &:disabled {
    opacity: 0.75;
    cursor: not-allowed;
    background-color: #181818;
  }
`;

const BmjMessageVide = styled.div`
  padding: 3rem;
  text-align: center;
  color: ${bmjTheme.texteSecondaire};
  font-size: 0.9rem;
  background-color: ${bmjTheme.fondCarte};
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
        console.error("Erreur de récupération automatique des factures diverses depuis l'API :", bmjErreur);
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
    const bmjIndex = bmjOrdreMois.findIndex(bmjM => bmjPropre === bmjM || bmjPropre.includes(bmjM));
    return bmjIndex !== -1 ? bmjIndex : 99;
  };

  const bmjAnneesDisponibles = Array.from(
    new Set(bmjFactures.map(bmjObtenirAnnee))
  ).filter(bmjA => bmjA !== 'Non défini').sort((bmjA, bmjB) => bmjB.localeCompare(bmjA));

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

  const bmjAnneesTriees = Object.keys(bmjDonneesGroupees).sort((bmjA, bmjB) => {
    if (bmjA === 'Non défini') return 1;
    if (bmjB === 'Non défini') return -1;
    return bmjB.localeCompare(bmjA);
  });

  return (
    <BmjConteneurSection as={motion.div} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <PDFFacturesDivers ref={bmjPdfRef} formaterDateFr={formaterDateFr} />

      <BmjEnTeteSection>
        <div>
          <BmjTitre>Gestion des Factures Diverses</BmjTitre>
          <BmjSousTitre>Suivi global des quittances, charges et prestations diverses</BmjSousTitre>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {bmjAnneesDisponibles.length > 0 && (
            <BmjSelecteurAnneeConteneur>
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
            </BmjSelecteurAnneeConteneur>
          )}

          {bmjFactures.length > 0 && typeof bmjPdfRef.current?.telechargerTout === 'function' && (
            <BmjBoutonGlobal onClick={bmjHandleToutTelecharger}>
              <FiSave /> Tout Télécharger (PDF)
            </BmjBoutonGlobal>
          )}
        </div>
      </BmjEnTeteSection>

      {bmjChargementAPI ? (
        <BmjMessageVide>
          <FiLoader size={32} className="fa-spin" style={{ marginBottom: '0.5rem', animation: 'spin 1s linear infinite' }} />
          <p>Chargement automatique des factures diverses depuis la base de données...</p>
        </BmjMessageVide>
      ) : bmjFacturesFiltrees.length === 0 ? (
        <BmjMessageVide>
          <FiFileText size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
          <p>Aucune facture diverse trouvée pour la sélection.</p>
        </BmjMessageVide>
      ) : (
        bmjAnneesTriees.map((bmjAnnee) => {
          const bmjMoisDuGroupe = Object.keys(bmjDonneesGroupees[bmjAnnee]).sort((bmjA, bmjB) => bmjObtenirIndexMois(bmjA) - bmjObtenirIndexMois(bmjB));

          return (
            <BmjBlocAnnee key={bmjAnnee}>
              <BmjTitreAnnee>
                <FiCalendar /> Année {bmjAnnee}
              </BmjTitreAnnee>

              {bmjMoisDuGroupe.map((bmjMois) => {
                const bmjFacturesDuMois = bmjDonneesGroupees[bmjAnnee][bmjMois];
                const bmjCleAccordeon = `${bmjAnnee}-${bmjMois}`;
                const bmjEstOuvert = !!bmjMoisOuverts[bmjCleAccordeon];

                return (
                  <BmjBlocMois key={bmjMois}>
                    <BmjEnTeteMois onClick={() => bmjToggleMois(bmjCleAccordeon)}>
                      <BmjGroupeInfosMois>
                        <BmjIconeFleche animate={{ rotate: bmjEstOuvert ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <FiChevronDown />
                        </BmjIconeFleche>
                        <BmjNomMois>{bmjMois}</BmjNomMois>
                        <BmjBadgeCompteur>{bmjFacturesDuMois.length} facture{bmjFacturesDuMois.length > 1 ? 's' : ''}</BmjBadgeCompteur>
                      </BmjGroupeInfosMois>

                      <BmjActionsMois>
                        <BmjBoutonGenererMois 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (bmjFacturesDuMois.length > 0) {
                              bmjHandleTelechargerUnitaire(bmjFacturesDuMois[0]);
                            }
                          }}
                          title={`Générer la facture du mois de ${bmjMois} ${bmjAnnee}`}
                        >
                          <FiDownload /> Générer le mois
                        </BmjBoutonGenererMois>
                      </BmjActionsMois>
                    </BmjEnTeteMois>

                    <AnimatePresence>
                      {bmjEstOuvert && (
                        <BmjContenuDepliable
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <BmjGrilleFactures>
                            {bmjFacturesDuMois.map((bmjCli, bmjIndex) => {
                              const bmjFactureId = bmjCli.id ? `id-${bmjCli.id}-${bmjIndex}` : `idx-${bmjAnnee}-${bmjMois}-${bmjIndex}`;
                              const bmjEnCoursDeChargement = bmjIdEnCours === (bmjCli.id || bmjCli.numeroFacture);
                              const bmjNomComplet = `${bmjCli.nom || ''} ${bmjCli.postNom || ''} ${bmjCli.prenom || bmjCli.client || bmjCli.locataire || ''}`.trim() || 'Client Inconnu';
                              const bmjDateBailAffichee = formaterDateFr && (bmjCli.dateBail || bmjCli.dateFacture) ? formaterDateFr(bmjCli.dateBail || bmjCli.dateFacture) : (bmjCli.dateBail || bmjCli.dateFacture || 'N/A');
                              const bmjDateComptableAffichee = formaterDateFr && bmjCli.dateComptable ? formaterDateFr(bmjCli.dateComptable) : (bmjCli.dateComptable || bmjCli.dateEnregistrement || '-');

                              return (
                                <BmjCarteFacture 
                                  key={bmjFactureId}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.2, delay: bmjIndex * 0.04 }}
                                >
                                  <BmjLigneInfo>
                                    <span>Bail : <strong>{bmjCli.bail || bmjCli.numero || 'N/A'}</strong> <span style={{fontSize: '0.65rem'}}>({bmjDateBailAffichee})</span></span>
                                    <BmjBadgeStatut>{bmjCli.modePaiement || bmjCli.statut || 'En attente'}</BmjBadgeStatut>
                                  </BmjLigneInfo>

                                  <BmjLigneInfo>
                                    <span>Matricule :</span>
                                    <strong style={{ color: bmjTheme.accentuation }}>{bmjCli.matricule || bmjCli.numero || 'N/A'}</strong>
                                  </BmjLigneInfo>

                                  <BmjLigneInfo>
                                    <span>Locataire :</span>
                                    <strong style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={bmjNomComplet}>
                                      {bmjNomComplet}
                                    </strong>
                                  </BmjLigneInfo>

                                  <BmjLigneInfo>
                                    <span>Logement :</span>
                                    <strong style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={`${bmjCli.logement || '-'} / ${bmjCli.adresse || '-'}`}>
                                      {bmjCli.logement || '-'} / {bmjCli.adresse || '-'} <span style={{color: bmjTheme.texteSecondaire}}>({bmjCli.pays || 'RDC'})</span>
                                    </strong>
                                  </BmjLigneInfo>

                                  <BmjLigneInfo>
                                    <span>Montant :</span>
                                    <strong style={{ color: bmjTheme.accentuation, fontSize: '0.9rem' }}>
                                      {bmjCli.montant !== undefined ? `${bmjCli.montant} ${bmjCli.devise || 'USD'}` : '0 USD'}
                                    </strong>
                                  </BmjLigneInfo>

                                  <BmjLigneInfo>
                                    <span>Période :</span>
                                    <span>{bmjCli.moisFacture || bmjMois}</span>
                                  </BmjLigneInfo>

                                  <BmjSectionDetaillee>
                                    <div>Type : <strong>{bmjCli.typeFacture || bmjCli.type || 'Divers'}</strong> {bmjCli.designation ? `- ${bmjCli.designation}` : ''}</div>
                                    <div>Contrat : <strong>{bmjCli.debutContrat || '---'}</strong> au <strong>{bmjCli.finContrat || '---'}</strong></div>
                                    <div>Comptable : <strong>{bmjDateComptableAffichee}</strong> {bmjCli.reference ? `| Réf: ${bmjCli.reference}` : ''}</div>
                                    {bmjCli.compteur ? (
                                      <div style={{ marginTop: '0.15rem', borderTop: '1px solid #222', paddingTop: '0.15rem' }}>
                                        CPT: <strong>{bmjCli.compteur}</strong> {bmjCli.imputation ? `| Imp: ${bmjCli.imputation}` : ''} <br/>
                                        N°: <strong>{bmjCli.dernierNumero || 0}</strong> | Mt: <strong>{bmjCli.dernierMontant || 0}</strong> | Dt: <strong>{bmjCli.derniereDate || '-'}</strong>
                                      </div>
                                    ) : (
                                      <div>Compteur : <span style={{ color: bmjTheme.texteSecondaire }}>Aucun</span></div>
                                    )}
                                  </BmjSectionDetaillee>

                                  <BmjGroupeBoutons>
                                    <BmjBoutonPDF 
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
                                    </BmjBoutonPDF>
                                  </BmjGroupeBoutons>
                                </BmjCarteFacture>
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