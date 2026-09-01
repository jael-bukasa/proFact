import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFileText, FiDownload, FiLoader, FiCalendar, FiChevronDown, FiFilter } from 'react-icons/fi';
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
  formaterDateFr
}) {
  const pdfRef = useRef(null);
  const [idEnCours, setIdEnCours] = useState(null);
  const [moisOuverts, setMoisOuverts] = useState({});
  const [anneeSelectionnee, setAnneeSelectionnee] = useState('toutes');
  
  const [factures, setFactures] = useState(listeFactures);
  const [chargementAPI, setChargementAPI] = useState(false);

  useEffect(() => {
    const chargerFacturesAutomatiquement = async () => {
      try {
        setChargementAPI(true);
        const reponse = await fetch('http://localhost:5000/api/factures');
        if (reponse.ok) {
          const donnees = await reponse.json();
          if (Array.isArray(donnees) && donnees.length > 0) {
            setFactures(donnees);
          }
        }
      } catch (erreur) {
        console.error("Erreur de récupération automatique depuis l'API :", erreur);
      } finally {
        setChargementAPI(false);
      }
    };

    if (!listeFactures || listeFactures.length === 0) {
      chargerFacturesAutomatiquement();
    } else {
      setFactures(listeFactures);
    }
  }, [listeFactures]);

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
    const anneeBrute = 
      cli.anneeFacturee || 
      cli.anneeFactureChiffre || 
      cli.annee || 
      cli.anneeFacture || 
      cli.annee_facture || 
      cli.anneeFactureChiffres;

    if (anneeBrute !== undefined && anneeBrute !== null && anneeBrute !== '') {
      return String(anneeBrute).trim();
    }

    const textePeriode = cli.moisFacture || cli.periode || cli.mois_facture || '';
    if (typeof textePeriode === 'string' && textePeriode.trim() !== '') {
      const matchAnnee = textePeriode.match(/\b(20\d{2})\b/);
      if (matchAnnee) {
        return matchAnnee[0];
      }
    }

    const dateAUtiliser = 
      cli.dateComptable || 
      cli.dateBail || 
      cli.dateFacture || 
      cli.creeLe || 
      cli.date_creation || 
      cli.created_at;

    if (dateAUtiliser) {
      const dateObj = new Date(dateAUtiliser);
      const anneeExtractive = dateObj.getFullYear();
      if (!isNaN(anneeExtractive)) {
        return String(anneeExtractive);
      }
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
    new Set(factures.map(obtenirAnnee))
  ).filter(a => a !== 'Non défini').sort((a, b) => b.localeCompare(a));

  const facturesFiltrees = anneeSelectionnee === 'toutes' 
    ? factures 
    : factures.filter(cli => obtenirAnnee(cli) === anneeSelectionnee);

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
          <Titre>Gestion des Factures & Loyers Locataires</Titre>
          <SousTitre>Visualisez et filtrez les factures par année et par mois</SousTitre>
        </div>

        {anneesDisponibles.length > 0 && (
          <SelecteurAnneeConteneur>
            <FiFilter />
            <span>Année :</span>
            <select 
              value={anneeSelectionnee} 
              onChange={(e) => setAnneeSelectionnee(e.target.value)}
            >
              <option value="toutes">Toutes les années</option>
              {anneesDisponibles.map(annee => (
                <option key={annee} value={annee}>{annee}</option>
              ))}
            </select>
          </SelecteurAnneeConteneur>
        )}
      </EnTeteSection>

      <PDFFacturesLocataire ref={pdfRef} formaterDateFr={formaterDateFr} />

      {chargementAPI ? (
        <MessageVide>
          <FiLoader size={32} className="fa-spin" style={{ marginBottom: '0.5rem', animation: 'spin 1s linear infinite' }} />
          <p>Chargement automatique des factures depuis la base de données...</p>
        </MessageVide>
      ) : facturesFiltrees.length === 0 ? (
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
                        <NomMois>{mois}</NomMois>
                        <BadgeCompteur>{facturesDuMois.length} facture{facturesDuMois.length > 1 ? 's' : ''}</BadgeCompteur>
                      </GroupeInfosMois>

                      <ActionsMois>
                        <BoutonGenererMois 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (facturesDuMois.length > 0) {
                              handleTelechargerPDF(facturesDuMois[0]);
                            }
                          }}
                          title={`Générer la facture du mois de ${mois} ${annee}`}
                        >
                          <FiDownload /> Générer le mois
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
                              const factureId = cli.id ? `id-${cli.id}-${index}` : `idx-${annee}-${mois}-${index}`;
                              const enCoursDeChargement = idEnCours === cli.id;
                              const nomComplet = `${cli.nom || ''} ${cli.postNom || ''} ${cli.prenom || cli.client || cli.locataire || cli.nomLocataire || ''}`.trim() || 'Locataire Inconnu';
                              const dateComptableAffichee = formaterDateFr && cli.dateComptable ? formaterDateFr(cli.dateComptable) : (cli.dateComptable || cli.dateEnregistrement || '-');

                              return (
                                <CarteFacture 
                                  key={factureId}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.2, delay: index * 0.03 }}
                                >
                                  <LigneInfo>
                                    <span>Bail : <strong>{cli.bail || cli.numero || 'N/A'}</strong></span>
                                    <BadgeStatut>{cli.modePaiement || cli.statut || 'Payé'}</BadgeStatut>
                                  </LigneInfo>

                                  <LigneInfo>
                                    <span>Matricule :</span>
                                    <strong style={{ color: THEME.accentuation }}>{cli.matricule || cli.clientCode || cli.numero || 'N/A'}</strong>
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
                                    <span>{cli.moisFacture || mois}</span>
                                  </LigneInfo>

                                  <SectionDetaillee>
                                    <div>Type : <strong>{cli.typeFacture || cli.type || 'Loyer'}</strong></div>
                                    <div>Comptable : <strong>{dateComptableAffichee}</strong></div>
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
                                  </GroupeBoutons>
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

export default FactureLocataire;