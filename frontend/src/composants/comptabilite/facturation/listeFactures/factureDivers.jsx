import React, { useMemo } from 'react';
import styled from 'styled-components';

const THEME = {
  fondCarte: '#1E1E1E',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  fondChamp: '#121212',
  erreur: '#FF5252',
  succes: '#81C784',
};

const TableauFactures = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${THEME.fondCarte};
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${THEME.bordure};

  th, td {
    padding: 1rem;
    text-align: left;
    font-size: 0.85rem;
    border-bottom: 1px solid ${THEME.bordure};
  }

  th {
    background-color: ${THEME.fondChamp};
    color: ${THEME.texteSecondaire};
    text-transform: uppercase;
    font-size: 0.75rem;
  }

  td {
    color: ${THEME.textePrincipal};
  }
`;

const BoutonActionPetit = styled.button`
  background: transparent;
  border: 1px solid ${props => props.$couleur || THEME.bordure};
  color: ${props => props.$couleur || THEME.textePrincipal};
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.$couleur || THEME.textePrincipal};
    color: #000000;
  }
`;

export default function FactureDivers({
  listeFactures = [],
  supprimerFacture,
  formaterDateFr,
  rechercheFacture,
  modePeriode,
  filtreMoisFacture,
  filtreTrimestreFacture,
  filtreAnneeFacture
}) {
  const facturesFiltrees = useMemo(() => {
    return listeFactures.filter(facture => {
      if (facture.type && facture.type !== 'divers') return false;

      if (rechercheFacture) {
        const terme = rechercheFacture.toLowerCase();
        const num = facture.numero ? facture.numero.toLowerCase() : '';
        const loc = facture.locataire ? facture.locataire.toLowerCase() : '';
        if (!num.includes(terme) && !loc.includes(terme)) return false;
      }

      if (facture.dateFacture) {
        const [annee, mois] = facture.dateFacture.split('-');
        const moisNum = parseInt(mois, 10);
        if (filtreAnneeFacture && annee !== filtreAnneeFacture) return false;
        if (modePeriode === 'mois' && filtreMoisFacture && mois !== filtreMoisFacture) return false;
        if (modePeriode === 'trimestre' && filtreTrimestreFacture) {
          if (filtreTrimestreFacture === 'T1' && !(moisNum >= 1 && moisNum <= 3)) return false;
          if (filtreTrimestreFacture === 'T2' && !(moisNum >= 4 && moisNum <= 6)) return false;
          if (filtreTrimestreFacture === 'T3' && !(moisNum >= 7 && moisNum <= 9)) return false;
          if (filtreTrimestreFacture === 'T4' && !(moisNum >= 10 && moisNum <= 12)) return false;
        }
      }

      return true;
    });
  }, [listeFactures, rechercheFacture, modePeriode, filtreMoisFacture, filtreTrimestreFacture, filtreAnneeFacture]);

  return (
    <TableauFactures>
      <thead>
        <tr>
			<th>N° Facture</th>
			<th>Bénéficiaire / Client</th>
			<th>Date</th>
			<th>Montant Divers</th>
			<th>Statut</th>
			<th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {facturesFiltrees.length > 0 ? (
          facturesFiltrees.map((f) => (
            <tr key={f.id}>
              <td>{f.numero || 'N/A'}</td>
              <td>{f.locataire || f.nom || 'N/A'}</td>
              <td>{formaterDateFr && f.dateFacture ? formaterDateFr(f.dateFacture) : f.dateFacture}</td>
              <td>{f.montant !== undefined ? `${f.montant} USD` : 'N/A'}</td>
              <td style={{ color: f.statut === 'Payée' ? THEME.succes : '#FFB74D' }}>{f.statut || 'En attente'}</td>
              <td>
                <BoutonActionPetit $couleur={THEME.erreur} onClick={() => supprimerFacture(f.id)}>
                  Supprimer
                </BoutonActionPetit>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" style={{ textAlign: 'center', padding: '1.5rem' }}>
              Aucune facture diverse trouvée.
            </td>
          </tr>
        )}
      </tbody>
    </TableauFactures>
  );
}