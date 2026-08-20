import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import { FiFileText, FiDownload, FiSave, FiLayers } from 'react-icons/fi';

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

// Fonction utilitaire pour convertir un nombre en toutes lettres (simple et robuste pour la facture)
function convertirNombreEnLettres(montant) {
  if (isNaN(montant)) return 'ZERO';
  const parts = Number(montant).toFixed(2).split('.');
  const entiers = parts[0];
  // Vous pouvez enrichir si besoin, ici on retourne une approximation ou le montant formaté
  return `${entiers} DOLLARS`;
}

function FactureTous({
  listeFactures = [],
  supprimerFacture,
  formaterDateFr
}) {
  const genererPDFIntégral = (cli, docInstance = null) => {
    const isSingle = !docInstance;
    const doc = docInstance || new jsPDF({ unit: 'mm', format: 'a4' });
    
    const nomComplet = `${cli.nom || ''} ${cli.postNom || ''} ${cli.prenom || cli.client || cli.locataire || ''}`.trim() || 'SOCIETE / CLIENT';
    const dateFactureFormatee = formaterDateFr && (cli.dateBail || cli.dateFacture) ? formaterDateFr(cli.dateBail || cli.dateFacture) : (cli.dateBail || cli.dateFacture || '24/06/2026');
    const moisFacture = (cli.moisFacture || 'JUILLET').toUpperCase();
    const numeroBail = cli.bail || cli.numero || 'B/083/NE';
    const montantTotal = cli.montant !== undefined ? Number(cli.montant).toLocaleString('fr-FR', { minimumFractionDigits: 2 }) : '1.040,00';
    const devise = cli.devise || '$.US';
    const imputation = cli.imputation || '4500/ / L4227100000';

    let y = 15;

    // Titre principal
    doc.setFont('Courier', 'bold');
    doc.setFontSize(14);
    doc.text('F A C T U R E', 105, y, { align: 'center' });
    y += 6;

    // Ligne décorative style machine à écrire
    doc.setFontSize(8);
    doc.text('=================================================================================', 14, y);
    y += 4;

    // En-tête de l'entreprise (SNCC S.A)
    const enteteSociete = [
      'S.N.C.C S.A AVEC CONSEIL D\'ADMINISTRATION',
      'SIEGE SOCIAL: 115, PLACE DE LA GARE, AV',
      'LUMUMBA, C/KAMPEMBA, LUBUMBASHI, B.P.297',
      'RCCM: CD/LSHI/RCCM/14-B-1702',
      'CAPITAL SOCIAL: 650.000.000.000',
      'N° ID.NAT: K09210W   N° IMPOT: A 0700227 F',
      'N° ASS. TVA: 0968/DGI/DGE/DIG/MB/TVA/2011'
    ];

    doc.setFont('Courier', 'normal');
    enteteSociete.forEach((ligne) => {
      doc.text(`! ${ligne.padRight ? ligne : ligne.padEnd(55, ' ')} !`, 14, y);
      // Numéros de droite sur l'en-tête
      if (y === 25) doc.text('010773', 170, y);
      if (y === 29) doc.text('N° 0207/DCO/LOY/2026 !', 135, y);
      if (y === 33) doc.text(`Date: ${dateFactureFormatee} !`, 135, y);
      if (y === 37) doc.text('Code client         !', 135, y);
      y += 4;
    });

    doc.text('=================================================================================', 14, y);
    y += 6;

    // Bloc Société / Client destinataire
    doc.text(`!   SOCIETE : ${nomComplet.padEnd(46, ' ')} !`, 14, y); y += 4;
    doc.text(`!             ${(cli.adresse || 'KINSHASA').padEnd(46, ' ')} !`, 14, y); y += 4;
    doc.text(`!             KINSHASA       / CONGO                        !`, 14, y); y += 4;
    doc.text('=================================================================================', 14, y);
    y += 6;

    // Ligne AF et Mois
    doc.text(`AF : 001                        DOIT : POUR LE MOIS DE ${moisFacture}       2026`, 14, y);
    y += 4;
    doc.text('=================================================================================', 14, y);
    y += 5;

    // Objet
    doc.text(`!   Objet   : ${(`LOCATION IMMOBILIERE - ${cli.logement || 'IMMEUBLE'}`).padEnd(52, ' ')} !`, 14, y);
    y += 5;
    doc.text('=================================================================================', 14, y);
    y += 6;

    doc.text(`                         Facture établie en : ${devise}`, 14, y);
    y += 5;
    doc.text('---------------------------------------------------------------------------------', 14, y);
    y += 5;

    // Tableau Quantité / Désignation / Montant
    doc.text('!  Quantité  !                  Désignation                   !    Montant     !', 14, y);
    y += 4;
    doc.text('---------------------------------------------------------------------------------', 14, y);
    y += 6;

    doc.text(`!            !   LOCATION IMMOBILIER                          !   ${montantTotal.padStart(10, ' ')} !`, 14, y); y += 5;
    doc.text(`!            !   NUMERO DE BAIL     : ${numeroBail.padEnd(19, ' ')} !                !`, 14, y); y += 5;
    doc.text(`!            !   DESIGNATION        : ${(cli.designation || 'LOYER').padEnd(19, ' ')} !                !`, 14, y); y += 5;
    doc.text('!            !                                                !                !', 14, y); y += 5;
    doc.text('!            !                                                !                !', 14, y); y += 6;

    doc.text('---------------------------------------------------------------------------------', 14, y);
    y += 5;
    doc.text(`!   Montant total de la facture                               !   ${montantTotal.padStart(10, ' ')} !`, 14, y);
    y += 5;
    doc.text('---------------------------------------------------------------------------------', 14, y);
    y += 6;

    // Arrêté la présente
    doc.text(`Arrêté la présente à la somme de :`, 14, y); y += 5;
    doc.setFont('Courier', 'bold');
    doc.text(`${convertirNombreEnLettres(cli.montant || 1040)}`, 14, y);
    doc.setFont('Courier', 'normal');
    y += 7;

    doc.text('---------------------------------------------------------------------------------', 14, y);
    y += 5;

    // Conditions et modalités de paiement
    doc.text('Conditions de paiement : Nos factures sont payables', 14, y); y += 4;
    doc.text('------------------------ anticipativement suivant contrat', 50, y); y += 4;
    doc.text('                        de bail, en franc congolais au taux', 50, y); y += 4;
    doc.text('                        bancaire du jour de paiement ou en', 50, y); y += 4;
    doc.text('                        dollar us.', 50, y); y += 5;

    doc.text('Modalité de paiement : Montant à verser dans un de nos comptes', 14, y); y += 4;
    doc.text('---------------------- bancaires ou au bureau des recettes de', 50, y); y += 4;
    doc.text('                        la place', 50, y); y += 5;

    doc.text('Comptes: BCDC N° 00011-00130-00000856147-03 CDF', 14, y); y += 4;
    doc.text('-------       N° 00011-00130-00000856151-88 USD', 14, y); y += 4;
    doc.text('        RAWBANK N° 00016-05130-01002107502-77 CDF', 14, y); y += 4;
    doc.text('        RAWBANK N° 00016-05130-01002107501-80 USD', 14, y); y += 5;
    doc.text('            TMB N° 00017-25000-00015000000-87 CDF', 14, y); y += 4;
    doc.text('            TMB N° 00017-25000-00187750001-35 USD', 14, y); y += 6;

    doc.text('=================================================================================', 14, y);
    y += 5;
    doc.text(`Imputation : ${imputation}`, 14, y);
    y += 4;
    doc.text('=================================================================================', 14, y);
    y += 8;

    // Signatures
    doc.text('Le Chef de service Facturation', 14, y);
    doc.text('Le Directeur', 120, y);
    y += 4;
    doc.text('de la division Facturation', 120, y);

    if (isSingle) {
      doc.save(`Facture_${cli.matricule || cli.bail || 'Loyer'}.pdf`);
    }
  };

  const telechargerToutEnPDF = () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    listeFactures.forEach((cli, index) => {
      if (index > 0) doc.addPage();
      genererPDFIntégral(cli, doc);
    });
    doc.save('Toutes_les_Factures_Officielles.pdf');
  };

  // Regroupement des factures par type
  const facturesParType = listeFactures.reduce((acc, cli) => {
    const type = (cli.typeFacture || cli.type || 'Locataire').trim();
    if (!acc[type]) acc[type] = [];
    acc[type].push(cli);
    return acc;
  }, {});

  // Ordre strict demandé : Locataire, Eau, Electricite, Divers
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
      <EnTeteSection>
        <div>
          <Titre>Gestion Globale des Factures</Titre>
          <SousTitre>Vue d'ensemble conforme au modèle officiel de facturation</SousTitre>
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
                        <span>Matricule :</span>
                        <strong style={{ color: THEME.accentuation }}>{cli.matricule || cli.numero || 'N/A'}</strong>
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
                        <BoutonPDF onClick={() => genererPDFIntégral(cli)} title="Télécharger PDF Officiel" $couleur={THEME.accentuation} $couleurSurvol={THEME.accentuation} $texteSurvol="#000000">
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