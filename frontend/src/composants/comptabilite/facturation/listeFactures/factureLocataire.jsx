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
  fondChamp: '#121212',
  vert: '#4CAF50',
  orange: '#FF9800',
  rouge: '#FF5252'
};

const ConteneurFacture = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
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
  background-color: ${props => {
    const s = (props.$statut || '').toLowerCase();
    if (s.includes('payé') || s.includes('réglé')) return 'rgba(76, 175, 80, 0.15)';
    if (s.includes('retard')) return 'rgba(255, 82, 82, 0.15)';
    return 'rgba(255, 152, 0, 0.15)';
  }};
  color: ${props => {
    const s = (props.$statut || '').toLowerCase();
    if (s.includes('payé') || s.includes('réglé')) return THEME.vert;
    if (s.includes('retard')) return THEME.rouge;
    return THEME.orange;
  }};
`;

const GroupeBoutons = styled.div`
  display: flex;
  gap: 0.4rem;
  margin-top: 0.2rem;
`;

const BoutonAction = styled.button`
  flex: 1;
  background-color: ${THEME.fondChamp};
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

  &:hover {
    background-color: ${THEME.accentuation};
    color: #000;
  }
`;

const BoutonSupprimer = styled.button`
  background-color: rgba(255, 82, 82, 0.1);
  border: 1px solid rgba(255, 82, 82, 0.3);
  color: ${THEME.rouge};
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  font-size: 0.73rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${THEME.rouge};
    color: #FFFFFF;
  }
`;

const MessageVide = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${THEME.texteSecondaire};
  font-size: 0.9rem;
  background-color: ${THEME.fondCarte};
  border-radius: 12px;
  border: 1px solid ${THEME.bordure};
`;

export default function FactureLocataire({ listeFactures = [], supprimerFacture }) {
  
  const genererPDFQuittance = (facture, docInstance = null) => {
    const isSingle = !docInstance;
    const doc = docInstance || new jsPDF();
    const nomComplet = `${facture.nom || ''} ${facture.postNom || ''} ${facture.prenom || facture.client || facture.locataire || ''}`.trim() || 'Client Inconnu';
    
    doc.setFontSize(16);
    doc.setTextColor(30, 30, 30);
    doc.text('PROFACT - QUITTANCE DE LOYER', 14, 18);
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Date d'impression : ${new Date().toLocaleDateString('fr-FR')}`, 14, 24);

    autoTable(doc, {
      startY: 30,
      head: [['Champs / Informations', 'Détails Enregistrés']],
      body: [
        ['ID Unique', facture.id || 'N/A'],
        ['N° de Bail', facture.bail || facture.numero || 'N/A'],
        ['Nom Complet', nomComplet],
        ['Logement', facture.logement || 'N/A'],
        ['Adresse', facture.adresse || 'N/A'],
        ['Type de Facture', facture.typeFacture || facture.type || 'Loyer'],
        ['Montant', `${facture.montant !== undefined ? facture.montant : 0} ${facture.devise || 'USD'}`],
        ['Statut / Mode de Paiement', facture.statut || facture.modePaiement || 'Payé'],
        ['Mois Facturé', facture.moisFacture || 'N/A'],
        ['Date de Facture', facture.dateFacture || 'N/A']
      ],
      headStyles: { fillColor: [30, 30, 30], fontSize: 9 },
      bodyStyles: { textColor: [50, 50, 50], fontSize: 8.5 }
    });

    if (isSingle) {
      doc.save(`Quittance_${facture.bail || 'Locataire'}.pdf`);
    }
  };

  const telechargerToutEnPDF = () => {
    const doc = new jsPDF();
    listeFactures.forEach((facture, index) => {
      if (index > 0) doc.addPage();
      genererPDFQuittance(facture, doc);
    });
    doc.save('Toutes_les_Quittances_Completes.pdf');
  };

  const facturesLoyers = listeFactures.filter(f => {
    const type = (f.typeFacture || f.type || '').toLowerCase();
    return type.includes('loyer') || type.includes('locat') || !type;
  });

  return (
    <ConteneurFacture>
      <EnTeteSection>
        <div>
          <Titre>Gestion des Factures & Quittances Locatives</Titre>
          <SousTitre>Suivi des quittances de loyer des clients enregistrés</SousTitre>
        </div>
        {facturesLoyers.length > 0 && (
          <BoutonGlobal onClick={telechargerToutEnPDF}>
            <FiSave /> Tout Télécharger (PDF)
          </BoutonGlobal>
        )}
      </EnTeteSection>

      {facturesLoyers.length > 0 ? (
        <GrilleFactures>
          {facturesLoyers.map((facture, index) => {
            const nomComplet = `${facture.nom || ''} ${facture.postNom || ''} ${facture.prenom || facture.client || facture.locataire || ''}`.trim() || 'Client Inconnu';
            return (
              <CarteFacture 
                key={facture.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.04 }}
              >
                <LigneInfo>
                  <span>Bail : <strong>{facture.bail || facture.numero || 'N/A'}</strong></span>
                  <BadgeStatut $statut={facture.statut || facture.modePaiement || 'Payé'}>
                    {facture.statut || facture.modePaiement || 'Payé'}
                  </BadgeStatut>
                </LigneInfo>

                <LigneInfo>
                  <span>Locataire :</span>
                  <strong style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={nomComplet}>
                    {nomComplet}
                  </strong>
                </LigneInfo>

                <LigneInfo>
                  <span>Logement :</span>
                  <strong style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={facture.logement || 'Non spécifié'}>
                    {facture.logement || 'Non spécifié'}
                  </strong>
                </LigneInfo>

                <LigneInfo>
                  <span>Montant :</span>
                  <strong style={{ color: THEME.accentuation, fontSize: '0.9rem' }}>
                    {facture.montant !== undefined ? `${facture.montant} ${facture.devise || 'USD'}` : '0 USD'}
                  </strong>
                </LigneInfo>

                <LigneInfo>
                  <span>Période :</span>
                  <span>{facture.moisFacture || 'Mois en cours'}</span>
                </LigneInfo>

                <SectionDetaillee>
                  <div>Type : <strong>{facture.typeFacture || facture.type || 'Loyer'}</strong></div>
                  <div>Adresse : <strong>{facture.adresse || 'N/A'}</strong></div>
                  <div>Paiement : <strong>{facture.modePaiement || 'N/A'}</strong></div>
                  <div>Date : <strong>{facture.dateFacture || 'N/A'}</strong></div>
                </SectionDetaillee>

                <GroupeBoutons>
                  <BoutonAction onClick={() => genererPDFQuittance(facture)} title="Télécharger PDF">
                    <FiDownload /> PDF
                  </BoutonAction>
                  {supprimerFacture && (
                    <BoutonSupprimer onClick={() => supprimerFacture(facture.id)} title="Supprimer">
                      Suppr.
                    </BoutonSupprimer>
                  )}
                </GroupeBoutons>
              </CarteFacture>
            );
          })}
        </GrilleFactures>
      ) : (
        <MessageVide>
          <FiFileText size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
          <p>Aucune facture ou quittance de loyer disponible pour le moment.</p>
        </MessageVide>
      )}
    </ConteneurFacture>
  );
}