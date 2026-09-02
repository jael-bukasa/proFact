import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiFileText, FiDownload, FiLayers, FiLoader } from 'react-icons/fi';

// Importation de vos composants de génération de PDF spécifiques
import PDFFacturesLocataire from './listePDF/PDFFacturesLocataire';
import PDFFacturesEau from './listePDF/PDFFacturesEau';
import PDFFacturesElectricite from './listePDF/PDFFacturesElectricite';
import PDFFacturesDivers from './listePDF/PDFFacturesDivers';

const bmjTheme = {
  fondCarte: '#1E1E1E',
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  survol: '#262626',
  orange: '#FF9800',
  vert: '#4CAF50',
  fondChamp: '#121212',
  fondOnglet: '#141414'
};

const BmjConteneurGlobal = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
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

const BmjBlocType = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #161616;
  border: 1px solid ${bmjTheme.bordure};
  border-radius: 12px;
  padding: 1.2rem;
`;

const BmjTitreBloc = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: ${bmjTheme.accentuation};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid ${bmjTheme.bordure};
  padding-bottom: 0.5rem;
`;

const BmjGrilleFactures = styled(motion.div)`
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
  position: relative;

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
  width: 100%;
  background-color: #121212;
  border: 1px solid ${bmjTheme.bordure};
  color: ${props => props.$couleur || bmjTheme.accentuation};
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
    background-color: ${props => props.$couleurSurvol || bmjTheme.accentuation};
    color: ${props => props.$texteSurvol || '#000000'};
    border-color: ${props => props.$couleurSurvol || bmjTheme.accentuation};
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

export default function FactureToutes({
  listeFactures: listeFacturesProps = [],
  formaterDateFr
}) {
  const [bmjFacturesBdd, setBmjFacturesBdd] = useState([]);
  const [bmjIdEnCours, setBmjIdEnCours] = useState(null);
  const [bmjChargementAPI, setBmjChargementAPI] = useState(false);

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
        console.error("Erreur lors de la récupération des factures depuis la BD :", bmjError);
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
        console.error("Erreur lors de la génération du PDF unitaire :", bmjError);
      } finally {
        setBmjIdEnCours(null);
      }
    }
  };

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

  return (
    <BmjConteneurGlobal as={motion.div} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {/* Conteneur masqué pour les différents générateurs PDF de documents */}
      <div style={{ position: 'absolute', left: '-9999px', top: '0', width: '680px', pointerEvents: 'none', overflow: 'hidden', zIndex: -1000 }}>
        <PDFFacturesLocataire ref={bmjPdfLocataireRef} formaterDateFr={formaterDateFr} />
        <PDFFacturesEau ref={bmjPdfEauRef} formaterDateFr={formaterDateFr} />
        <PDFFacturesElectricite ref={bmjPdfElectriciteRef} formaterDateFr={formaterDateFr} />
        <PDFFacturesDivers ref={bmjPdfDiversRef} formaterDateFr={formaterDateFr} />
      </div>

      <BmjEnTeteSection>
        <div>
          <BmjTitre>Gestion Globale des Factures</BmjTitre>
          <BmjSousTitre>Données synchronisées depuis la base de données</BmjSousTitre>
        </div>
      </BmjEnTeteSection>

      {bmjChargementAPI ? (
        <BmjMessageVide>
          <FiLoader size={32} style={{ marginBottom: '0.5rem', animation: 'spin 1s linear infinite' }} />
          <p>Chargement des factures depuis la base de données...</p>
        </BmjMessageVide>
      ) : bmjListeEffective.length === 0 ? (
        <BmjMessageVide>
          <FiFileText size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
          <p>Aucune facture trouvée dans la base de données.</p>
        </BmjMessageVide>
      ) : (
        bmjTypesTries.map((bmjTypeFacture) => {
          const bmjFacturesDuBloc = bmjFacturesParType[bmjTypeFacture];
          return (
            <BmjBlocType key={bmjTypeFacture}>
              <BmjTitreBloc>
                <FiLayers /> {bmjTypeFacture} ({bmjFacturesDuBloc.length})
              </BmjTitreBloc>
              <BmjGrilleFactures>
                {bmjFacturesDuBloc.map((bmjCli, bmjIndex) => {
                  const bmjFactureId = bmjCli.id || `${bmjTypeFacture}-${bmjIndex}`;
                  const bmjEnCoursDeChargement = bmjIdEnCours === (bmjCli.id || bmjCli.numeroFacture);
                  const bmjNomComplet = `${bmjCli.nom || ''} ${bmjCli.postNom || ''} ${bmjCli.prenom || bmjCli.client || bmjCli.locataire || ''}`.trim() || 'Client Inconnu';
                  const bmjDateBailAffichee = formaterDateFr && (bmjCli.dateBail || bmjCli.dateFacture) ? formaterDateFr(bmjCli.dateBail || bmjCli.dateFacture) : (bmjCli.dateBail || bmjCli.dateFacture || 'N/A');
                  const bmjDateComptableAffichee = formaterDateFr && bmjCli.dateComptable ? formaterDateFr(bmjCli.dateComptable) : (bmjCli.dateComptable || bmjCli.dateEnregistrement || '-');
                  const bmjCodeAffichageCarte = bmjCli.numeroFacture || bmjCli.numFacture || bmjCli.refFacture || bmjCli.matricule || bmjCli.bail || 'N/A';

                  return (
                    <BmjCarteFacture 
                      key={bmjFactureId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: bmjIndex * 0.03 }}
                    >
                      <BmjLigneInfo>
                        <span>Bail : <strong>{bmjCli.bail || bmjCli.numero || 'N/A'}</strong> <span style={{fontSize: '0.65rem'}}>({bmjDateBailAffichee})</span></span>
                        <BmjBadgeStatut>{bmjCli.modePaiement || bmjCli.statut || 'En attente'}</BmjBadgeStatut>
                      </BmjLigneInfo>

                      <BmjLigneInfo>
                        <span>Code / Réf :</span>
                        <strong style={{ color: bmjTheme.accentuation }}>{bmjCodeAffichageCarte}</strong>
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
                        <span>{bmjCli.moisFacture || 'Mois en cours'}</span>
                      </BmjLigneInfo>

                      <BmjSectionDetaillee>
                        <div>Type : <strong>{bmjCli.typeFacture || bmjCli.type || 'Loyers'}</strong> {bmjCli.designation ? `- ${bmjCli.designation}` : ''}</div>
                        <div>Contrat : <strong>{bmjCli.debutContrat || '---'}</strong> au <strong>{bmjCli.finContrat || '---'}</strong></div>
                        <div>Comptable : <strong>{bmjDateComptableAffichee}</strong> {bmjCli.reference ? `| Réf: ${bmjCli.reference}` : ''}</div>
                      </BmjSectionDetaillee>

                      <BmjGroupeBoutons>
                        <BmjBoutonPDF 
                          onClick={() => bmjGererTelechargementPDF(bmjCli)} 
                          disabled={bmjEnCoursDeChargement}
                          title="Générer facture"
                          $couleur={bmjTheme.accentuation}
                          $couleurSurvol={bmjTheme.accentuation}
                          $texteSurvol="#000000"
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
                              <FiDownload /> Générer facture
                            </>
                          )}
                        </BmjBoutonPDF>
                      </BmjGroupeBoutons>
                    </BmjCarteFacture>
                  );
                })}
              </BmjGrilleFactures>
            </BmjBlocType>
          );
        })
      )}
    </BmjConteneurGlobal>
  );
}