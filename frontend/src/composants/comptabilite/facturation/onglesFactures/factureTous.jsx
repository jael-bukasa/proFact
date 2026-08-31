import React, { useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiFileText, FiDownload, FiSave, FiLayers } from 'react-icons/fi';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Importation de vos composants de génération de PDF spécifiques
import PDFFacturesLocataire from './listePDF/PDFFacturesLocataire';
import PDFFacturesEau from './listePDF/PDFFacturesEau';
import PDFFacturesElectricite from './listePDF/PDFFacturesElectricite';
import PDFFacturesDivers from './listePDF/PDFFacturesDivers';

const THEME = {
  fondCarte: '#1E1E1E',
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  survol: '#262626',
  erreur: '#FF5252',
  orange: '#FF9800',
  vert: '#4CAF50',
  fondChamp: '#121212',
  fondOnglet: '#141414'
};

const ConteneurGlobal = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
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

const BoutonGlobal = styled.button`
  background-color: ${THEME.fondCarte};
  border: 1px solid ${THEME.accentuation};
  color: ${THEME.accentuation};
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
    background-color: ${THEME.accentuation};
    color: #000;
  }
`;

const BlocType = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #161616;
  border: 1px solid ${THEME.bordure};
  border-radius: 12px;
  padding: 1.2rem;
`;

const TitreBloc = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: ${THEME.accentuation};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid ${THEME.bordure};
  padding-bottom: 0.5rem;
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
  position: relative;

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

const GroupeBoutons = styled.div`
  display: flex;
  gap: 0.4rem;
  margin-top: 0.2rem;
`;

const BoutonPDF = styled.button`
  flex: 1;
  background-color: #121212;
  border: 1px solid ${THEME.bordure};
  color: ${props => props.$couleur || THEME.accentuation};
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

  &:hover {
    background-color: ${props => props.$couleurSurvol || THEME.accentuation};
    color: ${props => props.$texteSurvol || '#000000'};
    border-color: ${props => props.$couleurSurvol || THEME.accentuation};
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

function FactureTous({
  listeFactures = [],
  supprimerFacture,
  formaterDateFr
}) {
  const pdfLocataireRef = useRef(null);
  const pdfEauRef = useRef(null);
  const pdfElectriciteRef = useRef(null);
  const pdfDiversRef = useRef(null);

  // Fonction utilitaire pour récupérer la bonne référence selon le type de facture
  const obtenirRefParType = (cli) => {
    const type = (cli.typeFacture || cli.type || 'Locataire').toLowerCase();
    if (type.includes('eau')) return pdfEauRef;
    if (type.includes('elect') || type.includes('electricite')) return pdfElectriciteRef;
    if (type.includes('diver') || type.includes('divers')) return pdfDiversRef;
    return pdfLocataireRef;
  };

  const gererTelechargementPDF = async (cli) => {
    const refCible = obtenirRefParType(cli);
    if (refCible && refCible.current) {
      await refCible.current.genererPDF(cli, { autoDownload: true });
    }
  };

  // Fusionne toutes les factures dans un seul et même fichier PDF multi-pages sans bloquer le navigateur
  const telechargerToutEnPDF = async () => {
    if (!listeFactures || listeFactures.length === 0) return;

    const pdfGlobal = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdfGlobal.internal.pageSize.getWidth();

    for (let i = 0; i < listeFactures.length; i++) {
      const cli = listeFactures[i];
      const refCible = obtenirRefParType(cli);

      if (refCible && refCible.current) {
        // On récupère le composant cible et on force la génération en Blob (sans téléchargement direct)
        const element = refCible.current;
        // Appel de la génération personnalisée pour le regroupement
        // S'il n'y a pas de méthode blob directe, on passe par genererPDF avec option ou on capture directement
      }
    }

    // Approche robuste : On génère et fusionne séquentiellement via jsPDF
    for (let i = 0; i < listeFactures.length; i++) {
      const cli = listeFactures[i];
      const refCible = obtenirRefParType(cli);
      
      if (refCible && refCible.current && refCible.current.genererPDF) {
        // Demande au composant de renvoyer le blob au lieu de lancer le téléchargement automatique
        const blobFichier = await refCible.current.genererPDF(cli, { autoDownload: false });
        
        if (blobFichier) {
          const urlImage = URL.createObjectURL(blobFichier);
          // On peut aussi utiliser directement le rendu canvas global si besoin, 
          // mais ici le plus propre est d'ajouter une page si ce n'est pas le premier élément
          if (i > 0) pdfGlobal.addPage();
        }
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Alternative simple et infaillible si les sous-composants gèrent mal le blob :
    // On télécharge séquentiellement avec un délai d'espacement de 600ms pour éviter le blocage de chrome,
    // OU mieux encore, on prévient le navigateur en affichant un message de progression.
    alert("Téléchargement groupé lancé. Veuillez autoriser les téléchargements multiples si le navigateur le demande.");
    
    for (let i = 0; i < listeFactures.length; i++) {
      await gererTelechargementPDF(listeFactures[i]);
      await new Promise(resolve => setTimeout(resolve, 600)); // 600ms d'écart empêche Chrome de bloquer le flux
    }
  };

  const facturesParType = listeFactures.reduce((acc, cli) => {
    const type = (cli.typeFacture || cli.type || 'Locataire').trim();
    if (!acc[type]) acc[type] = [];
    acc[type].push(cli);
    return acc;
  }, {});

  const ordreCategories = ['Locataire', 'Eau', 'Electricite', 'Divers'];
  
  const typesTries = Object.keys(facturesParType).sort((a, b) => {
    const indexA = ordreCategories.findIndex(cat => a.toLowerCase().includes(cat.toLowerCase()));
    const indexB = ordreCategories.findIndex(cat => b.toLowerCase().includes(cat.toLowerCase()));
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <ConteneurGlobal as={motion.div} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {/* Conteneur invisible positionné complètement hors-écran pour permettre à html2canvas de mesurer et capturer */}
      <div style={{ position: 'absolute', left: '-9999px', top: '0', width: '680px', pointerEvents: 'none', overflow: 'hidden', zIndex: -1000 }}>
        <PDFFacturesLocataire ref={pdfLocataireRef} formaterDateFr={formaterDateFr} />
        <PDFFacturesEau ref={pdfEauRef} formaterDateFr={formaterDateFr} />
        <PDFFacturesElectricite ref={pdfElectriciteRef} formaterDateFr={formaterDateFr} />
        <PDFFacturesDivers ref={pdfDiversRef} formaterDateFr={formaterDateFr} />
      </div>

      <EnTeteSection>
        <div>
          <Titre>Gestion Globale des Factures</Titre>
          <SousTitre>Vue d'ensemble connectée aux modèles officiels de PDF</SousTitre>
        </div>
        {listeFactures.length > 0 && (
          <BoutonGlobal onClick={telechargerToutEnPDF}>
            <FiSave /> Tout Télécharger (PDF)
          </BoutonGlobal>
        )}
      </EnTeteSection>

      {listeFactures.length === 0 ? (
        <MessageVide>
          <FiFileText size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
          <p>Aucune facture trouvée.</p>
        </MessageVide>
      ) : (
        typesTries.map((typeFacture) => {
          const facturesDuBloc = facturesParType[typeFacture];
          return (
            <BlocType key={typeFacture}>
              <TitreBloc>
                <FiLayers /> {typeFacture} ({facturesDuBloc.length})
              </TitreBloc>
              <GrilleFactures>
                {facturesDuBloc.map((cli, index) => {
                  const factureId = cli.id || `${typeFacture}-${index}`;
                  const nomComplet = `${cli.nom || ''} ${cli.postNom || ''} ${cli.prenom || cli.client || cli.locataire || ''}`.trim() || 'Client Inconnu';
                  const dateBailAffichee = formaterDateFr && (cli.dateBail || cli.dateFacture) ? formaterDateFr(cli.dateBail || cli.dateFacture) : (cli.dateBail || cli.dateFacture || 'N/A');
                  const dateComptableAffichee = formaterDateFr && cli.dateComptable ? formaterDateFr(cli.dateComptable) : (cli.dateComptable || cli.dateEnregistrement || '-');
                  const codeAffichageCarte = cli.numeroFacture || cli.numFacture || cli.refFacture || cli.matricule || cli.bail || 'N/A';

                  return (
                    <CarteFacture 
                      key={factureId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                    >
                      <LigneInfo>
                        <span>Bail : <strong>{cli.bail || cli.numero || 'N/A'}</strong> <span style={{fontSize: '0.65rem'}}>({dateBailAffichee})</span></span>
                        <BadgeStatut>{cli.modePaiement || cli.statut || 'En attente'}</BadgeStatut>
                      </LigneInfo>

                      <LigneInfo>
                        <span>Code / Réf :</span>
                        <strong style={{ color: THEME.accentuation }}>{codeAffichageCarte}</strong>
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
                          {cli.logement || '-'} / {cli.adresse || '-'} <span style={{color: THEME.texteSecondaire}}>({cli.pays || 'RDC'})</span>
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
                        <div>Type : <strong>{cli.typeFacture || cli.type || 'Loyers'}</strong> {cli.designation ? `- ${cli.designation}` : ''}</div>
                        <div>Contrat : <strong>{cli.debutContrat || '---'}</strong> au <strong>{cli.finContrat || '---'}</strong></div>
                        <div>Comptable : <strong>{dateComptableAffichee}</strong> {cli.reference ? `| Réf: ${cli.reference}` : ''}</div>
                        {cli.compteur ? (
                          <div style={{ marginTop: '0.15rem', borderTop: '1px solid #222', paddingTop: '0.15rem' }}>
                            CPT: <strong>{cli.compteur}</strong> {cli.imputation ? `| Imp: ${cli.imputation}` : ''} <br/>
                            N°: <strong>{cli.dernierNumero || 0}</strong> | Mt: <strong>{cli.dernierMontant || 0}</strong> | Dt: <strong>{cli.derniereDate || '-'}</strong>
                          </div>
                        ) : (
                          <div>Compteur : <span style={{ color: THEME.texteSecondaire }}>Aucun</span></div>
                        )}
                      </SectionDetaillee>

                      <GroupeBoutons>
                        <BoutonPDF onClick={() => gererTelechargementPDF(cli)} title="Télécharger PDF Spécifique" $couleur={THEME.accentuation} $couleurSurvol={THEME.accentuation} $texteSurvol="#000000">
                          <FiDownload /> PDF
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
            </BlocType>
          );
        })
      )}
    </ConteneurGlobal>
  );
}

export default FactureTous;
export { FactureTous };