import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiLayers, FiLoader, FiFolder, FiChevronDown, FiFile, FiCreditCard, FiHash } from 'react-icons/fi';

import PDFFacturesLocataire from './listePDFFactures/PDFFacturesLocataire';
import PDFFacturesEau from './listePDFFactures/PDFFacturesEau';
import PDFFacturesElectricite from './listePDFFactures/PDFFacturesElectricite';
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
};

const BmjConteneurGlobal = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  position: relative;
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

const BmjBarreNavigationCategories = styled.div`
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  background-color: #121212;
  padding: 0.8rem 1rem;
  border: 1px solid ${bmjTheme.bordure};
  border-radius: 12px;
  align-items: center;
  justify-content: flex-start;
`;

const BmjBoutonFiltreCategorie = styled.button`
  background-color: ${props => props.$actif ? 'rgba(174, 234, 0, 0.15)' : '#1a1a1a'};
  color: ${props => props.$actif ? bmjTheme.accentuation : bmjTheme.texteSecondaire};
  border: 1px solid ${props => props.$actif ? bmjTheme.accentuation : bmjTheme.bordure};
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${bmjTheme.accentuation};
    color: ${bmjTheme.textePrincipal};
  }
`;

const BmjBlocType = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #121212;
  border: 1px solid ${bmjTheme.bordure};
  border-radius: 12px;
  overflow: hidden;
  margin-top: 0.5rem;
  scroll-margin-top: 2rem;
`;

const BmjTitreBloc = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: ${bmjTheme.accentuation};
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.6rem;
  padding: 1rem 1.2rem;
  background-color: #161616;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1a1a1a;
  }
`;

const BmjTitreGauche = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: capitalize;
`;

const BmjContenuDepliable = styled(motion.div)`
  padding: 1.2rem;
  border-top: 1px solid ${bmjTheme.bordure};
`;

const BmjGrilleFactures = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
  gap: 0.4rem;
  align-items: stretch;
  width: 100%;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
  }
  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
  }
  @media (max-width: 750px) {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr !important;
  }
`;

const BmjCarteFactureFichier = styled(motion.div)`
  background-color: ${bmjTheme.fondFichier};
  border: 1px solid ${bmjTheme.bordure};
  border-radius: 6px;
  padding: 0.45rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.35rem;
  position: relative;
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
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
  gap: 0.2rem;
  min-width: 0;

  .icone-doc {
    color: ${bmjTheme.accentuation};
    font-size: 0.75rem;
    background: rgba(174, 234, 0, 0.08);
    padding: 0.2rem;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .badge-statut {
    font-size: 0.45rem;
    color: ${bmjTheme.vert};
    background: rgba(76, 175, 80, 0.1);
    padding: 0.08rem 0.2rem;
    border-radius: 3px;
    font-weight: 600;
    text-transform: uppercase;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const BmjCorpsFichier = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.12rem;
  min-width: 0;

  .nom-locataire {
    font-size: 0.65rem;
    font-weight: 600;
    color: ${bmjTheme.textePrincipal};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }

  .meta-infos {
    display: flex;
    flex-direction: column;
    gap: 0.06rem;
    font-size: 0.55rem;
    color: ${bmjTheme.texteSecondaire};
    min-width: 0;
    width: 100%;

    span {
      display: flex;
      align-items: center;
      gap: 0.15rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
    }
  }
`;

const BmjPiedFichier = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid ${bmjTheme.bordure};
  padding-top: 0.3rem;
  margin-top: 0.02rem;
  gap: 0.2rem;
  min-width: 0;

  .montant {
    font-size: 0.62rem;
    font-weight: 700;
    color: ${bmjTheme.accentuation};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
    min-width: 0;
  }
`;

const BmjBoutonTelechargerFichier = styled.button`
  background-color: #1C1C1C;
  border: 1px solid ${bmjTheme.bordureClaire};
  color: ${bmjTheme.accentuation};
  padding: 0.15rem 0.3rem;
  border-radius: 4px;
  font-size: 0.52rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.1rem;
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
  background-color: ${bmjTheme.fondCarte};
  border: 1px solid ${bmjTheme.bordure};
  border-radius: 12px;
`;

export default function FactureToutes({
  listeFactures: listeFacturesProps = [],
  formaterDateFr
}) {
  const [bmjFacturesBdd, setBmjFacturesBdd] = useState([]);
  const [bmjIdEnCours, setBmjIdEnCours] = useState(null);
  const [bmjChargementAPI, setBmjChargementAPI] = useState(false);
  const [bmjSectionsOuvertes, setBmjSectionsOuvertes] = useState({});

  const bmjRefsSections = useRef({});

  const bmjPdfLocataireRef = useRef(null);
  const bmjPdfEauRef = useRef(null);
  const bmjPdfElectriciteRef = useRef(null);
  const bmjPdfDiversRef = useRef(null);

  useEffect(() => {
    const bmjChargerFacturesBDD = async () => {
      try {
        setBmjChargementAPI(true);
        const bmjResponse = await fetch('http://localhost:5000/api/factures');
        if (bmjResponse.ok) {
          const bmjData = await bmjResponse.json();
          if (Array.isArray(bmjData)) {
            setBmjFacturesBdd(bmjData);
          }
        }
      } catch (bmjError) {
        console.error("Erreur lors de la récupération des factures :", bmjError);
      } finally {
        setBmjChargementAPI(false);
      }
    };

    if (!listeFacturesProps || listeFacturesProps.length === 0) {
      bmjChargerFacturesBDD();
    } else {
      setBmjFacturesBdd(listeFacturesProps);
    }
  }, [listeFacturesProps]);

  const bmjListeEffective = listeFacturesProps.length > 0 ? listeFacturesProps : bmjFacturesBdd;

  const bmjFacturesParType = bmjListeEffective.reduce((bmjAcc, bmjCli) => {
    const bmjType = (bmjCli.typeFacture || bmjCli.type || 'Locataire').trim();
    if (!bmjAcc[bmjType]) bmjAcc[bmjType] = [];
    bmjAcc[bmjType].push(bmjCli);
    return bmjAcc;
  }, {});

  const bmjOrdreCategories = ['Locataire', 'Eau', 'Electricite', 'Divers'];
  
  const bmjTypesTries = Object.keys(bmjFacturesParType).sort((bmjA, bmjB) => {
    const bmjIndexA = bmjOrdreCategories.findIndex(cat => bmjA.toLowerCase().includes(cat.toLowerCase()));
    const bmjIndexB = bmjOrdreCategories.findIndex(cat => bmjB.toLowerCase().includes(cat.toLowerCase()));
    if (bmjIndexA !== -1 && bmjIndexB !== -1) return bmjIndexA - bmjIndexB;
    if (bmjIndexA !== -1) return -1;
    if (bmjIndexB !== -1) return 1;
    return bmjA.localeCompare(bmjB);
  });

  useEffect(() => {
    if (bmjTypesTries.length > 0) {
      const etatInitial = {};
      bmjTypesTries.forEach(type => {
        etatInitial[type] = true;
      });
      setBmjSectionsOuvertes(etatInitial);
    }
  }, [bmjTypesTries.length]);

  const bmjBasculerSection = (type) => {
    setBmjSectionsOuvertes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const bmjAllerVersCategorie = (type) => {
    setBmjSectionsOuvertes(prev => ({
      ...prev,
      [type]: true
    }));
    setTimeout(() => {
      const element = bmjRefsSections.current[type];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const bmjObtenirRefParType = (bmjCli) => {
    const bmjType = (bmjCli.typeFacture || bmjCli.type || 'Locataire').toLowerCase();
    if (bmjType.includes('eau')) return bmjPdfEauRef;
    if (bmjType.includes('elect') || bmjType.includes('electricite')) return bmjPdfElectriciteRef;
    if (bmjType.includes('diver') || bmjType.includes('divers')) return bmjPdfDiversRef;
    return bmjPdfLocataireRef;
  };

  const bmjGererTelechargementPDF = async (bmjCli) => {
    const bmjFactureId = bmjCli.id || bmjCli.numeroFacture;
    const bmjRefCible = bmjObtenirRefParType(bmjCli);

    if (bmjRefCible && bmjRefCible.current && typeof bmjRefCible.current.genererPDF === 'function') {
      try {
        setBmjIdEnCours(bmjFactureId);
        await bmjRefCible.current.genererPDF(bmjCli, formaterDateFr);
      } catch (bmjError) {
        console.error("Erreur génération PDF :", bmjError);
      } finally {
        setBmjIdEnCours(null);
      }
    }
  };

  return (
    <BmjConteneurGlobal as={motion.div} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div style={{ position: 'absolute', left: '-9999px', top: '0', width: '680px', pointerEvents: 'none', overflow: 'hidden', zIndex: -1000 }}>
        <PDFFacturesLocataire ref={bmjPdfLocataireRef} formaterDateFr={formaterDateFr} />
        <PDFFacturesEau ref={bmjPdfEauRef} formaterDateFr={formaterDateFr} />
        <PDFFacturesElectricite ref={bmjPdfElectriciteRef} formaterDateFr={formaterDateFr} />
        <PDFFacturesDivers ref={bmjPdfDiversRef} formaterDateFr={formaterDateFr} />
      </div>

      <BmjEnTeteSection>
        <div>
          <BmjTitre>Classeur Numérique des Factures</BmjTitre>
          <BmjSousTitre>Vignettes compactes (exactement 5 par ligne) et navigation rapide par groupement</BmjSousTitre>
        </div>
      </BmjEnTeteSection>

      {bmjTypesTries.length > 0 && (
        <BmjBarreNavigationCategories>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: bmjTheme.texteSecondaire, marginRight: '0.5rem' }}>
            Aller vers :
          </span>
          {bmjTypesTries.map((bmjTypeFacture) => {
            const bmjTitrePropre = bmjTypeFacture.charAt(0).toUpperCase() + bmjTypeFacture.slice(1);
            const bmjNombre = bmjFacturesParType[bmjTypeFacture]?.length || 0;
            return (
              <BmjBoutonFiltreCategorie 
                key={bmjTypeFacture}
                onClick={() => bmjAllerVersCategorie(bmjTypeFacture)}
              >
                {bmjTitrePropre} ({bmjNombre})
              </BmjBoutonFiltreCategorie>
            );
          })}
        </BmjBarreNavigationCategories>
      )}

      {bmjChargementAPI ? (
        <BmjMessageVide>
          <FiLoader size={32} style={{ marginBottom: '0.5rem', animation: 'spin 1s linear infinite' }} />
          <p>Chargement des fichiers...</p>
        </BmjMessageVide>
      ) : bmjListeEffective.length === 0 ? (
        <BmjMessageVide>
          <FiFolder size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
          <p>Aucun fichier trouvé.</p>
        </BmjMessageVide>
      ) : (
        bmjTypesTries.map((bmjTypeFacture) => {
          const bmjFacturesDuBloc = bmjFacturesParType[bmjTypeFacture];
          const bmjTitreBlocPropre = bmjTypeFacture.charAt(0).toUpperCase() + bmjTypeFacture.slice(1);
          const bmjEstOuvert = bmjSectionsOuvertes[bmjTypeFacture] ?? true;

          return (
            <BmjBlocType 
              key={bmjTypeFacture}
              ref={el => bmjRefsSections.current[bmjTypeFacture] = el}
            >
              <BmjTitreBloc onClick={() => bmjBasculerSection(bmjTypeFacture)}>
                <motion.div animate={{ rotate: bmjEstOuvert ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ display: 'flex', alignItems: 'center' }}>
                  <FiChevronDown size={18} />
                </motion.div>
                <BmjTitreGauche>
                  <FiLayers /> {bmjTitreBlocPropre} ({bmjFacturesDuBloc.length})
                </BmjTitreGauche>
              </BmjTitreBloc>

              <AnimatePresence initial={false}>
                {bmjEstOuvert && (
                  <BmjContenuDepliable
                    key="contenu"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <BmjGrilleFactures>
                      {bmjFacturesDuBloc.map((bmjCli, bmjIndex) => {
                        const bmjFactureId = bmjCli.id ? `id-${bmjCli.id}-${bmjIndex}` : `idx-${bmjTypeFacture}-${bmjIndex}`;
                        const bmjEnCoursDeChargement = bmjIdEnCours === (bmjCli.id || bmjCli.numeroFacture);
                        
                        const bmjNomComplet = `${bmjCli.nom || ''} ${bmjCli.postNom || ''} ${bmjCli.prenom || bmjCli.nomLocataire || bmjCli.client || ''}`.trim() || 'Client Inconnu';
                        const bmjDateAffichee = formaterDateFr && (bmjCli.dateBail || bmjCli.dateFacture) ? formaterDateFr(bmjCli.dateBail || bmjCli.dateFacture) : (bmjCli.dateBail || bmjCli.moisFacture || 'N/A');
                        const bmjMontantAffiche = bmjCli.montant !== undefined ? `${bmjCli.montant} ${bmjCli.devise || 'USD'}` : '0 USD';

                        return (
                          <BmjCarteFactureFichier 
                            key={bmjFactureId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: bmjIndex * 0.01 }}
                          >
                            <div>
                              <BmjEnTeteFichier>
                                <div className="icone-doc">
                                  <FiFile />
                                </div>
                                <span className="badge-statut">{bmjCli.modePaiement || bmjCli.statut || 'Payé'}</span>
                              </BmjEnTeteFichier>

                              <BmjCorpsFichier style={{ marginTop: '0.25rem' }}>
                                <span className="nom-locataire" title={bmjNomComplet}>{bmjNomComplet}</span>
                                <div className="meta-infos">
                                    <span><FiCreditCard size={8} /> Bail: {bmjCli.bail || bmjCli.numero || bmjCli.numeroFacture || 'N/A'}</span>
                                    <span><FiHash size={8} /> {bmjCli.matricule || bmjCli.clientCode || 'Matricule N/A'}</span>
                                    <span>📅 {bmjDateAffichee}</span>
                                </div>
                              </BmjCorpsFichier>
                            </div>

                            <BmjPiedFichier>
                              <span className="montant" title={bmjMontantAffiche}>
                                {bmjMontantAffiche}
                              </span>
                              <BmjBoutonTelechargerFichier 
                                onClick={() => bmjGererTelechargementPDF(bmjCli)} 
                                disabled={bmjEnCoursDeChargement}
                              >
                                {bmjEnCoursDeChargement ? (
                                  <FiLoader className="fa-spin" size={10} />
                                ) : (
                                  <>
                                    <FiDownload size={10} /> PDF
                                  </>
                                )}
                              </BmjBoutonTelechargerFichier>
                            </BmjPiedFichier>
                          </BmjCarteFactureFichier>
                        );
                      })}
                    </BmjGrilleFactures>
                  </BmjContenuDepliable>
                )}
              </AnimatePresence>
            </BmjBlocType>
          );
        })
      )}
    </BmjConteneurGlobal>
  );
}