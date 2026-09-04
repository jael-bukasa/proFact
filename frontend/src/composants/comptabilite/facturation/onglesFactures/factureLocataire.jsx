import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFileText, FiDownload, FiLoader, FiCalendar, FiChevronDown, FiFilter, FiCreditCard, FiHash, FiFolder, FiFile } from 'react-icons/fi';
import PDFFacturesLocataire from './listePDFFactures/PDFFacturesLocataire';

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
  background-color: ${THEME.fondCarte};
  border: 1px solid ${THEME.bordure};
  border-radius: 12px;
`;

export default function FactureLocataire({ listeFactures = [], formaterDateFr }) {
  const pdfRef = useRef(null);
  const [idEnCours, setIdEnCours] = useState(null);
  const [moisOuverts, setMoisOuverts] = useState({});
  const [anneeSelectionnee, setAnneeSelectionnee] = useState('toutes');

  const toggleMois = (cleMois) => {
    setMoisOuverts(prev => ({
      ...prev,
      [cleMois]: !prev[cleMois]
    }));
  };

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

  const obtenirAnnee = (cli) => {
    const anneeBrute = cli.anneeFacturee || cli.anneeFactureChiffre || cli.annee || cli.anneeFacture || cli.annee_facture;
    if (anneeBrute !== undefined && anneeBrute !== null && anneeBrute !== '') {
      return String(anneeBrute).trim();
    }

    const textePeriode = cli.moisFacture || cli.periode || cli.mois_facture || '';
    if (typeof textePeriode === 'string' && textePeriode.trim() !== '') {
      const matchAnnee = textePeriode.match(/\b(20\d{2})\b/);
      if (matchAnnee) return matchAnnee[0];
    }

    const dateAUtiliser = cli.dateComptable || cli.dateBail || cli.dateFacture || cli.creeLe;
    if (dateAUtiliser) {
      const anneeExtractive = new Date(dateAUtiliser).getFullYear();
      if (!isNaN(anneeExtractive)) return String(anneeExtractive);
    }
    
    return 'Non défini';
  };

  const obtenirMois = (cli) => {
    const textePeriode = cli.moisFacture || cli.periode || cli.mois_facture || '';
    if (typeof textePeriode === 'string' && textePeriode.trim() !== '') {
      return textePeriode.replace(/\b\d{4}\b/g, '').trim() || 'septembre';
    }
    return 'septembre'; 
  };

  const ordreMois = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
  ];

  const obtenirIndexMois = (nomMois) => {
    if (!nomMois) return 99;
    const propre = nomMois.toLowerCase().trim();
    const index = ordreMois.findIndex(m => propre === m || propre.includes(m));
    return index !== -1 ? index : 99;
  };

  const anneesDisponibles = Array.from(
    new Set(listeFactures.map(obtenirAnnee))
  ).filter(a => a !== 'Non défini').sort((a, b) => b.localeCompare(a));

  const facturesFiltrees = anneeSelectionnee === 'toutes' 
    ? listeFactures 
    : listeFactures.filter(cli => obtenirAnnee(cli) === anneeSelectionnee);

  const donneesGroupees = facturesFiltrees.reduce((acc, cli) => {
    const annee = obtenirAnnee(cli);
    const mois = obtenirMois(cli);

    if (!acc[annee]) acc[annee] = {};
    if (!acc[annee][mois]) acc[annee][mois] = [];

    acc[annee][mois].push(cli);
    return acc;
  }, {});

  const anneesTriees = Object.keys(donneesGroupees).sort((a, b) => {
    if (a === 'Non défini') return 1;
    if (b === 'Non défini') return -1;
    return b.localeCompare(a);
  });

  return (
    <ConteneurSection as={motion.div} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <EnTeteSection>
        <div>
          <Titre>Gestion des Factures &amp; Loyers Locataires</Titre>
          <SousTitre>Visualisez et filtrez les factures sous forme de fichiers répertoriés</SousTitre>
        </div>

        {anneesDisponibles.length > 0 && (
          <SelecteurAnneeConteneur>
            <FiFilter />
            <span>Année :</span>
            <select value={anneeSelectionnee} onChange={(e) => setAnneeSelectionnee(e.target.value)}>
              <option value="toutes">Toutes les années</option>
              {anneesDisponibles.map(annee => (
                <option key={annee} value={annee}>{annee}</option>
              ))}
            </select>
          </SelecteurAnneeConteneur>
        )}
      </EnTeteSection>

      <PDFFacturesLocataire ref={pdfRef} formaterDateFr={formaterDateFr} />

      {facturesFiltrees.length === 0 ? (
        <MessageVide>
          <FiFileText size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
          <p>Aucune facture de locataire trouvée pour la sélection.</p>
        </MessageVide>
      ) : (
        anneesTriees.map((annee) => {
          const moisDuGroupe = Object.keys(donneesGroupees[annee]).sort((a, b) => obtenirIndexMois(a) - obtenirIndexMois(b));

          return (
            <BlocAnnee key={annee}>
              <TitreAnnee>
                <FiCalendar /> Année {annee}
              </TitreAnnee>

              {moisDuGroupe.map((mois) => {
                const facturesDuMois = donneesGroupees[annee][mois];
                const cleAccordeon = `${annee}-${mois}`;
                const estOuvert = !!moisOuverts[cleAccordeon];

                return (
                  <BlocMois key={mois}>
                    <EnTeteMois onClick={() => toggleMois(cleAccordeon)}>
                      <GroupeInfosMois>
                        <IconeFleche animate={{ rotate: estOuvert ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <FiChevronDown />
                        </IconeFleche>
                        <NomMois><FiFolder /> {mois}</NomMois>
                        <BadgeCompteur>{facturesDuMois.length} fichier{facturesDuMois.length > 1 ? 's' : ''}</BadgeCompteur>
                      </GroupeInfosMois>

                      <ActionsMois>
                        <BoutonGenererMois 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (facturesDuMois.length > 0) handleTelechargerPDF(facturesDuMois[0]);
                          }}
                        >
                          <FiDownload /> Tout générer (Mois)
                        </BoutonGenererMois>
                      </ActionsMois>
                    </EnTeteMois>

                    <AnimatePresence>
                      {estOuvert && (
                        <ContenuDepliable
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <GrilleFactures>
                            {facturesDuMois.map((cli, index) => {
                              // Inspection console pour voir la structure exacte de l'objet
                              console.log("Objet facture locataire :", cli);

                              const factureId = cli.id ? `id-${cli.id}-${index}` : `idx-${annee}-${mois}-${index}`;
                              const enCoursDeChargement = idEnCours === cli.id;
                              
                              const nomComplet = `${cli.nomLocataire || cli.nom || cli.client || cli.locataire || ''}`.trim() || 'Locataire Inconnu';
                              
                              const dateComptableAffichee = formaterDateFr && cli.dateComptable ? formaterDateFr(cli.dateComptable) : (cli.dateComptable || '-');

                              return (
                                <CarteFactureFichier key={factureId}>
                                  <div>
                                    <EnTeteFichier>
                                      <div className="icone-doc">
                                        <FiFile />
                                      </div>
                                      <span className="badge-statut">{cli.modePaiement || cli.statut || 'Payé'}</span>
                                    </EnTeteFichier>

                                    <CorpsFichier style={{ marginTop: '0.4rem' }}>
                                      <span className="nom-locataire" title={nomComplet}>{nomComplet}</span>
                                      <div className="meta-infos">
                                        <span><FiCreditCard size={9} /> Bail: {cli.bail || cli.numero || 'N/A'}</span>
                                        <span><FiHash size={9} /> {cli.matricule || cli.clientCode || 'Matricule N/A'}</span>
                                        <span>📅 {dateComptableAffichee}</span>
                                      </div>
                                    </CorpsFichier>
                                  </div>

                                  <PiedFichier>
                                    <span className="montant" title={`${cli.montant !== undefined ? cli.montant : 0} ${cli.devise || 'USD'}`}>
                                      {cli.montant !== undefined ? `${cli.montant} ${cli.devise || 'USD'}` : '0 USD'}
                                    </span>
                                    <BoutonTelechargerFichier 
                                      onClick={() => handleTelechargerPDF(cli)} 
                                      disabled={enCoursDeChargement}
                                    >
                                      {enCoursDeChargement ? <FiLoader className="fa-spin" size={11} /> : <><FiDownload size={11} /> PDF</>}
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