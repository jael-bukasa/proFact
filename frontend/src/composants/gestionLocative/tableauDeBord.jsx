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
  background: conic-gradient(
    ${THEME.vert} 0% 55%,
    ${THEME.orange} 55% 75%,
    ${THEME.rouge} 75% 88%,
    ${THEME.bleu} 88% 100%
  );
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

  /* Alignement parfait des colonnes */
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
    if (props.$statut === 'Payé') return 'rgba(76, 175, 80, 0.15)';
    if (props.$statut === 'En retard') return 'rgba(255, 82, 82, 0.15)';
    return 'rgba(255, 152, 0, 0.15)';
  }};
  color: ${props => {
    if (props.$statut === 'Payé') return THEME.vert;
    if (props.$statut === 'En retard') return THEME.rouge;
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

export default function TableauDeBord({ onNouvelleFacture }) {
  const [moisSelectionne] = useState(obtenirMoisCourant());

  const transactions = [
    { locataire: 'Kibwe Masengo', local: 'Appt 4B', montant: '450,00 $', statut: 'Payé' },
    { locataire: 'Jael Bukasa', local: 'Studio 12', montant: '350,00 $', statut: 'Payé' },
    { locataire: 'Alain Kabeya', local: 'Magasin 02', montant: '180,00 $', statut: 'En retard' },
    { locataire: 'Sifa Mwamba', local: 'Appt 1A', montant: '140,00 $', statut: 'En attente' }
  ];

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
      body: transactions.map(item => [item.locataire, item.local, item.montant, item.statut]),
      headStyles: { fillColor: [30, 30, 30] }
    });

    doc.save(`Rapport_ProFact_${moisSelectionne.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <>
      <ConteneurEnTete>
        <SectionTitre>
          <TitrePage>Tableau de bord</TitrePage>
          <SousTitrePage>Aperçu général des loyers perçus et des échéances</SousTitrePage>
        </SectionTitre>
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
          <ValeurCarte>2 450,00 $</ValeurCarte>
          <PiedCarte>
            <BadgeTendance $positif={true}>+12%</BadgeTendance>
            <SousTexteCarte>vs mois dernier</SousTexteCarte>
          </PiedCarte>
        </CarteMetrique>

        <CarteMetrique $couleurBordure={THEME.orange}>
          <EnTeteCarte>
            <TitreCarte>Quittances à Émettre</TitreCarte>
            <IconeWrapper $bg="rgba(255, 152, 0, 0.15)" $couleur={THEME.orange}>📄</IconeWrapper>
          </EnTeteCarte>
          <ValeurCarte>8</ValeurCarte>
          <PiedCarte>
            <SousTexteCarte>83% des contrats actifs</SousTexteCarte>
          </PiedCarte>
        </CarteMetrique>

        <CarteMetrique $couleurBordure={THEME.rouge}>
          <EnTeteCarte>
            <TitreCarte>Impayés / Retards</TitreCarte>
            <IconeWrapper $bg="rgba(255, 82, 82, 0.15)" $couleur={THEME.rouge}>⚠️</IconeWrapper>
          </EnTeteCarte>
          <ValeurCarte style={{ color: THEME.rouge }}>320,00 $</ValeurCarte>
          <PiedCarte>
            <BadgeTendance $positif={false}>2 locataires</BadgeTendance>
            <SousTexteCarte>en retard</SousTexteCarte>
          </PiedCarte>
        </CarteMetrique>
      </GrilleMetriques>

      {/* ROUE DU DÉROULEMENT DES ACTIVITÉS */}
      <BlocContent>
        <TitreBloc>Déroulement des Activités</TitreBloc>
        <ConteneurRoue>
          <RoueGraphique>
            <CentreRoue>
              <ValeurCentre>100%</ValeurCentre>
              <LibelleCentre>12 Opérations</LibelleCentre>
            </CentreRoue>
          </RoueGraphique>

          <LegendeGrille>
            <ArticleLegende>
              <PuceCouleur $couleur={THEME.vert} />
              <div>
                <NomLegende>Encaissements</NomLegende>
                <ValeurLegende>55% (6)</ValeurLegende>
              </div>
            </ArticleLegende>

            <ArticleLegende>
              <PuceCouleur $couleur={THEME.orange} />
              <div>
                <NomLegende>En attente</NomLegende>
                <ValeurLegende>20% (3)</ValeurLegende>
              </div>
            </ArticleLegende>

            <ArticleLegende>
              <PuceCouleur $couleur={THEME.rouge} />
              <div>
                <NomLegende>Retards</NomLegende>
                <ValeurLegende>13% (2)</ValeurLegende>
              </div>
            </ArticleLegende>

            <ArticleLegende>
              <PuceCouleur $couleur={THEME.bleu} />
              <div>
                <NomLegende>Facturés</NomLegende>
                <ValeurLegende>12% (1)</ValeurLegende>
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
              Affichage des 4 derniers
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
              {transactions.map((t, i) => (
                <tr key={i}>
                  <td>{t.locataire}</td>
                  <td>{t.local}</td>
                  <td>{t.montant}</td>
                  <td><BadgeStatut $statut={t.statut}>{t.statut}</BadgeStatut></td>
                </tr>
              ))}
            </tbody>
          </TableauCompact>
        </BlocContent>

        <BlocContent style={{ marginBottom: 0 }}>
          <TitreBloc>Actions Rapides</TitreBloc>
          <ListeActions>
            <BoutonActionRapide onClick={onNouvelleFacture}>
              <span>➕ Nouvelle Facture</span>
              <span>➔</span>
            </BoutonActionRapide>
            <BoutonActionRapide onClick={exporterPDF}>
              <span>📥 Exporter le rapport (PDF)</span>
              <span>➔</span>
            </BoutonActionRapide>
          </ListeActions>
        </BlocContent>
      </GrillePrincipale>
    </>
  );
}