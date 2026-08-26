import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBarChart2, FiX, FiDownload } from 'react-icons/fi';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PDFStatistique from './genererStatistique/PDFStatistique';

const THEME = {
  fondPopup: '#1E1E1E',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  accentuation: '#AEEA00',
};

const ConteneurRef = styled.div`
  display: inline-block;
`;

const ConteneurPopover = styled.div`
  position: relative;
  display: inline-block;
`;

const BoutonGenerer = styled(motion.button)`
  background-color: ${THEME.accentuation};
  color: #121212;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(174, 234, 0, 0.2);

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  svg {
    font-size: 1.1rem;
  }
`;

const BoiteFlottante = styled(motion.div)`
  position: absolute;
  top: 120%;
  right: 0;
  width: 380px;
  background-color: ${THEME.fondPopup};
  border: 1px solid ${THEME.bordure};
  border-radius: 16px;
  padding: 1.2rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 480px) {
    width: 300px;
    right: -50px;
  }
`;

const EnTetePopover = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${THEME.bordure};
  padding-bottom: 0.6rem;

  h4 {
    color: ${THEME.textePrincipal};
    font-size: 0.95rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 0.4rem;

    span {
      color: ${THEME.accentuation};
      text-transform: capitalize;
    }
  }

  button {
    background: transparent;
    border: none;
    color: ${THEME.texteSecondaire};
    cursor: pointer;
    font-size: 1rem;
    padding: 0.2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: ${THEME.textePrincipal};
    }
  }
`;

const ConfirmationMessage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  text-align: left;

  p {
    color: ${THEME.textePrincipal};
    font-size: 0.88rem;
    line-height: 1.4;

    span {
      color: ${THEME.accentuation};
      font-weight: 600;
      text-transform: capitalize;
    }
  }

  .actions-mini {
    display: flex;
    justify-content: flex-end;
    gap: 0.6rem;
    margin-top: 0.4rem;

    button {
      padding: 0.4rem 0.9rem;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.82rem;
      cursor: pointer;
      border: none;

      &.btn-oui {
        background-color: ${THEME.accentuation};
        color: #121212;
        &:hover { opacity: 0.9; }
      }

      &.btn-non {
        background-color: rgba(255, 255, 255, 0.1);
        color: ${THEME.textePrincipal};
        &:hover { background-color: rgba(255, 255, 255, 0.15); }
      }
    }
  }
`;

const GrilleMiniStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.6rem;

  .carte-mini {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid ${THEME.bordure};
    border-radius: 8px;
    padding: 0.6rem;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;

    span:first-child {
      color: ${THEME.texteSecondaire};
      font-size: 0.72rem;
    }

    span:last-child {
      color: ${THEME.textePrincipal};
      font-size: 0.95rem;
      font-weight: 700;
    }
  }
`;

const ConteneurListeScroll = styled.div`
  max-height: 140px;
  overflow-y: auto;
  padding-right: 4px;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${THEME.bordure};
    border-radius: 4px;
    &:hover {
      background: ${THEME.accentuation};
    }
  }
`;

const ListeTypesMini = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  .ligne-type-mini {
    display: flex;
    justify-content: space-between;
    font-size: 0.78rem;
    background: rgba(255, 255, 255, 0.02);
    padding: 0.35rem 0.5rem;
    border-radius: 6px;
    border: 1px solid ${THEME.bordure};
    color: ${THEME.textePrincipal};

    span:last-child {
      color: ${THEME.accentuation};
      font-weight: 600;
    }
  }
`;

const ActionsPied = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid ${THEME.bordure};
  padding-top: 0.6rem;

  button {
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.8rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    border: none;

    &.btn-telecharger {
      background: rgba(255, 255, 255, 0.1);
      color: ${THEME.textePrincipal};
      &:hover { background: rgba(255, 255, 255, 0.15); }
    }

    &.btn-fermer {
      background: ${THEME.accentuation};
      color: #121212;
      &:hover { opacity: 0.9; }
    }
  }
`;

export default function GenererStatistique({ dateFiltre, statistiques, devise, tauxChangeCDF, utilisateurConnecte }) {
  const [etape, setEtape] = useState(null);
  const [enCoursDeTelechargement, setEnCoursDeTelechargement] = useState(false);
  const conteneurRef = useRef(null);

  // --- FONCTION ANTI-DOUBLON ROBUSTE AVEC NORMALISATION DES ACCENTS ---
  const obtenirNomCompletAdmin = () => {
    if (!utilisateurConnecte) {
      return 'Bukasa Mulaji Jael';
    }

    if (typeof utilisateurConnecte === 'object') {
      const prenom = utilisateurConnecte.prenom || '';
      const nom = utilisateurConnecte.nom || utilisateurConnecte.name || '';
      const postnom = utilisateurConnecte.postnom || '';

      const chaineTotale = `${prenom} ${nom} ${postnom}`;
      const motsBruts = chaineTotale.split(/\s+/);
      const motsUniques = [];

      motsBruts.forEach(mot => {
        const net = mot.trim();
        if (!net) return;

        // Normalisation (ex: "Jaël" et "Jael" ou doublons stricts sont détectés)
        const motNormalise = net.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        const dejaPresent = motsUniques.some(m => {
          const mNorm = m.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          return mNorm === motNormalise;
        });

        if (!dejaPresent) {
          motsUniques.push(net);
        }
      });

      if (motsUniques.length > 0) {
        return motsUniques.join(' ');
      }
    }

    if (typeof utilisateurConnecte === 'string' && utilisateurConnecte.trim() !== '') {
      return utilisateurConnecte;
    }

    return 'Bukasa Mulaji Jael';
  };

  const nomAdministrateur = obtenirNomCompletAdmin();
  const moisAnneeTexte = dateFiltre.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });

  const volumeAffiche = devise === 'USD' 
    ? statistiques.montantTotalGlobalUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    : (statistiques.montantTotalGlobalUSD * tauxChangeCDF).toLocaleString('fr-FR', { style: 'currency', currency: 'CDF' });

  useEffect(() => {
    const gererClicExterieur = (e) => {
      if (conteneurRef.current && !conteneurRef.current.contains(e.target)) {
        setEtape(null);
      }
    };
    document.addEventListener('mousedown', gererClicExterieur);
    return () => document.removeEventListener('mousedown', gererClicExterieur);
  }, []);

  const telechargerPDF = async () => {
    const element = document.getElementById('rapport-pdf-export');
    if (!element) return;

    setEnCoursDeTelechargement(true);
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Rapport_Administrateur_${moisAnneeTexte}.pdf`);
    } catch (erreur) {
      console.error("Erreur lors de la génération du PDF :", erreur);
    } finally {
      setEnCoursDeTelechargement(false);
      setEtape(null);
    }
  };

  return (
    <ConteneurRef ref={conteneurRef}>
      <ConteneurPopover>
        <BoutonGenerer 
          onClick={() => setEtape(etape === null ? 'confirmation' : null)}
          whileTap={{ scale: 0.97 }}
        >
          <FiBarChart2 />
          Générer statistique
        </BoutonGenerer>

        <AnimatePresence>
          {etape !== null && (
            <BoiteFlottante
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {etape === 'confirmation' ? (
                <ConfirmationMessage>
                  <EnTetePopover>
                    <h4>Confirmation</h4>
                    <button onClick={() => setEtape(null)}><FiX /></button>
                  </EnTetePopover>
                  <p>Voulez-vous vraiment générer le rapport statistique pour <span>{moisAnneeTexte}</span> ?</p>
                  <div className="actions-mini">
                    <button className="btn-non" onClick={() => setEtape(null)}>Annuler</button>
                    <button className="btn-oui" onClick={() => setEtape('rapport')}>Oui, générer</button>
                  </div>
                </ConfirmationMessage>
              ) : (
                <>
                  <EnTetePopover>
                    <h4>Rapport - <span>{moisAnneeTexte}</span></h4>
                    <button onClick={() => setEtape(null)}><FiX /></button>
                  </EnTetePopover>

                  <GrilleMiniStats>
                    <div className="carte-mini">
                      <span>Total Dossiers</span>
                      <span>{statistiques.totalDossiers}</span>
                    </div>
                    <div className="carte-mini">
                      <span>Volume Global</span>
                      <span>{volumeAffiche}</span>
                    </div>
                    <div className="carte-mini">
                      <span>Dossiers Soldés</span>
                      <span>{statistiques.totalRegle} / {statistiques.totalDossiers}</span>
                    </div>
                    <div className="carte-mini">
                      <span>Recouvrement</span>
                      <span>
                        {statistiques.totalDossiers > 0 
                          ? Math.round((statistiques.totalRegle / statistiques.totalDossiers) * 100) 
                          : 0}%
                      </span>
                    </div>
                  </GrilleMiniStats>

                  <ConteneurListeScroll>
                    <ListeTypesMini>
                      {Object.entries(statistiques.statsTypes).map(([nom, data]) => {
                        const montantType = devise === 'USD' 
                          ? data.montantUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                          : (data.montantUSD * tauxChangeCDF).toLocaleString('fr-FR', { style: 'currency', currency: 'CDF' });

                        return (
                          <div className="ligne-type-mini" key={nom}>
                            <span>{data.icon} {data.label} ({data.count})</span>
                            <span>{montantType}</span>
                          </div>
                        );
                      })}
                    </ListeTypesMini>
                  </ConteneurListeScroll>

                  <ActionsPied>
                    <button className="btn-telecharger" onClick={telechargerPDF} disabled={enCoursDeTelechargement}>
                      <FiDownload /> {enCoursDeTelechargement ? "Génération..." : "Télécharger PDF"}
                    </button>
                    <button className="btn-fermer" onClick={() => setEtape(null)}>
                      Fermer
                    </button>
                  </ActionsPied>
                </>
              )}
            </BoiteFlottante>
          )}
        </AnimatePresence>

        <PDFStatistique 
          idRapport="rapport-pdf-export"
          moisAnneeTexte={moisAnneeTexte}
          statistiques={statistiques}
          volumeAffiche={volumeAffiche}
          devise={devise}
          tauxChangeCDF={tauxChangeCDF}
          nomAdministrateur={nomAdministrateur}
        />

      </ConteneurPopover>
    </ConteneurRef>
  );
}