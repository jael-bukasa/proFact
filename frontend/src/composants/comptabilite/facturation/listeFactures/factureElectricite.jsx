import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FiFileText, FiDownload, FiSave } from 'react-icons/fi';

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

function FactureElectricite({
  listeFactures = [],
  supprimerFacture,
  formaterDateFr
}) {
  const genererPDFIntégral = (cli, docInstance = null) => {
    const isSingle = !docInstance;
    const doc = docInstance || new jsPDF();
    
    const nomComplet = `${cli.nom || ''} ${cli.postNom || ''} ${cli.prenom || cli.client || cli.locataire || ''}`.trim() || 'Client Inconnu';
    const dateBailFormatee = formaterDateFr && (cli.dateBail || cli.dateFacture) ? formaterDateFr(cli.dateBail || cli.dateFacture) : (cli.dateBail || cli.dateFacture || 'N/A');
    const dateComptableFormatee = formaterDateFr && cli.dateComptable ? formaterDateFr(cli.dateComptable) : (cli.dateComptable || cli.dateEnregistrement || 'N/A');

    doc.setFontSize(16);
    doc.setTextColor(30, 30, 30);
    doc.text('PROFACT - FACTURE D\'ÉLECTRICITÉ & FICHE DÉTAILLÉE', 14, 18);

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Date d'impression : ${new Date().toLocaleDateString('fr-FR')}`, 14, 24);

    autoTable(doc, {
      startY: 30,
      head: [['Champs / Informations', 'Détails Enregistrés']],
      body: [
        ['ID Unique', cli.id || 'N/A'],
        ['Matricule / Numéro', cli.matricule || cli.numero || 'N/A'],
        ['Nom Complet', nomComplet],
        ['N° de Bail', cli.bail || cli.numero || 'N/A'],
        ['Date du Bail / Facture', dateBailFormatee],
        ['Logement', cli.logement || 'N/A'],
        ['Adresse', cli.adresse || 'N/A'],
        ['Pays', cli.pays || 'RDC'],
        ['Type de Facture', cli.typeFacture || cli.type || 'Électricité'],
        ['Désignation', cli.designation || 'N/A'],
        ['Montant', `${cli.montant !== undefined ? cli.montant : 0} ${cli.devise || 'USD'}`],
        ['Mode de Paiement / Statut', cli.modePaiement || cli.statut || 'N/A'],
        ['Référence de Paiement', cli.reference || 'Aucune'],
        ['Mois Facturé', cli.moisFacture || 'N/A'],
        ['Début du Contrat', cli.debutContrat || 'N/A'],
        ['Fin du Contrat', cli.finContrat || 'N/A'],
        ['Date Comptable / Enregistrement', dateComptableFormatee],
        ['Compteur', cli.compteur || 'Aucun'],
        ['Imputation', cli.imputation || 'N/A'],
        ['Dernier Numéro (Index)', cli.dernierNumero || 0],
        ['Dernier Montant', cli.dernierMontant || 0],
        ['Dernière Date', cli.derniereDate || 'N/A']
      ],
      headStyles: { fillColor: [30, 30, 30], fontSize: 9 },
      bodyStyles: { textColor: [50, 50, 50], fontSize: 8.5 }
    });

    if (isSingle) {
      doc.save(`FactureElectricite_${cli.matricule || cli.bail || 'Client'}.pdf`);
    }
  };

  const telechargerToutEnPDF = () => {
    const doc = new jsPDF();
    listeFactures.forEach((cli, index) => {
      if (index > 0) doc.addPage();
      genererPDFIntégral(cli, doc);
    });
    doc.save('Toutes_les_Factures_Electricite.pdf');
  };

  return (
    <ConteneurSection as={motion.div} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <EnTeteSection>
        <div>
          <Titre>Gestion des Factures d'Électricité</Titre>
          <SousTitre>Suivi détaillé des quittances et compteurs</SousTitre>
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
          <p>Aucune facture d'électricité trouvée.</p>
        </MessageVide>
      ) : (
        <GrilleFactures>
          {listeFactures.map((cli, index) => {
            const nomComplet = `${cli.nom || ''} ${cli.postNom || ''} ${cli.prenom || cli.client || cli.locataire || ''}`.trim() || 'Client Inconnu';
            const dateBailAffichee = formaterDateFr && (cli.dateBail || cli.dateFacture) ? formaterDateFr(cli.dateBail || cli.dateFacture) : (cli.dateBail || cli.dateFacture || 'N/A');
            const dateComptableAffichee = formaterDateFr && cli.dateComptable ? formaterDateFr(cli.dateComptable) : (cli.dateComptable || cli.dateEnregistrement || '-');

            return (
              <CarteFacture 
                key={cli.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.04 }}
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
                  <div>Type : <strong>{cli.typeFacture || cli.type || 'Électricité'}</strong> {cli.designation ? `- ${cli.designation}` : ''}</div>
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
                  <BoutonPDF onClick={() => genererPDFIntégral(cli)} title="Télécharger PDF">
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
      )}
    </ConteneurSection>
  );
}

export default FactureElectricite;
export { FactureElectricite };