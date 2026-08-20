import React, { useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
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
  const pdfRef = useRef(null);

  const telechargerPDFHtml = async (cli) => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    const element = pdfRef.current;
    if (!element) return;

    // Met à jour dynamiquement les données du modèle HTML masqué selon la facture cliquée
    document.getElementById('pdf-id').innerText = cli.id || 'N/A';
    document.getElementById('pdf-matricule').innerText = cli.matricule || cli.numero || 'N/A';
    document.getElementById('pdf-nom').innerText = `${cli.nom || ''} ${cli.postNom || ''} ${cli.prenom || cli.client || cli.locataire || ''}`.trim() || 'Client Inconnu';
    document.getElementById('pdf-bail').innerText = cli.bail || cli.numero || 'N/A';
    document.getElementById('pdf-date-bail').innerText = formaterDateFr && (cli.dateBail || cli.dateFacture) ? formaterDateFr(cli.dateBail || cli.dateFacture) : (cli.dateBail || cli.dateFacture || 'N/A');
    document.getElementById('pdf-logement').innerText = cli.logement || 'N/A';
    document.getElementById('pdf-adresse').innerText = cli.adresse || 'N/A';
    document.getElementById('pdf-pays').innerText = cli.pays || 'RDC';
    document.getElementById('pdf-type').innerText = cli.typeFacture || cli.type || 'Électricité';
    document.getElementById('pdf-designation').innerText = cli.designation || 'N/A';
    document.getElementById('pdf-montant').innerText = `${cli.montant !== undefined ? cli.montant : 0} ${cli.devise || 'USD'}`;
    document.getElementById('pdf-statut').innerText = cli.modePaiement || cli.statut || 'N/A';
    document.getElementById('pdf-reference').innerText = cli.reference || 'Aucune';
    document.getElementById('pdf-mois').innerText = cli.moisFacture || 'N/A';
    document.getElementById('pdf-debut').innerText = cli.debutContrat || 'N/A';
    document.getElementById('pdf-fin').innerText = cli.finContrat || 'N/A';
    document.getElementById('pdf-comptable').innerText = formaterDateFr && cli.dateComptable ? formaterDateFr(cli.dateComptable) : (cli.dateComptable || cli.dateEnregistrement || 'N/A');
    document.getElementById('pdf-compteur').innerText = cli.compteur || 'Aucun';
    document.getElementById('pdf-imputation').innerText = cli.imputation || 'N/A';
    document.getElementById('pdf-dernier-num').innerText = cli.dernierNumero || 0;
    document.getElementById('pdf-dernier-mt').innerText = cli.dernierMontant || 0;
    document.getElementById('pdf-derniere-dt').innerText = cli.derniereDate || 'N/A';
    document.getElementById('pdf-impression').innerText = new Date().toLocaleDateString('fr-FR');

    element.style.display = 'block';

    await doc.html(element, {
      callback: function (docPdf) {
        element.style.display = 'none';
        docPdf.save(`FactureElectricite_${cli.matricule || cli.bail || 'Client'}.pdf`);
      },
      x: 10,
      y: 10,
      width: 190,
      windowWidth: 800
    });
  };

  return (
    <ConteneurSection as={motion.div} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <EnTeteSection>
        <div>
          <Titre>Gestion des Factures d'Électricité</Titre>
          <SousTitre>Suivi détaillé des quittances et compteurs</SousTitre>
        </div>
      </EnTeteSection>

      {/* --- MODÈLE HTML CACHÉ UTILISANT EXCLUSIVEMENT DES TABLEAUX (table, tr, td) POUR LE PDF --- */}
      <div 
        ref={pdfRef} 
        style={{ 
          display: 'none', 
          width: '794px', 
          background: '#ffffff', 
          color: '#000000', 
          padding: '20px', 
          fontFamily: 'Arial, sans-serif', 
          fontSize: '12px',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '5px', color: '#1E1E1E' }}>
          PROFACT - FACTURE D'ÉLECTRICITÉ & FICHE DÉTAILLÉE
        </div>
        <div style={{ fontSize: '10px', color: '#666', marginBottom: '15px' }}>
          Date d'impression : <span id="pdf-impression"></span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
          <thead>
            <tr style={{ backgroundColor: '#1E1E1E', color: '#FFFFFF' }}>
              <th style={{ border: '1px solid #ccc', padding: '8px', width: '40%', textAlign: 'left' }}>Champs / Informations</th>
              <th style={{ border: '1px solid #ccc', padding: '8px', width: '60%', textAlign: 'left' }}>Détails Enregistrés</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ border: '1px solid #ccc', padding: '6px' }}><strong>ID Unique</strong></td><td id="pdf-id" style={{ border: '1px solid #ccc', padding: '6px' }}>-</td></tr>
            <tr><td style={{ border: '1px solid #ccc', padding: '6px' }}><strong>Matricule / Numéro</strong></td><td id="pdf-matricule" style={{ border: '1px solid #ccc', padding: '6px' }}>-</td></tr>
            <tr><td style={{ border: '1px solid #ccc', padding: '6px' }}><strong>Nom Complet</strong></td><td id="pdf-nom" style={{ border: '1px solid #ccc', padding: '6px' }}>-</td></tr>
            <tr><td style={{ border: '1px solid #ccc', padding: '6px' }}><strong>N° de Bail</strong></td><td id="pdf-bail" style={{ border: '1px solid #ccc', padding: '6px' }}>-</td></tr>
            <tr><td style={{ border: '1px solid #ccc', padding: '6px' }}><strong>Date du Bail / Facture</strong></td><td id="pdf-date-bail" style={{ border: '1px solid #ccc', padding: '6px' }}>-</td></tr>
            <tr><td style={{ border: '1px solid #ccc', padding: '6px' }}><strong>Logement</strong></td><td id="pdf-logement" style={{ border: '1px solid #ccc', padding: '6px' }}>-</td></tr>
            <tr><td style={{ border: '1px solid #ccc', padding: '6px' }}><strong>Adresse</strong></td><td id="pdf-adresse" style={{ border: '1px solid #ccc', padding: '6px' }}>-</td></tr>
            <tr><td style={{ border: '1px solid #ccc', padding: '6px' }}><strong>Pays</strong></td><td id="pdf-pays" style={{ border: '1px solid #ccc', padding: '6px' }}>-</td></tr>
            <tr><td style={{ border: '1px solid #ccc', padding: '6px' }}><strong>Type de Facture</strong></td><td id="pdf-type" style={{ border: '1px solid #ccc', padding: '6px' }}>-</td></tr>
            <tr><td style={{ border: '1px solid #ccc', padding: '6px' }}><strong>Désignation</strong></td><td id="pdf-designation" style={{ border: '1px solid #ccc', padding: '6px' }}>-</td></tr>
            <tr><td style={{ border: '1px solid #ccc', padding: '6px' }}><strong>Montant</strong></td><td id="pdf-montant" style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 'bold' }}>-</td></tr>
            <tr><td style={{ border: '1px solid #ccc', padding: '6px' }}><strong>Mode de Paiement / Statut</strong></td><td id="pdf-statut" style={{ border: '1px solid #ccc', padding: '6px' }}>-</td></tr>
            <tr><td style={{ border: '1px solid #ccc', padding: '6px' }}><strong>Référence de Paiement</strong></td><td id="pdf-reference" style={{ border: '1px solid #ccc', padding: '6px' }}>-</td></tr>
            <tr><td style={{ border: '1px solid #ccc', padding: '6px' }}><strong>Mois Facturé</strong></td><td id="pdf-mois" style={{ border: '1px solid #ccc', padding: '6px' }}>-</td></tr>
            <tr><td style={{ border: '1px solid #ccc', padding: '6px' }}><strong>Début du Contrat</strong></td><td id="pdf-debut" style={{ border: '1px solid #ccc', padding: '6px' }}>-</td></tr>
            <tr><td style={{ border: '1px solid #ccc', padding: '6px' }}><strong>Fin du Contrat</strong></td><td id="pdf-fin" style={{ border: '1px solid #ccc', padding: '6px' }}>-</td></tr>
            <tr><td style={{ border: '1px solid #ccc', padding: '6px' }}><strong>Date Comptable / Enregistrement</strong></td><td id="pdf-comptable" style={{ border: '1px solid #ccc', padding: '6px' }}>-</td></tr>
            <tr><td style={{ border: '1px solid #ccc', padding: '6px' }}><strong>Compteur</strong></td><td id="pdf-compteur" style={{ border: '1px solid #ccc', padding: '6px' }}>-</td></tr>
            <tr><td style={{ border: '1px solid #ccc', padding: '6px' }}><strong>Imputation</strong></td><td id="pdf-imputation" style={{ border: '1px solid #ccc', padding: '6px' }}>-</td></tr>
            <tr><td style={{ border: '1px solid #ccc', padding: '6px' }}><strong>Dernier Numéro (Index)</strong></td><td id="pdf-dernier-num" style={{ border: '1px solid #ccc', padding: '6px' }}>-</td></tr>
            <tr><td style={{ border: '1px solid #ccc', padding: '6px' }}><strong>Dernier Montant</strong></td><td id="pdf-dernier-mt" style={{ border: '1px solid #ccc', padding: '6px' }}>-</td></tr>
            <tr><td style={{ border: '1px solid #ccc', padding: '6px' }}><strong>Dernière Date</strong></td><td id="pdf-derniere-dt" style={{ border: '1px solid #ccc', padding: '6px' }}>-</td></tr>
          </tbody>
        </table>
      </div>

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
                  <BoutonPDF onClick={() => telechargerPDFHtml(cli)} title="Télécharger PDF">
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