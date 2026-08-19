import React from 'react';
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

const ConteneurFactureLocataire = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

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

export default function FactureLocataire({
  listeFactures = [],
  supprimerFacture,
  formaterDateFr
}) {
  return (
    <ConteneurFactureLocataire>
      <TableauFactures>
        <thead>
          <tr>
            <th>N° Facture</th>
            <th>Locataire</th>
            <th>Date</th>
            <th>Montant Loyer</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {listeFactures.length > 0 ? (
            listeFactures.map((f) => (
              <tr key={f.id || f.numero}>
                <td>{f.numero || 'N/A'}</td>
                <td>{f.locataire || f.client || 'N/A'}</td>
                <td>{formaterDateFr && f.dateFacture ? formaterDateFr(f.dateFacture) : f.dateFacture}</td>
                <td>{f.montant !== undefined ? `${f.montant} USD` : 'N/A'}</td>
                <td style={{ color: f.statut === 'Payée' ? THEME.succes : '#FFB74D' }}>
                  {f.statut || 'En attente'}
                </td>
                <td>
                  <BoutonActionPetit $couleur={THEME.erreur} onClick={() => supprimerFacture(f.id)}>
                    Supprimer
                  </BoutonActionPetit>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '1.5rem', color: THEME.texteSecondaire }}>
                Aucune facture de type locataire trouvée.
              </td>
            </tr>
          )}
        </tbody>
      </TableauFactures>
    </ConteneurFactureLocataire>
  );
}