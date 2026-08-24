import React, { useState } from 'react';
import styled from 'styled-components';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const THEME = {
  fondCarte: '#1E1E1E',
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  fondChamp: '#121212',
  rouge: '#FF5252',
  vert: '#4CAF50',
  orange: '#FF9800',
  bleu: '#2196F3'
};

// --- EN-TÊTE ---
const ConteneurEnTete = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SectionTitre = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitrePage = styled.h1`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
`;

const SousTitrePage = styled.p`
  color: ${THEME.texteSecondaire};
  font-size: 0.8rem;
`;

const SelecteurMois = styled.button`
  background-color: ${THEME.fondCarte};
  color: ${THEME.textePrincipal};
  border: 1px solid ${THEME.bordure};
  padding: 0.45rem 0.9rem;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
  text-transform: capitalize;

  &:hover {
    border-color: ${THEME.accentuation};
  }
`;

// --- METRIQUES ---
const GrilleMetriques = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.8rem;
  width: 100%;
  margin-bottom: 1rem;
`;

const CarteMetrique = styled.div`
  background-color: ${THEME.fondCarte};
  border-radius: 10px;
  padding: 0.9rem;
  border: 1px solid ${THEME.bordure};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background-color: ${props => props.$couleurBordure || THEME.accentuation};
  }
`;

const EnTeteCarte = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitreCarte = styled.span`
  color: ${THEME.texteSecondaire};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const IconeWrapper = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background-color: ${props => props.$bg || 'rgba(174, 234, 0, 0.1)'};
  color: ${props => props.$couleur || THEME.accentuation};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
`;

const ValeurCarte = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${THEME.textePrincipal};
  margin: 0.2rem 0;
`;

const PiedCarte = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const BadgeTendance = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  background-color: ${props => props.$positif ? 'rgba(76, 175, 80, 0.15)' : 'rgba(255, 82, 82, 0.15)'};
  color: ${props => props.$positif ? THEME.vert : THEME.rouge};
`;

const SousTexteCarte = styled.span`
  color: ${THEME.texteSecondaire};
  font-size: 0.7rem;
`;

// --- ROUE DES ACTIVITÉS ---
const BlocContent = styled.div`
  background-color: ${THEME.fondCarte};
  border-radius: 10px;
  padding: 0.9rem;
  border: 1px solid ${THEME.bordure};
  margin-bottom: 1rem;
`;

const TitreBloc = styled.h3`
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
  color: ${THEME.textePrincipal};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ConteneurRoue = styled.div`
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    justify-items: center;
  }
`;

const RoueGraphique = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: ${props => props.$gradient || `conic-gradient(${THEME.vert} 0% 100%)`};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CentreRoue = styled.div`
  width: 92px;
  height: 92px;
  background-color: ${THEME.fondCarte};
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ValeurCentre = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${THEME.textePrincipal};
`;

const LibelleCentre = styled.span`
  font-size: 0.6rem;
  color: ${THEME.texteSecondaire};
  text-transform: uppercase;
`;

const LegendeGrille = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 0.6rem;
  width: 100%;
`;

const ArticleLegende = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${THEME.fondChamp};
  padding: 0.45rem 0.6rem;
  border-radius: 6px;
  border: 1px solid ${THEME.bordure};
`;

const PuceCouleur = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.$couleur};
  flex-shrink: 0;
`;

const NomLegende = styled.span`
  font-size: 0.68rem;
  color: ${THEME.texteSecondaire};
  display: block;
`;

const ValeurLegende = styled.span`
  font-size: 0.78rem;
  font-weight: 700;
  color: ${THEME.textePrincipal};
`;

// --- GRILLE PRINCIPALE (TABLEAU & ACTIONS) ---
const GrillePrincipale = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 0.8rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const TableauCompact = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;

  th, td {
    padding: 0.65rem 0.5rem;
  }

  th:nth-child(1), td:nth-child(1) { text-align: left; }
  th:nth-child(2), td:nth-child(2) { text-align: left; }
  th:nth-child(3), td:nth-child(3) { text-align: right; }
  th:nth-child(4), td:nth-child(4) { text-align: center; }

  th {
    color: ${THEME.texteSecondaire};
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.68rem;
    border-bottom: 1px solid ${THEME.bordure};
  }

  td {
    color: ${THEME.textePrincipal};
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const BadgeStatut = styled.span`
  font-size: 0.68rem;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-weight: 600;
  background-color: ${props => {
    const s = (props.$statut || '').toLowerCase();
    if (s.includes('payé') || s.includes('payée') || s.includes('virement') || s.includes('cash')) return 'rgba(76, 175, 80, 0.15)';
    if (s.includes('retard') || s.includes('impayé')) return 'rgba(255, 82, 82, 0.15)';
    return 'rgba(255, 152, 0, 0.15)';
  }};
  color: ${props => {
    const s = (props.$statut || '').toLowerCase();
    if (s.includes('payé') || s.includes('payée') || s.includes('virement') || s.includes('cash')) return THEME.vert;
    if (s.includes('retard') || s.includes('impayé')) return THEME.rouge;
    return THEME.orange;
  }};
`;

const ListeActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const BoutonActionRapide = styled.button`
  background-color: ${THEME.fondChamp};
  border: 1px solid ${THEME.bordure};
  color: ${THEME.textePrincipal};
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-size: 0.78rem;
  transition: all 0.2s;

  &:hover {
    border-color: ${THEME.accentuation};
    color: ${THEME.accentuation};
  }
`;

const obtenirMoisCourant = () => {
  const date = new Date();
  const moisAnnee = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  return moisAnnee.charAt(0).toUpperCase() + moisAnnee.slice(1);
};

export default function TableauDeBord({ listeFactures = [] }) {
  const [moisSelectionne] = useState(obtenirMoisCourant());

  const totalFactures = listeFactures.length;

  // Filtrage robuste basé sur l'état ou le mode de paiement
  const facturesPayees = listeFactures.filter(f => {
    const statut = (f.statut || f.modePaiement || '').toLowerCase();
    return statut.includes('payé') || statut.includes('payée') || statut.includes('virement') || statut.includes('cash') || statut.includes('réglé');
  });

  const facturesRetard = listeFactures.filter(f => {
    const statut = (f.statut || '').toLowerCase();
    return statut.includes('retard') || statut.includes('impayé') || statut.includes('échu');
  });

  const facturesAttente = listeFactures.filter(f => {
    const statut = (f.statut || '').toLowerCase();
    const estPaye = statut.includes('payé') || statut.includes('payée') || statut.includes('virement') || statut.includes('cash') || statut.includes('réglé');
    const estRetard = statut.includes('retard') || statut.includes('impayé') || statut.includes('échu');
    return !estPaye && !estRetard;
  });

  // Sommes financières
  const sommePercue = facturesPayees.reduce((acc, f) => acc + (Number(f.montant) || 0), 0);
  const sommeRetards = facturesRetard.reduce((acc, f) => acc + (Number(f.montant) || 0), 0);

  // Pourcentages pour la roue des activités
  const pPayes = totalFactures > 0 ? (facturesPayees.length / totalFactures) * 100 : 0;
  const pAttente = totalFactures > 0 ? (facturesAttente.length / totalFactures) * 100 : 0;
  const pRetard = totalFactures > 0 ? (facturesRetard.length / totalFactures) * 100 : 0;

  const fin1 = pPayes;
  const fin2 = fin1 + pAttente;
  const fin3 = fin2 + pRetard;

  const gradientRoue = totalFactures > 0 
    ? `conic-gradient(${THEME.vert} 0% ${fin1}%, ${THEME.orange} ${fin1}% ${fin2}%, ${THEME.rouge} ${fin2}% ${fin3}%, ${THEME.bleu} ${fin3}% 100%)`
    : `conic-gradient(${THEME.bordure} 0% 100%)`;

  // Dernières transactions formatées correctement
  const dernieresTransactions = [...listeFactures].reverse().slice(0, 4).map(f => ({
    locataire: `${f.nom || ''} ${f.prenom || f.client || f.locataire || ''}`.trim() || 'Locataire Inconnu',
    local: f.logement || f.adresse || f.local || 'N/A',
    montant: f.montant !== undefined ? `${Number(f.montant).toLocaleString()} ${f.devise || 'USD'}` : '0 USD',
    statut: f.statut || 'En attente'
  }));

  const exporterPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('ProFact - Rapport de Gestion Locative', 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Période : ${moisSelectionne}`, 14, 28);

    autoTable(doc, {
      startY: 40,
      head: [['Locataire', 'Local', 'Montant', 'Statut']],
      body: dernieresTransactions.map(item => [item.locataire, item.local, item.montant, item.statut]),
      headStyles: { fillColor: [30, 30, 30] }
    });

    doc.save(`Rapport_ProFact_${moisSelectionne.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <>
      <ConteneurEnTete>
        <SelecteurMois>
          📅 {moisSelectionne} <span>▼</span>
        </SelecteurMois>
      </ConteneurEnTete>

      <GrilleMetriques>
        <CarteMetrique $couleurBordure={THEME.accentuation}>
          <EnTeteCarte>
            <TitreCarte>Loyers Perçus</TitreCarte>
            <IconeWrapper $bg="rgba(174, 234, 0, 0.15)" $couleur={THEME.accentuation}>💰</IconeWrapper>
          </EnTeteCarte>
          <ValeurCarte>{sommePercue.toLocaleString()} USD</ValeurCarte>
          <PiedCarte>
            <BadgeTendance $positif={true}>+{facturesPayees.length}</BadgeTendance>
            <SousTexteCarte>factures réglées</SousTexteCarte>
          </PiedCarte>
        </CarteMetrique>

        <CarteMetrique $couleurBordure={THEME.orange}>
          <EnTeteCarte>
            <TitreCarte>Quittances / Total</TitreCarte>
            <IconeWrapper $bg="rgba(255, 152, 0, 0.15)" $couleur={THEME.orange}>📄</IconeWrapper>
          </EnTeteCarte>
          <ValeurCarte>{totalFactures}</ValeurCarte>
          <PiedCarte>
            <SousTexteCarte>Total enregistrées</SousTexteCarte>
          </PiedCarte>
        </CarteMetrique>

        <CarteMetrique $couleurBordure={THEME.rouge}>
          <EnTeteCarte>
            <TitreCarte>Impayés / Retards</TitreCarte>
            <IconeWrapper $bg="rgba(255, 82, 82, 0.15)" $couleur={THEME.rouge}>⚠️</IconeWrapper>
          </EnTeteCarte>
          <ValeurCarte style={{ color: THEME.rouge }}>{sommeRetards.toLocaleString()} USD</ValeurCarte>
          <PiedCarte>
            <BadgeTendance $positif={false}>{facturesRetard.length} locataires</BadgeTendance>
            <SousTexteCarte>en retard</SousTexteCarte>
          </PiedCarte>
        </CarteMetrique>
      </GrilleMetriques>

      {/* ROUE DU DÉROULEMENT DES ACTIVITÉS */}
      <BlocContent>
        <TitreBloc>Déroulement des Activités</TitreBloc>
        <ConteneurRoue>
          <RoueGraphique $gradient={gradientRoue}>
            <CentreRoue>
              <ValeurCentre>{totalFactures > 0 ? '100%' : '0%'}</ValeurCentre>
              <LibelleCentre>{totalFactures} Opérations</LibelleCentre>
            </CentreRoue>
          </RoueGraphique>

          <LegendeGrille>
            <ArticleLegende>
              <PuceCouleur $couleur={THEME.vert} />
              <div>
                <NomLegende>Encaissements</NomLegende>
                <ValeurLegende>{Math.round(pPayes)}% ({facturesPayees.length})</ValeurLegende>
              </div>
            </ArticleLegende>

            <ArticleLegende>
              <PuceCouleur $couleur={THEME.orange} />
              <div>
                <NomLegende>En attente</NomLegende>
                <ValeurLegende>{Math.round(pAttente)}% ({facturesAttente.length})</ValeurLegende>
              </div>
            </ArticleLegende>

            <ArticleLegende>
              <PuceCouleur $couleur={THEME.rouge} />
              <div>
                <NomLegende>Retards</NomLegende>
                <ValeurLegende>{Math.round(pRetard)}% ({facturesRetard.length})</ValeurLegende>
              </div>
            </ArticleLegende>

            <ArticleLegende>
              <PuceCouleur $couleur={THEME.bleu} />
              <div>
                <NomLegende>Total Global</NomLegende>
                <ValeurLegende>100% ({totalFactures})</ValeurLegende>
              </div>
            </ArticleLegende>
          </LegendeGrille>
        </ConteneurRoue>
      </BlocContent>

      <GrillePrincipale>
        <BlocContent style={{ marginBottom: 0 }}>
          <TitreBloc>
            Dernières Transactions
            <span style={{ fontSize: '0.7rem', color: THEME.texteSecondaire, fontWeight: 'normal' }}>
              Affichage des derniers enregistrements
            </span>
          </TitreBloc>
          <TableauCompact>
            <thead>
              <tr>
                <th>Locataire</th>
                <th>Local</th>
                <th>Montant</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {dernieresTransactions.length > 0 ? (
                dernieresTransactions.map((t, i) => (
                  <tr key={i}>
                    <td>{t.locataire}</td>
                    <td>{t.local}</td>
                    <td>{t.montant}</td>
                    <td><BadgeStatut $statut={t.statut}>{t.statut}</BadgeStatut></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: THEME.texteSecondaire, padding: '1rem' }}>
                    Aucune transaction récente.
                  </td>
                </tr>
              )}
            </tbody>
          </TableauCompact>
        </BlocContent>

        <BlocContent style={{ marginBottom: 0 }}>
          <TitreBloc>Actions Rapides</TitreBloc>
          <ListeActions>
            <BoutonActionRapide onClick={exporterPDF}>
              <span>📥 Exporter (PDF)</span>
              <span>➔</span>
            </BoutonActionRapide>
          </ListeActions>
        </BlocContent>
      </GrillePrincipale>
    </>
  );
}